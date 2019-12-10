import React, {Component, Fragment} from 'react'
import {Container, Row, Col, ListGroupItem, ListGroup} from 'reactstrap'
import {Input} from 'reactstrap'
import {TextField, IconButton, SvgIcon} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {sendServerRequestWithBody} from '../../../api/restfulAPI'
import LMap from "../LMap";
import Itinerary from "../Itinerary/Itinerary";
import { MyLocation, Add } from '@material-ui/icons';
import filters from "./filters";


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
			useLocation: false,
			suggestedPlaces: [],
			filters: filters,
			selectedFilters: [
					{"name": "type", "values": []},
				{"name": "country", "values": []}
			],
			currentMatch: '',
			numFoundPlaces: null,
			totalToggle: false,
			filterToggle: false,
			DBplace: null,
		};
	}
	
	render() {
		let filters = this.createFilters();
		let showTotal = this.showTotal();
		let DBplaceInfo = this.showDBinfo();

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
					<Col xs={12} sm={12} md={6} lg={3}>
						<ListGroup>
							<ListGroupItem>
								<Row>

									<IconButton title={"Use My Location"} color="primary" onClick={() => this.useMyLocation()}> <MyLocation/> </IconButton>
									{this.createCoordInput("origin")}
								</Row>
							</ListGroupItem>

							<ListGroupItem> {this.createCoordInput("destination")}</ListGroupItem>
							<ListGroupItem>
								<Row>
									{<IconButton title={"Calculate Distance"} color="primary" onClick={this.calculateDistance}>
										<SvgIcon> <path d="M7,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V4A2,2 0 0,1 7,2M7,4V8H17V4H7M7,10V12H9V10H7M11,
										10V12H13V10H11M15,10V12H17V10H15M7,14V16H9V14H7M11,14V16H13V14H11M15,14V16H17V14H15M7,18V20H9V18H7M11,18V20H13V18H11M15,18V20H17V18H15Z"/></SvgIcon>
									</IconButton>}
									<h4 style={{marginTop:'10px', marginLeft:'10px'}}>{`${this.state.distance} ${this.props.options.activeUnit}`}</h4>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									{<IconButton title={"Filter Database"} color="primary" onClick={() => this.toggleFilter()}>
										<SvgIcon> <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,
										4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" /></SvgIcon>
									</IconButton>}
									{this.createInputField("Database Search")}
								</Row>
								<Row>
								{<IconButton title={"Total Results"} color="primary" onClick={() => this.findTotal()}>
									<SvgIcon> <path  d="M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H11V6H4M20,18V6H18.76C19,6.54 18.95,7.07 18.95,7.13C18.88,7.8
									18.41,8.5 18.24,8.75L15.91,11.3L19.23,11.28L19.24,12.5L14.04,12.47L14,11.47C14,11.47 17.05,8.24 17.2,7.95C17.34,7.67 17.91,6 16.5,6C15.27,6.05 15.41,7.3 15.41,7.3L13.87,
									7.31C13.87,7.31 13.88,6.65 14.25,6H13V18H15.58L15.57,17.14L16.54,17.13C16.54,17.13 17.45,16.97 17.46,16.08C17.5,15.08 16.65,15.08 16.5,15.08C16.37,15.08 15.43,15.13 15.43,15.95H13.91C13.91,
									15.95 13.95,13.89 16.5,13.89C19.1,13.89 18.96,15.91 18.96,15.91C18.96,15.91 19,17.16 17.85,17.63L18.37,18H20M8.92,16H7.42V10.2L5.62,10.76V9.53L8.76,8.41H8.92V16Z" /> </SvgIcon>
								</IconButton> }
									{showTotal}
								</Row>
								{filters}
							</ListGroupItem>
							<br></br>
						</ListGroup>
						{DBplaceInfo}
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

	createFilters() {
		if (this.state.filterToggle) {
			return (this.createInputField("Filter"));
		}
	}

	toggleFilter() {
		let filterToggle = this.state.filterToggle;
		this.setState( {filterToggle: !filterToggle})
	}

	showTotal() {
		if (this.state.totalToggle) {
			return (
					<h4 style={{marginTop:'10px', marginLeft:'10px'}}>{this.state.numFoundPlaces} results</h4>
			)
		}
	}

	showDBinfo() {
		if (this.state.DBplace != null) {
			return(
					<ListGroupItem>
						<h4>Place</h4>
						<Row>
							<Col m={6} lg={5}><b>Location</b></Col>
							<Col m={6} lg={3}>{this.state.DBplace.name}</Col>
						</Row>
						<Row>
							<Col m={6} lg={5}><b>Coordinates</b></Col>
							<Col m={6} lg={4}>{Number.parseFloat(this.state.DBplace.latitude).toPrecision(8)}
								 , {Number.parseFloat(this.state.DBplace.longitude).toPrecision(8)}</Col>
						</Row>
						<IconButton size={"small"} title={"Add to Itinerary"} onClick={() => this.addToItinerary()}> <Add/> </IconButton>
					</ListGroupItem>
			);
		}
	}

	useMyLocation() {
		this.props.geolocation('origin');
		this.setState({
			rawStringO: {
				latitude: this.props.locationOrigin.latitude,
				longitude: this.props.locationOrigin.longitude
			},
			useLocation: true
		});
	}

	updateStateVarOnChange(stateVar, event, searchDB = false) {
		if(this.state.useLocation === true) {
			this.setState({useLocation: false});
		}
		if(searchDB) {
			this.setState( {
				totalToggle: false,
				currentMatch: event.target.value
			})
			this.queryDatabase(event.target.value, 27) // origin / destination --- rawString
		}
	};

	setDBplace(value) {
		this.setState( {
			DBplace: value
		});
	}

	setFilters(value) {
		var types = []
		var countries = []
		value.forEach(filter => {
			if(filter.name == "type") {
				types.push(filter.value)
			}
			else if(filter.name == "country") {
				countries.push(filter.value)
			}
		})
		var filtersArray = [
				{"name": "type", "values": types},
				{"name": "country", "values": countries},
		]
		this.setState({
			selectedFilters: filtersArray
		})
	}

	createInputField(stateVar, callback = null) {
		let DBsearch = (stateVar === "Database Search")
			return (
					<Autocomplete
							multiple={DBsearch ? false:true}
							noOptionsText={""}
							id="combo-box"
							style={DBsearch ? {width: '80%', height: '60px'}:{}}
							options={DBsearch ? this.state.suggestedPlaces:this.state.filters}
							getOptionLabel={DBsearch ? options => options.name: options => options.value}
							onChange={DBsearch ? (event, value) => this.setDBplace(value) : (event, value) => this.setFilters(value)}
							renderInput={params => DBsearch ?
									<TextField {...params} label={stateVar}
														 fullWidth onChange={(e) => this.updateStateVarOnChange(stateVar, e, true)}/>
									: <TextField {...params} label={stateVar} fullWidth/>
							}
					/>);
		}

	createCoordInput(stateVar, callback = null) {
		let origin = (stateVar ==='origin')
		if(origin && this.state.useLocation === true) {
			return (
					<Input name={stateVar + "field"}
								 style={origin ? {width:'80%', border:'2px',height:'50px'}:{width:'80%', height:'50px', border:'2px', marginLeft:'34px'}}
								 placeholder={stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}
								 value={this.props.locationOrigin.latitude + ", " + this.props.locationOrigin.longitude}
								 id={`${stateVar}field`}
								 onChange={(e) => (callback == null ? this.updateCoordState(stateVar, e) : callback)}/>
			);
		} else{
			return (
					<Input name={stateVar + "field"}
								 style={origin ? {width:'80%', border:'2px',height:'50px'}:{width:'80%', height:'50px', border:'2px', marginLeft:'34px'}}
								 placeholder={stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}
								 id={`${stateVar}field`}
								 onChange={(e) => (callback == null ? this.updateCoordState(stateVar, e) : callback)}/>
			);
		}
	}
	addToItinerary() {
		let places = this.props.itineraryData.places;
		let addPlace = places.concat(
				{name: this.state.DBplace.name, latitude: this.state.DBplace.latitude, longitude: this.state.DBplace.longitude, checked: true}
		)
		let data = this.props.itineraryData
		data.places = addPlace
		this.props.updateItineraryData(data)
	}

	updateCoordState(stateVar, event) {
		let rawString = event.target.value
		let rawStateName = "rawStringD";
		if (stateVar === "origin") {
			rawStateName = "rawStringO"
		}
		if (!rawString) {rawString = "0N, 0W"}
		this.props.formatCoordinates(rawString, rawStateName);
		this.setState({[rawStateName]: rawString})
	}

	findTotal() {
		this.queryDatabase(this.state.currentMatch, 26, true);
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

	queryDatabase(match, limit, count = false) {
		const tipConfigRequest = {
		    'requestType': 'locations',
		    'requestVersion': 3,
		    "match"          : match,
				"narrow"				 : this.state.selectedFilters,
		    "limit"          : limit,
		    "found"          : 0,
		    "places"         : []
		};
		sendServerRequestWithBody('location', tipConfigRequest, this.props.settings.serverPort)
		    .then((response) => {
				if (response.statusCode >= 200 && response.statusCode <= 299 && count) {
						this.setState({
							numFoundPlaces: response.body.found,
							suggestedPlaces: response.body.places,
							errorMessage: null,
							totalToggle: true
						});
				} else if(response.statusCode >= 200 && response.statusCode <= 299) {
						this.setState( {
							suggestedPlaces: response.body.places,
							errorMessage: null
						});
				} else {
						this.setState({
							errorMessage: this.props.createErrorBanner(
							response.statusText,
							response.statusCode,
							`Request to ${this.props.settings.serverPort} failed.`)
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
