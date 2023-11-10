import BatchInstance from "../utils/batch_helper";
import * as firebase from "firebase-admin";
const firestore = firebase.firestore()

/**
 * Abstract class for database migration
 */
export abstract class DatabaseMigratorV2<G1, G2, E1, E2, S1, S2> {

    readonly oldGroupCollection: string
    readonly newGroupCollection: string
    readonly oldEventsCollection: string
    readonly newEventsCollection: string
    readonly oldServicesCollection: string
    readonly newServicesCollection: string

    /**
     * New instance
     * @param {params} params params
     */
    constructor(params: {
        oldGroupCollection: string,
        newGroupCollection: string,
        oldEventsCollection: string,
        newEventsCollection: string,
        oldServicesCollection: string,
        newServicesCollection: string,
    }) {
        this.oldGroupCollection = params.oldGroupCollection
        this.newGroupCollection = params.newGroupCollection
        this.oldEventsCollection = params.oldEventsCollection
        this.newEventsCollection = params.newEventsCollection
        this.oldServicesCollection = params.oldServicesCollection
        this.newServicesCollection = params.newServicesCollection
    }

    /**
     * Converter function for groups
     * @param {OldGroup} group to be migrated
     * @return {NewGroup} migrated group
     */
    protected abstract convertGroup(group: G1): G2

    /**
     * Converter for events
     * @param {OldEvent} event event to be migrated
     * @return {NewEvent} migrated event
     */
    protected abstract convertEvent(event: E1): E2

    /**
     * Converter for services
     * @param {OldService} service service to be migrated
     * @return {NewService} migrated service
     */
    protected abstract convertService(service: S1): S2

    /**
     * Migrate groups
     * @param {number} limit limits docs that are migrated for debug purposes
     */
    async migrateGroups(limit = 9999) {
        const batchBulk = new BatchInstance()
        const groupsRequest = await firestore
            .collectionGroup(this.oldGroupCollection)
            .limit(limit)
            .get()
        console.log(`Migrating ${limit} groups...`);
        for (const doc of groupsRequest.docs) {
            const oldGroup = doc.data() as G1
            const newGroup = this.convertGroup(oldGroup) as G2
            const ref = firestore
                .collection(this.newGroupCollection)
                .doc(doc.id)
            batchBulk.set(ref, newGroup)
        }
        await batchBulk.commit()
    }

    /**
     * Migrate events
     * @param {number} limit limits docs that are migrated for debug purposes
     */
    async migrateEvents(limit = 9999) {
        console.log(`Migrating ${limit} events`);
        const batchBulk = new BatchInstance()

        const eventsRequest = await firestore
            .collectionGroup(this.oldEventsCollection)
            .get()
        let counter = 0
        for (const doc of eventsRequest.docs) {
            const event = doc.ref
            const groupId = event.parent.parent?.id
            if (!this.isDocInOldGroupCollection(event)) continue;
            if (counter >= limit) break;

            const ref = firestore
                .collection(this.newGroupCollection)
                .doc(groupId!)
                .collection(this.newEventsCollection)
                .doc(doc.id)
            const migratedEvent = this.convertEvent(doc.data() as E1) as E2
            batchBulk.set(ref, migratedEvent)
            counter++
        }
        await batchBulk.commit()
    }

    /**
     * Migrate services
     */
    async migrateServices() {
        console.log("Migrating services...");
        const batchBulk = new BatchInstance()

        const services = await firestore
            .collectionGroup(this.oldServicesCollection)
            .get()
        for (const doc of services.docs) {
            const service = doc.ref
            const groupId = service.parent.parent?.id
            if (!this.isDocInOldGroupCollection(service)) continue;

            const ref = firestore
                .collection(this.newGroupCollection)
                .doc(groupId!)
                .collection(this.newServicesCollection)
                .doc(doc.id)
            const migratedService = this.convertService(doc.data() as S1) as S2
            batchBulk.set(ref, migratedService)
        }
        await batchBulk.commit()
    }

    /**
     * Checks if doc parent group collection is equal to the specified migrated collection
     * @param {firebase.firestore.DocumentReference} docRef
     * @return {boolean} returns if doc's parent group collection is correct
     */
    private isDocInOldGroupCollection(docRef: firebase.firestore.DocumentReference): boolean {
        const docParentGroupId = docRef.parent.parent?.parent?.id
        const groupId = docRef.parent.parent?.id
        const oldGroupCollectionId = this.oldGroupCollection

        if (!groupId) return false
        if (docParentGroupId !== oldGroupCollectionId) return false
        return true

    }
}