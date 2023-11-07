export type NotificationType = "groupInvite" | "friendInvite" | "group"

export type NotificationData = {
    type: NotificationType,
    [key: string]: string,
}