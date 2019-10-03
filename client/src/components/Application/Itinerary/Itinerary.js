import React, {Component} from 'react'
import {Container, Card, CardHeader} from 'reactstrap'
import FileInput from './FileInput'
import ItineraryTable from './ItineraryTable'

export default class Itinerary extends Component {
  
  constructor(props) {
    super(props);
    
    this.onFileSelect = this.onFileSelect.bind(this);

    this.state = {
      trip: null,
      itineraryData: null,
    }

  }

  render() {
    //console.log('Itinerary:', this.state);
    return (
        <Container>
          <Card>
            <CardHeader>Itinerary</CardHeader>   
            <FileInput onFileSelect={this.onFileSelect}/>     
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
