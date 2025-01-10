// src/components/TransactionsBarChart.js
import React, { useState, useEffect } from 'react';
import { fetchBarChartData } from '../api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const TransactionsBarChart = ({ month }) => {
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchBarChartData(month);
        setBarChartData(response.data);
      } catch (error) {
        console.error('Error fetching bar chart data', error);
      }
    };

    fetchData();
  }, [month]);

  const data = {
    labels: barChartData.map((range) => range.range),
    datasets: [{
      label: 'Number of Items',
      data: barChartData.map((range) => range.count),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <div>
      <h3>Bar Chart: Items in Price Ranges for {month}</h3>
      <Bar data={data} />
    </div>
  );
};

export default TransactionsBarChart;
