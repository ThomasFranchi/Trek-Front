import { useState } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";

import "../../styles/styleForm.css";

function StepsRegister({parcours_slug}) {
  const [newStep, setNewStep] = useState({
    stepName: "",
    stepLatitude: "",
    stepLongitude: "",
    stepPicture: "",
    stepDescription: "",
  });
  const [displayform, setDisplayForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  function handleChange(e) {
    setNewStep({ ...newStep, [e.target.name]: e.target.value });
  }

  // Submit input to DB to create a new Game
  async function handleSubmit(e) {
    e.preventDefault();
    console.log(newStep);
    const formData = new FormData(e.target);
    formData.append("slug", parcours_slug);
    
    const token = localStorage.getItem("token");

    let options = {
      method: "PUT",
      headers: {
        Authorization: "bearer " + token,
      },
      body: formData,
    };

    // Post data to DB on /login routes
    const result = await fetch("http://127.0.0.1:3001/parcours/addstep", options);
    // Response from DB on /login routes
    const data = await result.json();

    if (!data.success) {
      setSuccessMessage(null);
      setErrorMessage(data.message);
      return;
    }

    setSuccessMessage(data.message);
    setErrorMessage(null);
    setNewStep({
        stepName: "",
        stepLatitude: "",
        stepLongitude: "",
        stepPicture: "",
        stepDescription: "",
    });
  }

  const itemsArray = [
    {
      name: "stepPicture",
      type: "file",
      label: "Photo d'étape",
      value: newStep.parcoursPicture,
      required: "{true}",
    },
    {
      name: "stepName",
      label: "Nom de l'étape",
      value: newStep.stepName,
      required: "{true}",
    },
    {
      name: "stepLatitude",
      label: "Lattitude",
      value: newStep.stepLatitude,
      required: "{true}",
      type: "number",
      step: "any",
    },
    {
      name: "stepLongitude",
      label: "Longitude",
      value: newStep.stepLongitude,
      required: "{true}",
      type: "number",
      step: "any",
    },
    {
      name: "stepDescription",
      label: "Description",
      value: newStep.stepDescription,
      required: "{true}",
    },
  ];

  return (
    <div className="parcoursregistercontainer">
      {!displayform && (
      <div id = "buttonForm">
        <Button onClick={()=>setDisplayForm(!displayform)}>NOUVELLE ÉTAPE</Button>
      </div>
    )}
    {displayform && (
      <>
      <h3>Ajouter une étape </h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          {itemsArray.map((item) => (
            <Input
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
          <Button> ENREGISTRER</Button> 
        </div>
        {errorMessage !== null && <p>{errorMessage}</p>}
        {successMessage !== null && <p>{successMessage}</p>}
      </form>
      </>
    )}
     </div>
  );
}

export default StepsRegister;
