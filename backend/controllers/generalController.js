const holiday = require('../models/Holiday');

const getWorkingDays = async (req, res) => {
    const { month, year } = req.body;
  
    try {
      // Define the start and end date of the given month
      const startDate = new Date(year, month - 1, 1);  // Month is 0-based, so subtract 1
      const endDate = new Date(year, month, 0);  // Last day of the month
  
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
  
      // Filter out holidays and weekends (Saturday = 6, Sunday = 0)
      const workingDays = allDates.filter(date => {
        const isHoliday = holidays.some(holiday => holiday.date.toDateString() === date.toDateString());
        const isWeekend = date.getDay() === 0 ;
        return !isHoliday && !isWeekend;
      });
      //splicing each element of the array to get the date only
      workingDays.forEach((date, index) => {
        workingDays[index] = date.toDateString();
      });
  
      res.status(200).json({ workingDays });
    } catch (error) {
      console.error('Error fetching working days:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
    

module.exports = { getWorkingDays };
