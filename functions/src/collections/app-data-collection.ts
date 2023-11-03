import * as firebase from "firebase-admin";
import { AppVersion } from "../interfaces/models/app-version";

const firestore = firebase.firestore();
const appDataCollection = firestore.collection("app-data");
export const appVersionDoc = appDataCollection.doc("app-version")

/**
 * Queries the appversion document
 * @return {Promise<AppVersion>} Appversion
 */
export async function getAppVersion() : Promise<AppVersion> {
    const response = await appVersionDoc.get()
    const appData = response.data() as AppVersion
    return appData
}