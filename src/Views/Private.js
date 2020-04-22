import React, { Component } from 'react';
import { ROUTES } from '../config';

class Private extends Component {
    state = {
        message: ''
    };

    async componentDidMount() {
        try {
            const { getAccessToken } = this.props.auth;
            const response = await fetch(ROUTES.PRIVATE, { headers: { Authorization: `Bearer ${getAccessToken()}` } });
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

export default Private;
