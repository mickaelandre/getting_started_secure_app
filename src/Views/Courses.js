import React, { Component } from 'react';
import { ROUTES } from '../config';

class Courses extends Component {
    state = {
        courses: []
    };

    async componentDidMount() {
        try {
            const { getAccessToken } = this.props.auth;
            const response = await fetch(ROUTES.COURSE, { headers: { Authorization: `Bearer ${getAccessToken()}` } });
            const json = await response.json();
            this.setState({ courses: json.courses });
        } catch (e) {
            console.error('Something goes wrong during the courses fetch');
        }
    }

    render() {
        const { courses } = this.state;
        return (
            <ul>
                {courses.map(course => {
                    return <li key={course.id}> {course.title}</li>;
                })}
            </ul>
        );
    }
}

export default Courses;
