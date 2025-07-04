import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PlusCircleIcon, UserIcon, UsersIcon } from '@heroicons/react/24/solid';
import '../styles/Schedule.css';

const DAY_MAPPING = {
  'Thứ Hai': 'Monday',
  'Thứ Ba': 'Tuesday',
  'Thứ Tư': 'Wednesday',
  'Thứ Năm': 'Thursday',
  'Thứ Sáu': 'Friday',
  'Thứ Bảy': 'Saturday',
  'Chủ Nhật': 'Sunday'
};

const DAYS = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

function Schedule({ token }) {
    const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '' }]);
    const [selectedDays, setSelectedDays] = useState([]);
    const [weeklySchedules, setWeeklySchedules] = useState({});
    const [userSchedules, setUserSchedules] = useState({});
    const [viewMode, setViewMode] = useState('personal'); // 'personal', 'all', 'add'
    const [error, setError] = useState(''); // State để hiển thị lỗi
    const [loading, setLoading] = useState(false); // State để hiển thị trạng thái tải
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            console.log('Token is missing, redirecting to login');
            navigate('/login');
            return;
        }
        console.log('Token:', token); // Log token để debug
        if (viewMode === 'all') fetchWeeklySchedules();
        if (viewMode === 'personal') fetchUserSchedules();
    }, [token, navigate, viewMode]);

    const fetchWeeklySchedules = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/schedules/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const schedulesByDay = {};
            res.data.forEach(schedule => {
                schedule.dayOfWeek.forEach(day => {
                    schedulesByDay[day] = schedulesByDay[day] || [];
                    schedulesByDay[day].push(...schedule.exercises.map(ex => ({
                        ...ex,
                        userId: schedule.userId?._id?.toString() || schedule.userId.toString(),
                        username: schedule.userId?.username || 'Unknown'
                    })));
                });
            });
            setWeeklySchedules(schedulesByDay);
            setError(''); // Xóa lỗi khi lấy dữ liệu thành công
        } catch (err) {
            console.error('Error fetching weekly schedules:', err.response?.data || err);
            setError(err.response?.data?.msg || 'Lỗi khi lấy tất cả lịch tập. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserSchedules = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/schedule/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const schedulesByDay = {};
            res.data.forEach(schedule => {
                schedule.dayOfWeek.forEach(day => {
                    schedulesByDay[day] = schedulesByDay[day] || [];
                    schedulesByDay[day].push(...schedule.exercises.map(ex => ({
                        ...ex,
                        userId: schedule.userId?._id?.toString() || schedule.userId.toString(),
                        username: schedule.userId?.username || 'Unknown'
                    })));
                });
            });
            setUserSchedules(schedulesByDay);
            setError(''); // Xóa lỗi khi lấy dữ liệu thành công
        } catch (err) {
            console.error('Error fetching user schedules:', err.response?.data || err);
            setError(err.response?.data?.msg || 'Lỗi khi lấy lịch tập cá nhân. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Xóa lỗi cũ
        setLoading(true);
        try {
            // Kiểm tra dữ liệu đầu vào
            if (selectedDays.length === 0) {
                setError('Vui lòng chọn ít nhất một ngày.');
                return;
            }
            if (exercises.some(ex => !ex.name.trim() || !ex.sets || !ex.reps)) {
                setError('Vui lòng điền đầy đủ và hợp lệ thông tin cho tất cả bài tập.');
                return;
            }
            if (exercises.some(ex => isNaN(ex.sets) || isNaN(ex.reps) || ex.sets <= 0 || ex.reps <= 0)) {
                setError('Số hiệp và số lần phải là số dương.');
                return;
            }

            // Ánh xạ ngày sang tiếng Anh
            const mappedDays = selectedDays.map(day => DAY_MAPPING[day]);

            // Chuyển sets và reps thành số
            const formattedExercises = exercises.map(ex => ({
                name: ex.name.trim(),
                sets: Number(ex.sets),
                reps: Number(ex.reps)
            }));

            await axios.post(
                'http://localhost:5000/api/schedule',
                { dayOfWeek: mappedDays, exercises: formattedExercises },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await Promise.all([fetchWeeklySchedules(), fetchUserSchedules()]);
            setExercises([{ name: '', sets: '', reps: '' }]);
            setSelectedDays([]);
            setViewMode('personal');
            setError('Lịch tập đã được lưu thành công!');
        } catch (err) {
            console.error('Error in handleSubmit:', err.response?.data || err);
            setError(err.response?.data?.msg || 'Có lỗi xảy ra khi lưu lịch tập. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddExercise = () => {
        setExercises([...exercises, { name: '', sets: '', reps: '' }]);
    };

    const toggleDaySelection = (day) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Navbar />

            {/* Hiển thị trạng thái tải */}
            {loading && (
                <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
                    Đang tải...
                </div>
            )}

            {/* Hiển thị thông báo lỗi hoặc thành công */}
            {error && (
                <div className={`mb-4 p-4 rounded-lg ${error.includes('thành công') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {error}
                </div>
            )}

            {/* Nút điều hướng */}
            <div className="flex justify-center space-x-4 mb-8">
                <button
                    onClick={() => setViewMode('add')}
                    className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors ${
                        viewMode === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white'
                    }`}
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Thêm lịch tập
                </button>
                <button
                    onClick={() => setViewMode('personal')}
                    className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors ${
                        viewMode === 'personal' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white'
                    }`}
                >
                    <UserIcon className="w-5 h-5 mr-2" />
                    Lịch tập cá nhân
                </button>
                <button
                    onClick={() => setViewMode('all')}
                    className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors ${
                        viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white'
                    }`}
                >
                    <UsersIcon className="w-5 h-5 mr-2" />
                    Tất cả lịch tập
                </button>
            </div>

            {/* Form thêm lịch tập */}
            {viewMode === 'add' && (
                <div className="bg-white shadow-2xl rounded-xl p-6 mb-8 border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Thêm lịch tập mới</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
                            {DAYS.map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => toggleDaySelection(day)}
                                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                                        selectedDays.includes(day)
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-800 hover:bg-blue-100'
                                    }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                        <div className="text-sm text-gray-600 mb-4">Ngày đã chọn: {selectedDays.join(', ') || 'Chưa chọn ngày'}</div>
                        {exercises.map((exercise, index) => (
                            <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                <input
                                    type="text"
                                    value={exercise.name}
                                    onChange={(e) => {
                                        const newExercises = [...exercises];
                                        newExercises[index].name = e.target.value;
                                        setExercises(newExercises);
                                    }}
                                    placeholder="Tên bài tập (VD: Squat)"
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="number"
                                    value={exercise.sets}
                                    onChange={(e) => {
                                        const newExercises = [...exercises];
                                        newExercises[index].sets = e.target.value;
                                        setExercises(newExercises);
                                    }}
                                    placeholder="Số hiệp"
                                    className="w-full sm:w-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    required
                                />
                                <input
                                    type="number"
                                    value={exercise.reps}
                                    onChange={(e) => {
                                        const newExercises = [...exercises];
                                        newExercises[index].reps = e.target.value;
                                        setExercises(newExercises);
                                    }}
                                    placeholder="Số lần"
                                    className="w-full sm:w-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    required
                                />
                            </div>
                        ))}
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={handleAddExercise}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Thêm bài tập
                            </button>
                            <button
                                type="submit"
                                disabled={selectedDays.length === 0 || loading}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    selectedDays.length === 0 || loading
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                Lưu lịch tập
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lịch tập cá nhân */}
            {viewMode === 'personal' && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Lịch tập cá nhân</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
                        {DAYS.map(day => (
                            <div
                                key={day}
                                className={`p-4 rounded-xl shadow-md transition-all ${
                                    userSchedules[DAY_MAPPING[day]]?.length > 0
                                        ? 'bg-blue-50 hover:bg-blue-100 border-blue-200'
                                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                                } border`}
                            >
                                <h3 className="font-semibold text-lg text-gray-800 mb-2">{day}</h3>
                                {userSchedules[DAY_MAPPING[day]]?.length > 0 ? (
                                    userSchedules[DAY_MAPPING[day]].map((ex, i) => (
                                        <div key={i} className="text-sm text-gray-700">
                                            <span className="font-medium">{ex.name}</span>: {ex.sets} hiệp x {ex.reps} lần
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500">Chưa có lịch tập</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tất cả lịch tập */}
            {viewMode === 'all' && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Tất cả lịch tập trong tuần</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
                        {DAYS.map(day => (
                            <div
                                key={day}
                                onClick={() => toggleDaySelection(day)}
                                className={`p-4 rounded-xl shadow-md cursor-pointer transition-all ${
                                    selectedDays.includes(day)
                                        ? 'bg-blue-600 text-white'
                                        : weeklySchedules[DAY_MAPPING[day]]?.length > 0
                                        ? 'bg-green-50 hover:bg-green-100 border-green-200'
                                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                                } border`}
                            >
                                <h3 className="font-semibold text-lg mb-2">{day}</h3>
                                {weeklySchedules[DAY_MAPPING[day]]?.length > 0 ? (
                                    weeklySchedules[DAY_MAPPING[day]].map((ex, i) => (
                                        <div key={i} className="text-sm">
                                            <span className="font-medium">{ex.name}</span>: {ex.sets} hiệp x {ex.reps} lần
                                            (Người dùng {ex.username || ex.userId.slice(-4)})
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500">Chưa có lịch tập</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Schedule;