import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import PopupAlert from "../components/organisms/PopupAlert";
import GuideDate from "../components/GuideDate";

import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";

import { UserConnect } from "../App";
import "../styles/styleForm.css";
import "../styles/styleSingleGuideView.css";

function ProfileView() {

  const [userProfile, setUserProfile] = useState({});
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
  const [treksList, setTreksList] = useState([])
  const [deleteAlert, setDeleteAlert] = useState(false);
  const { userLog, disconnect } = useContext(UserConnect);
  const [editMode, setEditMode] = useState(false); // For the task to edit

  let params = useParams();
  useEffect(() => { displayProfile() }, [])
  const navigate = useNavigate();

  function handleChange(e) {
    setNewGuide({ ...newGuide, [e.target.name]: e.target.value });
  }

  async function displayProfile() {
    let token = localStorage.getItem("token");
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    };

    const response = await fetch(`http://localhost:3001/login/userinfos`, options);
    const data = await response.json();
    if (!data) {
      setUserProfile({});
    }
    setUserProfile(data);
    displayMyTreks(data.slug);
  }

  async function displayMyTreks(slug) {
    console.log(slug);
    let token = localStorage.getItem("token");
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    };

    const response = await fetch(`http://localhost:3001/treks/list/${slug}`, options);
    const data = await response.json();
    console.log(data);
    if (!data) {
      setTreksList([]);
    }
    setTreksList(data);
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
  ];

  // Update a guide
  async function updateGuide(e) {
    e.preventDefault();
    const guideData = new FormData(e.target);

    guideData.append("slug", userProfile.slug);

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
      navigate("/guides/");
    }
  }

  function setAlertState(state) {
    setDeleteAlert(state);
  }

  // Cancel a customer deletion
  function cancelDelete() {
    setAlertState(false);
  }

  // Confirm a customer deletion
  async function confirmDelete() {
    let token = localStorage.getItem("token");
    const options =
    {
      method: 'DELETE',
      headers:
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        slug: params.slug
      })
    };
    const response = await fetch(`http://localhost:3001/guides/delete/`, options);
    const data = await response.json();
    if (data.status === "200") {
      setAlertState(false);
      disconnect();
    }
  }

  return (
    <div>
      <Topbar />
      {deleteAlert && (
        <PopupAlert type="votre profil" cancel={() => cancelDelete()} confirm={() => confirmDelete()} />
      )}
      <div>
        {editMode && (
          <div className="parcoursregistercontainer">
            <form onSubmit={updateGuide} encType="multipart/form-data">
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
                Page de {userProfile.firstName} {userProfile.lastName}
              </h1>
            </div>
            <div className="imgInfosContainer">
              <div className="imgGuideContainer">
                <img
                  className="imgGuideProfil"
                  src={`http://localhost:3001${userProfile.guidePicture}`}
                  alt="Photo de profil du guide"
                />
              </div>
              <div className="guideInfosContainer">
                <p><span className="guideInfo">Nom :</span> {userProfile.firstName} </p>
                <p><span className="guideInfo">Prénom :</span> {userProfile.lastName} </p>
                <p><span className="guideInfo">Mail :</span> {userProfile.mail} </p>
                <p><span className="guideInfo">Prénom :</span> {userProfile.lastName} </p>
                <p><span className="guideInfo">Années d'expériences :</span> {userProfile.experienceYears} </p>
                <p><span className="guideInfo">Etat :</span> {userProfile.state} </p>
                < div className="descriptionContainer">
                  <p>
                    <span className="guideInfo">Description :</span> {userProfile.description}</p>
                </div>
              </div>
              <div className="buttonGuideContainer">
                <Button onClick={() => setEditMode(!editMode)}>
                  MODIFIER
                </Button>
              </div>
            </div>
            {treksList.length === 0 && (
              <>
                <div className="guideInfos">
                  <p className="userInfo">Aucun trek attribué</p>
                </div>
              </>
            )}

            {treksList.map((trek) => (
              <GuideDate
                key={trek.parcoursID}
                trekName={trek.trekName}
                parcoursID={trek.parcoursID}
                trekDate={trek.beginDate}
                trekBookings={trek.bookings}
                state={trek.trekState}
              />
            ))}
          </div>
        )}
        </div>
          {/* <Footer ClassName="homeFooter" /> */}

      
    </div>
  );
}
export default ProfileView;