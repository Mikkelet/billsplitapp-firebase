import { Request, Response } from "firebase-functions"
import { groupCollection } from '../collections'
import AddGroupRequest from "../interfaces/add-group-request"

export const addGroupImpl = async (req: Request, res: Response<any>) => {
    const body = req.body as AddGroupRequest
    const group = body.group
    const uid = group.createdBy
    const groupName = group.name
    if (!uid) res.status(404).send("missing uid")
    if (!groupName) res.status(400).send("missing kitchenName")
    if (!group.people || group.people.length === 0) res.status(400).send("No people included")

    try {
        await groupCollection.add(group)
        res.status(200).send()
    } catch (e) {
        res.send(500).send(e)
    }
}