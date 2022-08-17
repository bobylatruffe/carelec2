// obtenir les polyline, distance, durée d'un trajet 

const getTrajetGargisteToUser = (garagistePosLatLon, userAdresseLatLon) => {
  return fetch("http://router.project-osrm.org/route/v1/driving/" +
    garagistePosLatLon.lon + "," + garagistePosLatLon.lat + ";" +
    userAdresseLatLon.lon + "," + userAdresseLatLon.lat + "?geometries=polyline")
    .then(data => data.json())
    .then(data => data.routes[0].geometry)
}

export default getTrajetGargisteToUser;