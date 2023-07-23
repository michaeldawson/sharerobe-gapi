import React from 'react';
import ReactDOM from 'react-dom';
import { FirebaseAppProvider } from "reactfire";
import App from './App';
import config from "./firebase.prod.config";
import './index.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<FirebaseAppProvider firebaseConfig={config}><App /></FirebaseAppProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
