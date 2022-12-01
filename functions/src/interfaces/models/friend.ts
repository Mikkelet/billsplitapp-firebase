export type FriendStatus = "requestSent" | "requestAccepted" | "alreadyRequested"

export interface Friend {
    id: string,
    timeStamp: number,
    createdBy: string,
    status: FriendStatus,
    users: string[],
}