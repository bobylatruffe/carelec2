const express = require('express');
const app = express();
const polyUtil = require('polyline-encoded');
const fs = require('fs');

const cl = console.log;





app.use(function (req, res, next) {
  // pour une utilisation local
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});










const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathBase = 'img/etatDesLieux/';
    try {
      fs.mkdirSync(pathBase + req.body.immat);
    } catch (err) {
      // on ignore les erreurs pour l'instant;
      // notamment pour EEXIST
    }
    cb(null, 'img/etatDesLieux/' + req.body.immat)
  },
  filename: function (req, file, cb) {
    let nameFile =
      req.body.posXY +
      "-" +
      Math.round(Math.random() * 1E5) +
      Date.now() +
      ".png"
    cb(null, nameFile)
  }
})
const upload = multer({ storage, })

app.post('/api/setEtatDesLieuxImmat/', upload.any('etatsDesLieux'), function (req, res, next) {
  res.send({ status: 200 })
})



function getEtatDesLieuxImg(immat) {
  let listeImg = null;
  try {
    listeImg = fs.readdirSync(__dirname + "/img/etatDesLieux/" + immat);
  } catch (err) {
  }

  if(listeImg) 
  return listeImg

  return {status: 404}
}

app.use("/", express.static("img"));
app.get('/api/getEtatDesLieuxImmat/:immat', (req, resp) => {
  let immat = req.params.immat;
  let listesImg = getEtatDesLieuxImg(immat);



  resp.send(listesImg);
});




let simulationGps = [];
function getGaragistePos() {
  if (simulationGps.length === 0)
    simulationGps = polyUtil.decode("ayhgHcbkn@R}GsB_CGwEvFEjCt\\cCbz@{Pd~@jc@b_@{Rpv@mBdBeA}AbBaCvHlHjd@pl@zHtOvF|XfEdy@pS|h@rBvOdCnAj[yHxt@gZ~WbKpj@tEvw@`i@pExJpQ~x@hSrOh@yF");


  return simulationGps.shift();
}

app.get("/api/getGaragistePos/", (req, resp) => {
  resp.send(getGaragistePos());
});





const getRevision = require('./estimerUnEntretien/getRevision');
const { getModels, getMarques, getMotorisations } = require('./estimerUnEntretien/manualGetMotorisation');

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




app.get("/*", (req, resp) => {
  resp.send({ status: 404 })
});





app.listen(5000, () => {
  cl("Je suis à l'écoute sur le port 5000");
});