import React from 'react'

const PriceTable = (props) => {
    let expanded = props.expanded;
    let locations = [];

    props.locations.forEach((item)=>{   // every time the component renders, the app threads through each item in the array and 
                                        // adds calculations based on geolocation and price. Doing this here allows for easier sorting
                                        // and less mess in the render.
        
        let locationDistance = props.distance(props.userLocation, item.geo)/1000; // distance to location in kilometers
        let locationFuelSpent = (locationDistance*props.kml)/100; // how much fuel will be spent reaching location in liters
        let locationFuelLeft = (props.tankMax * (props.tankCurrent / 100))-(locationFuelSpent); // remaining fuel in tank once location is reached
        let locationCostToFill = ((props.tankMax - locationFuelLeft) * item.bensin95); // cost of filling the tank once location is reached
        let locationTripCost = (locationFuelSpent*item.bensin95); // cost of the trip from user's location to the station

        let location = { // create new object, transfer values from the original object, and add calculated values
            name: item.name,
            company: item.company,
            price: item.bensin95,
            geo: item.geo,
            distance: locationDistance,
            distanceLiters: locationFuelSpent,
            tripCost: locationTripCost,
            fuelLeft: locationFuelLeft, 
            costToFill: locationCostToFill
        };

        locations.push(location); // the new object is finally added to the locations array
    });

    return(
        <> {expanded == false ? // normal version, strictly by requirements
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Location</th>
                    <th scope="col">Price</th>
                    <th scope="col">Distance</th>
                    <th scope="col">Cost of trip</th>
                </tr>
                </thead>
                <tbody>
                {locations.sort((a,b)=> {return a.tripCost - b.tripCost}).map((item, index) => { // sorts locations by cost of trip, and maps the array for rendering

                    return(
                        <tr key={index}>
                        <td>{item.name} - {item.company}</td>
                        <td>{item.price} kr.</td>
                        <td>{item.distance.toFixed(2)} km</td>
                        {(props.kml) // Checks if fuel efficiency has been entered, if true then calculate distance and multiply by kml (converted from m to km, and from 100km/l to 1km/l) and location price
                            ? <td>{(Math.round(item.tripCost)).toLocaleString('en-IN')} kr.</td>
                            : <td></td>
                        }
                        </tr>
                    )
                })}

                </tbody>
            </table>

            : // expanded version, adds remaining fuel calculations, and cost to fill after subtracting fuel spent to reach location

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Location</th>
                        <th scope="col">Price</th>
                        <th scope="col">Distance</th>
                        <th scope="col">Cost of Trip</th>
                        <th scope="col">Cost to Fill</th>
                    </tr>
                </thead>
                <tbody>


                {locations.sort((a,b)=> {return (a.costToFill -b.costToFill )}).map((item, index) => { // sorts by cost to fill, and maps for rendering.
                        return(
                            <tr key={index}>
                                <td>{item.name} - {item.company}</td>
                                <td>{item.price} kr.</td>
                                <td>{item.distance.toFixed(2)} km</td>
                                {(props.kml) // Checks if fuel efficiency has been entered, if true then calculate distance and multiply by kml (converted from m to km, and from 100km/l to 1km/l) and location price
                                    ? <td>{(Math.round(item.tripCost)).toLocaleString('en-IN')} kr.</td>
                                    : <td></td>
                                }
                                {(props.tankMax && props.tankCurrent) ? // Ternary checks if tank values have been entered. Nesting ternaries is a sin but I'm not sorry
                                    item.fuelLeft.toFixed(2) > 0 // Ternary approximates how much fuel will be left in the tank after the trip, renders red if user does not have enough fuel (negative value)
                                        ? <>
                                            <td>{Math.round(item.costToFill).toLocaleString('en-IN')} kr.</td>
                                        </>
                                        : <>
                                            <td><p className="text-danger">Out of range</p></td>
                                            </>
                            : <>
                                <td></td>
                                <td></td>
                            </>
                            }
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            }
        </>
    );
};

export default PriceTable;