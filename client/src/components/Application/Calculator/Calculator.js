import React, {Component, Fragment} from 'react'
import {Container, Row, Col, ListGroupItem, ListGroup, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import {Button} from 'reactstrap'
import {Input} from 'reactstrap'
import {TextField, IconButton, SvgIcon} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {sendServerRequestWithBody} from '../../../api/restfulAPI'
import LMap from "../LMap";
import Itinerary from "../Itinerary/Itinerary";
import { MyLocation } from '@material-ui/icons';

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
			inputOrigin: '',
			inputDest: '',
			distance: 0,
			errorMessage: this.props.errorMessage,
			useLocation: false,
			suggestedPlaces: [],
			numFoundPlaces: 0,
			addModal: {
				toggle: false,
				places: [],
				found: 0
			}
		};
	}
	
	render() {
	    let toggleModal = () => {
	        this.setState({addModal: {
	    	    toggle: !this.state.addModal.toggle,
		    		place: this.state.suggestedPlaces,
		    		found: this.state.numFoundPlaces
	        }});
	    };

        let addPlaceModal = (
            <Modal isOpen={this.state.addModal.toggle} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Search Results</ModalHeader>
                <ModalBody>
                    <h5>Found {this.state.addModal.found} results</h5>
                </ModalBody>
            </Modal>
        );
		return (
			<React.Fragment>
				<Row>
					{this.state.errorMessage}
					<Col xs={12} sm={12} md={9} lg={9}>
						<LMap currentLocation={this.props.currentLocation}
						      locationOrigin={this.props.locationOrigin}
						      locationDestination={this.props.locationDestination}
						      itineraryData={this.props.itineraryData}
						      options={this.props.options}
						/>
					</Col>
					<Col xs={12} sm={12} md={3} lg={3}>
						{addPlaceModal}
						<ListGroup>
							<ListGroupItem>
								<Row>
									<IconButton title={"Use My Location"} onClick={() => this.handleButtonClick()}> <MyLocation/> </IconButton>
									{this.createInputField("origin")}
								</Row>
							</ListGroupItem>

							<ListGroupItem> {this.createInputField("destination")}</ListGroupItem>
							<ListGroupItem>
								<Row>
									{<IconButton title={"Calculate Distance"} onClick={this.calculateDistance}>
										<SvgIcon> <path d="M7,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V4A2,2 0 0,1 7,2M7,4V8H17V4H7M7,10V12H9V10H7M11,
										10V12H13V10H11M15,10V12H17V10H15M7,14V16H9V14H7M11,14V16H13V14H11M15,14V16H17V14H15M7,18V20H9V18H7M11,18V20H13V18H11M15,18V20H17V18H15Z"/></SvgIcon>
									</IconButton>}
									<h4 style={{marginTop:'10px', marginLeft:'10px'}}>{`${this.state.distance} ${this.props.options.activeUnit}`}</h4>
								</Row>
							</ListGroupItem>
							<ListGroupItem> {this.createInputField("database")}</ListGroupItem>
							<Button onClick={toggleModal} className="float-right">Search Database</Button>
                            				<br></br>
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
						   validateApiResponse={this.props.validateApiResponse}
					/>
				</Row>
			</React.Fragment>
		);
	}

	
	async handleButtonClick() {
		await this.props.geolocation('origin');
		this.setState({
			rawStringO: {
				latitude: this.props.locationOrigin.latitude,
				longitude: this.props.locationOrigin.longitude
			},
			inputOrigin: this.props.locationOrigin.latitude + ", " + this.props.locationOrigin.longitude
		});
	}

	updateStateVarOnChange(event, stateVar) {
		if (stateVar === 'origin') {
			this.setState({inputOrigin: event.target.value});
		}
		if (stateVar === 'destination') {
			this.setState({inputDest: event.target.value})
		}
		else {
			this.inputFieldCallback(stateVar, event.target.value); // origin / destination --- rawString
		}
	};

	createInputField(stateVar, callback = null) {
		if (stateVar === 'origin' || stateVar === 'destination') {
			return (this.createCoordInput(stateVar));
		}
		else {
				return (
						<Autocomplete
								freeSolo
								id="combo-box-demo"
								options={this.state.suggestedPlaces}
								getOptionLabel={options => options.name}
								renderInput={params => (
										<TextField {...params} label={"Search"}
															 fullWidth onChange={(e) => (callback == null ? this.updateStateVarOnChange(e, stateVar) : callback)}/>
								)}
						/>
				);
		}
	}
	createCoordInput(stateVar, callback = null) {
		let origin = (stateVar === 'origin');
		return (
				<Input name={stateVar + "field"}
							 style={origin ? {width:'80%', border:'2px',height:'50px'}:{width:'80%', height:'50px', border:'2px', marginLeft:'34px'}}
							 placeholder={stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}
							 value={origin ? this.state.inputOrigin : this.state.inputDest}
							 id={`${stateVar}field`}
							 onChange={(e) => (callback == null ? this.updateStateVarOnChange(e, stateVar) : callback)}/>
		)
	}

	inputFieldCallback(stateVar, rawString) {
		let rawStateName = "rawStringD";
		if (stateVar === "origin") {
			rawStateName = "rawStringO"
		}
		if(!rawString) { rawString = "0N, 0W"}

		// rawString should look like "40N, 108W"
		if(this.hasNumber(rawString)) {
		   this.props.formatCoordinates(rawString, rawStateName);
		   this.setState({[rawStateName]: rawString})
		} else {
		    this.queryDatabase(rawString);
		}
	}

	hasNumber(s) {
	    return /\d/.test(s);
	}
	
	calculateDistance() {
		const tipConfigRequest = {
			'requestType': 'distance',
			'requestVersion': 4,
			'origin': this.props.locationOrigin,
			'destination': this.props.locationDestination,
			'earthRadius': this.props.options.units[this.props.options.activeUnit]
		};
		
		sendServerRequestWithBody('distance', tipConfigRequest, this.props.settings.serverPort)
		.then((response) => {
			if (response.statusCode >= 200 && response.statusCode <= 299) {
				this.props.validateApiResponse(response);
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

	queryDatabase(match) {
		const tipConfigRequest = {
		    'requestType': 'locations',
		    'requestVersion': 3,
		    "match"          : match,
		    "limit"          : 100,
		    "found"          : 0,
		    "places"         : []
		};

		sendServerRequestWithBody('location', tipConfigRequest, this.props.settings.serverPort)
		    .then((response) => {
			if (response.statusCode >= 200 && response.statusCode <= 299) {
			    this.setState({
				numFoundPlaces: response.body.found,
				suggestedPlaces: response.body.places,
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
