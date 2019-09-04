import React, {Component} from 'react';
import './colostatewebstyle.css';
import {HeaderLogoLarge, HeaderLogoMedium, HeaderLogoSmall} from './HeaderLogo';

/* Renders a text heading above the application with useful information.
 */
export default class Header extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return(
        <div className="add-header-height">
          <div className="application-width">
            <div id="responsiveHeaderContainer">
              <a href="http://colostate.edu" id="csuHeaderLink" target="_blank">
                <HeaderLogoLarge/>
                <HeaderLogoMedium/>
                <HeaderLogoSmall/>
              </a>
              <div id="responsiveLogoSubsystem">
                <a href={"https://compsci.colostate.edu/"} id="csHeaderLink" target="_blank">
                  <h1 className="larger-CSUtext-upper">
                    Computer Science
                  </h1>
                </a>
              </div>
            </div>
          </div>
        </div>
    );
  }

}
