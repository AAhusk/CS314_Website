import './enzyme.config.js'
import React from 'react'
import About from '../src/components/Application/About/About'
import {Card, CardImg, CardText, CardBody, CardTitle, Container, Row, Col} from 'reactstrap';
import { shallow } from 'enzyme'

  function testAboutPageExistence() {
  const aboutRender = shallow(<About/>);
  expect(aboutRender.contains(<Card/>)).toEqual(false);
}

test('Make sure the About Page is not empty', testAboutPageExistence);