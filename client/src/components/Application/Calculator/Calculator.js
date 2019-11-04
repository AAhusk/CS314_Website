import React, {Component} from 'react'
import {Container, Row, Col, ListGroupItem, ListGroup} from 'reactstrap'
import {Button} from 'reactstrap'
import {Input} from 'reactstrap'
import {sendServerRequestWithBody} from '../../../api/restfulAPI'
import LMap from "../LMap";
import Itinerary from "../Itinerary/Itinerary";

export default class Calculator extends Component {
	constructor(props) {
		super(props);
		
		this.updateLocationState = this.updateLocationState.bind(this);
		this.calculateDistance = this.calculateDistance.bind(this);
		this.createInputField = this.createInputField.bind(this);
		
		this.state = {
			origin: this.props.locationOrigin,
			destination: this.props.locationDestination,
			rawStringO: null,
			rawStringD: null,
			distance: 0,
			errorMessage: this.props.errorMessage,
			useLocation: false
		};
	}
	
	render() {
		return (
			<React.Fragment>
				<Row>
					{this.state.errorMessage}
					<Col xs={12} sm={12} md={9} lg={9}>
						<LMap currentLocation={this.props.currentLocation}
						      locationOrigin={this.props.locationOrigin}
						      locationDestination={this.props.locationDestination}
						      itineraryData={this.props.itineraryData}
						/>
					</Col>
					<Col xs={12} sm={12} md={3} lg={3}>
						<ListGroup>
							<ListGroupItem> <Button color='primary' onClick={() => this.handleButtonClick()}>Use My
								Location</Button> </ListGroupItem>
							<ListGroupItem> {this.createInputField("origin")}</ListGroupItem>
							<ListGroupItem> {this.createInputField("destination")}</ListGroupItem>
							<ListGroupItem> {this.createDistance()}</ListGroupItem>
						</ListGroup>
					</Col>
				</Row>
				<hr/>
					{' '}
				<Row>
					<Itinerary options={this.props.options}
					           settings={this.props.settings}
					           createErrorBanner={this.props.createErrorBanner}
					           errorMessage={this.state.errorMessage}
					           updateItineraryData={this.props.updateItineraryData}
					           formatCoordinates={this.props.formatCoordinates}
					           createInputField={this.createInputField}
					           itineraryData={this.props.itineraryData}
					/>
				</Row>
			</React.Fragment>
		);
	}
	
	handleButtonClick() {
		this.props.geolocation('origin');
		this.setState({
			rawStringO: {
				latitude: this.props.locationOrigin.latitude,
				longitude: this.props.locationOrigin.longitude
			},
			useLocation: true
		});
	}
	
	createInputField(stateVar, callback = null) {
		let updateStateVarOnChange = (event) => {
			if(this.state.useLocation === true) { this.setState({useLocation: false}); }
			this.inputFieldCallback(stateVar, event.target.value); // origin / destination --- rawString
		};
		if(stateVar === 'origin' && this.state.useLocation === true) {
			return (
				<Input name={stateVar + "field"}
				       placeholder={stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}
				       value={this.props.locationOrigin.latitude + ", " + this.props.locationOrigin.longitude}
				       id={`${stateVar}field`}
				       onChange={(e) => (callback == null ? updateStateVarOnChange(e) : callback)}/>
			);
		} else{
			return (
				<Input name={stateVar + "field"}
				       placeholder={stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}
				       id={`${stateVar}field`}
				       onChange={(e) => (callback == null ? updateStateVarOnChange(e) : callback)}/>
			);
		}
	}
	
	inputFieldCallback(stateVar, rawString) {
		let rawStateName = "rawStringD";
		if (stateVar === "origin") {
			rawStateName = "rawStringO"
		}
		if(!rawString) { rawString = "0N, 0W"}
		
		// rawString should look like "40N, 108W"
		this.props.formatCoordinates(rawString, rawStateName);
		this.setState({[rawStateName]: rawString})
	}
	
	createDistance() {
		return (
			<Container>
				<Row>
					<Col>
						<Button color='primary' onClick={this.calculateDistance}>Calculate</Button>
					</Col>
					<Col>
						<h5>{`${this.state.distance} ${this.props.options.activeUnit}`}</h5>
					</Col>
				</Row>
			</Container>
		)
	}
	
	calculateDistance() {
		const tipConfigRequest = {
			'type': 'distance',
			'version': 2,
			'origin': this.props.locationOrigin,
			'destination': this.props.locationDestination,
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
