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
		if (this.props.itineraryData.length !== 0) {
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
					{this.props.itineraryData.formattedDestinations != null && this.props.itineraryData.formattedDestinations.map(this.renderTripItinerary)}
					</tbody>
					
					<tbody>
					
					{this.props.itineraryData != null &&
					<tr>
						<th></th>
						<th>Total Distance</th>
						<th>{this.props.totalDistance}</th>
					</tr>
					}
					</tbody>
				</Table>
			);
		}
		return null;
	}
	
	renderTripItinerary(entry, index) {
		return (
			
			<React.Fragment key={"cont" + index}>
				{entry.origin != null &&
				<tr key={index}>
					<td key={"name" + index}>{entry.origin != null && entry.origin.name}</td>
					<td key={"dest" + index}>{entry.destination != null && entry.destination.name}</td>
					<td key={"dist" + index}>{entry.distance != null && entry.distance}</td>
					<td key={"minus" + index}><Button color="danger" className={"float-right"} onClick={() => this.removePlaceFromItineraryData(index)}>-</Button></td>
				</tr>}
			</React.Fragment>
		);
	}
	
	removePlaceFromItineraryData(index) {
		let data = this.props.itineraryData
		data.places.splice(index, 1);
		this.props.updateItineraryData(data);
	}
}
