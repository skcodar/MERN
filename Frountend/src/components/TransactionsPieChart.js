// src/components/TransactionsPieChart.js
import React, { useState, useEffect } from 'react';
import { fetchPieChartData } from '../api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const TransactionsPieChart = ({ month }) => {
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPieChartData(month);
        setPieChartData(response.data);
      } catch (error) {
        console.error('Error fetching pie chart data', error);
      }
    };

    fetchData();
  }, [month]);

  const data = {
    labels: pieChartData.map((category) => category._id),
    datasets: [{
      data: pieChartData.map((category) => category.count),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#F7464A'],
    }],
  };

  return (
    <div>
      <h3>Pie Chart: Items per Category for {month}</h3>
      <Pie data={data} />
    </div>
  );
};

export default TransactionsPieChart;
