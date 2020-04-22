import React, { Component } from 'react';
import { ROUTES } from '../config';

class Public extends Component {
    state = {
        message: ''
    };

    async componentDidMount() {
        try {
            const response = await fetch(ROUTES.PUBLIC);
            const json = await response.json();
            this.setState({ message: json.message });
        } catch (e) {
            this.setState({ message: e.message });
        }
    }

    render() {
        return <p>{this.state.message}</p>;
    }
}

export default Public;
