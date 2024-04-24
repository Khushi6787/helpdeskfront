import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Dashboard from './Agent/Dashboard';

export default function MainDashBoard() {
    const data = JSON.parse(localStorage.getItem("user")) || null;
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (data !== null && user === null) {
            try {
                console.log(data);
                if (data && data.uid) {
                    axios.get(`http://localhost:8080/getuser/${data.uid}`)
                        .then((res) => {
                            setUser(res.data);
                            
                        })
                        .catch(err => {
                            console.error(err);
                        });
                } else {
                    console.log("User or user ID is not available.");
                }
            } catch (error) {
                console.error('Failed to fetch Data:', error);
            }
        }
        console.log(user)
    }, [user, data]);

    return (
    <>
        {user!==null && <div>
            {user.roles==='SUPER_USER' && <Dashboard/>}
        </div>}

    </>
    )
}
