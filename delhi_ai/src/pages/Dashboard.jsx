import { useEffect, useState } from 'react';
import { Card, Title, AreaChart, DonutChart, Select, SelectItem } from '@tremor/react';
import { motion } from 'framer-motion';
import { FaBolt, FaSun } from 'react-icons/fa';
import Papa from 'papaparse';

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [timeRange, setTimeRange] = useState('week'); // Default to week view
  const [filteredChartData, setFilteredChartData] = useState([]);

  useEffect(() => {
    // Fetch and parse the CSV file
    fetch('/src/data/Dataset.csv')
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data;

            // Prepare AreaChart data with date and hour
            const areaData = parsedData.map((row) => ({
              fullDate: new Date(`${row[0]} ${row[1]}:00`), // Combine date and hour
              date: `${row[0]} ${row[1]}:00`,
              load: parseFloat(row[10] || 0),
            }));
            setChartData(areaData);

            // Initially filter for the last week
            filterDataByTimeRange(areaData, 'week');

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

  const filterDataByTimeRange = (data, range) => {
    if (!data || data.length === 0) return; // Guard clause

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
              <Card decoration="top" decorationColor={metric.color} >
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
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
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
            colors={["black"]}
            valueFormatter={(value) => `${value.toLocaleString()} MW`}
            showAnimation={true}
          />
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <Title>Load Distribution</Title>
            <DonutChart
              className="h-52 mt-4"
              data={distributionData}
              category="value"
              index="sector"
              colors={["blue", "red", "indigo"]}
              showAnimation={true}
            />
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;