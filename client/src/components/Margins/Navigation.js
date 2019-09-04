import React, {Component} from 'react';
import {Collapse, Navbar, NavbarBrand, Nav, NavItem, NavLink, Button} from 'reactstrap';
import './colostatewebstyle.css'

export default class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currentWindowWidth: window.innerWidth
    };

    this.toggle = this.toggle.bind(this);
    this.renderNavItem = this.renderNavItem.bind(this);

    this.staticHorizontalLinks = this.staticHorizontalLinks.bind(this);
    this.collapsibleVerticalLinks = this.collapsibleVerticalLinks.bind(this);
    this.collapseIcon = this.collapseIcon.bind(this);
    this.homeLink = this.homeLink.bind(this);
    this.windowSizeChange = this.windowSizeChange.bind(this);

    window.addEventListener('resize', this.windowSizeChange)
  }


  render() {
    let mediumScreenWidth = 768;
    let pageLinks = (this.state.currentWindowWidth < mediumScreenWidth) ?
      this.collapsibleVerticalLinks() : this.staticHorizontalLinks();
    return (
      <div className="application-width">
        {pageLinks}
      </div>
    )
  }


  collapsibleVerticalLinks(){
    let links = this.props.pages.map((item) => this.renderNavItem(item, 'dropdown'));

    return(
      <div>
        <Navbar>
          {this.collapseIcon()}
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>
              {links}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }


  collapseIcon() {
    let unCollapseMenuSymbol = <div>&#x2630;</div>;
    let collapseMenuSymbol = <div>&#x268A;</div>;

    return (<Button className="dropdown_icon"
                    onClick={this.toggle}>
      {(this.state.isOpen) ? collapseMenuSymbol : unCollapseMenuSymbol}
    </Button>
    )
  }


  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }


  staticHorizontalLinks() {
    let otherLinks = this.props.pages.slice(1).map((item) => this.renderNavItem(item, 'nav'));

    return (
      <Navbar className="nav_bar">
        {this.homeLink()}
        <div>{otherLinks}</div>
      </Navbar>
    )
  }


  homeLink() {
    return (
      <Button color="link"
              key="static_home"
              className='nav_title nav-link'
              onClick={()=>this.props.setAppPage('')}>
        {((this.props.pages) ? this.props.pages[0] : {title: 'Default Home', link: ''})['title']}
      </Button>
    )
  }


  renderNavItem(info, type) {
    // Create an anonymous function used to update the page selected for rendering
    let updatePage = (event) => {
      this.toggle();
      this.props.setAppPage(info['page']);
    };

    return (
      <Button onClick={ updatePage }
              color='link'
              key={type.concat(info['title'])}
              className={type.concat('_item')}>
        {info['title']}
      </Button>
    );
  }


  windowSizeChange() {
    this.setState({currentWindowWidth: window.innerWidth});
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowSizeChange);
  }

}
