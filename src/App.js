import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

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
                <Nav auth={this.auth} />
                <div className="body">
                    <Route path={ROUTES.HOME} exact render={props => <Home auth={this.auth} {...props} />} />
                    <Route path={ROUTES.CALLBACK} render={props => <Callback auth={this.auth} {...props} />} />
                    <Route
                        path={ROUTES.PROFILE}
                        render={props =>
                            this.auth.isAuthenticated() ? (
                                <Profile auth={this.auth} {...props} />
                            ) : (
                                <Redirect to={ROUTES.HOME} />
                            )
                        }
                    />
                </div>
            </>
        );
    }
}

export default App;
