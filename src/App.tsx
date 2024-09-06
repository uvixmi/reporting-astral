import React from "react"
import logo from "./logo.svg"
import "./App.css"
import Reportings from "./Reportings"
import { useAuth } from "./AuthContext"
import { Auth } from "./Auth"

function App() {
  const { role } = useAuth()
  return (
    <div className="App">{role === "account" ? <Reportings /> : <Auth />}</div>
  )
}

export default App
