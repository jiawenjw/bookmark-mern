import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route} from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"

import Homepage from "./route/Homepage"
import Loginpage from "./route/Loginpage"
import Registerpage from "./route/Registerpage"
import PrivateRoute from "./utils/PrivateRoute"



const App = () => {

 
    return (
      <Router>
        <AuthProvider>
          <PrivateRoute component={Homepage} path="/" exact/>
          <Route component={Loginpage} path="/login" exact/>
          <Route component={Registerpage} path="/register" exact/>
        </AuthProvider>
      </Router>
  )
}



export default App

