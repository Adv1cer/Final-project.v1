import { MantineProvider } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
export const description = "A stacked area chart";

const chartConfig = {
  ticket_count: {
    label: "Tickets",
    color: "hsl(var(--chart-1))",
  },
};

function Report() {
  const [totalToday, setTotalToday] = useState(0);
  const [totalWeek, setTotalWeek] = useState(0);
  const [totalMonth, setTotalMonth] = useState(0);
  const [totalYear, setTotalYear] = useState(0);
  const [symptomStats, setSymptomStats] = useState([]);
  const [pillStats, setPillStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]); // Added chartData state

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/report");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Fetched data:", data);

      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
      );
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfYear = new Date(today.getFullYear(), 0, 1);

      const totalTodayTickets = data.tickets.filter((ticket) => {
        const ticketDate = new Date(ticket.datetime);
        return ticketDate >= startOfDay && ticketDate <= endOfDay;
      }).length;

      const totalWeekTickets = data.tickets.filter((ticket) => {
        const ticketDate = new Date(ticket.datetime);
        return ticketDate >= startOfWeek && ticketDate <= endOfDay;
      }).length;

      const totalMonthTickets = data.tickets.filter((ticket) => {
        const ticketDate = new Date(ticket.datetime);
        return ticketDate >= startOfMonth && ticketDate <= endOfDay;
      }).length;

      const totalYearTickets = data.tickets.filter((ticket) => {
        const ticketDate = new Date(ticket.datetime);
        return ticketDate >= startOfYear && ticketDate <= endOfDay;
      }).length;

      setTotalToday(totalTodayTickets);
      setTotalWeek(totalWeekTickets);
      setTotalMonth(totalMonthTickets);
      setTotalYear(totalYearTickets);
      setSymptomStats(data.symptomStats);
      setPillStats(data.pillStats);
      setChartData(data.chartData); // Set chartData fetched from the backend
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(chartData, "chart");
    fetchData();
  }, []);

  return (
    <MantineProvider>
      <div className="flex justify-start">
        <div className="grid grid-row-6 gap-6">
          {/* รายวัน */}
          <div className="bg-white py-2 my-2 shadow-md rounded-lg p-2 pb-2 flex flex-col items-center">
            <h3 className="text-xl whitespace-nowrap">ผู้ใช้รายวัน</h3>
            <div className="text-2xl mt-4">
              {error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                totalToday
              )}
            </div>
          </div>
          {/* รายสัปดาห์ */}
          <div className="bg-white py-2 my-2 shadow-md rounded-lg p-2 pb-2 flex flex-col items-center">
            <h3 className="text-xl whitespace-nowrap">ผู้ใช้รายสัปดาห์</h3>
            <div className="text-2xl mt-4">
              {error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                totalWeek
              )}
            </div>
          </div>
          {/* รายเดือน */}
          <div className="bg-white py-2 my-2 shadow-md rounded-lg p-2 pb-2 flex flex-col items-center">
            <h3 className="text-xl whitespace-nowrap">ผู้ใช้รายเดือน</h3>
            <div className="text-2xl mt-4">
              {error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                totalMonth
              )}
            </div>
          </div>
          {/* รายปี */}
          <div className="bg-white py-2 my-2 shadow-md rounded-lg p-2 pb-2 flex flex-col items-center">
            <h3 className="text-xl whitespace-nowrap">ผู้ใช้รายปี</h3>
            <div className="text-2xl mt-4">
              {error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                totalYear
              )}
            </div>
          </div>
          {/* สถิติอาการประจำสัปดาห์ */}
          <div className="bg-white py-2 my-2 shadow-md rounded-lg p-2 pb-2 flex flex-col items-center">
            <h3 className="text-xl whitespace-nowrap">
              สถิติอาการประจำสัปดาห์
            </h3>
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
        <div className="flex w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Area Chart</CardTitle>
              <CardDescription>
                Showing total visitors from 6AM-6PM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData} // Use the chartData state for the chart
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="hour"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `${value}:00`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="ticket_count"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month{" "}
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    January - June 2024
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MantineProvider>
  );
}

export default Report;
