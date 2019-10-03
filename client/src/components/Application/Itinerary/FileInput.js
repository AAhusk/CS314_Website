import React, {Component} from 'react'
import {Card} from 'reactstrap'

const green = '#bef7ba';
const red = '#f7b0b0';
const white = '#ffffff';

export default class FileInput extends Component {
  
  constructor(props) {
    super(props);

    this.fileSelectHandler = this.fileSelectHandler.bind(this);

    this.state = {
      backgroundColor: white,
    }
  }

  render() {
    return (
      <Card style={{backgroundColor: this.state.backgroundColor}}>
        <input type="file" onChange={(event) => this.fileSelectHandler(event)}/>
      </Card>
    );
  }

  fileSelectHandler(event){

    var file_selected =  event.target.files[0];
    var read = new FileReader();
    read.readAsBinaryString(file_selected);
    read.onload = () => {
      
      try{
        let trip = JSON.parse(read.result);
        var itineraryData = this.formatTripData(trip);
        this.setState({ backgroundColor: green });
        this.props.onFileSelect(trip, itineraryData);
      }
      
      catch(err){
        this.setState({ backgroundColor: red });
      }
    }
  }

  formatTripData(trip){
    var itineraryData = [];  
    for(var i=0; i<trip.places.length; i++){

      var destination_index = ((i+1) == trip.places.length) ? 0 : i+1;
  
      itineraryData.push({
        origin: {
          name: trip.places[i].name,
          latitude: trip.places[i].latitude,
          longitude: trip.places[i].longitude
        },
        destination: {
          name: trip.places[destination_index].name,
          latitude: trip.places[destination_index].latitude,
          longitude: trip.places[destination_index].longitude
        },
        distance: trip.distances[i],
      });
    }
  
    return itineraryData;
  }





}
