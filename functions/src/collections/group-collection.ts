import * as firebase from "firebase-admin";
import { Group } from "../interfaces/models/group";

const firestore = firebase.firestore();
export const groupCollection = firestore.collection("groups");

/**
 * Add group
 * @param {Group} group Group to add
 * @return {Group} returns group with new id
 */
export async function addGroup(group: Group): Promise<Group> {
    group.id = groupCollection.doc().id;
    await groupCollection.doc(group.id).set(group);
    return group;
}

/**
 * get group from groupId
 * @param {string} groupId groupId to get group for
 * @return {Group} DTO to return
 */
export async function getGroupById(groupId: string): Promise<Group> {
    const query = await groupCollection.doc(groupId).get();
    if(!query.exists) throw Error("Group does not exist")
    const group: Group = query.data() as Group;
    return group;
}

/**
 * Retrieve all groups that user participates in
 * @param {string} userId userId to get groups for
 * @return {Promise<Group[]>} List of groups
 */
export async function getGroupsByUser(userId: string): Promise<Group[]> {
    try {
        const query = await groupCollection.where("people", "array-contains", userId).get();
        if (query.empty) return [];
        const groups: Group[] = query.docs.map((doc) => doc.data() as Group);
        return groups;
    } catch (e) {
        console.error(e);
        throw e;
    }
}