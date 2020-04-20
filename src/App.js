import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

import Home from './Views/Home';
import Profile from './Views/Profile';
import Nav from './Components/Nav';
import Callback from './Callback';
import Auth from './Auth/Auth';
import { ROUTES } from './config';
import Public from './Views/Public';
import Private from './Views/Private';

class App extends Component {
    constructor(props) {
        super(props);
        this.auth = new Auth(this.props.history);
    }
    render() {
        const { isAuthenticated } = this.auth;
        return (
            <>
                <Nav auth={this.auth} />
                <div className="body">
                    <Route path={ROUTES.HOME} exact render={props => <Home auth={this.auth} {...props} />} />
                    <Route path={ROUTES.CALLBACK} render={props => <Callback auth={this.auth} {...props} />} />
                    <Route path={ROUTES.PUBLIC} component={Public} />
                    <Route
                        path={ROUTES.PRIVATE}
                        render={props =>
                            isAuthenticated() ? <Private auth={this.auth} {...props} /> : this.auth.login()
                        }
                    />
                    <Route
                        path={ROUTES.PROFILE}
                        render={props =>
                            isAuthenticated() ? <Profile auth={this.auth} {...props} /> : <Redirect to={ROUTES.HOME} />
                        }
                    />
                </div>
            </>
        );
    }
}

export default App;
