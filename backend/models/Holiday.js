const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,  // Ensures no duplicate entries for the same date
  },
  description: {
    type: String,
    required: false,  // Optional description for holiday (e.g., Eid, Public Holiday)
  },
  isHoliday: {
    type: Boolean,
    required: true,
    default: true,  // By default, a date in this schema is a holiday
  },
  isWeekendOpen: {
    type: Boolean,
    required: true,
    default: false,  // Use this to mark certain weekends as working days
  },
});

module.exports = mongoose.model('Holiday', holidaySchema);
