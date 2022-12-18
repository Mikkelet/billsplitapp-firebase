import { Request, Response } from "firebase-functions";
import { GetFriendsResponse } from "../interfaces/get-friends";
import { getFriends } from "../collections/friend-collection";
import { convertFriendToDTO } from "../interfaces/dto/friend-dto";
import { findPerson, getPeople } from "../collections/user-collection";
import { Person } from "../interfaces/models/person";
import { verifyUser } from "../auth";

export const getFriendsImpl = async (req: Request, res: Response) => {

    const uid = await verifyUser(req.headers.authorization)
    if (uid === null) {
        res.status(403).send("Unauthorized")
        return
    }

    try {
        const response: GetFriendsResponse = {
            friends: [],
        }
        const friends = await getFriends(uid);

        if (friends.length > 0) {
            const uids: string[] = friends
                .flatMap((friend) => friend.users)
                .filter((friendId) => friendId !== uid)
            const people: Person[] = await getPeople(uids);
            const dtos = friends.map((friend) => {
                const friendUserId = friend.users.filter((user) => user !== uid)[0]
                return convertFriendToDTO(friend, findPerson(people, friendUserId))
            });
            response.friends = dtos;
        }
        console.log("response", response);
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}