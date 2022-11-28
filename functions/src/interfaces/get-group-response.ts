import { EventDTO } from "./dto/event-dto";
import { GroupDTO } from "./dto/group-dto";
import Person from "./models/person";

export default interface GetGroupResponse {
    group: GroupDTO;
    people: Person[]
    events: EventDTO[]
}