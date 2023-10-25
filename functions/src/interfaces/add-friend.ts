import { FriendDTO } from "./dto/friend-dto";

export type AddFriendType = "email" | "userId" | "phone"

export interface AddFriendRequest {
    type: AddFriendType;
}

export interface AddFriendRequestEmail {
    type: AddFriendType;
    email: string;
}

export interface AddFriendRequestUserId {
    type: AddFriendType;
    friendId: string;
}

export interface AddFriendRequestPhoneNumber {
    type: AddFriendType;
    phoneNumber: number;
}

export interface AddFriendResponse {
    friend: FriendDTO;
}
