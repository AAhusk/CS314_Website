import React, { Component } from 'react'
import { Card, CardHeader, CardBody } from 'reactstrap'
import { Button, ButtonGroup } from 'reactstrap'
import iconblue from '../images/iconblue.png'
import iconred from '../images/iconred.png'
import icongreen from '../images/icongreen.png'

export default class Markers extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
        <Card className='text-left'>
          <CardHeader className='bg-csu-green text-white font-weight-semibold'>Marker Color & Size</CardHeader>
          <CardBody>
            <ButtonGroup horizontal={"true"} className='w100'>
              {this.renderUnitButtons(['Red', 'Blue', 'Green'], [iconred, iconblue, icongreen], 'colorURL')}
            </ButtonGroup>
            <ButtonGroup horizontal={"true"} className='w100'>
              {this.renderUnitButtons(['Small', 'Medium', 'Large'], [[18, 25], [30, 41], [40, 51]], 'markerSize')}
            </ButtonGroup>
          </CardBody>
        </Card>
    );

  }

  renderUnitButtons(colors, colorURL, option) {
      let buttons = [];
          for(let i =0; i<colors.length; ++i) {
            buttons.push(
                <Button
                    className='btn-csu w-100 text-left'
                    key={"button_" + colors[i]}
                    active={option==='markerSize' ? this.props[option][0]===colorURL[i][0]: this.props[option]===colorURL[i]}
                    value={colors[i]}
                    onClick={() => this.props.updateOption(option,
                        colorURL[i])}
                >{colors[i]}</Button>
            )
          }
      return buttons;
  }
}
