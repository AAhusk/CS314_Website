import React, { Component } from 'react'
import { Card, CardHeader, CardBody, CardText } from 'reactstrap'
import { Button, ButtonGroup } from 'reactstrap'
import {Row, Col} from 'reactstrap'

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
        <CardGroup>
          <Card className='text-left'>
            <CardHeader className='bg-csu-green text-white font-weight-semibold'>Units</CardHeader>
            <CardBody>
              <Col xs={12} sm={12} md={9} lg={9}>
                <ButtonGroup className="mr-2">
                  {this.renderUnitButtons(Object.keys(this.props.options.units))}
                </ButtonGroup>
              </Col>
            </CardBody>
          </Card>

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
              <Row>
                <Col xs={12} sm={12} md={9} lg={7} xl={6}>
                  {this.renderEnterButton()}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </CardGroup>
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

  renderCustomUnit() {

  }

  renderEnterButton() {

  }

}
