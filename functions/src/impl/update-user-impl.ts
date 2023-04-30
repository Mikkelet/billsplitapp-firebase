import { Request, Response } from "firebase-functions";
import { updateUser } from "../collections/user-collection";
import { convertDTOToPerson } from "../interfaces/models/person";
import { UpdateUserRequest } from "../interfaces/update-user";
import logRequest from "../utils/log-utils";

export const updateUserImpl = async (req: Request, res: Response) => {
    logRequest(req)
    const body = req.body as UpdateUserRequest;
    const userDTO = body.user;

    try {
        const user = convertDTOToPerson(userDTO);
        await updateUser(user);
        res.status(204).send();
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}