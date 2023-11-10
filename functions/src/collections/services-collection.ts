import { Service } from "../interfaces/models/service";
import { groupCollection } from "./group-collection";
import * as firebase from "firebase-admin";

const serviceCollection = (groupId: string) => groupCollection.doc(groupId).collection("services-v2")
const servicesCollectionGroup = firebase.firestore().collectionGroup("services-v2")


interface ServiceWithGroupId {
    service: Service;
    groupId: string;
}

/**
 * Returns all services for all groups
 * @return {Promise<Service[]>}
 */
export async function getAllServices(): Promise<ServiceWithGroupId[]> {
    const query = await servicesCollectionGroup.get()
    if (query.empty) return []
    const currentServices = query.docs
        .filter((doc) => doc.ref.parent.parent?.parent.id === groupCollection.id)
    return currentServices.map((doc) => {
        return {
            service: doc.data(),
            groupId: doc.ref.parent.parent?.id ?? "services",
        } as ServiceWithGroupId
    })
}


/**
 * Adds a new service to the collection of group
 * @param {string} groupId group id of service
 * @param {Service} service service to be added
 * @return {Promise<Service>} Service with new ID
 */
export async function addService(groupId: string, service: Service): Promise<Service> {
    service.id = serviceCollection(groupId).doc().id
    await serviceCollection(groupId).doc(service.id).set(service)
    return service
}

/**
 * Get services of group
 * @param {string} groupId group id of services
 * @return {Promise<Service[]>} services of group
 */
export async function getServicesForGroup(groupId: string): Promise<Service[]> {
    const query = await serviceCollection(groupId).get()
    const services: Service[] = query.docs.map((doc) => doc.data() as Service)
    return services
}

/**
 * update service
 * @param {string} groupId group id of service
 * @param {Service} service service to update
 */
export async function updateService(groupId: string, service: Service) {
    await serviceCollection(groupId).doc(service.id).set(service)
}

/**
 * Delete service
 * @param {string} groupId group id of service to delete
 * @param {string} serviceId service to delete
 */
export async function deleteService(groupId: string, serviceId: string) {
    await serviceCollection(groupId).doc(serviceId).delete()
}
