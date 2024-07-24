import SignUp from './SignUp';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Home from './Home';

const App = () => {
    return (
        <div>

            <Router>

                <nav className="navbar">
                    <ul className="nav-list">
                        <li className="nav-item">
                            <Link to="/Login" className="nav-link">Login</Link>
                        </li>
                        <li>
                            <Link to="/SignUp" className="nav-link">SignUp</Link>
                        </li>
                        <li>
                            <Link to="/Home" className="nav-link">Home</Link>
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/Login" element={<Login />} />
                    <Route path="/SignUp" element={<SignUp />} />
                    <Route path="/Home" element={<Home />} />
                </Routes>
            </Router>

        </div>

    );
};

export default App;

