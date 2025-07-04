const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['checked-in', 'missed'], default: 'checked-in' }
});

module.exports = mongoose.model('CheckIn', CheckInSchema);