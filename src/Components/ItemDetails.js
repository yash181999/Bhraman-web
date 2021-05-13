import { Avatar, IconButton, SwipeableDrawer } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import styled from "styled-components";
import SwipeableViews from "react-swipeable-views";
import { Send } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { selectedItemId } from "../features/appSlice";
import { auth, db } from "../firebase";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const tutorialSteps = [
  {
    label: "San Francisco – Oakland Bay Bridge, United States",
    imgPath:
      "https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Bird",
    imgPath:
      "https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Bali, Indonesia",
    imgPath:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80",
  },
  {
    label: "NeONBRAND Digital Marketing, Las Vegas, United States",
    imgPath:
      "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Goč, Serbia",
    imgPath:
      "https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    width: "100%",
    height: "400px",
    borderRadius: "20px",
    objectFit: "cover",
  },
}));

function ItemDetails() {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [reviewInput, setReviewInput] = useState("");
  const docId = useSelector(selectedItemId);
  const [itemDetails, setItemDetails] = useState(null);
  const maxSteps = itemDetails?.images?.length;
  const [user] = useAuthState(auth);
  const [reviews, setReviews] = useState([]);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const getItemDetials = () => {
    if (docId) {
      db.collection("Data")
        .doc(docId)
        .get().then((queryData) => {
          setItemDetails(queryData.data());
        });
    }
  };

  const sendReview = async() => {
    if (reviewInput) {
     await  db.collection("Data")
        .doc(docId)
        .collection("Reviews")
        .doc(user.uid)
        .set({
          timeStamp : firebase.firestore.FieldValue.serverTimestamp(),
          profilePic: user?.photoURL,
          review: reviewInput,
          userId: user?.uid,
          userName: user?.displayName,
        })
        .then(() => {
          setReviewInput("");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const getReviews = () => {
    db.collection('Data').doc(docId).collection('Reviews').orderBy('timeStamp', 'desc').onSnapshot((queryData) => {
        setReviews(queryData.docs);
    })
  }

  useEffect(() => {
    getItemDetials();
  }, []);

  useEffect(() => {
    getReviews();
  },[]);

  return (
    <ItemDetialContainer>
      <NameContainer>
        <h2>{itemDetails?.name}</h2>
      </NameContainer>
      <ImageContainer>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {itemDetails?.images?.length > 0 &&
            itemDetails.images.map((url, index) => (
              <div key={url}>
                {Math.abs(activeStep - index) <= 2 ? (
                  <img className={classes.img} src={url} alt={url} />
                ) : null}
              </div>
            ))}
        </SwipeableViews>

        <MobileStepper
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            color: "white",
            fontWeight: "bold",
            userSelect: "none",
            backgroundColor: "transparent",
          }}
          steps={maxSteps}
          position="static"
          variant="text"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              style={{ color: "white" }}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              style={{ color: "white" }}
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Prev
            </Button>
          }
        />
      </ImageContainer>

      <OverViewContainer>
        {/* Monument Details */}
        {itemDetails?.type === "Monuments" && (
          <>
            <h3>Overview</h3>
            <p>{itemDetails?.longDescription?.aboutThePlace}</p>
            <h3>History</h3>
            <p>{itemDetails?.longDescription?.history}</p>
            <h4>Location</h4>
            <p>{itemDetails.location}</p>
            <h4>Entry Fee</h4>
            <p>{itemDetails?.entryFee}</p>
          </>
        )}

        {/* Culture Details */}
        {itemDetails?.type === "Culture" && (
          <>
            <h3>Overview</h3>
            <p>{itemDetails?.shortDescription}</p>
            <h3>About</h3>
            <p>{itemDetails?.longDescription?.about}</p>
            <h3>History</h3>
            <p>{itemDetails?.longDescription?.history}</p>
          </>
        )}

        {/* Festival Details */}

        {itemDetails?.type === "Festivals" && (
          <>
            <h3>Overview</h3>
            <p>{itemDetails?.shortDescription}</p>
            <h3>About</h3>
            <p>{itemDetails?.longDescription?.about}</p>
            <h3>History</h3>
            <p>{itemDetails?.longDescription?.history}</p>
          </>
        )}

        {/* Food Details */}

        {itemDetails?.type === "Food" && (
          <>
            <h3>Overview</h3>
            <p>{itemDetails?.shortDescription}</p>
            <h3>About</h3>
            <p>{itemDetails?.longDescription?.aboutFood}</p>
            <h3>Famous Place To Eat</h3>
            <p>{itemDetails?.longDescription?.famousPlace}</p>
          </>
        )}

        {itemDetails?.type === "SpecialPlaces" && (
          <>
            <h3>Overview</h3>
            <p>{itemDetails?.shortDescription}</p>
            <h3>About</h3>
            <p>{itemDetails?.longDescription?.about}</p>
            <h3>History</h3>
            <p>{itemDetails?.longDescription?.history}</p>
          </>
        )}
      </OverViewContainer>

      <ReviewContainer>
        <h3>Reviews</h3>
        <ReviewInput>
          <input
            value={reviewInput}
            onChange={(e) => {
              setReviewInput(e.target.value);
            }}
            placeholder="Please give us a review"
          ></input>
          <IconButton onClick={sendReview}>
            <Send style={{ color: "black" }} />
          </IconButton>
        </ReviewInput>
        <Reviews>
         {
           reviews.length  >0 && reviews.map((value) => {
              const {timeStamp, profilePic, userName, review} = value.data();
              return (
                <>
                  <div>
                    <Avatar src = {profilePic}/>
                    <div>
                      <h4>{userName}</h4>
                      <p>{new Date(timeStamp?.toDate()).toString()}</p>
                    </div>
                  </div>
                  <p>{review}</p>
                </>
              );
           })
         }
        </Reviews>
      </ReviewContainer>
    </ItemDetialContainer>
  );
}

export default ItemDetails;

const ItemDetialContainer = styled.div`
  margin-top: 20px;
  margin-left: 10%;
  margin-right: 10%;
  @media (max-width: 600px) {
    margin-left: 0;
    margin-right: 0;
    padding: 10px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  margin-top: 20px;
`;

const NameContainer = styled.div`
  margin-left: 10px;
  margin-top: 10px;
  padding: 3px;
  border-bottom: 1px solid gray;
`;

const OverViewContainer = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;

  padding: 10px;
  > p {
    margin-top: 5px;
  }
  > h3 {
    margin-top: 13px;
  }
`;
const ReviewInput = styled.div`
  margin-top: 10px;
  width: 98%;
  border: 1px solid gray;
  height: 30px;
  display: flex;
  border-radius: 7px;
  padding: 3px;
  > input {
    flex: 1;
    border: none;
    outline: none;
  }
`;
const ReviewContainer = styled.div`
  margin-top: 40px;
  margin-left: 10px;
  padding: 3px;
`;

const Reviews = styled.div`
  margin-top: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 10px;
  > div {
    display: flex;
    align-items: center;
    > div {
      margin-left: 10px;
      > p {
        font-size: 10px;
      }
    }
  }
  > p {
    margin: 13px;
  }
`;
