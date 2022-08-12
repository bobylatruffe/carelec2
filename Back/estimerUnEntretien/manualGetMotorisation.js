/**
 * Nom ...................... : manualGetMotorisation.js
 * Rôle ..................... : 
 * 
L'objectif de se module et de trouver l'ensemble des révisions d'un véhicule donnée manuellement (sans rentrer sa plaque d'immatriculation),
en choisissant étape par étape : MARQUE -> MODELE -> MOTORISATION

 * Autheur .................. : Bozlak Fatih 1503001522G
 * Licence .................. : IED L2 Informatique
 * Année .................... : 2021/2022
 * Usage .................... : node manualGetMotorisation.js "MARQUE_VEHICULE"
 **/

const fs = require('fs');
let baseDir = "./Carnets d'entretiens/";
let currentSearchDir = "";
let cl = console.log;

function getMarques() {
  let dirs = fs.readdirSync(baseDir).map(elem => elem.toLowerCase());

  return dirs;
}

function getModels(marque) {
  currentSearchDir = baseDir + marque.toLowerCase();
  let modelsDispo;
  // let modelsDispo = fs.readdirSync(dir).map(elem => elem.toLowerCase());

  try {
    modelsDispo = fs.readdirSync(currentSearchDir);
  } catch (err) {
    return undefined;
  }

  modelsDispo = modelsDispo.map(elem => elem.split(".")[0]);

  return modelsDispo;
}

function getMotorisations(model) {
  currentSearchDir += "/" + model;

  let motorisationsDispo = fs.readFileSync(currentSearchDir + ".json");
  motorisationsDispo = JSON.parse(motorisationsDispo);

  return motorisationsDispo;
}

function getEntretien(motorDispo, voulu) {
  motorDispoListe = Object.keys(motorDispo);

  for (motor of motorDispoListe) {
    if (motor == voulu)
      return motorDispo[voulu];
  }
}


function manualGetMotorisation(marqueRechercher) {
  if (!marqueRechercher) {
    cl("Usage: \n\tnode manualGetMotorisation marque_véhicule")
    return;
  }

  marqueRechercher = marqueRechercher.toLowerCase();

  let marquesDispo = getMarques();
  // cl(marquesDispo);

  let modelsDispo = getModels(marqueRechercher);
  // cl(modelsDispo);

  let motorisationsDispo = getMotorisations(modelsDispo[2]);
  // cl(motorisationsDispo);

  let entretien = getEntretien(motorisationsDispo, 'Agila B 1.0 LPG 65cv');
  cl(entretien)
}

// manualGetMotorisation(process.argv[2]);

module.exports = {getMarques, getModels, getMotorisations, getEntretien}
