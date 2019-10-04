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
            <ItineraryTable itineraryData={this.state.itineraryData}/>           
          </Card>
        </Container>
    );
  }

  onFileSelect(trip, itineraryData){
    this.setState({
      trip: trip,
      itineraryData: itineraryData,
    });
  }
}
