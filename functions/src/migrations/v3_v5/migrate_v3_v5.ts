import * as firebase from "firebase-admin";

import * as functions from "firebase-functions";
import BatchInstance from "../../utils/batch_helper";
import { handleError } from "../../utils/error-utils";
import { convertGroupV3toV5 } from "./convert_group_v3_v5";
import { GroupV3 } from "../models/group_v3";

const firestore = firebase.firestore()
const groupsV3Collection = firestore.collection("groups-v4-copy")
const groupsV5collection = firestore.collection("groups-v5")
const eventsCollection = firestore.collectionGroup("events")
const servicesCollection = firestore.collectionGroup("services")


export const migrateEventsV3toV5 = functions.https.onRequest(async (req, res) => {
    const batchBulk = new BatchInstance()

    try {
        const eventsRequest = await eventsCollection.get()
        eventloop: for (const doc of eventsRequest.docs) {
            const event = doc.ref
            if (event.parent.parent?.parent?.id !== "groups-v4") {
                console.log(`parent id was ${event.parent.parent?.parent?.id}`);
                continue eventloop;
            }
            const groupId = event.parent.parent?.id
            if (!groupId) continue
            const ref = groupsV5collection.doc(groupId).collection("events").doc(doc.id)
            batchBulk.set(ref, doc.data())
        }

        await batchBulk.commit()
        res.send()
    } catch (e) {
        handleError(e, res)
    }
})

export const migrateServicesV3toV5 = functions.https.onRequest(async (req, res) => {
    const batchBulk = new BatchInstance()
    try {
        const services = await servicesCollection.get()
        for (const doc of services.docs) {
            const event = doc.ref
            if (event.parent.parent?.parent?.id !== "groups-v4") {
                console.log(`parent id was ${event.parent.parent?.parent?.id}`);
                continue;
            }
            const groupId = event.parent.parent?.id
            if (!groupId) continue
            const ref = groupsV5collection.doc(groupId).collection("services").doc(doc.id)
            batchBulk.set(ref, doc.data())
        }
        await batchBulk.commit()
        res.send()
    } catch (e) {
        handleError(e, res)
    }
})

export const migrateGroupV3toV5 = functions.https.onRequest(async (req, res) => {
    const batchBulk = new BatchInstance()
    try {
        const groupsRequest = await groupsV3Collection.get()
        for (const doc of groupsRequest.docs) {
            const dataV3 = doc.data() as GroupV3
            const dataV5 = convertGroupV3toV5(dataV3)
            const ref = groupsV5collection.doc(doc.id)
            batchBulk.set(ref, dataV5)
        }

        await batchBulk.commit()
        res.send()
    } catch (e) {
        handleError(e, res)
    }
})