import { Avatar, IconButton } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import styled from "styled-components";
import { auth } from "../firebase";
import logo from "../logo.png";
function Navbar() {
  const [user] = useAuthState(auth);
  const history = useHistory();

  return (
    <NavContainer>
      <NavLogoContainer onClick = {() => history.location.pathname !== '/' &&  history.replace('/')}>
        <img src={logo} />
      </NavLogoContainer>

      <NavMenuContainer>
        <IconButton onClick = {() => history.location.pathname !== '/addplace' && history.push('/addplace')}>
          <Edit />
        </IconButton>
        <Avatar
          onClick = {() => auth.signOut()}
          src={user?.photoURL}
          style={{ cursor : 'pointer', width: "35px", height: "35px", marginLeft: "20px" }}
        />
      </NavMenuContainer>
    </NavContainer>
  );
}

export default Navbar;

const NavContainer = styled.div`
  background-color: white;
  z-index: 1000;
  border-bottom: 0.3px solid gainsboro;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  overflow: hidden;
  position: sticky;
  top: 0;
  padding: 3px;
`;

const NavLogoContainer = styled.div`
  cursor : pointer;
  > img {
    width: 200px;
    object-fit: contain;
  }
`;
const NavMenuContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;
