import './enzyme.config.js'
import React from 'react'
import {shallow, mount} from 'enzyme'
import Itinerary from '../src/components/Application/Itinerary/Itinerary'

function testSumTotalDistance(){
    var distances = [20,20,20,20,20]
    const app = shallow(<Itinerary
                            itineraryData={{places: distances}}
                        />);
    const actualResult = app.instance().sumTotalDistance(distances);
    expect(actualResult).toEqual(100);
}

test("Test Itinerary's sumTotalDistance function", testSumTotalDistance);