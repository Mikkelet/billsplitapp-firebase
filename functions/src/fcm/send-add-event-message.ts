import * as firebase from "firebase-admin";
import { MessagingPayload } from "firebase-admin/lib/messaging/messaging-api";
import { EventDTO } from "../interfaces/dto/event-dto";

/**
 * Send a new notification to group members
 * @param {string} groupId
 * @param {EventDTO} event
 */
export default async function sendEventAddedNotification(groupId: string, event: EventDTO) {

    let title = "New expense"
    let body = `${event.createdBy.name} added a new expense`
    if (event.id !== "") {
        title = "Expense updated"
        body = `${event.createdBy.name} updated an expense`
    }

    const payload: MessagingPayload = {
        data: {
            groupId: groupId,
            eventId: event.id,
        },
        notification: {
            title: title,
            body: body,
            clickAction: "FLUTTER_NOTIFICATION_CLICK",
        },
    }
    await firebase.messaging().sendToTopic(`group-${groupId}`, payload, { contentAvailable: true })
}