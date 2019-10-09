import React, {Component} from 'react'
import {Container, Row, Col, Card, CardHeader, CardBody, CardText} from 'reactstrap'
import {Button} from 'reactstrap'
import {Form, Input} from 'reactstrap'
import {sendServerRequestWithBody} from '../../../api/restfulAPI'
import Pane from '../Pane';
import LMap from "../LMap";

export default class Calculator extends Component {
  constructor(props) {
    super(props);

    this.updateLocationState = this.updateLocationState.bind(this);
    this.calculateDistance = this.calculateDistance.bind(this);
    this.createInputField = this.createInputField.bind(this);

    this.state = {
      origin: this.props.locationOrigin,
      destination: this.props.locationDestination,
      rawStringO: {latitude: 0, longitude: 0},
      rawStringD: {latitude: 0, longitude: 0},
      distance: 0,
      errorMessage: this.props.errorMessage
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
              <Row>
                <Col xs={12} sm={12} md={9} lg={9}>
                <LMap currentLocation = {this.props.currentLocation}
                      locationOrigin={this.props.locationOrigin}
                      locationDestination={this.props.locationDestination}/>
                </Col >
                <Col xs={12} sm={12} md={3} lg={3}>
                  <Button color='primary' onClick={() => this.props.geolocation()}>Use My Location</Button>
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
      this.updateLocationState(stateVar, event.target.name, event.target.value, false);
      this.setState({distance : this.state.distance},
          () => this.inputFieldCallback(stateVar)
      );
    };
    let capitalizedCoordinate = coordinate.charAt(0).toUpperCase() + coordinate.slice(1);
    if(stateVar.charAt(9) === 'O' && coordinate === 'latitude' && this.state.origin.latitude !== 1) {
      return (
          <Input name={coordinate} placeholder={capitalizedCoordinate}
                 id={`${stateVar}${capitalizedCoordinate}`}
                 value={this.state.rawStringO.latitude}
                 onChange={updateStateVarOnChange}
                 style={{width: "100%"}}/>
      )
    } else if(stateVar.charAt(9) === 'O' && coordinate === 'longitude' && this.state.origin.longitude !== 1) {
      return (
          <Input name={coordinate} placeholder={capitalizedCoordinate}
                 id={`${stateVar}${capitalizedCoordinate}`}
                 value={this.state.rawStringO.longitude}
                 onChange={updateStateVarOnChange}
                 style={{width: "100%"}}/>
      )
    } else {
      return (
          <Input name={coordinate} placeholder={capitalizedCoordinate}
                 id={`${stateVar}${capitalizedCoordinate}`}

                 onChange={updateStateVarOnChange}
                 style={{width: "100%"}}/>
      )
    }
  }

  inputFieldCallback(stateVar) {
    this.props.formatCoordinates(this.state[stateVar], stateVar); // Update Parent data

    let finalState = '';  // Update local data
    if (stateVar.charAt(9) === 'O') {finalState = 'origin';}
    else {finalState = 'destination';}
    this.setState({[finalState]: finalState === 'origin' ? this.props.locationOrigin : this.props.locationDestination})
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
                  <Button color='primary' onClick={this.calculateDistance}>Calculate</Button>
                </div>}
        />
    );
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

  updateLocationState(stateVar, field, value, currentLocationButton) {
    let location = Object.assign({}, this.state[stateVar]);
    location[field] = value;
    this.setState({[stateVar]: location});
    if (currentLocationButton === true) {
      if (field === 'latitude') {
        this.setState({
          rawStringO: {latitude: value}
        });
      }
      if (field === 'longitude') {
        this.setState({
          rawStringO: {longitude: value}
        });
      }
    }
  }
}
