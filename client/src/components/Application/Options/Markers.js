import React, { Component } from 'react'
import { Card, CardHeader, CardBody } from 'reactstrap'
import { Button, ButtonGroup } from 'reactstrap'

export default class Markers extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
        <Card className='text-left'>
          <CardHeader className='bg-csu-green text-white font-weight-semibold'>Marker Color</CardHeader>
          <CardBody>
            <ButtonGroup horizontal={"true"} className='w100'>
              {this.renderUnitButtons(['red', 'blue', 'green'], ['./images/iconred.png', './images/iconblue.png', './images/icongreen.png'])}
            </ButtonGroup>
          </CardBody>
        </Card>
    );
  }

  renderUnitButtons(colors, colorURL) {
      let buttons = [];
          for(let i =0; i<colors.length; ++i) {
            buttons.push(
                <Button
                    className='btn-csu w-100 text-left'
                    key={"button_" + colors[i]}
                    active={this.props.colorURL === colorURL[i]}
                    value={colors[i]}
                    onClick={() => this.props.updateOption('colorURL',
                        colorURL[i])}
                >{colors[i]}</Button>
            )
          }
      return buttons;
  }
}
