import React from 'react';
import {Button, Table} from 'reactstrap';
export default class ItineraryTable extends React.Component {
	constructor(props) {
		super(props);
		
		this.removePlaceFromItineraryData = this.removePlaceFromItineraryData.bind(this);
		this.renderTripItinerary = this.renderTripItinerary.bind(this);
		
		this.state = {
			totalDistance: null
		};
	}
	
	render() {
		
		if (this.props.itineraryData.places.length > 0) {
			return (
				<Table striped>
					<thead>
					<tr>
						<th>Origin</th>
						<th>Destination</th>
						<th>Distance</th>
						<th></th>
					</tr>
					</thead>
					
					<tbody>
						{this.props.itineraryData.places.length > 0 && this.formatItineraryDestinations().map(this.renderTripItinerary)}
					</tbody>
					
					<tbody>
					
					{this.props.itineraryData.places.length > 0 &&
					<tr>
						<th></th>
						<th>Total Distance</th>
						<th>{this.props.totalDistance}</th>
					</tr>}
					</tbody>
				</Table>
			);
		}
		return null;
	}
	
	formatItineraryDestinations() {
		let formattedDestinations = [];
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
					}
				});
		}
		return formattedDestinations;
	}
	
	renderTripItinerary(entry, index) {
		return (
			
			<React.Fragment key={"cont" + index}>
				{entry.origin != null &&
				<tr key={index}>
					<td key={"name" + index}>{entry.origin != null && entry.origin.name}</td>
					<td key={"dest" + index}>{entry.destination != null && entry.destination.name}</td>
					<td key={"dist" + index}>{this.props.itineraryData != null && this.props.itineraryData.distances[index]}</td>
					<td key={"minus" + index}><Button color="danger" className={"float-right"} onClick={() => this.removePlaceFromItineraryData(index)}>-</Button></td>
				</tr>}
			</React.Fragment>
		);
	}
	
	removePlaceFromItineraryData(index) {
		let data = this.props.itineraryData;
		data.places.splice(index, 1);
		this.props.updateItineraryData(data);
	}
}
