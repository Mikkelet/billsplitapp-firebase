import * as firebase from "firebase-admin";
firebase.initializeApp();

import * as functions from "firebase-functions";
import { Request, Response } from "firebase-functions";
import { checkAuth } from "./auth/auth";
import { addEventImpl } from "./impl/add-event-impl";
import { addFriendImpl } from "./impl/add-friend-impl";
import { addGroupImpl } from "./impl/add-group-impl";
import { getEventsImpl } from "./impl/get-events-impl";
import { getFriendsImpl } from "./impl/get-friends-impl";
import { getGroupImpl } from "./impl/get-group-impl";
import { getGroupsImpl } from "./impl/get-groups-impl";
import { onUserCreateImpl } from "./impl/on-create-user-impl";

function authenticationRequest(request: (req: Request, res: Response, uid: string) => void) {
    return functions.https.onRequest((req, res) => checkAuth(req, res, request));
}

export const addGroup = authenticationRequest(addGroupImpl);
export const addEvent = authenticationRequest(addEventImpl);
export const getEvents = authenticationRequest(getEventsImpl);
export const getGroup = authenticationRequest(getGroupImpl);
export const getGroups = authenticationRequest(getGroupsImpl);
export const addFriend = authenticationRequest(addFriendImpl);
export const getFriends = authenticationRequest(getFriendsImpl);

export const onUserCreated = functions.auth.user().onCreate(onUserCreateImpl);