import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {

  const [stateKml, setKml] = useState();
  const [stateUserLocation, setUserLocation] = useState([64.14763743425488, -21.960130056300454]);
  const [stateTargetLocation, setTargetLocation] = useState([64.12620617947846, -21.8214996789342]);
  const [stateLocations, setLocations] = useState();

  useEffect (() => { // Fetches objects from API, runs only once
    const GetAllLocations = async () =>
    {
      const response = await axios.get("https://apis.is/petrol")
      setLocations(response.data.results)

      const companies = [];
      response.data.results.map((item) => {
         var findItem = companies.find((x) => x === item.company);
         if(!findItem) companies.push(item.company);
      })
      console.log(response.data.results);
      console.log(companies);
    } 
    GetAllLocations();

  }, []);


  const handleKmlChange = event => {

  }

  const handleCalculateDistance = event => {
    var dist = calculateDistance(stateUserLocation, stateTargetLocation)
    console.log("Distance: ");
    console.log(dist)
  }

  function calculateDistance (locationA, locationB){
    const lat1 = locationA[0];
    const lat2 = locationB[0];
    const lon1 = locationA[1];
    const lon2 = locationB[1];

    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    const d = R * c; // in metres

    return d;
  }

  return (
    <div className="App">
      <header className="App-header">
        <form>
          <label>gas efficiency (L/100km)</label>
          <input type="number" onChange={handleKmlChange}></input>
        </form>
        <br />
          <p>GeoLoc: {stateUserLocation[0]}, {stateUserLocation[1]}</p>
          <br />
          <button onClick={handleCalculateDistance}>Calculate Distance</button>
      </header>
    </div>
  );
}

export default App;
