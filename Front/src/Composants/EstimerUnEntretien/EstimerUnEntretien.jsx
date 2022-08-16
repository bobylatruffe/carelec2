import React from "react"
import Connexion from "../Connexion/Connexion"
import Resumer from "../Resumer/Resumer"
import { addRdvUser, auth } from "../../utilitaires/firebaseUtil"

class EstimerUnEntretien extends React.Component {
  state = {
    etapes: 0,
    inputPlaque: '',
    inputKm: '',
    infosVehicule: {},
    forManuelSearch: {
      marques: [],
      models: [],
      motorisations: [],
    }
  }

  componentDidMount() {
    auth.signOut();
  }

  handlerInputPlaque = (e) => {
    this.setState({ inputPlaque: e.target.value.toLowerCase() })
  }

  handlerInputKm = (e) => {
    this.setState({ inputKm: e.target.value })
  }

  handletGetRevisionsPlaque = () => {
    // avant de call api, tester inputPlaque !!!
    fetch("http://localhost:5000/api/getInfosVehicule/" + this.state.inputPlaque)
      .then(resp => resp.json())
      .then(resp => {
        if (resp.status === 1)
          this.setState({
            etapes: 1,
            infosVehicule: {
              plaque: this.state.inputPlaque,
              dateMiseCirculation: resp.dateMiseCirculation,
              marque: resp.marque,
              motorisation: resp.motorisation,
              revisionsKm: resp.revisionsKm,
            }
          })
      })
  }

  handlerOui = () => {
    this.setState({
      etapes: 3,
    })
  }

  handlerNon = () => {
    fetch("http://localhost:5000/api/getMarques")
      .then(marques => marques.json())
      .then(marques => this.setState({
        forManuelSearch: {
          marques,
          models: [],
          motorisations: [],
          allModelsRevisions: {},
        }
      }))

    this.setState({
      etapes: 9,
    })
  }

  handlerShowRevisions = () => {
    const kmUser = this.state.inputKm;
    const revisionsKm = this.state.infosVehicule.revisionsKm;

    let kmLibelles = Object.keys(revisionsKm).map(elem => {
      return {
        intKm: parseInt(elem.split("\u00a0").slice(0, -1).join("")),
        stringKm: elem,
      }
    })

    let revisionsKmPropose = null;

    for (let i = 0, j = kmLibelles.length; i < j; i++) {
      if (kmUser > kmLibelles[i].intKm && i < j - 1)
        continue;
      revisionsKmPropose = revisionsKm[kmLibelles[i].stringKm];
      break;
    }

    this.setState({
      infosVehicule: {
        // bon j'ai découvert qu'on pouvais utilsier ... à la palce de tout redonner ............ :/
        ...this.state.infosVehicule,
        kmVehicule: this.state.inputKm,
        revisionsKmPropose,
      },
      etapes: 4,
    })
  }

  handlerGetMarques = () => {
  }

  handlerGetModels = (e) => {
    fetch("http://localhost:5000/api/getModels/" + e.target.value)
      .then(models => models.json())
      .then(models => this.setState({
        infosVehicule: {
          marque: e.target.value,
        },
        forManuelSearch: {
          marques: this.state.forManuelSearch.marques,
          models: models,
          motorisations: this.state.forManuelSearch.motorisations,
        }
      }))
  }

  handlerGetMotorisations = (e) => {
    fetch("http://localhost:5000/api/getMotorisations/" + e.target.value)
      .then(motorisations => motorisations.json())
      .then(motorisations => this.setState({
        infosVehicule: {
          marque: this.state.infosVehicule.marque,
        },

        forManuelSearch: {
          marques: this.state.forManuelSearch.marques,
          models: this.state.forManuelSearch.models,
          motorisations: Object.keys(motorisations),
          allModelsRevisions: motorisations,
        }
      }))
  }

  handlerGetRevisionsManual = (e) => {
    this.setState({
      infosVehicule: {
        marque: this.state.infosVehicule.marque,
        motorisation: e.target.value,
        revisionsKm: this.state.forManuelSearch.allModelsRevisions[e.target.value].km,
      },
      etapes: 3,
    })
  }

  handlerValider = () => {
    this.setState({
      etapes: 10,
    })
    // ah supp ça ! c'est juste pour tester
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log(user.displayName);
        this.setState({ etapes: 11, userCurrentUid: user.uid });
      }
    })
  }

  handlerChangeDate = (e) => {
    this.setState({
      infosVehicule: {
        ...this.state.infosVehicule,
        dateRdv: e.target.value,
      }
    })
  }

  handlerValiderDateRdv = () => {
    addRdvUser(this.state.userCurrentUid, this.state.infosVehicule)
      .then(() => this.setState({ etapes: 12 }))
  }

  render() {
    console.log(this.state)
    switch (this.state.etapes) {
      case 999:
        return (
          <div>
            <h1>Désolé mais nous ne pouvons pas encore traiter votre véhicule ...</h1>
          </div>
        )
      case 0:
        return (
          <div>
            <h1>Estimer le coût de votre entretien</h1>
            <input type='text' placeholder='AC654BL' onChange={this.handlerInputPlaque} />
            <button onClick={this.handletGetRevisionsPlaque}>OK</button>
            <button onClick={this.handlerNon}>Recherche manuellement</button>
          </div>
        )
      case 1:
        return (
          <div>
            <h1>S'agit-il du véhicule {this.state.infosVehicule.marque.toUpperCase() + " " + this.state.infosVehicule.motorisation} ?</h1>
            <button onClick={this.handlerOui}>Oui</button>
            <button onClick={this.handlerNon}>Non</button>
          </div>
        )
      case 3:
        return (
          <div>
            <h1>Pouvez-vous nous indiquer le nombre de km ?</h1>
            <input type='number' placeholder='150000' onChange={this.handlerInputKm} />
            <button onClick={this.handlerShowRevisions}>OK</button>
          </div>
        )
      case 4:
        return (
          <div>
            <h1>En fonction du KM vous devriez effectuer :</h1>
            {this.state.infosVehicule.revisionsKmPropose.map(elem => {
              return <p>{elem}</p>
            })}

            <button onClick={this.handlerValider}>Prendre RDV</button>
          </div>
        )
      case 9:
        return (
          <div>
            <h1>Essayons d'identifer correctement votre véhicule :</h1>
            <select onChange={this.handlerGetModels}>
              <option value="" >Choissisez la marque</option>
              {this.state.forManuelSearch.marques.map(elem => {
                return (
                  <option value={elem}>{elem}</option>)
              })}
            </select>

            <select onChange={this.handlerGetMotorisations}>
              <option value="" >Choissisez le modele</option>
              {this.state.forManuelSearch.models.map(elem => {
                return (
                  <option value={elem}>{elem}</option>)
              })}
            </select>

            <select onChange={this.handlerGetRevisionsManual}>
              <option value="" >Choissisez la motorisation</option>
              {this.state.forManuelSearch.motorisations.map(elem => {
                return (
                  <option value={elem}>{elem}</option>)
              })}
            </select>
          </div>
        )
      case 10:
        return (
          <Connexion infosVehicule={this.state.infosVehicule} />
        )
      case 11:
        return (
          <div>
            <Resumer infosVehicule={this.state.infosVehicule} />
            <h1>Choisir la date voulu de l'entretien</h1>
            <input type="date" onChange={this.handlerChangeDate}></input>
            <button onClick={this.handlerValiderDateRdv}>Valider</button>
          </div>
        )

      case 12:
        return (
          <div>
            <h1>Merci votre RDV et confirmer pour le {this.state.infosVehicule.dateRdv}</h1>
          </div>
        )
      default:
    }
  }
}

export default EstimerUnEntretien;