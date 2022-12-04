import { Request, Response } from "firebase-functions";
import { addFriend, getFriendship, updateFriendStatus } from "../collections/friend-collection";
import { AddFriendRequest, AddFriendResponse } from "../interfaces/add-friend";
import { Friend } from "../interfaces/models/friend";

export const addFriendImpl = async (req: Request, res: Response) => {
    const body = req.body as AddFriendRequest;
    console.log(body);
    const createdBy = body.createdBy;
    const timeStamp = body.timeStamp;
    const sentTo = body.sentTo;

    try {
        const user1 = createdBy > sentTo ? createdBy : sentTo;
        const user2 = createdBy > sentTo ? sentTo : createdBy;
        if (user1 === user2) throw Error("could not normalize users");

        const friend = await getFriendship(user1, user2)
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
            const response: AddFriendResponse = {
                type: "requestSent",
            }
            res.status(200).send(response);
        } else {
            // if exist, check status of friendRequest
            if (friend.status === "requestSent") {
                // if alreadyRequested, check who sent it
                if (friend.createdBy !== createdBy) {
                    // if you are not request sender, assume you accepted the request. You are now friends!
                    await updateFriendStatus(friend.id, "requestAccepted");
                    const response: AddFriendResponse = {
                        type: "requestAccepted",
                    };
                    res.status(200).send(response)
                } else {
                    // if you are the request sender, tell the user that their request is not accepted yet
                    const response: AddFriendResponse = {
                        type: "alreadyRequested",
                    }
                    res.status(200).send(response)
                }
            } else {
                // finally, assume you're already friends
                const response: AddFriendResponse = {
                    type: "requestAccepted",
                }
                res.status(200).send(response)
            }
        }
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}