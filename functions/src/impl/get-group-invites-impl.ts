import { Request, Response } from "firebase-functions";
import { getGroupInvitesByUser } from "../collections/group-collection";
import { handleError } from "../utils/error-utils";
import logRequest from "../utils/log-utils";
import sendGroups from "./helpers/send_groups";

const getGroupInvitesImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)

    try {
        const groups = await getGroupInvitesByUser(uid);
        await sendGroups(res, groups)
    } catch (e) {
        console.error(e);
        handleError(e, res)
    }
}


export default getGroupInvitesImpl