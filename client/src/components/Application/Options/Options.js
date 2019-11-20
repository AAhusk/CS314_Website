import React, {Component} from 'react'
import {Container, Row, Col} from 'reactstrap'
import { Card, CardBody, CardHeader } from 'reactstrap';
import Pane from '../Pane';
import Units from './Units'

/* Options allows the user to change the parameters for planning
 * and rendering the trip map and itinerary.
 * The options reside in the parent object so they may be shared with the Distance object.
 * Allows the user to set the options used by the application via a set of buttons.
 */
export default class Options extends Component{
  constructor(props) {
    super(props);
  }
  render() {
    return(
        <Container>
          <Card className = 'text-center'>
            <CardHeader className='bg-csu-gold text-white font-weight-semibold'>Options</CardHeader>
              <Units options={this.props.options}
                         activeUnit={this.props.options.activeUnit}
                         updateOption={this.props.updateOption}/>
            <Row>
              <Col xs="12" sm="9" md="6" lg="4" xl="4">
                <Markers updateOption={this.props.updateOption}
                         colorURL={this.props.options.colorURL}
                         markerSize={this.props.options.markerSize}
                />
              </Col>
            </Row>
          </Card>
        </Container>
    )
  }
}
