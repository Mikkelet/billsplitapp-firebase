import { EventContext } from "firebase-functions/v1";
import { UserRecord } from "firebase-functions/v1/auth";
import { addPerson } from "../collections/user-collection";
import { Person } from "../interfaces/models/person";

const onUserCreateImpl = async (userRecord: UserRecord, _: EventContext) => {
    console.log("request", userRecord);
    const user: Person = {
        id: userRecord.uid,
        email: userRecord.email?.toLowerCase() ?? "",
        pfpUrl: "",
        name: "New user",
    }
    return await addPerson(user).catch(console.log);
}

export default onUserCreateImpl