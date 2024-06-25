import { useState, useEffect } from "react";
import {Icon} from 'leaflet'
import { Marker, MapContainer, TileLayer, useMap, Popup } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import "leaflet/dist/leaflet.css";

function GuideDate ({trekName, trekDate, trekBookings, state, parcoursID}) 
{
  const [errorMsg, setErrorMsg] = useState ("");
  const [parcours, setParcours] = useState({})
  const [parcoursSteps, setParcoursSteps] = useState ([]);
  useEffect(() => {displayParcours()}, [])

  async function displayParcours()
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
    setParcoursSteps(parcoursData.steps);
  }


  return (
    <div id="post">
      <div className="gameInfos">
        <p>{trekName}</p>
        <p><span className="userInfo">Date de départ :</span> {trekDate}</p>
        <p><span className="userInfo">Statut :</span> {state} </p>    
        {trekBookings.length === 0 && (
          <p>Aucune réservation pour ce trek</p>
        )}
         {parcoursSteps.length > 0 && (
          <>
            <p>Etapes:</p>
            {parcoursSteps.map((step, index) => (
              <p>Etape {index} : {step.stepName}</p>
              
            ))}
          <MapContainer center={[parcoursSteps[0].stepLatitude, parcoursSteps[0].stepLongitude]} zoom={7} scrollWheelZoom={true} style = {{width: 600+'px', height: 400+'px'}} >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {parcoursSteps.map((step) => (
            <Marker position={[step.stepLatitude, step.stepLongitude]}
            icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
              <Popup>
              {step.stepName} <br /> {step.stepDescription}
              </Popup>
            </Marker>
          ))}
          </MapContainer>
          </>
      )}
      </div>
      {}
    </div> 
  );
}

export default GuideDate;