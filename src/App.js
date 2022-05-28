import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import axios from "axios";
import PriceTable from './components/PriceTable';

const App = () => {

  const [stateKml, setKml] = useState(); // State for fuel efficiency input
  const [stateTankMax, setTankMax] = useState(); // State for fuel efficiency input
  const [stateTankCurrent, setTankCurrent] = useState(); // State for fuel efficiency input

  const [stateUserLocation, setUserLocation] = useState({}); // State for user geolocation

  const [stateLocations, setLocations] = useState(); // State for list of locations from the API

  const [stateExpandedToggle, setExpandedToggle] = useState(false);

  useEffect (() => { // Fetches objects from API, runs only once. 
    const GetAllLocations = async () =>
    {
      const response = await axios.get("https://apis.is/petrol")
      setLocations(response.data.results)
    } 
    GetAllLocations();
  });

  useEffect (() => {
    if ("geolocation" in navigator) {
      console.log("Geolocation Available");
      navigator.geolocation.getCurrentPosition(function(position) {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      });

    } else {
      console.log("Geolocation Not Available");
    }
  }, []);


  const handleKmlChange = (e) => {
    setKml(e.target.value)
  }

  const handleSecondaryToggle = () => {
    console.log(stateExpandedToggle);
    if (stateExpandedToggle == true) {
      setExpandedToggle(false);
      console.log("set false");
    }
    else if (stateExpandedToggle == false) {
      setExpandedToggle(true)
      console.log("set true");
    }
  }

  const handleTankMaxChange = (e) => {
    setTankMax(e.target.value)
  }
  const handleTankCurrentChange = (e) => {
    setTankCurrent(e.target.value)
  }

  function calculateDistance (locationA, locationB){
    const lat1 = locationA.lat;
    const lat2 = locationB.lat;
    const lon1 = locationA.lon;
    const lon2 = locationB.lon;

    // This basic Haversine JavaScript implementation is by Chris Veness, found here: https://www.movable-type.co.uk/scripts/latlong.html
    // Whole thing is a brilliant reference for all things spherical

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
    <div className="container">
      <div className="row">
        <div className="col">
          <form>
            <div className="form-group">
              <div className="row justify-content-start">
                <div className="col-md-auto align-self-end">
                  {stateExpandedToggle==true 
                    ? <div className="btn btn-primary active" type="submit" onClick={handleSecondaryToggle}>Expanded mode</div>
                    : <div className="btn btn-secondary" type="submit" onClick={handleSecondaryToggle}>Expanded mode</div>
                  }
                </div>
                <div className="col-md-auto">
                  <label htmlFor="inputKml">Fuel economy (100km/L): </label><br />
                  <input type="number" name="inputKml" onChange={handleKmlChange}></input>
                </div>
                {stateExpandedToggle && // if "Expanded Mode" is enabled, two more inputs are added: Max Tank in liters and Current Tank in percentages
                  <>
                    <div className="col-md-auto">
                      <label htmlFor="inputMaxTank">Fuel Max Tank Size (L): </label><br />
                      <input type="number" name="inputMaxTank" onChange={handleTankMaxChange}></input>
                    </div>
                    <div className="col-md-auto">
                      <label htmlFor="inputCurrentTank">Fuel In Tank (%): </label><br />
                      <input type="number" name="inputCurrentTank" min="1" max="100" onChange={handleTankCurrentChange}></input>
                    </div>
                  </>
                }
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="Row">
        {stateLocations &&
            <PriceTable 
              expanded={stateExpandedToggle}
              locations={stateLocations}
              userLocation={stateUserLocation}
              kml={stateKml}
              tankMax={stateTankMax}
              tankCurrent={stateTankCurrent}
              distance={calculateDistance} // pass calculateDistance as prop to component, allowing it to use the function as prop.distance
            />
        }
    </div></div>
  );
}

export default App;