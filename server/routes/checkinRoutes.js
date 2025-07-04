const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { checkIn, getCheckIns } = require('../controllers/checkinController');

const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).json({ msg: 'Không có token, truy cập bị từ chối' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token không hợp lệ' });
    }
};

router.post('/', auth, checkIn);
router.get('/', auth, getCheckIns);

module.exports = router;