import React from "react"

class EstimerUnEntretien extends React.Component {
  state = {
    etapes: 1,
    inputPlaque: '',
    inputKm: '',
    infosVehicule: {},
    revisionProposer: [],
    marques: [],
    models: [],
    motorisations: [],
    revisions: {}
  }

  handlerInputPlaque = (e) => {
    this.setState({ inputPlaque: e.target.value.toLowerCase() })
  }

  detecteStatus(reponseServeur) {
    switch (reponseServeur.status) {
      case 0:
        this.setState({ etapes: 0 });
        break;
      case 1:
        this.setState({ etapes: 2, infosVehicule: reponseServeur });
        break;
      case 2:
        this.setState({ etapes: 9, marques: reponseServeur.marques });
        break;

      default:
    }
  }

  handlerOui = () => {
    this.setState({ etapes: 3 })
  }


  handlerNon = () => {
    fetch("http://localhost:5000/api/getMarques")
      .then(resp => resp.json())
      .then(resp => this.setState({ marques: resp, etapes: 9 }));
  }

  handlerGetPlaque = () => {
    let plaque = this.state.inputPlaque || "rien"

    fetch("http://localhost:5000/api/getInfosVehicule/" + plaque
    )
      .then(reponseServeur => reponseServeur.json())
      .then(reponseServeur => this.detecteStatus(reponseServeur))
      .catch(err => err);
  }

  handlerInputKm = (e) => {
    this.setState({ inputKm: e.target.value })
  }

  // faut implemnter en fonction de la date de mise en circulation aussi !
  handlerGetRevisions = () => {
    let listeRevisionsKM = this.state.infosVehicule.revisions.revisions.km;
    let kmsBrute = Object.keys(listeRevisionsKM);
    let kmsInt = Object.keys(listeRevisionsKM).map(elem => {
      let tokensKm = elem.split("\u00a0");
      let kmInt = parseInt(tokensKm[0] + '' + tokensKm[1]);
      return kmInt;
    })
    let kmUser = parseInt(this.state.inputKm);

    for (let i = 0; i < kmsInt.length; i++) {
      if (kmUser > kmsInt[i]) {
        if (i == kmsInt.length - 1) {
          this.setState({ revisionKmProposer: listeRevisionsKM[kmsBrute[i]] })
          break;
        }
        if (kmUser < kmsInt[i + 1]) {
          this.setState({ revisionKmProposer: listeRevisionsKM[kmsBrute[i + 1]] })
        }
      }
    }

    this.setState({ etapes: 4 })
  }

  handlerMarque = (e) => {
    let marque = e.target.value || 'rien';
    if (marque == "rien")
      return

    fetch("http://localhost:5000/api/getModels/" + marque)
      .then(resp => resp.json())
      .then(resp => this.setState({ models: resp }));
  }

  handlerModels = (e) => {
    let model = e.target.value || 'rien';
    if (model == "rien")
      return
    console.log(model);
    fetch("http://localhost:5000/api/getMotorisations/" + model)
      .then(resp => resp.json())
      .then(resp => this.setState({
        revisions: resp,
        motorisations: Object.keys(resp),
      }));
  }

  handlerMotorisations = (e) => {
    let model = e.target.value || 'rien';
    if (model == "rien")
      return

    this.setState({
      infosVehicule: {
        revisions: {
          revisions: this.state.revisions[e.target.value]
        }
      },
      etapes: 3,
    })
  }

  render() {
    console.log(this.state)
    switch (this.state.etapes) {
      case 0:
        return (
          <div>
            <h1>Désolé mais nous ne pouvons pas encore traiter votre véhicule ...</h1>
          </div>
        )
      case 1:
        return (
          <div>
            <h1>Estimer le coût de votre entretien</h1>
            <input type='text' placeholder='AC654BL' onChange={this.handlerInputPlaque} />
            <button onClick={this.handlerGetPlaque}>OK</button>
          </div>
        )
      case 2:
        return (
          <div>
            <h1>S'agit-il du véhicule {this.state.infosVehicule.revisions.motorisation} ?</h1>
            <button onClick={this.handlerOui}>Oui</button>
            <button onClick={this.handlerNon}>Non</button>
          </div>
        )
      case 3:
        return (
          <div>
            <h1>Pouvez-vous nous indiquer le nombre de km ?</h1>
            <input type='text' placeholder='150000' onChange={this.handlerInputKm} />
            <button onClick={this.handlerGetRevisions}>OK</button>
          </div>
        )
      case 4:
        return (
          <div>
            <h1>En fonction du KM vous devriez effectuer :</h1>
            {this.state.revisionKmProposer.map(elem => {
              return <p>{elem}</p>
            })}
          </div>
        )
      case 9:
        return (
          <div>
            <h1>Essayons d'identifer correctement votre véhicule :</h1>
            <select onChange={this.handlerMarque}>
              <option value="" >Choissisez la marque</option>
              {this.state.marques.map(elem => {
                return (
                  <option value={elem}>{elem}</option>)
              })}
            </select>

            <select onChange={this.handlerModels}>
              <option value="" >Choissisez le modele</option>
              {this.state.models.map(elem => {
                return (
                  <option value={elem}>{elem}</option>)
              })}
            </select>

            <select onChange={this.handlerMotorisations}>
              <option value="" >Choissisez la motorisation</option>
              {this.state.motorisations.map(elem => {
                return (
                  <option value={elem}>{elem}</option>)
              })}
            </select>

          </div>
        )
      default:
    }
  }
}

export default EstimerUnEntretien;