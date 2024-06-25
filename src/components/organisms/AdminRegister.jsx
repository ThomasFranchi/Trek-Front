import Button from "../atoms/Button";
import Input from "../atoms/Input";
const { useState } = require("react");

function AdminRegister() {
  const [newAdmin, setNewAdmin] = useState({
    mail: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  function handleChange(e) {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  }

  // Submit input to DB to create a new Game
  async function handleSubmit(e) {
    e.preventDefault();
console.log(newAdmin)

    // const {
    //   firstName,
    //   lastName,
    //   mail,
    //   password,
    //   description,
    //   experienceYears,
    //   profilePicture,
  
    // } = newGuide;

    // Fetch options

    const token = localStorage.getItem("token");

    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "bearer " + token,
      },
      body: JSON.stringify(newAdmin),
    };

    // Post data to DB on /login routes
    const result = await fetch("http://127.0.0.1:3001/register/admin", options);
    // Response from DB on /login routes
    const data = await result.json();

    if (!data.success) {
      setSuccessMessage(null);
      setErrorMessage(data.message);
      return;
    }

    setSuccessMessage(data.message);
    setErrorMessage(null);
    setNewAdmin({
      mail: "",
      password: "",
    });
  }

  const itemsArray = [
    { name: "mail", label: "Email", value: newAdmin.mail, required: "{true}", type: "email" },
    {
      name: "password",
      label: "Mot de passe",
      value: newAdmin.password,
      required: "{true}",
      type: "password"
    }
  ];

  return (
    <div>
      <h3>Ajouter un nouvel Admin </h3>
      <form onSubmit={handleSubmit}>
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

<Button> Enregistrer</Button>
{errorMessage !== null && <p>Erreur: {errorMessage}</p>}
      {successMessage !== null && <p>{successMessage}</p>}
      </form>
   
    </div>
  );
}

export default AdminRegister;
