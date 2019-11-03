import React, { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [welcome, setWelcome] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => {
        console.log(res)
        res.json()
      })
      .then(data => {
        console.log(data)
        setWelcome(data)
      })
      .catch(err => {
        console.error(err)
      })
  })

  return <div className="App">Message from server: {welcome}</div>
}

export default App
