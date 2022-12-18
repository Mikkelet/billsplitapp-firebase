import { Request, Response } from "firebase-functions";
import { verifyUser } from "../auth";
import { addFriend, getFriendship, updateFriendStatus } from "../collections/friend-collection";
import { getUserByEmail } from "../collections/user-collection";
import {
    AddFriendRequest,
    AddFriendRequestEmail,
    AddFriendRequestUserId,
    AddFriendResponse,
} from "../interfaces/add-friend";
import { convertFriendToDTO } from "../interfaces/dto/friend-dto";
import { Friend, FriendStatus } from "../interfaces/models/friend";
import { convertDTOToPerson, Person } from "../interfaces/models/person";

export const addFriendImpl = async (req: Request, res: Response) => {
    const body = req.body as AddFriendRequest;
    console.log("request", body);

    const createdBy = body.createdBy;
    const timeStamp = body.timeStamp;

    const uid = await verifyUser(req.headers.authorization)
    if (uid === null) {
        res.status(403).send("Unauthorized");
        return
    }

    try {
        let friendUser: Person | null
        if (body.type === "email") {
            const email = (body as AddFriendRequestEmail).email;
            friendUser = await getUserByEmail(email);
        } else {
            const dto = (body as AddFriendRequestUserId).user;
            friendUser = convertDTOToPerson(dto);
        }
        if (friendUser === null) {
            res.status(404).send("Could not find user");
            return;
        }
        const sentTo = friendUser.id;

        const user1 = createdBy > sentTo ? createdBy : sentTo;
        const user2 = createdBy > sentTo ? sentTo : createdBy;
        if (user1 === user2) throw Error("Could not normalize users");

        const friend = await getFriendship(user1, user2)

        let response: AddFriendResponse;
        if (friend === null) {
            const users = [user1, user2]
            const friendRequest: Friend = {
                id: "",
                timeStamp: timeStamp,
                createdBy: createdBy,
                status: "pending",
                users: users,
            };
            const addedFriend = await addFriend(friendRequest)
            response = { friend: convertFriendToDTO(addedFriend, friendUser) }
        } else {
            const status = await handleExistingFriendRequest(createdBy, friend)
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