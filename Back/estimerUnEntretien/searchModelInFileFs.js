/**
 * Nom ...................... : searchModelInFileFs.js
 * Rôle ..................... : 
 * 
Le but de ce "module" est de trouver le fichier contenant tous les types de modèle (motirisation, chevaux, cylindre...) d'un véhicule donnée.
Son unique paramètre est une chaîne représentant un objet "standardisé" pour notre projet via makeMarqueModelCv.js. Ci-après un exemple de résultat :
{
  "80 Avant 2.0 E 115cv": {
    "km": {
      "15\u00a0000\u00a0km": [
        "R\u00e9vision avec vidange"
      ],
      "30\u00a0000\u00a0km": [
        "R\u00e9vision avec vidange",
        "Remplacement Bougies d\u2019Allumage ",
        "Purge du Liquide de Frein",
        "Remplacement Filtre d\u2019Habitacle "
      ],
      [...]
    },
    "time": {
      "1\u00a0an": [
        "R\u00e9vision avec vidange"
      ],
      "2\u00a0ans": [
        "R\u00e9vision avec vidange",
        "Remplacement Bougies d\u2019Allumage ",
        "Purge du Liquide de Frein",
        "Remplacement Filtre d\u2019Habitacle "
      ],
      [...]
    }
  }
}

 * Autheur .................. : Bozlak Fatih 1503001522G
 * Licence .................. : IED L2 Informatique
 * Année .................... : 2021/2022
 * Usage .................... : node searchModelInFileFs.js 'string standardisé par makeMarqueModelCv.js'
 **/

const fs = require("fs");
const cl = console.log;

let currentDir = null;

function getMarquesInFs() {
  let marquesInFs = null;

  try {
    marquesInFs = fs.readdirSync(currentDir).map(elem => elem.toLowerCase())
  } catch (err) {
    console.log("ERROR:\n\t Aucune marques trouvée dans " + currentDir);
    return null;
  }

  return marquesInFs;
}

// Permet de vérifier que le models est présent dans la bdd
function getModelsInFs(marquesInFs, marqueUser) {
  let modelsInFs = null;

  for (let i = 0; i < marquesInFs.length; i++) {
    if (marquesInFs[i] === marqueUser) {
      currentDir += marquesInFs[i] + "/";
      break;
    }
    if (i === marquesInFs.length - 1) {
      console.log("ERROR:\n\t getmodelsInFs(): la marque rechercher par l'utilisateur n'est pas dans la bdd");
      return null;
    }
  }

  try {
    modelsInFs = fs.readdirSync(currentDir);
  } catch (err) {
    console.log("ERROR:\n\t getmodelsInFs(): Aucun models trouvée dans " + currentDir);
    return null;
  }

  return modelsInFs;
}

// retourne le un objet : 
//    le nombre de correspondance de chaîne dans chaîne 2
//    chaîne2
function bestMatch(chaine1, chaine2) {
  let point = 0;
  chaine1 = chaine1.split(" ");
  chaine2 = chaine2.split(" ");

  for (sousChaine1 of chaine1) {
    for (sousChaine2 of chaine2) {
      if (sousChaine1 === sousChaine2.toLowerCase())
        point++;
    }
  }

  return { point: point, libelle: chaine2.join(" ") };
}

function getMotorisationRevisionsInfs(objStandardise) {
  let motorisationRevisionsInfs = null;

  try {
    motorisationRevisionsInfs = fs.readFileSync(currentDir);
  } catch (err) {
    console.log("ERROR:\n\t Impossible de lire le fichier " + currentDir);
    return null;
  }

  let motorisationsRevisionsInJson = JSON.parse(motorisationRevisionsInfs);

  // permet de sélectionner les motorisations ayant le mm nb chevaux que celui de l'user
  let motorisationsLibelles = Object.keys(motorisationsRevisionsInJson).filter(motorLibelle => {
    return (objStandardise.cv === (parseInt(motorLibelle.split(" ").slice(-1)[0].slice(0, -2))));
  });

  let tabPointLibelle = [];
  for (motor of motorisationsLibelles) {
    tabPointLibelle.push(bestMatch(objStandardise.model, motor));
  }
  tabPointLibelle.sort((a, b) => b.point - a.point)

  return ({
    motorisation: tabPointLibelle[0].libelle,
    revisionsKm: motorisationsRevisionsInJson[tabPointLibelle[0].libelle].km,
  });
}

// Permet de trouver le model (fichier) correspondant au maximum au modelUser
function getModelInFs(modelsInFs, objStandardise) {
  let motorisationsInFs = null;
  let modelTrouveInFs = null;
  let modelsPossible = []

  for (let i = 0; i < modelsInFs.length; i++) {
    if (objStandardise.model.includes(modelsInFs[i].split(".json")[0])) {
      modelTrouveInFs = modelsInFs[i];
      break;
    }
  }

  currentDir += modelTrouveInFs // side effect

  return getMotorisationRevisionsInfs(objStandardise);
}

function getMotorisationRevisionsKm(nomStandardise) {
  let objStandardise = JSON.parse(nomStandardise);

  currentDir = "./Carnets d'entretiens/";

  let marquesInFs = getMarquesInFs();
  if (!marquesInFs)
    return;

  let modelsInFs = getModelsInFs(marquesInFs, objStandardise.marque);
  if (!modelsInFs)
    return;

  let motorisationRevisionsKm = getModelInFs(modelsInFs, objStandardise);

  if (process.argv[2])
    cl(motorisationRevisionsKm);
  return motorisationRevisionsKm;
}

if (process.argv[2])
  getMotorisationRevisionsKm(process.argv[2])

module.exports = getMotorisationRevisionsKm 