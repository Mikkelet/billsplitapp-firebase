import { Request, Response } from "firebase-functions";
import { updateUser } from "../collections/user-collection";
import { UpdateUserRequest } from "../interfaces/update-user";
import logRequest from "../utils/log-utils";
import { handleError } from "../utils/error-utils";

export const updateUserImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)
    const updateData = req.body as UpdateUserRequest;

    try {
        await updateUser(uid, updateData);
        res.status(204).send();
    } catch (e) {
        handleError(e, res)
    }
}