import { Request, Response } from "firebase-functions";
import { addFriend, getFriendship, updateFriendStatus } from "../collections/friend-collection";
import { getUserByEmail, getUserById } from "../collections/user-collection";
import {
    AddFriendRequest,
    AddFriendRequestEmail,
    AddFriendRequestUserId,
    AddFriendResponse,
} from "../interfaces/add-friend";
import { FriendStatusDTO } from "../interfaces/dto/friend-dto";
import { Friend } from "../interfaces/models/friend";
import { Person } from "../interfaces/models/person";

export const addFriendImpl = async (req: Request, res: Response) => {
    const body = req.body as AddFriendRequest;
    console.log("request", body);

    const createdBy = body.createdBy;
    const timeStamp = body.timeStamp;

    try {
        let user: Person | null
        if (body.type === "email") {
            const email = (body as AddFriendRequestEmail).email;
            user = await getUserByEmail(email);
        } else {
            const userId = (body as AddFriendRequestUserId).userId;
            user = await getUserById(userId);
        }
        if (user === null) throw Error("User does not exist");
        const sentTo = user.id;

        const user1 = createdBy > sentTo ? createdBy : sentTo;
        const user2 = createdBy > sentTo ? sentTo : createdBy;
        if (user1 === user2) throw Error("could not normalize users");

        const friend = await getFriendship(user1, user2)

        let response: AddFriendResponse
        if (friend === null) {
            const friendRequest: Friend = {
                id: "",
                timeStamp: timeStamp,
                createdBy: createdBy,
                status: "requestSent",
                users: [user1, user2],
            };
            await addFriend(friendRequest)
            response = { status: { type: "requestSent" } }
        } else {
            const status = await handleExistingFriendRequest(createdBy, friend)
            response = {
                status: status,
            }
        }

        console.log("response", response);
        res.status(200).send(response)
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}

/**
 * handle existing friendship status
 * @param {string} createdBy userId of request sender
 * @param {Friend} friend friend request is sent to
 * @return {Promise<FriendStatus>} status of friendship
 */
async function handleExistingFriendRequest(
    createdBy: string,
    friend: Friend
): Promise<FriendStatusDTO> {
    // if status isn't pending a response, assume you're already friends
    if (friend.status !== "requestSent") {
        return { type: "requestAccepted" }
    }
    // if you are the request sender, tell the user that their request is not accepted yet
    if (createdBy === friend.createdBy) {
        return { type: "alreadyRequested" }
    }

    // if you are not request sender, assume you accepted the request. You are now friends!
    await updateFriendStatus(friend.id, "requestAccepted");
    return { type: "requestAccepted" }
}