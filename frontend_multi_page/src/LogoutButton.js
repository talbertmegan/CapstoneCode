import React from "react";
import{GoogleLogout} from "react-google-login";
import{useHistory} from "react-router-dom";

const clientId = '1021009690197-1cpi8tag0bnuqh8gh5a3fvmmd2mdcmc7.apps.googleusercontent.com';

function LogoutButton(){ 
  let history = useHistory(); 

  const onLogoutSuccess = () => { 
    alert('Logout was made successfully.');
    history.push("/");
  };

  return(
    <div>
        <GoogleLogout
          clientId= {clientId}
          buttonText="Logout"
          onLogoutSuccess={onLogoutSuccess}
        />
    </div>
  )
}

export default LogoutButton;