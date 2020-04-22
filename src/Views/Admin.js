import React, { Component } from 'react';
import { ROUTES } from '../config';

class Admin extends Component {
    state = {
        message: ''
    };

    async componentDidMount() {
        const { getAccessToken } = this.props.auth;
        const response = await fetch(ROUTES.ADMIN, { headers: { Authorization: `Bearer ${getAccessToken()}` } });
        if (response.status === 200) {
            const json = await response.json();
            this.setState({ message: json.message });
        } else if (response.status === 401) {
            this.setState({ message: 'You do not have access to this resource' });
        } else {
            console.error('Something goes wrong during the role fetch');
        }
    }

    render() {
        const { message } = this.state;
        return <p>{message}</p>;
    }
}

export default Admin;
