import React, {Component} from 'react'
import {Container, Row, Col, Alert, Card, CardHeader, CardBody, CardText} from 'reactstrap'
import FileInput from './FileInput'
import LMap from "../LMap";

export default class Itinerary extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      trip: null,
    }

    this.onFileSelect = this.onFileSelect.bind(this);
  }

  render() {
    console.log('Itinerary', this.state);
    return (
        <Container>
          <Card>
            <CardHeader>Itinerary</CardHeader>   
            <FileInput onFileSelect={this.onFileSelect}/>
          </Card>
        </Container>
    );
  }

  onFileSelect(trip){
    this.setState({trip: trip});
  }

  

}
