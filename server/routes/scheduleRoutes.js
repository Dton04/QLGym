const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { createSchedule, getSchedule, getAllSchedules, getUserSchedules, updateSchedule } = require('../controllers/scheduleController');


const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ msg: 'Không có token, truy cập bị từ chối' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token không hợp lệ' });
    }
};

// Chỉ admin hoặc công khai (cần thêm middleware kiểm tra quyền nếu cần)
router.post('/', auth, createSchedule);

router.get('/all', auth, getAllSchedules);
router.get('/user', auth, getUserSchedules);
router.get('/:date', auth, getSchedule);
router.put('/:id', auth, updateSchedule);

module.exports = router;