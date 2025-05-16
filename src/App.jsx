import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import SelectSchool from './pages/SelectSchool';

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<SelectSchool />} />
      <Route path="/login"  element={<Login />} />
      {/* <Route path="/" element={<Home />} /> */}
      {/* <Route path="/about" element={<About />} /> */}
      {/* <Route path="/contact" element={<Contact />} /> */}
      {/* Add more routes as needed */}
    </Routes>
    </>
  )
}

export default App;