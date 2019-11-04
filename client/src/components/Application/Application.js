import React, {Component} from 'react';
import {Alert, Container} from 'reactstrap';

import Home from './Home';
import About from './About/About';
import Calculator from './Calculator/Calculator';
import Options from './Options/Options';
import Settings from './Settings/Settings';
import {getOriginalServerPort, sendServerRequest, sendServerRequestWithBody} from '../../api/restfulAPI';
import ErrorBanner from './ErrorBanner';


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
				activeUnit: 'miles'
			},
			clientSettings: {serverPort: getOriginalServerPort()},
			errorMessage: null,
			currentLocation: null,
			
			origin: {latitude: 1, longitude: 1},
			destination: {latitude: 1, longitude: 1},
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
			latitude: position.latitude,
			longitude: position.longitude
		};
		this.setState({
			[stateVar]: update
		})
	}
	
	updateItineraryData(data) {
		
		this.setState({
			itineraryData: data
		}, () => {
			
			const serverObject = {
				'requestType': 'trip',
				'requestVersion': 3,
				'distances': [],
				'options': {
					'title': "Update Distances",
					'earthRadius': this.state.planOptions.units[this.state.planOptions.activeUnit],
					'optimization': 'none'
				},
				'places': this.state.itineraryData.places
			};
			
			sendServerRequestWithBody('trip', serverObject, this.state.clientSettings.serverPort)
			.then((response) => {
				if (response.statusCode >= 200 && response.statusCode <= 299) {
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
		// Input would look like "40N, 100W", "rawStringO"
		// If returnFormattedCoords is false, it just updates the state
		
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
			
			let lat = coords.getLatitude();
			let long = coords.getLongitude();
			let latNew = lat;
			let longNew = long;
			
			
			// Compute Latitude & Longitude
			{
				if (lat > 180 || lat < -180) {
					lat = lat % 180;
				}
				if (lat > 90) {
					latNew = 0;
					if (lat % 180 === 0) {
						latNew = 0;
					} else if (lat % 180 > 90) {
						latNew = ((lat % 180) % 90) + -90;
					} else if (lat % 180 < 90) {
						latNew = (lat % 180) + -90;
					} else {
						latNew = 0;
					}
					lat = latNew;
				} else if (lat < -90) {
					lat = -1 * lat;
					latNew = 0;
					if (lat % 180 === 0) {
						latNew = 0;
					} else if (lat % 180 > 90) {
						latNew = -1 * (((lat % 180) % 90) + -90);
					} else if (lat % 180 < 90) {
						latNew = -1 * ((lat % 180) + -90);
					} else {
						latNew = 0;
					}
					lat = latNew;
				}
				
				// Compute Longitude
				if (long > 360 || long < -360) {
					long = long % 360;
				}
				if (long > 180) {
					longNew = 0;
					if (long % 360 === 0) {
						longNew = 0;
					} else if (long % 360 > 180) {
						longNew = (((long % 360) % 180) + -180);
					} else if (long % 360 < 180) {
						longNew = ((long % 360) + -180);
					} else {
						longNew = 0;
					}
					long = longNew;
				} else if (long < -180) {
					long = -1 * long;
					longNew = 0;
					if (long % 360 === 0) {
						longNew = 0;
					} else if (long % 360 > 180) {
						longNew = -1 * (((long % 360) % 180) + -180);
					} else if (long % 360 < 180) {
						longNew = -1 * ((long % 360) + -180);
					} else {
						longNew = 0;
					}
					long = longNew;
				}
			}
			
			if (returnFormattedCoords === true) {
				return {latitude: lat, longitude: long};
			} else {
				let dict = {latitude: lat, longitude: long};
				this.setState({[finalState]: dict});
			}
		} catch (err) {
			if (!(err.message.includes("Uneven") || err.message.includes("null"))) {
				this.setState({errorMessage: <ErrorBanner statusText="Error with input" message={err.message}/>})
			}
			return 1;
		}
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
				/>;
		}
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
