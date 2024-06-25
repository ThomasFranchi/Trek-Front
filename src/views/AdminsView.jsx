import { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { UserConnect } from "../App";
import AdminRegister from "../components/organisms/AdminRegister";

function AdminsView() {
  const {userLog} = useContext(UserConnect); // Context to check if the user is connected
  return (
    <div>
      {!userLog && (
        <>
          <p>Vous n'avez pas l'autorisation d'accéder à cette page</p>
          <p><Link to="/">Retour à l'accueil</Link></p>
        </>
      )}
      {userLog && (
        <>
          <AdminRegister/>
        </>
      )} 
    </div>
  );
}

export default AdminsView;
