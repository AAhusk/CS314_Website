import React, {Component} from 'react'
import {Container, Row, Col, Alert, Card, CardHeader, CardBody, CardText} from 'reactstrap'
import {Button} from 'reactstrap'
import {Form, Input} from 'reactstrap'
import {sendServerRequestWithBody} from '../../../api/restfulAPI'
import Pane from '../Pane';
import ErrorBanner from "../ErrorBanner";
import LMap from "../LMap";

export default class Calculator extends Component {
  constructor(props) {
    super(props);

    this.updateLocationState = this.updateLocationState.bind(this);
    this.geolocationCallback = this.geolocationCallback.bind(this);
    this.calculateDistance = this.calculateDistance.bind(this);
    this.createInputField = this.createInputField.bind(this);
    this.formatCoordinates = this.formatCoordinates.bind(this);

    this.state = {
      origin: {latitude: this.props.locationOriginLat, longitude: this.props.locationOriginLong},
      destination: {latitude: 0, longitude: 0},
      rawStringO: {latitude: 0, longitude: 0},
      rawStringD: {latitude: 0, longitude: 0},
      distance: 0,
      errorMessage: null
    };
  }

  render() {
    return (
        <Container>
          {this.state.errorMessage}
          <Card>
            <CardHeader>Calculator</CardHeader>
            <CardBody>
              <CardText>Determine the distance between the origin and destination. Change the units on
                the <b>Options</b> page.</CardText>
              <Button color="primary" onClick={() => this.geolocation()}>Use my location</Button>
              <Row>
                <Col xs={12} sm={12} md={9} lg={9}>
                  <LMap locationOriginLat={this.state.origin.latitude}
                        locationOriginLong={this.state.origin.longitude}/>
                </Col >
                <Col xs={12} sm={12} md={3} lg={3}>
                    {this.createForm('rawStringO')}
                    {this.createForm('rawStringD')}
                    {this.createDistance()}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
    );
  }

  createInputField(stateVar, coordinate) {
    let updateStateVarOnChange = (event) => {
      this.updateLocationState(stateVar, event.target.name, event.target.value);

      // Call the formatcoordinates method ONLY after setState has flushed its buffer
      this.setState({distance : this.state.distance},
          () => this.formatCoordinates(this.state[stateVar], stateVar));
    };

    let capitalizedCoordinate = coordinate.charAt(0).toUpperCase() + coordinate.slice(1);
    return (
        <Input name={coordinate} placeholder={capitalizedCoordinate}
               id={`${stateVar}${capitalizedCoordinate}`}

               onChange={updateStateVarOnChange}
               style={{width: "100%"}}/>
    );

  }

  createForm(stateVar) {
    return (
        <Pane header={(stateVar.charAt(9) === 'O') ? 'Origin' : 'Destination'}
              bodyJSX={
                <Form>
                  {this.createInputField(stateVar, 'latitude')}
                  {this.createInputField(stateVar, 'longitude')}
                </Form>
              }
        />);
  }

  createDistance() {
    return (
        <Pane header={'Distance'}
              bodyJSX={
                <div>
                  <h5>{this.state.distance} {this.props.options.activeUnit}</h5>
                  <Button onClick={this.calculateDistance}>Calculate</Button>
                </div>}
        />
    );
  }

  geolocation() { // Add a try/catch here
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.geolocationCallback);
    }
    else {
      return (
          <Alert color="danger"> Geolocation not supported. </Alert>
      )
    }
  }

  geolocationCallback(position) {
    this.updateLocationState('origin', 'latitude', position.coords.latitude);
    this.updateLocationState('origin', 'longitude', position.coords.longitude);
    let loc = this.state.origin;
    this.props.onLocationOriginChange(loc);
  }

  formatCoordinates(rawString, stateVar) { // Input would look like {latitude: '40.123N', longitude: '-74.123W}, "rawStringO"
    this.setState({errorMessage: null});

    const Coordinates = require('coordinate-parser');
    try {
      let coords = new Coordinates(rawString.latitude + "," + rawString.longitude);
      let finalState = '';

      if (stateVar.charAt(9) === 'O') {finalState = 'origin';}
      else {finalState = 'destination';}

      let lat = coords.getLatitude();
      let long = coords.getLongitude();

      while (long < -180) { long += 360; }
      while (long > 180) { long -= 360; }
      while (lat < -90) { lat += 180; }
      while (lat > 90) { lat -= 180; }

      let dict = {
        latitude: lat,
        longitude: long
      };

      this.setState( {[finalState]: dict});

      dict = {
        latitude: lat,
        longitude: long
      };

      this.props.onLocationOriginChange(dict);
    }
    catch(err) {
      if(!(err.message.includes("Uneven") || err.message.includes("null"))) {
        this.setState({errorMessage: <ErrorBanner statusText="Error with input" message={err.message}/>})
      }
    }
  }

  calculateDistance() {
    const tipConfigRequest = {
      'type': 'distance',
      'version': 1,
      'origin': this.state.origin,
      'destination': this.state.destination,
      'earthRadius': this.props.options.units[this.props.options.activeUnit]
    };

    sendServerRequestWithBody('distance', tipConfigRequest, this.props.settings.serverPort)
        .then((response) => {
          if (response.statusCode >= 200 && response.statusCode <= 299) {
            this.setState({
              distance: response.body.distance,
              errorMessage: null
            });
          } else {
            this.setState({
              errorMessage: this.props.createErrorBanner(
                  response.statusText,
                  response.statusCode,
                  `Request to ${this.props.settings.serverPort} failed.`
              )
            });
          }
        });
  }

  updateLocationState(stateVar, field, value) {
    let location = Object.assign({}, this.state[stateVar]);
    location[field] = value;
    this.setState({[stateVar]: location});

  }
}
