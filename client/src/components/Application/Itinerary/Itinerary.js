import React, {Component} from 'react'
import {Container, Card, CardHeader, Modal, ModalFooter, ModalBody, ModalHeader, Col, Input} from 'reactstrap'
import {Row, Button} from 'reactstrap'
import FileInput from './FileInput'
import ItineraryTable from './ItineraryTable'
import {sendServerRequestWithBody} from "../../../api/restfulAPI";

export default class Itinerary extends Component {
	
	constructor(props) {
		super(props);
		
		this.onFileSelect = this.onFileSelect.bind(this);
		this.errorHandler = this.errorHandler.bind(this);
		this.createOutputJSON = this.createOutputJSON.bind(this);
		this.createOutputCSV = this.createOutputCSV.bind(this);
		this.modalPlaceInputCallback = this.modalPlaceInputCallback.bind(this);
		this.addPlaceToItineraryDataFromModal = this.addPlaceToItineraryDataFromModal.bind(this);
		
		this.state = {
			trip: null,
			itineraryData: {},
			totalDistance: "",
			places: [],
			errorMessage: this.props.errorMessage,
			addModal: {
				addModalToggle: false,
				modalPlaceInput: null,
				modalNameInput: null,
				submitActive: false
			}
		}
	}
	
	render() {
		let toggleModal = () => {
			this.setState({addModal: {
					addModalToggle: !this.state.addModal.addModalToggle,
					modalPlaceInput: this.state.addModal.modalPlaceInput,
					modalNameInput: this.state.addModal.modalNameInput,
					submitActive: this.state.addModal.submitActive
				}});
		};
		
		let addPlaceModal = (
			<Modal isOpen={this.state.addModal.addModalToggle} toggle={toggleModal}>
				<ModalHeader toggle={toggleModal}>Add a new place</ModalHeader>
				<ModalBody>
					
					{this.createInputField("name", this.modalNameInputCallback)}
					{this.createInputField("place", this.modalPlaceInputCallback)}
				
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={this.addPlaceToItineraryDataFromModal} disabled={!this.state.addModal.submitActive}>Submit</Button>{' '}
				</ModalFooter>
			</Modal>
		);
		
		return (
			<React.Fragment>
				<Col>
					<Card>
						<CardHeader>
							<Row>
								<Col>
									Itinerary
								</Col>
								<Col>
									{addPlaceModal}
									
									<Button id="ShortTrip" color='primary'
									        onClick={() => this.shortTripOptimization()}>Shorten Trip</Button>{'  '}
									<Button id="TripJSON" className='bg-csu-gold text-white'
									        onClick={() => this.createOutputJSON()}>Export JSON</Button>{'  '}
									<Button id="TripCSV" className='bg-csu-gold text-white'
									        onClick={() => this.createOutputCSV()}>Export CSV</Button>{'  '}
									
									<Button onClick={toggleModal} className="float-right">+</Button>
								</Col>
							</Row>
						</CardHeader>
						<FileInput onFileSelect={this.onFileSelect}
						           formatCoordinates={this.props.formatCoordinates}
						           itineraryData={this.props.itineraryData}
						           settings={this.props.settings}
						           sumTotalDistance={this.sumTotalDistance}
						           errorHandler={this.errorHandler}
						/>
					</Card>
					<Card>
						<ItineraryTable itineraryData={this.props.itineraryData}
						                totalDistance={this.state.totalDistance}
						                updateItineraryData={this.props.updateItineraryData}
						                formatCoordinates={this.props.formatCoordinates}
						                settings={this.props.settings}
						                options={this.props.options}
						                sumTotalDistance={this.sumTotalDistance}
						
						/>
					</Card>
				</Col>
			</React.Fragment>
		);
	}
	
	modalNameInputCallback(event) {
		this.setState({addModal: {
				addModalToggle: this.state.addModal.addModalToggle,
				modalPlaceInput: this.state.addModal.modalPlaceInput,
				modalNameInput: event.target.value,
				submitActive: this.state.addModal.submitActive
			}});
	};
	
	createInputField(stateVar) {
		return (
			<Input name={stateVar + "field"}
			       placeholder={stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}
			       id={`${stateVar}field`}
			       onChange={(e) => (stateVar === "name" ? this.modalNameInputCallback(e) : this.modalPlaceInputCallback(e)) }/>
		);
	}
	
	sumTotalDistance(distances){
		var sum = 0;
		distances.map((distance) => {
			sum =  sum + distance;
		});
		return sum;
	}

	shortTripOptimization() {
		
		const tipObject = {
			'requestType': 'trip',
			'requestVersion': 3,
			'distances': [],
			'options': {
				'title': "Short Trip",
				'earthRadius': this.props.options.units[this.props.options.activeUnit],
				'optimization': 'short'
			},
			'places': this.props.itineraryData.places
		};
		
		sendServerRequestWithBody('trip', tipObject, this.state.serverPort)
		.then((response) => {
			if (response.statusCode >= 200 && response.statusCode <= 299) {
				let data = this.props.itineraryData;
				data.places = response.body.places;
				
				// Swap all the required things around
				let placeNames = [];
				for (let i = 0; i < data.places.length; i++) {
					placeNames.push(data.places[i].name);
				}
				
				let index = [];
				for (let i = 0; i < data.originalPlaces.length; i++) {
					index.push(placeNames.indexOf(data.originalPlaces[i].name));
				}
				
				let checkBoxes = []; // This is what is actually added to itineraryData
				for (let i = 0; i < index.length; i++) {
					checkBoxes.push(data.checkBoxes[index[i]]);
				}
				
				data.checkBoxes = checkBoxes;
				
				this.props.updateItineraryData(data);
				
			} else {
				this.setState({errorMessage: response.statusCode + ": " + response.statusText})
				console.log(response.statusCode + response.statusText);
				// this.setState({
				//     errorMessage: this.props.createErrorBanner(
				//         response.statusText,
				//         response.statusCode,
				//         `Request to ${this.props.serverPort} failed.`
				//     )
				// });
			}
		});
	}
	
	modalPlaceInputCallback(event) {
		let output = this.props.formatCoordinates(event.target.value, null, true);
		if (output !== 1) {
			
			this.setState({ addModal: {
					submitActive: true,
					addModalToggle: this.state.addModal.addModalToggle,
					modalPlaceInput: output,
					modalNameInput: this.state.addModal.modalNameInput
				}});
		}
		else {
			this.setState({ addModal: {
					submitActive: false,
					addModalToggle: this.state.addModal.addModalToggle,
					modalPlaceInput: this.state.addModal.modalPlaceInput,
					modalNameInput: this.state.addModal.modalNameInput
				}});
		}
	}
	
	addPlaceToItineraryDataFromModal() {
		let places = this.props.itineraryData.places;
		let joined = places.concat(
			{
				name: this.state.addModal.modalNameInput,
				latitude: this.state.addModal.modalPlaceInput.latitude,
				longitude: this.state.addModal.modalPlaceInput.longitude
			}
		);
		
		let data = this.props.itineraryData;
		data.places = joined;
		
		this.props.updateItineraryData(data);
	}

	createOutputJSON() {
		if (this.props.itineraryData.places.length === 0) {
			this.errorHandler("No file to export", 201);
		}
		else {
			let TIPTrip = this.state.trip;
			
			if(TIPTrip.hasOwnProperty('distances')){}
			else {
				TIPTrip["distances"] = this.props.itineraryData.distances;
			}

			let file = new Blob([JSON.stringify(TIPTrip, null, 2)],
				{type: 'application/json'});
			let FileSaver = require('file-saver');
			FileSaver.saveAs(file, "TIPTrip.json");
		}
	}
	
	createOutputCSV() {
		if (this.props.itineraryData == null) {
			this.errorHandler("No file to export", 202)
		}
		
		else {
			const TripArray = [[]];
			let names = this.props.itineraryData.places[0]
			TripArray[0] = Object.keys(names);
			TripArray[0].push("distance", "cumulative distance");
			this.createCSVArray(TripArray);
			
			let TripCSV = "";
			TripArray.forEach(function (rowArray) {
				let row = rowArray.join(",");
				TripCSV += row + "\r\n";
			});
			
			let file = new Blob([TripCSV], {type: 'text/csv'},
				{type: 'application/json'});
			
			let FileSaver = require('file-saver');
			FileSaver.saveAs(file, "TIPTrip.csv");
		}
	}
	createCSVArray(TripArray) {
		let cumulativeDistance = 0;
		for (let i = 0; i < this.props.itineraryData.places.length; ++i) {
			let PlaceEntry = this.props.itineraryData.places[i];
			let TripLocation = []
			for (let key in PlaceEntry) {
				TripLocation.push(PlaceEntry[key])
			}
			let distance = (i===0) ? 0 : this.props.itineraryData.distances[i-1];
			cumulativeDistance += distance;
			TripLocation.push(distance, cumulativeDistance);
			TripArray[i+1] = TripLocation;
		}
		let backToOrigin = TripArray[1].slice(0);
		let distToOrigin = this.props.itineraryData.distances[this.props.itineraryData.distances.length-1];
		backToOrigin[backToOrigin.length-2] = distToOrigin;
		backToOrigin[backToOrigin.length-1] = cumulativeDistance + distToOrigin;
		TripArray.push(backToOrigin);
	}

	onFileSelect(trip, itineraryData, totalDistance) {
		this.setState({totalDistance: totalDistance});
		this.props.updateItineraryData(itineraryData);
		this.setState({trip: trip});
	}
	
	errorHandler(statusText, statusCode){
		this.setState({
			errorMessage: this.props.createErrorBanner(
				statusText,
				statusCode,
				`Request to ${this.props.settings.serverPort} failed.`
			)
		});
	}
}
