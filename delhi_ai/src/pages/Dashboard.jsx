import { useEffect, useState } from 'react';
import { Card, Title, AreaChart, BarChart, DonutChart, Select, SelectItem } from '@tremor/react';
import { motion } from 'framer-motion';
import { FaBolt, FaSun } from 'react-icons/fa';
import Papa from 'papaparse';

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [filteredChartData, setFilteredChartData] = useState([]);
  const [monthlyAvgData, setMonthlyAvgData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    fetch('/src/data/Dataset.csv')
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data;

            const areaData = parsedData.map((row) => ({
              fullDate: new Date(`${row[0]} ${row[1]}:00`),
              date: `${row[0]} ${row[1]}:00`,
              load: parseFloat(row[10] || 0),
            }));
            setChartData(areaData);
            filterDataByTimeRange(areaData, 'week');

            const monthlyData = calculateMonthlyAverages(areaData);
            setMonthlyAvgData(monthlyData);

            setDistributionData([
              { sector: 'Domestic', value: 65 },
              { sector: 'Commercial', value: 25 },
              { sector: 'Industrial', value: 10 },
            ]);
          },
        });
      })
      .catch((error) => console.error('Error loading CSV:', error));
  }, []);

  const calculateMonthlyAverages = (data) => {
    const groupedByMonth = {};

    data.forEach((item) => {
      const month = item.fullDate.toISOString().slice(0, 7); // YYYY-MM
      if (!groupedByMonth[month]) groupedByMonth[month] = [];
      groupedByMonth[month].push(item.load);
    });

    return Object.keys(groupedByMonth).map((month) => ({
      month,
      avgLoad: groupedByMonth[month].reduce((sum, val) => sum + val, 0) / groupedByMonth[month].length,
    }));
  };

  const calculateWeeklyAverages = (data, month) => {
    const filteredData = data.filter((item) => item.fullDate.toISOString().startsWith(month));
    const groupedByWeek = {};

    filteredData.forEach((item) => {
      const weekNumber = Math.ceil(item.fullDate.getDate() / 7);
      if (!groupedByWeek[weekNumber]) groupedByWeek[weekNumber] = [];
      groupedByWeek[weekNumber].push(item.load);
    });

    return Object.keys(groupedByWeek).map((week) => ({
      week: `Week ${week}`,
      avgLoad: groupedByWeek[week].reduce((sum, val) => sum + val, 0) / groupedByWeek[week].length,
    }));
  };

  const filterDataByTimeRange = (data, range) => {
    if (!data || data.length === 0) return;

    const now = new Date(Math.max(...data.map((item) => item.fullDate)));
    let startDate;

    switch (range) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const filtered = data.filter((item) => item.fullDate >= startDate && item.fullDate <= now);
    setFilteredChartData(filtered);
  };

  useEffect(() => {
    if (chartData.length > 0 && timeRange) {
      filterDataByTimeRange(chartData, timeRange);
    }
  }, [timeRange, chartData]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{ title: "Current Load", value: "6,240 MW", icon: <FaBolt className="text-yellow-500" />, color: "blue" },
          { title: "Peak Today", value: "8,300 MW", icon: <FaBolt className="text-red-500" />, color: "red" },
          { title: "Solar Generation", value: "1,200 MW", icon: <FaSun className="text-orange-500" />, color: "green" }]
          .map((metric, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card decoration="top" decorationColor={metric.color} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full bg-${metric.color}-50`}>
                    {metric.icon}
                  </div>
                  <div>
                    <Title>{metric.title}</Title>
                    <div className="text-2xl font-bold text-blue-600">{metric.value}</div>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-100 rounded-full">
                  <div className={`h-2 bg-${metric.color}-500 rounded-full animate-pulse`} style={{ width: '70%' }}></div>
                </div>
              </Card>
            </motion.div>
          ))}
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <Card>
          <div className="flex justify-between items-center mb-4">
            <Title>Load Profile</Title>
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
              className="w-32"
            >
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </Select>
          </div>
          <AreaChart
            className="h-72 mt-4"
            data={filteredChartData}
            index="date"
            categories={["load"]}
            colors={["#34D399"]} // Green palette
            valueFormatter={(value) => `${value.toLocaleString()} MW`}
            showAnimation={true}
          />
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card>
            <Title>Monthly Load Averages</Title>
            <BarChart
              className="h-52 mt-4"
              data={monthlyAvgData}
              index="month"
              categories={["avgLoad"]}
              colors={["#F59E0B"]} // Amber palette
              valueFormatter={(value) => `${value.toFixed(2)} MW`}
              showAnimation={true}
              onBarClick={(month) => setSelectedMonth(month)}
            />
          </Card>
        </motion.div>

        {selectedMonth && (
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card>
              <Title>Weekly Averages for {selectedMonth}</Title>
              <BarChart
                className="h-52 mt-4"
                data={calculateWeeklyAverages(chartData, selectedMonth)}
                index="week"
                categories={["avgLoad"]}
                colors={["#3B82F6"]} // Blue palette
                valueFormatter={(value) => `${value.toFixed(2)} MW`}
                showAnimation={true}
              />
            </Card>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card>
            <Title>Load Distribution</Title>
            {distributionData.length > 0 ? (
              <DonutChart
                className="h-52 mt-4"
                data={distributionData}
                category="value"
                index="sector"
                colors={["#34D399", "#F43F5E", "#3B82F6"]} // Green, Pink, and Blue palette
                showAnimation={true}
              />
            ) : (
              <p className="text-center text-gray-500">No data available for Load Distribution.</p>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
