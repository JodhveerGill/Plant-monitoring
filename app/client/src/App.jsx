import React, { useState, useEffect } from 'react';
import Graph from './Graph.jsx';
import axios from 'axios';

const App = () => {
  const [temps, changeTemps] = useState([]);

  useEffect(() => {
    axios.get('/test').then(res =>{changeTemps(res.data.map((val) => val.value))});
  }, []);

  useEffect(() => {
    console.log(temps);
  }, [temps]);

  return (
    <div>
      {temps.length > 0 ? <Graph temps={temps} /> : <></>}
    </div>
    
  );
};


export default App;