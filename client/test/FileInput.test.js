import './enzyme.config.js';
import React from 'react';
import { mount, shallow } from 'enzyme';
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

