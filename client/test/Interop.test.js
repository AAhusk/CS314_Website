import './enzyme.config.js';
import React from 'react';
import {Input} from 'reactstrap';
import {mount} from 'enzyme';
import Application from '../src/components/Application/Application';
import Interop from '../src/components/Application/Settings/Interop';


const startProperties = {
  'serverPort': 'black-bottle.cs.colostate.edu:31400',
  'updateSetting': () => {}
};

function testInputExists() {
  const interop = mount(<Interop serverPort={startProperties.serverPort}
                                   updateSetting={startProperties.updateSetting}/>);

  expect(interop.contains(<Input onChange={interop.instance().updateInputText}
                                 value={interop.state().inputText}
                                 placeholder={startProperties.serverPort}/>)).toEqual(true);
}

test('Testing that an Input is rendered', testInputExists);

function testUpdateInputText() {
  const interop = mount(<Interop serverPort={startProperties.serverPort}
                                 updateSetting={startProperties.updateSetting}/>);

  expect(interop.state().inputText).toEqual('');

  let inputText = 'Fake input text';
  simulateOnChangeEvent(inputText, interop);
  expect(interop.state().inputText).toEqual(inputText);
}

function simulateOnChangeEvent(inputText, reactWrapper) {
  let event = {target: {value: inputText}};
  reactWrapper.find('Input').at(1).simulate('change', event);
  reactWrapper.update();
}

test('Testing that the onChange event for Input updates the inputText field in'
    + 'state', testUpdateInputText);

function testUpdateServerPort() {
  //mockConfigResponse();

  const application = mount(<Application/>);

  let actualBeforeServerPort = application.state().clientSettings.serverPort;
  let expectedBeforeServerPort = `http://${location.hostname}:`;
  expect(actualBeforeServerPort).toEqual(expectedBeforeServerPort);

  const interop = application.find('Interop');

  let inputText = 'https://black-bottle.cs.colostate.edu:31400';
  simulateOnChangeEvent(inputText, interop);
  interop.find('form').simulate('submit', { target: interop.find('Input') } );

  let actualAfterServerPort = application.state().clientSettings.serverPort;
  expect(actualAfterServerPort).toEqual(inputText);
}

function mockConfigResponse() {
  fetch.mockResponse(JSON.stringify(
      {
        status: 200,
        statusText: 'OK',
        body: {
          'placeAttributes': ["name","latitude","longitude","id","altitude","municipality","type"],
          'requestType': "config",
          'requestVersion': 3,
          'serverName': "t11"
        },
        type: 'basic',
        url: 'http://localhost:8088/api/config',
        redirected: false,
        ok: true
      }));
}

test('Testing that the onClick event for the form updates the serverPort field '
    + 'in Application', testUpdateServerPort);

