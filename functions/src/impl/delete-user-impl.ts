import { Request, Response } from "express"
import { deleteUser } from "../collections/user-collection";
import { handleError } from "../utils/error-utils";

const deleteUserImpl = async (req: Request, res: Response, uid: string) => {
    console.log("deleteUser", { uid: uid });

    try {
        await deleteUser(uid)
        res.status(204).send();
    } catch (e) {
        handleError(e, res)
    }
}

export default deleteUserImpl