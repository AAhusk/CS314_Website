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
       let TIPTrip = this.state.trip;

       if(TIPTrip.hasOwnProperty('distances')){}

       else {
         let quantityPlaces = this.state.itineraryData.length;
         let distancesArray = [];
         for (let i=0; i<quantityPlaces; ++i) {
           distancesArray.push(this.state.itineraryData[i].distance);
         }
         TIPTrip.distances = distancesArray;
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
      TripArray[0] = ["Name", "Latitude", "Longitude"];
      let id = false, altitude = false, municipality = false, type = false;

      if (this.state.trip.places[0].hasOwnProperty('id')) {
        TripArray[0].push("ID");
        id = true;
      }
      if (this.state.trip.places[0].hasOwnProperty('altitude')) {
        TripArray[0].push("Altitude");
        altitude = true;
      }
      if (this.state.trip.places[0].hasOwnProperty('municipality')) {
        TripArray[0].push("Municipality");
        municipality = true;
      }
      if (this.state.trip.places[0].hasOwnProperty('type')) {
        TripArray[0].push("Type");
        type = true;
      }
      TripArray[0].push("Distance", "Cumulative Distance");

      let cumulativeDistance = 0;

      for (var i = 0; i < this.state.itineraryData.length; ++i) {
        let distance = (i==0) ? 0 : this.state.itineraryData[i-1].distance;
        cumulativeDistance += distance;
        let TripLocation = [this.state.itineraryData[i].origin.name,
          this.state.itineraryData[i].origin.latitude,
          this.state.itineraryData[i].origin.longitude,
         ];
        if (id) {
          TripLocation.push(this.state.trip.places[i].id);
        }
        if (altitude) {
          TripLocation.push(this.state.trip.places[i].altitude);
        }
        if (municipality) {
          TripLocation.push(this.state.trip.places[i].municipality);
        }
        if (type) {
          TripLocation.push(this.state.trip.places[i].type)
        }
        TripLocation.push(distance, cumulativeDistance);
        TripArray[i+1] = TripLocation;
      }

      /*let lastItineraryEntry = this.state.itineraryData[this.state.itineraryData.length-1];
      let distBackToOrigin = lastItineraryEntry.distance;
      let backToStartingLocation = [
        this.state.itineraryData[0].origin.name,
        this.state.itineraryData[0].origin.latitude,
        this.state.itineraryData[0].origin.longitude,
        distBackToOrigin,
        cumulativeDistance + distBackToOrigin
      ];*/
      let backToStartingLocation = TripArray[1].slice(0);
      let lastItineraryEntry = this.state.itineraryData[this.state.itineraryData.length-1];
      backToStartingLocation[backToStartingLocation.length-2] = lastItineraryEntry.distance;
      backToStartingLocation[backToStartingLocation.length-1] = lastItineraryEntry.distance + cumulativeDistance;
      TripArray.push(backToStartingLocation);

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
