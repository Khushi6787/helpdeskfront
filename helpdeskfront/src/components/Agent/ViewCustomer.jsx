import { Link } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import axios from 'axios';
import { useState, useEffect } from 'react';
export default function ViewTicket() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [userData, setuserData] = useState([]);
   // const [tickets, setTickets] = useState([]);
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                if (user && user.role && user.role.r_name === 'SUPER_USER') {
                    const response = await axios.get(`http://localhost:8080/roles/customer`);
                    setuserData(response.data);
                } else if (user && user.role && user.role.r_name === 'AGENT') {
                    const response = await axios.get(`http://localhost:8080/roles/customer`);
                    setuserData(response.data);
                } else {
                    console.log("User or user ID is not available.");
                }
            } catch (error) {
                console.error('Failed to fetch tickets:', error);
            }
        };

        fetchCustomer();
    }, [user]);
    const handleDelete = async (uid) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete?");
            if (!confirmDelete) return;
            const response = await axios.delete(`http://localhost:8080/deleteCustomer/${uid}`);
            console.log(response.data);
        } catch (error) {
            console.error('Failed to delete ticket:', error.message);
        }
    };
    return (
        <>
            <Header />
            <Sidebar />
            <main className="ml-0 md:ml-60 pt-16 md:pt-20 max-h-screen overflow-auto">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="py-6 px-4 h-full">

                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-2 md:space-x-4 rtl:space-x-reverse">
                                <li className="inline-flex items-center">
                                    <Link to="/Dashboard" className="text-gray-400 hover:text-gray-600">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                        View Customer
                                    </div>
                                </li>
                            </ol>
                        </nav>


                        <div className="flex justify-between items-center">
                            <h3 className='text-2xl mt-4 mb-2'>View Customers</h3>
                            <div>
                                <Link to="/addcustomer">
                                    <button className="flex items-center justify-center w-12 h-12 bg-yellow-800 rounded-full text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400">
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-white-900 dark:text-gray-900">
                                <thead className="text-xs text-white uppercase bg-yellow-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Address
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {Array.isArray(userData) && userData.map(user => (
                                        <tr key={user.uid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">

                                            <td className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white">
                                                {user.user_name}
                                            </td>
                                            <td className="px-6 py-4 items-center">
                                                <p>{user.address}</p>
                                            </td>
                                            <td className="px-6 py-4 items-center">
                                                <p>{user.email}</p>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex">
                                                    <button onClick={() => handleDelete(user.uid)} className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark'>
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                    <Link className='text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark' to={`/addcustomer/${user.uid}`}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Link>
                                                </div>
                                            </td>



                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                    </div>
                </div>
            </main>
        </>
    );
}
