import * as functions from "firebase-functions";
import { Request, Response } from "firebase-functions";
import { insertEvent } from "../collections/events-collection";
import { getAllServices } from "../collections/services-collection";
import { ExpenseEvent } from "../interfaces/models/events";
import { getCurrencies } from "../collections/currenciesCollecttion";
import { updateGroupLastUpdated } from "../collections/group-collection";

const scheduledServicesImpl = async (_: functions.EventContext) => {
    await runServices()
}

// For local testing ONLY, do NOT deploy
export const runServicesImpl = async (req: Request, res: Response) => {
    if (req.hostname.includes("localhost")) {
        await runServices()
        res.send()
    } else {
        res.status(500).send("Cannot run on remote env")
    }
}

/**
 * Run all services
 */
async function runServices() {
    console.log("Starting services cron job");
    try {
        const currencies = await getCurrencies();
        const rates = new Map(Object.entries(currencies))
        const servicesWithGroupId = await getAllServices()
        console.log(`Running ${servicesWithGroupId.length} services`);
        for await (const serviceWithGroupId of servicesWithGroupId) {
            const service = serviceWithGroupId.service
            const groupId = serviceWithGroupId.groupId

            console.log({
                groupId: groupId,
                service: service,
            });

            const rateSnapshot = rates.get(service.currency.toUpperCase());
            if (rateSnapshot === undefined) {
                console.error("Rate lookup failed", {
                    currency: service.currency,
                });
                continue;
            }

            const date = new Date();
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
                date: date.toISOString(),
                tempParticipants: [],
                receiptImageUrl: "",
                currency: { symbol: service.currency, rateSnapshot: rateSnapshot },
                timestamp: Date.now(),
                type: "expense",
            }

            await updateGroupLastUpdated(groupId)
            await insertEvent(groupId, expense)
        }
        console.log("service events added", { services: servicesWithGroupId.length });
    } catch (e) {
        console.error("Failed to run cron job", e)
    }
}

export default scheduledServicesImpl