import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from './config';

class Nav extends Component {
    render() {
        const { isAuthenticated, login, logout } = this.props.auth;
        return (
            <nav>
                <ul>
                    <li>
                        <Link to={ROUTES.HOME}> Home </Link>
                    </li>
                    <li>
                        <Link to={ROUTES.PROFILE}> Profile </Link>
                    </li>
                    <li style={styles.login}>
                        <button onClick={isAuthenticated() ? logout : login}>
                            {isAuthenticated() ? 'Log Out' : 'Log In'}
                        </button>
                    </li>
                </ul>
            </nav>
        );
    }
}

const styles = {
    login: {
        float: 'right'
    }
};

export default Nav;
