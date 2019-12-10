import React, {Component} from 'react'
import {Card, CardHeader, Modal, ModalFooter, ModalBody, ModalHeader, Col, Input} from 'reactstrap'
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import {Row, Button} from 'reactstrap'
import FileInput from './FileInput'
import ItineraryTable from './ItineraryTable'
import {
  sendServerRequest,
  sendServerRequestWithBody
} from "../../../api/restfulAPI";

import {DownloadDropdown, OptimizationDropdown} from './Dropdowns'
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FlipCameraAndroidIcon from '@material-ui/icons/FlipCameraAndroid';
import TimelineIcon from '@material-ui/icons/Timeline';
import AddIcon from '@material-ui/icons/Add';

export default class Itinerary extends Component {

  constructor(props) {
    super(props);

    this.onFileSelect = this.onFileSelect.bind(this);
    this.errorHandler = this.errorHandler.bind(this);
    this.createOutputJSON = this.createOutputJSON.bind(this);
    this.createOutputCSV = this.createOutputCSV.bind(this);
    this.modalPlaceInputCallback = this.modalPlaceInputCallback.bind(this);
    this.addPlaceToItineraryDataFromModal = this.addPlaceToItineraryDataFromModal.bind(this);
    this.autoOptimization = this.autoOptimization.bind(this);
    this.noOptimization = this.noOptimization.bind(this);
    this.shortTripOptimization = this.shortTripOptimization.bind(this);
    this.shorterTripOptimization = this.shorterTripOptimization.bind(this);

    this.state = {
      trip: null,
      originalTrip: null,
      itineraryData: {},
      totalDistance: "",
      places: [],
      errorMessage: this.props.errorMessage,
      forceUpdate: false,
      itineraryTitle: "TIPTrip",
      addModal: {
        addModalToggle: false,
        modalPlaceInput: null,
        modalNameInput: null,
        submitActive: false
      },
      buttonDropdown: {
        optimizationDropdownToggle: false,
        downloadDropdownToggle: false,
        settingsDropdownToggle: false
      }
    }
  }

  render() {
    let toggleOptDropdown = () => {
      let data = this.state.buttonDropdown;
      data.optimizationDropdownToggle = !data.optimizationDropdownToggle;
      this.setState({buttonDropdown: data});
    };

    let toggleDwnDropdown = () => {
      let data = this.state.buttonDropdown;
      data.downloadDropdownToggle = !data.downloadDropdownToggle;
      this.setState({buttonDropdown: data});
    };

    let toggleSetDropdown = () => {
      let data = this.state.buttonDropdown;
      data.settingsDropdownToggle = !data.settingsDropdownToggle;
      this.setState({buttonDropdown: data});
    };

    let optimizationDropdownMenu = (
          <OptimizationDropdown autoOptimization={this.autoOptimization}
                                noOptimization={this.noOptimization}
                                shortTripOptimization={this.shortTripOptimization}
                                shorterTripOptimization={this.shorterTripOptimization}/>
    );

    let downloadDropdownMenu = (
          <DownloadDropdown createOutputCSV={this.createOutputCSV}
                            createOutputJSON={this.createOutputJSON}/>
    );

    let reverseButton = (
      <Tooltip title="Reverse Trip" placement="top" arrow>
        <IconButton color="primary"
                    onClick={() => this.reverseItinerary()}>
          <FlipCameraAndroidIcon/>
        </IconButton>
      </Tooltip>
    );

    let lineToggleButton = (
      <Tooltip title="Line Toggle" placement="top" arrow>
        <IconButton color="primary"
                    onClick={() => {
                              let data = this.props.itineraryData;
                              data.polyLineEnabled = !data.polyLineEnabled;
                              this.props.updateItineraryData(data);
                            }}>
          <TimelineIcon/>
        </IconButton>
      </Tooltip>
    );

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
              <Button className='bg-csu-green text-white' onClick={this.addPlaceToItineraryDataFromModal} disabled={!this.state.addModal.submitActive}>Submit</Button>{' '}
            </ModalFooter>
          </Modal>
    );

    return (
          <React.Fragment>
            {addPlaceModal}
            <Col>
              <Card>
                <CardHeader>
                  <Row>
                    <Col sm={{size: "auto"}}>
                      <Input name={"title field"}
                             placeholder={"Itinerary Title"}
                             id={'titlefield'}
                             onChange={(e) => (this.setState({itineraryTitle: e.target.value}))}/>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={{size: "auto"}}>
                      
                      <Tooltip title="Add Location" placement="top" arrow>
                        <IconButton color="primary"
                                    onClick={toggleModal}
                                    style={{float: "right"}}>
                          <AddIcon/>
                        </IconButton>
                      </Tooltip>
                      
                      {optimizationDropdownMenu}{'  '}
                      {downloadDropdownMenu}{'  '}
                      {reverseButton}{'  '}
                      {lineToggleButton}{'  '}
                    </Col>

                  </Row>
                </CardHeader>
                <FileInput onFileSelect={this.onFileSelect}
                           formatCoordinates={this.props.formatCoordinates}
                           itineraryData={this.props.itineraryData}
                           settings={this.props.settings}
                           sumTotalDistance={this.sumTotalDistance}
                           errorHandler={this.errorHandler}
                           validateApiResponse={this.props.validateApiResponse}
                />
              </Card>
              <Card>
                {this.renderTable()}
              </Card>
            </Col>
          </React.Fragment>
    );
  }
  renderTable() {
    return(
          <ItineraryTable itineraryData={this.props.itineraryData}
                          totalDistance={this.state.totalDistance}
                          updateItineraryData={this.props.updateItineraryData}
                          formatCoordinates={this.props.formatCoordinates}
                          settings={this.props.settings}
                          options={this.props.options}
                          sumTotalDistance={this.sumTotalDistance}
                          forceUpdate={this.state.forceUpdate}/>
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

  autoOptimization() {
    if (this.props.itineraryData.places.length < 100)
      this.shorterTripOptimization();
    else if (this.props.itineraryData.places.length > 100 && this.props.itineraryData.places.length < 300)
      this.shortTripOptimization();
    else {
      // Do this to at the very least regenerate the distances
      const TIPObject = this.createTIPObject("Normal Trip", 'none');
      this.sendServerRequest('trip', TIPObject);
    }

  }

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

  noOptimization(){
    this.props.updateItineraryData(this.state.originalTrip);
    const TIPObject = this.createTIPObject("Short Trip", 'none');
    this.sendServerRequest('trip', TIPObject);
  }

  shortTripOptimization() {
    const TIPObject = this.createTIPObject("Short Trip", 'short');
    this.sendServerRequest('trip', TIPObject);
  }

  shorterTripOptimization() {
    const TIPObject = this.createTIPObject("Shorter Trip", 'shorter');
    this.sendServerRequest('trip', TIPObject);
  }

  createTIPObject(title, optimization) {
    const TIPrequest = {
        'requestType': 'trip',
        'requestVersion': 4,
        'distances': [],
        'options': {
          'title': title,
          'earthRadius': this.props.options.units[this.props.options.activeUnit].toString(),
          'optimization': optimization
        },
        'places': this.props.itineraryData.places
    };
    return TIPrequest;
  }

  sendServerRequest(requestType, TIPrequest) {
    sendServerRequestWithBody(requestType, TIPrequest, this.state.serverPort)
          .then((response) => {
            if (response.statusCode >= 200 && response.statusCode <= 299) {
              this.props.validateApiResponse(response);

              let data = this.props.itineraryData;
              data.places = response.body.places;
              data.distances = response.body.distances;

              this.setState({forceUpdate: !this.state.forceUpdate});

              this.props.updateItineraryData(data, false);

            } else {
              this.setState({errorMessage: response.statusCode + ": " + response.statusText})
              console.log(response.statusCode + response.statusText);
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
            longitude: this.state.addModal.modalPlaceInput.longitude,
            checked: true
          }
    );

    let data = this.props.itineraryData;
    data.places = joined;

    this.props.updateItineraryData(data);
  }
  reverseItinerary() {
    let data = this.props.itineraryData;
    let origin = data.places[0];
    let placesData = data.places.slice(1);
    placesData.reverse();
    placesData.unshift(origin);
    data.places = placesData;
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
      let title = this.state.itineraryTitle + ".json";
      FileSaver.saveAs(file, title);
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
      TripArray[0].splice(TripArray[0].length-1);  									// get rid of "checked" key
      TripArray[0].push("distance", "cumulative");
      this.createCSVArray(TripArray);

      let TripCSV = "";
      TripArray.forEach(function (rowArray) {
        let row = rowArray.join(",");
        TripCSV += row + "\r\n";
      });

      let file = new Blob([TripCSV], {type: 'text/csv'},
            {type: 'application/json'});

      let FileSaver = require('file-saver');
      let title = this.state.itineraryTitle + ".csv";
      FileSaver.saveAs(file, title);
    }
  }
  createCSVArray(TripArray) {
    let cumulativeDistance = 0;
    for (let i = 0; i < this.props.itineraryData.places.length; ++i) {
      let PlaceEntry = this.props.itineraryData.places[i];
      let TripLocation = [];
      for (var key of Object.keys(PlaceEntry)) {
        TripLocation.push(PlaceEntry[key]);
      }
      TripLocation.splice(TripLocation.length-1, 1);
      let distance = (i===0) ? 0 : this.props.itineraryData.distances[i-1];
      cumulativeDistance += distance;
      TripLocation.push(distance, cumulativeDistance);
      TripArray.push(TripLocation);
    }
    //console.log(TripArray);
    let backToOrigin = TripArray[1].slice(0);
    let distToOrigin = this.props.itineraryData.distances[this.props.itineraryData.distances.length-1];
    backToOrigin[backToOrigin.length-2] = distToOrigin;
    backToOrigin[backToOrigin.length-1] = cumulativeDistance + distToOrigin;
    TripArray.push(backToOrigin);
  }

  onFileSelect(trip, itineraryData, totalDistance) {
    this.setState({
      totalDistance: totalDistance,
      trip: trip,
      originalTrip: itineraryData
    });
    this.props.updateItineraryData(itineraryData, false);
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
