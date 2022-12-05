import * as firebase from "firebase-admin";
import { GroupDTO } from "../interfaces/dto/group-dto";
import { Group } from "../interfaces/models/group";
import { findPerson, getPeople } from "./user-collection";

const firestore = firebase.firestore();

export const groupCollection = firestore.collection("groups");

/**
 * Retrieve all groups that user participates in
 * @param {string} userId userId to get groups for
 * @return {Promise<Group[]>} List of groups
 */
export async function getGroupsByUser(userId: string): Promise<Group[]> {
    try {
        const query = await groupCollection.where("people", "array-contains", userId).get();
        if (query.empty) return [];
        const groupsData: Group[] = query.docs.map((doc) => doc.data() as Group);
        return groupsData;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

/**
 * Retrieve all groups that user participates in
 * @param {string} userId userId to get groups for
 * @return {Promise<GroupDTO[]>} List of groups
 */
export async function getGroupDTOsByUser(userId: string): Promise<GroupDTO[]> {
    try {
        const query = await groupCollection.where("people", "array-contains", userId).get();
        if (query.empty) return [];
        const groups: Group[] = query.docs.map((doc) => doc.data() as Group);
        const uids: string[] = groups.flatMap((group) => group.people);
        const distinctUids: string[] = [...new Set(uids)];
        const people = await getPeople(distinctUids);
        const dtos: GroupDTO[] = groups.map((group) => {
            const groupMembers = group.people.map((person) => findPerson(people, person))
            return {
                id: group.id,
                name: group.name,
                people: groupMembers,
                timeStamp: group.timeStamp,
                createdBy: findPerson(people, group.createdBy),
            } as GroupDTO;
        })
        return dtos;
    } catch (e) {
        console.error(e);
        throw e;
    }
}