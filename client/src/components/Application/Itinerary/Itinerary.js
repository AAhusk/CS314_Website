import React, {Component} from 'react'
import {Container, Card, CardHeader, Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input
} from 'reactstrap'
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
		this.addPlaceToItineraryData = this.addPlaceToItineraryData.bind(this);
		this.updatePlaces = this.updatePlaces.bind(this);
		
		this.state = {
			trip: null,
			itineraryData: [],
			totalDistance: null,
			points: null,
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
		
		let modalNameInputCallback = (event) => {
			this.setState({addModal: {
					addModalToggle: this.state.addModal.addModalToggle,
					modalPlaceInput: this.state.addModal.modalPlaceInput,
					modalNameInput: event.target.value,
					submitActive: this.state.addModal.submitActive
				}});
		};
		
		let addPlaceModal = (
			<Modal isOpen={this.state.addModal.addModalToggle} toggle={toggleModal}>
				<ModalHeader toggle={toggleModal}>Add a new place</ModalHeader>
				<ModalBody>
					
					{this.createInputField("name", modalNameInputCallback)}
					{this.createInputField("place", this.modalPlaceInputCallback)}
					
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={this.addPlaceToItineraryData} disabled={!this.state.addModal.submitActive}>Submit</Button>{' '}
				</ModalFooter>
			</Modal>
		);
		
		return (
			<Container>
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
					           settings={this.props.settings}
					           places={this.state.places}
					           calculateTotalDistance={this.calculateTotalDistance}
					           errorHandler={this.errorHandler}
					/>
				</Card>
				<Card>
					{(this.state.places != null || this.state.places.length !== 0) &&
					<ItineraryTable itineraryData={this.state.itineraryData}
					                totalDistance={this.state.totalDistance}
					                places={this.extractPlacesFromItineraryData()}
					                updatePlaces={this.updatePlaces}
					/>
					}
				</Card>
			</Container>
		);
	}
	
	createInputField(stateVar, callback = null) {
		return (
			<Input name={stateVar + "field"}
			       placeholder={stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}
			       id={`${stateVar}field`}
			       onChange={callback}/>
		);
	}
	
	addPlaceToItineraryData() {
		let places = this.extractPlacesFromItineraryData();
		let joined = places.concat(
			{
				name: this.state.addModal.modalNameInput,
				latitude: this.state.addModal.modalPlaceInput.latitude,
				longitude: this.state.addModal.modalPlaceInput.longitude
			}
		);
		
		this.setState({ places: joined }, () => {
			this.insertPlacesIntoItineraryData();
		})
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
	
	shortTripOptimization() {
		let tipObject = {
			"requestType": "trip",
			"requestVersion": 2,
			"options": {    //  Required in request & response
				"title": "Short Trip",
				"earthRadius": "1337", // Doesn't matter, we dont use this value
				"optimization": "short"
			},
			"places": this.extractPlacesFromItineraryData(),
		};
		
		sendServerRequestWithBody('trip', tipObject, this.state.serverPort)
		.then((response) => {
			if (response.statusCode >= 200 && response.statusCode <= 299) {
				
				this.setState({
					places: response.body.places,
					errorMessage: null
				}, () => {
					this.insertPlacesIntoItineraryData()
				});
			} else {
				this.setState({errorMessage: response.statusCode + ": " + response.statusText})
				//console.log(response.statusCode + response.statusText);
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
	
	updatePlaces(places, index = -1) {
		this.setState({places: places},
		() => this.insertPlacesIntoItineraryData(index));
	}
	
	extractPlacesFromItineraryData() {
		let places = [];
		for (let i = 0; i < this.state.itineraryData.length; i++) {
			places.push(this.state.itineraryData[i].origin);
		}
		return places;
	}
	
	insertPlacesIntoItineraryData(removeIndex = -1) {
		let places = this.state.places;
		let ItinData = [];
		
		for (let i = 0; i < places.length - 1; i++) {
			let newObj = {
				origin: places[i],
				destination: places[i+1],
				//distance: this.state.itineraryData[i].distance != null ? this.state.itineraryData[i].distance : 0
				distance: (this.state.itineraryData[i+1] != null && this.state.itineraryData[i] != null) ?
					((removeIndex !== -1 && i >= removeIndex) ? this.state.itineraryData[i+1].distance : this.state.itineraryData[i].distance) : 0
			};
			ItinData = ItinData.concat(newObj);
		}
		
		let a = 0;
		if (this.state.itineraryData[this.state.itineraryData.length - 1] != null) {
			//console.log(itineraryData);
			a = this.state.itineraryData[this.state.itineraryData.length - 1].distance;
		}

		let lastObj = {
			origin: places[places.length - 1],
			destination: places[0],
			distance: a
		};
		ItinData = ItinData.concat(lastObj);
		
		this.setState({itineraryData: ItinData}); // Local data
		this.props.updateItineraryData(ItinData);
	}
	
	createOutputJSON() {
		
		if (this.state.trip == null) {
			this.errorHandler("No file to export", 201);
		} else {
			let TIPTrip = {
				"requestType": "trip",
				"requestVersion": 2,
				"options": this.state.trip.options,
				"places": [],
				"distances": []
			};
			
			let quantityPlaces = this.state.itineraryData.length;
			console.log(this.state.itineraryData);
			for (let i = 0; i < quantityPlaces; ++i) {
				TIPTrip.places[i] = this.state.itineraryData[i].origin.name;
				TIPTrip.distances[i] = this.state.itineraryData[i].distance;
			}
			
			let a = document.getElementById("TripJSON");
			let file = new Blob([JSON.stringify(TIPTrip, null, 2)],
				{type: 'application/json'});
			a.href = URL.createObjectURL(file);
			a.download = 'TIPTrip.json';
		}
	}
	
	createOutputCSV() {
		if (this.state.itineraryData == null) {
			this.errorHandler("No file to export", 202)
		} else {
			const TripArray = [[]];
			TripArray[0] = ["Origin", "Destination", "Distance"];
			
			
			for (var i = 0; i < this.state.itineraryData.length; ++i) {
				let TripSegment = [this.state.itineraryData[i].origin.name,
					this.state.itineraryData[i].destination.name,
					this.state.itineraryData[i].distance == null ? 0 : this.state.itineraryData[i].distance];
				TripArray[i + 1] = TripSegment;
			}
			
			TripArray[TripArray.length - 1] = ["", "Total Distance", this.state.totalDistance];
			
			let TripCSV = "";
			
			TripArray.forEach(function (rowArray) {
				let row = rowArray.join(",");
				TripCSV += row + "\r\n";
			});
			
			
			let downloadCSV = document.getElementById("TripCSV");
			let file = new Blob([TripCSV], {type: 'text/csv'},
				{type: 'application/json'});
			downloadCSV.href = URL.createObjectURL(file);
			downloadCSV.download = 'TIPTrip.csv';
		}
	}
	
	onFileSelect(trip, itineraryData, totalDistance) {
		this.setState({trip: trip, itineraryData: itineraryData, totalDistance: totalDistance});
		this.props.updateItineraryData(itineraryData);
		
	}
	
	calculateTotalDistance(distances) {
		var sum = 0;
		
		distances.map((distance) => {
			sum = sum + distance;
		});
		
		return sum;
	}
	
	errorHandler(statusText, statusCode) {
		this.setState({
			errorMessage: this.props.createErrorBanner(
				statusText,
				statusCode,
				`Request to ${this.props.settings.serverPort} failed.`
			)
		});
	}
}
