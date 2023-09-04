import * as firebase from "firebase-admin";
import { Group } from "../interfaces/models/group";
import { billSplitError } from "../utils/error-utils";

const firestore = firebase.firestore();
export const groupCollection = firestore.collection("groups-v5");

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
 * update group
 * @param {Group} group group to update
 */
export async function updateGroup(group: Group) {
    await groupCollection.doc(group.id).update(group)
}

/**
 * get group from groupId
 * @param {string} groupId groupId to get group for
 * @return {Group} DTO to return
 */
export async function getGroupById(groupId: string): Promise<Group> {
    const query = await groupCollection.doc(groupId).get();
    if (!query.exists) throw billSplitError(404, "Group not found")
    const group: Group = query.data() as Group;
    return group;
}

/**
 * Retrieve all groups that user participates in
 * @param {string} userId userId to get groups for
 * @return {Promise<Group[]>} List of groups
 */
export async function getGroupsByUser(userId: string): Promise<Group[]> {
    const query = await groupCollection.where("people", "array-contains", userId).get();

    if (query.empty) return [];
    const groups: Group[] = query.docs.map((doc) => doc.data() as Group);
    return groups;
}