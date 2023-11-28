import { User, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { useEffect, useState } from "react";
import {
  AuthProvider,
  FirestoreProvider,
  FunctionsProvider,
  useFirebaseApp,
} from "reactfire";
import "./App.css";
import { GoogleLogin } from "./components/GoogleLogin";
import Products from "./components/Products";

function App() {
  const app = useFirebaseApp();
  const firestoreInstance = getFirestore(app);
  const auth = getAuth(app);
  const functions = getFunctions(app);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => setUser(user));
  }, []);

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <AuthProvider sdk={auth}>
        <FunctionsProvider sdk={functions}>
          <GoogleLogin />
          {user ? <Products uid={user.uid} /> : null}
        </FunctionsProvider>
      </AuthProvider>
    </FirestoreProvider>
  );
}

export default App;
