// Note the name of this file has X.test.js. Jest looks for any files with this pattern.
import './enzyme.config.js'
import React from 'react'
import { mount } from 'enzyme'
import Units from '../src/components/Application/Options/Units'


const startProperties = {
  'config': { 'units': {'miles':3959, 'kilometers':6371} },
  'activeUnit': 'miles'
};

function testButtonValues() {
  const units = mount((
      <Units options={startProperties.config}
             activeUnit={startProperties.activeUnit}/>
    ));

  let actual = [];
  units.find('Button').map((element) => actual.push(element.prop('value')));
  let expected = Object.keys(startProperties.config.units);

  expect(actual.sort()).toEqual(expected.sort());
}

/* Deep render (mount) Units to be able to test the properties of the Buttons
 * that get rendered inside of it.
 */
test('Check to see if a Button is rendered for each unit', testButtonValues);


function testInitialActiveButton() {
  const units = mount((
      <Units options={startProperties.config}
             activeUnit={startProperties.activeUnit}/>
  ));

  let actualButtons = [];
  units.find('Button').map((button) => actualButtons.push(button));

  for (let button of actualButtons) {

    if (button.prop('value') === startProperties.activeUnit){
      expect(button.prop('active')).toEqual(true);
    }
    else {
      expect(button.prop('active')).toEqual(false);
    }
  }
}

test('Check to see if the correct button is initially made active', testInitialActiveButton);
