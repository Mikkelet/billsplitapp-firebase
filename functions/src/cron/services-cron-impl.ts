import * as functions from "firebase-functions";
import { insertEvent } from "../collections/events-collection";
import { getAllServices } from "../collections/services-collection";
import { ExpenseEvent } from "../interfaces/models/events";

const scheduledServicesImpl = async (_: functions.EventContext) => {
    console.log("Starting services cron job");
    try {
        const servicesWithGroupId = await getAllServices()
        for await (const serviceWithGroupId of servicesWithGroupId) {
            const service = serviceWithGroupId.service
            const groupId = serviceWithGroupId.groupId

            const expense: ExpenseEvent = {
                createdBy: service.createdBy,
                description: service.name,
                id: "",
                payee: service.payer,
                sharedExpenses: [{
                    description: service.name,
                    expense: service.monthlyExpense,
                    participants: service.participants,
                }],
                currency: { symbol: service.currency, rateSnapshot: 1 },
                timestamp: Date.now(),
                type: "expense",
            }

            await insertEvent(groupId, expense)
            console.log("services", { services: servicesWithGroupId.length });
        }
    } catch (e) {
        console.error("Failed to run cron job", e)
    }
}

export default scheduledServicesImpl