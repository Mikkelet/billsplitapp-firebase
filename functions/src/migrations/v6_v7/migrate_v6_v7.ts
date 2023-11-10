import { Event } from "../../interfaces/models/events";
import { Group } from "../../interfaces/models/group";
import { Service } from "../../interfaces/models/service";
import logRequest from "../../utils/log-utils";
import { handleError } from "../../utils/error-utils";
import * as functions from "firebase-functions";
import { EventV5 } from "../models/event/event_v5";
import { convertEventV5ToV6 } from "./convert_event_v5_v6";
import { convertGroupV7V8 } from "./convert_group_v7_v8";
import { GroupV7 } from "../models/group/group_v7";
import { DatabaseMigratorV2 } from "../migrator_v2";

/**
 * Migrate database V5 to V6
 */
class MigrateV6V7 extends DatabaseMigratorV2<GroupV7, Group, EventV5, Event, Service, Service> {

    /**
     * new instance
     */
    constructor() {
        super({
            oldGroupCollection: "groups-v7",
            newGroupCollection: "groups-v8",
            oldEventsCollection: "events",
            newEventsCollection: "events-v6",
            oldServicesCollection: "services",
            newServicesCollection: "services-v2",
        })
    }

    /**
     * Migrate groups
     * @param {GroupV7} group
     * @return {Group}
     */
    convertGroup(group: GroupV7): Group {
        return convertGroupV7V8(group);
    }

    /**
     * Migrate events
     * @param {Event} event migrate events
     * @return {Event}
     */
    convertEvent(event: EventV5): Event {
        return convertEventV5ToV6(event)
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

export const migrateV6toV7 = functions.https.onRequest(async (req, res) => {
    logRequest(req)
    const migrator = new MigrateV6V7()
    try {
        await migrator.migrateGroups()
        await migrator.migrateEvents()
        await migrator.migrateServices()
        res.send("OK")
    } catch (e) {
        handleError(e, res)
    }
})