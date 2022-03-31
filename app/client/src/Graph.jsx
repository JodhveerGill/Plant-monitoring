import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

const Graph = (props) => {

  useEffect(() => {
    let time = [];
    props.dates.forEach(date => time.push(date.substring(11, 19)))
    var ctx = document.getElementById(`${props.name}chart`);
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: time,
        datasets: [{
          label: props.name,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: props.data
        }]
      },
      options: {
        scales: {
          x: {

          },
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: true,
            align: 'end'
          }
        }
      }
    })
    props.poll(myChart, props.name);
  }, []);

  const threshUpper = 'upper' + props.name;
  const threshLower = 'lower' + props.name;

  const handleUpperChange = (event) => {
    props.changeThreshUpper(event.target.value);
  };
  const handleUpperSubmit = (event) => {
    //call save
    axios.post(`/thresh?value=${document.getElementById(event.target.name).value}&name=${event.target.name}`).then((res) => console.log('save thresh'));
    props.checkThreshold(props.name, props.threshUpper, props.threshLower, props.data[props.data.length - 1]);

    event.preventDefault();
  }

  const handleLowerChange = (event) => {
    props.changeThreshLower(event.target.value);
  };


  return (
    <div className='graph'>
      <div className='graphChild'>
        <h3 className='header'>{props.title}</h3>
        <canvas id={`${props.name}chart`}></canvas>
      </div>
      <div className='graphChild'>
        <form className='form'>
          <label className='input'>
            Upper Threshold: <input id={threshUpper} type="number" value={props.threshUpper} onChange={handleUpperChange} />
          </label>
          <Button variant="primary" name={threshUpper} onClick={handleUpperSubmit}>Save</Button>
          <label className='input'>
            Lower Threshold: <input id={threshLower} type="number" value={props.threshLower} onChange={handleLowerChange} />
          </label>
          <Button variant="primary" name={threshLower} onClick={handleUpperSubmit}>Save</Button>
        </form>
      </div>
    </div>
  );
}

export default Graph;
