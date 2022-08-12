/**
 * Nom ...................... : getRevision.js
 * Rôle ..................... : 
 * 
C'est un "wraper" de makeMarqueModelCv.js et searchModelInFileFs.js utilisant une API pour récupérer les informatins d'un véhicule depuis sa plaque d'immatriculation.
Ce module-wraper, permet de lister toutes les préconisations constructeur d'un modèle de véhicule.

 * Autheur .................. : Bozlak Fatih 1503001522G
 * Licence .................. : IED L2 Informatique
 * Année .................... : 2021/2022
 * Usage .................... : node getRevision.js AANNNAA 
 **/

const searchModelInFileFs = require('./searchModelInFileFs.js');
const makeMarqueModelCv = require('./makeMarqueModelCv');

const fs = require('fs');
const { getMarques } = require('./manualGetMotorisation');

const apiRaw = fs.readFileSync("./estimerUnEntretien/api-plaque.txt");
const apiPlaque = apiRaw.toString();

function getRevision(numPlaque) {
  return fetch(apiPlaque + numPlaque)
    .then(res => res.json())
    .then(res => {
      let libelle = res.vehicule[0].libelle;
      let standardise = makeMarqueModelCv(libelle);
      let revisions = searchModelInFileFs(standardise);

      if (revisions)
        return {
          "status": 1,
          "date1erImmat": res.firstRegistrationDate,
          "revisions": revisions
        }

        return {
          "status": 0,
        }
    })
    .catch(err => {
      return {
        "status": 2,
        "marques": getMarques(),
      }
    })
}


module.exports = getRevision

  // let libelle = res.vehicule[0].libelle
  // console.log(libelle);

  // let standardise = makeMarqueModelCv(libelle);
  // console.log(standardise);

  // let revisions = searchModelInFileFs(standardise);
  // return revisions;
  // })