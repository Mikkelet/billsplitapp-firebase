import * as firebase from "firebase-admin";

const firestore = firebase.firestore();

export const groupCollection = firestore.collection("groups");
export const userCollection = firestore.collection("users");

export const eventsCollection = (groupId: string) =>
    groupCollection.doc(groupId).collection("events");
export const userDoc = (userId: string) => userCollection.doc(userId);