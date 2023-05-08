import * as firebase from "firebase-admin";
//  const serviceAccount =
// require(`/Users/mikkelthygesen/Downloads/billsplittapp-54ac75f46eb9.json`);
firebase.initializeApp({
    credential: firebase.credential.applicationDefault(),
});

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
import { leaveGroupImpl } from "./impl/leave-group-impl";
import { addToGroupImpl } from "./impl/add-user-to-group-impl";
import { deleteServiceImpl } from "./impl/delete-service-impl";
import { updateUserImpl } from "./impl/update-user-impl";
import { deleteEventImpl } from "./impl/delete-event-impl";

const app = express()
app.use(cors({ origin: true }))

// User
app.put("/user", (req, res) => authInterceptor(updateUserImpl)(req, res))

// Groups
app.get("/groups", (req, res) => authInterceptor(getGroupsImpl)(req, res))

// Group
app.post("/group", (req, res) => authInterceptor(addGroupImpl)(req, res))
app.get("/group/:id", (req, res) => authInterceptor(getGroupImpl)(req, res))
app.post("/group/:groupId/user", (req, res) => authInterceptor(addToGroupImpl)(req, res))
app.delete("/group/:groupId/events/:eventId", (req, res) =>
    authInterceptor(deleteEventImpl)(req, res))
app.delete("/group/:groupId/user/:userId", (req, res) => authInterceptor(leaveGroupImpl)(req, res))
app.get("/leaveGroup/:groupId", (req, res) => authInterceptor(leaveGroupImpl)(req, res))

// Events
app.post("/event", (req, res) => authInterceptor(addEventImpl)(req, res))

// Friends
app.post("/friends", (req, res) => authInterceptor(addFriendImpl)(req, res))
app.get("/friends", (req, res) => authInterceptor(getFriendsImpl)(req, res))

// Service
app.post("/group/:groupId/service", (req, res) => authInterceptor(addServiceImpl)(req, res))
app.put("/group/:groupId/service", (req, res) => authInterceptor(updateServiceImpl)(req, res))
app.delete("/group/:groupId/service/:serviceId", (req, res) =>
    authInterceptor(deleteServiceImpl)(req, res))

app.all("*", functions.https.onRequest(async (_, res) => {
    res.status(404).send("Invalid request")
}))

export const v2 = functions.https.onRequest(app)

export const scheduledServicesV2 = functions.pubsub
    .schedule("0 0 1 * *")
    .onRun(scheduledServicesImpl)