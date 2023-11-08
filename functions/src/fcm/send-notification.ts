import * as firebase from "firebase-admin";
import { AndroidConfig, AndroidNotification, ApnsConfig, TopicMessage }
    from "firebase-admin/lib/messaging/messaging-api"
import { NotificationType } from "./types";

/**
 * Send notification message to specified topic
 * @param {string} topic topic to send message to
 * @param {string} title title of message
 * @param {string} body body of message
 * @param {DataMessagePayload} data data of messsage
 */
export default async function sendNotification(
    topic: string,
    title: string,
    body: string,
    data: {
        type: NotificationType,
        [key: string]: string
    },
) {
    const apns: ApnsConfig = {
        payload: {
            aps: {
                alert: {
                    title: title,
                    body: body,
                },
                contentAvailable: true,
            },
        },
    }

    const androidNotification: AndroidNotification = {
        title: title,
        body: body,
        clickAction: "FLUTTER_NOTIFICATION_CLICK",
    }

    const android: AndroidConfig = {
        data: data,
        notification: androidNotification,
    }

    const payload: TopicMessage = {
        topic: topic,
        apns: apns,
        android: android,
        data: data,
    }
    try {

        await firebase.messaging().send(payload)
        console.log("Notification sent", payload);
    } catch (e) {
        console.log("Failed to send notification", e, payload);
    }
}