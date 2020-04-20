import React, { Component } from 'react';

class Profile extends Component {
    state = {
        profile: null,
        error: ''
    };

    componentDidMount() {
        this.loadUserProfile();
    }

    loadUserProfile() {
        this.props.auth.getProfile((profile, error) => this.setState({ profile, error }));
    }

    render() {
        const { logout } = this.props.auth;
        const { profile } = this.state;
        if (!profile) return null;
        return (
            <>
                <h1>Profile</h1>
                <p>
                    Hello {profile.given_name}
                    {profile.family_name},
                </p>
                <img style={styles.profileImage} src={profile.picture} alt="profile" />
                <pre> {JSON.stringify(profile, null, 2)} </pre>
                <button onClick={logout}> logout </button>
            </>
        );
    }
}

const styles = {
    profileImage: {
        maxWidth: 50,
        maxHeight: 50
    }
};

export default Profile;
