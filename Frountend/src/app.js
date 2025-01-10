// src/App.js
import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import TransactionsStatistics from './components/TransactionsStatistics';
import TransactionsBarChart from './components/TransactionsBarChart';
import TransactionsPieChart from './components/TransactionsPieChart';

const App = () => {
  const [month, setMonth] = useState('March');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleSearchChange = (search) => setSearch(search);

  return (
    <div>
      <h1>Transactions Dashboard</h1>
      <select value={month} onChange={handleMonthChange}>
        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((monthOption) => (
          <option key={monthOption} value={monthOption}>{monthOption}</option>
        ))}
      </select>

      <TransactionsTable month={month} onSearch={handleSearchChange} page={page} setPage={setPage} />
      <TransactionsStatistics month={month} />
      <TransactionsBarChart month={month} />
      <TransactionsPieChart month={month} />
    </div>
  );
};

export default App;
