import React, {Component} from 'react';
import {Container} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';
import Pane from './Pane';
import iconblue from './images/iconblue.png';
import iconblueD from './images/iconblueD.png';

export default class LMap extends Component {
  constructor(props) {
    super(props);

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
    /*
    How to add multiple markers: https://jsfiddle.net/jpxgwfqd/
    Adding polylines as dynamic components: https://react-leaflet.js.org/docs/en/components#polyline

    This is currently compatible with two locations and one line between them. We
    will have to restructure how it works if we want to make it so there
    are many points / many lines.

    Polylines can connect multiple points by just adding another array to the end of its
    positions argument, and we can create more markers by doing something along the lines of
    what i posted in the jsfiddle link above.
     */

    let OriginCoords = [this.props.locationOrigin.latitude, this.props.locationOrigin.longitude];
    let DestCoords = [this.props.locationDestination.latitude, this.props.locationDestination.longitude];

    return (
        // <Map center={this.currentLocation()} zoom={10}
        // <Marker position={this.currentLocation()} zoom={10}
      <Map center={this.csuOvalGeographicCoordinates()} zoom={15}
           style={{height: 500, maxwidth: 700}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                   attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>

         /* Origin Marker */
        <Marker position={this.currentLocation()}
                icon={this.markerIcon(iconblue)}>
          <Popup className="font-weight-extrabold">
            Origin:<br/>
            {this.props.locationOrigin.latitude} Latitude<br/>
            {this.props.locationOrigin.longitude} Longitude
          </Popup>
        </Marker>

        /* Destination Marker */
        <Marker position={this.currentDestination()}
                icon={this.markerIcon(iconblueD)}>
          <Popup className="font-weight-extrabold">
            Destination:<br/>
            {this.props.locationDestination.latitude} Latitude<br/>
            {this.props.locationDestination.longitude} Longitude
          </Popup>
        </Marker>

        <Polyline positions={[OriginCoords, DestCoords]}/>
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
    return L.latLng(this.props.locationOrigin.latitude, this.props.locationOrigin.longitude);
  }

  currentDestination() {
    return L.latLng(this.props.locationDestination.latitude, this.props.locationDestination.longitude);
  }

  coloradoGeographicBoundaries() {
    // northwest and southeast corners of the state of Colorado
    return L.latLngBounds(L.latLng(41, -109), L.latLng(37, -102));

  }

  csuOvalGeographicCoordinates() {
    return L.latLng(40.576179, -105.080773);
  }

  markerIcon(url=icon) {
    // react-leaflet does not currently handle default marker icons correctly,
    // so we must create our own
    return L.icon({
      iconUrl: url,
      iconSize: [30, 41],
      shadowUrl: iconShadow,
      iconAnchor: [15, 41]  // for proper placement
    })
  }
}
