import React, {Component} from 'react'
import {Container, Card, CardHeader, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import {Row, Button} from 'reactstrap'
import FileInput from './FileInput'
import ItineraryTable from './ItineraryTable'
import {sendServerRequestWithBody} from "../../../api/restfulAPI";

export default class Itinerary extends Component {
  
  constructor(props) {
    super(props);
    
    this.onFileSelect = this.onFileSelect.bind(this);
    this.errorHandler = this.errorHandler.bind(this);
    this.createOutputJSON = this.createOutputJSON.bind(this);
    this.createOutputCSV = this.createOutputCSV.bind(this);
    


    this.state = {
      trip: null,
      itineraryData: null,
      totalDistance: null,
      points: null,
      errorMessage: this.props.errorMessage,
    }
  }

  render() {
    return (
        <Container>
          <Card>
            <CardHeader>
                Itinerary
                <Button id="ShortTrip" color='primary' className="float-right" onClick={() => this.shortTripOptimization()}>Shorten Trip</Button>
                <Button id="TripJSON" className='bg-csu-gold text-white float-right' onClick={() => this.createOutputJSON()}>Export JSON</Button>
                <Button id="TripCSV" className='bg-csu-gold text-white float-right' onClick={() => this.createOutputCSV()}>Export CSV</Button>
            </CardHeader>
            <FileInput  onFileSelect={this.onFileSelect}
                        formatCoordinates={this.props.formatCoordinates}
                        settings={this.props.settings}
                        errorHandler={this.errorHandler}/>
          </Card>
          <Card>
            <ItineraryTable itineraryData={this.state.itineraryData}
                            totalDistance={this.state.totalDistance}
            />
          </Card>
        </Container>
    );
  }

    shortTripOptimization() {
        let tipObject = {
            "requestType": "trip",
            "requestVersion": 2,
            "options": {    //  Required in request & response
                "title": "Short Trip",
                "earthRadius": "1337", // Doesn't matter, we dont use this value
                "optimization": "short"
            },
            "places": this.extractPlacesFromItineraryData(),
        };

        sendServerRequestWithBody('trip', tipObject, this.state.serverPort)
            .then((response) => {
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    this.setState({
                        places: response.body.places,
                        errorMessage: null
                    }, () => {
                        this.insertPlacesIntoItineraryData()
                    });
                } else {
                    this.setState({errorMessage: response.statusCode + ": " + response.statusText})
                    //console.log(response.statusCode + response.statusText);
                    // this.setState({
                    //     errorMessage: this.props.createErrorBanner(
                    //         response.statusText,
                    //         response.statusCode,
                    //         `Request to ${this.props.serverPort} failed.`
                    //     )
                    // });
                }
            });
    }

    extractPlacesFromItineraryData() {
        let places = [];
        for (let i = 0; i < this.state.itineraryData.length; i++) {
            places.push(this.state.itineraryData[i].origin);
        }
        return places;
    }

    insertPlacesIntoItineraryData() {
        let places = this.state.places;
        let ItinData = this.state.itineraryData;

        for (let i = 0; i < ItinData.length - 1; i++) {
            ItinData[i].origin = places[i];
            ItinData[i].destination = places[i+1]
        }
        ItinData[this.state.itineraryData.length - 1].origin = places[places.length - 1];
        ItinData[this.state.itineraryData.length - 1].destination = places[0];

        this.setState({itineraryData: ItinData}); // Local data
        this.props.updateItineraryData(ItinData);
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

  onFileSelect(trip, itineraryData, totalDistance){
      this.setState({ trip: null, itineraryData: null}, () =>
          this.setState({
              trip: trip,
              itineraryData: itineraryData,
              totalDistance: totalDistance
          }) // I want the map markers to un-load before loading new ones on top
      ); // Does this idea work? I'm not sure.

      this.props.updateItineraryData(itineraryData);

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
