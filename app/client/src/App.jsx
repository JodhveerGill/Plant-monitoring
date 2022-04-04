import React, { useState, useEffect } from 'react';
import { Navbar, Container, Toast, Row, Col, Button, ToastContainer } from 'react-bootstrap';
import Graph from './Graph.jsx';
import axios from 'axios';



const App = () => {
  const [temps, changeTemps] = useState([]);
  const [tempDates, changeTempDates] = useState([])
  const [moisture, changeMoisture] = useState([]);
  const [moistureDates, changeMoistureDates] = useState([])
  const [tempUpper, changeTempUpper] = useState(30);
  const [tempLower, changeTempLower] = useState(0);
  const [moistureUpper, changeMoistureUpper] = useState(30);
  const [moistureLower, changeMoistureLower] = useState(0);
  const [tempUpState, changeTempUpState] = useState(false);
  const [tempLowState, changeTempLowState] = useState(false);
  const [moistureUpState, changeMoistureUpState] = useState(false);
  const [moistureLowState, changeMoistureLowState] = useState(false);
  const [notifications, changeNotifications] = useState([])

  useEffect(() => {
    axios.get('/getData', { params: { name: 'Temp' } }).then(res => {
      changeTempDates(res.data.map((date) => date.timestamp));
      changeTemps(res.data.map((val) => val.value));
    });
  }, []);

  useEffect(() => {
    axios.get('/getData', { params: { name: 'Moisture' } }).then(res => {
      changeMoistureDates(res.data.map((date) => date.timestamp));
      changeMoisture(res.data.map((val) => val.value));
    });
  }, []);

  function poll(chart, name) {
    var oldTemp = [0]
    var oldMoisture = [0]
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
        if (name == 'Moisture') {
          var cur = res.data.map((val) => val.value)
          if (cur.toString() !== oldMoisture.toString()) {
            oldMoisture = cur;
            changeMoisture(cur);
            chart.data.datasets.forEach((dataset) => {
              dataset.data = res.data.map((val) => val.value);
            });
            chart.data.labels = res.data.map((dates) => dates.timestamp.substring(11, 19));
            changeMoistureUpState(false);
            changeMoistureLowState(false);
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
    checkThreshold('Moisture', moistureUpper, moistureLower, moisture[moisture.length - 1]);
  }, [moisture]);


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
    if (type == 'Moisture') {
      if (value > upperLimit && !moistureUpState) {
        changeMoistureUpState(true)
        changeNotifications([...notifications, createWarning(type, 'over')])
      }
      if (value < lowerLimit && !moistureLowState) {
        changeMoistureLowState(true)
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
      <ToastContainer className='notif' position='top-end'>
        {notifications}
      </ToastContainer>
      <div style={{ width: '75%' }}>
        {temps.length > 0 ? <Graph title='Temperature Graph' data={temps} dates={tempDates} threshUpper={tempUpper} changeThreshUpper={changeTempUpper}
          threshLower={tempLower} changeThreshLower={changeTempLower} checkThreshold={checkThreshold} poll={poll} name='Temp' /> : <></>}
      </div>

      <div style={{ width: '75%' }}>
        {moisture.length > 0 ? <Graph title='Soil Moisture Graph' data={moisture} dates={moistureDates} threshUpper={moistureUpper} changeThreshUpper={changeMoistureUpper}
          threshLower={moistureLower} changeThreshLower={changeMoistureLower} checkThreshold={checkThreshold} poll={poll} name='Moisture' /> : <></>}
      </div>
    </div>
  );
};


export default App;