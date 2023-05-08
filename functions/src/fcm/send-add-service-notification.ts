import * as firebase from "firebase-admin";
import { MessagingPayload } from "firebase-admin/lib/messaging/messaging-api";
import { Group } from "../interfaces/models/group";
import { getTopicForNewService } from "./topics";
import { ServiceDTO } from "../interfaces/dto/service-dto";

/**
 * Send a new notification to group members
 * @param {Group} group of group
 * @param {ServiceDTO} service
 */
export default async function sendServiceAddedNotification(group: Group, service: ServiceDTO) {

    const title = `${service.createdBy.name} added a new service to ${group.name}`
    const body = service.name === "" ? "" : service.name
    const topic = getTopicForNewService(group.id)

    const payload: MessagingPayload = {
        data: {
            groupId: group.id,
            serviceId: service.id,
            topic: topic,
        },
        notification: {
            title: title,
            body: body,
            clickAction: "FLUTTER_NOTIFICATION_CLICK",
        },
    }

    await firebase.messaging().sendToTopic(topic, payload, { contentAvailable: true })
}