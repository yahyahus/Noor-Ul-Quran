const holiday = require('../models/Holiday');

const getWorkingDays = async (month, year) => {
    // Validate month and year input
    if (!month || !year || isNaN(month) || isNaN(year)) {
        throw new Error('Invalid month or year');
    }

    // Construct start and end dates
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month

    // Validate the constructed dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date range');
    }

    // Get holidays within the specified month
    const holidays = await holiday.find({
        date: {
            $gte: startDate,
            $lte: endDate,
        },
    }).select('date');

    // Generate all dates for the month
    const allDates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        allDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Filter out holidays and weekends
    const workingDays = allDates.filter(date => {
        const isHoliday = holidays.some(holiday => holiday.date.toDateString() === date.toDateString());
        const isWeekend = date.getDay() === 0; // Only Sundays are weekends
        return !isHoliday && !isWeekend;
    });

    // Format each date as a string
    return workingDays.map(date => date.toDateString());
};

    

  

module.exports = { getWorkingDays };
