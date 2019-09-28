import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap';
import 'leaflet/dist/leaflet.css';
import Pane from './Pane'
import LMap from "./LMap";

/*
 * Renders the home page.
 */
export default class Home extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Row>
          <Col xs={12} sm={12} md={7} lg={8} xl={9}>
            <LMap locationOriginLat={this.props.locationOriginLat}
                  locationOriginLong={this.props.locationOriginLong}/>
          </Col>
          <Col xs={12} sm={12} md={5} lg={4} xl={3}>
            {this.renderIntro()}
          </Col>
        </Row>
      </Container>
    );
  }


  renderIntro() {
    return(
      <Pane header={'Bon Voyage!'}
            bodyJSX={'Let us help you plan your next trip.'}/>
    );
  }
}
