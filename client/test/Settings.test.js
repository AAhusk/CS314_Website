import './enzyme.config.js'
import React from 'react'
import { shallow } from 'enzyme'
import Settings from '../src/components/Application/Settings/Settings'
import Interop from '../src/components/Application/Settings/Interop'


const startProperties = {
  'settings': { 'serverPort': 'black-bottle.cs.colostate.edu:31400' },
  'updateSetting': () => {}
};

function testRender() {
  const settings = shallow(<Settings settings={startProperties.settings}
                                     updateSetting={startProperties.updateSetting}/>);


  expect(settings.contains(<Interop serverPort={startProperties.settings.serverPort}
                                   updateSetting={startProperties.updateSetting}/>)).toEqual(true);
}

test("Testing to see if an Interop component is rendered", testRender);