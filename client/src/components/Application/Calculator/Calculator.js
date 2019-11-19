import React, {Component, Fragment} from 'react'
import {Container, Row, Col, ListGroupItem, ListGroup, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import {Button} from 'reactstrap'
import {Input} from 'reactstrap'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {sendServerRequestWithBody} from '../../../api/restfulAPI'
import LMap from "../LMap";
import Itinerary from "../Itinerary/Itinerary";

export default class Calculator extends Component {
	constructor(props) {
		super(props);
		
		this.updateLocationState = this.updateLocationState.bind(this);
		this.calculateDistance = this.calculateDistance.bind(this);
		this.createInputField = this.createInputField.bind(this);
		
		this.state = {
			origin: this.props.locationOrigin,
			destination: this.props.locationDestination,
			rawStringO: "stuff",
			rawStringD: null,
			distance: 0,
			errorMessage: this.props.errorMessage,
			useLocation: false,
			suggestedPlaces: [],
		        numFoundPlaces: 0,
		        addModal: {
		   	    toggle: false,
			    places: [],
			    found: 0
		        } 
		};
	}
	
	render() {
	    let toggleModal = () => {
	        this.setState({addModal: {
	    	    toggle: !this.state.addModal.toggle,
		    		place: this.state.suggestedPlaces,
		    		found: this.state.numFoundPlaces
	        }});
	    };

        let addPlaceModal = (
            <Modal isOpen={this.state.addModal.toggle} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Search Results</ModalHeader>
                <ModalBody>
                    <h5>Found {this.state.addModal.found} results</h5>
                </ModalBody>
            </Modal>
        );
		return (
			<React.Fragment>
				<Row>
					{this.state.errorMessage}
					<Col xs={12} sm={12} md={9} lg={9}>
						<LMap currentLocation={this.props.currentLocation}
						      locationOrigin={this.props.locationOrigin}
						      locationDestination={this.props.locationDestination}
						      itineraryData={this.props.itineraryData}
						      options={this.props.options}
						/>
					</Col>
					<Col xs={12} sm={12} md={3} lg={3}>
						{addPlaceModal}
						<ListGroup>
							<ListGroupItem> <Button className='bg-csu-green text-white' onClick={() => this.handleButtonClick()}>Use My
								Location</Button> </ListGroupItem>
							<ListGroupItem> {this.createInputField("origin")}</ListGroupItem>
							<Button onClick={toggleModal} className="float-right">Search Database</Button>
                            				<br></br>
							<ListGroupItem> {this.createInputField("destination")}</ListGroupItem>
							<Button onClick={toggleModal} className="float-right">Search Database</Button>
                            				<br></br>
							<ListGroupItem> {this.createDistance()}</ListGroupItem>
						</ListGroup>
					</Col>
				</Row>
				<hr/>
					{' '}
				<Row>
					<Itinerary options={this.props.options}
					           settings={this.props.settings}
					           createErrorBanner={this.props.createErrorBanner}
					           errorMessage={this.state.errorMessage}
					           updateItineraryData={this.props.updateItineraryData}
					           formatCoordinates={this.props.formatCoordinates}
					           createInputField={this.createInputField}
						   itineraryData={this.props.itineraryData}
						   validateApiResponse={this.props.validateApiResponse}
					/>
				</Row>
			</React.Fragment>
		);
	}

	ComboBox() {
		const top10Films = [
			{ title: 'The Shawshank Redemption', year: 1994 },
			{ title: 'The Godfather', year: 1972 },
			{ title: 'The Godfather: Part II', year: 1974 },
			{ title: 'The Dark Knight', year: 2008 },
			{ title: '12 Angry Men', year: 1957 },
			{ title: "Schindler's List", year: 1993 },
			{ title: 'Pulp Fiction', year: 1994 },
			{ title: 'The Lord of the Rings: The Return of the King', year: 2003 },
			{ title: 'The Good, the Bad and the Ugly', year: 1966 },
			{ title: 'Fight Club', year: 1999 },
			{ title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
			{ title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
			{ title: 'Forrest Gump', year: 1994 },
			{ title: 'Inception', year: 2010 }];
		return (
				<Autocomplete
						id="combo-box-demo"
						options={top10Films}
						getOptionLabel={option => option.title}
						style={{ width: 300 }}
						renderInput={params => (
								<TextField {...params} label="Combo box" variant="outlined" fullWidth />
						)}
						filter={(searchText, key) => true}
				/>
		);
	}

	
	handleButtonClick() {
		this.props.geolocation('origin');
		this.setState({
			rawStringO: {
				latitude: this.props.locationOrigin.latitude,
				longitude: this.props.locationOrigin.longitude
			},
			useLocation: true
		});
	}
	
	createInputField(stateVar, callback = null) {
		let updateStateVarOnChange = (event) => {
			if(this.state.useLocation === true) { this.setState({useLocation: false}); }
			this.inputFieldCallback(stateVar, event.target.value); // origin / destination --- rawString
		};
		let label = stateVar.charAt(0).toUpperCase() + stateVar.slice(1)
		if(stateVar == "origin" && this.state.useLocation === true) {
			let myLocation = this.props.locationOrigin.latitude + ", " + this.props.locationOrigin.longitude;
			return (
					<Autocomplete
							freeSolo
							id="combo-box-demo"
							options={[{title: 'Inception'}]}
							getOptionLabel={options => options.title}
							renderInput={params => (
									<TextField value={myLocation} label={"My Location"} fullWidth onChange={updateStateVarOnChange}/>
							)}
					/>
			);
		} else{
			return (
					<Autocomplete
							freeSolo
							id="combo-box-demo"
							options={[{title: 'Inception'}]}
							getOptionLabel={options => options.title}
							renderInput={params => (
									<TextField {...params} label={label} fullWidth onChange={updateStateVarOnChange}/>
							)}
					/>
			);
		}
	}
	
	inputFieldCallback(stateVar, rawString) {
		let rawStateName = "rawStringD";
		if (stateVar === "origin") {
			rawStateName = "rawStringO"
		}
		if(!rawString) { rawString = "0N, 0W"}

		// rawString should look like "40N, 108W"
		if(this.hasNumber(rawString)) {
		   this.props.formatCoordinates(rawString, rawStateName);
		   this.setState({[rawStateName]: rawString})
		} else {
		    this.queryDatabase(rawString);
		}
	}

	hasNumber(s) {
	    return /\d/.test(s);
	}
	
	createDistance() {
		return (
			<Container>
				<Row>
					<Col>
						<Button className='bg-csu-green text-white' onClick={this.calculateDistance}>Calculate</Button>
					</Col>
					<Col>
						<h5>{`${this.state.distance} ${this.props.options.activeUnit}`}</h5>
					</Col>
				</Row>
			</Container>
		)
	}
	
	calculateDistance() {
		const tipConfigRequest = {
			'requestType': 'distance',
			'requestVersion': 4,
			'origin': this.props.locationOrigin,
			'destination': this.props.locationDestination,
			'earthRadius': this.props.options.units[this.props.options.activeUnit]
		};
		
		sendServerRequestWithBody('distance', tipConfigRequest, this.props.settings.serverPort)
		.then((response) => {
			if (response.statusCode >= 200 && response.statusCode <= 299) {
				this.props.validateApiResponse(response);
				this.setState({
					distance: response.body.distance,
					errorMessage: null
				});
			} else {
				this.setState({
					errorMessage: this.props.createErrorBanner(
						response.statusText,
						response.statusCode,
						`Request to ${this.props.settings.serverPort} failed.`
					)
				});
			}
		});
	}

	queryDatabase(match) {
		const tipConfigRequest = {
		    'requestType': 'locations',
		    'requestVersion': 4,
		    "match"          : match,
		    "limit"          : 100,
		    "found"          : 0,
		    "places"         : []
		};

		sendServerRequestWithBody('location', tipConfigRequest, this.props.settings.serverPort)
		    .then((response) => {
			if (response.statusCode >= 200 && response.statusCode <= 299) {
			    this.setState({
				numFoundPlaces: response.body.found,
				suggestedPlaces: response.body.places,
				errorMessage: null
			    });
			} else {
			    this.setState({
				errorMessage: this.props.createErrorBanner(
				    response.statusText,
				    response.statusCode,
				    `Request to ${this.props.settings.serverPort} failed.`
				)
			    });
			}
		    });
	}
	
	updateLocationState(stateVar, field, value) {
		let location = Object.assign({}, this.state[stateVar]);
		location[field] = value;
		this.setState({[stateVar]: location});
	}
}
