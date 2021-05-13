import React, { useEffect, useState } from "react";
import styled from "styled-components";
import essence from "../essence.png";
import { db } from "../firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[10],
    borderRadius: "20px",
    width: "70%",
    height: "80%",
    overflow: "scroll",
    padding: theme.spacing(4),
    outline: "none",
    border: "none",
    textAlign: "center",
    color: "black",
    backgroundColor: "white",
  },
  image: {
    borderRadius: "20px",
    width: "100%",
    height: "300px",
    objectFit: "fill",
    marginTop: "10px",
    marginBottom: "10px",
  },
}));
function Essence() {
  const [stories, setStories] = useState([]);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const [clickedData, setClickedData] = useState(null);

  const handleOpen = (data) => {
    setOpen(true);
    setClickedData(data);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getStories = () => {
    db.collection("Data")
      .where("type", "==", "IntangibleHeritage")
      .onSnapshot((queryData) => {
        setStories(queryData.docs);
      });
  };

  useEffect(() => {
    getStories();
  }, []);

  return (
    <EssenceContainer>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2>{clickedData?.name}</h2>
            <img className={classes.image} src={clickedData?.images[0]}></img>
            <p>{clickedData?.description}</p>
          </div>
        </Fade>
      </Modal>
      <EssenceHeader>
        <div>
          <h1>Essence</h1>
          <p>Explore untold stories with essence</p>
        </div>
        <img src={essence} />
      </EssenceHeader>
      <Stories>
        {stories.length > 0 &&
          stories.map((value) => {
            const { name, images, description } = value.data();
            return (
              <Story onClick={() => handleOpen(value.data())}>
                <div>
                  <h2>{name}</h2>
                </div>
                <img src={images[0]} />
              </Story>
            );
          })}
      </Stories>
    </EssenceContainer>
  );
}

export default Essence;

const EssenceContainer = styled.div`
  margin-left: 10%;
  margin-right: 10%;
  padding: 10px;
  overflow-x: hidden;
  @media (max-width: 600px) {
    margin-left: 0;
    margin-right: 0;
  }
`;

const EssenceHeader = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: center;
  margin-bottom: 1px solid black;
  > div {
    padding-bottom: 10px;
    border-bottom: 1px dotted black;
    > p {
      margin-top: 15px;
    }
  }
  > img {
    width: 50%;

    height: 50%;
    object-fit: contain;
  }
`;

const Stories = styled.div``;

const Story = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: center;
  padding: 20px;
  cursor: pointer;
  user-select: none;
  border-radius: 20px;
  transition: transform 0.4s;
  :hover {
    background-color: black;
    transition: background-color 0.2s linear;
    color: white;
  }
  > div {
    flex: 0.4;
    width :40%;
    padding-bottom: 10px;
    > p {
      margin-top: 15px;
    }
  }
  > img {
    width: 50%;
    flex: 0.6;
    border-radius: 20px;
    height: 300px;
    object-fit: cover;
  }
`;
