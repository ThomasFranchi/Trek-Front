import { useState, useEffect } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import "../../styles/styleForm.css";

function ParcoursRegister() {
  const [newParcours, setnewParcours] = useState({
    name: "",
    duration: "",
    description: "",
    price: "",
    parcoursPicture: "",
    difficulty: 0,
  });

  const [displayform, setDisplayForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  function handleChange(e) {
    setnewParcours({ ...newParcours, [e.target.name]: e.target.value });
  }

  // Submit input to DB to create a new Game
  async function handleSubmit(e) {
    e.preventDefault();
    console.log(newParcours);

    const formData = new FormData(e.target);

    const token = localStorage.getItem("token");

    let options = {
      method: "POST",
      headers: {
        Authorization: "bearer " + token,
      },
      body: formData,
    };

    // Post data to DB on /login routes
    const result = await fetch("http://127.0.0.1:3001/parcours/add", options);
    // Response from DB on /login routes
    const data = await result.json();

    if (!data.success) {
      setSuccessMessage(null);
      setErrorMessage(data.message);
      return;
    }

    setSuccessMessage(data.message);
    setErrorMessage(null);
    setnewParcours({
      name: "",
      duration: "",
      description: "",
      price: "",
      parcoursPicture: "",
      difficulty: 1,
      country: "",
    });
  }

  const itemsArray = [
    {
      name: "parcoursPicture",
      type: "file",
      label: "Photo : ",
      value: newParcours.parcoursPicture,
      required: true,
    },
    {
      name: "name",
      label: "Nom : ",
      value: newParcours.name,
      required: true,
    },
    {
      name: "duration",
      label: "Durée (en jours) : ",
      value: newParcours.duration,
      required: true,
      type: "number",
      min: 0,
    },
    {
      name: "price",
      label: "Prix : ",
      value: newParcours.price,
      required: true,
      type: "number",
      min: 0,
    },
    {
      name: "description",
      label: "Description : ",
      value: newParcours.description,
      required: true,
    },
    {
      name: "country",
      label: "Pays : ",
      value: newParcours.country,
      required: true,
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
          <h3>Ajouter un Parcours </h3>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div>
              {itemsArray.map((item) => (
                <Input
                  key={item.name}
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
              <div className="selectContainer">
                <label>Difficulté : </label>
                <select
                  name="difficulty"
                  value={newParcours.difficulty}
                  required="{true}"
                  onChange={handleChange}
                >
                  <option value="0"> Sélectionner une Difficulté </option>
                  <option value="1"> 1 </option>
                  <option value="2"> 2 </option>
                  <option value="3"> 3 </option>
                </select>
              </div>
            </div>
          <div className="buttonContainer">
            <Button onClick={()=>setDisplayForm(!displayform)}>ANNULER</Button>
          < Button>ENREGISTER</Button>
          </div>
          {errorMessage !== null && <p>{errorMessage}</p>}
          {successMessage !== null && <p>{successMessage}</p>}
        </form>
        </>
      )}
    </div>
  );
}

export default ParcoursRegister;
