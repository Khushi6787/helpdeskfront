import { Link } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import axios from 'axios';
import { useState, useEffect } from 'react';
export default function ViewTicket() {
    const fetchTickets = async () => {
        try {
            let response;
            if (user && user.role && user.role.r_name === 'SUPER_USER') {
                response = await axios.get(`http://localhost:8080/getT?pageNo=${page}&pageSize=5`, {
                    pageNo: page - 1,
                    size: itemperpage,
                });
            } else if (user && user.uid) {
                response = await axios.get(`http://localhost:8080/getAlltickets/${user.uid}?pageNo=${page}&pageSize=5`);
            } else {
                console.log("User or user ID is not available.");
                return;
            }
            setTickets(response.data.content);
            console.log(response.data.content)
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        }
    };

    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [tickets, setTickets] = useState([]);
    const itemperpage = 5;
    useEffect(() => {

        fetchTickets();
    }, [user, page]);

    const handlePrevPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
        }
    };
    const handleDelete = async (ticketId) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete?");
            if (!confirmDelete) return;
            const response = await axios.delete(`http://localhost:8080/deleteTicket/${ticketId}`);
            console.log(response.data);
            const updatedTickets = tickets.filter(ticket => ticket.tid !== ticketId);
            setTickets(updatedTickets);
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
                                        View Ticket
                                    </div>
                                </li>
                            </ol>
                        </nav>


                        <div className="flex justify-between items-center">
                            <h3 className='text-2xl mt-4 mb-2'>View Tickets</h3>
                            <div>
                                <Link to="/addticket">
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
                                            Subject
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            created At
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Department
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Priority
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Added by
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Message
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {Array.isArray(tickets) && tickets.map(ticket => (
                                        <tr key={ticket.tid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <td className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white">
                                                {ticket.subject}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(ticket.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 items-center">
                                                <p>{ticket.department}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ${ticket.priority === 'High' ? 'bg-red-200 dark:bg-red-700' : ticket.priority === 'Medium' ? 'bg-yellow-200 dark:bg-yellow-700' : 'bg-green-200 dark:bg-green-700'}`}>{ticket.priority}</span>
                                            </td>
                                            <td className="px-6 py-4 items-center">
                                                <p>{ticket.user.user_name}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p>{ticket.message}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center`}>
                                                    <div className={`h-2.5 w-2.5 rounded-full bg-${ticket.status === 'Open' ? 'green' : 'red'}-500 me-2`}></div>
                                                    {ticket.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex">
                                                    <button onClick={() => handleDelete(ticket.tid)} className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark'>
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                    <Link className='text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark' to={`/addticket/${ticket.tid}`}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-center mt-4">
                            <button
                                onClick={handlePrevPage}
                                disabled={page === 0}
                                className={`px-4 py-2 mr-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 ${page === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Previous
                            </button>
                            <span className="mx-4 text-gray-700">{`Page ${page + 1} of ${totalPages}`}</span>
                            <button
                                onClick={handleNextPage}
                                disabled={page === totalPages - 1}
                                className={`px-4 py-2 ml-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 ${page === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Next
                            </button>
                        </div>

                        {/* <Paginate
                            className="d-flex justify-content-end align-items-center"
                            count={totalPages}
                            page={page}

                            onChange={handleNextPage}
                            color="danger"
                        /> */}


                    </div>
                </div>
            </main>
        </>
    );
}
