import React, {Component} from 'react'
import {Container, Row, Col, Alert, Card, CardHeader, CardBody, CardText} from 'reactstrap'
import LMap from "../LMap";

export default class Calculator extends Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Container>
          <Card>
            <CardHeader>Itnirary</CardHeader>   
          </Card>
        </Container>
    );
  }

}
