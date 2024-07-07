import { Friend } from "../../interfaces/models/friend";
import { billSplitError } from "../../utils/error-utils";
import { Person } from "../../interfaces/models/person";
import { getFriendship } from "../../collections/friend-collection";

interface FriendshipHelperResponse {
    user1: string
    user2: string
    friendship: Friend | null
}

/**
 * Friendship format helper
 * @param {Person} friendUser
 * @param {string} uid
 */
export default async function getFriendshipHelper(friendUser: Person, uid: string):
    Promise<FriendshipHelperResponse> {

    const sentTo = friendUser.id;
    const user1 = uid > sentTo ? uid : sentTo;
    const user2 = uid > sentTo ? sentTo : uid;

    if (user1 === user2) {
        throw billSplitError(500, "Unexpected error; could not normalize userIds");
    }

    const friendship = await getFriendship(user1, user2)
    return {
        user1: user1,
        user2: user2,
        friendship: friendship,
    }
}