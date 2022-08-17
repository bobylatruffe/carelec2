import EstimerUnEntretien from "./Composants/EstimerUnEntretien/EstimerUnEntretien";
import { Routes, Route } from 'react-router-dom';
import LocaliseGaragiste from "./Composants/LocaliseGaragiste/LocaliseGaragiste";
import Connexion  from "./Composants/Connexion/Connexion";
import { auth } from "./utilitaires/firebaseUtil";
import MonCompte from "./Composants/MonCompte/MonCompte";

function App() {
  return (
    <Routes>
      <Route path="/garagiste" element={
        <div>
        </div>
      }>
      </Route>
      <Route path="/" element={
        <div>
          <h1>Carelec</h1>
          {/* <EstimerUnEntretien /> */}
          <Connexion />
          {/* <MonCompte /> */}
          <LocaliseGaragiste />
        </div>}>
      </Route>
      <Route path="*" element={
        <h1>404</h1>
      }>
      </Route>
    </Routes>
  );
}

export default App;
