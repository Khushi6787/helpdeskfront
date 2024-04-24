import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import axios from 'axios';
export default function Dashboard() {
    const [ticketCounts, setTicketCounts] = useState({});
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    useEffect(() => {
        const fetchTicketCounts = async () => {
            try {
                if (user && user.role && user.role.r_name === 'SUPER_USER') {
                    const response = await axios.get(`http://localhost:8080/ticketCounts`);
                    setTicketCounts(response.data);
                } else {
                    const response = await axios.get(`http://localhost:8080/ticketCounts/${user.uid}`);
                    setTicketCounts(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch ticket counts:', error);
            }
        };

        fetchTicketCounts();
    }, [user]);
    return (
        <div className="relative bg-yellow-50 overflow-hidden max-h-screen">
            <Header />
            <Sidebar />
            <main className="ml-0 md:ml-60 pt-16 md:pt-20 max-h-screen overflow-auto">
                <div className="bg-white py-12 sm:py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                            <div className="border-4 border-red-500 rounded-full shadow-lg w-48 h-48 flex flex-col items-center justify-center p-4">
                                <div className="text-3xl font-semibold text-gray-900">
                                    {ticketCounts['High'] || 0}
                                </div>
                                <dt className="text-base leading-7 text-gray-600 mb-2">High Priority Tickets</dt>
                            </div>
                            <div className="border-4 border-yellow-500 rounded-full shadow-lg w-48 h-48 flex flex-col items-center justify-center p-4">
                                <div className="text-3xl font-semibold text-gray-900">
                                    {ticketCounts['Medium'] || 0}
                                </div>
                                <dt className="text-base leading-7 text-gray-600 mb-2">Medium Priority Tickets</dt>
                            </div>
                            <div className="border-4 border-green-500 rounded-full shadow-lg w-48 h-48 flex flex-col items-center justify-center p-4">
                                <div className="text-3xl font-semibold text-gray-900">
                                    {ticketCounts['Low'] || 0}
                                </div>
                                <dt className="text-base leading-7 text-gray-600 mb-2">Low Priority Tickets</dt>
                            </div>
                        </dl>
                    </div>
                </div>
            </main>
        </div>
    );
}
