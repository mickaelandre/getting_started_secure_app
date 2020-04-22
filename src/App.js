import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Home from './Views/Home';
import Profile from './Views/Profile';
import Nav from './Components/Nav';
import Callback from './Callback';
import Auth from './Auth/Auth';
import { ROUTES } from './config';
import Public from './Views/Public';
import Private from './Views/Private';
import Courses from './Views/Courses';
import Admin from './Views/Admin';
import SecureRoute from './SecureRoute';
import AuthContext from './Auth/AuthContext';
import PublicRoute from './PublicRoute';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: new Auth(this.props.history)
        };
    }
    render() {
        const { auth } = this.state;
        return (
            <AuthContext.Provider value={auth}>
                <Nav auth={auth} />
                <div className="body">
                    <Route path={ROUTES.PUBLIC} component={Public} />
                    <PublicRoute exact path={ROUTES.HOME} component={Home} />
                    <PublicRoute path={ROUTES.CALLBACK} component={Callback} />
                    <SecureRoute path={ROUTES.PRIVATE} component={Private} rest={this.props} />
                    <SecureRoute path={ROUTES.PROFILE} component={Profile} rest={this.props} />
                    <SecureRoute path={ROUTES.COURSE} component={Courses} rest={this.props} scopes={['read:courses']} />
                    <SecureRoute path={ROUTES.ADMIN} component={Admin} rest={this.props} />
                </div>
            </AuthContext.Provider>
        );
    }
}

export default App;
