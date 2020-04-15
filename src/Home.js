import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from './config';

class Home extends Component {
    render() {
        const { login, isAuthenticated } = this.props.auth;
        return (
            <div>
                <h1> Home </h1>
                {isAuthenticated() ? (
                    <Link to={ROUTES.PROFILE}> View Profile </Link>
                ) : (
                    <button onClick={login}> LOG IN </button>
                )}
            </div>
        );
    }
}

export default Home;
