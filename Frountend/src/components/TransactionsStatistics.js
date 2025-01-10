// src/components/TransactionsStatistics.js
import React, { useState, useEffect } from 'react';
import { fetchStatistics } from '../api';

const TransactionsStatistics = ({ month }) => {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchStatistics(month);
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics', error);
      }
    };

    fetchData();
  }, [month]);

  return (
    <div>
      <h3>Transaction Statistics for {month}</h3>
      {statistics ? (
        <div>
          <div>Total Sale Amount: ${statistics.totalSaleAmount}</div>
          <div>Total Sold Items: {statistics.totalSoldItems}</div>
          <div>Total Not Sold Items: {statistics.totalNotSoldItems}</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default TransactionsStatistics;
