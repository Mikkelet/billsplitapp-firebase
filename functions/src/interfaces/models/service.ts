import { findPerson } from "../../collections/user-collection";
import { PersonDTO } from "../dto/person-dto";
import { ServiceDTO } from "../dto/service-dto";
import { PersonWithId } from "./person";

export interface Service {
    id: string,
    name: string,
    createdBy: string,
    imageUrl: string,
    monthlyExpense: number,
    currency: string,
    payer: string,
    participants: string[]
}

/**
 * Convert service to DTO
 * @param {Service} service service to convert
 * @param {PersonWithId[]} people people in group of service
 * @return {ServiceDTO} service as DTO
 */
export function convertServiceToDTO(service: Service, people: PersonWithId[]): ServiceDTO {
    const peopleDTOs: PersonDTO[] = service.participants
        .map((id) => findPerson(people, id) as PersonDTO)
    return {
        id: service.id,
        imageUrl: service.imageUrl,
        createdBy: findPerson(people, service.createdBy),
        monthlyExpense: service.monthlyExpense,
        currency: service.currency,
        name: service.name,
        participants: peopleDTOs,
        payer: findPerson(people, service.payer),
    }
}

/**
 * Convert DTO to Service
 * @param {ServiceDTO} service Convert DTO to service
 * @return {Service} Converted ServiceDTO
 */
export function convertDTOtoService(service: ServiceDTO): Service {
    const peopleIds = service.participants.map((dto) => dto.id)
    return {
        id: service.id,
        imageUrl: service.imageUrl,
        createdBy: service.createdBy.id,
        monthlyExpense: service.monthlyExpense,
        currency: service.currency,
        name: service.name,
        participants: peopleIds,
        payer: service.payer.id,
    }
}