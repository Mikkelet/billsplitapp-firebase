import * as firebase from "firebase-admin";
firebase.initializeApp();

import * as functions from "firebase-functions";
import { addEventImpl } from "./impl/add-event-impl";
import { addGroupImpl } from "./impl/add-group-impl";
import { getEventsImpl } from "./impl/get-events-impl";

export const addGroup = functions.https.onRequest(addGroupImpl);
export const addEvent = functions.https.onRequest(addEventImpl);
export const getEvents = functions.https.onRequest(getEventsImpl);