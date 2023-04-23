import * as functions from "firebase-functions";
import { insertEvent } from "../collections/events-collection";
import { getAllServices } from "../collections/services-collection";
import { ExpenseEvent } from "../interfaces/models/events";
import { IndividualExpense } from "../interfaces/models/individual-expense";

export const scheduledServicesImpl = async (_: functions.EventContext) => {
    const services = await getAllServices()
    try {
        for await (const service of services) {
            const individualExpenses: IndividualExpense[] = service.participants.map((uid) => {
                return {
                    expense: 0,
                    isParticipant: true,
                    person: uid,
                }
            })
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
                individualExpenses: individualExpenses,
                timeStamp: Date.now(),
                type: "expense",
            }

            await insertEvent(service.groupId, expense)
        }
    } catch (e) {
        console.error("Failed to run cron job", e)
    }
}