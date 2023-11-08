import * as firebase from "firebase-admin";
import { Friend, FriendStatus } from "../interfaces/models/friend";

const firestore = firebase.firestore();
const friendsCollection = firestore.collection("friends");

/**
 * Add friend to the friends collection
 * @param {Friend} friend friend to be added
 */
export async function addFriend(friend: Friend): Promise<Friend> {
    friend.id = `${friend.users[0]}-${friend.users[1]}`;
    await friendsCollection.doc(friend.id).set(friend);
    return friend;
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

/**
 * Queries a list of friends for user
 * @param {string} uid id of user
 * @return {Friend[]} list of friends for user
 */
export async function getFriends(uid: string): Promise<Friend[]> {
    const response = await friendsCollection.where("users", "array-contains", uid).get()
    if (response.empty) {
        return [];
    } else {
        return response.docs.map((doc) => doc.data() as Friend);
    }
}

/**
 * Remove request
 * @param {string} requestId id of friend request
 */
export async function removeFriendRequest(requestId: string) {
    await friendsCollection.doc(requestId).delete()
}