const express = require('express');
const polyUtil = require('polyline-encoded');
const app = express();

const getRevision = require('./estimerUnEntretien/getRevision');
const { getModels, getMarques, getMotorisations } = require('./estimerUnEntretien/manualGetMotorisation');

const cl = console.log;

let simulationGps = [];
function getGaragistePos() {
  if (simulationGps.length === 0)
    simulationGps = polyUtil.decode("ayhgHcbkn@R}GsB_CGwEvFEjCt\\cCbz@{Pd~@jc@b_@{Rpv@mBdBeA}AbBaCvHlHjd@pl@zHtOvF|XfEdy@pS|h@rBvOdCnAj[yHxt@gZ~WbKpj@tEvw@`i@pExJpQ~x@hSrOh@yF");
    

  return simulationGps.shift();
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/api/getInfosVehicule/:numPlaque", (req, resp) => {
  getRevision(req.params.numPlaque)
    .then(revisions => resp.send(revisions))
    .catch(marques => resp.send(marques))
});

app.get("/api/getMotorisations/:model", (req, resp) => {
  resp.send(getMotorisations(req.params.model))
});

app.get("/api/getModels/:marque", (req, resp) => {
  resp.send(getModels(req.params.marque));
});

app.get("/api/getMarques", (req, resp) => {
  resp.send(getMarques());
});

app.get("/api/getGaragistePos/", (req, resp) => {
  resp.send(getGaragistePos());
});

app.get("/*", (req, resp) => {
  resp.send({ status: 404 })
});

app.listen(5000, () => {
  cl("Je suis à l'écoute sur le port 5000");
});