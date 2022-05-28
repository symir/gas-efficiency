import React from 'react'

const PriceTable = (props) => {
    let expanded = props.expanded;
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
                {props.locations.sort((a,b)=> {return a.bensin95 - b.bensin95}).map((item, index) => { // sorts locations by bensin95 (price), and maps it for rendering
                    let distanceLiters = props.distance(props.userLocation, item.geo)*props.kml/100000;
                    let distanceKm = (props.distance(props.userLocation, item.geo)/1000).toFixed(2);

                    return(
                    
                    <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.bensin95}kr</td>
                    <td>{distanceKm}km</td>
                    {(props.kml) // Checks if fuel efficiency has been entered, if true then calculate distance and multiply by kml (converted from m to km, and from 100km/l to 1km/l) and location price
                        ? <td>{ Math.round(distanceLiters*item.bensin95)}kr</td>
                        : <td></td>
                    }
                    </tr>
                    )
                })}

                </tbody>
            </table>

            : // expanded version

            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Location</th>
                    <th scope="col">Price</th>
                    <th scope="col">Distance</th>
                    <th scope="col">Cost of Trip</th>
                    <th scope="col">Fuel Remaining</th>
                    <th scope="col">Cost to Fill</th>
                </tr>
                </thead>
                <tbody>
                {props.locations.sort((a,b)=> {return a.bensin95 - b.bensin95}).map((item, index) => { // sorts locations by bensin95 (price), and maps it for rendering
                        let distanceLiters = props.distance(props.userLocation, item.geo)*props.kml/100000;
                        let distanceKm = (props.distance(props.userLocation, item.geo)/1000).toFixed(2);
                        let currentTankLiters = (props.tankMax * (props.tankCurrent / 100))-distanceLiters;
                        let costToFill = Math.round((props.tankMax - currentTankLiters) * item.bensin95);

                        return(
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.bensin95}kr</td>
                                <td>{distanceKm}km</td>
                                {(props.kml) // Checks if fuel efficiency has been entered, if true then calculate distance and multiply by kml (converted from m to km, and from 100km/l to 1km/l) and location price
                                    ? <td>{ Math.round(distanceLiters*item.bensin95)}kr</td>
                                    : <td></td>
                                }
                                {currentTankLiters.toFixed(2) > 0 // approximates how much fuel will be left in the tank after the trip, renders red if user does not have enough fuel (negative value)
                                    ? <>
                                        <td><p>{currentTankLiters.toFixed(3)}L</p></td>
                                        <td>{costToFill}</td>
                                    </>
                                    : <>
                                        <td><p className="text-danger">{currentTankLiters.toFixed(3)}L</p></td>
                                        <td><p className="text-danger">Out of range</p></td>
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