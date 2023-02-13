import { Service } from "../interfaces/models/service";
import { groupCollection } from "./group-collection";
import * as firebase from "firebase-admin";


const serviceCollection = (groupId: string) => groupCollection.doc(groupId).collection("services")
const servicesCollectionGroup = firebase.firestore().collectionGroup("services")

/**
 * Returns all services for all groups
 * @return {Promise<Service[]>}
 */
export async function getAllServices(): Promise<Service[]> {
    const query = await servicesCollectionGroup.get()
    if (query.empty) return []
    return query.docs.map((doc) => doc.data() as Service)

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
export async function getServicesForGrouo(groupId: string): Promise<Service[]> {
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
 * @param {Service} service service to delete
 */
export async function deleteService(groupId: string, service: Service) {
    await serviceCollection(groupId).doc(service.id).delete()
}
