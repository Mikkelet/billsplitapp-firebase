import * as firebase from "firebase-admin";
//  const serviceAccount =
// require(`/Users/mikkelthygesen/Downloads/billsplittapp-54ac75f46eb9.json`);
firebase.initializeApp({
    credential: firebase.credential.applicationDefault(),
});

import * as express from "express"
import * as cors from "cors"
import * as functions from "firebase-functions";
import authInterceptor from "./middleware/auth-interceptor";
import addEventImpl from "./impl/add-event-impl";
import addFriendImpl from "./impl/add-friend-impl";
import addGroupImpl from "./impl/add-group-impl";
import getFriendsImpl from "./impl/get-friends-impl";
import getGroupImpl from "./impl/get-group-impl";
import getGroupsImpl from "./impl/get-groups-impl";
import addServiceImpl from "./impl/add-service-impl";
import scheduledServicesImpl from "./cron/services-cron-impl";
import updateServiceImpl from "./impl/update-service-impl";
import leaveGroupImpl from "./impl/leave-group-impl";
import deleteServiceImpl from "./impl/delete-service-impl";
import deleteEventImpl from "./impl/delete-event-impl";
import updateUserImpl from "./impl/update-user-impl";
import getExchangeRatesImpl from "./impl/get-exchage-rates-impl";
import syncExchangeRatesImpl from "./cron/sync-exchange-rates-cron-impl";
import getAppVersionImpl from "./impl/get-app-version";
import inviteToGroupImpl from "./impl/invite-user-to-group-impl";
import getGroupInvitesImpl from "./impl/get-group-invites-impl";
import respondToGroupInviteImpl from "./impl/respond-to-group-invite";
import getEventsImpl from "./impl/get-events-impl";
import respondToFriendRequestImpl from "./impl/respond-to-friend-request-impl";
import deleteUserImpl from "./impl/delete-user-impl";

const app = express()
app.use(cors({ origin: true }))

// User
app.put("/user", (req, res) => authInterceptor(req, res, updateUserImpl))

// Groups
app.get("/groups", (req, res) => authInterceptor(req, res, getGroupsImpl))
app.get("/groupInvites", (req, res) => authInterceptor(req, res, getGroupInvitesImpl))

// Group
app.post("/group", (req, res) => authInterceptor(req, res, addGroupImpl))
app.post("/group/invite", (req, res) => authInterceptor(req, res, inviteToGroupImpl))
app.post("/group/invitation", (req, res) => authInterceptor(req, res, respondToGroupInviteImpl))
app.get("/group/:groupId", (req, res) => authInterceptor(req, res, getGroupImpl))
app.delete("/group/:groupId/events/:eventId", (req, res) =>
    authInterceptor(req, res, deleteEventImpl))
app.get("/group/:groupId/events", (req, res) => authInterceptor(req, res, getEventsImpl))
app.delete("/group/:groupId/user/:userId", (req, res) => authInterceptor(req, res, leaveGroupImpl))
app.get("/leaveGroup/:groupId", (req, res) => authInterceptor(req, res, leaveGroupImpl))

// Events
app.post("/event", (req, res) => authInterceptor(req, res, addEventImpl))

// Friends
app.post("/friends", (req, res) => authInterceptor(req, res, addFriendImpl))
app.get("/friends", (req, res) => authInterceptor(req, res, getFriendsImpl))
app.post("/friendRequest", (req, res) => authInterceptor(req, res, respondToFriendRequestImpl))

// rates
app.get("/rates", (req, res) => authInterceptor(req, res, getExchangeRatesImpl))

// Service
app.post("/group/:groupId/service", (req, res) => authInterceptor(req, res, addServiceImpl))
app.put("/group/:groupId/service", (req, res) => authInterceptor(req, res, updateServiceImpl))
app.delete("/group/:groupId/service/:serviceId", (req, res) =>
    authInterceptor(req, res, deleteServiceImpl))

// App Data
app.get("/appVersion", (req, res) => getAppVersionImpl(req, res))

// Users
app.delete("/user", (req, res) => authInterceptor(req, res, deleteUserImpl))

// catch all
app.all("*", functions.https.onRequest(async (_, res) => {
    res.status(404).send("Invalid request")
}))

export const v7 = functions.https.onRequest(app)

export const scheduledServicesV6 = functions.pubsub
    .schedule("0 0 1 * *")
    .onRun(scheduledServicesImpl)

export const scheduledSyncExchangeRates = functions.pubsub
    .schedule("0 */3 * * *")
    .onRun(syncExchangeRatesImpl)