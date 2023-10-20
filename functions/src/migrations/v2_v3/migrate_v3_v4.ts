import * as firebase from "firebase-admin";
import { handleError } from "../../utils/error-utils";
import * as functions from "firebase-functions";
import BatchInstance from "../../utils/batch_helper";
import { convertExpenseV2ToV3, convertPaymentV2toV3 } from "./convert_events_v2_v3";
import { convertServiceV2toV3 } from "./convert_services_v1_v2";
import { convertGroupV2toV3 } from "./convert_group_v2_v3";
import { GroupV2 } from "../models/group/group_v2";
import { ExpenseEventV2 } from "../models/expense/expense_v2";
import { EventV2 } from "../models/event/event_v2";
import { PaymentEventV2 } from "../models/payment/payment_v2";
import { ServiceV1 } from "../models/service/services_v1";

const firestore = firebase.firestore()
const oldGroupCollection = firestore.collection("groups-v3")
const newGroupCollection = firestore.collection("groups-v4")
const eventsCollection = firestore.collectionGroup("events")
const servicesCollection = firestore.collectionGroup("services")

export const migrateGroupsV2toV3 = functions.https.onRequest(async (req, res) => {
    const batchBulk = new BatchInstance()

    try {
        const groupsRequest = await oldGroupCollection.get()

        for (const doc of groupsRequest.docs) {
            const ref = newGroupCollection.doc(doc.id)
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
        eventloop: for (const doc of eventsRequest.docs) {
            const event = doc.ref
            if (event.parent.parent?.parent?.id !== oldGroupCollection.id) {
                console.log(`parent id was ${event.parent.parent?.parent?.id}`);
                continue eventloop;
            }

            const groupId = event.parent.parent?.id
            if (!groupId) continue

            const dataV2 = doc.data() as EventV2
            if (dataV2.type === "expense") {
                console.log(`converting expense ${doc.ref.path}`);
                const dataV3 = convertExpenseV2ToV3(dataV2 as ExpenseEventV2)
                const ref = newGroupCollection.doc(groupId).collection("events").doc(doc.id)
                batchBulk.set(ref, dataV3)
            } else if (dataV2.type === "payment") {
                console.log(`converting payment ${doc.id}`);
                const dataV3 = convertPaymentV2toV3(dataV2 as PaymentEventV2)
                const ref = newGroupCollection.doc(groupId).collection("events").doc(doc.id)
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
            const dataV2 = doc.data() as ServiceV1
            const dataV3 = convertServiceV2toV3(dataV2)
            const ref = newGroupCollection.doc(groupId).collection("services").doc(doc.id)
            batchBulk.set(ref, dataV3)
        }
        await batchBulk.commit()
        res.send()
    } catch (e) {
        handleError(e, res)
    }
})