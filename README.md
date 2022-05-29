# Fuel Efficiency Calculator

Fuel Efficiency Calculator is a simple single-page app in React that calculates prices of gas depending on distance between user and seller locations, and location fuel price. https://apis.is/petrol is used for gas price data.

## Modules and external code

Bootstrap is used for CSS. Axios is used to fetch from API. The project also makes use of React's UseState and UseEffects hooks. 

Haversine formula implementation for geolocation distance calculations courtesy of Chris Veness (https://www.movable-type.co.uk/scripts/latlong.html).

## App Functionality

List of locations and prices is fetched from the API and sorted by cost of the trip to each location (using distance, efficiency, and location's fuel price). An input at the top of the page allows users to enter their vehicle's fuel efficiency (100km/L)

Each row displays location name, distance from user's device to location, and cost of the trip.

If "Expanded Mode" is enabled, two additional inputs and two additional columns appear in case you **REALLY** want to optimize your fuel shopping: 

* "Fuel Max Tank Size" is the vehicle's fuel tank size in liters.
* "Fuel in Tank" is the current amount of fuel in the vehicle (before the trip) in percentages.
* "Cost to Fill" displays how much it will cost to fill the tank once a location is reached, using location fuel cost, tank size, and remaining fuel in the vehicle's tank. If the trip requires more fuel than is in the tank, this column will display "Out of Range"

In "Expanded Mode" the list is ordered by Cost to Fill.
