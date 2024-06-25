import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Topbar from "../components/Topbar";
import Booking from "../components/Booking";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import "../styles/styleForm.css";
import "../styles/styleTrek.css"
import { UserConnect } from "../App";

function SingleTrekView() {
  const [trek, setTrek] = useState({});
  const [newTrek, setNewTrek] = useState({
    parcours: "",
    guide: "",
    beginDate: "",
    endDate: "",
    minPlaces: "",
    maxPlaces: "",
    trekState: "",
  });
  const { userLog } = useContext(UserConnect);
  const [trekBookings, setTrekBookings] = useState([]);

  // Guides and parcours iy user wants to change trek
  const [parcoursList, setParcoursList] = useState([]);
  const [guidesList, setGuidesList] = useState([]);

  // Guide and parcours for trek
  const [guide, setGuide] = useState([]);
  const [parcours, setParcours] = useState([]);

  function handleChange(e) {
    console.log(e.target.name + " " + e.target.value);
    setNewTrek({ ...newTrek, [e.target.name]: e.target.value });
  }

  const [editMode, setEditMode] = useState(false); // For the task to edit
  let params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    displayTrek();
  }, []);
  useEffect(() => {
    getParcoursAndGuides();
  }, []);

  async function displayTrek() {
    let token = localStorage.getItem("token");
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    const response = await fetch(
      `http://localhost:3001/treks/${params.slug}`,
      options
    );
    const data = await response.json();
    console.log("data",data);
    if (!data) {
      setTrek({});
      setTrekBookings([]); 
    } else {
      setTrek(data);
      getParcoursAndGuideFromIds(data.parcours_id, data.guide_id);
      setTrekBookings(data.bookings || []);
    }
  }

  // Get parcours and guides
  async function getParcoursAndGuides() {
    const token = localStorage.getItem("token");

    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + token,
      },
    };

    const parcoursResponse = await fetch(
      "http://localhost:3001/parcours",
      options
    );
    const parcoursData = await parcoursResponse.json();
    if (!parcoursData) {
      setParcoursList([]);
    }

    if (Array.isArray(parcoursData)) {
      setParcoursList(parcoursData);
    }

    const guidesResponse = await fetch("http://localhost:3001/guides", options);
    const guidesData = await guidesResponse.json();
    if (!guidesData) {
      setGuidesList([]);
    }

    if (Array.isArray(guidesData)) {
      setGuidesList(guidesData);
    }
  }

  async function getParcoursAndGuideFromIds(trekID, guideID) {
    let token = localStorage.getItem("token");

    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const parcoursResponse = await fetch(
      `http://localhost:3001/parcours/get/${trekID}`,
      options
    );
    const parcoursData = await parcoursResponse.json();
    if (!parcoursData) {
      setParcours("");
    }
    setParcours(parcoursData);

    const guideResponse = await fetch(
      `http://localhost:3001/guides/get/${guideID}`,
      options
    );
    const guideData = await guideResponse.json();
    console.log(guideData);
    if (!guideData) {
      setGuide("");
    }
    setGuide(guideData);
  }

  const itemsArray = [
    {
      name: "beginDate",
      label: "Date de départ",
      value: newTrek.beginDate,
      type: "date",
    },
    {
      name: "endDate",
      label: "Date de fin",
      value: newTrek.endDate,
      type: "date",
    },
    {
      name: "minPlaces",
      label: "Places minimum",
      value: newTrek.minPlaces,
      type: "number",
    },
    {
      name: "maxPlaces",
      label: "Places maximum",
      value: newTrek.maxPlaces,
      type: "number",
    },
  ];

  function backToTreksList() {
    navigate("/treks");
  }

  // Update a parcours
  async function updateTrek(e) {
    e.preventDefault();

    var obj = {};
    obj.user = newTrek;
    obj.slug = trek.slug;

    let token = localStorage.getItem("token");
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(obj),
    };
    const response = await fetch(
      `http://localhost:3001/treks/update/`,
      options
    );
    const data = await response.json();
    console.log(data.status);
    if (data.status === 200) {
      setEditMode(!editMode);
      navigate("/treks/");
    }
  }

  return (
    <div>
      <Topbar />
      <h1 className="pageTrekTitle">Page du trek</h1>
      <div>
        {editMode && (
          <div className="parcoursregistercontainer">
            <form onSubmit={updateTrek}>
              <div>
                <label>Parcours</label>
                <select
                  name="parcours"
                  value={newTrek.parcours}
                  onChange={handleChange}
                >
                  <option value="" selected disabled hidden>
                    Choisissez un parcours
                  </option>
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
                  onChange={handleChange}
                >
                  <option value="" selected disabled hidden>
                    Choisissez un guide
                  </option>
                  {guidesList.map((guide) => (
                    <option value={guide.slug}>
                      {" "}
                      {`${guide.firstname} ${guide.lastname}`}
                    </option>
                  ))}
                </select>
              </div>
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
                  />
                ))}
                <label>Etat du trek</label>
                <select
                  name="trekState"
                  value={newTrek.trekState}
                  onChange={handleChange}
                >
                  <option value=""> Sélectionner un état </option>
                  <option value="A venir"> A venir </option>
                  <option value="En cours"> En cours </option>
                  <option value="Terminé"> Terminé </option>
                  <option value="Annulé"> Annulé </option>
                </select>
                <div className="buttonContainer">
                  <Button>VALIDER</Button>
                  <Button onClick={() => setEditMode(!editMode)}>
                    ANNULER
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
        {!editMode && (
          <div>
            <div className="trekInfoContainerSingleView">
              <div className="userInfoContainer">
                <p>
                  <span className="userInfo">Guide : </span> {guide.firstname}{" "}
                  {guide.lastname}
                </p>
              </div>
              <div className="userInfoContainer">
                <p>
                  <span className="userInfo">Départ : </span> {trek.begin_date}{" "}
                </p>
              </div>
              <div className="userInfoContainer">
                <p>
                  <span className="userInfo">Arrivé : </span> {trek.end_date}
                </p>
              </div>
              <div className="userInfoContainer">
                <p>
                  <span className="userInfo">Places min : </span>{" "}
                  {trek.min_places} places
                </p>
              </div>
              <div className="userInfoContainer">
                <p>
                  <span className="userInfo">Places max :</span>{" "}
                  {trek.max_places} places
                </p>
                </div>
                {userLog.role !== "guide" && (
                <div className="buttonEdit">
                <Button onClick={() => setEditMode(!editMode)}>EDITER</Button>
              </div>
                )}
            </div>
            <div className="gameInfos">
              <p className="reservationTitle">Réservations</p>
              {trekBookings.map((booking) => (
                <Booking
                key={booking.user_id}
                  userID={booking.user_id}
                  date={booking.booking_date}
                  status={booking.state}
                />
              ))}
            </div>
            <Button onClick={() => backToTreksList()}>RETOUR AUX TREKS</Button>
          </div>
        )}
      </div>
        {/* <Footer ClassName="homeFooter" /> */}
    </div>
  );
}

export default SingleTrekView;
