import { useNavigate } from "react-router-dom";
import emptyStar from "../assets/pictures/ico_emptyStar.png";
import fullStar from "../assets/pictures/ico_fullStar.png";
import "../styles/styleParcours.css";
import Button from "./atoms/Button";

function Parcours({
  parcoursPicture,
  name,
  duration,
  description,
  price,
  difficulty,
  slug,
}) {
  let difficultyLevel;
  const navigate = useNavigate();

  function goToParcoursPage() {
    console.log(slug);
    navigate("/parcours/" + slug);
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
      default:
        break;
    }
    return difficultyLevel;
  }

  setDifficulty(difficulty);

  return (
    <div className="post">
      <div className="imgInfosContainer">
        <div className="imgContainer">
          <img
            className="parcoursImage"
            src={`http://localhost:3001${parcoursPicture}`}
            alt="Photo du parcours"
          ></img>
        </div>
        <div className="infosContainer">
          <p>
            <span className="userInfo">Nom : </span> {name}{" "}
          </p>
          <p>
            <span className="userInfo">Durée : </span> {duration} jours
          </p>
          <p>
            <span className="userInfo">Prix : </span> {price} €
          </p>
          {difficulty === 1 && (
            <p>
              <span className="userInfo">Difficulté : </span>{" "}
              <img className="etoile" src={fullStar} alt="Etoile Pleine" />
              <img className="etoile" src={emptyStar} alt="Etoile Vide" />{" "}
              <img className="etoile" src={emptyStar} alt="Etoile Vide" /> (
              {difficultyLevel})
            </p>
          )}
          {difficulty === 2 && (
            <p>
              <span className="userInfo">Difficulté : </span>{" "}
              <img className="etoile" src={fullStar} alt="Etoile Pleine" />
              <img className="etoile" src={fullStar} alt="Etoile Pleine" />{" "}
              <img className="etoile" src={emptyStar} alt="Etoile Vide" /> (
              {difficultyLevel})
            </p>
          )}
          {difficulty === 3 && (
            <p>
              <span className="userInfo">Difficulté : </span>{" "}
              <img className="etoile" src={fullStar} alt="Etoile Pleine" />
              <img className="etoile" src={fullStar} alt="Etoile Pleine" />{" "}
              <img className="etoile" src={fullStar} alt="Etoile Pleine" /> (
              {difficultyLevel})
            </p>
          )}
        </div>
      </div>
      <div className="descriptionContainer">
        <p>
          <span className="userInfo">Description : </span> {description}
        </p>
      </div>
      <div className="buttonParcours">
        <Button onClick={goToParcoursPage}>Voir le parcours</Button>
      </div>
    </div>
  );
}

export default Parcours;
