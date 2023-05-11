import { DataMessagePayload } from "firebase-admin/lib/messaging/messaging-api";
import { PaymentEventDTO } from "../interfaces/dto/event-dto";
import { Group } from "../interfaces/models/group";
import sendNotification from "./send-notification";


export default async function sendPaymentNotification(group: Group, payment: PaymentEventDTO) {

    console.log(`sending notification to user-${payment.paidTo.id}`);
    
    const title = `${payment.createdBy.name} marked a payment to you in ${group.name}`
    const body = `$${payment.amount}`
    const topic = `user-${payment.paidTo.id}`

    const data: DataMessagePayload = {
        groupId: group.id,
        topic: topic,
    }

    await sendNotification(topic, title, body, data)
}
