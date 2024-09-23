import { useEffect, useState } from 'react';

function Display() {
  const [activeCount, setActiveCount] = useState(0);
  const [totalToday, setTotalToday] = useState(0);
  const [totalMonth, setTotalMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/display');
        const data = await response.json();
  
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);


        const activeTickets = data.filter(ticket => ticket.status.toString().startsWith('1'));
  

        const totalTodayTickets = data.filter(ticket => {
          const ticketDate = new Date(ticket.datetime);
          return ticketDate >= startOfDay && ticketDate < new Date(startOfDay).setDate(startOfDay.getDate() + 1);
        });

        const totalMonthTickets = data.filter(ticket => {
          return new Date(ticket.datetime) >= startOfMonth;
        });
  
        setActiveCount(activeTickets.length);
        setTotalToday(totalTodayTickets.length);
        setTotalMonth(totalMonthTickets.length);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  return (
    <div className="flex justify-center bg-gray-100">
      <div className="flex space-x-4 gap-6">

        <div className="bg-white py-5 my-4 shadow-md rounded-lg p-8 pb-2 w-full flex flex-col items-center">
          <div className="flex-1 text-center">
            <h3 className="text-xl whitespace-nowrap">รอการจ่ายยา</h3>
            <div className="text-4xl mt-2">
              {loading ? <span>Loading...</span> : error ? <span className="text-red-500">{error}</span> : activeCount}
            </div>
          </div>
        </div>
        {/* Tickets for Today */}
        <div className="bg-white my-4 py-5 shadow-md rounded-lg p-8 pb-2 w-full flex flex-col items-center">
          <div className="flex-1 text-center">
            <h3 className="text-xl whitespace-nowrap">ผู้ป่วยวันนี้</h3>
          </div>
          <div className="text-4xl mt-2">
            {loading ? <span>Loading...</span> : error ? <span className="text-red-500">{error}</span> : totalToday}
          </div>
        </div>
        {/* Total Tickets for the Month */}
        <div className="bg-white my-4 py-5 shadow-md rounded-lg p-8 pb-2 w-full flex flex-col items-center">
          <div className="flex-1 text-center">
            <h3 className="text-xl whitespace-nowrap">ผู้ป่วยทั้งหมด</h3>
          </div>
          <div className="text-4xl mt-2">
            {loading ? <span>Loading...</span> : error ? <span className="text-red-500">{error}</span> : totalMonth}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Display;
