import React, {Component} from 'react';
import './colostatewebstyle.css';
import FooterLogo from './FooterLogo';

/* Renders a text footer below the application with department,copyright,
 * and other useful information.
 */
export default class Footer extends Component {
  constructor(props) {
    super(props);

    this.departmentWidget = this.departmentWidget.bind(this);
  }

  render() {
    return (
      <div>
        <br/>
        {this.departmentInformation()}
        {this.universityInformation()}
      </div>
    )
  }

  departmentInformation() {
    return (
      <div className="add-company-footer">
        <div className="application-width">
          <div className="row">
            {this.departmentColumn("Computer Science Department", this.departmentWidget)}
          </div>
        </div>
      </div>
    );
  }

  universityInformation() {
    return (
      <div className="add-footer">
        <div className="application-width">
          <div className="footer-copyright">
            <div className="copyright-text">
              {this.footerCopyright()}
            </div>
            <div className="footer-logo-wrapper">
              <a href="http://www.colostate.edu/" className="company-sub-widget" target="_blank">
                <FooterLogo/>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  departmentColumn(name, widget) {
    return (
      <div className="col-xs-12 col-sm-6 col-md-4">
        <h4 className="company-widget">
          {name}
        </h4>
        {widget()}
      </div>
    );
  }

  departmentWidget() {
    return (
      <div className="company-sub-widget">
        <ul className="widget-list">
          {this.multiLineAddress("279 Computer Science Building\n1100 Centre Avenue\nFort Collins, CO 80523")}
          {this.nameValue("Phone", "(970) 491-5792")}
          {this.nameValue("Fax", "(970) 491-2466")}
          {this.nameLink("Email", "info@cs.colostate.edu")}
        </ul>
      </div>
    );
  }

  footerCopyright() {
    const year = new Date().getFullYear();
    return (
      <div>
        <ul>
          <li><a href="http://admissions.colostate.edu" className="company-sub-widget">Apply to CSU</a></li>
          <li><a href="http://www.colostate.edu/info-contact.aspx" className="company-sub-widget">Contact CSU</a></li>
          <li><a href="http://www.colostate.edu/info-disclaimer.aspx" className="company-sub-widget">Disclaimer</a></li>
          <li><a href="http://www.colostate.edu/info-equalop.aspx" className="company-sub-widget">Equal Opportunity</a></li>
          <li><a href="http://www.colostate.edu/info-privacy.aspx" className="company-sub-widget">Privacy Statement</a></li>
          <br/>
          <li><p>© {year} Colorado State University - {this.departmentName()} Department, Fort Collins, CO 80523</p></li>
        </ul>
      </div>
    );
  }

  departmentName() {
    return ("Computer Science");
  }

  multiLineAddress(address) {
    const key = Number.MAX_SAFE_INTEGER / 2;
    let lines = [];
    if (address !== undefined) {
      lines = address.split("\n").map((line) => {
        return (
          <span key={key + Math.trunc(Math.random() * key)}>
          {line}<br/>
        </span>
        );
      });
      return (
        <li className="widget-list">
          {lines}
        </li>
      );
    }
  }

  nameValue(name, value) {
    if (value !== undefined)
      return(
        <li className="widget-list"><b>{name}:</b>{' '}{value}</li>
      );
  }

  nameLink(name, value) {
    if (value !== undefined )
      return (
        <li className="widget-list"><b>{name}:</b>{' '}
          <a className="widget-link" href={"mailto:"+value}>
            {value}
          </a>
        </li>
      );
  }

}
