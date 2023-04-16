import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/login/Login'
import Register from './components/register/Register'
import Dashboard from './components/dashboard/Dashboard'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
