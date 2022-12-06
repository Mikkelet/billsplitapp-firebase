import { Request, Response } from "firebase-functions";
import { GetFriendsRequest, GetFriendsResponse } from "../interfaces/get-friends";
import { getFriends } from "../collections/friend-collection";
import { convertFriendToDTO, FriendDTO } from "../interfaces/dto/friend-dto";
import { getPeople } from "../collections/user-collection";
import { Person } from "../interfaces/models/person";

export const getFriendsImpl = async (req: Request, res: Response) => {
    const body = req.body as GetFriendsRequest;
    const userId = body.uid as string;
    console.log(body);

    try {
        const response: GetFriendsResponse = {
            friends: [],
        }
        const friends = await getFriends(userId);

        if (friends.length > 0) {
            const uids: string[] = friends
                .flatMap((friend) => friend.users)
                .filter((friendId) => friendId !== userId)
            const people: Person[] = await getPeople(uids);
            const dtos: FriendDTO[] = friends.map((friendship) =>
                convertFriendToDTO(userId, friendship, people))
            response.friends = dtos;
        }
        console.log("response", response);
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}