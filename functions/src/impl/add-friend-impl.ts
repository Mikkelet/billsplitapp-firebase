import { Request, Response } from "firebase-functions";
import { addFriend, getFriendship, updateFriendStatus } from "../collections/friend-collection";
import { getUserByEmail, getUserById } from "../collections/user-collection";
import {
    AddFriendRequest,
    AddFriendRequestEmail,
    AddFriendRequestUserId,
    AddFriendResponse,
} from "../interfaces/add-friend";
import { convertFriendToDTO } from "../interfaces/dto/friend-dto";
import { Friend, FriendStatus } from "../interfaces/models/friend";
import { Person } from "../interfaces/models/person";

export const addFriendImpl = async (req: Request, res: Response, uid: string) => {
    const body = req.body as AddFriendRequest;
    console.log("request", body);

    try {
        let friendUser: Person | null = null
        if (body.type === "email") {
            const email = (body as AddFriendRequestEmail).email;
            friendUser = await getUserByEmail(email);
        } else if (body.type === "userId") {
            const friendId = (body as AddFriendRequestUserId).friendId
            friendUser = await getUserById(friendId)
        } else {
            res.status(400).send("Missing id type");
            return;
        }

        if (friendUser === null) {
            res.status(404).send("Could not find user");
            return;
        }

        const sentTo = friendUser.id;

        const user1 = uid > sentTo ? uid : sentTo;
        const user2 = uid > sentTo ? sentTo : uid;
        if (user1 === user2) throw Error("Could not normalize users");

        const friend = await getFriendship(user1, user2)

        let response: AddFriendResponse;
        if (friend === null) {
            const users = [user1, user2]
            const friendRequest: Friend = {
                id: "",
                createdBy: uid,
                status: "pending",
                users: users,
            };
            const addedFriend = await addFriend(friendRequest)
            response = { friend: convertFriendToDTO(addedFriend, friendUser) }
        } else {
            const status = await handleExistingFriendRequest(uid, friend)
            friend.status = status
            response = { friend: convertFriendToDTO(friend, friendUser) }
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
): Promise<FriendStatus> {

    // if status is accepted, do nothing
    if (friend.status === "accepted") {
        return "accepted"
    }

    // if you are the request sender, tell the user that the request is not accepted yet
    if (createdBy === friend.createdBy) {
        return "pending"
    }

    // if status is pending and you are not request sender,
    // assume you accepted the request. You are now friends!
    await updateFriendStatus(friend.id, "accepted");
    return "accepted"
}