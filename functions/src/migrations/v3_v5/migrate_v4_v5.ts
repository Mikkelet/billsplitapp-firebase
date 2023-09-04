import * as firebase from "firebase-admin";

import * as functions from "firebase-functions";
import BatchInstance from "../../utils/batch_helper";
import { handleError } from "../../utils/error-utils";
import logRequest from "../../utils/log-utils";
import { EventV4 } from "../models/event_v4";
import { convertEventV4ToV5 } from "./convert_events_v4_v5";
import { convertGroupV4toV5 } from "./convert_group_v4_v5";
import { GroupV4 } from "../models/group_v4";

const firestore = firebase.firestore()
const groupsV3Collection = firestore.collection("groups-backup2")
const groupsV5collection = firestore.collection("groups-v5")
const eventsCollection = firestore.collectionGroup("events")
const servicesCollection = firestore.collectionGroup("services")

/**
 * migrates events to V5
 */
async function migrateEventsV3toV5() {
    console.log("Migrating events...");

    const batchBulk = new BatchInstance()

    const eventsRequest = await eventsCollection.get()
    for (const doc of eventsRequest.docs) {
        const event = doc.ref
        const groupCollectionId = event.parent.parent?.parent?.id
        const groupId = event.parent.parent?.id
        if (!groupId) continue
        if (groupCollectionId !== groupsV3Collection.id) {
            continue;
        }
        const ref = groupsV5collection.doc(groupId).collection("events").doc(doc.id)
        console.log("Converting event, id="+doc.id);
        
        const eventV5 = convertEventV4ToV5(doc.data() as EventV4)
        batchBulk.set(ref, eventV5)
    }
    await batchBulk.commit()
}

/**
 * Migrates services to v5
 */
async function migrateServicesV4toV5() {
    console.log("Migrating services...");

    const batchBulk = new BatchInstance()

    const services = await servicesCollection.get()
    for (const doc of services.docs) {
        const service = doc.ref
        const groupCollectionId = service.parent.parent?.parent?.id
        const groupId = service.parent.parent?.id
        if (!groupId) continue
        if (groupCollectionId !== groupsV3Collection.id) {
            continue;
        }
        const ref = groupsV5collection.doc(groupId).collection("services").doc(doc.id)
        batchBulk.set(ref, doc.data())
    }
    await batchBulk.commit()
}

/**
 * Migrates groups to v5
 */
async function migrateGroupV4toV5() {
    console.log("Migrating groups...");
    const batchBulk = new BatchInstance()
    const groupsRequest = await groupsV3Collection.get()
    for (const doc of groupsRequest.docs) {
        const dataV3 = doc.data() as GroupV4
        console.log("converting group id="+doc.id);

        const dataV5 = convertGroupV4toV5(dataV3)
        const ref = groupsV5collection.doc(doc.id)
        batchBulk.set(ref, dataV5)
    }
    await batchBulk.commit()
}


export const migrateV4toV5 = functions.https.onRequest(async (req, res) => {
    logRequest(req)
    try {
        await migrateGroupV4toV5()
        await migrateEventsV3toV5()
        await migrateServicesV4toV5()
        res.send()
    } catch (e) {
        handleError(e, res)
    }
})