import React, { Component } from 'react'
import { Container, Row, Col, Alert } from 'reactstrap'
import { Button } from 'reactstrap'
import { Form, Label, Input } from 'reactstrap'
import { sendServerRequestWithBody } from '../../../api/restfulAPI'
import Pane from '../Pane';

export default class Calculator extends Component {
  constructor(props) {
    super(props);

    this.updateLocationOnChange = this.updateLocationOnChange.bind(this);
    this.updateLocationOriginState = this.updateLocationOriginState.bind(this);
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
        { this.state.errorMessage }
          <Col>
            {this.createHeader()}
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
          </Col>


      </Container>
    );
  }

  createHeader() {
    return (
        <Container>

            <Pane header={'Calculator'}
                  bodyJSX={<div>Determine the distance between the origin and destination.
                      Change the units on the <b>Options</b> page.<br/>
                      <Button color="primary" onClick={() => this.getLocation()}>Use my location</Button>
                  </div>}/>
        </Container>
    );
  }

  createInputField(stateVar, coordinate) {
    let updateStateVarOnChange = (event) => {
      this.updateLocationOnChange(stateVar, event.target.name, event.target.value)};

    let capitalizedCoordinate = coordinate.charAt(0).toUpperCase() + coordinate.slice(1);
    return (
      <Input name={coordinate} placeholder={capitalizedCoordinate}
             id={`${stateVar}${capitalizedCoordinate}`}
             value={this.state[stateVar][coordinate]}
             onChange={updateStateVarOnChange}
             style={{width: "100%"}} />
    );

  }

  createForm(stateVar) {
    return (
      <Pane header={stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}
            bodyJSX={
              <Form >
                {this.createInputField(stateVar, 'latitude')}
                {this.createInputField(stateVar, 'longitude')}
              </Form>
            }
      />);
  }

  createDistance() {
    return(
      <Pane header={'Distance'}
            bodyJSX={
              <div>
              <h5>{this.state.distance} {this.props.options.activeUnit}</h5>
              <Button onClick={this.calculateDistance}>Calculate</Button>
            </div>}
      />
    );
  }


  // Create a button that calls getLocation
  // getLocation passes the data callback to updateLocationState
  // updateLocationState passes the position object from getLocation to a superclass function, onLocationChange
  // onLocationChange takes the inputted position data and setState()'s the new position data
  getLocation() {

    //this.updateLocationOriginState(L.latLng(40.576179, -105.080773))

    if (navigator.geolocation) {
      //console.log("Good data?");
      navigator.geolocation.getCurrentPosition(this.updateLocationOriginState);
      //console.log("Passed");
    } else {
      //console.log("Bad data?");
      return(

          <Alert color="danger" > Geolocation not supported. </Alert>
      )
    }
  }

  updateLocationOriginState(position) {
    //console.log("A");
    this.props.onLocationOriginChange(position);
    //console.log("B");
  }

  calculateDistance() {
    const tipConfigRequest = {
      'type'        : 'distance',
      'version'     : 1,
      'origin'      : this.state.origin,
      'destination' : this.state.destination,
      'earthRadius' : this.props.options.units[this.props.options.activeUnit]
    };

    sendServerRequestWithBody('distance', tipConfigRequest, this.props.settings.serverPort)
      .then((response) => {
        if(response.statusCode >= 200 && response.statusCode <= 299) {
          this.setState({
            distance: response.body.distance,
            errorMessage: null
          });
        }
        else {
          this.setState({
            errorMessage: this.props.createErrorBanner(
                response.statusText,
                response.statusCode,
                `Request to ${ this.props.settings.serverPort } failed.`
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
