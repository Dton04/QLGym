const CheckIn = require('../models/CheckIn');

exports.checkIn = async (req, res) => {
    const { date } = req.body;
    try {
        let checkIn = await CheckIn.findOne({ userId: req.user.userId, date });
        if (checkIn) return res.status(400).json({ msg: 'Đã điểm danh hôm nay' });

        checkIn = new CheckIn({ userId: req.user.userId, date });
        await checkIn.save();
        res.json(checkIn);
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi server' });
    }
};

exports.getCheckIns = async (req, res) => {
    try {
        const checkIns = await CheckIn.find({ userId: req.user.userId });
        res.json(checkIns);
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi server' });
    }
};