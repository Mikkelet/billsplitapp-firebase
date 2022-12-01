import { FriendStatus } from "../models/friend";
import Person from "../models/person";

export interface FriendDTO {
    id: string,
    timeStamp: number,
    createdBy: string,
    status: FriendStatus,
    friend: Person,
}