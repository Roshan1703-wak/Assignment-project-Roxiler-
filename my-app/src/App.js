import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Transactions from './component/Transactions';
import Statistics from './component/Statistics';
import BarChart from './component/BarChart';
import PieChart from './component/PieChart';

const App = () => {
  const [month, setMonth] = useState('01'); // Default to January
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [priceRanges, setPriceRanges] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('sahttp://localhost:5000/api/products/combined?month=${month}');
        setTransactions(response.data.transactions);
        setStatistics(response.data.statistics);
        setPriceRanges(response.data.priceRanges);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching data: ", error.response ? error.response.data : error.message);
      }
    };
    fetchData();
  }, [month]);

  return (
    <div>
      <h1>Product Dashboard</h1>
      <select value={month} onChange={(e) => setMonth(e.target.value)}>
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        <option value="04">April</option>
        <option value="05">May</option>
        <option value="05">june</option>
        <option value="05">july</option>
        <option value="05">Aug</option>
        <option value="05">Sep</option>
        <option value="05">Oct</option>
        <option value="05">nov</option>
        <option value="05">Dec</option>
       
      </select>

      <Transactions transactions={transactions} />
      <Statistics statistics={statistics} />
      <BarChart priceRanges={priceRanges} />
      <PieChart categories={categories} />
    </div>
  );
};

export default App;

   
