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
        const friend = await getFriendship(createdBy, sentTo)
        if (friend === null) {
            // friend pair didn't exist, so we sent a friend requst
            const friendRequest: Friend = {
                id: "",
                timeStamp: timeStamp,
                createdBy: createdBy,
                status: "requestSent",
                users: [createdBy, sentTo],
            };
            await addFriend(friendRequest)
            const response: AddFriendResponse = {
                status: "requestSent",
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
                        status: "requestAccepted",
                    };
                    res.status(200).send(response)
                } else {
                    // if you are the request sender, tell the user that their request is not accepted yet
                    const response: AddFriendResponse = {
                        status: "alreadyRequested",
                    }
                    res.status(200).send(response)
                }
            } else {
                // finally, assume you're already friends
                const response: AddFriendResponse = {
                    status: "requestAccepted",
                }
                res.status(200).send(response)
            }
        }
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}