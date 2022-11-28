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