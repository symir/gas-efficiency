import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import axios from "axios";
import PriceTable from './components/PriceTable';

const App = () => {

  // useState constants are used to, well, maintain states.
  const [stateKml, setKml] = useState(''); // State for fuel efficiency input
  const [stateTankMax, setTankMax] = useState(''); // State for fuel efficiency input
  const [stateTankCurrent, setTankCurrent] = useState(''); // State for fuel efficiency input
  const [stateUserLocation, setUserLocation] = useState({}); // State for user geolocation
  const [stateLocations, setLocations] = useState(); // State for list of locations from the API
  const [stateExpandedToggle, setExpandedToggle] = useState(false);

  useEffect (() => { // Fetches objects from API and sets to stateLocations. Runs once, to avoid getting blacklisted by the API's server during extensive testing...
    const GetAllLocations = async () =>
    {
      const response = await axios.get("https://apis.is/petrol")
      setLocations(response.data.results)
    } 
    GetAllLocations();
  }, []);

  useEffect (() => { // checks if geolocation is enabled in user's browser, prompts for permission
    if ("geolocation" in navigator) {
      console.log("Geolocation Available");
      navigator.geolocation.getCurrentPosition(function(position) { // sets user location in stateUserLocation
        setUserLocation({ 
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      });

    } else {
      console.log("Geolocation Not Available");
    }
  }, []);

  const handleKmlChange = (e) => { // updates stateKml whenever the input for fuel efficiency is changed. Input range limited to positive numbers
    if (e.target.value < 0){
      setKml(0);
    } else {
      setKml(e.target.value);
    }
  }

  const handleSecondaryToggle = () => { // toggles "Expanded Mode" true or false
    if (stateExpandedToggle == true) {
      setExpandedToggle(false);
    } else if (stateExpandedToggle == false) {
      setExpandedToggle(true)
    }
  }

  const handleTankMaxChange = (e) => { // updates stateTankMax whenever input for fuel tank max volume is changed. Input range limited to positive numbers
    if (e.target.value < 0){
      setTankMax(0);
    } else {
      setTankMax(e.target.value)
    }
  }

  const handleTankCurrentChange = (e) => { // updates stateTankCurrent whenever input for fuel tank current volume is changed. Input range limited to between 0 and 100.
    if (e.target.value > 100){
      setTankCurrent(100);
    } else if (e.target.value < 0){
      setTankCurrent(0);
    } else {
      setTankCurrent(e.target.value)
    }
  }

  const handleIgnoreSubmit = (e) => {
    e.preventDefault();
  }

  function calculateDistance (locationA, locationB){
    const lat1 = locationA.lat;
    const lat2 = locationB.lat;
    const lon1 = locationA.lon;
    const lon2 = locationB.lon;

    // This basic Haversine JavaScript implementation is by Chris Veness, found here: https://www.movable-type.co.uk/scripts/latlong.html
    // Whole thing is a brilliant reference for all things spherical

    const R = 6371e3; // metres
    const ??1 = lat1 * Math.PI/180; // ??, ?? in radians
    const ??2 = lat2 * Math.PI/180;
    const ???? = (lat2-lat1) * Math.PI/180;
    const ???? = (lon2-lon1) * Math.PI/180;
    
    const a = Math.sin(????/2) * Math.sin(????/2) +
              Math.cos(??1) * Math.cos(??2) *
              Math.sin(????/2) * Math.sin(????/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    const d = R * c; // in metres

    return d;
  }

  // Bootstrap CSS is applied to elements by using the className field, and the Grid layout system uses row and col to place elements
  return (
    <div className="container"> 
      <div className="row">
        <div className="col">
          <form onSubmit={handleIgnoreSubmit}>
            <div className="form-group">
              <div className="row justify-content-start">
                <div className="col-md-auto align-self-end">
                  {stateExpandedToggle==true // Toggle button for "Expanded Mode"
                    ? <div className="btn btn-primary active" type="submit" onClick={handleSecondaryToggle}>Expanded mode</div>
                    : <div className="btn btn-secondary" type="submit" onClick={handleSecondaryToggle}>Expanded mode</div>
                  }
                </div>
                <div className="col-md-auto">
                  <label htmlFor="inputKml">Fuel economy (100km/L): </label><br />
                  <input type="number" name="inputKml" onChange={handleKmlChange} value={stateKml}></input>
                </div>
                {stateExpandedToggle && // if "Expanded Mode" is enabled, two more inputs become visible: Max Tank in liters and Current Tank in percentages
                  <>
                    <div className="col-md-auto">
                      <label htmlFor="inputMaxTank">Fuel Max Tank Size (L): </label><br />
                      <input type="number" name="inputMaxTank" onChange={handleTankMaxChange} value={stateTankMax}></input>
                    </div>
                    <div className="col-md-auto">
                      <label htmlFor="inputCurrentTank">Fuel In Tank (%): </label><br />
                      <input type="number" name="inputCurrentTank" min="1" max="100" onChange={handleTankCurrentChange} value={stateTankCurrent}></input>
                    </div>
                  </>
                }
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="Row">
        {stateLocations && // If locations were successfully retrieved from API the table is rendered
            <PriceTable 
              expanded={stateExpandedToggle} // "Expanded Mode" adds Cost to Fill column
              locations={stateLocations} // Locations from API
              userLocation={stateUserLocation} // User geolocation
              kml={stateKml} // Vehicle's fuel efficiency
              tankMax={stateTankMax} // Vehicle's fuel tank size
              tankCurrent={stateTankCurrent} // Vehicle's current fuel amount in tank (in percentages)
              distance={calculateDistance} // pass calculateDistance as prop to component, allowing it to use the function as prop.distance
            />
        }
      </div>
    </div>
  );
}

export default App;