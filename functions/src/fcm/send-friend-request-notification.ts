import { DataMessagePayload } from "firebase-admin/lib/messaging/messaging-api";
import sendNotification from "./send-notification";
import { getUserById } from "../collections/user-collection";
import { FriendStatus } from "../interfaces/models/friend";

/**
 * Send a notification for friend request
 * @param {string} sender uid of request sender
 * @param {string} receiver friend to receive notificaion
 * @param {FriendStatus} status friend status
 */
export default async function sendFriendRequestNotification(
    sender: string, receiver: string, status: FriendStatus) {

    const senderPerson = await getUserById(sender);
    const topic = `user-${receiver}`
    if (status === "pending") {
        const title = `${senderPerson?.name} sent you a friend request!`
        const data: DataMessagePayload = {
            topic: topic,
        }

        await sendNotification(topic, title, "", data)
    } else if (status === "accepted") {
        const title = `${senderPerson?.name} accepted your request!`
        const data: DataMessagePayload = {
            topic: topic,
        }

        await sendNotification(topic, title, "", data)
    }
}
