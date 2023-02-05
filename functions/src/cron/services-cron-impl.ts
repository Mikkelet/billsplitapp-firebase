import * as functions from "firebase-functions";
import { addEvent } from "../collections/events-collection";
import { getAllServices } from "../collections/services-collection";
import { ExpenseEvent } from "../interfaces/models/events";
import { IndividualExpense } from "../interfaces/models/individual-expense";

export const scheduledServicesImpl = async (_: functions.EventContext) => {
    const services = await getAllServices()
    try {
        for await (const service of services) {
            const expenseDiv: number = service.monthlyExpense / service.participants.length
            const individualExpenses: IndividualExpense[] = service.participants.map((uid) => {
                return {
                    expense: expenseDiv,
                    isParticipant: true,
                    person: uid,
                }
            })
            const expense: ExpenseEvent = {
                createdBy: service.createdBy,
                description: "",
                id: "",
                payee: service.payer,
                sharedExpense: service.monthlyExpense,
                individualExpenses: individualExpenses,
                timeStamp: 0,
                type: "expense",
            }

            await addEvent(service.groupId, expense)
        }
    } catch (e) {
        console.error("Failed to run cron job", e)
    }
}