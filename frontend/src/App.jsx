import React from 'react'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import { createBrowserRouter,RouterProvider } from 'react-router'


const router = createBrowserRouter([{
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/login",
        element: <Login/>
      },
      {
        path: "/register",
        element: <Register/>
      },
      
    ]
  }])


function App() {
  
  return (
    <RouterProvider router={router} />
  )
}

export default App