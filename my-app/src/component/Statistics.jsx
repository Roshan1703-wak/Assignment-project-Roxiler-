// src/components/Statistics.js
import React from 'react';

const Statistics = ({ statistics }) => {
  return (
    <div>
      <h2>Statistics</h2>
      <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
      <p>Sold Items: {statistics.soldItems}</p>
      <p>Unsold Items: {statistics.notSoldItems}</p>
    </div>
  );
};

export default Statistics;
