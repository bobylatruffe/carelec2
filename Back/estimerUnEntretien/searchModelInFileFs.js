/**
 * Nom ...................... : searchModelInFileFs.js
 * Rôle ..................... : 
 * 
Le but de ce "module" est de trouver le fichier contenant tous les types de modèle (motirisation, chevaux) d'un véhicule donnée.
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
 * Usage .................... : node searchModelInFileFs.js ['string standardisé par makeMarqueModelCv.js' | TEST]
 **/

// if (process.argv[2] == "TEST") {
//   if (process.argv[3] == undefined) {
//     console.log("Usage: \n\tnode searchModelInFileFs.js TEST nom_fichier.data\n");
//     return
//   }

//   let readline = require('readline');
//   let fs = require('fs');

//   let myInterface = readline.createInterface({
//     input: fs.createReadStream(process.argv[3])
//   });

//   myInterface.on('line', function (line) {
//     // console.log(line);
//     searchModelInFileFs(line);
//   });

//   return
// }

// if (process.argv[2] == undefined) {
//   console.log("Usage: \n\tnode searchModelInFileFs.js 'string_strandardisé_par_makeMarqueModelCv.js' | TEST nom_fichier_standardisé.data\n")
//   return;
// }




// searchModelInFileFs(process.argv[2]);

function searchModelInFileFs(inputDataStandardise) {
  const fs = require('fs');
  cl = console.log;

  let marqueModelCv = JSON.parse(inputDataStandardise);

  let baseDir = "./Carnets d'entretiens";

  // trouver le dossier qui correspond à la marque 
  let dirs = fs.readdirSync(baseDir).map(elem => elem.toLowerCase());
  for (marqueDir of dirs) {
    if (marqueDir == marqueModelCv.marque) {
      baseDir += "/" + marqueDir;
    }
  }

  // trouver le modèle de la marque
  let motorisationsPossible = [];
  let modelsFiles = fs.readdirSync(baseDir).map(elem => elem.toLowerCase());
  for (model of modelsFiles) {
    if (marqueModelCv.model.includes(model.split(".")[0])) {
      motorisationsPossible.push(baseDir + "/" + model)
    }
  }

  // parcours de chaque model possible (un model contient plusieurs motorisation)
  let listeMotor;
  let max = [];
  for (motorisationFile of motorisationsPossible) {
    let motorisationRaw = fs.readFileSync(motorisationFile);
    let motorisations = JSON.parse(motorisationRaw);
    listeMotor = Object.keys(motorisations);
    max = [];
    let currentMax = 0;
    for (let i = 0; i < listeMotor.length; i++) {
      if (listeMotor[i].includes(marqueModelCv.cv + "")) {
        max.push({
          valeur: trouveMaxCorrespndance(listeMotor[i]),
          motor: listeMotor[i],
        })
      }
    }
    if (max.length == 1) {
      // console.log(max[0].motor);
      // console.log(motorisations[max[0].motor])
      return ({
        motorisation: max[0].motor,
        revisions: motorisations[max[0].motor]
      });;
    }

    if (max.length > 1) {
      max.sort((a, b) => {
        return b.valeur - a.valeur;
      })

      // cl(max);
      // console.log({
      //   motorisation: max[0].motor, 
      //   revisions: motorisations[max[0].motor]
      // });
      return ({
        motorisation: max[0].motor,
        revisions: motorisations[max[0].motor]
      });
    }
  }

  function trouveMaxCorrespndance(motor) {
    let i = 0;
    let tokens = motor.split(" ").map(elem => elem.toLowerCase());
    for (token of tokens) {
      if (marqueModelCv.model.includes(token))
        i++;
    }

    return i;
  }
}

module.exports = searchModelInFileFs 