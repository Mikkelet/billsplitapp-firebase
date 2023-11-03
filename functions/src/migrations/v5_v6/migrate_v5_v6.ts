import { DatabaseMigrator } from "../migrator";
import { Event } from "../../interfaces/models/events";
import { GroupV6 } from "../models/group/group_v6";
import { Group } from "../../interfaces/models/group";
import { convertGroupV6toV7 } from "./convert_groups_v6_v7";
import { Service } from "../../interfaces/models/service";
import logRequest from "../../utils/log-utils";
import { handleError } from "../../utils/error-utils";
import * as functions from "firebase-functions";

/**
 * Migrate database V6 to V7
 */
class MigrateV6V7 extends DatabaseMigrator<GroupV6, Group, Event, Event, Service, Service> {

    /**
     * new instance
     */
    constructor() {
        super("groups-v6", "groups-v7")
    }

    /**
     * Migrate groups
     * @param {GroupV6} group
     * @return {Group}
     */
    convertGroup(group: GroupV6): Group {
        return convertGroupV6toV7(group)
    }

    /**
     * Migrate events
     * @param {Event} event migrate events
     * @return {Event}
     */
    convertEvent(event: Event): Event {
        return event
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

export const migrateV5toV6 = functions.https.onRequest(async (req, res) => {
    logRequest(req)
    const migrator = new MigrateV6V7()
    try {
        await migrator.migrateGroups(1)
        //  await migrator.migrateEvents()
        //  await migrator.migrateServices()
        res.send("OK")
    } catch (e) {
        handleError(e, res)
    }
})