// src/components/TransactionsTable.js
import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../api';

const TransactionsTable = ({ month, onSearch, page, setPage, perPage = 10 }) => {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTransactions(month, onSearch, page, perPage);
        setTransactions(response.data.transactions);
        setTotal(response.data.total);
      } catch (error) {
        console.error('Error fetching transactions', error);
      }
    };

    fetchData();
  }, [month, onSearch, page, perPage]);

  const handleNextPage = () => setPage(page + 1);
  const handlePrevPage = () => setPage(page > 1 ? page - 1 : 1);

  return (
    <div>
      <h3>Transactions for {month}</h3>
      <input
        type="text"
        placeholder="Search by title, description, or price"
        onChange={(e) => onSearch(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Date of Sale</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.productTitle}</td>
              <td>{transaction.productDescription}</td>
              <td>{transaction.price}</td>
              <td>{transaction.category}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
        <button onClick={handleNextPage} disabled={transactions.length === 0}>Next</button>
      </div>
    </div>
  );
};

export default TransactionsTable;
