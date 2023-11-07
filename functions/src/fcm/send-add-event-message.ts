import { ExpenseEventDTO } from "../interfaces/dto/event-dto";
import { getUserById } from "../collections/user-collection";
import { Group } from "../interfaces/models/group";
import { getTopicForUser } from "./topics";
import sendNotification from "./send-notification";
import { NotificationData } from "./types";

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

    const userTopics = group.people.map((uid) => getTopicForUser(uid))
    const promises = userTopics.map((topic) => {
        const data: NotificationData = {
            type: "group",
            groupId: group.id,
            eventId: event.id,
        }
        return sendNotification(topic, title, body, data)
    })
    await Promise.all(promises);
}