import auth0 from 'auth0-js';

import { LOCAL_STORAGE_KEYS, ROUTES } from '../config';

let _idToken = null;
let _accessToken = null;
let _scopes = null;
let _expiresAt = null;

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
        _idToken = null;
        _accessToken = null;
        _scopes = null;
        _expiresAt = null;

        this.auth0.logout({
            clientID: process.env.REACT_APP_AUTH0_CLIENTID,
            returnTo: 'http://localhost:3000'
        });
    };

    setSession = authResponse => {
        _expiresAt = authResponse.expiresIn * 1000 + new Date().getTime();
        _scopes = authResponse.scope || this.requestedScopes || '';
        _accessToken = authResponse.accessToken;
        _idToken = authResponse.idToken;
        this.scheduleTokenRenewal();
    };

    handleAuthentification = () => {
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
    };

    isAuthenticated = () => new Date().getTime() < _expiresAt;

    getAccessToken = () => {
        if (!_accessToken) throw new Error('No access token found.');
        return _accessToken;
    };

    getProfile = callback => {
        if (this.userProfile) return callback(this.userProfile);
        this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
            if (profile) this.userProfile = profile;
            callback(profile, err);
        });
    };

    userHasScopes = scopes => {
        const grantedScopes = (_scopes || '').split(' ');
        return scopes.every(scope => grantedScopes.includes(scope));
    };

    renewToken = callback => {
        this.auth0.checkSession({}, (err, result) => {
            if (err) console.error(`Error: ${err.error} - ${err.description}.`);
            if (result) this.setSession(result);
            if (callback) callback(err, result);
        });
    };

    scheduleTokenRenewal = () => {
        const delay = _expiresAt - Date.now();
        if (delay > 0) setTimeout(() => this.renewToken(), delay);
    };
}
