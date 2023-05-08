import { Request, Response } from "firebase-functions";
import { GetFriendsResponse } from "../interfaces/get-friends";
import { getFriends } from "../collections/friend-collection";
import { convertFriendToDTO, FriendDTO } from "../interfaces/dto/friend-dto";
import { findPerson, getPeople } from "../collections/user-collection";
import { Person } from "../interfaces/models/person";
import { handleError } from "../utils/error-utils";
import logRequest from "../utils/log-utils";

const getFriendsImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)

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
            const dtos: FriendDTO[] = friends.map((friend) => {
                const friendUserId = friend.users.filter((user) => user !== uid)[0]
                return convertFriendToDTO(friend, findPerson(people, friendUserId))
            });
            response.friends = dtos;
        }
        console.log("response", response);
        res.status(200).send(response);
    } catch (e) {
        handleError(e, res)
    }
}

export default getFriendsImpl