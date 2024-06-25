import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import PopupAlert from "../components/organisms/PopupAlert";
import "../styles/styleForm.css";
import "../styles/styleSingleGuideView.css";
import { UserConnect } from "../App";

function SingleGuideView() {
  const [guide, setGuide] = useState({});
  const [newGuide, setNewGuide] = useState({
    firstName: "",
    lastName: "",
    mail: "",
    password: "",
    description: "",
    experienceYears: 0,
    guidePicture: "",
    state: "",
  });
  const { userLog } = useContext(UserConnect);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [editMode, setEditMode] = useState(false); // For the task to edit

  let params = useParams();
  useEffect(() => {
    displayGuide();
  }, []);
  const navigate = useNavigate();

  function handleChange(e) {
    setNewGuide({ ...newGuide, [e.target.name]: e.target.value });
  }

  const itemsArray = [
    {
      name: "guidePicture",
      type: "file",
      label: "Photo de profil",
      value: newGuide.guidePicture,
      accept: "image/jpeg,image/png, image/jpg",
    },
    {
      name: "firstName",
      label: "Prénom",
      value: newGuide.firstName,
    },
    {
      name: "lastName",
      label: "Nom",
      value: newGuide.lastName,
    },
    {
      name: "mail",
      label: "Email",
      value: newGuide.mail,
      type: "email",
    },
    {
      name: "password",
      label: "Mot de passe",
      value: newGuide.password,
      type: "password",
    },
    {
      name: "experienceYears",
      label: "Année(s) d'expériences",
      value: newGuide.experienceYears,
      type: "number",
    },
    {
      name: "description",
      label: "Description",
      value: newGuide.description,
    },
    {
      name: "state",
      label: "Etat",
      value: newGuide.state,
    },
  ];

  async function displayGuide() {
    let token = localStorage.getItem("token");
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    const response = await fetch(
      `http://localhost:3001/guides/${params.slug}`,
      options
    );
    const data = await response.json();
    console.log(data);
    if (!data) {
      setGuide({});
    }
    setGuide(data);
    console.log(data.guidePicture);
  }

  function backToGuidesList() {
    navigate("/guides");
  }

  function setAlertState(state) {
    setDeleteAlert(state);
  }

  // Update a guide
  async function updateGuide(e) {
    e.preventDefault();
    const guideData = new FormData(e.target);

    guideData.append("slug", guide.slug);

    let token = localStorage.getItem("token");
    const options = {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: guideData,
    };
    const response = await fetch(
      `http://localhost:3001/guides/update/`,
      options
    );
    const data = await response.json();
    console.log(data.status);
    if (data.status === 200) {
      setEditMode(!editMode);
      navigate("/guides/" + guide.slug);
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
      `http://localhost:3001/guides/delete/`,
      options
    );
    const data = await response.json();
    if (data.status === "200") {
      setAlertState(false);
      backToGuidesList();
    }
  }

  return (
    <div>
      <Topbar />
      <div>
        {deleteAlert && (
          <PopupAlert
            type="ce profil de guide"
            cancel={() => cancelDelete()}
            confirm={() => confirmDelete()}
          />
        )}
        {editMode && (
          <div className="parcoursregistercontainer">
            <form onSubmit={updateGuide} encType="multipart/form-data">
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
              <div className="buttonContainer">
                <Button>VALIDER</Button>
                <Button onClick={() => setEditMode(!editMode)}>ANNULER</Button>
              </div>
            </form>
          </div>
        )}
        {!editMode && (
          <div className="guideContainer">
            <div className="guideTitleContainer">
              <h1 className="singleGuideTitle">
                {" "}
                {guide.firstName} {guide.lastname}
              </h1>
            </div>
            <div className="imgInfosContainer">
              <div className="imgGuideContainer">
                <img
                  className="imgGuideProfil"
                  src={`http://localhost:3001${guide.guide_picture}`}
                  alt="Photo de profil du guide"
                />
              </div>
              <div className="guideInfosContainer">
                <p>
                  <span className="guideInfo">Nom :</span> {guide.firstname}{" "}
                </p>
                <p>
                  <span className="guideInfo">Prénom :</span> {guide.lastname}{" "}
                </p>
                <p>
                  <span className="guideInfo">Mail :</span> {guide.email}{" "}
                </p>
                <p>
                  <span className="guideInfo">Années d'expériences :</span>{" "}
                  {guide.experience_years}{" "}
                </p>
                <p>
                  <span className="guideInfo">Etat :</span> {guide.state}{" "}
                </p>
              </div>
            </div>
            <div className="descriptionContainer">
              <p>
                <span className="guideInfo">Description :</span>{" "}
                {guide.description}
              </p>
            </div>
            {userLog.role !== "guide" && (
              <>
                <div className="buttonGuideContainer">
                  <Button onClick={() => setEditMode(!editMode)}>
                    MODIFIER
                  </Button>
                  <Button onClick={() => setAlertState(true)}>
                    SUPPRIMER
                  </Button>
                </div>
              </>
            )}
            <Button onClick={() => backToGuidesList()}>
              LISTE GUIDE
            </Button>
          </div>
        )}
      </div>

        {/* <Footer ClassName="homeFooter" /> */}

    </div>
  );
}

export default SingleGuideView;
