import * as firebase from "firebase-admin";

const firestore = firebase.firestore();
const appDataCollection = firestore.collection("app-data");
export const appVersionDoc = appDataCollection.doc("app-version")
