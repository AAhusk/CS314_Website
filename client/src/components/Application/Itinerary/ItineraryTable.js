import React from 'react';
import {Button, ButtonGroup, Table, Input, Media} from 'reactstrap';
import {sendServerRequestWithBody} from "../../../api/restfulAPI";
import iconredbutton from '../images/iconredbutton.png'
import iconred from '../images/iconred.png'


export default class ItineraryTable extends React.Component {
  constructor(props) {
    super(props);

    this.removePlaceFromItineraryData = this.removePlaceFromItineraryData.bind(this);
    this.renderTripItinerary = this.renderTripItinerary.bind(this);

    this.state = {
      totalDistance: 0,
      forceUpdate: this.props.forceUpdate
    };
  }

  render() {
    if (this.props.itineraryData.places.length > 0) {
      return (
            <Table striped>
              <thead>
              <tr>
                <th style={{width: 0.1 + "em"}}><img src={iconredbutton} style={{cursor: "pointer"}} onClick={() => this.flipCheckBoxes()} alt="Marker" /></th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Distance</th>
                <th></th>
              </tr>
              </thead>

              <tbody>
              {this.props.itineraryData && this.props.itineraryData.places.length > 0 && this.formatItineraryDestinations().map(this.renderTripItinerary)}
              </tbody>

              <tbody>
              {this.renderTotalDistance()}
              </tbody>
            </Table>
      );
    }
    return null;
  }

  renderTotalDistance() {
    return (
          this.props.itineraryData.places.length > 0 &&
          <tr>
            <th/>
            <th/>
            <th>Total Distance</th>
            <th>{this.props.sumTotalDistance(this.props.itineraryData.distances)
            }</th>
          </tr>
    );
  }

  flipCheckBoxes() {
    let data = this.props.itineraryData;

    data.checked = !data.checked;
    let checkBoxes = Array(data.places.length).fill(data.checked);
    data.checkBoxes = checkBoxes;

    for (let i = 0; i < data.places.length; i++) {
      data.places[i].checked = data.checked;
    }

    this.props.updateItineraryData(data);
  }

  formatItineraryDestinations() {
    let formattedDestinations = [];
    let index = this.getPlacesIndices();

    for (let i = 0; i < this.props.itineraryData.places.length; i++) {
      let destination_index = ((i + 1) === this.props.itineraryData.places.length) ? 0 : i + 1;

      let formattedCoordsOrigin = this.props.formatCoordinates(
            `${this.props.itineraryData.places[i].latitude}, ${this.props.itineraryData.places[i].longitude}`, null, true);
      let formattedCoordsDestination = this.props.formatCoordinates(
            `${this.props.itineraryData.places[destination_index].latitude}, ${this.props.itineraryData.places[destination_index].longitude}`, null, true);

      formattedDestinations.push(
            {
              origin: {
                name: this.props.itineraryData.places[i].name,
                latitude: formattedCoordsOrigin.latitude,
                longitude: formattedCoordsOrigin.longitude
              },
              destination: {
                name: this.props.itineraryData.places[destination_index].name,
                latitude: formattedCoordsDestination.latitude,
                longitude: formattedCoordsDestination.longitude
              },
              index: index[i], // New places relative to the original list
              oindex: i,
              checked: this.props.itineraryData.checkBoxes[index[i]]
            });
    }
    return formattedDestinations;
  }

  getPlacesIndices() {
    let placeNames = [];
    for (let i = 0; i < this.props.itineraryData.places.length; i++) {
      placeNames.push(this.props.itineraryData.places[i].name);
    }

    let oldPlaceNames = [];
    for (let i = 0; i < this.props.itineraryData.originalPlaces.length; i++) {
      oldPlaceNames.push(this.props.itineraryData.originalPlaces[i].name);
    }

    let index = [];
    for (let i = 0; i < this.props.itineraryData.originalPlaces.length; i++) {
      index.push(oldPlaceNames.indexOf(placeNames[i]));
    }

    return index;
  }

  renderTripItinerary(entry, index) {

    return (

          <React.Fragment key={"cont" + index}>
            {entry.origin != null &&
            <tr key={index}>
              <td style={{width: 0.1 + "em"}} key={"checkbox" + index}><Input addon type="checkbox" id={"Input" + this.state.forceUpdate} checked={entry.checked} onChange={() => this.checkBoxCallback(entry, index)}/></td>
              <td key={"name" + index}>{entry.origin != null && entry.origin.name}</td>
              <td key={"dest" + index}>{entry.destination != null && entry.destination.name}</td>
              <td key={"dist" + index}>{this.props.itineraryData != null && this.props.itineraryData.distances[index]}</td>
              <td style={{width: 0.1 + "em"}} key={"buttons" + index}>
                <ButtonGroup>
                  <Button outline color="secondary" className={"float-right"} onClick={() => this.movePlace("UP", entry, index)}>↑</Button>
                  <Button outline color="secondary" className={"float-right"} onClick={() => this.movePlace("DN", entry, index)}>↓</Button>
                  <Button color="danger" className={"float-right"} onClick={() => this.removePlaceFromItineraryData(index)}>-</Button>
                </ButtonGroup>
              </td>
            </tr>}
          </React.Fragment>
    );
  }

  checkBoxCallback(entry, index) {
    let data = this.props.itineraryData;

    let checkBoxIndex = index;

    data.places[checkBoxIndex].checked = !data.places[checkBoxIndex].checked;
    data.checkBoxes[entry.index] = !data.checkBoxes[entry.index];

    this.props.updateItineraryData(data);
  }

  removePlaceFromItineraryData(index) {
    let data = this.props.itineraryData;
    data.places.splice(index, 1);
    this.props.updateItineraryData(data);
  }

  movePlace(str, entry, index) {
    let itinData = this.props.itineraryData;
    let temp;

    if ((str === "UP" && index === 0) || (str === "DN" && index === itinData.places.length - 1)) {

    }
    else if (str === "DN") {

      temp = itinData.places[index+1];
      itinData.places[index+1] = itinData.places[index];
      itinData.places[index] = temp;

    }
    else if (str === "UP") {
      temp = itinData.places[index-1];
      itinData.places[index-1] = itinData.places[index];
      itinData.places[index] = temp;
    }

    this.props.updateItineraryData(itinData);


  }
}
