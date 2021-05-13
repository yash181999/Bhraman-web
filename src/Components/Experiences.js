import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import experience from "../experience.png";
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
    outline : 'none',
    border: 'none'
  },
}));

function Experiences() {
  const videoRef = useRef();
  const [videos, setVideos] = useState([]);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [clickedVideoUrl,setClickedVideoUrl]  = useState(null);

  const handleOpen = (videoUrl) => {
    setOpen(true);
    setClickedVideoUrl(videoUrl);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMouseHoverOnVideo = (e) => {
    e.target.play();
  };

  const handleVideoStop = (e) => {
    e.target.currentTime = 0.1;
    e.target.pause();
  };

  const getVideos = () => {
    db.collection("Videos").onSnapshot((queryData) => {
      setVideos(queryData.docs);
    });
  };

  useEffect(() => {
    getVideos();
  }, []);

  return (
    <ExperiencesContainer>
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
            <video style = {{width : '100%', height : '100%', objectFit: 'contain'}} src= {clickedVideoUrl} controls>
                
            </video>
          </div>
        </Fade>
      </Modal>

      <ExperienceHeader>
        <div>
          <h1>Online Experiences</h1>

          <p>
            Find unique activities led by one-of-a-kind hosts – all without
            leaving home.
          </p>
        </div>
        <img src={experience} />
      </ExperienceHeader>
      <ExpreienceVideos>
        <h2>Indore</h2>
        <Videos>
          {videos.length > 0 &&
            videos.map((value) => {
              const { videoTitle, videoUrl } = value.data();
              return (
                <div>
                  <video
                    onClick = {() => handleOpen(videoUrl)}
                    onMouseEnter={handleMouseHoverOnVideo}
                    onMouseLeave={handleVideoStop}
                    ref={videoRef}
                    src={videoUrl}
                  ></video>
                  <h4>{videoTitle}</h4>
                </div>
              );
            })}
        </Videos>
      </ExpreienceVideos>
    </ExperiencesContainer>
  );
}

export default Experiences;

const ExperiencesContainer = styled.div`
  margin-left: 10%;
  margin-right: 10%;
  padding: 10px;
  overflow-x: hidden;
  @media (max-width: 600px) {
    margin-left: 0;
    margin-right: 0;
  }
`;

const ExperienceHeader = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: center;
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

const ExpreienceVideos = styled.div``;

const Videos = styled.div`
  display: flex;
  margin-top: 10px;
  overflow: auto;

  ::-webkit-scrollbar {
    display: none;
  }
  > div {
    background-color: whitesmoke;
    border-radius: 20px;
    margin-left: 10px;
    margin-right: 10px;
    cursor: pointer;
    > video {
      object-fit: fill;
      border-radius: 20px;
      height: 280px;
      width: 220px;
    }
    > h4 {
      margin-left: 20px;
      padding-bottom: 5px;
    }
  }
`;
