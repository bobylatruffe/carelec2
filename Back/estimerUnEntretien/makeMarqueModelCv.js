/**
 * Nom ...................... : makeMarqueModel.js
 * Rôle ..................... : 
 * 
Le but de ce "module" est de réussir à transformer une chaîne de caractère qui peut prendre plusieurs forme, en un objet standarisé pour notre projet.
Ce standard est le suivant : 
{
  marque: marqueDuVéhicule,
  model: modelDuVéhicule,
  cv: N,
}
Par exemple : 
"AUDI A1 (8X1, 8XK) 1.4 TFSI (125Cv)" => {
  marque: audi,
  model: A1 1.4 TFSI
  cv: 125
}

"FIAT GRANDE PUNTO (199_) 1.3 D Multijet (75Ch)" => {
  marque: fiat,
  model: grande punto 1.3 D multijet
  cv: 75
}

"RENAULT KANGOO Express (FW0/1_) 1.5 dCi 75 (75Cv)" => {
  marque: renault,
  model: kangoo express 1.5 dci 75,
  cv: 75
}

Des exemples des résultats que l'on souhaite standarsié sont disponnible dans le fichier exemples_requetes.data.

 * Autheur .................. : Bozlak Fatih 1503001522G
 * Licence .................. : IED L2 Informatique
 * Année .................... : 2021/2022
 * Usage .................... : node makeMarqueModelCv.js "string reçu par une API"
 **/





let cl = console.log;

function makeMarqueModelCv(chaine) {
  let inputData = chaine.toLowerCase();
  inputData = inputData.replaceAll('é', 'e');

  let marqueModelCv = {};
  let tokens = inputData.split(" ");

  // l'API que j'utilise, retourne tjr à la fin le nombre de chevaux.
  function setCv(tokens) {
    let cvBuffer = tokens[tokens.length - 1].slice(1, -1); // on enleve les parthenses
    return parseInt(cvBuffer);
  }

  marqueModelCv.cv = setCv(tokens);
  tokens.pop(); // plus besoin des cv

  // les "initules", sont des inforamtions obtenu par l'api que je n'utilise pas
  function enleveInitule(tokens) {
    let newTokens = []
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].includes("(") || tokens[i].includes(")"))
        continue;
      newTokens.push(tokens[i])
    }

    return newTokens;
  }

  tokens = enleveInitule(tokens);

  // Tester si la marque est un mot composé, en fonction de mes données des voitures 
  function setMarque(tokens) {
    switch (tokens[0]) {
      case "alfa":
        marqueModelCv.marque = "alfa romeo";
        tokens.splice(0, 2);
        break;
      case "mini":
        marqueModelCv.marque = "mini";
        tokens.splice(0, 2);
        break;
      default:
        marqueModelCv.marque = tokens[0];
        tokens.splice(0, 1);
    }
  }

  setMarque(tokens);

  function romainToDecimal(tokens) {
    let newTokens = [];
    for (token of tokens) {
      switch (token) {
        case "i":
          newTokens.push("1");
          continue;

        case "ii":
          newTokens.push("2");
          continue;

        case "ii":
          newTokens.push("2");
          continue;

        case "iii":
          newTokens.push("3");
          continue;

        case "iv":
          newTokens.push("4");
          continue;

        case "v":
          newTokens.push("5");
          continue;

        case "vi":
          newTokens.push("6");
          continue;

        case "vii":
          newTokens.push("7");
          continue;

        case "viii":
          newTokens.push("8");
          continue;

        case "ix":
          newTokens.push("9");
          continue;
      }

      newTokens.push(token);
    }

    return newTokens;
  }

  tokens = romainToDecimal(tokens);
  marqueModelCv.model = tokens.join(" ");

  if(process.argv[2])
    console.log(JSON.stringify(marqueModelCv))
  return JSON.stringify(marqueModelCv);
}

// if (process.argv[2] == "" || process.argv[2] == undefined) {
//   console.log("Usage: \n\tnode makeMarqueModelCv.js nom_fichier.data\n");
//   return;
// }

// if (process.argv[2] == "TEST") {
//   if(process.argv[3] == undefined) {
//     console.log("Usage: \n\tnode makeMarqueModelCv.js TEST nom_fichier.data\n");
//     return
//   }

//   let readline = require('readline');
//   let fs = require('fs');

//   let myInterface = readline.createInterface({
//     input: fs.createReadStream(process.argv[3])
//   });

//   myInterface.on('line', function (line) {
//     // console.log(line);
//     console.log(makeMarqueModel(line))
//   });

//   return
// }

// return makeMarqueModel(process.argv[2]);

if(process.argv[2]) 
makeMarqueModelCv(process.argv[2]);

module.exports = makeMarqueModelCv;