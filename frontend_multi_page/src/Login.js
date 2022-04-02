import React from "react";
import{GoogleLogin, GoogleLogout} from "react-google-login";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";


const clientId = '1021009690197-1cpi8tag0bnuqh8gh5a3fvmmd2mdcmc7.apps.googleusercontent.com';

function Login(){ 
  const onSuccess = (res) => { 
    console.log('[Login Success] currentUser:', res.profileObj);
  };

  const onFailure = (res) => { 
    console.log('[Login Failed] res:', res);
  };

  const onLogoutSuccess = () => { 
    alert('Logout was made successfully.');
  };

  return(
    <div className="centered">
      <div>
        <h1> Log in using Google credentials. </h1>
        <LoginButton />
        <LogoutButton />
      </div>
    </div>
  )
}

export default Login;