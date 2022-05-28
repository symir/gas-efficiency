import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {

  const [stateKml, setKml] = useState();
  const [stateUserLocation, setUserLocation] = useState({lat: 64.14763743425488, lon: -21.960130056300454});

  const [stateLocations, setLocations] = useState(); // List of all locations from the API

  useEffect (() => { // Fetches objects from API, runs only once
    const GetAllLocations = async () =>
    {
      const response = await axios.get("https://apis.is/petrol")
      setLocations(response.data.results)
      console.log(response.data.results);
    } 
    GetAllLocations();

  }, []);


  const handleKmlChange = (e) => {
    setKml(e.target.value)
  }

  function calculateDistance (locationA, locationB){
    const lat1 = locationA.lat;
    const lat2 = locationB.lat;
    const lon1 = locationA.lon;
    const lon2 = locationB.lon;

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
          <label>Fuel economy (100km/L): </label>
          <input type="number" onChange={handleKmlChange}></input>
          
          <label>

          </label>
        </form>
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Location</th>
              <th scope="col">Price</th>
              <th scope="col">Distance</th>
              <th scope="col">Cost of visit</th>
            </tr>
          </thead>
          <tbody>
            {stateLocations && stateLocations.sort((a,b)=> {return a.bensin95 - b.bensin95}).map((item, index) => ( // Check if state is not empty, then sorts stateLocations by bensin95 (price), and maps it for rendering
              <tr>
                <th scope="row">{index}</th>
                <td>{item.name}</td>
                <td>{item.bensin95}kr</td>
                <td>{(calculateDistance(stateUserLocation, item.geo)/1000).toFixed(2)}km</td>
                {stateKml && <td>{ Math.round(calculateDistance(stateUserLocation, item.geo)*stateKml/100000*item.bensin95)}kr</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;