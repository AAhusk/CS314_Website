import React, { Component } from 'react'
import { Card, CardHeader, CardBody, CardGroup, CardDeck } from 'reactstrap'
import { Row, Col, Button, ButtonGroup } from 'reactstrap'
import {Form, Input} from 'reactstrap'
import Pane from '../Pane';
import {Container} from 'reactstrap'
import CardText from "reactstrap/es/CardText";

export default class Units extends Component {
  constructor(props) {
    super(props)

    this.state = {
      customUnitName: null,
      customUnitRadius: null,
    };
  }

  render() {
    return(
          <Row>
            <Col>
              <Card className='text-left'>
                <CardHeader className='bg-csu-green text-white font-weight-semibold'>Units</CardHeader>
                  <CardBody>
                    <Col xs={12} sm={12} md={9} lg={9}>
                      <ButtonGroup horizontal className='w100'>
                        {this.renderUnitButtons(Object.keys(this.props.options.units))}
                      </ButtonGroup>
                    </Col>
                  </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className='text-left'>
                <CardHeader className='bg-csu-green text-white font-weight-semibold'>Create Custom Unit</CardHeader>
                  <CardBody>
                    <CardText> Enter the name of the unit you would like to create. Then enter the value of the Earth's radius in terms of this unit. </CardText>
                    <Row>
                      <Col xs={12} sm={12} md={9} lg={7} xl={6}>
                        {this.renderCustomUnit('customUnitName')}
                      </Col>
                      <Col xs={12} sm={12} md={9} lg={7} xl={6}>
                        {this.renderCustomUnit('customUnitRadius')}
                      </Col>
                    </Row>
                  </CardBody>
              </Card>
            </Col>
          </Row>
    );
  }

  renderUnitButtons(names) {
    return names.sort().map((unit) =>
      <Button
        className='btn-csu w-100 text-left'
        key={"button_"+unit}
        active={this.props.activeUnit === unit}
        value={unit}
        onClick={(event) => this.props.updateOption('activeUnit', event.target.value)}
      >
        {unit.charAt(0).toUpperCase() + unit.slice(1)}
      </Button>
    );
  }


  createInputField(stateVar){
    let updateStateVarOnChange = (event) => {
      this.updateCustomUnitState(stateVar, event.target.value);
    };
    if(stateVar === 'customUnitName') {
      return (
          <Input name={stateVar}
                 type="text"
                 onChange={updateStateVarOnChange}
                 style={{width: "100%"}}/>
      )
    }
    else {
      return (
          <Input name={stateVar}
                 type="number"
                 onChange={updateStateVarOnChange}
                 style={{width: "100%"}}/>
      )
    }
  }
  updateCustomUnitState(stateVar, newState) {
    this.setState({[stateVar]: newState});
  }

  renderCustomUnit(stateVar) {
    return (
        <Pane header={(stateVar.charAt(10) === 'N') ? 'Unit Name' : 'Earth Radius'}
              bodyJSX={
                <Form>
                  {this.createInputField(stateVar)}
                </Form>
              }
         />
    );
  }



}
