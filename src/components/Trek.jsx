import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import emptyStar from "../assets/pictures/ico_emptyStar.png";
import fullStar from "../assets/pictures/ico_fullStar.png";

import Button from "./atoms/Button";
import "../styles/styleTrek.css";

function Parcours ({trekName, name, beginDate, endDate, parcoursID, guideID, minPlaces, maxPlaces, state, slug}) 
{
  const [errorMsg, setErrorMsg] = useState ("");
  const [guide, setGuide] = useState ([]);
  const [parcours, setParcours] = useState ([]);
  const navigate = useNavigate();
  let params = useParams();

  useEffect(() => {getParcoursAndGuideFromIds()}, [])

  async function getParcoursAndGuideFromIds()
  {
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
    const parcoursResponse = await fetch(`http://localhost:3001/parcours/get/${parcoursID}`, options);
    const parcoursData = await parcoursResponse.json();
    if (!parcoursData) 
    {
      setParcours("");
    }
    setParcours(parcoursData);

    const guideResponse = await fetch(`http://localhost:3001/guides/get/${guideID}`, options);
    const guideData = await guideResponse.json();
    console.log(guideData);
    if (!guideData) 
    {
      setGuide("");
    }
    setGuide(guideData);
  }

  function goToTrekPage ()
  {
    console.log(slug);
    navigate('/treks/'+slug);
  }

  return (
    <div className="trekContainer">
      <div className="trekNameInfo">
        <p>{trekName}</p>
        </div>
        <div className="trekParcoursInfo">
          <p><span className="userInfo">Parcours : </span> {parcours.name}</p>
          </div>
          <div className="trekGuideInfo"> 
          <p><span className="userInfo">Animé par : </span> {guide.firstname} {guide.lastname}</p>
          </div>
          <div className="trekStateInfo">
          <p><span className="userInfo">Etat : </span> {state}</p>
        </div>
        <div className="buttonTrek">
          <Button onClick = {goToTrekPage}>VOIR LE TREK</Button>
        </div>
      </div>  
  );
}

export default Parcours;