import React, {Component} from 'react'
import {Container, Card, CardHeader} from 'reactstrap'
import FileInput from './FileInput'
import ItineraryTable from './ItineraryTable'
import LMap from "../LMap";

export default class Itinerary extends Component {
  
  constructor(props) {
    super(props);
    
    this.onFileSelect = this.onFileSelect.bind(this);
    this.errorHandler = this.errorHandler.bind(this);

    this.state = {
      trip: null,
      itineraryData: null,
      totalDistance: null,
      points: null,
      // points: { {"latitude": 50, "longitude": 30}, {}, {}, ... }
      errorMessage: this.props.errorMessage
    }
  }

  render() {
    return (
        <Container>
          {/* {this.state.errorMessage} */}
          <LMap itineraryData={this.state.itineraryData}/>
          <Card>
            <CardHeader>Itinerary</CardHeader>   
            <FileInput  onFileSelect={this.onFileSelect}
                        formatCoordinates={this.props.formatCoordinates}
                        settings={this.props.settings}
                        errorHandler={this.errorHandler}/>
          </Card>
          <Card>
            <ItineraryTable itineraryData={this.state.itineraryData}
                            totalDistance={this.state.totalDistance}/>           
          </Card>
        </Container>
    );
  }

  onFileSelect(trip, itineraryData, totalDistance){
      this.setState({ trip: null, itineraryData: null}, () =>
          this.setState({
              trip: trip,
              itineraryData: itineraryData,
              totalDistance: totalDistance
          }) // I want the map markers to un-load before loading new ones on top
      ); // Does this idea work? I'm not sure.
    // this.setState({
    //   trip: trip,
    //   itineraryData: itineraryData,
    // });
  }

  errorHandler(statusText, statusCode){
    this.setState({
      errorMessage: this.props.createErrorBanner(
        statusText,
        statusCode,
        `Request to ${this.props.settings.serverPort} failed.`
      )
    });
  }
}
