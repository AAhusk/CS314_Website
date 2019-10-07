import React, {Component} from 'react'
import {Card, CardImg, CardText, CardBody, CardTitle, Container, Row, Col} from 'reactstrap';

import CalImg from './images/CalvinDavis.jpg'; // I had to scale it down to 240x240 manually
import AaronImg from './images/AaronHuskersonPhoto.jpg';
import ChanImg from './images/ChandlerDay.jpg';
import SeanImg from './images/SeanBoyd.jpg'

export default class About extends Component{
    constructor(props) {
        super(props);
    }

    renderCard(src, alt, title, text) {
        return (
            <Col xs={12} sm={6} md={4} lg={3}>
                <Card>
                    <CardImg top width="25%" src={src} alt="alt" />
                    <CardBody>
                        <CardTitle>{title}</CardTitle>
                        <CardText>{text}</CardText>
                    </CardBody>
                </Card>
            </Col>
        );
    }

    render() {
        return (
            <Container>
                <Row>
                    {this.renderCard(AaronImg, "Aaron Huskerson img", "Aaron Huskerson",
                        "I'm a junior majoring in Computer Science, and getting a minor in Music. " +
                        "I like to play piano, guitar, smash bros, and explore natural areas. ")}
                    {this.renderCard(CalImg, "Calvin Davis img", "Calvin Davis",
                        "Third Year CS student, Russian minor, AFROTC.")}
                    {this.renderCard(ChanImg, "Chandler Day img", "Chandler Day",
                    "I am a Third Year Computer Science major with a minor in Mathematics. I intend on graduating " +
                        "in May of 2020. I enjoy science fiction and fantasy, listening to music, and playing video games.")}
                    {this.renderCard(SeanImg, "Sean Boyd img", "Sean Boyd",
                    "Sean Boyd is pursuing a degree in computer engineering at Colorado State " +
                        "University. On the side, Sean is devloping a mobile app as an intern for Gerastay, " +
                        "a startup company. Sean enjoys snowboarding, online gaming, and doing hands on " +
                        "projects in his free time.")}
                </Row>
             

            </Container>
        )
    }
}