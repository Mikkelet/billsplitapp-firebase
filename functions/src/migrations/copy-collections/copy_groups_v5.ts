import * as firebase from "firebase-admin";

import * as functions from "firebase-functions";
import BatchInstance from "../../utils/batch_helper";
import { handleError } from "../../utils/error-utils";
import logRequest from "../../utils/log-utils";

const firestore = firebase.firestore()
const groupsV4Collection = firestore.collection("groups-v4")
const backupGroupsCollection = firestore.collection("groups-backup2")
const servicesCollection = firestore.collectionGroup("services")
const eventsCollection = firestore.collectionGroup("events")

/**
 * Backup groups
 */
async function backupGroups(): Promise<Set<string>> {
    console.log("Backing up groups...");
    const ids: string[] = []

    const batchBulk = new BatchInstance()
    const groupsRequest = await groupsV4Collection.get()
    for (const doc of groupsRequest.docs) {
        const ref = backupGroupsCollection.doc(doc.id)
        ids.push(ref.id)
        batchBulk.set(ref, doc.data())
    }

    await batchBulk.commit()
    return new Set(ids)
}

/**
 * Backup events
 * @param {Set<string>} groupIds list of valid group ids
 */
async function backupEvents(groupIds: Set<string>) {
    console.log("Backing up events...");

    const batchBulk = new BatchInstance()

    const services = await eventsCollection.get()
    for (const doc of services.docs) {
        const event = doc.ref
        const groupId = event.parent?.parent?.id
        const groupCollectionName = event.parent?.parent?.parent.id

        if (groupId !== undefined && !groupIds.has(groupId)) continue
        if (!groupId) continue
        if (groupCollectionName !== groupsV4Collection.id) {
            continue
        }

        const ref = backupGroupsCollection.doc(groupId).collection("events").doc(doc.id)
        batchBulk.set(ref, doc.data())
    }

    await batchBulk.commit()
}

/**
 * Backup services
 * @param {Set<string>} groupIds list of valid group ids
 */
async function backupServices(groupIds: Set<string>) {
    console.log("Backing up services...");

    const batchBulk = new BatchInstance()

    const services = await servicesCollection.get()
    for (const doc of services.docs) {
        const service = doc.ref
        const groupId = service.parent.parent?.id
        const groupCollectionName = service.parent?.parent?.parent.id

        if (groupId !== undefined && !groupIds.has(groupId)) continue
        if (!groupId) continue
        if (groupCollectionName !== groupsV4Collection.id) {
            continue
        }

        const ref = backupGroupsCollection.doc(groupId).collection("services").doc(doc.id)
        batchBulk.set(ref, doc.data())
    }

    await batchBulk.commit()
}

export const backupDatabase = functions.https.onRequest(async (req, res) => {
    logRequest(req)
    try {
        const groupIds = await backupGroups()
        await backupEvents(groupIds)
        await backupServices(groupIds)
        res.send()
    } catch (e) {
        handleError(e, res)
    }
})