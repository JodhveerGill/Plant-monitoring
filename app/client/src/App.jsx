import React, { useState, useEffect } from 'react';
import { Navbar, Container, Toast, Row, Col, Button, ToastContainer } from 'react-bootstrap';
import Graph from './Graph.jsx';
import axios from 'axios';



const App = () => {
  const [temps, changeTemps] = useState([]);
  const [tempDates, changeTempDates] = useState([])
  const [humidity, changeHumidity] = useState([]);
  const [humidDates, changeHumidDates] = useState([])
  const [tempUpper, changeTempUpper] = useState(30);
  const [tempLower, changeTempLower] = useState(0);
  const [humidUpper, changeHumidUpper] = useState(30);
  const [humidLower, changeHumidLower] = useState(0);
  const [tempUpState, changeTempUpState] = useState(false);
  const [tempLowState, changeTempLowState] = useState(false);
  const [humidUpState, changeHumidUpState] = useState(false);
  const [humidLowState, changeHumidLowState] = useState(false);
  const [notifications, changeNotifications] = useState([])

  useEffect(() => {
    axios.get('/getData', { params: { name: 'Temp' } }).then(res => {
      changeTempDates(res.data.map((date) => date.timestamp));
      changeTemps(res.data.map((val) => val.value));
    });
  }, []);

  useEffect(() => {
    axios.get('/getData', { params: { name: 'Humidity' } }).then(res => {
      changeHumidDates(res.data.map((date) => date.timestamp));
      changeHumidity(res.data.map((val) => val.value));
    });
  }, []);

  function poll(chart, name) {
    var oldTemp = [0]
    var oldHumid = [0]
    setInterval(() => {
      axios.get('/getData', { params: { name: name } }).then(res => {
        if (name == 'Temp') {
          var cur = res.data.map((val) => val.value)
          if (cur.toString() !== oldTemp.toString()) {
            oldTemp = cur;
            changeTemps(cur);
            chart.data.datasets.forEach((dataset) => {
              dataset.data = cur;
            });
            chart.data.labels = res.data.map((dates) => dates.timestamp.substring(11, 19));
            changeTempUpState(false);
            changeTempLowState(false)
          }
        }
        if (name == 'Humidity') {
          var cur = res.data.map((val) => val.value)
          if (cur.toString() !== oldHumid.toString()) {
            oldHumid = cur;
            changeHumidity(cur);
            chart.data.datasets.forEach((dataset) => {
              dataset.data = res.data.map((val) => val.value);
            });
            chart.data.labels = res.data.map((dates) => dates.timestamp.substring(11, 19));
            changeHumidUpState(false);
            changeHumidLowState(false);
          }
        }

      });
      //console.log('poll');
      chart.update();
    }, 10000);
  }

  useEffect(() => {
    checkThreshold('Temp', tempUpper, tempLower, temps[temps.length - 1]);
  }, [temps]);

  useEffect(() => {
    checkThreshold('Humidity', humidUpper, humidLower, humidity[humidity.length - 1]);
  }, [humidity]);


  const checkThreshold = (type, upperLimit, lowerLimit, value) => {
    if (type == 'Temp') {
      if (value > upperLimit && !tempUpState) {
        changeTempUpState(true)
        changeNotifications([...notifications, createWarning(type, 'over')])
      }
      if (value < lowerLimit && !tempLowState) {
        changeTempLowState(true)
        changeNotifications([...notifications, createWarning(type, 'under')])
      }
    } 
    if (type == 'Humidity') {
      if (value > upperLimit && !humidUpState) {
        changeHumidUpState(true)
        changeNotifications([...notifications, createWarning(type, 'over')])
      }
      if (value < lowerLimit && !humidLowState) {
        changeHumidLowState(true)
        changeNotifications([...notifications, createWarning(type, 'under')])
      }
    }
  }

  const [show, setShow] = useState(true);
  const toggleSetShow = () => setShow(!show);

  const createWarning = (type, overunder) => {
    let curTime = new Date();
    curTime = curTime.toLocaleString()
    return(
    <Toast onClose={removeWarning.bind(this)} key={`${type} ${overunder}`}>
      <Toast.Header>
        <strong className="me-auto" style={{color:"red"}}>Warning</strong>
        <small>{`${curTime}`}</small>
      </Toast.Header>
      <Toast.Body>{`${type} is ${overunder} threshold`}</Toast.Body>
    </Toast>
    )};

  function removeWarning() {
    changeNotifications(notifications.filter(i => i !== notifications.length -1))
  }


  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            Plant Monitoring
          </Navbar.Brand>
          <Row>
            <Col s={6}>
              <Button onClick={toggleSetShow} className="mb-2">
                Notifications
              </Button>
            </Col>
          </Row>
        </Container>
      </Navbar>
      <ToastContainer className='notif' position='top-end' show={show}>
        {notifications}
      </ToastContainer>
      <div style={{ width: '75%' }}>
        {temps.length > 0 ? <Graph title='Temperature Graph' data={temps} dates={tempDates} threshUpper={tempUpper} changeThreshUpper={changeTempUpper}
          threshLower={tempLower} changeThreshLower={changeTempLower} checkThreshold={checkThreshold} poll={poll} name='Temp' /> : <></>}
      </div>

      <div style={{ width: '75%' }}>
        {humidity.length > 0 ? <Graph title='Humidity Graph' data={humidity} dates={humidDates} threshUpper={humidUpper} changeThreshUpper={changeHumidUpper}
          threshLower={humidLower} changeThreshLower={changeHumidLower} checkThreshold={checkThreshold} poll={poll} name='Humidity' /> : <></>}
      </div>
    </div>
  );
};


export default App;