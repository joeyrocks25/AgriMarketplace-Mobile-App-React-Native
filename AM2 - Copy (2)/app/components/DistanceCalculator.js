import React from "react";

const DistanceCalculator = ({ location1, location2 }) => {
  // console.log("Test1:", location1);
  // console.log("Test2:", location2);
  // Function to calculate the distance between two locations
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInKm = R * c;
    const distanceInMiles = distanceInKm * 0.621371; // Conversion from kilometers to miles
    return distanceInMiles.toFixed(2); // Distance in miles rounded to 2 decimal places
  };

  // Function to convert degrees to radians
  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const distance = calculateDistance(
    location1.latitude,
    location1.longitude,
    location2.latitude,
    location2.longitude
  );
  // console.log("tezz", distance);
  return distance.toString();
};

export default DistanceCalculator;
