

// Obtenir les coordonnées lat/lon d'une adresse string

const getInfosAdresse = (adresse) => {
  adresse = adresse.replaceAll(" ", "+");
  return fetch("https://nominatim.openstreetmap.org/search?q=" + adresse + "&format=json")
  .then(infos => infos.json())
  .then(infos => infos[0])
}

export default getInfosAdresse;