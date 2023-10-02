import { DataMessagePayload } from "firebase-admin/lib/messaging/messaging-api";
import sendNotification from "./send-notification";
import { getUserById } from "../collections/user-collection";
import { FriendStatus } from "../interfaces/models/friend";
import { getTopicForUser } from "./topics";

/**
 * Send a notification for friend request
 * @param {string} uid uid of request sender
 * @param {string} friendUid uid of friend to receive notificaion
 * @param {FriendStatus} status friend status
 */
export default async function sendFriendRequestNotification(
    uid: string, friendUid: string, status: FriendStatus) {

    const senderPerson = await getUserById(uid);
    const senderName = senderPerson?.name ?? "A user"
    const topic = getTopicForUser(friendUid)
    if (status === "pending") {
        const title = `${senderName} sent you a friend request!`
        const data: DataMessagePayload = {
            topic: topic,
        }

        await sendNotification(topic, title, "", data)
    } else if (status === "accepted") {
        const title = `${senderName} accepted your request!`
        const data: DataMessagePayload = {
            topic: topic,
        }

        await sendNotification(topic, title, "", data)
    }
}
