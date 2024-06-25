import { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import Client from "../components/Clients";
import { UserConnect } from "../App";

import "../styles/styleClientView.css";

function ClientsView() {
  //const [isConnected, setIsConnected] = useState(false);
  const [clientsList, setClientsList] = useState([])
  const [errorMsg, setErrorMsg] = useState("");
  const { userLog } = useContext(UserConnect);

  useEffect(() => { displayClientsList() }, [])

  async function displayClientsList() {
    let token = localStorage.getItem("token");

    const options =
    {

      method: 'GET',
      headers:
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: "Bearer " + token
      }
    };
    const response = await fetch('http://localhost:3001/clients/', options);
    const data = await response.json()
    console.log(data);
    if (!data) {
      setClientsList([]);
      setErrorMsg("Aucun résultat trouvé");
    }

    if (Array.isArray(data)) {
      setClientsList(data);
      setErrorMsg("");
    }
  }

  return (
    <div>
      {!userLog && (
        <>
          <p>Vous n'avez pas l'autorisation d'accéder à cette page</p>
          <p><Link to="/">Retour à l'accueil</Link></p>

        </>
      )}
      {userLog && (
        <>
          <Topbar />
          <div id="guidesList">
            <p className="clientListTitle">Liste des clients</p>
            {errorMsg}
            {clientsList.map((client) => (
              <Client
                key={client.slug}
                profilePicture={client.client_picture}
                firstName={client.firstname}
                lastName={client.lastname}
                mail={client.email}
                // password={client.password}
                slug={client.slug}
              />
            ))}
          </div>

            {/* <Footer ClassName="footer" /> */}
   
        </>
      )}
    </div>
  );
}

export default ClientsView;
