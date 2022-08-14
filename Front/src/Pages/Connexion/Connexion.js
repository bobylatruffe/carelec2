import { async } from "@firebase/util";
import React from "react";

import { getAuth, signInWithGooglePopup, signInWithPopup } from '../../utils/firebase'
import { createUserDocumentFromAuth } from '../../utils/firebase';

class Connexion extends React.Component {

  logGoogleUser = async () => {
    const response = await signInWithGooglePopup();
    const userDocRef = await createUserDocumentFromAuth(response.user);
    
  }

  render() {
    return (
      <div>
        <h1>Connexion</h1>
        <button onClick={this.logGoogleUser}>Sign in with google pop up</button>
      </div>
    )
  }
}

export default Connexion;