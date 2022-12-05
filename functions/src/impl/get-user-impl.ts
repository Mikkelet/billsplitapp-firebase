import { Request, Response } from "firebase-functions";
import { getFriends } from "../collections/friend-collection";
import { getGroupDTOsByUser } from "../collections/group-collection";
import { findPerson, userDoc } from "../collections/user-collection";
import Person from "../interfaces/models/person";
import { getPeople } from "../utils";


export const getGroupsImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const userId = body.userId;

    try {
        const userResponse = await userDoc(userId).get();
        const user = userResponse.data() as Person;
        const groupDTOs = await getGroupDTOsByUser(user.id);
        const friends = await getFriends(user.id);
        const friendIds = friends.flatMap((friend) => friend.users).filter((id) => id !== userId)
        const distinctUids: string[] = [...new Set(friendIds)];
        const people = await getPeople(distinctUids);
        // Convert to DTOs
        const friendDTOs = friends.map((friend) => {
            const friendId = friend.users.filter((id) => id !== userId)[0];
            const friendPerson = findPerson(people, friendId)
            return {
                person: friendPerson,
                type: "alreadyRequested",
            }
        })
        const response = {
            user: user,
            friends: friendDTOs,
            groups: groupDTOs,
        }

        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        res.status(500).send(e)
    }
}