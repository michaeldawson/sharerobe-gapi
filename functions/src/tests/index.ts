// adminInitStub = sinon.stub(admin, 'initializeApp');
import admin from "../utils/admin";

import firebaseFunctionsTest from "firebase-functions-test";

const tests = firebaseFunctionsTest(
  {
    projectId: "not-implemented",
  },
  "./adminsdk.staging.json(not-implemented)"
);

const firestore = admin.firestore();
const Timestamp = admin.firestore.Timestamp as any;

export default tests;
export { Timestamp, admin, firestore };
