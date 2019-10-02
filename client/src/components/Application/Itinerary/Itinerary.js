import React, {Component} from 'react'
import {Container, Row, Col, Alert, Card, CardHeader, CardBody, CardText} from 'reactstrap'
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
    }

  }

  render() {
    console.log('Itinerary:', this.state);
    return (
        <Container>
          <Card>
            <CardHeader>Itinerary</CardHeader>   
            <FileInput onFileSelect={this.onFileSelect}/>     
          </Card>
          <Card>
            <ItineraryTable trip={this.state.trip}/>           
          </Card>
        </Container>
    );
  }

  onFileSelect(trip){
    this.setState({trip: trip});
  }

  // {/* // setItineraryData = {this.setItineraryData}/> */}
  // setItineraryData(itineraryData){
  //   this.setState({itineraryData: itineraryData});
  // }

}
