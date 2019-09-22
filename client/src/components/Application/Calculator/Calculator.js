import React, {Component} from 'react'
import {Container, Row, Col, Alert, Card, CardHeader, CardBody, CardText} from 'reactstrap'
import {Button} from 'reactstrap'
import {Form, Input} from 'reactstrap'
import {sendServerRequestWithBody} from '../../../api/restfulAPI'
import Pane from '../Pane';

export default class Calculator extends Component {
  constructor(props) {
    super(props);

    this.updateLocationOnChange = this.updateLocationOnChange.bind(this);
    this.geolocationCallback = this.geolocationCallback.bind(this);
    this.calculateDistance = this.calculateDistance.bind(this);
    this.createInputField = this.createInputField.bind(this);

    this.state = {
      origin: {latitude: '', longitude: ''},
      destination: {latitude: '', longitude: ''},
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
                <Col xs={12} sm={6} md={4} lg={3}>
                  {this.createForm('origin')}
                </Col>
                <Col xs={12} sm={6} md={4} lg={3}>
                  {this.createForm('destination')}
                </Col>
                <Col xs={12} sm={6} md={4} lg={3}>
                  {this.createDistance()}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
    );
  }

  /*
  createHeader() {
    return (
        <Container>
          <Pane header={'Calculator'}
                bodyJSX={<div>Determine the distance between the origin and destination.
                  Change the units on the <b>Options</b> page.<br/>
                  <Button color="primary" onClick={() => this.geolocation}>Use my location</Button>
                </div>}/>
        </Container>
    );
  }

*/
/*
  createOriginField() {
    return (
        <Input name={'originLatitude'}
               placeholder={"Latitude"}
               id={"originLatitude"}
               value={this.props.locationOriginLat}
               //onChange={}  // On Change, this data needs to be sent to a parser that deals with the formatting
               // After, that function will send its data to updateLocationOriginState in the format

            location = {
              latitude : #
              longitude: #
            }


        />
    );
  }
*/
  createInputField(stateVar, coordinate) {
    let updateStateVarOnChange = (event) => {
      this.updateLocationOnChange(stateVar, event.target.name, event.target.value)
    };

    let capitalizedCoordinate = coordinate.charAt(0).toUpperCase() + coordinate.slice(1);
    return (
        <Input name={coordinate} placeholder={capitalizedCoordinate}
               id={`${stateVar}${capitalizedCoordinate}`}
               value={this.state[stateVar][coordinate]}
               onChange={updateStateVarOnChange}
               style={{width: "100%"}}/>
    );

  }

  createForm(stateVar) {
    return (
        <Pane header={stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}
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
      this.updateLocationOnChange('origin', 'latitude', position.coords.latitude);
      this.updateLocationOnChange('origin', 'longitude', position.coords.longitude);
      let loc = this.state.origin;
      this.props.onLocationOriginChange(loc);
  }

  formatCoordinates(s1, s2) {
    // Coordinate-parser library parses one string at a time, not two


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

  updateLocationOnChange(stateVar, field, value) {
    let location = Object.assign({}, this.state[stateVar]);
    location[field] = value;
    this.setState({[stateVar]: location});
  }
}
