import * as firebase from "firebase-admin";
firebase.initializeApp();

import * as express from "express"
import * as cors from "cors"
import * as functions from "firebase-functions";
import { authInterceptor } from "./middleware/auth-interceptor";
import { addEventImpl } from "./impl/add-event-impl";
import { addFriendImpl } from "./impl/add-friend-impl";
import { addGroupImpl } from "./impl/add-group-impl";
import { getFriendsImpl } from "./impl/get-friends-impl";
import { getGroupImpl } from "./impl/get-group-impl";
import { getGroupsImpl } from "./impl/get-groups-impl";
import { addServiceImpl } from "./impl/add-service-impl";
import { scheduledServicesImpl } from "./cron/services-cron-impl";
import { updateServiceImpl } from "./impl/update-service-impl";

const app = express()
app.use(cors({ origin: true }))

// Groups
app.get("/groups", (req, res) => authInterceptor(getGroupsImpl)(req, res))

// Group
app.post("/group", (req, res) => authInterceptor(addGroupImpl)(req, res))
app.get("/group/:id", (req, res) => authInterceptor(getGroupImpl)(req, res))

// Events
app.post("/event", (req, res) => authInterceptor(addEventImpl)(req, res))

// Friends
app.post("/friends", (req, res) => authInterceptor(addFriendImpl)(req, res))
app.get("/friends", (req, res) => authInterceptor(getFriendsImpl)(req, res))

// Service
app.post("/service", (req, res) => authInterceptor(addServiceImpl)(req, res))
app.put("/service", (req, res) => authInterceptor(updateServiceImpl)(req, res))

export const v2 = functions.https.onRequest(app)

export const scheduledServicesV2 = functions.pubsub
    .schedule("0 0 1 * *")
    .onRun(scheduledServicesImpl)