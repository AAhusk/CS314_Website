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

    render() {
        return (
            //<h1>About Page</h1>

            <Container>
                <Row xs={12} sm={6} md={4} lg={3}>
                    <Card>
                        <CardImg top width="25%" src={AaronImg} alt="Aaron Huskerson img" />
                        <CardBody>
                            <CardTitle>Aaron Huskerson</CardTitle>
                            <CardText>I'm a junior majoring in Computer Science, and getting a minor in Music. I like to play piano, guitar, smash bros, and explore natural areas. </CardText>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardImg top width="25%" src={CalImg}  alt="Calvin Davis img" />
                        <CardBody>
                            <CardTitle>Calvin Davis</CardTitle>
                            <CardText>Third Year CS student, Russian minor, AFROTC.</CardText>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardImg top width="25%" src={ChanImg}  alt="Chandler Day img" />
                        <CardBody>
                            <CardTitle>Chandler Day</CardTitle>
                            <CardText>I am a Third Year Computer Science major with a minor in Mathematics. I intend on graduating in May of 2020. I enjoy science fiction and fantasy, listening to music, and playing video games.</CardText>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardImg top width="25%" src={SeanImg}  alt="Sean Boyd Image" />
                        <CardBody>
                            <CardTitle>Sean Boyd</CardTitle>
                            <CardText> Sean Boyd is pursuing a degree in computer engineering at Colorado State
                                       University. On the side, Sean is devloping a mobile app as an intern for Gerastay,
                                       a startup company. Sean enjoys snowboarding, online gaming, and doing hands on
                                       projects in his free time.
                            </CardText>
                        </CardBody>
                    </Card>
                </Row>
            </Container>
        )
    }
}


// const Example = (props) => {
//     render() {
//         return (
//             <div>
//                 <Card>
//                     <CardImg top width="25%" src="./images/CalvinDavis.jpg" alt="Calvin Davis img" />
//                     <CardBody>
//                         <CardTitle>Calvin Davis</CardTitle>
//                         <CardText>Third year CS major ready to rock and roll.</CardText>
//                     </CardBody>
//                 </Card>
//             </div>
//         );
//     }
// };
//
// export default Example;
