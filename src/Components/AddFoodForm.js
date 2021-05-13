import { TextField } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import MobileStepper from "@material-ui/core/MobileStepper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { db, storageRef } from "../firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },

  img: {
    height: "250px",
    objectFit: "contain",
    width: "100%",
  },
}));

function AddFoodForm() {
     
  const [foodForm, setFoodForm] = useState({
    city: "",
    images: [],
    aboutFood: "",
    famousPlace: "",
    other: "",
    name: "",
    shortDescription: "",
    state: "",
    type: "Food",
  });

    const imageRef = useRef(null);
    const classes = useStyles();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = foodForm.images.length;
    const [user] = useState("");

    const handleNext = (e) => {
      e.stopPropagation();
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = (e) => {
      e.stopPropagation();
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
      setActiveStep(step);
    };

    const pickImages = () => {
      imageRef.current.click();
    };

    const handleImageChange = (e) => {
      e.preventDefault();
      console.log("hi");
      const imageArray = Array.from(e.target.files);

      setFoodForm({ ...foodForm, images: imageArray });
    };

    const uploadToDatbase = () => {};

    const uploadImagesToStorage = (file) => {
      const uploadTask = storageRef
        .child("Images")
        .child("City")
        .child(user.uid);
      uploadTask.put(file).then(() => {
        uploadTask.getDownloadURL().then((url) => {});
      });
    };
  return (
    <Form>
      <TextField
        value={foodForm.city}
        onChange={(e) => setFoodForm({ ...foodForm, city: e.target.value })}
        fullWidth
        variant="outlined"
        label="City Name"
      ></TextField>
      <TextField
        value={foodForm.name}
        onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
        fullWidth
        variant="outlined"
        label="Food Name"
      ></TextField>
      <TextField
        value={foodForm.shortDescription}
        onChange={(e) =>
          setFoodForm({ ...foodForm, shortDescription: e.target.value })
        }
        fullWidth
        variant="outlined"
        label="Short Description"
      ></TextField>
      <TextField
        value={foodForm.aboutFood}
        onChange={(e) =>
          setFoodForm({ ...foodForm, aboutFood: e.target.value })
        }
        fullWidth
        variant="outlined"
        label="About Food"
      ></TextField>

      <TextField
        value={foodForm.famousPlace}
        onChange={(e) =>
          setFoodForm({ ...foodForm, famousPlace: e.target.value })
        }
        fullWidth
        variant="outlined"
        label="Famous Place To Eat"
      ></TextField>

      <TextField
        value={foodForm.state}
        onChange={(e) => setFoodForm({ ...foodForm, state: e.target.value })}
        fullWidth
        variant="outlined"
        label="State"
      ></TextField>
      <h4>Images*</h4>
      <input
        onChange={handleImageChange}
        ref={imageRef}
        multiple
        type="file"
        hidden
        accept="image/*"
      ></input>
      <ImageContainer onClick={pickImages}>
        {foodForm.images.length === 0 ? (
          <div>
            <Add />
            <h3>Upload Images</h3>
          </div>
        ) : (
          <>
            <SwipeableViews
              onClick={(e) => e.stopPropagation()}
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={activeStep}
              onChangeIndex={handleStepChange}
              enableMouseEvents
            >
              {foodForm.images.map((src, index) => (
                <div key={index}>
                  {Math.abs(activeStep - index) <= 2 ? (
                    <img
                      className={classes.img}
                      src={URL.createObjectURL(src)}
                      alt={src}
                    />
                  ) : null}
                </div>
              ))}
            </SwipeableViews>
            <MobileStepper
              onClick={(e) => e.stopPropagation()}
              steps={maxSteps}
              position="static"
              variant="text"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNext}
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
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                  ) : (
                    <KeyboardArrowLeft />
                  )}
                  Back
                </Button>
              }
            />{" "}
          </>
        )}
      </ImageContainer>
      <Button fullWidth> Submit</Button>
    </Form>
  );
}

export default AddFoodForm;

const Form = styled.div`
  padding: 20px;

  overflow-x: hidden;
  margin-left: 10%;
  margin-right: 10%;

  @media (max-width: 600px) {
    margin: 0;
  }

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
  > h4 {
    margin-top: 10px;
  }
`;

const ImageContainer = styled.div`
  height: 300px;
  margin-top: 10px;
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
