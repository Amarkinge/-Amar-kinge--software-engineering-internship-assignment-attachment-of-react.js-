/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import './App.css'
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import { User } from './types';

const App: React.FC = () => {

  const isUserLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  //const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('isLoggedIn')) || false);
  const [user, setUser] = useState<User | null>(null);
  const userLoginStatusRef = useRef(isUserLoggedIn);


  useEffect(() => {
    if (isUserLoggedIn) {
      userLoginStatusRef.current = true;
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    }
    else {
      userLoginStatusRef.current = false;
    }
  }, [isUserLoggedIn]);



  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.setItem("userBookmarks", '[]');
    userLoginStatusRef.current = false;
    setUser(null);
    window.location.reload();
  }


  const handleLogin = (status: boolean, user: User) => {
    userLoginStatusRef.current = status;
    localStorage.setItem("isLoggedIn", "true");
    setUser(user);
  }

  return (
      <Router>
        <header>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
            <div className="container-fluid">
              <Link className="navbar-brand text-white" to="/">My Recipes</Link>
              <button className="navbar-toggler text-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                {
                  userLoginStatusRef.current ?
                    (

                      <ul className="navbar-nav mb-2 mb-lg-0 d-flex position-absolute">
                        <li className="nav-item">
                          <Link className="nav-link text-white" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item dropdown">
                          <a className="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {user?.name}
                          </a>
                          <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
                          </ul>
                        </li>
                      </ul>

                    )
                    :
                    (

                      <ul className="navbar-nav mb-2 mb-lg-0 d-flex align-content-end">
                        <li className="nav-item">
                          <Link className="mr-2 nav-link" to="/login">Login</Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to="/register">Register</Link>
                        </li>
                      </ul>

                    )

                }
              </div>
            </div>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home loginStatus={userLoginStatusRef.current} />} />
            <Route path="/login" element={<Login onLogggedIn={(s: boolean, u: User) => handleLogin(s, u)} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </Router>
  );
};

export default App;