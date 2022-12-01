import * as firebase from "firebase-admin";
import { Friend, FriendStatus } from "../interfaces/models/friend";

const firestore = firebase.firestore();
const friendsCollection = firestore.collection("friends");

/**
 * Add friend to the friends collection
 * @param {Friend} friend friend to be added
 */
export async function addFriend(friend: Friend): Promise<void> {
    friend.id = friendsCollection.doc().id
    await friendsCollection.doc(friend.id).set(friend);
}

/**
 * Get friend status for two users
 * @param {string} user1 id of user 1
 * @param {string} user2 id of user 2
 * @return {Friend | null} a friend object with the two users or null if the two users are not friends (or requested to be) and a friend
 */
export async function getFriendship(user1: string, user2: string): Promise<Friend | null> {
    const response = await friendsCollection
        .where("users", "==", [user1, user2])
        .get()
    if (response.empty) return null;
    else return response.docs.map((doc) => doc.data() as Friend)[0];
}

/**
 * Update status of friendship
 * @param {string} docId of friend doc
 * @param {FriendStatus} status to be updated
 */
export async function updateFriendStatus(docId: string, status: FriendStatus): Promise<void> {
    await friendsCollection.doc(docId).update({
        status: status,
    })
}
