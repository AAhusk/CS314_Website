import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap';
import 'leaflet/dist/leaflet.css';
import Pane from './Pane'
import LMap from "./LMap";

export default class Home extends Component {
	
	constructor(props) {
		super(props);
		this.props.geolocation();
	}
	
	render() {
		
		return (
			<Container>
				<Row>
					<Col xs={12} sm={12} md={7} lg={8} xl={9}>
						<LMap locationOrigin={this.props.locationOrigin}
						      locationDestination={this.props.locationDestination}
						      currentLocation={this.props.currentLocation}
									options={this.props.options}/>
					</Col>
					<Col xs={12} sm={12} md={5} lg={4} xl={3}>
						{this.renderIntro()}
					</Col>
				</Row>
			</Container>
		);
	}
	
	
	renderIntro() {
		return (
			<Pane header={'Bon Voyage!'}
			      bodyJSX={'Let us help you plan your next trip.'}/>
		);
	}
}
