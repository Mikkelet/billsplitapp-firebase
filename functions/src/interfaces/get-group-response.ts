import { Event } from "./models/events";
import Group from "./models/group";
import Person from "./models/person";

export default interface GetGroupResponse {
    group: Group;
    people: Person[]
    events: Event[]
}