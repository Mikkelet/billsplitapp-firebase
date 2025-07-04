import * as firebase from "firebase-admin";
import { Group, GroupLastUpdated } from "../interfaces/models/group";
import { billSplitError } from "../utils/error-utils";
import { groupsCollectionVersion } from "./collections-versions";

const firestore = firebase.firestore();
export const groupCollection = firestore.collection(groupsCollectionVersion);

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
    await groupCollection.doc(group.id).update(group as any)
}

/**
 * Update groups last updated field to current timestamp
 * @param {string} groupId
 */
export async function updateGroupLastUpdated(groupId: string) {
    const groupLastUpdated: GroupLastUpdated = {
        lastUpdated: Date.now(),
    }
    await groupCollection.doc(groupId).update(groupLastUpdated as any)
}

/**
 * get group from groupId
 * @param {string} groupId groupId to get group for
 * @return {Group} DTO to return
 */
export async function getGroupById(groupId: string): Promise<Group> {
    const query = await groupCollection.doc(groupId).get();
    if (!query.exists) throw billSplitError(404, "Group not found")
    return query.data() as Group;
}

/**
 * Retrieve all groups that user participates in
 * @param {string} userId userId to get groups for
 * @return {Promise<Group[]>} List of groups
 */
export async function getGroupsByUser(userId: string): Promise<Group[]> {
    const query = await groupCollection.where("people", "array-contains", userId).get();
    if (query.empty) return [];
    return query.docs.map((doc) => doc.data() as Group);
}

/**
 * Retrieves groups that has invited user id to join
 * @param {string} userId userId
 * @return {Promise<Group[]>} List of groups
 */
export async function getGroupInvitesByUser(userId: string): Promise<Group[]> {
    const response = await groupCollection.where("invites", "array-contains", userId).get()
    if (response.empty) return [];
    return response.docs.map((doc) => doc.data() as Group)
}