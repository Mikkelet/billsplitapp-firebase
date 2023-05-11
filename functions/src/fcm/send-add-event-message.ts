import { ExpenseEventDTO } from "../interfaces/dto/event-dto";
import { getUserById } from "../collections/user-collection";
import { Group } from "../interfaces/models/group";
import { getTopicForNewExpense, getTopicForUpdateExpense } from "./topics";
import sendNotification from "./send-notification";
import { DataMessagePayload } from "firebase-admin/lib/messaging/messaging-api";

/**
 * Send a new notification to group members
 * @param {string} uid user uid who submitted the event
 * @param {Group} group of group
 * @param {ExpenseEventDTO} event
 */
export default async function sendEventAddedNotification(
    uid: string, group: Group, event: ExpenseEventDTO) {

    let title = `${event.createdBy.name} added a new expense to ${group.name}`
    let body = event.description === "" ? "" : event.description
    if (event.id !== "") {
        const user = await getUserById(uid);
        title = "Expense updated"
        body = `${user?.name} updated an expense in ${group.name}`
    }

    let topic = ""
    if (event.id === "") {
        topic = getTopicForNewExpense(group.id)
    } else {
        topic = getTopicForUpdateExpense(group.id)
    }

    const data: DataMessagePayload = {
        groupId: group.id,
        eventId: event.id,
        topic: topic,
    }

    await sendNotification(topic, title, body, data)
}