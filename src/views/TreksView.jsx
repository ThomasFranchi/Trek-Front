import { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';

import { UserConnect } from "../App";

import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import TreksRegister from "../components/organisms/TreksRegister";
import Trek from "../components/Trek";
import "../styles/styleTrekView.css"

export default function TreksView() {
  const [treksList, setTreksList] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const { userLog } = useContext(UserConnect);

  useEffect(() => { displayTreksList() }, [])

  async function displayTreksList() {
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
    const response = await fetch('http://localhost:3001/treks', options);
    const data = await response.json();
    console.log(data);
    if (!data) {
      setTreksList([]);
      setErrorMsg("Aucun résultat trouvé");
    }

    if (Array.isArray(data)) {
      setTreksList(data);
      setErrorMsg("");
    }
    console.log(data);
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
          {userLog.role !== "guide" && (<TreksRegister />)}
          <div id="treksList">
            <p className="listeDateView">Liste des dates</p>
            {errorMsg}
            
            {treksList.map((trek) => (
              <Trek
                key={trek.slug}
                trekName={trek.trek_name}
                beginDate={trek.begin_date}
                endDate={trek.end_date}
                parcoursID={trek.parcours_id}
                guideID={trek.guide_id}
                minPlaces={trek.min_places}
                maxPlaces={trek.max_places}
                state={trek.trek_state}
                slug={trek.slug}
              />
            ))}
          </div>
            {/* <Footer ClassName="footer" /> */}
        </>
      )}
    </div>
  );
}