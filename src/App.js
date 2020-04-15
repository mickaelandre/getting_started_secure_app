import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Home from './Home';
import Profile from './Profile';
import Nav from './Nav';
import Callback from './Callback';
import Auth from './Auth/Auth';
import { ROUTES } from './config';

class App extends Component {
    constructor(props) {
        super(props);
        this.auth = new Auth(this.props.history);
    }

    render() {
        return (
            <>
                <Nav />
                <div className="body">
                    <Route path={ROUTES.HOME} exact render={props => <Home auth={this.auth} {...props} />} />
                    <Route path={ROUTES.CALLBACK} render={props => <Callback auth={this.auth} {...props} />} />
                    <Route path={ROUTES.PROFILE} component={Profile} />
                </div>
            </>
        );
    }
}

export default App;
