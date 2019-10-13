import React from 'react';
import {Button, Col, Table} from 'reactstrap';
import {sendServerRequestWithBody} from "../../../api/restfulAPI";

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
    //console.log('ItineraryTable: ', this.props, this.state);

    if (this.props.itineraryData == null){
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

          <tbody>
          <Button color='primary' onClick={() => this.myServerRequest()}>Shorten Trip</Button>

          {this.props.itineraryData.map(this.renderTripItinerary)}
          </tbody>    
        </Table>
      );
    }
  }

  myServerRequest() {
      let tipObject = {
          "places":
              [{"name":"Denver",       "latitude": "39.7", "longitude": "-105.0"},
              {"name":"Boulder",      "latitude": "40.0", "longitude": "-105.4"},
              {"name":"Fort Collins", "latitude": "40.6", "longitude": "-105.1"}]
      }

      sendServerRequestWithBody('shorttrip', tipObject, this.props.serverPort)
          .then((response) => {
              if (response.statusCode >= 200 && response.statusCode <= 299) {
                  this.setState({
                      places: response.body.places,
                      errorMessage: null
                  }, () => {console.log(this.state.places)});
              } else {
                  this.setState({
                      errorMessage: this.props.createErrorBanner(
                          response.statusText,
                          response.statusCode,
                          `Request to ${this.props.serverPort} failed.`
                      )
                  });
              }
          });
  }

  renderTripItinerary(entry, index){
    return(
          <tr key={index}>
            <td>{entry.origin.name}</td>
            <td>{entry.destination.name}</td>
            <td>{entry.distance}</td>
          </tr>
    );
  }


}
