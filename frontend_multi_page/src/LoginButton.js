import React from "react";
import{GoogleLogin} from "react-google-login";
import { useHistory} from 'react-router-dom';

const clientId = '1021009690197-1cpi8tag0bnuqh8gh5a3fvmmd2mdcmc7.apps.googleusercontent.com';

function LoginButton(){ 
  let history = useHistory();
  
  const onSuccess = (res) => {
    history.push('/home');
    console.log('[Login Success} currentUser:', res.profileObj );
  };

  const onFailure = (res) => { 
    console.log('[Login Failed] res:', res);
  };

  return(
    <div>
        <GoogleLogin
          clientId = {clientId}
          buttonText = "Login"
          onSuccess = {onSuccess}
          onFailure = {onFailure}
          cookiePolicy = {'single_host_origin'}
          style = {{marginTop : '100 px'}}
          isSignedIn = {true}
        />
    </div>
  )
}

export default LoginButton;