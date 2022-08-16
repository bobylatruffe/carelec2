import React from "react";
import { createUser, signIn, signUp, addRdvUser } from "../../utilitaires/firebaseUtil";

import './Connexion.css'

class Connexion extends React.Component {
  state = {
    // 0 => formulaire de connexion
    // 1 => connexion réussi
    // 2 => créer un compte
    status: 0,
    email: '',
    passwd: '',
    confirmPasswd: '',
    nom: '',
    prenom: '',
  }

  handlerChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handlerSignIn = (e) => {
    e.preventDefault();

    signIn(this.state.email, this.state.passwd)
      .then(userData => {
        this.setState({
          userAuth: userData.user,
          status: 1,
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  handlerCreateAcc = (e) => {
    this.setState({
      status: 2,
    })
  }

  handlerSignUp = (e) => {
    e.preventDefault();

    signUp(this.state.email, this.state.confirmPasswd)
    .then(userAuth => {

      createUser(userAuth.user, this.state.nom, this.state.prenom, this.state.email);

      this.setState({
        userAuth: userAuth,
        status: 0,
      })
    })
    .catch(err => console.log(err));
  }

  render() {
    console.log(this.state);
    switch (this.state.status) {
      case 0:
        return (
          <div>
            <h1>Connexion</h1>
            <form onSubmit={this.handlerSignIn}>
              <label>
                Adresse email :
                <input
                  name="email"
                  onChange={this.handlerChange}
                  value={this.state.email}
                  type="email"
                  placeholder="email@gmail.com"></input>
              </label>
              <label>
                Mot de passe :
                <input
                  name="passwd"
                  onChange={this.handlerChange}
                  value={this.state.passwd}
                  type="password"></input>
              </label>
              <button type="submit">Me connecter</button>
              <button type="button" onClick={this.handlerCreateAcc}>Créer un compte</button>
            </form>
          </div>
        )
      // rajouter adresee tel ...
      case 2:
        return (
          <div >
            <h1>Créer un compte</h1>
            <form onSubmit={this.handlerSignUp}>
              <label>
                Nom :
                <input
                  name="nom"
                  type="text"
                  onChange={this.handlerChange}
                  value={this.state.name}></input>
              </label>
              <label>
                Prénom :
                <input
                  name="prenom"
                  type="text"
                  onChange={this.handlerChange}
                  value={this.state.prenom}></input>
              </label>
              <label>
                Adresse email :
                <input
                  name="email"
                  onChange={this.handlerChange}
                  value={this.state.email}
                  type="email"
                  placeholder="email@gmail.com"></input>
              </label>
              <label>
                Mot de passe :
                <input
                  name="passwd"
                  onChange={this.handlerChange}
                  value={this.state.passwd}
                  type="password"></input>
              </label>
              <label>
                Confirmer votre mot de passe :
                <input
                  name="confirmPasswd"
                  onChange={this.handlerChange}
                  value={this.state.confirmPasswd}
                  type="password"></input>
              </label>
              <button type="submit">Créer mon compte</button>
            </form>
          </div>
        )
    }
  }
}

export default Connexion;