import React from "react";

class Resumer extends React.Component {
  render() {
    return (
      <div>
        <h1>Resume de votre entretien</h1>
        <h2>Votre véhicule : {this.props.infosVehicule.marque + " " + this.props.infosVehicule.motorisation}</h2>
        <h2>Avec {this.props.infosVehicule.kmVehicule} Km</h2>
        <h2>Ce que nous allons réaliser </h2>
        {this.props.infosVehicule.revisionsKmPropose.map(elem => {
          return <h3>{elem}</h3>
        })}
      </div>
    )
  }
}

export default Resumer;