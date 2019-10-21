import React from 'react';
import {Table} from 'reactstrap';
export default class ItineraryTable extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			itineraryData: this.props.itineraryData,
			totalDistance: null
		};
	}
	
	render() {
		if (this.props.itineraryData != null) {
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
					{this.props.itineraryData.map(this.renderTripItinerary)}
					</tbody>
					
					<tbody>
					<tr>
						<th></th>
						<th>Total Distance</th>
						<th>{this.props.totalDistance}</th>
					</tr>
					</tbody>
				</Table>
			);
		}
		return null;
	}
	
	renderTripItinerary(entry, index) {
		return (
			<tr key={index}>
				<td>{entry.origin.name}</td>
				<td>{entry.destination.name}</td>
				<td>{entry.distance}</td>
			</tr>
		);
	}
}
