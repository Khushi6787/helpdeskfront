import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useEffect, useState } from 'react';
import axios from 'axios';
export default function AddTicket() {
  const nav = useNavigate();
  // const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const { id } = useParams();
  // const [selectedTicket, setSelectedTicket] = useState(null);
  // const [updatedata, SetData] = useState({})
  const [departments, setDepartments] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    department: '',
    priority: '',
    message: '',
    status: 'Open',
    user: ''
  });
  const [mode, setMode] = useState('add');
  // useEffect(() => {
  //   console.log("formData.user.user_name:", formData.user.user_name);
  //   console.log("users:", users);
  //   if (id) {
  //     axios.get(`http://localhost:8080/getbytid/${id}`)
  //       .then(response => {
  //         const ticketData = response.data;
  //         setFormData(ticketData);
  //         setMode('update');
  //       })
  //       .catch(error => {
  //         console.error('Failed to fetch ticket details:', error);
  //       });
  //   }
  // }, [id, formData.user.user_name, users]);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8080/getbytid/${id}`)
        .then(response => {
          const ticketData = response.data;
          setFormData(ticketData);
          console.log(ticketData)
          setMode('update');
          //console.log(ticketData.user.user_name)
          axios.get(`http://localhost:8080/getUserById/${ticketData.user.uid}`)
            .then(userResponse => {
              const userData = userResponse.data;
              setFormData(prevFormData => ({
                ...prevFormData,
                user: userData.user_name
              }));
              console.log(userResponse.data)
              console.log(userData)
            })
            .catch(error => {
              console.error('Failed to fetch user details:', error);
            });
        })
        .catch(error => {
          console.error('Failed to fetch ticket details:', error);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'add') {
      console.log(mode);
      try {
        const getUser = users.find(user => user.user_name === formData.user);
        const formDataWithUser = { ...formData, user: getUser };
        console.log(getUser);
        const response = await axios.post('http://localhost:8080/tickets', formDataWithUser);
        console.log('Ticket added successfully:', response.data);
        setFormData({
          subject: '',
          department: '',
          priority: '',
          message: '',
          status: 'Open',
          user: ''
        });
        nav("/viewticket")
      } catch (error) {
        console.error('Failed to add ticket:', error);
      }
    } else if (mode === 'update') {
      console.log(mode)
      try {
        const { tid, user, ...updatedData } = formData;
        console.log(formData)
        if (!tid) {
          throw new Error('Ticket ID is undefined');
        }
        const selectedUser = users.find(user => user.user_name === formData.user);
        if (!selectedUser) {
          throw new Error('Selected user not found');
        }
        const updatedDataWithUser = { ...updatedData, user: selectedUser };
        const response = await axios.put(`http://localhost:8080/updateTicket/${tid}/${selectedUser.uid}`, updatedDataWithUser);
        console.log('Ticket updated successfully:', response.data);

        nav('/viewticket');
      } catch (error) {
        console.error('Failed to update ticket:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      subject: '',
      department: '',
      priority: '',
      message: '',
      user: ''
    });
    nav('/viewticket');
  };
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
  const fetchPriorities = async () => {
    try {
      const response = await axios.get('http://localhost:8080/priority');
      if (response.status !== 200) {
        throw new Error('Failed to fetch priorities: ' + response.statusText);
      }
      const data = response.data;
      setPriorities(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchPriorities();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getAllUser');
      if (response.status !== 200) {
        throw new Error('Failed to fetch users: ' + response.statusText);
      }
      const data = response.data;
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
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
                    {mode === 'add' ? 'Add Ticket' : 'Update Ticket'}
                  </div>
                </li>
              </ol>
            </nav>
            <h3 className='text-2xl mt-4 mb-2'> {mode === 'add' ? 'Add Ticket' : 'Update Ticket'}</h3>
            <form className="space-y-6">
              <div className="flex flex-col space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      required
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex space-x-4 mb-4">
                    <div className="w-1/2">
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                        Department
                      </label>
                      <select required
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="form-select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select Department</option>
                        {departments.map((department) => (
                          <option key={department.did} value={department.dep_name}>{department.dep_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-1/2">
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                        Priority
                      </label>
                      <select required
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="form-select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select Priority</option>
                        {priorities.map((priority) => (
                          <option key={priority.pid} value={priority.p_level}>{priority.p_level}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea required
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="3"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                  User
                </label>
                <select required
                  id="user"
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  className="form-select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.uid} value={user.user_name}>{user.user_name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleSubmit}
                  type="submit"
                  value="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {mode === 'add' ? 'Add Ticket' : 'Update Ticket'}
                </button>
                <button
                  type="reset"
                  value="cancel"
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </>
  );
}
