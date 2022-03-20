import React, { useState, useEffect } from 'react';
import { Navbar, Container, Toast, Row, Col, Button, ToastContainer } from 'react-bootstrap';
import Graph from './Graph.jsx';
import axios from 'axios';


const App = () => {
  const [temps, changeTemps] = useState([]);
  const [threshUpper, changeThreshUpper] = useState(10);
  const [threshLower, changeThreshLower] = useState(0);
  const [withinThreshold, changeWithinThreshold] = useState(true);

  useEffect(() => {
    axios.get('/test').then(res => { 
      changeTemps(res.data.map((val) => val.value)) 
      
    });
  }, []);

  useEffect(() => {
    checkThreshold(threshUpper, threshLower, temps[temps.length - 1]);
  }, [temps]);


  const [show, setShow] = useState(true);
  const toggleSetShow = () => setShow(!show);

  const checkThreshold = (upperLimit, lowerLimit, value) => {
      (value > upperLimit || value < lowerLimit) ? changeWithinThreshold(false) : changeWithinThreshold(true);
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
      {withinThreshold ? <></> :
      <div>
        <ToastContainer position='middle-end'>
          <Toast show={show} onClose={toggleSetShow}>
            <Toast.Header>
              <strong className="me-auto">Warning</strong>
              <small>Time mins ago</small>
            </Toast.Header>
            <Toast.Body>Warning message</Toast.Body>
          </Toast>
        </ToastContainer>
      </div> 
    }
      
      <div style={{ width: 700 }}>
        {temps.length > 0 ? <Graph temps={temps} threshUpper={threshUpper} changeThreshUpper={changeThreshUpper} 
        threshLower={threshLower} changeThreshLower={changeThreshLower} checkThreshold={checkThreshold}/> : <></>}
      </div>
    </div>
  );
};


export default App;