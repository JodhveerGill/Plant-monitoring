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

  

    const handleUpperChange = (event) => {
      props.changeThreshUpper(event.target.value);
    };
    const handleUpperSubmit = (event) => {
      //call save
      document.getElementById(event.target.name).value
      axios.post(`/thresh?value=${document.getElementById(event.target.name).value}&name=${event.target.name}`).then((res) => console.log(''));
      props.checkThreshold(props.threshUpper, props.threshLower, props.temps[props.temps.length - 1]);

      event.preventDefault();
    }

    const handleLowerChange = (event) => {
      props.changeThreshLower(event.target.value);
    };

    // const handleLowerSubmit = (event) => {
    //   event.preventDefault();
    //   axios.post('/thresh', props.threshLower).then((res) => console.log(res.data));
    // }

  return (
    <div>
      <h3>Temperature Graph</h3>
      <canvas id="myChart"></canvas>
      <div>
        <form>
        <label>
          Upper Threshold: <input id="upperTemp" type="number" value={props.threshUpper} onChange={handleUpperChange}/>
        </label>
        <Button variant="primary" name="upperTemp" onClick={handleUpperSubmit}>Save</Button>
        <label>
          Lower Threshold: <input id="lowerTemp" type="number" value={props.threshLower} onChange={handleLowerChange}/>
          <Button variant="primary" name="lowerTemp" onClick={handleUpperSubmit}>Save</Button>
        </label>
      </form>
      </div>
    </div>
  );
}


export default Graph;