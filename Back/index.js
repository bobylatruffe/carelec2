const express = require('express');
const app = express();

const getRevision = require('./estimerUnEntretien/getRevision');

const cl = console.log;

app.get("/api/getInfosVehicule/:numPlaque", (req, resp) => {
  getRevision(req.params.numPlaque)
    .then(revisions => resp.send(revisions))
    .catch(marques => resp.send(marques))
});

app.listen(5000, () => {
  cl("Je suis à l'écoute sur le port 5000");
});