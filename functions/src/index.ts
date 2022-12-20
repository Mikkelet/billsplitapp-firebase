import * as firebase from "firebase-admin";
firebase.initializeApp();

import * as functions from "firebase-functions";
import { checkAuth } from "./auth/auth";
import { addEventImpl } from "./impl/add-event-impl";
import { addFriendImpl } from "./impl/add-friend-impl";
import { addGroupImpl } from "./impl/add-group-impl";
import { getEventsImpl } from "./impl/get-events-impl";
import { getFriendsImpl } from "./impl/get-friends-impl";
import { getGroupImpl } from "./impl/get-group-impl";
import { getGroupsImpl } from "./impl/get-groups-impl";
import { onUserCreateImpl } from "./impl/on-create-user-impl";

export const addGroup = functions.https.onRequest(
    (req, res) => checkAuth(req, res, addGroupImpl));
export const addEvent = functions.https.onRequest(
    (req, res) => checkAuth(req, res, addEventImpl));
export const getEvents = functions.https.onRequest(
    (req, res) => checkAuth(req, res, getEventsImpl));
export const getGroup = functions.https.onRequest(
    (req, res) => checkAuth(req, res, getGroupImpl));
export const getGroups = functions.https.onRequest(
    (req, res) => checkAuth(req, res, getGroupsImpl));
export const addFriend = functions.https.onRequest(
    (req, res) => checkAuth(req, res, addFriendImpl));
export const getFriends = functions.https.onRequest(
    (req, res) => checkAuth(req, res, getFriendsImpl));

export const onUserCreated = functions.auth.user().onCreate(onUserCreateImpl)