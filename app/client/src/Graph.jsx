import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

const Graph = (props) => {
  useEffect(() => {
    var ctx = document.getElementById('myChart');
    const myChart = new Chart(ctx, {
      type: 'line',

      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'August',
          'September',
          'October'
        ],
        datasets: [{
          label: 'temp',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: props.temps,
        }]
      },

      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
    }, []);

    const [threshUpper, changeThreshUpper] = useState(20);
    const [threshLower, changeThreshLower] = useState(0);

    const handleUpperChange = (event) => {
      changeThreshUpper(event.target.value);
    };
    const handleUpperSubmit = (event) => {
      //call save
      axios.post(`/thresh?threshUpper=${threshUpper}`).then((res) => console.log(res.data));
      event.preventDefault();
    }

    const handleLowerChange = (event) => {
      changeThreshLower(event.target.value);
    };

    const handleLowerSubmit = (event) => {
      event.preventDefault();
      axios.post('/thresh', threshLower).then((res) => console.log(res.data));
    }

  return (
    <div>
      <canvas id="myChart"></canvas>
      <div>
        <form>
        <label>
          Upper Threshold: <input type="number" value={threshUpper} onChange={handleUpperChange}/>
        </label>
        <Button variant="primary" onClick={handleUpperSubmit}>Primary</Button>
        <label>
          Lower Threshold: <input type="number" value={threshLower} onChange={handleLowerChange}/>
          <Button variant="primary" onClick={handleLowerSubmit}>Primary</Button>
        </label>
      </form>
      </div>
    </div>
  );
}


export default Graph;