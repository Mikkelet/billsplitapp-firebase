import { FriendDTO } from "../dto/friend-dto";

export type FriendStatus = "requestSent" | "requestAccepted" | "alreadyRequested"

export interface Friend {
    id: string,
    timeStamp: number,
    createdBy: string,
    status: FriendStatus,
    users: string[],
}

/**
 * Convert DTO to Friend
 * @param {FriendDTO} friendDTO friendDTO to convert
 * @return {Friend} converted Friend
 */
export function convertDTOtoFriend(friendDTO: FriendDTO): Friend {
    const user1 = friendDTO.createdBy > friendDTO.friend.id ?
        friendDTO.createdBy : friendDTO.friend.id;
    const user2 = friendDTO.createdBy > friendDTO.friend.id ?
        friendDTO.friend.id : friendDTO.createdBy;
    return {
        id: friendDTO.id,
        createdBy: friendDTO.createdBy,
        status: friendDTO.status,
        timeStamp: friendDTO.timeStamp,
        users: [user1, user2],
    } as Friend
}