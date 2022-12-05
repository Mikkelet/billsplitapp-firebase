import * as firebase from "firebase-admin";
import { PersonDTO } from "../interfaces/dto/person-dto";
import Person from "../interfaces/models/person";

const firestore = firebase.firestore();

export const userCollection = firestore.collection("users");
export const userDoc = (userId: string) => userCollection.doc(userId);

/**
 * Retrieves user for given email
 * @param {string} email email of user
 * @return {Person | null} Person if exist, else null
 */
export async function getUserByEmail(email: string): Promise<Person | null> {
    try {
        const response = await userCollection.where("email", "==", email).get()
        if (response.empty) return null;
        if (response.size > 1) console.log("Multiple users with email: ", email);
        const firstDoc = response.docs[0].data() as Person;
        return firstDoc;
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

/**
 * Search a list of people to find person with uid.
 * Else return placeholder person.
 * @param {Person[]} people list of people to search
 * @param {string} uid uid for the person to find
 * @return {Person} person is either found and return or not-found-placeholder
 */
export function findPerson(people: Person[], uid: string): PersonDTO {
    try {
        const find = people.find((p) => p.id === uid);
        if (!find) {
            throw Error("user not found");
        }
        return find;
    } catch (e) {
        return {
            id: uid,
            name: "unknown user",
            pfpUrl: "",
        };
    }
}