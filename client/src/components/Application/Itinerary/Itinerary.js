import React, {Component} from 'react'
import {Container, Card, CardHeader} from 'reactstrap'
import {Row, Button} from 'reactstrap'
import FileInput from './FileInput'
import ItineraryTable from './ItineraryTable'
import LMap from "../LMap";

export default class Itinerary extends Component {
  
  constructor(props) {
    super(props);
    
    this.onFileSelect = this.onFileSelect.bind(this);
    this.errorHandler = this.errorHandler.bind(this);
    this.updateData = this.updateData.bind(this);
    this.createOutputJSON = this.createOutputJSON.bind(this);
    this.createOutputCSV = this.createOutputCSV.bind(this);
    


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
                            totalDistance={this.state.totalDistance}
                            updateData={this.updateData}/>
          </Card>
          <Card>
            <Row>
              <Button href="#" id="TripJSON" className='bg-csu-gold text-white' onClick={() => this.createOutputJSON()}>Export JSON</Button>
              <Button href="#" id="TripCSV" className='bg-csu-gold text-white' onClick={() => this.createOutputCSV()}>Export CSV</Button>
            </Row>
          </Card>
        </Container>
    );
  }


  createOutputJSON() {
     if (this.state.trip == null) {
       this.errorHandler("No file to export", 201);
     }
     else {

       let TIPTrip = {
         "requestType"    : "trip",
         "requestVersion" : 2,
         "options"        : this.state.trip.options,
         "places"         : [],
         "distances"      : []
       }

       let quantityPlaces = this.state.itineraryData.length;
       for (let i=0; i<quantityPlaces; ++i) {
         TIPTrip.places[i] = this.state.itineraryData[i].origin.name;
         TIPTrip.distances[i] = this.state.itineraryData[i].distance;
       }

       let a = document.getElementById("TripJSON");
       let file = new Blob([JSON.stringify(TIPTrip, null, 2)],
           {type: 'application/json'});
       a.href = URL.createObjectURL(file);
       a.download = 'TIPTrip.json';
     }
  }

  createOutputCSV() {
    if (this.state.itineraryData == null) {
      this.errorHandler("No file to export", 202)
    }

    else {
      const TripArray = [[]];
      TripArray[0] = ["Origin", "Destination", "Distance"];


      for (var i = 0; i < this.state.itineraryData.length; ++i) {
        let TripSegment = [this.state.itineraryData[i].origin.name,
          this.state.itineraryData[i].destination.name,
          this.state.itineraryData[i].distance];
        TripArray[i+1] = TripSegment;
      }

      TripArray[TripArray.length-1] = ["", "Total Distance", this.state.totalDistance];

      let TripCSV = "";

      TripArray.forEach(function (rowArray) {
        let row = rowArray.join(",");
        TripCSV += row + "\r\n";
      });


      let downloadCSV = document.getElementById("TripCSV");
      let file = new Blob([TripCSV], {type: 'text/csv'},
          {type: 'application/json'});
      downloadCSV.href = URL.createObjectURL(file);
      downloadCSV.download = 'TIPTrip.csv';
    }
  }

  updateData(state, prop){
      console.log("UpdateData " + state + ": " + prop);
      this.setState({[state]: prop})
  }

  onFileSelect(trip, itineraryData, totalDistance){
      this.setState({ trip: null, itineraryData: null}, () =>
          this.setState({
              trip: trip,
              itineraryData: itineraryData,
              totalDistance: totalDistance
          }) // I want the map markers to un-load before loading new ones on top
      ); // Does this idea work? I'm not sure.
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
