import { Friend, FriendStatus } from "../models/friend";
import { Person } from "../models/person";
import { convertPersonToDTO, PersonDTO } from "./person-dto";

export interface FriendStatusDTO {
    type: FriendStatus
}

export interface FriendDTO {
    id: string,
    timeStamp: number,
    createdBy: string,
    status: FriendStatusDTO,
    friend: PersonDTO,
}

/**
 * Convert friend to DTO
 * @param {Friend} friend friend to convert
 * @param {Person} person people in record
 * @return {FriendDTO} converted friendDTO
 */
export function convertFriendToDTO(
    friend: Friend,
    person: Person,
): FriendDTO {
    return {
        id: friend.id,
        createdBy: friend.createdBy,
        friend: convertPersonToDTO(person),
        status: {
            type: friend.status,
        },
    } as FriendDTO
}