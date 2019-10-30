import './enzyme.config.js';
import React from 'react';
import {shallow, mount} from 'enzyme';
import Calculator from '../src/components/Application/Calculator/Calculator';
import Application from '../src/components/Application/Application';


const startProperties = {
  'options': {
    'units':  {"kilometers": 6371, "miles": 3959, "nautical miles": 3440},
    'activeUnit': 'miles',
    'serverPort': 'black-bottle.cs.colostate.edu:31400'
  }
};

function testCreateInputFields() {
  //let formatCoordinates = function () {}
  const calculator = mount((
      <Calculator options={startProperties.options}
                  formatCoordinates={Application.formatCoordinates}
                  itineraryData={{places: [], formattedDestinations: [], distances: []}}

      />
  ));

  let numberOfInputs = calculator.find('Input').length;
  expect(numberOfInputs).toEqual(2);

  let actualInputs = [];
  calculator.find('Input').map((input) => actualInputs.push(input.prop('name')));

  let expectedInputs = [
      "originfield",
      "destinationfield"
  ];

  expect(actualInputs).toEqual(expectedInputs);
}

/* Tests that createForm() correctly renders 4 Input components */
test('Testing the createForm() function in Calculator', testCreateInputFields);

function testInputsOnChange() {
  const calculator = mount((
      <Calculator options={startProperties.options}
                  formatCoordinates={Application.formatCoordinates}
      />
  ));

  let application = mount (
    <Application page={'calc'}  />
  );

  for (let inputIndex = 0; inputIndex < 4; inputIndex++){
    simulateOnChangeEvent(inputIndex, application);
  }

  expect(application.state().origin.latitude).toEqual(0);
  expect(application.state().origin.longitude).toEqual(1);
  expect(application.state().destination.latitude).toEqual(2);
  expect(application.state().destination.longitude).toEqual(3);
}



/* Loop through the Input indexes and simulate an onChange event with the index
 * as the input. To simulate the change, an event object needs to be created
 * with the name corresponding to its Input 'name' prop. Based on the index,
 * find the corresponding Input by its 'id' prop and simulate the change.
 *
 * Note: using find() with a prop as a selector for Inputs will return 2 objects:
 * 1: The function associated with the Input that is created by React
 * 2: The Input component itself
 *
 * The values in state() should be the ones assigned in the simulations.
 *
 * https://github.com/airbnb/enzyme/blob/master/docs/api/ShallowWrapper/simulate.md
 * https://airbnb.io/enzyme/docs/api/ReactWrapper/props.html
 * https://airbnb.io/enzyme/docs/api/ReactWrapper/find.html
 */