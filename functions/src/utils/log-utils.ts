import { Request } from "express";

/**
 * Log a request with method, path/params, and body.
 * @param {Request} req request to be logged
 */
export default function logRequest(req: Request) {
    console.log(req.method, req.path, req.params, req.body)
}