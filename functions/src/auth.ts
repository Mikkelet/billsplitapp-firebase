import * as firebase from "firebase-admin";

/**
 * Verifies user submitted token
 * @param {string} token token to verify
 * @return {Promise<string | null>} returns uid if success or null if failed
 */
export async function verifyUser(token: string | undefined): Promise<string | null> {
    if (token === undefined) return null;
    try {
        const result = await firebase.auth().verifyIdToken(token);
        return result.uid;
    } catch (e) {
        console.log(e);
        return null;
    }
}