import { EventContext } from "firebase-functions/v1";
import { UserRecord } from "firebase-functions/v1/auth";
import { addPerson } from "../collections/user-collection";
import { Person } from "../interfaces/models/person";

export const onUserCreateImpl = async (userRecord: UserRecord, _: EventContext) => {
    const user: Person = {
        id: userRecord.uid,
        email: userRecord.email ?? "",
        pfpUrl: "",
        name: "",
    }
    return await addPerson(user).catch(console.log);
}
