import { Group } from "../interfaces/models/group";
import { ServiceDTO } from "../interfaces/dto/service-dto";
import sendNotification from "./send-notification";
import { getTopicForUser } from "./topics";
import { NotificationData } from "./types";

/**
 * Send a new notification to group members
 * @param {string} uid uid of user who created the service
 * @param {Group} group of group
 * @param {ServiceDTO} service
 */
export default async function sendServiceAddedNotification(
    uid: string, group: Group, service: ServiceDTO) {

    const title = `${service.createdBy.name} added a new service to ${group.name}`
    const body = service.name === "" ? "" : service.name
    const topic = getTopicForUser(uid)

    const data: NotificationData = {
        type: "group",
        groupId: group.id,
    }

    await sendNotification(topic, title, body, data)
}