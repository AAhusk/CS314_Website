import React from 'react';
import { Table } from 'reactstrap';

export default class ItineraryTable extends React.Component {
  constructor(props) {
    super(props);

    // this.renderTripItinerary = this.renderTripItinerary.bind(this);
    // this.formatTripData = this.formatTripData.bind(this);

    this.state = {
      itineraryData: null
    };
  }
  


  render(){
    console.log('ItineraryTable: ', this.props, this.state);

    if (this.props.trip == null){
      return(null);
    }
  
    else{
      return (
        <Table striped>
          <thead>
            <tr>
              <th>Origin</th>
              <th>Destination</th>
              <th>Distance</th>
            </tr>
          </thead>
        </Table>
      );
    }
  }

  renderTripItinerary(){
    return(
        <thead>
          <tr>
            <th>Origin</th>
            <th>Destination</th>
            <th>Distance</th>
          </tr>
        </thead>
    );
  }
}
