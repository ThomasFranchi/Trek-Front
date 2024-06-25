import { useNavigate } from "react-router-dom";
import Button from "./atoms/Button";
import "../styles/client.css";

function Clients(
  { profilePicture,
    firstName,
    lastName,
    mail,
    password,
    slug }
) {
  const navigate = useNavigate();

  function goToClientPage() {
    navigate('/clients/' + slug);
  }

  return (
    <div className="postClients">
      <div className="clientProfil1">
        <img
          className="clientProfilPicture"
          style={{ width: 10 + "%" }}
          src={`http://localhost:3001${profilePicture}`}
          alt="Photo du Client"
        />
      </div>
      <div className="clientProfil2">
        <p>
          <span className="clientInfo">Prénom Nom :</span> {firstName}  {lastName}
        </p>
      </div>
      <div className="clientProfil3">
        <p>
          <span className="clientInfo">Mail :</span> {mail}
        </p>
      </div>
      <div className="buttonLook">
        <Button onClick={goToClientPage}>VOIR</Button>
      </div>
    </div>
  );
}

export default Clients;