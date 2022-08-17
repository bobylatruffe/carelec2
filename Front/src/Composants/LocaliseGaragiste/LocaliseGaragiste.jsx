import React, { Fragment } from 'react';
import L, { marker } from 'leaflet';
import polyUtil from 'polyline-encoded';
import { auth, getAdresseUser } from '../../utilitaires/firebaseUtil';
import getInfosAdresse from '../../utilitaires/nominatim';
import getTrajetGargisteToUser from '../../utilitaires/osrm';

import "./LocaliseGaragiste.css"

class LocaliseGaragiste extends React.Component {
  state = {
    map: null,
    markerGaragiste: null,
    markerUser: null,
    trajet: null,
  }

  getGaragistePos = () => {
    return fetch("http://localhost:5000/api/getGaragistePos/")
      .then(pos => pos.json())
  }

  initSuivi = (userAdresseLatLong) => {
    this.getGaragistePos()
      .then(garagistePos => {
        let markerGaragiste = this.state.markerGaragiste;
        if (!markerGaragiste) {
          markerGaragiste = L.marker(garagistePos);
          markerGaragiste.addTo(this.state.map);
        } else {
          markerGaragiste.setLatLng(garagistePos);
        }

        getTrajetGargisteToUser(
          {
            lat: garagistePos[0],
            lon: garagistePos[1],
          },
          userAdresseLatLong
        ).then(polyline => {
          let trajet = this.state.trajet;
          console.log(polyline);
          let currentTrajet = polyUtil.decode(polyline);
          console.log(currentTrajet);

          if (!trajet) {
            trajet = L.polyline(currentTrajet, { color: "black" });
            trajet.addTo(this.state.map);
          } else {
            trajet.setLatLngs(currentTrajet);
          }

          this.state.map.flyToBounds(trajet.getBounds());

          this.setState({
            trajet,
          })
        })

        this.setState({
          markerGaragiste,
        })
      })
  }

  startGeolocalisation = () => {
    if (!this.state.map) {
      let map = L.map('carte').setView([48.5734053, 7.7521113], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '© OpenStreetMap'
      }).addTo(map);

      getAdresseUser(auth.currentUser.uid)
        .then(adresse => {
          getInfosAdresse(adresse)
            .then(infos => {
              let markerUser = L.marker([infos.lat, infos.lon]);
              markerUser.addTo(map);
              this.setState({
                markerUser,
                infosAdresseUser: infos,
              })
              // this.initSuivi({
              //   lat: infos.lat, lon: infos.lon
              // })
              setInterval(() => this.initSuivi({
                lat: infos.lat, lon: infos.lon
              }), 5000);
            })
        })

      this.setState({
        map,
      })
    }
  }


  render() {
    console.log(this.state);
    return (
      <div>
        <h1>Localise garagiste</h1>
        <h3> Envoi d'un sms pour prévenir le client </h3>
        <button onClick={this.startGeolocalisation}>Suivre le garagiste</button>
        < div id='carte' >

        </div>
      </div >
    )
  }
}

export default LocaliseGaragiste;