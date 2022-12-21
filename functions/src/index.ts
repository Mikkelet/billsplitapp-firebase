import * as firebase from "firebase-admin";
firebase.initializeApp();

import * as functions from "firebase-functions";
import { authInterceptor } from "./interceptors/auth-interceptor";
import { addEventImpl } from "./impl/add-event-impl";
import { addFriendImpl } from "./impl/add-friend-impl";
import { addGroupImpl } from "./impl/add-group-impl";
import { getEventsImpl } from "./impl/get-events-impl";
import { getFriendsImpl } from "./impl/get-friends-impl";
import { getGroupImpl } from "./impl/get-group-impl";
import { getGroupsImpl } from "./impl/get-groups-impl";
import { onUserCreateImpl } from "./impl/on-create-user-impl";

export const addGroup = authInterceptor(addGroupImpl);
export const addEvent = authInterceptor(addEventImpl);
export const getEvents = authInterceptor(getEventsImpl);
export const getGroup = authInterceptor(getGroupImpl);
export const getGroups = authInterceptor(getGroupsImpl);
export const addFriend = authInterceptor(addFriendImpl);
export const getFriends = authInterceptor(getFriendsImpl);

export const onUserCreated = functions.auth.user().onCreate(onUserCreateImpl);