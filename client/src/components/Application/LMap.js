import React, {Component} from 'react';
import {Container, Card} from 'reactstrap';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import {Map, Marker, Popup, TileLayer, Polyline} from 'react-leaflet';
import iconblue from './images/iconblue.png';
import iconblueD from './images/iconblueD.png';
import iconred from './images/iconred.png';
//import icongreen from './images/icongreen.png'
import iconhappy from './images/iconhappy.png'
//import iconflower from './images/iconflower.png'

export default class LMap extends Component {
	constructor(props) {
		super(props);
		
		this.currentLocation = this.currentLocation.bind(this);
	}
	
	render() {
		return (
			<React.Fragment>
				{this.renderMap()}
			</React.Fragment>
		);
	}
	
	renderMap() {
		return (
			<Card>
				{this.renderLeafletMap()}
			</Card>
		);
	}
	
	itineraryComponentSetup() {
		let MarkerArr = [];
		let ItinPolylinepts = [];
		
		let pointArr = this.props.itineraryData.places;
		if (pointArr.length !== 0) {
			for (let i = 0; i < pointArr.length; i++) {
				if (this.props.itineraryData.places[i].checked === true) {
					MarkerArr.push(
						<Marker key={"Marker" + i}
						        position={L.latLng(pointArr[i].latitude, pointArr[i].longitude)}
						        icon={this.markerIcon(iconred)}>
							<Popup className="font-weight-extrabold">
								Destination:<br/>
								{pointArr[i].latitude} Latitude<br/>
								{pointArr[i].longitude} Longitude
							</Popup>
						</Marker>
					);
				}
				ItinPolylinepts.push(
					[pointArr[i].latitude, pointArr[i].longitude]
				);
			}
			ItinPolylinepts.push([pointArr[0].latitude, pointArr[0].longitude]);
			let ItinPolyline = (<Polyline positions={ItinPolylinepts}/>);
			
			return {ItinPolyline: ItinPolyline, MarkerArr: MarkerArr}
		}
	}
	
	calculatorComponentSetup() {
		let OriginCoords = [this.props.locationOrigin.latitude, this.props.locationOrigin.longitude];
		let DestCoords = [this.props.locationDestination.latitude, this.props.locationDestination.longitude];
		let ODPolyline = (
			<Polyline positions={[OriginCoords, DestCoords]}/>
		);
		let originMarker = (
			<Marker position={this.currentLocation()}
			        icon={this.markerIcon(iconblue)}>
				<Popup className="font-weight-extrabold">
					Origin:<br/>
					{this.props.locationOrigin.latitude} Latitude<br/>
					{this.props.locationOrigin.longitude} Longitude
				</Popup>
			</Marker>
		);
		
		let destinationMarker = (
			<Marker position={this.currentDestination()}
			        icon={this.markerIcon(iconblueD)}>
				<Popup className="font-weight-extrabold">
					Destination:<br/>
					{this.props.locationDestination.latitude} Latitude<br/>
					{this.props.locationDestination.longitude} Longitude
				</Popup>
			</Marker>
		);
		return {ODPolyline: ODPolyline, originMarker: originMarker, destinationMarker: destinationMarker};
	}
	
	renderLeafletMap() {
		
		let calculatorComponents = {ODPolyline: null, originMarker: null, destinationMarker: null};
		if (this.props.locationOrigin != null) {
			calculatorComponents = this.calculatorComponentSetup();
		}
		
		let itineraryComponents = {MarkerArr: null, ItinPolyline: null};
		if (this.props.itineraryData != null) {
			if (this.props.itineraryData.length !== 0) {
				itineraryComponents = this.itineraryComponentSetup();
			}
		}
		
		let currentLocationMarker = null;
		
		if (this.props.currentLocation != null) {
			currentLocationMarker = (
				<Marker key={"CurrentLocationMarker"}
				        position={L.latLng(this.props.currentLocation.latitude, this.props.currentLocation.longitude)}
				        icon={this.markerIcon(iconhappy)}>
					<Popup className="font-weight-extrabold">
						Here I am!<br/>
						{this.props.currentLocation.latitude} Latitude<br/>
						{this.props.currentLocation.longitude} Longitude
					</Popup>
				</Marker>
			);
		}
		
		return (
			<Map center={this.csuOvalGeographicCoordinates()} zoom={10}
			     style={{height: 500, maxwidth: 700}}>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				           attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
				
				{currentLocationMarker}
				
				{calculatorComponents.originMarker}
				{calculatorComponents.destinationMarker}
				{calculatorComponents.ODPolyline}
				
				{itineraryComponents != null && itineraryComponents.MarkerArr != null && itineraryComponents.MarkerArr.map(marker => (
					marker
				))}
				{itineraryComponents != null && itineraryComponents.ItinPolyline != null && itineraryComponents.ItinPolyline}
			
			</Map>
		)
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
	
	markerIcon(url = icon) {
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
