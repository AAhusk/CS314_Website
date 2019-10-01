import React, {Component} from 'react'
import {Container, Row, Col, Alert, Card, CardHeader, CardBody, CardText} from 'reactstrap'
import LMap from "../LMap";

const green = '#bef7ba';
const red = '#f7b0b0';
const white = '#ffffff';

export default class FileInput extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: white,
    }
  }

  fileSelectHandler(event){

    var file_selected =  event.target.files[0];
    var read = new FileReader();
    read.readAsBinaryString(file_selected);
    read.onload = () => {
      
      try{
        let trip = JSON.parse(read.result);
        this.setState({ backgroundColor: green });
        this.props.onFileSelect(trip);
      }
      
      catch(err){
        this.setState({ backgroundColor: red });
      }
    }
  }

  render() {
    console.log('State', this.state);
    return (
      <Card style={{backgroundColor: this.state.backgroundColor}}>
        <input type="file" onChange={(event) => this.fileSelectHandler(event)}/>
      </Card>
    );
  }

}
