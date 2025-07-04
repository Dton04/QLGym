import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const isActive = (path) => location.pathname === path ? 'nav-link active fw-bold' : 'nav-link';

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold text-primary" to="/">GymTracker</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/schedule" className={isActive('/schedule')}>Lịch tập</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/checkin" className={isActive('/checkin')}>Điểm danh</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/workout" className={isActive('/workout')}>Kế hoạch tập</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            {token ? (
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        navigate('/login');
                                    }}
                                    className="btn btn-danger ms-2"
                                >
                                    Đăng xuất
                                </button>
                            ) : (
                                <Link to="/login" className="btn btn-primary ms-2">Đăng nhập</Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;