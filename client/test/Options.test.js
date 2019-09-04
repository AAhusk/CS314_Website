import './enzyme.config.js'
import React from 'react'
import { shallow } from 'enzyme'
import Options from '../src/components/Application/Options/Options'
import Units from '../src/components/Application/Options/Units'


const startProperties = {
  'options': {
    'units': {'miles':3959, 'kilometers':6371},
    'activeUnit': 'miles'
  },
  'updateOption' : () => {}
};

function testRender() {
  const options = shallow(<Options options={startProperties.options}
                                   config={null}
                                   updateOption={startProperties.updateOption}/>);

  expect(options.contains(<Units options={startProperties.options}
                                 activeUnit={startProperties.options.activeUnit}
                                 updateOption={startProperties.updateOption}/>)).toEqual(true);
}

test('Check to see if a Units component is rendered', testRender);