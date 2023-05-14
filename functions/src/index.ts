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
import addToGroupImpl from "./impl/add-user-to-group-impl";
import deleteServiceImpl from "./impl/delete-service-impl";
import deleteEventImpl from "./impl/delete-event-impl";
import updateUserImpl from "./impl/update-user-impl";
import { groupCollection } from "./collections/group-collection";
import BatchInstance from "./utils/batch_helper";
import { ServiceV2, convertServiceV2toV3 } from "./interfaces/models/service";
import { EventV2, ExpenseEventV2, PaymentV2, convertExpenseV2ToV3, convertPaymentV2toV3 } from "./interfaces/models/events";
import { handleError } from "./utils/error-utils";
import { GroupV2, convertGroupV2toV3 } from "./interfaces/models/group";

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

// Data migration

const firestore = firebase.firestore()
const groupsV3Collection = firestore.collection("groups-v4")
const eventsCollection = firestore.collectionGroup("events")
const servicesCollection = firestore.collectionGroup("services")
export const migrateGroupsV2toV3 = functions.https.onRequest(async (req, res) => {
    const batchBulk = new BatchInstance()

    try {
        const groupsRequest = await groupCollection.get()

        for (const doc of groupsRequest.docs) {
            const ref = groupsV3Collection.doc(doc.id)
            const dataV2 = doc.data() as GroupV2
            const dataV3 = convertGroupV2toV3(dataV2)
            batchBulk.set(ref, dataV3)
        }
        await batchBulk.commit()
        res.send()
    } catch (e) {
        handleError(e, res)
    }
})

export const migrateEventsV2toV3 = functions.https.onRequest(async (req, res) => {
    const batchBulk = new BatchInstance()

    try {
        const eventsRequest = await eventsCollection.get()
        eventloop:for (const doc of eventsRequest.docs) {
            const event = doc.ref
            if (event.parent.parent?.parent?.id !== "groups-v3") {
                console.log(`parent id was ${event.parent.parent?.parent?.id}`);
                continue eventloop;
            }

            const groupId = event.parent.parent?.id
            if (!groupId) continue

            const dataV2 = doc.data() as EventV2
            if (dataV2.type === "expense") {
                console.log(`converting expense ${doc.ref.path}`);
                const dataV3 = convertExpenseV2ToV3(dataV2 as ExpenseEventV2)
                const ref = groupsV3Collection.doc(groupId).collection("events").doc(doc.id)
                batchBulk.set(ref, dataV3)
            } else if (dataV2.type === "payment") {
                console.log(`converting payment ${doc.id}`);
                const dataV3 = convertPaymentV2toV3(dataV2 as PaymentV2)
                const ref = groupsV3Collection.doc(groupId).collection("events").doc(doc.id)
                batchBulk.set(ref, dataV3)
            }
        }
        await batchBulk.commit()
        res.send()
    } catch (e) {
        handleError(e, res)
    }
})


export const migrateServicesV2toV3 = functions.https.onRequest(async (req, res) => {
    const batchBulk = new BatchInstance()
    try {
        const services = await servicesCollection.get()
        for (const doc of services.docs) {
            const event = doc.ref
            if (event.parent.parent?.parent?.id !== "groups-v3") {
                console.log(`parent id was ${event.parent.parent?.parent?.id}`);
                continue;
            }
            const groupId = event.parent.parent?.id
            if (!groupId) continue
            const dataV2 = doc.data() as ServiceV2
            const dataV3 = convertServiceV2toV3(dataV2)
            const ref = groupsV3Collection.doc(groupId).collection("services").doc(doc.id)
            batchBulk.set(ref, dataV3)
        }
        await batchBulk.commit()
        res.send()
    } catch (e) {
        handleError(e, res)
    }
})