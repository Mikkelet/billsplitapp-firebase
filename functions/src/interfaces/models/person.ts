import { PersonDTO } from "../dto/person-dto";

export type PersonWithId = Person | PersonDTO

export interface Person {
    id: string;
    name: string;
    pfpUrl: string;
    email: string;
}

/**
 * Converts PersonDTO to Person
 * @param {PersonDTO} personDto dto to convert
 * @return {Person} personD
 */
export function convertDTOToPerson(personDto: PersonDTO): Person {
    return {
        id: personDto.id,
        name: personDto.name,
        pfpUrl: personDto.pfpUrl,
    } as Person
}