import * as firebase from "firebase-admin";
firebase.initializeApp();

import * as functions from "firebase-functions";
import { addEventImpl } from "./impl/add-event-impl";
import { addFriendImpl } from "./impl/add-friend-impl";
import { addGroupImpl } from "./impl/add-group-impl";
import { getEventsImpl } from "./impl/get-events-impl";
import { getFriendsImpl } from "./impl/get-friends-impl";
import { getGroupImpl } from "./impl/get-group-impl";
import { getGroupsImpl } from "./impl/get-groups-impl";
import { onUserCreateImpl } from "./impl/on-create-user-impl";

export const addGroup = functions.https.onRequest(addGroupImpl);
export const addEvent = functions.https.onRequest(addEventImpl);
export const getEvents = functions.https.onRequest(getEventsImpl);
export const getGroup = functions.https.onRequest(getGroupImpl);
export const getGroups = functions.https.onRequest(getGroupsImpl);

export const addFriend = functions.https.onRequest(addFriendImpl);
export const getFriends = functions.https.onRequest(getFriendsImpl);

export const onUserCreated = functions.auth.user().onCreate(onUserCreateImpl)