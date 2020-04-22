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
                    <Route path={ROUTES.PUBLIC} component={Public} />
                    <SecureRoute path={ROUTES.PRIVATE} component={Private} auth={this.auth} rest={this.props} />
                    <SecureRoute path={ROUTES.PROFILE} component={Profile} auth={this.auth} rest={this.props} />
                    <SecureRoute
                        path={ROUTES.COURSE}
                        component={Courses}
                        auth={this.auth}
                        rest={this.props}
                        scopes={['read:courses']}
                    />
                    <SecureRoute path={ROUTES.ADMIN} component={Admin} auth={this.auth} rest={this.props} />
                </div>
            </>
        );
    }
}

export default App;
