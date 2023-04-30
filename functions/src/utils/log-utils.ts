import { Request } from "firebase-functions";

/**
 * Log a request with method, path/params, and body.
 * @param {Requst} req request to be logged
 */
export default function logRequest(req: Request) {
    console.log(req.method, req.path, req.params, req.body)
}