import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from './config';

class Nav extends Component {
    render() {
        return (
            <nav>
                <ul>
                    <li>
                        <Link to={ROUTES.HOME}> Home </Link>
                    </li>
                    <li>
                        <Link to={ROUTES.PROFILE}> Profile </Link>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default Nav;
