import * as firebase from "firebase-admin";

import * as functions from "firebase-functions";
import BatchInstance from "../../utils/batch_helper";
import { handleError } from "../../utils/error-utils";

const firestore = firebase.firestore()
const groupsV3Collection = firestore.collection("groups-v4")
const groupsV3CollectionCopy = firestore.collection("groups-v4-copy")


export const copyGroupsCollection = functions.https.onRequest(async (req, res) => {
    const batchBulk = new BatchInstance()
    try {
        const groupsRequest = await groupsV3Collection.get()
        for (const doc of groupsRequest.docs) {
            const ref = groupsV3CollectionCopy.doc(doc.id)
            batchBulk.set(ref, doc.data())
        }

        await batchBulk.commit()
        res.send()
    } catch (e) {
        handleError(e, res)
    }
})