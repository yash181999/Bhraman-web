import {
  Avatar,
  Button,
  IconButton,
  Input,
  TextField,
} from "@material-ui/core";
import { Close, Dvr, Edit } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import charcha from "../charcha.svg";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { auth, db } from "../firebase";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 420,
    margin: "auto",
  },
  modalPaper: {
    padding: "10px",
    backgroundColor: "white",
    outline: "none",
    borderRadius: "10px",
    height: "500px",
    width: "500px",
    textAlign: "center",
    boxShadow: theme.shadows[5],
    "& p": {
      padding: "5px",
      color: "black",
    },
    "& h3": {
      color: "black",
    },
  },
  closeButton: {
    display: "flex",
    justifyContent: "flex-end",
  },
  inputFieldContainer: {
    minHeight: "60%",
    marginTop: "15px",
    border: "1px solid black",
    borderRadius: "10px",
    backgroundColor: "white",
  },
}));

function Charcha() {

  const classes = useStyles();
  const [openModal, setOpenModal] = React.useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [answerTheQuestion, setAnswerTheQuestion] = useState(false);
  const [discussions, setDiscussions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [clickedQuestionId, setClickedQuestionId] = useState(null);
  const [user] = useAuthState(auth);
  const [questionInput, setQuestionInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const handleOpen = () => {
    setOpenModal(true);
  };


  const handleModalClose = () => {
    setOpenModal(false);
    setAnswerInput('');
    setQuestionInput('');
    setAnswerTheQuestion(false);
  };


  const openPostQuestionModal = () => {
    handleOpen();
  };


  const handleAnswerTheQuestion = (docId) => {
    setAnswerTheQuestion(true);
    handleOpen();
    setClickedQuestionId(docId);
  };

  const getQuestions =  () => {
     db
      .collection("Discussions")
      .orderBy("timeStamp", "desc")
      .onSnapshot((queryData) => {
        setDiscussions(queryData.docs);
      });
  };

  const getAnswers = (docId) => {
    setClickedQuestionId(docId);
    setShowAnswers(!showAnswers);
    if (showAnswers) {
      db.collection("Discussions")
        .doc(docId)
        .collection("Answers")
        .onSnapshot((queryData) => {
          setAnswers(queryData.docs);
        });
    }
  };

  useEffect(() => {
    getQuestions();
    if (clickedQuestionId) {
      getAnswers(clickedQuestionId);
    }
  }, []);

  const postQuestion = async () => {

    await db.collection("Discussions").doc().set({
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      userId: user.uid,
      question: questionInput,
      userName: user.displayName,
      profilePhoto: user.photoURL,
    });
    setQuestionInput("");
    handleModalClose();
    
  };

  const postAnswer = async() => {
   
    await db.collection("Discussions")
      .doc(clickedQuestionId)
      .collection("Answers")
      .doc()
      .set({
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        userId: user.uid,
        answer: answerInput,
        userName: user.displayName,
        profilePhoto: user.photoURL,
      });

       setAnswerInput("");
       handleModalClose();
  };





  return (
    <CharchaContainer>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModal}
        onClose={() => handleModalClose()}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={classes.modalPaper}>
            <>
              <div className={classes.closeButton}>
                <IconButton onClick={handleModalClose}>
                  <Close style={{ color: "black" }}></Close>
                </IconButton>
              </div>

              {!answerTheQuestion && <h2>Post A Question</h2>}
              {answerTheQuestion && <h3>Question</h3>}
              <div className={classes.inputFieldContainer}>
                <TextField
                  value={answerTheQuestion ? answerInput : questionInput}
                  onChange={(e) =>
                    answerTheQuestion
                      ? setAnswerInput(e.target.value)
                      : setQuestionInput(e.target.value)
                  }
                  style={{
                    width: "90%",
                    padding: "10px",
                    color: "black",
                  }}
                  InputProps={{
                    disableUnderline: true,
                    className: "textField__label",
                  }}
                  id="standard-multiline-flexible"
                  multiline
                  placeholder={`${
                    answerTheQuestion
                      ? "Write Your Answer"
                      : "Write Your Question"
                  }`}
                  rowsMax={10}
                />
              </div>

              <Button
                fullWidth
                disabled = {(answerInput === '') && (questionInput === '')}
                onClick={() =>
                  answerTheQuestion ? postAnswer() : postQuestion()
                }
                style={{
                  marginTop: "20px",
                  backgroundColor: "#3498db",
                  color: "white",
                }}
              >
                Submit
              </Button>
            </>
          </div>
        </Fade>
      </Modal>

      <Heading>
        <h2>Charcha - Discussion Forum</h2>
        <Button onClick={openPostQuestionModal}>Post A Question</Button>
      </Heading>
      <h3>Questions For You</h3>
      <Questions>
        {discussions.length > 0 &&
          discussions.map((value) => {
            const {
              question,
              timeStamp,
              userName,
              userId,
              profilePhoto,
            } = value.data();
            return (
              <Question>
                <div>
                  <Avatar src={profilePhoto} />
                  <h4>{userName}</h4>
                </div>
                <p>{question}</p>
                <QuestionBottom>
                  <Button
                    fullWidth
                    onClick={() => getAnswers(value.id)}
                  >{`${"Answers"}`}</Button>
                  <Button
                    disabled={userId === user.uid}
                    onClick={() => handleAnswerTheQuestion(value.id)}
                    fullWidth
                  >
                    Answer the Question
                  </Button>
                </QuestionBottom>
                {clickedQuestionId === value.id && showAnswers && (
                  <Answers>
                    <div>
                      {answers.length > 0 &&
                        answers.map((value) => {
                          const {
                            userName,
                            profilePhoto,
                            answer,
                          } = value.data();
                          return (
                            <Answer>
                              <div>
                                <Avatar
                                  src={profilePhoto}
                                  style={{ height: 30, width: 30 }}
                                />
                                <h5>{userName}</h5>
                              </div>
                              <p>{answer}</p>
                            </Answer>
                          );
                        })}
                      {answers.length === 0 && (
                        <div style={{ display: "grid", placeItems: "center" }}>
                          No Answers available
                        </div>
                      )}
                    </div>
                  </Answers>
                )}
              </Question>
            );
          })}
      </Questions>
    </CharchaContainer>
  );
}

export default Charcha;

const CharchaContainer = styled.div`
  margin-left: 10%;
  padding: 5px;
  margin-right: 10%;
  margin-top: 10px;
  @media (max-width: 600px) {
    margin-left: 0;
    margin-right: 0;
  }
  > h3 {
    margin-top: 10px;
    padding: 10px;
  }
`;

const Heading = styled.div`
  position: relative;
  border-bottom: 1px solid gray;
  align-items: center;
  display: flex;
  padding: 10px;
  justify-content: space-between;
  > h2 {
    padding: 10px;
  }
  > button {
    display: flex;
    align-items: center;
    text-align: center;
    background-color: #34e0a1;
    color: white;
    :hover {
      background-color: white;
      color: #34e0a1;
    }
  }
`;

const Questions = styled.div`
  margin-top: 10px;
`;

const Question = styled.div`
  border-top: 1px solid black;
  padding-top: 10px;
  > div {
    display: flex;
    align-items: center;
    > h4 {
      margin-left: 10px;
    }
  }
  > p {
    margin-top: 5px;
    margin-left: 5px;
  }
`;

const QuestionBottom = styled.div`
  display: flex;
  margin-top: 10px;
`;

const Answers = styled.div`
  margin-top: 8px;
  border-top: 1px dotted black;
`;

const Answer = styled.div`
  padding: 15px;
  > div {
    display: flex;
    align-items: center;
    > h5 {
      margin-left: 10px;
    }
  }
  > p {
    margin-left: 10px;
    margin-top: 10px;
  }
`;
