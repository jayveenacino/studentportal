import { useState } from 'react'
import Body from './Body'
import Home from './Home'
import Signup from './Signup'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom'
import Root from './Root'
import Create from './Create'
import Login from './student/Login'
import Adminlogin from './Admin/Adminlogin'
import Notice from './student/Notice'
import AdminDashboard from './Admin/Admindashboard'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route index element={<Body />} />
      <Route path="Signup" element={<Signup />} />
      <Route path="Home" element={<Home />} />
      <Route path="Signup" element={<Signup />} />
      <Route path="Signup/Create" element={<Create />} />
      <Route path="Login" element={<Login />} />
      <Route path="Adminlogin" element={<Adminlogin />} />
      <Route path="Login/Notice" element={<Notice />} />
      <Route path="AdminDashboard" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  )
)

export default function App() {

  return (
    <RouterProvider router={router} />
  )
}
