import './enzyme.config.js';
import React from 'react';
import { mount, shallow } from 'enzyme';
import Application from '../src/components/Application/Application';
import FileInput from '../src/components/Application/Itinerary/FileInput';


function testInitialState() {
    
        const app = shallow(<FileInput/>);
    
        let actualBackgroundColor = app.state().backgroundColor;
        let expectedBackgroundColor = '#ffffff';
        expect(actualBackgroundColor).toEqual(expectedBackgroundColor);
        
        let actualErrorMessage = app.state().errormessage;
        expect(actualErrorMessage).toBeUndefined();
    }   

test("Testing FileInput's initial state", testInitialState);



function testformatTripData(){

    let input = {
        "requestType"    : "trip",
        "requestVersion" : 4,
        "options"        : { "title":"My Trip", 
                             "earthRadius":"3958.8",
                             "optimization":"none" },
        "places"         : [{"name":"1",       "latitude": "39.7", "longitude": "-105.0"},
                            {"name":"2",      "latitude": "40.0", "longitude": "-105.4"},
                            {"name":"3", "latitude": "40.6", "longitude": "-105.1"},
                            {"name":"4", "latitude": "40.8", "longitude": "-105.5"},
                            {"name":"5", "latitude": "41.2", "longitude": "-104.6"},
                            {"name":"6", "latitude": "40.2", "longitude": "-105.9"}],
        "distances"      : [30, 44, 25, 54, 97, 59]
    };
      
    let expectedResult = {
        "checkBoxes": [true, true, true, true, true, true],
        "checked" : true,
        "cumulativeDistances" : [30, 74, 99, 153, 250, 309],
        "distances" : [30, 44, 25, 54, 97, 59],
        "originalPlaces" : [
            {name: "1", latitude: "39.7", longitude: "-105", checked: true},
            {name: "2", latitude: "40", longitude: "-105.4", checked: true},
            {name: "3", latitude: "40.6", longitude: "-105.1", checked: true},
            {name: "4", latitude: "40.8", longitude: "-105.5", checked: true},
            {name: "5", latitude: "41.2", longitude: "-104.6", checked: true},
            {name: "6", latitude: "40.2", longitude: "-105.9", checked: true}
        ],
        "places" : [
            {name: "1", latitude: "39.7", longitude: "-105", checked: true},
            {name: "2", latitude: "40", longitude: "-105.4", checked: true},
            {name: "3", latitude: "40.6", longitude: "-105.1", checked: true},
            {name: "4", latitude: "40.8", longitude: "-105.5", checked: true},
            {name: "5", latitude: "41.2", longitude: "-104.6", checked: true},
            {name: "6", latitude: "40.2", longitude: "-105.9", checked: true}
        ],
        "polyLineEnabled" : true

     }

    const application = mount(<Application page={{title: 't11 Team America', page: ''}}/>);
    const fileInput = shallow (<FileInput formatCoordinates={application.instance().formatCoordinates}/>);

    let actualResult = fileInput.instance().formatTripData(input);
    
    compareArrays(actualResult.checkBoxes, expectedResult.checkBoxes);
    expect(actualResult.checked).toEqual(expectedResult.checked);
    compareArrays(actualResult.cumulativeDistances, expectedResult.cumulativeDistances);
    compareArrays(actualResult.distances, expectedResult.distances);
    expect(actualResult.polyLineEnabled).toEqual(expectedResult.polyLineEnabled);
    application.unmount();
}

function compareArrays(actual, expected){
    expect(actual.length).toEqual(expected.length);
    for (var i=0; i<actual.length; i++){
        expect(actual[i]).toEqual(expected[i]);
    }
}

test("Testing FileInput's formatTripData function", testformatTripData);