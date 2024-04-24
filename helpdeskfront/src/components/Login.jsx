import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [user_name, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [userError, setUserError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState('');
    const navigator = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Check if username and password are valid
        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/login', { user_name, password });
            console.log('Login successful:', response.data);
            localStorage.setItem('user', JSON.stringify({  uid: response.data.uid ,role: response.data.role}));
            
                navigator("/dashboard");
            
        } catch (error) {
            setError('Failed to login. Please check your credentials.');
        }
    };

    const validateForm = () => {
        let isValid = true;
        setUserError('');
        setPasswordError('');
        if (!user_name) {
            setUserError('Please enter your user name.');
            isValid = false;
        }
        if (!password) {
            setPasswordError('Please enter your password.');
            isValid = false;
        }
        return isValid;
    };

    const handleUserNameBlur = () => {
        if (!user_name) {
            setUserError('Please enter your user name.');
        }
    };

    const handlePasswordBlur = () => {
        if (!password) {
            setPasswordError('Please enter your password.');
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center image">
            <div className="overlay"></div>
            <div className="card p-5" style={{ width: '400px' }}>
                <h2 className="text-2xl mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="user_name" className="form-label">User Name</label>
                        <input
                            required
                            type="name"
                            className="form-control"
                            id="user_name"
                            placeholder="Enter user name"
                            value={user_name}
                            onChange={(e) => setUserName(e.target.value)}
                            onBlur={handleUserNameBlur}
                        />
                        <div className="text-danger">{userError}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            required
                            type="password"
                            className="form-control border border-gray-300 rounded-md"
                            id="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={handlePasswordBlur}
                        />
                        <div className="text-danger">{passwordError}</div>
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                </form>
                <div className="text-center mt-3">
                    <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
}
