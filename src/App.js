import React, { useEffect } from "react";
import logo from "./logo.png";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import ItemDetails from "./Components/ItemDetails";
import Charcha from "./Components/Charcha";
import Login from "./Components/Login";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { enterItem, selectedItemId } from "./features/appSlice";
import Experiences from "./Components/Experiences";
import Essence from "./Components/Essence";
import AddExperience from "./Components/AddExperience";
import AddPlace from "./Components/AddPlace";
import AddEssence from "./Components/AddEssence";

function App() {
  const [user, loading] = useAuthState(auth);
  const dispatch = useDispatch();
  const selectedDocId = useSelector(selectedItemId);

  useEffect(() => {
    if (auth && user) {
      db.collection("Users").doc(user?.uid).set({
        accountType: "normal",
        email: user?.email,
        name: user?.displayName,
        profilePic: user?.photoURL,
        phone: user?.phoneNumber,
      });
    }
  });

  useEffect(() => {
    const docId = localStorage?.getItem("selectedDocId");
    if (docId) {
      dispatch(
        enterItem({
          itemDocId: docId,
        })
      );
    }
  }, [user]);

  return (
    <div className="App">
      <Router>
        {!user ? (
          <Login />
        ) : (
          <>
            <Navbar />
            <Switch>
              <Route path={`/${selectedDocId}`} exact>
                <ItemDetails />
              </Route>
              <Route path={`/charcha`} exact>
                <Charcha />
              </Route>
              <Route path={`/expreiences`} exact>
                <Experiences />
              </Route>
              <Route path={`/essence`} exact>
                <Essence />
              </Route>
              <Route path={`/addexperience`} exact>
                <AddExperience />
              </Route>
              <Route path={`/addplace`} exact>
                <AddPlace />
              </Route>
              <Route path={`/addessence`} exact>
                <AddEssence />
              </Route>
              <Route path="/" exact>
                <Home />
              </Route>
            </Switch>
          </>
        )}
      </Router>
    </div>
  );
}

export default App;
