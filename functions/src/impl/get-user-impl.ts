import { Request, Response } from "firebase-functions";
import { getFriends } from "../collections/friend-collection";
import { getGroupsByUser } from "../collections/group-collection";
import { findPerson, getExistingUserById, getPeople } from "../collections/user-collection";
import { convertFriendToDTO, FriendDTO } from "../interfaces/dto/friend-dto";
import { convertGroupToDTO, GroupDTO } from "../interfaces/dto/group-dto";
import { Friend } from "../interfaces/models/friend";
import { Group } from "../interfaces/models/group";
import { Person } from "../interfaces/models/person";


export const getUserProfile = async (req: Request, res: Response) => {
    const body = req.body;
    const userId = body.userId;
    console.log("request", body);

    try {
        const user: Person = await getExistingUserById(userId);
        const groups: Group[] = await getGroupsByUser(user.id);
        const groupPeopleIds = groups.flatMap((group) => group.people);
        const groupPeople = await getPeople(groupPeopleIds);
        const friends: Friend[] = await getFriends(user.id);
        const friendIds: string[] =
            friends.flatMap((friend) => friend.users).filter((id) => id !== userId)
        const friendsPeople: Person[] = await getPeople(friendIds);

        // Convert to DTOs
        const dtos: FriendDTO[] = friends.map((friend) => {
            const friendUserId = friend.users.filter((user) => user !== userId)[0]
            return convertFriendToDTO(friend, findPerson(friendsPeople, friendUserId))
        });
        const groupDTOs: GroupDTO[] =
            groups.map((group) => convertGroupToDTO(group, groupPeople))

        const response = {
            user: user,
            friends: dtos,
            groups: groupDTOs,
        }
        console.log("response", response);
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        res.status(500).send(e)
    }
}