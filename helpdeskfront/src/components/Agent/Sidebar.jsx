import React from 'react';
import { Link } from 'react-router-dom';
import './AddTicket';
import '../AddCustomer';
export default function Sidebar() {
    return (
        <aside className="fixed inset-y-0 left-0 bg-white shadow-md w-full md:w-60 overflow-auto">
            <div className="flex flex-col justify-between h-full">
                <div className="flex-grow">
                    <div className="px-4 py-6 text-center border-b">
                        <h1 className="text-xl md:text-2xl font-bold leading-none"><span className="text-yellow-700">Help Desk</span> App</h1>
                    </div>
                    <div className="p-4">
                        <div className="overflow-y-auto overflow-x-hidden flex-grow">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    <i className="fa fa-ticket mr-2" aria-hidden="true"></i><Link to="/viewticket"> View Tickets</Link>
                                </label>
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    <i className="fa fa-users mr-2" aria-hidden="true"></i>
                                    <Link to="/viewcustomer">View Customer</Link>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
