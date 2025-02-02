const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    priority: { type: String, default: 'HIGH' },
    due: { type: String, default: 'TBD' },
    status: { type: String, default: 'PENDING' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
