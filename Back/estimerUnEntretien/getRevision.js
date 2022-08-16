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

const getMotorisationRevisionsKm = require('./searchModelInFileFs.js');
const makeMarqueModelCv = require('./makeMarqueModelCv');

const fs = require('fs');

const apiRaw = fs.readFileSync("./estimerUnEntretien/api-plaque.txt");
const apiPlaque = apiRaw.toString();

function getRevision(numPlaque) {
  return fetch(apiPlaque + numPlaque)
    .then(res => res.json())
    .then(res => {
      let libelle = res.vehicule[0].libelle;
      let standardise = makeMarqueModelCv(libelle);
      let standardiseJson = JSON.parse(standardise);
      let motorisationRevisionsKm = getMotorisationRevisionsKm(standardise);

      if (motorisationRevisionsKm)
        return ({
          status: 1,
          dateMiseCirculation: res.firstRegistrationDate,
          marque: standardiseJson.marque,
          motorisation: motorisationRevisionsKm.motorisation,
          revisionsKm: motorisationRevisionsKm.revisionsKm,
        })

    }).catch(() => {
      return {
        status: 404,
      }
    })
}


module.exports = getRevision