import { Button } from "@material-ui/core";
import { DoubleArrow } from "@material-ui/icons";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db, provider } from "../firebase";
import logo from "../logo.png";

function Login() {
  const [user] = useAuthState(auth);

  const signIn = (e) => {
    e.preventDefault();
    auth.signInWithPopup(provider).catch((error) => {
      alert(error.message);
    });
  };

  return (
    <LoginContainer>
      <LoginInnerContainer>
        <h1>Welcome!</h1>
        <img src={logo} alt="" />
        <h1>Sign in to Bhraman</h1>

        <Button onClick={signIn}>Sign in with google</Button>
      </LoginInnerContainer>
    </LoginContainer>
  );
}

export default Login;

const LoginContainer = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  flex: 1;
  background-color: #f8f8f8;
`;

const LoginInnerContainer = styled.div`
  padding: 100px;
  text-align: center;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);

  > img {
    height: 200px;
    width: 50%;
    object-fit: contain;
    border-radius: 20px;
  }

  > button {
    margin-top: 50px;
    text-transform: inherit !important;
    background-color: #f9a51a !important;
    color: white;
  }
`;
