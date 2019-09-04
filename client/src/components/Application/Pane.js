import React, { Component } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

/*
 * Renders a pane out of a Card, with a Header and Body component.
 */
export default class Pane extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card>
                <CardHeader className='bg-csu-gold text-white font-weight-semibold'>
                    {this.props.header}
                </CardHeader>
                <CardBody>
                    {this.props.bodyJSX}
                </CardBody>
            </Card>
        );
    }
}
