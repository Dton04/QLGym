import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
     const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
            navigate.push('/login');
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">Đăng ký</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Tên người dùng" className="w-full p-2 border rounded" required />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" className="w-full p-2 border rounded" required />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Đăng ký</button>
                </form>
            </div>
        </div>
    );
}

export default Register;