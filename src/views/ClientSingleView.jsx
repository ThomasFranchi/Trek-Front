import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";
import PopupAlert from "../components/organisms/PopupAlert";
import "../styles/styleForm.css";
import "../styles/styleSingleClientView.css";

function SingleClientView() {

  const [client, setClient] = useState({})
  const [newClient, setNewClient] = useState({ firstName: "", lastName: "", mail: "", password: "", clientPicture: "" });
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [editMode, setEditMode] = useState(false); // For the task to edit

  let params = useParams();
  const navigate = useNavigate();

  useEffect(() => { displayClient() }, [])

  function handleChange(e) {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  }

  async function displayClient() {
    let token = localStorage.getItem("token");
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + token,
      }
    };
    const response = await fetch(`http://localhost:3001/clients/${params.slug}`, options);
    const data = await response.json();
    if (!data) {
      setClient({});
    }
    console.log(data);
    setClient(data);
  }

  function backToClientsList() {
    navigate("/clients");
  }

  const itemsArray = [
    {
      name: "clientPicture",
      type: "file",
      label: "Photo de profil",
      value: newClient.clientPicture,
      accept: "image/jpeg,image/png, image/jpg"
    },
    {
      name: "firstName",
      label: "Prénom",
      value: newClient.firstName
    },
    {
      name: "lastName",
      label: "Nom",
      value: newClient.lastName
    },
    {
      name: "Mail",
      label: "Mail",
      value: newClient.mail,
      type: "mail"
    },
    {
      name: "password",
      label: "Mot de passe",
      value: newClient.password,
      type: "password"
    }
  ];

  async function updateClient(e) {
    e.preventDefault();
    const clientData = new FormData(e.target);
    clientData.append("slug", client.slug);

    let token = localStorage.getItem("token");
    const options =
    {
      method: 'PUT',
      headers:
      {
        Authorization: "Bearer " + token
      },
      body: clientData
    };
    const response = await fetch(`http://localhost:3001/clients/updateadmin/`, options);
    const data = await response.json();
    console.log(data.status);
    if (data.status === 200) {
      setEditMode(!editMode);
      navigate('/clients/' + client.slug);
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
    const response = await fetch(`http://localhost:3001/clients/delete/`, options);
    const data = await response.json();
    if (data.status === "200") {
      setAlertState(false);
      backToClientsList();
    }
  }

  return (
    <div>
      <Topbar />
      <div>
        {deleteAlert && (
          <PopupAlert type="ce profil d'utilisateur" cancel={() => cancelDelete()} confirm={() => confirmDelete()} />
        )}

        {editMode && (
          <div className="parcoursregistercontainer">
            <form onSubmit={updateClient} encType="multipart/form-data">
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
          <div className="clientContainer">
            <div className="clientTitleContainer">
              <h1 className="singleClientTitle">
                {client.firstName} {client.lastname}
              </h1>
            </div>
            <div className="imgInfosContainer">
              <div className="imgClientContainer">
                <img
                  className="imgClientProfil"
                  src={`http://localhost:3001${client.client_picture}`}
                  alt="Photo de profil du client"
                />
              </div>
              <div className="clientInfosContainer">
                <p>
                  <span className="clientInfo">Nom :</span> {client.firstname}
                </p>
                <p>
                  <span className="clientInfo">Prénom :</span> {client.lastname}
                </p>
                <p>
                  <span className="clientInfo">Mail :</span> {client.email}
                </p>
              </div>
            </div>
            <div className="buttonGuideContainer">
              <Button onClick={() => setEditMode(!editMode)}>
                MODIFIER
              </Button>
              <Button onClick={() => setAlertState(true)}>
                SUPPRIMER
              </Button>
            </div>
            <Button onClick={() => backToClientsList()}>LISTE CLIENTS</Button>
          </div>
        )
        }
      </div >
        {/* <Footer ClassName="homeFooter" /> */}
    </div >

  );
}

export default SingleClientView;