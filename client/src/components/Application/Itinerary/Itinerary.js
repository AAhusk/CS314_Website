import React, {Component} from 'react'
import {Container, Card, CardHeader} from 'reactstrap'
import FileInput from './FileInput'
import ItineraryTable from './ItineraryTable'
import LMap from "../LMap";

export default class Itinerary extends Component {
  
  constructor(props) {
    super(props);
    
    this.onFileSelect = this.onFileSelect.bind(this);

    this.state = {
      trip: null,
      itineraryData: null,
      points: null
      // points: { {"latitude": 50, "longitude": 30}, {}, {}, ... }
    }
  }

  render() {
    return (
        <Container>
          <LMap itineraryData={this.state.itineraryData}/>
          <Card>
            <CardHeader>Itinerary</CardHeader>   
            <FileInput  onFileSelect={this.onFileSelect}
                        formatCoordinates={this.props.formatCoordinates}/>
          </Card>
          <Card>
            <ItineraryTable itineraryData={this.state.itineraryData}
                            serverPort={this.props.serverPort}/>
          </Card>
        </Container>
    );
  }

  onFileSelect(trip, itineraryData){
      this.setState({ trip: null, itineraryData: null}, () =>
          this.setState({
              trip: trip,
              itineraryData: itineraryData,
          }) // I want the map markers to un-load before loading new ones on top
      ); // Does this idea work? I'm not sure.
    // this.setState({
    //   trip: trip,
    //   itineraryData: itineraryData,
    // });
  }
}
