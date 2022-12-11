import { Request, Response } from "firebase-functions";
import { updateUser } from "../collections/user-collection";
import { convertDTOToPerson } from "../interfaces/models/person";
import { UpdateUserRequest } from "../interfaces/update-user";

export const updateUserImpl = async (req: Request, res: Response) => {
    const body = req.body as UpdateUserRequest;
    console.log("request", body);

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