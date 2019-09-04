import React, {Component} from 'react'
import { Button, Input } from 'reactstrap'
import Pane from '../Pane'

export default class Interop extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputText: ''
    };

    this.updateServerPort = this.updateServerPort.bind(this);
    this.updateInputText = this.updateInputText.bind(this);
  }

  render() {
    if (this.props.serverConfig) {
      var currentServerName = this.props.serverConfig.serverName;
    }
    return (
        <Pane header={'Server'}
              bodyJSX={
                <div>
                  <p>Current server name:</p>
                    <Input value={currentServerName} disabled='disabled' className='font-weight-semibold'/>
                  <p>Configure new server:</p>
                  <form onSubmit={this.updateServerPort}>
                    <Input onChange={this.updateInputText}
                           value={this.state.inputText}
                           placeholder={this.props.serverPort}/>
                    <br/>
                    <Button type='submit' className='btn-csu w-100'>Configure</Button>
                  </form>
                </div>
              }/>
    );
  }

  updateInputText(event) {
    this.setState({inputText: event.target.value})
  }

  updateServerPort(serverPort) {
    serverPort.preventDefault();
    this.props.updateSetting('serverPort', this.state.inputText);
  }

}
