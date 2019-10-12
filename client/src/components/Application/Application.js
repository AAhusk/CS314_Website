import React, {Component} from 'react';
import {Alert, Container} from 'reactstrap';

import Home from './Home';
import About from './About/About';
import Calculator from './Calculator/Calculator';
import Itinerary from './Itinerary/Itinerary';
import Options from './Options/Options';
import Settings from './Settings/Settings';
import {getOriginalServerPort, sendServerRequest} from '../../api/restfulAPI';
import ErrorBanner from './ErrorBanner';


/* Renders the application.
 * Holds the destinations and options state shared with the trip.
 */
export default class Application extends Component {
  constructor(props){
    super(props);
    this.updatePlanOption = this.updatePlanOption.bind(this);
    this.updateClientSetting = this.updateClientSetting.bind(this);
    this.createApplicationPage = this.createApplicationPage.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
    this.geolocation = this.geolocation.bind(this);
    this.formatCoordinates = this.formatCoordinates.bind(this);

    this.state = {
      serverConfig: null,
      planOptions: {
        units: {'miles':3959, 'kilometers':6371, 'nautical miles':3440},
        activeUnit: 'miles'
      },
      clientSettings: { serverPort: getOriginalServerPort() },
      errorMessage: null,
      currentLocation: null,

      origin: { latitude: 1, longitude: 1},
      destination: { latitude: 1, longitude: 1}
    };

    this.updateServerConfig();
  }

  render() {
    let pageToRender = this.state.serverConfig ? this.props.page : 'settings';

    return (
      <div className='application-width'>
        { this.state.errorMessage }{ this.createApplicationPage(pageToRender) }
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

  geolocation() { // Add a try/catch here
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) =>
          this.onLocationChange(position.coords, 'currentLocation'));
    }
    else {
      return (
          <Alert color="danger"> Geolocation not supported. </Alert>
      )
    }
  }

  formatCoordinates(rawString, stateVar, returnFormattedCoords = false) { // Input would look like {latitude: '40.123N', longitude: '-74.123W}, "rawStringO"
    // If returnFormattedCoords is false, it just updates the state

    this.setState({errorMessage: null});
    const Coordinates = require('coordinate-parser');
    try {
      let coords = new Coordinates(rawString.latitude + "," + rawString.longitude);
      let finalState = null;

      if (stateVar === 'rawStringO') {finalState = 'origin';}
      else if (stateVar === 'rawStringD') {finalState = 'destination';}
      //else { finalState = null }

      let lat = coords.getLatitude();
      let long = coords.getLongitude();

      while (long < -180) { long += 360; }
      while (long > 180) { long -= 360; }
      while (lat < -90) { lat += 180; }
      while (lat > 90) { lat -= 180; }

      let dict = { latitude: lat, longitude: long };
      this.setState( {[finalState]: dict});

      if (returnFormattedCoords === true) {
        return {latitude: lat, longitude: long};
      }
    }
    catch(err) {
      if(!(err.message.includes("Uneven") || err.message.includes("null"))) {
        this.setState({errorMessage: <ErrorBanner statusText="Error with input" message={err.message}/>})
      }
    }
  }


  updateClientSetting(field, value) {
    if(field === 'serverPort')
      this.setState({clientSettings: {serverPort: value}}, this.updateServerConfig);
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
    switch(pageToRender) {

      case 'about':
        return <About options={this.state.planOptions}
                      settings={this.state.clientSettings}
                      createErrorBanner={this.createErrorBanner}/>;

      case 'calc':
        return <Calculator  currentLocation = {this.state.currentLocation}
                            options={this.state.planOptions}
                            settings={this.state.clientSettings}
                            createErrorBanner={this.createErrorBanner}
                            errorMessage={this.state.errorMessage}
                            locationOrigin = {this.state.origin}
                            locationDestination={this.state.destination}
                            geolocation={this.geolocation}
                            formatCoordinates={this.formatCoordinates}/>;

      case 'itinerary':
        return <Itinerary options={this.state.planOptions}                             
                          settings={this.state.clientSettings}
                          formatCoordinates={this.formatCoordinates}/>;

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
                locationOrigin = {this.state.origin}
                locationDestination = {this.state.destination}
                currentLocation = {this.state.currentLocation}
                geolocation = {this.geolocation}
        />;
    }
  }

  processConfigResponse(config) {
    if(config.statusCode >= 200 && config.statusCode <= 299) {
      console.log("Switching to server ", this.state.clientSettings.serverPort);
      this.setState({
        serverConfig: config.body,
        errorMessage: null
      });
    }
    else {
      this.setState({
        serverConfig: null,
        errorMessage:
          <Container>
            {this.createErrorBanner(config.statusText, config.statusCode,
            `Failed to fetch config from ${ this.state.clientSettings.serverPort}. Please choose a valid server.`)}
          </Container>
      });
    }
  }
}
