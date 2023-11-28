import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { gapi, loadAuth2 } from "gapi-script";
import { useEffect, useState } from "react";
import { useAuth, useFirestore } from "reactfire";
import "./GoogleLogin.css";
import { UserCard } from "./UserCard";

const SCOPES = [
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.readonly",
].join(" ");

export const GoogleLogin = () => {
  const [user, setUser] = useState(null);
  const [cred, setCred] = useState(null);
  const auth = useAuth();
  const firestore = useFirestore();
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(setFirebaseUser);
  }, [auth])

  useEffect(() => {
    if (firebaseUser && cred) {
      const profileDoc = doc(collection(firestore, "profiles"), firebaseUser.uid);
      setDoc(profileDoc, {
        uid: firebaseUser.uid,
        accessToken: cred.accessToken,
        idToken: cred.idToken,
      });
    }
  }, [firebaseUser, JSON.stringify(cred)]);

  useEffect(() => {
    (async () => {
      const auth2 = await loadAuth2(
        gapi,
        process.env.REACT_APP_CLIENT_ID,
        SCOPES
      );

      if (auth2.isSignedIn.get()) {
        const user = auth2.currentUser.get();
        updateUser(user);
        const { id_token, access_token } = user.getAuthResponse(true);
        const credential = GoogleAuthProvider.credential(
          id_token,
          access_token
        );
        setCred(credential);
        signInWithCredential(auth, credential)
      } else {
        attachSignin(document.getElementById("customBtn"), auth2);
      }
    })();
  }, []);

  useEffect(() => {
    if (!user) {
      const setAuth2 = async () => {
        const auth2 = await loadAuth2(
          gapi,
          process.env.REACT_APP_CLIENT_ID,
          SCOPES
        );
        attachSignin(document.getElementById("customBtn"), auth2);
      };
      setAuth2();
    }
  }, [user]);

  const updateUser = (currentUser) => {
    const name = currentUser.getBasicProfile().getName();
    const profileImg = currentUser.getBasicProfile().getImageUrl();
    setUser({
      name: name,
      profileImg: profileImg,
    });
  };

  const attachSignin = (element, auth2) => {
    auth2.attachClickHandler(
      element,
      {},
      (googleUser) => {
        updateUser(googleUser);
      },
      (error) => {
        console.log(JSON.stringify(error));
      }
    );
  };

  const signOut = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      setUser(null);
      console.log("User signed out.");
    });
  };

  if (user) {
    return (
      <div className="container">
        <UserCard user={user} />
        <div id="" className="btn logout" onClick={signOut}>
          Logout
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div id="customBtn" className="btn login">
        Login
      </div>
    </div>
  );
};
