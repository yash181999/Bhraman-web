import { Paper, Popover } from "@material-ui/core";
import {
  EditLocation,
  EmojiNature,
  LocalFlorist,
  LocationCity,
  PeopleAlt,
  VideoCall,
  VideoLibrary,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import styled from "styled-components";
import { enterItem } from "../features/appSlice";
import { db } from "../firebase";

function Home() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [monuments, setMonuments] = useState([]);
  const [culture, setCulture] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [food, setFood] = useState([]);
  const [places, setPlaces] = useState([]);
  const dbRef = db.collection("Data");
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchedCity, setSearchedCity] = useState("Indore");

  const [cityData, setCityData] = useState([]);

  const handleSearchInput = (e) => {
    setSearchedCity(e.target.value);
    searchCity(e.target.value);
  };

  const searchCity = (value) => {
    db.collection("Data")
      .orderBy("type")
      .where("type", "==", "AboutCity")
      .startAt(value)
      .onSnapshot((queryData) => {
        setCityData(queryData.docs);
      });
  };

  const getMonuments = () => {
    dbRef
      .where("type", "==", "Monuments")
      .where("city", "==", searchedCity)
      .onSnapshot((querySnaphsot) => {
        setMonuments(querySnaphsot.docs);
      });
  };

  const getCulture = () => {
    dbRef
      .where("type", "==", "Culture")
      .where("city", "==", searchedCity)
      .onSnapshot((querySnaphsot) => {
        setCulture(querySnaphsot.docs);
      });
  };

  const getFestivals = () => {
    dbRef
      .where("type", "==", "Festivals")
      .where("city", "==", searchedCity)
      .onSnapshot((querySnaphsot) => {
        setFestivals(querySnaphsot.docs);
      });
  };

  const getFood = () => {
    dbRef
      .where("type", "==", "Food")
      .where("city", "==", searchedCity)
      .onSnapshot((querySnaphsot) => {
        setFood(querySnaphsot.docs);
      });
  };

  const getPlaces = () => {
    dbRef
      .where("type", "==", "SpecialPlaces")
      .where("city", "==", searchedCity)
      .onSnapshot((querySnaphsot) => {
        setPlaces(querySnaphsot.docs);
      });
  };

  const handlePlaceItemClick = (docId) => {
    localStorage.setItem("selectedDocId", docId);
    dispatch(
      enterItem({
        itemDocId: docId,
      })
    );
    history.push(`/${docId}`);
  };

  useEffect(() => {
    getMonuments();
    getCulture();
    getFestivals();
    getFood();
    getPlaces();
  }, [searchedCity]);

  return (
    <HomeContainer>
      <NavigationButtonContainer>
        <NavigationButton onClick={() => history.push("/charcha")}>
          <p>Charcha</p>
          <PeopleAlt />
        </NavigationButton>
        <NavigationButton onClick={() => history.push("/expreiences")}>
          <p>Experiences</p>
          <VideoLibrary />
        </NavigationButton>
        <NavigationButton onClick={() => history.push("/essence")}>
          <p>Essence</p>
          <LocalFlorist />
        </NavigationButton>
        <NavigationButton onClick={() => history.push("/addExperience")}>
          <p>Add Experience</p>
          <VideoLibrary />
        </NavigationButton>
        <NavigationButton onClick={() => history.push("/addplace")}>
          <p>Add a Place</p>
          <EditLocation />
        </NavigationButton>
        <NavigationButton onClick={() => history.push("/addessence")}>
          <p>Add Essence</p>
          <LocalFlorist />
        </NavigationButton>
      </NavigationButtonContainer>
      <SearchContainer>
        <img src="https://static.tacdn.com/img2/brand/home/home517_mw@2x.webp" />
        <SearchBar>
          <input
            value={searchedCity}
            onChange={handleSearchInput}
            placeholder="City"
            onClick={handleClick}
          ></input>
          <Popover
            id={id}
            open={open}
            disableAutoFocus={true}
            disableEnforceFocus={true}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <Paper
              style={{
                padding: "10px",
                width: "500px",
              }}
            >
              {cityData?.length > 0 &&
                cityData.map((value) => {
                  return (
                    <div
                      key={value.id}
                      onClick={() => setSearchedCity(value.data().city)}
                      style={{
                        padding: "10px",
                        width: "300px",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        width: "100%",
                        padding: "10px",
                        "&:hover": {
                          color: "gray",
                        },
                      }}
                    >
                      <p>{value.data()?.city}</p>
                    </div>
                  );
                })}
            </Paper>
          </Popover>
        </SearchBar>
      </SearchContainer>
      <InfoContainer>
        <h2>Monuments</h2>
        <PlaceItemContainer>
          {monuments.length > 0 &&
            monuments.map((value) => {
              const { city, images, name } = value.data();
              return (
                <PlaceItem
                  key={value.id}
                  onClick={() => handlePlaceItemClick(value.id)}
                >
                  <img src={images[0]}></img>
                  <div>
                    <h4>{name}</h4>
                    <p>{city}</p>
                  </div>
                </PlaceItem>
              );
            })}
        </PlaceItemContainer>
      </InfoContainer>
      <InfoContainer>
        <h2>Culture</h2>
        <PlaceItemContainer>
          {culture.length > 0 &&
            culture.map((value) => {
              const { city, images, name } = value.data();
              return (
                <PlaceItem
                  key={value.id}
                  onClick={() => handlePlaceItemClick(value.id)}
                >
                  <img src={images[0]}></img>
                  <div>
                    <h4>{name}</h4>
                    <p>{city}</p>
                  </div>
                </PlaceItem>
              );
            })}
        </PlaceItemContainer>
      </InfoContainer>

      <InfoContainer>
        <h2>Festivals</h2>
        <PlaceItemContainer>
          {festivals.length > 0 &&
            festivals.map((value) => {
              const { city, images, name } = value.data();
              return (
                <PlaceItem
                  key={value.id}
                  onClick={() => handlePlaceItemClick(value.id)}
                >
                  <img src={images[0]}></img>
                  <div>
                    <h4>{name}</h4>
                    <p>{city}</p>
                  </div>
                </PlaceItem>
              );
            })}
        </PlaceItemContainer>
      </InfoContainer>

      <InfoContainer>
        <h2>Food</h2>
        <PlaceItemContainer>
          {food.length > 0 &&
            food.map((value) => {
              const { city, images, name } = value.data();
              return (
                <PlaceItem
                  key={value.id}
                  onClick={() => handlePlaceItemClick(value.id)}
                >
                  <img src={images[0]}></img>
                  <div>
                    <h4>{name}</h4>
                    <p>{city}</p>
                  </div>
                </PlaceItem>
              );
            })}
        </PlaceItemContainer>
      </InfoContainer>

      <InfoContainer>
        <h2>Famous Places</h2>
        <PlaceItemContainer>
          {places.length > 0 &&
            places.map((value) => {
              const { city, images, name } = value.data();
              return (
                <PlaceItem
                  key={value.id}
                  onClick={() => handlePlaceItemClick(value.id)}
                >
                  <img src={images[0]}></img>
                  <div>
                    <h4>{name}</h4>
                    <p>{city}</p>
                  </div>
                </PlaceItem>
              );
            })}
        </PlaceItemContainer>
      </InfoContainer>
    </HomeContainer>
  );
}

export default Home;

const HomeContainer = styled.div`
  margin-top: 10px;
  overflow-y: none;
  margin-left: 15%;
  margin-right: 15%;
  @media (max-width: 600px) {
    margin-left: 0px;
    margin-right: 0px;
  }
`;
const NavigationButtonContainer = styled.div`
  display: flex;
  overflow: auto;
  align-items: center;
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
  height: 30px;
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

const SearchContainer = styled.div`
  margin-top: 25px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  > img {
    object-fit: cover;
    height: 20%;
    max-height: 350px;
    width: 100%;
    @media (max-width: 600px) {
      height: 40%;
    }
  }
`;

const SearchBar = styled.div`
  width: 80%;
  height: 30px;
  border-radius: 25px;
  background-color: white;
  position: absolute;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 10px;

  > input {
    height: 100%;
    border: none;
    outline: none;
    width: 100%;
    font-size: 16px;
  }
  > .MuiPopover-root {
    border-radius: 20px;
  }
`;

const InfoContainer = styled.div`
  margin-top: 30px;
  > h2 {
    margin-left: 10px;
  }
`;

const PlaceItemContainer = styled.div`
  margin-top: 20px;
  display: flex;
  user-select: none;
  cursor: pointer;
  border-radius: 10px;

  align-items: center;
  overflow-x: scroll;
  overflow-y: hidden;
  ::-webkit-scrollbar {
    display: none;
  }
  --ms-overflow-style: none;
  scrollbar-width: none;
`;

const PlaceItem = styled.div`
  margin-left: 10px;
  background-color: gainsboro;
  border-radius: 20px;

  transition: transform 0.4s;

  > div {
    padding-left: 10px;
    height: 50px;
  }
  > img {
    object-fit: fill;
    border-radius: 20px;
    height: 200px;
    width: 200px;
  }
  :hover {
    background-color: black;
    transition: background-color 0.2s linear;
    color: white;
  }
`;
