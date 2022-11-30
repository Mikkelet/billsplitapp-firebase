import { userDoc } from "./collections";
import Person from "./interfaces/models/person";

/**
 * Search a list of people to find person with uid.
 * Else return placeholder person.
 * @param {Person[]} people list of people to search
 * @param {string} uid uid for the person to find
 * @return {Person} person is either found and return or not-found-placeholder
 */
export function findPerson(people: Person[], uid: string): Person {
    const find = people.find((p) => p.id === uid);
    if (!find) {
        return {
            id: uid,
            name: "unknown user",
            pfpUrl: "",
        };
    }
    return find;
}

/**
 * Get people from list uids to user objects
 * @param {string[]} uids of people uids
 * @return {Promise<Person[]>} list of people objects
 */
export async function getPeople(uids: string[]): Promise<Person[]> {
    const users: Person[] = [];
    for await (const uid of uids) {
        try {
            const doc = await userDoc(uid).get();
            const data = doc.data() as Person;
            users.push(data);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
    return users;
}