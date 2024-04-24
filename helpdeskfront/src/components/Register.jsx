import React from 'react';
import './login.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const Register = () => {
    const [error, setError] = useState('');
    const [showToaster, setShowToaster] = useState(false);
    const nav = useNavigate();
    const [departments, setDepartments] = useState([]);
    // const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [formData, setFormData] = useState({
        user_name: '',
        email: '',
        password: '',
        department: '',
        otp: '',
        address: '',
        role: 1
    });

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/departments');
            if (response.status !== 200) {
                throw new Error('Failed to fetch departments: ' + response.statusText);
            }
            const data = response.data;
            setDepartments(data);

        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchDepartments();
    }, []);
    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleGetOTP = async () => {
        try {
            const response = await axios.post('http://localhost:8080/sendOTP', { email: formData.email });
            const data = response.data;
            setShowToaster(true);
            setTimeout(() => setShowToaster(false), 5000);
            setFormData({
                ...formData,
                otp: data.otp
            });
        } catch (error) {
            console.error('Failed to fetch OTP:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const otpResponse = await axios.post('http://localhost:8080/verifyOTP', {
                email: formData.email,
                code: formData.otp
            });
            //console.log(otpResponse);
            if (otpResponse.data === "OTP verified successfully") {
                const userResponse = await axios.post('http://localhost:8080/users', {
                    address: formData.address,
                    user_name: formData.user_name,
                    email: formData.email,
                    password: formData.password,
                    department: formData.department,
                });

                console.log('Registration successful:', userResponse.data);
                nav("/");
            } else {
                setError('OTP verification failed. Please enter the correct OTP.');
            }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className="p-5 regimage">
            <div className="overlay"></div>
            <div className="row justify-content-center align-items-center">
                <div className="col-12 col-lg-9 col-xl-7">
                    <div className="card shadow-2-strong card-registration" style={{ borderRadius: '15px' }}>
                        <div className="card-body p-4 p-md-5">
                            <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">Agent Register</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-outline mb-4">
                                    <label className="form-label">Name</label>
                                    <input type="name" name="user_name" className="form-control input-field" value={formData.user_name} onChange={handleChange} />
                                </div>
                                <div className="form-outline mb-4">
                                    <label className="form-label">Address</label>
                                    <input type="address" name="address" className="form-control input-field" value={formData.address} onChange={handleChange} />
                                </div>
                                <div className="form-outline mb-4">
                                    <label className="form-label">Email address</label>
                                    <input type="email" name="email" className="form-control input-field border border-gray-300 rounded-md" value={formData.email} onChange={handleChange} />
                                </div>
                                <div className="form-outline mb-4">
                                    <label className="form-label">OTP</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="otp"
                                            className="form-control input-field border border-gray-300 rounded-md"
                                            style={{ width: '70%' }}
                                            value={formData.otp}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            style={{ width: '30%' }}
                                            onClick={handleGetOTP}
                                        >
                                            GET OTP
                                        </button>
                                    </div>
                                    {showToaster && (
                                        <div className="toast text-bg-success" role="alert">
                                            <div className="toast-body">
                                                <div className="d-flex gap-4">
                                                    <span><i className="fa-solid fa-circle-check fa-lg"></i></span>
                                                    <div className="d-flex flex-grow-1 align-items-center">
                                                        <span className="fw-semibold">OTP sent successfully</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {error && <div className="text-danger mt-2">{error}</div>}
                                </div>

                                <div className="form-outline mb-4">
                                    <label className="form-label">Password</label>
                                    <input type="password" name="password" className="form-control input-field border border-gray-300 rounded-md" value={formData.password} onChange={handleChange} />
                                </div>
                                <div className="form-outline mb-4">
                                    <label className="form-label">Department</label>
                                    <select name="department" value={formData.department} onChange={handleChange} className="form-select input-field" style={{ border: '1px solid #ced4da', borderRadius: '5px' }}>
                                        <option value="">Select Department</option>
                                        {departments.map(department => (
                                            <option key={department.did} value={department.dep_name}>{department.dep_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="row">
                                    <div className="col-12 text-center">
                                        <button onClick={handleSubmit} className="btn btn-primary btn-block mb-4">
                                            Register Agent
                                        </button>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p>Already Have an account? <Link to="/">Sign in </Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default Register;
