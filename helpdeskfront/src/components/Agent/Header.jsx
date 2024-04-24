import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Header() {
    const nav = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [userName, setUserName] = useState('');
    const [roleName, setRoleName] = useState('');
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown); // Toggle dropdown visibility
    };
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        console.log(userData)
        if (userData) {
            const { role } = userData;
            if (role && role.r_name) {
                setRoleName(role.r_name);
            }
        }
    }, []);
    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem('user')).uid;
        axios.get(`http://localhost:8080/getUserById/${userId}`)
            .then(response => {
                setUserName(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch user name:', error);
            });
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('user');
        nav("/");
    };

    return (
        <header className="fixed right-0 top-0 left-0 md:left-60 bg-yellow-50 py-3 px-4 md:py-6 md:px-8 h-16 md:h-20">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <h1 className="text-xl md:text-2xl font-bold">
                        <span className="text-yellow-700">{roleName}</span> Login
                    </h1>
                </div>
                {/* <div className="flex items-center">
                    <div className="flex items-center">
                        <button className="text-white bg-yellow-700 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-700 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-700">
                        <span className="mr-2">{userName}</span>
                        <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                        </button>
                    </div>
                </div> */}
                <div className="relative">
                    <button
                        type="button"
                        className="relative z-10 text-white bg-yellow-700 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-700 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-700"
                        onClick={toggleDropdown}
                    >
                        <span className="mr-2">{userName}</span>
                        <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-20">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
