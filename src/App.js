import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import {
  AuthProvider,
  FirestoreProvider,
  FunctionsProvider,
  useFirebaseApp,
} from "reactfire";
import "./App.css";
import { GoogleLogin } from "./components/GoogleLogin";

function App() {
  const app = useFirebaseApp();
  const firestoreInstance = getFirestore(app);
  const auth = getAuth(app);
  const functions = getFunctions(app);

  console.log({app})

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <AuthProvider sdk={auth}>
        <FunctionsProvider sdk={functions}>
          <div className="App"></div>
          <GoogleLogin />
        </FunctionsProvider>
      </AuthProvider>
    </FirestoreProvider>
  );
}

export default App;
