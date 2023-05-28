import { DataMessagePayload } from "firebase-admin/lib/messaging/messaging-api";
import { PaymentEventDTO } from "../interfaces/dto/event-dto";
import { Group } from "../interfaces/models/group";
import sendNotification from "./send-notification";
import { getTopicForUser } from "./topics";

/**
 * Send a payment notification
 * @param {Group} group group of payment
 * @param {PaymentEventDTO} payment payment
 */
export default async function sendPaymentNotification(group: Group, payment: PaymentEventDTO) {

    const title = `${payment.createdBy.name} marked a payment to you in ${group.name}`
    const body = `${payment.currency.symbol.toUpperCase()} ${payment.amount}`
    const topic = getTopicForUser(payment.paidTo.id)

    const data: DataMessagePayload = {
        groupId: group.id,
        topic: topic,
    }

    await sendNotification(topic, title, body, data)
}
