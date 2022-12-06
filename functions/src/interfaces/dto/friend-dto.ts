import { findPerson } from "../../collections/user-collection";
import { Friend, FriendStatus } from "../models/friend";
import { PersonWithId } from "../models/person";
import { PersonDTO } from "./person-dto";

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
 * @param {string} userId userId of requesting user
 * @param {Freind} friend friend to convert
 * @param {PersonWithId[]} people people in record
 * @return {FriendDTO} converted friendDTO
 */
export function convertFriendToDTO(
    userId: string,
    friend: Friend,
    people: PersonWithId[],
): FriendDTO {
    const friendId = friend.users.filter((id) => id !== userId)[0]
    return {
        id: friend.id,
        createdBy: friend.createdBy,
        friend: findPerson(people, friendId),
        timeStamp: friend.timeStamp,
        status: {
            type: friend.status,
        },
    } as FriendDTO
}