import { Request, Response } from "express"
import { getGroupsByUser } from "../collections/group-collection";
import { handleError } from "../utils/error-utils";
import logRequest from "../utils/log-utils";
import sendGroups from "./helpers/send_groups";

const getGroupsImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)

    try {
        const groups = await getGroupsByUser(uid);
        await sendGroups(res, groups)
    } catch (e) {
        console.error(e);
        handleError(e, res)
    }
}

export default getGroupsImpl