import React, {Component} from 'react';
import {Alert, Container} from 'reactstrap';

import Home from './Home';
import About from './About/About';
import Calculator from './Calculator/Calculator';
import Options from './Options/Options';
import Settings from './Settings/Settings';
import {getOriginalServerPort, sendServerRequest, sendServerRequestWithBody} from '../../api/restfulAPI';
import ErrorBanner from './ErrorBanner';

import configSchema from '../../api/schemas/TIPConfigResponseSchema.json';
import distanceSchema from '../../api/schemas/TIPDistanceResponseSchema.json';
import locationsSchema from '../../api/schemas/TIPLocationsResponseSchema.json';
import tripSchema from '../../api/schemas/TIPTripResponseSchema';
import iconred from './images/iconred.png';

/* Renders the application.
 * Holds the destinations and options state shared with the trip.
 */
export default class Application extends Component {
	constructor(props) {
		super(props);
		this.updatePlanOption = this.updatePlanOption.bind(this);
		this.updateClientSetting = this.updateClientSetting.bind(this);
		this.createApplicationPage = this.createApplicationPage.bind(this);
		this.updateItineraryData = this.updateItineraryData.bind(this);
		this.onLocationChange = this.onLocationChange.bind(this);
		this.geolocation = this.geolocation.bind(this);
		this.formatCoordinates = this.formatCoordinates.bind(this);
		
		this.state = {
			serverConfig: null,
			planOptions: {
				units: {'miles': 3959, 'kilometers': 6371, 'nautical miles': 3440},
				activeUnit: 'miles',
				markerSize: [30, 41],
				colorURL: iconred
			},
			clientSettings: {serverPort: getOriginalServerPort()},
			errorMessage: null,
			currentLocation: null,
			
			origin: {latitude: "1", longitude: "1"},
			destination: {latitude: "1", longitude: "1"},
			itineraryData: {places: [], distances: []}
		};
		
		this.updateServerConfig();
	}
	
	render() {
		let pageToRender = this.state.serverConfig ? this.props.page : 'settings';
		
		return (
			<div className='application-width'>
				{this.state.errorMessage}{this.createApplicationPage(pageToRender)}
			</div>
		);
	}
	
	onLocationChange(position, stateVar) {
		let update = {
			latitude: position.latitude.toString(),
			longitude: position.longitude.toString()
		};
		this.setState({
			[stateVar]: update
		})
	}

	createServerObject() {
		const serverObject = {
			'requestType': 'trip',
			'requestVersion': 4,
			'distances': [],
			'options': {
				'title': "Update Distances",
				'earthRadius': this.state.planOptions.units[this.state.planOptions.activeUnit].toString(),
				'optimization': 'none'
			},
			'places': this.state.itineraryData.places
		};
		return serverObject;
	}

	updateItineraryData(data, needDistances = true) {
		if (needDistances===false) {
			this.setState({itineraryData: data})
		}
		else {
			this.setState({
				itineraryData: data
			}, () => {
				const serverObject = this.createServerObject();

				sendServerRequestWithBody('trip', serverObject,
						this.state.clientSettings.serverPort)
				.then((response) => {
					if (response.statusCode >= 200 && response.statusCode <= 299) {
						this.validateApiResponse(response)
						data.distances = response.body.distances;
						this.setState({
							itineraryData: data
						});
					} else {
						//console.log(response.statusText, response.statusCode);
					}
				});
			});
		}
	}
	
	geolocation(stateVar) { // Add a try/catch here
		if (navigator.geolocation) {
			if(stateVar !== 'origin') {
				navigator.geolocation.getCurrentPosition((position) =>
					this.onLocationChange(position.coords, 'currentLocation'));
			} else {
				navigator.geolocation.getCurrentPosition((position) =>
					this.onLocationChange(position.coords, 'origin'));
			}
		}
		else {
			return (
				<Alert color="danger"> Geolocation not supported. </Alert>
			)
		}
	}

	formatCoordinates(rawString, stateVar, returnFormattedCoords = false) {
		if (returnFormattedCoords === false) {
			this.setState({errorMessage: null});
		}
		const Coordinates = require('coordinate-parser');

		try {
			let coords = new Coordinates(rawString);
			let finalState = "destination";

			if (stateVar === 'rawStringO') {
				finalState = 'origin';
			}

			let latFinal = this.formatLatLong(coords.getLatitude(), 90);
			let longFinal = this.formatLatLong(coords.getLongitude(), 180);
			
			if (returnFormattedCoords === true) {
				return {latitude: latFinal.toString(), longitude: longFinal.toString()};
			} else {
				let dict = {latitude: latFinal.toString(), longitude: longFinal.toString()};
				this.setState({[finalState]: dict});
			}
		}
		catch (err) {
			if (!(err.message.includes("Uneven") || err.message.includes("null"))) {
				this.setState({errorMessage: <ErrorBanner statusText="Error with input" message={err.message}/>})
			}
			return 1;
		}
	}

	formatLatLong(coordinate, maxDegrees) {
		let returnCoord = coordinate;
		if (coordinate > 2*maxDegrees || coordinate < -2*maxDegrees) {
			coordinate = coordinate % (2*maxDegrees);
		}
		if (coordinate > maxDegrees) {
			returnCoord = coordinate - (2*maxDegrees);
		}
		if (coordinate < -maxDegrees) {
			returnCoord = coordinate + (2*maxDegrees);
		}
		return returnCoord;
	}
	
	updateClientSetting(field, value) {
		if (field === 'serverPort')
			this.setState({clientSettings: {serverPort: value}}, () => this.updateServerConfig);
		else {
			let newSettings = Object.assign({}, this.state.planOptions);
			newSettings[field] = value;
			this.setState({clientSettings: newSettings});
		}
	}
	
	updatePlanOption(option, value) {
		let optionsCopy = Object.assign({}, this.state.planOptions);
		optionsCopy[option] = value;
		this.setState({'planOptions': optionsCopy});
	}
	
	updateServerConfig() {
		sendServerRequest('config', this.state.clientSettings.serverPort).then(config => {
			console.log(config);
			this.validateApiResponse(config);
			this.processConfigResponse(config);
		});
	}
	
	createErrorBanner(statusText, statusCode, message) {
		return (
			<ErrorBanner statusText={statusText}
			             statusCode={statusCode}
			             message={message}/>
		);
	}
	
	createApplicationPage(pageToRender) {
		switch (pageToRender) {
			
			case 'about':
				return <About options={this.state.planOptions}
				              settings={this.state.clientSettings}
				              createErrorBanner={this.createErrorBanner}/>;
			
			case 'calc':
				return <Calculator currentLocation={this.state.currentLocation}
				                   options={this.state.planOptions}
				                   settings={this.state.clientSettings}
				                   createErrorBanner={this.createErrorBanner}
				                   errorMessage={this.state.errorMessage}
				                   locationOrigin={this.state.origin}
				                   locationDestination={this.state.destination}
				                   geolocation={this.geolocation}
				                   formatCoordinates={this.formatCoordinates}
				                   updateItineraryData={this.updateItineraryData}
								   itineraryData={this.state.itineraryData}
								   validateApiResponse={this.validateApiResponse}
				/>;
			
			case 'options':
				return <Options options={this.state.planOptions}
				                config={this.state.serverConfig}
				                updateOption={this.updatePlanOption}/>;
			case 'settings':
				return <Settings settings={this.state.clientSettings}
				                 serverConfig={this.state.serverConfig}
				                 updateSetting={this.updateClientSetting}/>;
			default:
				return <Home
					locationOrigin={this.state.origin}
					locationDestination={this.state.destination}
					currentLocation={this.state.currentLocation}
					geolocation={this.geolocation}
					options={this.state.planOptions}
				/>;
		}
	}

	
	validateApiResponse(response) {
		var Ajv = require('ajv');
		var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

		switch(response.body.requestType){
			case 'config': var valid = ajv.validate(configSchema, response.body); break;
			case 'distance': var valid = ajv.validate(distanceSchema, response.body); break;
			case 'locations': var valid = ajv.validate(locationsSchema, response.body); break;
			case 'trip': var valid = ajv.validate(tripSchema, response.body); break;
		}

		if (!valid) console.log(ajv.errors);
		else return true;
	}



	processConfigResponse(config) {
		if (config.statusCode >= 200 && config.statusCode <= 299) {
			console.log("Switching to server ", this.state.clientSettings.serverPort);
			this.setState({
				serverConfig: config.body,
				errorMessage: null
			});
		} else {
			this.setState({
				serverConfig: null,
				errorMessage:
					<Container>
						{this.createErrorBanner(config.statusText, config.statusCode,
							`Failed to fetch config from ${this.state.clientSettings.serverPort}. Please choose a valid server.`)}
					</Container>
			});
		}
	}
}
