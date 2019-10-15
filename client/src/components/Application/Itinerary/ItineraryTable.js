import React from 'react';
import {Button, Table} from 'reactstrap';
import {sendServerRequestWithBody} from "../../../api/restfulAPI";

export default class ItineraryTable extends React.Component {
    constructor(props) {
        super(props);

        this.myServerRequest = this.myServerRequest.bind(this);
        this.insertPlacesIntoItineraryData = this.insertPlacesIntoItineraryData.bind(this);
        this.extractPlacesFromItineraryData = this.extractPlacesFromItineraryData.bind(this);

        this.state = {
            itineraryData: this.props.itineraryData,
            totalDistance: null
        };
    }

    render() {
        //console.log('ItineraryTable: ', this.props, this.state);

        if (this.props.itineraryData == null) {
            return (null);
        } else {
            return (

                <Table striped>
                    <Button color='primary' onClick={() => this.myServerRequest()}>Shorten Trip</Button>

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
    }

    myServerRequest() {
        let tipObject = {
            "requestType": "trip",
            "requestVersion": 2,
            "options": {    //  Required in request & response
                "title": "Short Trip",
                "earthRadius": "3975", // Required
                "optimization": "short"
            },
            "places": this.extractPlacesFromItineraryData(),
            // "places": [  //  Required in request & response
            //     {"name": "Denveer", "latitude": "49.7", "longitude": "-115.0"},
            //     {"name": "Boulder", "latitude": "40.0", "longitude": "-105.4"},
            //     {"name": "Boulder", "latitude": "40.0", "longitude": "-105.4"},
            //     {"name": "Fort Collins", "latitude": "40.6", "longitude": "-105.1"}],
            // "distances": []   //  Required in response
        };


        sendServerRequestWithBody('trip', tipObject, this.props.serverPort)
            .then((response) => {
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    console.log(response.body);
                    this.setState({
                        places: response.body.places,
                        errorMessage: null
                    }, () => {
                        this.insertPlacesIntoItineraryData()
                    });
                } else {

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

    extractPlacesFromItineraryData() {
        let places = [];
        for (let i = 0; i < this.props.itineraryData.length; i++) {
            places.push(this.props.itineraryData[i].origin);
        }
        return places;
    }

    insertPlacesIntoItineraryData() {
        let places = this.state.places;
        let ItinData = this.props.itineraryData;
        for (let i = 0; i < ItinData.length - 1; i++) {
            ItinData[i].origin = places[i];
            ItinData[i].destination = places[i+1]
        }
        //ItinData[this.props.itineraryData.length - 1].origin = places[places.length - 1]
        ItinData[this.props.itineraryData.length - 1].destination = places[0];

        this.setState({itineraryData: ItinData}); // Local data
        this.props.updateData("itineraryData", ItinData);
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
