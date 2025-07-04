
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './views/Login';
import Register from './views/Register';
import Schedule from './views/Schedule';
import CheckIn from './views/CheckIn';
import WorkoutPlan from './views/WorkoutPlan';
import Navbar from './components/Navbar';
function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    return (
        <Router>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-center mb-4">Quản lý phòng Gym</h1>
                <Routes>
                    <Route path="/" element={<Navbar />} />
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/register" element={<Register />} />
                        <Route path="/navbar" element={<Schedule token={token} />} />
                    <Route path="/schedule" element={<Schedule token={token} />} />
                    <Route path="/checkin" element={<CheckIn token={token} />} />
                    <Route path="/workout" element={<WorkoutPlan token={token} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;