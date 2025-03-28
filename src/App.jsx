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
      <Route path="signup" element={<Signup />} />
      <Route path="home" element={<Home />} />
      <Route path="signup" element={<Signup />} />
      <Route path="Ssgnup/create" element={<Create />} />
      <Route path="login" element={<Login />} />
      <Route path="adminlogin" element={<Adminlogin />} />
      <Route path="login/notice" element={<Notice />} />
      <Route path="adminDashboard" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  )
)

export default function App() {

  return (
    <RouterProvider router={router} />
  )
}
