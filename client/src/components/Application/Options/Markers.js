import React, { Component } from 'react'
import { Card, CardHeader, CardBody } from 'reactstrap'
import { Button, ButtonGroup } from 'reactstrap'
import iconblue from '../images/iconblue.png'
import iconred from '../images/iconred.png'
import icongreen from '../images/icongreen.png'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

export default class Markers extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sliderValue: 50
    }
  }

  render() {
    return(
        <Card className='text-left'>
          <CardHeader className='bg-csu-green text-white font-weight-semibold'>Marker Color & Size</CardHeader>
          <CardBody>
            <ButtonGroup horizontal={"true"} className='w100'>
              {this.renderUnitButtons(['Red', 'Blue', 'Green'], [iconred, iconblue, icongreen], 'colorURL')}
            </ButtonGroup>
            <Slider
                ValueLabelComponent={this.sliderComponent}
                aria-label="custom thumb label"
                min={10}
                defaultValue={this.props.markerSize}
                onChangeCommitted={(event, value) => this.props.updateOption('markerSize', value)}
            />
            {/*<ButtonGroup horizontal={"true"} className='w100'>
              {this.renderUnitButtons(['Small', 'Medium', 'Large'], [[18, 25], [30, 41], [40, 51]], 'markerSize')}
            </ButtonGroup> */}
          </CardBody>
        </Card>
    );
  }

  sliderComponent(props) {
    const { children, open, value } = props;

    const popperRef = React.useRef(null);
    React.useEffect(() => {
      if (popperRef.current) {
        popperRef.current.update();
      }
    });

    return (
        <Tooltip
            PopperProps={{
              popperRef,
            }}
            open={open}
            enterTouchDelay={0}
            placement="top"
            title={value}
        >
          {children}
        </Tooltip>
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
