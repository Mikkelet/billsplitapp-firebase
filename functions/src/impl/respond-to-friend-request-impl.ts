import { Request, Response } from "firebase-functions";
import { FriendRequestResponse } from "../interfaces/friend-request-response";
import { getFriendship, removeFriendRequest, updateFriendStatus } from "../collections/friend-collection";
import { billSplitError, handleError } from "../utils/error-utils";
import { getUserById } from "../collections/user-collection";
import { Friend, FriendStatus } from "../interfaces/models/friend";

const respondToFriendRequestImpl = async (req: Request, res: Response, uid: string) => {
    const body = req.body as FriendRequestResponse
    try {
        const accept = body.accept
        const requestId = body.requestId
        const friendUid = body.friendUid

        if (accept) {
            const friendUser = await getUserById(friendUid)
            if (friendUser === null) {
                throw billSplitError(404, "User not found")
            }

            const sentTo = friendUser.id;
            const user1 = uid > sentTo ? uid : sentTo;
            const user2 = uid > sentTo ? sentTo : uid;
            if (user1 === user2) {
                throw billSplitError(500, "Unexpected error; could not normalize userIds");
            }
            const friend = await getFriendship(user1, user2)
            const status = friend?.status
            if (friend === null) {
                throw billSplitError(404, "Could not find request")
            } else if (friend.status === "accepted") {
                throw billSplitError(500, "You are already friends")
            } else if (status === "pending") {
                if (uid === friend.createdBy) {
                    throw billSplitError(500, "You cannot respond to a request from yourself")
                }
                await updateFriendStatus(friend.id, "accepted");
            }
        } else {
            await removeFriendRequest(requestId)
        }
    } catch (e) {
        handleError(e, res)
    }
}

export default respondToFriendRequestImpl