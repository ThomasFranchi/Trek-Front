import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import emptyStar from "../assets/pictures/ico_emptyStar.png";
import fullStar from "../assets/pictures/ico_fullStar.png";
import StepsRegister from "../components/organisms/StepRegister";

import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";
import Step from "../components/Step";
import PopupAlert from "../components/organisms/PopupAlert";

import "../styles/styleForm.css";
import "../styles/styleSingleParcoursView.css";
import { UserConnect } from "../App";

function SingleParcoursView() {
  const { userLog } = useContext(UserConnect);
  const [parcours, setParcours] = useState({});
  const [parcoursSteps, setParcoursSteps] = useState([]);
  const [newParcours, setNewParcours] = useState({
    name: "",
    duration: "",
    description: "",
    price: "",
    parcoursPicture: "",
    difficulty: 0,
  });

  const [deleteAlert, setDeleteAlert] = useState(false);
  const [editMode, setEditMode] = useState(false); 

  let params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    displayParcours();
  }, []);

  let image;
  let difficultyLevel;

  function handleChange(e) {
    setNewParcours({ ...newParcours, [e.target.name]: e.target.value });
  }

  async function displayParcours() {
    let token = localStorage.getItem("token");
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + token,
      },
    };

    const response = await fetch(
      `http://localhost:3001/parcours/${params.slug}`,
      options
    );
    const data = await response.json();
    
    if (data) {
      setParcours(data);
      setParcoursSteps(data.steps || []); // Ajout de || [] pour assurer que parcoursSteps soit toujours un tableau
    } else {
      setParcours({});
      setParcoursSteps([]); // Assurez-vous que parcoursSteps soit un tableau vide si data est indéfini
    }
  }

  const itemsArray = [
    {
      name: "parcoursPicture",
      type: "file",
      label: "Photo de parcours",
      value: newParcours.parcoursPicture,
      accept: "image/jpeg,image/png, image/jpg",
    },
    {
      name: "name",
      label: "Nom du parcours",
      value: newParcours.name,
    },
    {
      name: "duration",
      label: "Durée (en jours)",
      value: newParcours.duration,
      type: "number",
    },
    {
      name: "price",
      label: "Prix du parcours",
      value: newParcours.price,
      type: "number",
      min: 0,
    },
    {
      name: "description",
      label: "Description du parcours",
      value: newParcours.description,
    },
  ];

  function backToParcoursList() {
    navigate("/parcours");
  }

  async function setDifficulty(difficulty) {
    switch (difficulty) {
      case 1:
        difficultyLevel = "Facile";
        break;
      case 2:
        difficultyLevel = "Moyen";
        break;
      case 3:
        difficultyLevel = "Difficile";
        break;
    }
    return difficultyLevel;
  }

  function setAlertState(state) {
    setDeleteAlert(state);
  }

  // Update a parcours
  async function updateParcours(e) {
    e.preventDefault();
    const parcoursData = new FormData(e.target);
    parcoursData.append("slug", parcours.slug);
    console.log(parcoursData);

    let token = localStorage.getItem("token");
    const options = {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: parcoursData,
    };
    const response = await fetch(
      `http://localhost:3001/parcours/update/`,
      options
    );
    const data = await response.json();
    console.log(data.status);
    if (data.status === 200) {
      setEditMode(!editMode);
      navigate("/parcours/" + parcours.slug);
    }
  }

  // Cancel a customer deletion
  function cancelDelete() {
    setAlertState(false);
  }

  // Confirm a customer deletion
  async function confirmDelete() {
    let token = localStorage.getItem("token");
    const options = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        slug: params.slug,
      }),
    };
    const response = await fetch(
      `http://localhost:3001/parcours/delete/`,
      options
    );
    const data = await response.json();
    if (data.status === "200") {
      setAlertState(false);
      backToParcoursList();
    }
  }

  setDifficulty(parcours.difficulty);

  return (
    <div>
      <Topbar />
      <h1 className="parcoursName"> {parcours.name} </h1>
      <div>
        {editMode && (
          <div className="parcoursregistercontainer">
            <form onSubmit={updateParcours} encType="multipart/form-data">
              {itemsArray.map((item) => (
                <Input
                  key={item.name}
                  name={item.name}
                  label={item.label}
                  value={item.value}
                  required={item.required}
                  type={item.type}
                  onChange={handleChange}
                />
              ))}
              <label>Difficulté</label>
              <select
                name="difficulty"
                value={newParcours.difficulty}
                onChange={handleChange}
              >
                <option value="0"> Sélectionner une difficulté </option>
                <option value="1"> 1 </option>
                <option value="2"> 2 </option>
                <option value="3"> 3 </option>
              </select>

              <div className="buttonContainer">
                <Button>VALIDER</Button>
                <Button onClick={() => setEditMode(!editMode)}>ANNULER</Button>
              </div>
            </form>
          </div>
        )}
        {!editMode && (
          <div>
            {deleteAlert && (
              <PopupAlert
                type="ce parcours"
                cancel={() => cancelDelete()}
                confirm={() => confirmDelete()}
              />
            )}
            <div className="post">
              <div className="imgInfosContainer">
                <div className="imgContainer">
                  <img
                    className="parcoursImage"
                    src={`http://localhost:3001${parcours.parcoursPicture}`}
                    alt="Photo du parcours"
                  ></img>
                </div>
                <div className="infosContainer">
                  <p>
                    <span className="userInfo">Nom :</span> {parcours.name}{" "}
                  </p>
                  <p>
                    <span className="userInfo">Durée :</span>{" "}
                    {parcours.duration} jours
                  </p>
                  <p>
                    <span className="userInfo">Prix :</span> {parcours.price} €
                  </p>
                  {parcours.difficulty === 1 && (
                    <p>
                      <span className="userInfo">Difficulté :</span>{" "}
                      <img
                        className="etoile"
                        src={fullStar}
                        alt="Etoile Pleine"
                      />
                      <img
                        className="etoile"
                        src={emptyStar}
                        alt="Etoile Vide"
                      />{" "}
                      <img
                        className="etoile"
                        src={emptyStar}
                        alt="Etoile Vide"
                      />{" "}
                      ({difficultyLevel})
                    </p>
                  )}
                  {parcours.difficulty === 2 && (
                    <p>
                      <span className="userInfo">Difficulté :</span>{" "}
                      <img
                        className="etoile"
                        src={fullStar}
                        alt="Etoile Pleine"
                      />
                      <img
                        className="etoile"
                        src={fullStar}
                        alt="Etoile Pleine"
                      />{" "}
                      <img
                        className="etoile"
                        src={emptyStar}
                        alt="Etoile Vide"
                      />{" "}
                      ({difficultyLevel})
                    </p>
                  )}
                  {parcours.difficulty === 3 && (
                    <p>
                      <span className="userInfo">Difficulté :</span>{" "}
                      <img
                        className="etoile"
                        src={fullStar}
                        alt="Etoile Pleine"
                      />
                      <img
                        className="etoile"
                        src={fullStar}
                        alt="Etoile Pleine"
                      />{" "}
                      <img
                        className="etoile"
                        src={fullStar}
                        alt="Etoile Pleine"
                      />{" "}
                      ({difficultyLevel})
                    </p>
                  )}
                </div>
              </div>
              <div className="gameInfos">
                <p>
                  <span className="userInfo">Description :</span>{" "}
                  {parcours.description}
                </p>
              </div>
              {userLog.role !== "guide" && (
                <>
                  <div className="clientInfos">
                    <Button onClick={() => setEditMode(!editMode)}>MODIFIER</Button>
                    <Button onClick={() => setAlertState(true)}>SUPPRIMER</Button>
                  </div>
                </>
              )}
            </div>
            {userLog.role !== "guide" && (<StepsRegister parcoursSlug={parcours.slug} />)}
            <p className="etapeName">Etapes</p>
            {parcoursSteps.map((step) => (
              <Step
              key={step.step_slug}
              parcoursSlug={parcours.slug}
                stepSlug={step.step_slug}
                name={step.step_name}
                picture={step.step_picture}
                latitude={step.step_latitude}
                longitude={step.step_longitude}
                description={step.step_description}
              />
            ))}
            <Button onClick={() => backToParcoursList()}>
              LISTE PARCOURS
            </Button>
          </div>
        )}
      </div>
      <div>
        <Footer ClassName="footer" />
      </div>
    </div>
  );
}

export default SingleParcoursView;
