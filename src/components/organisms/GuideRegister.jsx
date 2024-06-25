import { useState } from "react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import "../../styles/styleForm.css";

function GuideRegister() {
  const [newGuide, setNewGuide] = useState({
    firstName: "",
    lastName: "",
    mail: "",
    password: "",
    description: "",
    experienceYears: 0,
    guidePicture: "",
  });

  const [displayform, setDisplayForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  function handleChange(e) {
    setNewGuide({ ...newGuide, [e.target.name]: e.target.value });
  }

  // Submit input to DB to create a new Game
  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    // Fetch options
    const token = localStorage.getItem("token");

    let options = {
      method: "POST",
      headers: {
        Authorization: "bearer " + token,
      },
      body: formData,
    };

    // Post data to DB on /login routes
    const result = await fetch("http://127.0.0.1:3001/register/guide", options);
    // Response from DB on /login routes
    const data = await result.json();

    if (!data.success) {
      setSuccessMessage(null);
      setErrorMessage(data.message);
      return;
    }

    setSuccessMessage(data.message);
    setErrorMessage(null);
    setNewGuide({
      firstName: "",
      lastName: "",
      mail: "",
      password: "",
      description: "",
      experienceYears: 0,
      guidePicture: "",
    });
  }

  const itemsArray = [
    {
      name: "guidePicture",
      type: "file",
      label: "Photo de profil",
      value: newGuide.guidePicture,
      required: "{true}",
      accept:"image/jpeg,image/png, image/jpg",
    },
    {
      name: "firstName",
      label: "Prénom",
      value: newGuide.firstName,
      required: "{true}",
    },
    {
      name: "lastName",
      label: "Nom",
      value: newGuide.lastName,
      required: "{true}",
    },
    {
      name: "mail",
      label: "Mail",
      value: newGuide.mail,
      required: "{true}",
      type: "email",
    },
    {
      name: "password",
      label: "Mot de passe",
      value: newGuide.password,
      required: "{true}",
      type: "password",
    },
    {
      name: "experienceYears",
      label: "Année(s) d'expériences",
      value: newGuide.experienceYears,
      required: "{true}",
      type: "number",
    },
    {
      name: "description",
      label: "Description",
      value: newGuide.description,
      required: "{true}",
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
        <h3>Ajouter un nouveau guide </h3>
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
              />
            ))}
          </div>
          <div className="buttonContainer">
            <Button onClick={()=>setDisplayForm(!displayform)}>ANNULER</Button>
            <Button> ENREGISTRER</Button>
          </div>
          {errorMessage !== null && <p>Erreur: {errorMessage}</p>}
          {successMessage !== null && <p>{successMessage}</p>}
        </form>
      </>
      )}
    </div>
  );
}

export default GuideRegister;
