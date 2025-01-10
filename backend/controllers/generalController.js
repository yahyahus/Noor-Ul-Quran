const holiday = require('../models/Holiday');
const Progress = require('../models/Progress');

const getWorkingDays = async (month, year) => {
    // Validate month and year input
    if (!month || !year || isNaN(month) || isNaN(year)) {
        throw new Error('Invalid month or year');
    }

    // Construct start and end dates in UTC
    const startDate = new Date(Date.UTC(year, month - 1, 1)); // Start of the month
    const endDate = new Date(Date.UTC(year, month, 0)); // Last day of the month

    // Validate the constructed dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date range');
    }

    // Get holidays within the specified month
    const holidays = await holiday.find({
        date: {
            $gte: startDate.toISOString().split('T')[0],
            $lte: endDate.toISOString().split('T')[0],
        },
    }).select('date');

    // Generate all dates for the month
    const allDates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        allDates.push(new Date(currentDate));
        currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Use UTC to increment the day
    }

    // Filter out holidays and weekends
    const workingDays = allDates.filter(date => {
        const isHoliday = holidays.some(holiday => holiday.date === date.toISOString().split('T')[0]); // Compare as strings
        const isWeekend = date.getUTCDay() === 0; // Only Sundays are weekends in UTC
        return !isHoliday && !isWeekend;
    });

    // Format each date as a string
    return workingDays.map(date => date.toISOString().split('T')[0]); // Return dates as 'YYYY-MM-DD'
};


//making an api that uses the getWorkingDays function
const getWorkingDaysApi = async (req, res) => {
    const { month, year } = req.query;

    try {
        const workingDays = await getWorkingDays(month, year);
        res.status(200).json(workingDays);
    } catch (error) {
        console.error('Failed to fetch working days:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getProgress = async(req,res) => {
    const {studentId,date} = req.query;

    try{
        const progress = await Progress.find({
            studentId: studentId,
            date: date,
        });
        res.status(200).json(progress);

}
    
    catch(error){
        console.error('Failed to fetch progress:', error);
        res.status(500).json({ message: 'Server error' });
    }

}; 



  

module.exports = { getWorkingDays, getWorkingDaysApi };