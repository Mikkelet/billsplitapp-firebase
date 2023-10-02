import { DataMessagePayload } from "firebase-admin/lib/messaging/messaging-api";
import { Group } from "../interfaces/models/group";
import { ServiceDTO } from "../interfaces/dto/service-dto";
import sendNotification from "./send-notification";
import { getTopicForUser } from "./topics";

/**
 * Send a new notification to group members
 * @param {Group} group of group
 * @param {ServiceDTO} service
 */
export default async function sendServiceAddedNotification(uid:string, group: Group, service: ServiceDTO) {

    const title = `${service.createdBy.name} added a new service to ${group.name}`
    const body = service.name === "" ? "" : service.name
    const topic = getTopicForUser(uid)

    const data: DataMessagePayload = {
        groupId: group.id,
        serviceId: service.id,
        topic: topic,
    }

    await sendNotification(topic, title, body, data)
}