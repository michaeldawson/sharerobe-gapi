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
  const auth = useAuth();
  const firestore = useFirestore();

  auth.onAuthStateChanged((user) => {
    if(user) {
      const profileDoc = doc(collection(firestore, 'profiles'), user.uid)
      console.log(user)
      setDoc(profileDoc, { uid: user.uid, accessToken: user.accessToken, idToken: user.idToken })
    }
  })

  useEffect(() => {
    const setAuth2 = async () => {
      const auth2 = await loadAuth2(
        gapi,
        process.env.REACT_APP_CLIENT_ID,
        SCOPES
      );
      if (auth2.isSignedIn.get()) {
        const user = auth2.currentUser.get();
        updateUser(user);
        const {id_token, access_token} = user.getAuthResponse(true);
        const credential = GoogleAuthProvider.credential(id_token, access_token)

        signInWithCredential(auth, credential);
      } else {
        attachSignin(document.getElementById("customBtn"), auth2);
      }
    };
    setAuth2();
  }, []);

  useEffect(() => {
    // window.gapi = gapi;
    // window.client = gapi.client.gmail
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
    } else {

      // .gmail
      //   .then((response) => {
      //     console.log('Google Analytics request successful!')
      //     if (response.result.items && response.result.items.length) {
      //       const accountNames = response.result.items.map(account => account.name)
      //       alert('Google Analytics account names: ' + accountNames.join(' '))
      //     }
      //   })
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
