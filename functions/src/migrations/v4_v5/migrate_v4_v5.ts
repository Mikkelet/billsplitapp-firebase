import * as firebase from "firebase-admin";

import * as functions from "firebase-functions";
import BatchInstance from "../../utils/batch_helper";
import { handleError } from "../../utils/error-utils";
import logRequest from "../../utils/log-utils";
import { convertEventV4ToV5 } from "./convert_event_v4_v5";
import { EventV4 } from "../models/event/event_v4";
import { convertGroupV5toV6 } from "./convert_group_v5_v6";
import { GroupV5 } from "../models/group/group_v5";

const firestore = firebase.firestore()
const oldGroupCollection = firestore.collection("groups-v5")
const newGroupCollection = firestore.collection("groups-v6")
const eventsCollection = firestore.collectionGroup("events")
const servicesCollection = firestore.collectionGroup("services")

/**
 * migrates events to V5
 */
async function migrateEvents() {
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
        const eventV5 = convertEventV4ToV5(doc.data() as EventV4)
        console.log("migrating event", doc.id);
        batchBulk.set(ref, eventV5)
    }
    await batchBulk.commit()
}

/**
 * Migrates services to v5
 */
async function migrateServices() {
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
async function migrateGroups() {
    console.log("Migrating groups...");
    const batchBulk = new BatchInstance()
    const groupsRequest = await oldGroupCollection.get()
    for (const doc of groupsRequest.docs) {
        const oldGroup = doc.data() as GroupV5
        console.log("converting group id=" + doc.id);

        const newGroup = convertGroupV5toV6(oldGroup)
        const ref = newGroupCollection.doc(doc.id)
        batchBulk.set(ref, newGroup)
    }
    await batchBulk.commit()
}


export const migrateV4toV5 = functions.https.onRequest(async (req, res) => {
    logRequest(req)
    try {
        await migrateGroups()
        await migrateEvents()
        await migrateServices()
        res.send("OK")
    } catch (e) {
        handleError(e, res)
    }
})