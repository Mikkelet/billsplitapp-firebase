import * as functions from "firebase-functions";
import { insertEvent } from "../collections/events-collection";
import { getAllServices } from "../collections/services-collection";
import { ExpenseEvent } from "../interfaces/models/events";
import { getCurrencies } from "../collections/currenciesCollecttion";

const scheduledServicesImpl = async (_: functions.EventContext) => {
    console.log("Starting services cron job");
    try {
        const currencies = await getCurrencies();
        const servicesWithGroupId = await getAllServices()
        for await (const serviceWithGroupId of servicesWithGroupId) {
            const service = serviceWithGroupId.service
            const groupId = serviceWithGroupId.groupId

            console.log({
                groupId: groupId,
                service: service,
            });

            const rateSnapshot = currencies.get(service.currency.toUpperCase());
            if (rateSnapshot === undefined) {
                console.error("Rate lookup failed", {
                    currency: service.currency,
                });
                continue;
            }

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
                tempParticipants: [],
                receiptImageUrl: "",
                currency: { symbol: service.currency, rateSnapshot: rateSnapshot },
                timestamp: Date.now(),
                type: "expense",
            }

            await insertEvent(groupId, expense)
        }
        console.log("service events added", { services: servicesWithGroupId.length });
    } catch (e) {
        console.error("Failed to run cron job", e)
    }
}

export default scheduledServicesImpl