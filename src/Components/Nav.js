import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../config';

class Nav extends Component {
    render() {
        const { isAuthenticated, login, logout, userHasScopes } = this.props.auth;
        return (
            <nav>
                <ul>
                    <li>
                        <Link to={ROUTES.HOME}> Home </Link>
                    </li>
                    <li>
                        <Link to={ROUTES.PROFILE}> Profile </Link>
                    </li>
                    <li>
                        <Link to={ROUTES.PUBLIC}> Public </Link>
                    </li>
                    {isAuthenticated() && (
                        <li>
                            <Link to={ROUTES.PRIVATE}> Private </Link>
                        </li>
                    )}
                    {isAuthenticated() && userHasScopes(['read:courses']) && (
                        <li>
                            <Link to={ROUTES.COURSE}> Courses </Link>
                        </li>
                    )}
                    {isAuthenticated() && (
                        <li>
                            <Link to={ROUTES.ADMIN}> Admin </Link>
                        </li>
                    )}
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
