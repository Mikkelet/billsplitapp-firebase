import { Group } from "../../interfaces/models/group";
import { Service } from "../../interfaces/models/service";
import { handleError } from "../../utils/error-utils";
import { DatabaseMigratorV2 } from "../migrator_v2";
import { EventV6 } from "../models/event/event_v6";
import { convertEventV6ToV7 } from "./convert_event_v6_v7";
import { Event } from "../../interfaces/models/events";
import { Response } from "express"

/**
 * Migrate database V5 to V6
 */
class MigrateV7V8 extends DatabaseMigratorV2<Group, Group, EventV6, Event, Service, Service> {

    /**
     * new instance
     * @param {number} limit
     */
    constructor(limit = 9999) {
        super({
            oldGroupCollection: "groups-v8",
            newGroupCollection: "groups-v8",
            oldEventsCollection: "events-v6",
            newEventsCollection: "events-v7",
            oldServicesCollection: "services-v2",
            newServicesCollection: "services-v2",
            limit: limit,
        })
    }

    /**
     * Migrate groups
     * @param {GroupV7} group
     * @return {Group}
     */
    convertGroup(group: Group): Group {
        return group
    }

    /**
     * Migrate events
     * @param {Event} event migrate events
     * @return {Event}
     */
    convertEvent(event: EventV6): Event {
        return convertEventV6ToV7(event)
    }

    /**
     * migrate services
     * @param {Service} service
     * @return {Service}
     */
    convertService(service: Service): Service {
        return service
    }
}

export const migrateV7toV8 = async (res: Response) => {
    try {
        const migrator = new MigrateV7V8()
        await migrator.migrate();
        res.send("OK")
    } catch (e) {
        handleError(e, res)
    }
}