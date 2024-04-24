import React from 'react'
import { Link, useNavigate ,useParams} from 'react-router-dom';
import Header from './Agent/Header';
import Sidebar from './Agent/Sidebar';
import { useState,useEffect } from 'react';
import axios from 'axios';
function AddCustomer() {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    user_name: '',
    address: '',
    email: '',
    rid:3
  });
  const { id } = useParams();
  const [mode, setMode] = useState('add');
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8080/getuser/${id}`)
        .then(response => {
          const cusData = response.data;
          setFormData(cusData);
          console.log(cusData)
          setMode('update');

        })
        .catch(error => {
          console.error('Failed to fetch ticket details:', error);
        });
    }
  }, [id]);


  const handleCancel = () => {
    setFormData({
      user_name: '',
      address: '',
      email: ''
    });
    nav('/viewcustomer')
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'add') {
      console.log(mode);
      try {
        formData["rid"] = 3;
        const response = await axios.post('http://localhost:8080/users',formData);
        console.log(response.data);
        setFormData({
          user_name: '',
          address: '',
          email: '',
          role:'CUSTOMER'
        });
        console.log(setFormData)
        nav("/viewcustomer")
      } catch (error) {
        console.error('Failed to add ticket:', error);
      }
    } else if (mode === 'update') {
      console.log(mode)
      try {
        console.log(formData)
        if (!id) {
          throw new Error(' ID is undefined');
        }
       
       // const updatedDataWithUser = { ...updatedData, user: selectedUser };
        const response = await axios.put(`http://localhost:8080/updateCustomer/${id}`);
        nav('/dashboard');
      } catch (error) {
        console.error('Failed to update ticket:', error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
                  <Link to="/dashboard" className="text-gray-400 hover:text-gray-600">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    {mode === 'add' ? 'Add Customer' : 'Update Customer'} 
                  </div>
                </li>
              </ol>
            </nav>
            <h3 className='text-2xl mt-4 mb-2'> {mode === 'add' ? 'Add Customer' : 'Update Customer'} </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">
                      User Name
                    </label>
                    <input
                      required
                      type="text"
                      id="user_name"
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      required
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  type="submit" value="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                   {mode === 'add' ? 'Add Customer' : 'Update Customer'} 
                </button>
                <button
                  type="reset" value="cancel" onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
export default AddCustomer;