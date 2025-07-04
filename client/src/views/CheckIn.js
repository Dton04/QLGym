import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isToday,
    subMonths,
    addMonths,
    getDay,
    isSameMonth,
} from 'date-fns';
import { vi } from 'date-fns/locale';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/CheckIn.css';

function CheckIn({ token }) {
    const [checkIns, setCheckIns] = useState([]);
    const [stats, setStats] = useState({ totalDays: 0, presentDays: 0, absentDays: 0 });
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isCheckedInToday, setIsCheckedInToday] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) navigate('/login');
        fetchCheckIns();
    }, [token, navigate]);

    const fetchCheckIns = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/checkin', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCheckIns(res.data || []);
            const present = res.data.filter((c) => c.status === 'checked-in').length;
            const total = res.data.length;
            setStats({
                totalDays: total,
                presentDays: present,
                absentDays: total - present,
            });
            const today = format(new Date(), 'yyyy-MM-dd');
            const checkedInToday = res.data.some(
                (c) => format(new Date(c.date), 'yyyy-MM-dd') === today
            );
            setIsCheckedInToday(checkedInToday);
        } catch (err) {
            console.error(err.response?.data || err);
            setCheckIns([]);
            setIsCheckedInToday(false);
        }
    };

    const handleCheckIn = async (date) => {
    try {
        if (!(date instanceof Date) || isNaN(date)) {
            alert('Ngày không hợp lệ!');
            return;
        }
        const formattedDate = date.toISOString();
        const existingCheckIn = checkIns.find(
            (c) => format(new Date(c.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        );
        if (existingCheckIn) {
            alert('Ngày này đã được điểm danh!');
            return;
        }
        await axios.post(
            'http://localhost:5000/api/checkin',
            { date: formattedDate },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchCheckIns();
        alert('Điểm danh thành công!');
    } catch (err) {
        const errorMsg = err.response?.data?.msg || 'Có lỗi xảy ra, vui lòng thử lại';
        alert(errorMsg);
        console.error(err.response?.data || err);
    }
};

    const getDaysInMonth = () => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        return eachDayOfInterval({ start, end });
    };

    const getCheckInStatus = (date) => {
        const checkIn = checkIns.find(
            (c) => format(new Date(c.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        );
        return checkIn ? checkIn.status : 'missed';
    };

    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const getCalendarGrid = () => {
        const days = getDaysInMonth();
        const firstDay = startOfMonth(currentMonth);

        const emptySlotsStart = (getDay(firstDay) + 6) % 7;
        const totalSlots = 7 * 6;
        const calendarGrid = [];

        for (let i = 0; i < emptySlotsStart; i++) {
            calendarGrid.push(null);
        }

        days.forEach((day) => {
            calendarGrid.push(day);
        });

        while (calendarGrid.length < totalSlots) {
            calendarGrid.push(null);
        }

        const weeks = [];
        for (let i = 0; i < calendarGrid.length; i += 7) {
            weeks.push(calendarGrid.slice(i, i + 7));
        }

        return weeks;
    };

    // Tính tổng số ngày đi tập trong tháng hiện tại
    const getMonthlyCheckIns = () => {
        return checkIns.filter((c) => isSameMonth(new Date(c.date), currentMonth) && c.status === 'checked-in').length;
    };

    return (
        <div className="checkin-container min-vh-100">
            <Navbar />
            <div className="container py-4 py-md-5">
                <h2 className="checkin-title fw-bold text-dark mb-4 text-center display-5">
                    🏋️ Quản lý Lịch Tập Gym
                </h2>

                <div className="mb-4 text-center">
                    <button
                        onClick={() => handleCheckIn(new Date())}
                        className={`btn btn-lg px-4 py-2 shadow-sm checkin-btn ${isCheckedInToday ? 'btn-secondary' : 'btn-primary'}`}
                        disabled={isCheckedInToday}
                    >
                        {isCheckedInToday ? '✅ Đã điểm danh hôm nay' : ' Điểm danh hôm nay'}
                    </button>
                </div>

                <div className="row row-cols-1 row-cols-md-4 g-3 g-md-4 mb-4 mb-md-5">
                    {[
                        { title: '📅 Tổng số ngày', value: stats.totalDays, color: 'text-primary' },
                        { title: '💪 Tổng ngày đi tập', value: stats.presentDays, color: 'text-success' },
                        { title: '🛌 Ngày nghỉ', value: stats.absentDays, color: 'text-danger' },
                        { title: '🌟 Ngày đi tập tháng này', value: getMonthlyCheckIns(), color: 'text-info' },
                    ].map((stat, index) => (
                        <div key={index} className="col">
                            <div className="card h-100 shadow-sm border-0 checkin-card">
                                <div className="card-body text-center">
                                    <h5 className="card-title fw-semibold text-muted">{stat.title}</h5>
                                    <p className={`display-4 ${stat.color} fw-bold`}>{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card shadow-sm border-0 checkin-card">
                    <div className="card-body p-3 p-md-4">
                        <div className="d-flex justify-content-between align-items-center mb-3 mb-md-4">
                            <button
                                className="btn btn-outline-secondary btn-sm px-3 checkin-nav-btn"
                                onClick={prevMonth}
                            >
                                ← Tháng trước
                            </button>
                            <h3 className="fw-bold mb-0 text-capitalize text-dark">
                                {format(currentMonth, 'MMMM yyyy', { locale: vi })}
                            </h3>
                            <button
                                className="btn btn-outline-secondary btn-sm px-3 checkin-nav-btn"
                                onClick={nextMonth}
                            >
                                Tháng sau →
                            </button>
                        </div>
                        <div className="row text-center fw-bold text-dark border-bottom pb-2 mb-3 checkin-weekdays">
                            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
                                <div key={day} className="col p">{day}</div>
                            ))}
                        </div>
                        <div className="checkin-calendar">
                            {getCalendarGrid().map((week, weekIndex) => (
                                <div key={`week-${weekIndex}`} className="row g-1 g-md-2">
                                    {week.map((day, dayIndex) => (
                                        <div key={`cell-${weekIndex}-${dayIndex}`} className="col">
                                            {day ? (
                                                <div
                                                    className={`rounded text-center py-1 py-md-2 shadow-sm checkin-day ${isToday(day)
                                                        ? 'bg-info text-white'
                                                        : getCheckInStatus(day) === 'checked-in'
                                                            ? 'bg-success text-white'
                                                            : 'bg-secondary bg-opacity-25 text-dark'
                                                        }`}
                                                    onClick={() => !isToday(day) && handleCheckIn(day)}
                                                    title={
                                                        isToday(day)
                                                            ? 'Hôm nay'
                                                            : getCheckInStatus(day) === 'checked-in'
                                                                ? 'Đã tập'
                                                                : 'Nhấn để điểm danh'
                                                    }
                                                    style={{ cursor: isToday(day) ? 'default' : 'pointer' }}
                                                >
                                                    {format(day, 'd')}
                                                </div>
                                            ) : (
                                                <div className="rounded py-1 py-md-2 checkin-empty-day"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 mt-md-4 d-flex flex-wrap align-items-center small gap-3">
                            <div className="d-flex align-items-center">
                                <span className="badge bg-success me-2 checkin-badge"></span>
                                Đã tập
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="badge bg-secondary bg-opacity-25 me-2 checkin-badge"></span>
                                Nghỉ
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="badge bg-info me-2 checkin-badge"></span>
                                Hôm nay
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckIn;