import auth0 from 'auth0-js';

import { LOCAL_STORAGE_KEYS, ROUTES } from '../config';

export default class Auth {
    constructor(history) {
        this.history = history;
        this.userProfile = null;
        this.auth0 = new auth0.WebAuth({
            domain: process.env.REACT_APP_AUTH0_DOMAIN,
            clientID: process.env.REACT_APP_AUTH0_CLIENTID,
            redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
            responseType: 'token id_token',
            scope: 'openid profile email'
        });
    }

    login = () => {
        this.auth0.authorize();
    };

    logout = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ID_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.EXPIRES_AT);
        this.userProfile = null;
        this.auth0.logout({
            clientID: process.env.REACT_APP_AUTH0_CLIENTID,
            returnTo: 'http://localhost:3000'
        });
    };

    setSession = authResponse => {
        const expiresAt = JSON.stringify(authResponse.expiresIn * 1000 + new Date().getTime());
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, authResponse.accessToken);
        localStorage.setItem(LOCAL_STORAGE_KEYS.ID_TOKEN, authResponse.idToken);
        localStorage.setItem(LOCAL_STORAGE_KEYS.EXPIRES_AT, expiresAt);
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
                this.history.push(ROUTES.HOME);
            }
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
}
