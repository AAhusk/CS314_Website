import React, {Component} from 'react';
import {Container} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { Map, Marker, Popup, TileLayer} from 'react-leaflet';
import Pane from './Pane'

/*
 * Renders the home page.
 */
export default class LMap extends Component {
  constructor(props) {
    super(props);

    // this.createInputField = this.createInputField.bind(this);
    this.currentLocation = this.currentLocation.bind(this);
  }
  render() {
    return (
      <Container>
        {this.renderMap()}
      </Container>
    );
  }

  renderMap() {
    return (
      <Pane header={'Where Am I?'}
            bodyJSX={this.renderLeafletMap()}/>
    );
  }

  renderLeafletMap() {
    // initial map placement can use either of these approaches:
    // 1: bounds={this.coloradoGeographicBoundaries()}
    // 2: center={this.csuOvalGeographicCoordinates()} zoom={10}
    return (
        // <Map center={this.currentLocation()} zoom={10}
        // <Marker position={this.currentLocation()} zoom={10}
      <Map center={this.csuOvalGeographicCoordinates()} zoom={15}
           style={{height: 500, maxwidth: 700}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                   attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />

        <Marker position={this.currentLocation()}
                icon={this.markerIcon()}>
          <Popup className="font-weight-extrabold">Colorado State University</Popup>
        </Marker>
      </Map>
    )
  }

  renderIntro() {
    return(
      <Pane header={'Bon Voyage!'}
            bodyJSX={'Let us help you plan your next trip.'}/>
    );
  }

  currentLocation() {
    return L.latLng(this.props.locationOriginLat, this.props.locationOriginLong);
  }

  coloradoGeographicBoundaries() {
    // northwest and southeast corners of the state of Colorado
    return L.latLngBounds(L.latLng(41, -109), L.latLng(37, -102));

  }

  csuOvalGeographicCoordinates() {
    return L.latLng(40.576179, -105.080773);
  }

  markerIcon() {
    // react-leaflet does not currently handle default marker icons correctly,
    // so we must create our own
    return L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconAnchor: [12,40]  // for proper placement
    })
  }
}
