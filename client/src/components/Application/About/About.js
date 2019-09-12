import React, {Component} from 'react'
import { Card, CardImg, CardText, CardBody, CardTitle, Container, Row} from 'reactstrap';

import CalImg from './images/CalvinDavis.jpg'; // I had to scale it down to 240x240 manually



export default class About extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            //<h1>About Page</h1>

            <Container>
                <Row>
                    <Card>
                        <CardImg top width="25%" src={CalImg} alt="Calvin Davis img" />
                        <CardBody>
                            <CardTitle>Calvin Davis</CardTitle>
                            <CardText>Third Year CS student ready to rock and roll.</CardText>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardImg top width="25%" src={CalImg}  alt="Calvin Davis img" />
                        <CardBody>
                            <CardTitle>Calvin Davis</CardTitle>
                            <CardText>Third Year CS student.</CardText>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardImg top width="25%" src={CalImg}  alt="Calvin Davis img" />
                        <CardBody>
                            <CardTitle>Calvin Davis</CardTitle>
                            <CardText>Third Year CS student.</CardText>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardImg top width="25%" src={CalImg}  alt="Calvin Davis img" />
                        <CardBody>
                            <CardTitle>Calvin Davis</CardTitle>
                            <CardText>Third Year CS student.</CardText>
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