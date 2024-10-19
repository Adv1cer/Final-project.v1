import { useEffect, useState } from 'react';

function Report() {
    const [totalToday, setTotalToday] = useState(0);
    const [totalWeek, setTotalWeek] = useState(0);
    const [totalMonth, setTotalMonth] = useState(0);
    const [totalYear, setTotalYear] = useState(0);
    const [symptomStats, setSymptomStats] = useState([]);
    const [pillStats, setPillStats] = useState([]); // State for pill statistics
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/report');
            const data = await response.json();

            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
            const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const startOfYear = new Date(today.getFullYear(), 0, 1);

            const totalTodayTickets = data.tickets.filter(ticket => {
                const ticketDate = new Date(ticket.datetime);
                return ticketDate >= startOfDay && ticketDate <= endOfDay;
            });

            const totalWeekTickets = data.tickets.filter(ticket => {
                const ticketDate = new Date(ticket.datetime);
                return ticketDate >= startOfWeek;
            });

            const totalMonthTickets = data.tickets.filter(ticket => {
                return new Date(ticket.datetime) >= startOfMonth;
            });

            const totalYearTickets = data.tickets.filter(ticket => {
                return new Date(ticket.datetime) >= startOfYear;
            });

            setTotalToday(totalTodayTickets.length);
            setTotalWeek(totalWeekTickets.length);
            setTotalMonth(totalMonthTickets.length);
            setTotalYear(totalYearTickets.length);
            setSymptomStats(data.symptomStats);
            setPillStats(data.pillStats); // Set pill statistics
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex justify-center bg-gray-100">
            <div className="grid grid-cols-6 gap-6">
                {/* รายวัน */}
                <div className="bg-white py-2 my-2 shadow-md rounded-lg p-2 pb-2 flex flex-col items-center">
                    <h3 className="text-xl whitespace-nowrap">ผู้ใช้รายวัน</h3>
                    <div className="text-2xl mt-4">
                        {error ? <span className="text-red-500">{error}</span> : totalToday}
                    </div>
                </div>
                {/* รายสัปดาห์ */}
                <div className="bg-white py-2 my-2 shadow-md rounded-lg p-2 pb-2 flex flex-col items-center">
                    <h3 className="text-xl whitespace-nowrap">ผู้ใช้รายสัปดาห์</h3>
                    <div className="text-2xl mt-4">
                        {error ? <span className="text-red-500">{error}</span> : totalWeek}
                    </div>
                </div>
                {/* รายเดือน */}
                <div className="bg-white py-2 my-2 shadow-md rounded-lg p-2 pb-2 flex flex-col items-center">
                    <h3 className="text-xl whitespace-nowrap">ผู้ใช้รายเดือน</h3>
                    <div className="text-2xl mt-4">
                        {error ? <span className="text-red-500">{error}</span> : totalMonth}
                    </div>
                </div>
                {/* รายปี */}
                <div className="bg-white py-2 my-2 shadow-md rounded-lg p-2 pb-2 flex flex-col items-center">
                    <h3 className="text-xl whitespace-nowrap">ผู้ใช้รายปี</h3>
                    <div className="text-2xl mt-4">
                        {error ? <span className="text-red-500">{error}</span> : totalYear}
                    </div>
                </div>
                {/* สถิติอาการประจำสัปดาห์ */}
                <div className="bg-white py-2 my-2 shadow-md rounded-lg p-2 pb-2 flex flex-col items-center">
                    <h3 className="text-xl whitespace-nowrap">สถิติอาการประจำสัปดาห์</h3>
                    <div className="text-lg mt-2">
                        {symptomStats.map((stat) => (
                            <div key={stat.symptom_id}>
                                {stat.symptom_name}: {stat.count} คน
                            </div>
                        ))}
                    </div>
                </div>
                {/* สถิติยาที่จ่ายไปประจำสัปดาห์ */}
                <div className="bg-white py-2 my-2 shadow-md rounded-lg p-2 pb-2 flex flex-col items-center">
                    <h3 className="text-xl whitespace-nowrap">สถิติยาประจำสัปดาห์</h3>
                    <div className="text-lg mt-2">
                        {pillStats.map((stat) => (
                            <div key={stat.pillstock_id}>
                                {stat.pill_name}: {stat.count} ครั้ง
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Report;
