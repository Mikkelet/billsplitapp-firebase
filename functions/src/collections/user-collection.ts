import * as firebase from "firebase-admin";
import { Person, PersonWithId } from "../interfaces/models/person";

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
        const response = await userCollection.doc(userId).get()
        const person = response.data() as Person;
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
    try {
        const response = await userCollection.doc(userId).get()
        const person = response.data() as Person;
        return person;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

/**
 * Retrieves user for given email
 * @param {string} email email of user
 * @return {Person | null} Person if exist, else null
 */
export async function getUserByEmail(email: string): Promise<Person | null> {
    try {
        const response = await userCollection.where("email", "==", email).get()
        if (response.empty) return null;
        if (response.size > 1) console.error("Multiple users with email: ", email);
        const person = response.docs[0].data() as Person;
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
    const distinctUids: string[] = [...new Set(uids)];
    const users: Person[] = [];
    for await (const uid of distinctUids) {
        try {
            const doc = await userCollection.doc(uid).get();
            const data = doc.data() as Person;
            users.push(data);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
    return users;
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
            throw Error("user not found");
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