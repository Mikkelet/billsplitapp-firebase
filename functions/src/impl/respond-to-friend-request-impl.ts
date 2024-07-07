import { Request, Response } from "firebase-functions";
import { FriendRequestResponse } from "../interfaces/friend-request-response";
import {
    removeFriendRequest,
    updateFriendStatus,
} from "../collections/friend-collection";
import { billSplitError, handleError } from "../utils/error-utils";
import { getUserById } from "../collections/user-collection";
import getFriendshipHelper from "./helpers/get_friendship_helper";

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

            const friendshipResponse = await getFriendshipHelper(friendUser, uid)
            const friendship = friendshipResponse.friendship
            const status = friendship?.status

            if (friendship === null) {
                throw billSplitError(404, "Could not find request")
            } else if (status === "accepted") {
                throw billSplitError(500, "You are already friends")
            } else if (status === "pending") {
                if (uid === friendship.createdBy) {
                    throw billSplitError(500, "You cannot respond to a request from yourself")
                }
                await updateFriendStatus(friendship.id, "accepted");
            }
        } else {
            await removeFriendRequest(requestId)
        }
    } catch (e) {
        handleError(e, res)
    }
}

export default respondToFriendRequestImpl