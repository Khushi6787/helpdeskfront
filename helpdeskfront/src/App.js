import { BrowserRouter,Routes,Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register'
import Dashboard from './components/Agent/Dashboard';
import AddTicket from './components/Agent/AddTicket';
import ViewTicket from './components/Agent/ViewTicket';
import ViewCustomer from './components/Agent/ViewCustomer';
import AddCustomer from './components/AddCustomer';
import MainDashBoard from './components/MailDashBoard';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/dummy" element={<MainDashBoard/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/addticket" element={<AddTicket/>}/>
      <Route path="/addticket/:id" element={<AddTicket/>}/>
      <Route path="/viewticket" element={<ViewTicket/>}/>
      <Route path="/addcustomer" element={<AddCustomer/>}/>
      <Route path="/addcustomer/:id" element={<AddCustomer/>}/>
      <Route path="/viewcustomer" element={<ViewCustomer/>}/>
    </Routes>  
  </BrowserRouter>
  );
}

export default App;
