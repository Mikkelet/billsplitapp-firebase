import { Request, Response } from "firebase-functions";
import { deleteUser } from "../collections/user-collection";
import { handleError } from "../utils/error-utils";

export const deleteUserImpl = async (req: Request, res: Response, uid: string) => {
    console.log("deleteUser", { uid: uid });

    try {
        await deleteUser(uid)
        res.status(204).send();
    } catch (e) {
        handleError(e, res)
    }
}