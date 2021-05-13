import { Button, CircularProgress, TextField } from "@material-ui/core";
import { Add, FlashOnRounded, Room, VideoLibrary } from "@material-ui/icons";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db, storageRef } from "../firebase";
import firebase from "firebase";

function AddExperience() {
  const [formValues, setFormValues] = useState({
    videoTitle: "",
    city: "",
    state: "",
    video: null,
    thumbImage: null,
  });
  const [user] = useAuthState(auth);
  const [videoDownloadUrl, setVideoDownloadUrl] = useState(null);
  const [imageDownloadUrl, setImageDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef();
  const imageRef = useRef();

  const handleImagePick = (e) => {
    e.preventDefault();
    imageRef.current.click();
  };

  const handleVideoPick = (e) => {
    e.preventDefault();
    videoRef.current.click();
  };

  const handleVideoChange = (e) => {
    e.preventDefault();
    setFormValues({ ...formValues, video: e.target.files[0] });
    console.log(formValues.video);
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    setFormValues({ ...formValues, thumbImage: e.target.files[0] });
  };

  const uploadVideoToStorage = async () => {
    const uploadTask = storageRef
      .child("Videos")
      .child(user.uid)
      .child(Date.now().toString());

    await uploadTask.put(formValues.video).then(() => {
      uploadTask.getDownloadURL().then((url) => {
        setVideoDownloadUrl(url);
        console.log("video uploaded");
      });
    });
  };

  const uploadThumbImageToStorage = async () => {
    const uploadTask = storageRef
      .child("ThumbImage")
      .child(user.uid)
      .child(Date.now().toString());

    await uploadTask.put(formValues.thumbImage).then(() => {
      uploadTask.getDownloadURL().then((url) => {
        setImageDownloadUrl(url);
        console.log("image uploaded");
      });
    });
  };

  const uploadToDatabase = async (e) => {
    e.preventDefault();
    setLoading(true);
    await uploadVideoToStorage().then(() => {
      uploadThumbImageToStorage().then(() => {
        if (videoDownloadUrl && imageDownloadUrl) {
          db.collection("Videos")
            .doc()
            .set({
              city: formValues.city,
              state: formValues.state,
              status: true,
              thumImageUrl: imageDownloadUrl,
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
              userId: user?.uid,
              userName: user.displayName,
              videoTitle: formValues.videoTitle,
              videoType: "Experience",
              videoUrl: videoDownloadUrl,
            })
            .then(() => {
              setLoading(false);
              setFormValues({
                videoTitle: "",
                city: "",
                state: "",
                video: null,
                thumbImage: null,
              });
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          console.log("video and image are null");
          setLoading(false);
        }
      });
    });
    setLoading(false);
  };
  //https://firebasestorage.googleapis.com/v0/b/bhrammanbeta.appspot.com/o/Videos%2FcChmNn6c6XcvPwANqIdPKWZYHYz2%2F1620879122112?alt=media&token=b4a761fc-2038-43ee-8804-4fc278acc5d1

  //https://firebasestorage.googleapis.com/v0/b/bhrammanbeta.appspot.com/o/ThumbImage%2FcChmNn6c6XcvPwANqIdPKWZYHYz2%2F1620879339827?alt=media&token=d1ad8f68-246f-47b2-8e49-2a9c4ab0c3ca

//   cChmNn6c6XcvPwANqIdPKWZYHYz2;

  return (
    <AddExperienceContainer>
      <Header>
        <div>
          <VideoLibrary fontSize="large" style={{ color: "red" }} />
          <h1>Add Experience</h1>
        </div>
      </Header>
      <Form>
        <form>
          <TextField
            value={formValues.videoTitle}
            onChange={(e) =>
              setFormValues({ ...formValues, videoTitle: e.target.value })
            }
            fullWidth
            variant="outlined"
            label="Video Title"
          ></TextField>

          <TextField
            fullWidth
            value={formValues.city}
            onChange={(e) =>
              setFormValues({ ...formValues, city: e.target.value })
            }
            variant="outlined"
            label="City"
          ></TextField>
          <TextField
            fullWidth
            value={formValues.state}
            onChange={(e) =>
              setFormValues({ ...formValues, state: e.target.value })
            }
            variant="outlined"
            label="State"
          ></TextField>
          <input
            hidden
            ref={videoRef}
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
          ></input>
          <VideoUploadContainer onClick={handleVideoPick}>
            {!formValues.video && (
              <div>
                <Add />
                <h3>Upload Video</h3>
              </div>
            )}
            {formValues.video && (
              <video
                controls
                style={{ height: "300px", width: "100%", objectFit: "contain" }}
                src={URL.createObjectURL(formValues.video)}
              />
            )}
          </VideoUploadContainer>
          <input
            ref={imageRef}
            hidden
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          ></input>
          <VideoUploadContainer onClick={handleImagePick}>
            {!formValues.thumbImage && (
              <div>
                <Add />
                <h3>Upload Thumbnail for Video</h3>
              </div>
            )}
            {formValues.thumbImage && (
              <img
                style={{ height: "300px", width: "100%", objectFit: "contain" }}
                src={URL.createObjectURL(formValues.thumbImage)}
              ></img>
            )}
          </VideoUploadContainer>
          {!loading && (
            <Button
              onClick={uploadToDatabase}
              disabled={
                !formValues.state ||
                !formValues.video ||
                !formValues.city ||
                !formValues.thumbImage ||
                !formValues.video ||
                !formValues.videoTitle
              }
              style={{ color: "white" }}
              fullWidth
            >
              Submit
            </Button>
          )}

          {loading && (
            <div style={{ display: "grid", placeItems: "center" }}>
              <CircularProgress />
            </div>
          )}
        </form>
      </Form>
    </AddExperienceContainer>
  );
}

export default AddExperience;

const AddExperienceContainer = styled.div`
  background-color: #f4f3ee;
  height: 100vh;
  width: 100%;
  overflow: scroll;
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
