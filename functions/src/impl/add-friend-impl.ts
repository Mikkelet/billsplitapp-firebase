import { Request, Response } from "firebase-functions";
import { addFriend, getFriendship, updateFriendStatus } from "../collections/friend-collection";
import { getUserByEmail, getUserById } from "../collections/user-collection";
import {
    AddFriendRequest,
    AddFriendRequestEmail,
    AddFriendRequestUserId,
    AddFriendResponse,
} from "../interfaces/add-friend";
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
            // friend pair didn't exist, so we sent a friend requst
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
            // if exist, check status of friendRequest
            if (friend.status === "requestSent") {
                // if alreadyRequested, check who sent it
                if (friend.createdBy !== createdBy) {
                    // if you are not request sender, assume you accepted the request. You are now friends!
                    await updateFriendStatus(friend.id, "requestAccepted");
                    response = { status: { type: "requestAccepted" } };
                } else {
                    // if you are the request sender, tell the user that their request is not accepted yet
                    response = { status: { type: "alreadyRequested" } }
                }
            } else {
                // finally, assume you're already friends
                response = { status: { type: "requestAccepted" } }
            }
        }

        console.log("response", response);
        res.status(200).send(response)
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}