import React, { useState, useEffect } from 'react';

const Graph = (props) => {
  useEffect(() => {
    const labels = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'August',
      'September',
      'October'
    ];
  
    const data = {
      labels: labels,
      datasets: [{
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: props.temps,
      }]
    };
  
    const config = {
      type: 'line',
      data: data,
      options: {}
    };
    const myChart = new Chart(
      document.getElementById('myChart'),
      config
    );
  }, []);

  return (
    <div>
      <canvas id="myChart"></canvas>
    </div>
  );
}

export default Graph;