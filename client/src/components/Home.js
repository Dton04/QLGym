import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaDumbbell, FaCalendarCheck, FaChartLine } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home({ token }) {
    return (
        <div className="min-vh-100 bg-light">
            <Navbar />
            <div className="container py-5">
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold text-dark">Chào mừng đến với GymTracker</h1>
                    <p className="lead text-muted">Theo dõi lịch tập, điểm danh và tối ưu hóa hành trình tập luyện của bạn!</p>
                </div>

                <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
                    <div className="col">
                        <div className="card h-100 shadow-sm border-0">
                            <div className="card-body text-center">
                                <FaDumbbell className="display-4 text-primary mb-3" />
                                <h3 className="card-title fw-semibold">Kế hoạch tập luyện</h3>
                                <p className="card-text text-muted">Tạo và quản lý kế hoạch tập luyện cá nhân hóa theo mục tiêu của bạn.</p>
                                <Link to="/workout" className="btn btn-outline-primary">Xem kế hoạch</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card h-100 shadow-sm border-0">
                            <div className="card-body text-center">
                                <FaCalendarCheck className="display-4 text-success mb-3" />
                                <h3 className="card-title fw-semibold">Điểm danh hàng ngày</h3>
                                <p className="card-text text-muted">Ghi lại ngày tập của bạn và theo dõi tiến độ thường xuyên.</p>
                                <Link to="/checkin" className="btn btn-outline-success">Điểm danh ngay</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card h-100 shadow-sm border-0">
                            <div className="card-body text-center">
                                <FaChartLine className="display-4 text-info mb-3" /> {/* Thay text-purple bằng text-info */}
                                <h3 className="card-title fw-semibold">Theo dõi tiến độ</h3>
                                <p className="card-text text-muted">Xem thống kê và biểu đồ tiến độ tập luyện của bạn theo thời gian.</p>
                                <Link to="/schedule" className="btn btn-outline-info">Xem thống kê</Link> {/* Thay btn-outline-purple bằng btn-outline-info */}
                            </div>
                        </div>
                    </div>
                </div>

                {!token && (
                    <div className="text-center mt-5">
                        <h2 className="h4 fw-semibold text-dark mb-4">Sẵn sàng bắt đầu?</h2>
                        <Link to="/login" className="btn btn-primary btn-lg px-5">Đăng nhập ngay</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;