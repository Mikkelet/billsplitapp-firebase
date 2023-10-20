import * as firebase from "firebase-admin";

import * as functions from "firebase-functions";
import BatchInstance from "../../utils/batch_helper";
import { handleError } from "../../utils/error-utils";
import logRequest from "../../utils/log-utils";
import { convertGroupV4toV5 } from "./convert_group_v4_v5";
import { GroupV4 } from "../models/group/group_v4";
import { EventV3 } from "../models/event/event_v3";
import { convertEventV3ToV4 } from "./convert_events_v3_v4";

const firestore = firebase.firestore()
const oldGroupCollection = firestore.collection("groups-v4")
const newGroupCollection = firestore.collection("groups-v5")
const eventsCollection = firestore.collectionGroup("events")
const servicesCollection = firestore.collectionGroup("services")

/**
 * migrates events to V5
 */
async function migrateEventsV3toV4() {
    console.log("Migrating events...");

    const batchBulk = new BatchInstance()

    const eventsRequest = await eventsCollection.get()
    for (const doc of eventsRequest.docs) {
        const event = doc.ref
        const groupCollectionId = event.parent.parent?.parent?.id
        const groupId = event.parent.parent?.id
        if (!groupId) {
            continue;
        }
        if (groupCollectionId !== oldGroupCollection.id) {
            continue;
        }


        const ref = newGroupCollection.doc(groupId).collection("events").doc(doc.id)
        const eventV5 = convertEventV3ToV4(doc.data() as EventV3)
        console.log("migrating event", doc.id);
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
        if (groupCollectionId !== oldGroupCollection.id) {
            continue;
        }
        const ref = newGroupCollection.doc(groupId).collection("services").doc(doc.id)
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
    const groupsRequest = await oldGroupCollection.get()
    for (const doc of groupsRequest.docs) {
        const dataV3 = doc.data() as GroupV4
        console.log("converting group id=" + doc.id);

        const dataV5 = convertGroupV4toV5(dataV3)
        const ref = newGroupCollection.doc(doc.id)
        batchBulk.set(ref, dataV5)
    }
    await batchBulk.commit()
}


export const migrateV4toV5 = functions.https.onRequest(async (req, res) => {
    logRequest(req)
    try {
        await migrateGroupV4toV5()
        await migrateEventsV3toV4()
        await migrateServicesV4toV5()
        res.send()
    } catch (e) {
        handleError(e, res)
    }
})