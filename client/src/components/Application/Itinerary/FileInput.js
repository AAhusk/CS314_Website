import React, {Component} from 'react'
import {Card} from 'reactstrap'
import {sendServerRequestWithBody} from '../../../api/restfulAPI'

const green = '#bef7ba';
const red = '#f7b0b0';
const white = '#ffffff';

export default class FileInput extends Component {
	
	constructor(props) {
		super(props);
		
		this.fileSelectHandler = this.fileSelectHandler.bind(this);
		this.serverRequest = this.serverRequest.bind(this);
		
		this.state = {
			backgroundColor: white,
			errorMessage: this.props.errorMessage
		}
	}
	
	render() {
		return (
			<Card style={{backgroundColor: this.state.backgroundColor}}>
				<input type="file" onChange={(event) => this.fileSelectHandler(event)}/>
			</Card>
		);
	}
	
	fileSelectHandler(event) {
		
		var file_selected = event.target.files[0];
		var read = new FileReader();
		read.readAsBinaryString(file_selected);
		read.onload = () => {
			try {
				let trip = JSON.parse(read.result);
				this.serverRequest(trip);
			} catch (err) {
				this.setState({backgroundColor: red});
			}
		}
	}
	
	serverRequest(trip) {
		sendServerRequestWithBody('trip', trip, this.props.settings.serverPort)
		.then((response) => {
			
			if (response.statusCode >= 200 && response.statusCode <= 299) {
				var itineraryData = this.formatTripData(response.body);
				var totalDistance = this.props.sumTotalDistance(response.body.distances);
				this.setState({backgroundColor: green});
				this.props.onFileSelect(trip, itineraryData, totalDistance);
			} else {
				//console.log("Error");
				this.props.errorHandler(response.statusText, response.statusCode);
			}
		});
	}
	
	formatTripData(trip) {
		let itineraryData;
		let places = [];
		let distances = [];
		let checkBoxes = new Array(trip.places.length).fill(true);
		
		for (let i = 0; i < trip.places.length; i++) {
			
		//	let destination_index = ((i + 1) === trip.places.length) ? 0 : i + 1;
			
			let formattedCoordsOrigin = this.props.formatCoordinates(
				`${trip.places[i].latitude}, ${trip.places[i].longitude}`, null, true);
		//	let formattedCoordsDestination = this.props.formatCoordinates(
		//		`${trip.places[destination_index].latitude}, ${trip.places[destination_index].longitude}`, null, true);
			
			places.push(
				{
					name: trip.places[i].name,
					latitude: formattedCoordsOrigin.latitude,
					longitude: formattedCoordsOrigin.longitude,
					checked: true
				});
			
			distances.push((trip.distances != null) ? trip.distances[i] : "");
		}
		
		itineraryData = {
			originalPlaces: places, // Dont edit
			places: places,
			distances: distances,
			checkBoxes: checkBoxes,
			checked: true
		};
		
		
		return itineraryData;
	}
}
