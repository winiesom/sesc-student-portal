import React, {useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/login/Login'
import Register from './components/register/Register'
import Layout from './components/layout/Layout';
import Courses from './components/pages/Courses';
import Enrolments from './components/pages/Enrolments';
import Eligibility from './components/pages/Eligibility';
import Profile from './components/pages/Profile';
import NotFound from "./components/NotFound"

import { useSelector } from 'react-redux'

const App = () => {
  const [user, setUser] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if(isLoggedIn) {
      setUser(true)
    }

  }, [isLoggedIn])


  const ProtectedRoute = ({children}) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
  
    return children;
  };

  return (
    <BrowserRouter>

    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<ProtectedRoute user={user}><Layout /></ProtectedRoute>}>
        <Route path="courses" element={<Courses />} />
        <Route path="enrolments" element={<Enrolments />} />
        <Route path="eligibility" element={<Eligibility />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
