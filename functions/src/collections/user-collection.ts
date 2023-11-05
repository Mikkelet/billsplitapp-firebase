import * as firebase from "firebase-admin";
import { UserRecord } from "firebase-functions/v1/auth";
import { Person, PersonWithId } from "../interfaces/models/person";
import { billSplitError } from "../utils/error-utils";
import { UpdateUserRequest } from "../interfaces/update-user";

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
 * Retrieves user for given phonenumber, return null if not found
 * @param {number} phoneNum phonenumber of user
 * @return {Person | null} Person if exist, else null
 */
export async function getUserByPhoneNumber(phoneNum: number): Promise<Person | null> {
    try {
        const userRecord: UserRecord = await firebase.auth().getUserByPhoneNumber(`${phoneNum}`)
        const person: Person = {
            id: userRecord.uid,
            name: userRecord.displayName ?? "",
            email: userRecord.email ?? "",
            pfpUrl: userRecord.photoURL ?? "",
        }
        return person
    } catch (e) {
        return null;
    }
}

/**
 * Get people from list uids to user objects
 * @param {string[]} uids of people uids
 * @return {Promise<Person[]>} list of people objects
 */
export async function getPeople(uids: string[]): Promise<Person[]> {
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
 * @param {string} uid for user
 * @param {UpdatePerson} updateData user to update
 */
export async function updateUser(uid: string, updateData: UpdateUserRequest) {
    const doc = await userCollection.doc(uid).get()
    if (doc.exists) {
        await userCollection.doc(uid).update(updateData)
    } else {
        await userCollection.doc(uid).set(updateData)
    }
}