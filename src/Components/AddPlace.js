import { Button, CircularProgress, TextField } from "@material-ui/core";
import {
  AcUnit,
  Add,
  Apartment,
  Fastfood,
  FlashOnRounded,
  LibraryMusic,
  LocalFlorist,
  LocationCity,
  LocationOn,
  Room,
  VideoLibrary,
} from "@material-ui/icons";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db, storageRef } from "../firebase";
import firebase from "firebase";
import AddCityForm from "./AddCityForm";
import AddMonumentForm from "./AddMonumentForm";
import AddCultureForm from "./AddCultureForm";
import AddFoodForm from "./AddFoodForm";
import AddFestivalForm from "./AddFestivalForm";
import AddSpecialPlaceForm from "./AddSpecialPlaceForm";

function AddPlace() {
  const [specialPlacesForm, setSpecialPlaces] = useState({
    city: "",
    images: [],
    latitude: "",
    location: "",
    longitude: "",
    about: "",
    history: "",
    name: "",
    shortDescription: "",
    state: "",
    type: "Festivals",
  });

  const [user] = useAuthState(auth);

  const [selected, setSelected] = useState("city");

  return (
    <AddPlaceContainer>
      <NavigationButtonContainer>
        <NavigationButton
          onClick={() => setSelected("city")}
          className={`${selected === "city" && "selected"}`}
        >
          <p>Add City</p>
          <LocationCity />
        </NavigationButton>
        <NavigationButton
          onClick={() => setSelected("monument")}
          className={`${selected === "monument" && "selected"}`}
        >
          <p>Add Monument</p>
          <Apartment />
        </NavigationButton>
        <NavigationButton
          onClick={() => setSelected("food")}
          className={`${selected === "food" && "selected"}`}
        >
          <p>Add Food</p>
          <Fastfood />
        </NavigationButton>
        <NavigationButton
          onClick={() => setSelected("culture")}
          className={`${selected === "culture" && "selected"}`}
        >
          <p>Add Culture</p>
          <LibraryMusic />
        </NavigationButton>
        <NavigationButton
          onClick={() => setSelected("festival")}
          className={`${selected === "festival" && "selected"}`}
        >
          <p>Add Festival</p>
          <AcUnit />
        </NavigationButton>
        <NavigationButton
          onClick={() => setSelected("place")}
          className={`${selected === "place" && "selected"}`}
        >
          <p>Add Famous Place</p>
          <AcUnit />
        </NavigationButton>
      </NavigationButtonContainer>

      {selected === "city" && <AddCityForm />}
      {selected === "monument" && <AddMonumentForm />}
      {selected === "food" && <AddFoodForm />}
      {selected === "culture" && <AddCultureForm />}
      {selected === "festival" && <AddFestivalForm />}
      {selected === "place" && <AddSpecialPlaceForm />}
    </AddPlaceContainer>
  );
}

export default AddPlace;

const AddPlaceContainer = styled.div`
  background-color: #f4f3ee;
  height: 100vh;
  width: 100%;
  padding: 10px;
  overflow: scroll;
`;

const NavigationButtonContainer = styled.div`
  display: flex;
  overflow: auto;
  align-items: center;
  margin-left: 10%;
  margin-right: 10%;
  @media (max-width: 600px) {
    margin: 0;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  --ms-overflow-style: none;
  scrollbar-width: none;
`;
const NavigationButton = styled.div`
  display: flex;
  align-items: center;

  max-width: 200px;
  height: 20px;
  margin-left: 10px;
  margin-right: 10px;
  border: 1px solid black;
  padding: 15px;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  :hover {
    transition: all 0.2s ease-in-out;
    background-color: black;
    color: white;
  }
  > h1 {
    margin-left: 15px;
  }
  > .MuiSvgIcon-root {
    margin-left: 15px;
  }
`;

const Header = styled.div`
  background-color: #e9e8e2;
  height: 8%;
  padding: 20px;

  > div {
    margin-left: 20px;
    margin-top: 10px;
    display: flex;
    align-items: center;
  }
`;

const Form = styled.div`
  padding: 20px;

  overflow-x: hidden;
  margin-left: 10%;
  margin-right: 10%;

  @media (max-width: 600px) {
    margin: 0;
  }

  > form {
    > .MuiTextField-root {
      margin-top: 10px;
      border-color: red;
    }
    > button {
      margin-top: 10px;
      background-color: black;
      color: white;
      :hover {
        background-color: #4caf50;
      }
    }
  }
`;

const VideoUploadContainer = styled.div`
  height: 300px;
  margin-top: 20px;
  display: grid;
  place-items: center;
  border: 2px dotted black;
  > div {
    display: flex;
  }
  :hover {
    background-color: gray;
    cursor: pointer;
  }
`;
