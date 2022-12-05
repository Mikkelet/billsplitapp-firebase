import Person from "../models/person";

export interface PersonDTO {
    id: string;
    name: string;
    pfpUrl: string;
}

/**
 * Converts Person to PersonDTO
 * @param {Person} person person to convert
 * @return {PersonDTO} personDTO
 */
export function convertPersonToDTO(person: Person): PersonDTO {
    return {
        id: person.id,
        name: person.name,
        pfpUrl: person.pfpUrl,
    } as PersonDTO
}