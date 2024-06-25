import { useState, useEffect } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import "../../styles/styleForm.css";

function TreksRegister() {
  const [newTrek, setNewTrek] = useState({
    parcours: "",
    guide: "",
    beginDate: "",
    endDate: "",
    minPlaces: "",
    maxPlaces: "",
  });

  const [displayform, setDisplayForm] = useState(false);
  const [parcoursList, setParcoursList] = useState([]);
  const [guidesList, setGuidesList] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {getParcoursAndGuides()}, [])

  function handleChange(e) {
    setNewTrek({ ...newTrek, [e.target.name]: e.target.value });
    console.log(e.target.value);
  }

  // Get parcours and guides
  async function getParcoursAndGuides () {
    const token = localStorage.getItem("token");

    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + token,
      }
    };

    const parcoursResponse = await fetch('http://localhost:3001/parcours', options);
    const parcoursData = await parcoursResponse.json();
    if (!parcoursData) {
      setParcoursList([]);
    }

    if (Array.isArray(parcoursData)) {
      setParcoursList(parcoursData);
    }

    const guidesResponse = await fetch('http://localhost:3001/guides', options);
    const guidesData = await guidesResponse.json();
    if (!guidesData) {
      setGuidesList([]);
    }

    if (Array.isArray(guidesData)) {
      setGuidesList(guidesData);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(newTrek);

    const token = localStorage.getItem("token");

    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(newTrek)
    };

    // Post data to DB on /login routes
    const result = await fetch("http://127.0.0.1:3001/treks/add", options);
    // Response from DB on /login routes
    const data = await result.json();

    if (!data.success) {
      setSuccessMessage(null);
      return;
    }
    setErrorMessage(null);
    setNewTrek({

      beginDate: "",
      endDate: "",
      minPlaces: "",
      maxPlaces: "",
    });
  }

  const itemsArray = [
    {
      name: "beginDate",
      label: "Date de début",
      value: newTrek.beginDate,
      required: true,
      type: "date",
    },
    {
        name: "endDate",
        label: "Date de fin",
        value: newTrek.endDate,
        required: true,
        type: "date",
    },
    {
        name: "minPlaces",
        label: "Places minimum",
        value: newTrek.minPlaces,
        required: true,
        type: "number",
    },
    {
        name: "maxPlaces",
        label: "Places maximum",
        value: newTrek.maxPlaces,
        required: true,
        type: "number",
    },
];

return (
  <div className="parcoursregistercontainer">
    {!displayform && (
      <div id = "buttonForm">
        <Button onClick={()=>setDisplayForm(!displayform)}>AJOUTER</Button>
      </div>
    )}
    {displayform && (
      <>
        <h3>Ajouter un nouveau Trek </h3>
        <form onSubmit={handleSubmit}>
        <div>
          <label>Parcours</label>
          <select
          name="parcours"
          value={newTrek.parcours}
          required="{true}"
          onChange={handleChange}
        >
        <option value="" selected disabled hidden>Choisissez un parcours</option>
        {parcoursList.map((parcours) => (
          <option key={parcours.slug} value={parcours.slug}> {parcours.name} </option>        
            ))}
        </select>
      </div>
      <div>
        <label>Guide</label>
        <select
          name="guide"
          value={newTrek.guide}
          required="{true}"
          onChange={handleChange}
        >
        <option value="" selected disabled hidden>Choisissez un guide</option>
        {guidesList.map((guide) => (
          <option key ={guide.slug} value={guide.slug}> {`${guide.firstname} ${guide.lastname}`}</option>        
            ))}
        </select>
      </div>
      <div>
        {itemsArray.map((item) => (
          <Input
          key= {item.name}
            name={item.name}
            label={item.label}
            value={item.value}
            required={item.required}
            type={item.type}
            onChange={handleChange}
            min={item.min}
            max={item.max}
          />
        ))}
      </div>
      <div className="buttonContainer">
        <Button onClick={()=>setDisplayForm(!displayform)}>ANNULER</Button>
        <Button>ENREGISTER</Button>
      </div>
        {errorMessage !== null && <p>{errorMessage}</p>}
        {successMessage !== null && <p>{successMessage}</p>}
      </form>
      </>
      )}
    </div>
  );
}

export default TreksRegister;
