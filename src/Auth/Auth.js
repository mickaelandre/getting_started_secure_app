import auth0 from 'auth0-js';

import { LOCAL_STORAGE_KEYS, ROUTES } from '../config';

export default class Auth {
    constructor(history) {
        this.history = history;
        this.userProfile = null;
        this.requestedScopes = 'openid profile email read:courses';
        this.auth0 = new auth0.WebAuth({
            domain: process.env.REACT_APP_AUTH0_DOMAIN,
            clientID: process.env.REACT_APP_AUTH0_CLIENTID,
            redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            responseType: 'token id_token',
            scope: this.requestedScopes
        });
    }

    login = () => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.REDIRECTION_ON_LOGIN, JSON.stringify(this.history.location));
        this.auth0.authorize();
    };

    logout = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ID_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.EXPIRES_AT);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.SCOPES);
        this.userProfile = null;
        this.auth0.logout({
            clientID: process.env.REACT_APP_AUTH0_CLIENTID,
            returnTo: 'http://localhost:3000'
        });
    };

    setSession = authResponse => {
        const expiresAt = JSON.stringify(authResponse.expiresIn * 1000 + new Date().getTime());
        const scopes = authResponse.scope || this.requestedScopes || '';
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, authResponse.accessToken);
        localStorage.setItem(LOCAL_STORAGE_KEYS.ID_TOKEN, authResponse.idToken);
        localStorage.setItem(LOCAL_STORAGE_KEYS.EXPIRES_AT, expiresAt);
        localStorage.setItem(LOCAL_STORAGE_KEYS.SCOPES, JSON.stringify(scopes));
    };

    handleAuthentification() {
        this.auth0.parseHash((err, authResponse) => {
            if (err) {
                this.history.push(ROUTES.HOME);
                alert(`Something goes wrong : ${err.error} - Check the console for further details`);
                console.log(err);
            }
            if (authResponse && authResponse.accessToken && authResponse.idToken) {
                this.setSession(authResponse);
                const redirectLocation =
                    localStorage.getItem(LOCAL_STORAGE_KEYS.REDIRECTION_ON_LOGIN) === 'undefined'
                        ? ROUTES.HOME
                        : JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.REDIRECTION_ON_LOGIN));
                this.history.push(redirectLocation);
            }
            localStorage.removeItem(LOCAL_STORAGE_KEYS.REDIRECTION_ON_LOGIN);
        });
    }

    isAuthenticated() {
        const expiresAt = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.EXPIRES_AT));
        return new Date().getTime() < expiresAt;
    }

    getAccessToken = () => {
        const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        if (!accessToken) throw new Error('No access token found.');
        return accessToken;
    };

    getProfile = callback => {
        if (this.userProfile) return callback(this.userProfile);
        this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
            if (profile) this.userProfile = profile;
            callback(profile, err);
        });
    };

    userHasScopes = scopes => {
        const grantedScopes = (JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SCOPES)) || '').split(' ');
        return scopes.every(scope => grantedScopes.includes(scope));
    };
}
