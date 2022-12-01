import { Request, Response } from "firebase-functions";
import { GetFriendsRequest, GetFriendsResponse } from "../interfaces/get-friends";
import { getFriends } from "../collections/friend-collection";
import { findPerson, getPeople } from "../utils";
import { FriendDTO } from "../interfaces/dto/friend-dto";

export const getFriendshipsImpl = async (req: Request, res: Response) => {
    const body = req.body as GetFriendsRequest;
    const requestUid = body.uid as string;
    console.log(body);

    try {
        const response: GetFriendsResponse = {
            friends: [],
        }
        const friends = await getFriends(requestUid);

        if (friends.length > 0) {
            const uids = friends
                .flatMap((friend) => friend.users)
                .filter((userId) => userId !== requestUid)
            console.log(uids);
            const people = await getPeople(uids);
            const dtos: FriendDTO[] = friends.map((friendship) => {
                const friendId = friendship.users.find((uid) => uid !== requestUid) || ""
                return {
                    createdBy: friendship.createdBy,
                    id: friendship.id,
                    status: friendship.status,
                    timeStamp: friendship.timeStamp,
                    friend: findPerson(people, friendId),
                } as FriendDTO
            })
            response.friends = dtos;
        }
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}