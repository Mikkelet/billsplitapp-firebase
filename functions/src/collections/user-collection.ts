import * as firebase from "firebase-admin";
import { UserRecord } from "firebase-functions/v1/auth";
import { Person, PersonWithId } from "../interfaces/models/person";
import { billSplitError } from "../utils/error-utils";

const firestore = firebase.firestore();

const userCollection = firestore.collection("users");

/**
 * Add person
 * @param {PersonWithId} person person to add
 * @return {Promise<PersonWithId>} person, with new id if new user
 */
export async function addPerson(person: PersonWithId): Promise<PersonWithId> {
    if (person.id === "") {
        person.id = userCollection.doc().id;
    }
    await userCollection.doc(person.id).set(person);
    return person;
}

/**
 * Retrieves user for given id, return null if not found
 * @param {string} userId id of user
 * @return {Person | null} Person if exist, else null
 */
export async function getUserById(userId: string): Promise<Person | null> {
    try {
        const userRecord: UserRecord = await firebase.auth().getUser(userId)
        const person: Person = {
            id: userRecord.uid,
            name: userRecord.displayName ?? "",
            email: userRecord.email ?? "",
            pfpUrl: userRecord.photoURL ?? "",
        };
        return person;
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * Retrieves existing user for given id, throws error if not found
 * @param {string} userId id of user
 * @return {Person} Person if exist, else null
 */
export async function getExistingUserById(userId: string): Promise<Person> {
    const userRecord: UserRecord = await firebase.auth().getUser(userId)
    const person: Person = {
        id: userRecord.uid,
        name: userRecord.displayName ?? "",
        email: userRecord.email ?? "",
        pfpUrl: userRecord.photoURL ?? "",
    };
    return person;
}

/**
 * Retrieves user for given email
 * @param {string} email email of user
 * @return {Person | null} Person if exist, else null
 */
export async function getUserByEmail(email: string): Promise<Person | null> {
    try {
        const userRecord: UserRecord = await firebase.auth().getUserByEmail(email)
        const person: Person = {
            id: userRecord.uid,
            name: userRecord.displayName ?? "",
            email: userRecord.email ?? "",
            pfpUrl: userRecord.photoURL ?? "",
        };
        return person;
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * Get people from list uids to user objects
 * @param {string[]} uids of people uids
 * @return {Promise<Person[]>} list of people objects
 */
export async function getPeople(uids: string[]): Promise<Person[]> {
    const queryStart = Date.now()
    const distinctUids: string[] = [...new Set(uids)];
    const userIdentifiers = distinctUids.map((id) => {
        return { uid: id }
    })
    const response = await firebase.auth().getUsers(userIdentifiers);
    const users = response.users;
    const people: Person[] = users.map((user) => {
        return {
            id: user.uid ?? "",
            name: user.displayName ?? "",
            pfpUrl: user.photoURL ?? "",
            email: user.email ?? "",
        }
    })

    const queryEnd = Date.now()
    console.log("getPeople query", {
        people: uids.length,
        time: queryEnd - queryStart,
        timePerId: (queryEnd - queryStart) / uids.length,
    });

    return people;
}

/**
 * Search a list of people to find person with uid.
 * Else return placeholder person.
 * @param {T[]} people list of people to search
 * @param {string} uid uid for the person to find
 * @return {T} person is either found and return or not-found-placeholder
 */
export function findPerson<T extends PersonWithId>(people: T[], uid: string): T {
    try {
        const person: T | undefined = people.find((p) => p.id === uid);

        if (!person) {
            throw billSplitError(404, "user not found");
        }

        return person;
    } catch (e) {
        return {
            id: uid,
            name: "unknown user",
            pfpUrl: "",
        } as T;
    }
}

/**
 * Update user
 * @param {Person} user user to update
 */
export async function updateUser(user: Person) {
    const updateData = {
        name: user.name,
        pfpUrl: user.pfpUrl,
    } as Person
    await userCollection.doc(user.id).update(updateData)
}