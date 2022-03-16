import React, { useState, useEffect } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import Graph from './Graph.jsx';
import axios from 'axios';


const App = () => {
  const [temps, changeTemps] = useState([]);

  useEffect(() => {
    axios.get('/test').then(res => { changeTemps(res.data.map((val) => val.value)) });
  }, []);

  useEffect(() => {
    console.log(temps);
  }, [temps]);
  return (
    <div>
      <Navbar bg="dark" variant="dark">
    <Container>
      <Navbar.Brand href="#home">
      Plant Monitoring
      </Navbar.Brand>
    </Container>
  </Navbar>
      <div style={{ width: 700 }}>
        {temps.length > 0 ? <Graph temps={temps} /> : <></>}
      </div>
    </div>
  );
};


export default App;