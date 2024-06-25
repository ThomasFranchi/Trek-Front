import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import icoHome from "../assets/pictures/ico_home.png"
import icoParcours from "../assets/pictures/ico_parcours.png"
import icoTrek from "../assets/pictures/ico_treks.png"
import icoGuide from "../assets/pictures/ico_guides.png"
import icoClient from "../assets/pictures/ico_clients.png"
import logo from "../assets/pictures/logo.png"
import '../styles/styleTopbar.css';

import { UserConnect } from "../App";

export default function Topbar() 
{
  /* State variables */
  const navigate=useNavigate();
  const {userLog, disconnect} = useContext(UserConnect);

  function goToProfile()
  {
    navigate("/my-profile");
  }

  function logout()
  {
    disconnect();
    navigate("/");
  }

  return (
    <div id="topbar">
      <div className="topbar-line">
        <img className="logo" src={logo} alt="Logo Site"></img>   
        <nav className="topbar-line">
          {!userLog && ( <div className="linkDiv">
            <Link className="link" to="/"><img className="sideIcon" src={icoHome} alt="Icone de l'Accueil"></img> Accueil</Link>
          </div>)}
          <div className="linkDiv">
            <Link className="link" to="/parcours/"><img className="sideIcon" src={icoParcours} alt="Icone des parcours"></img> Parcours</Link>
          </div>
          <div className="linkDiv">
            <Link className="link" to="/treks/"><img className="sideIcon" src={icoTrek} alt="Icone des treks"></img> Treks</Link>
          </div>
          <div className="linkDiv">
            <Link className="link" to="/guides/"><img className="sideIcon" src={icoGuide} alt="Icone des guides"></img> Guides</Link>
          </div>
          {userLog.role !== "guide" && (
            <div className="linkDiv">
              <Link className="link" to="/clients/"><img className="sideIcon" src={icoClient} alt="Icone des clients"></img> Clients</Link>
            </div>
          )}
          <div id = "guideButtons">
            {userLog.role === "guide" && ( <button className="profileButton" onClick={goToProfile}>Mon profil</button> )}
            <button onClick={logout} className="buttondeco">Deconnexion</button>
            </div>
        </nav>
      </div>   
    </div>
  );
}