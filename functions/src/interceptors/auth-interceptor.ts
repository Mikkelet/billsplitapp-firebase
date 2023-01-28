import * as firebase from "firebase-admin";
import { Request, Response } from "firebase-functions";
import * as functions from "firebase-functions";


export interface AuthError {
    errorInfo: ErrorInfo;
    codePrefix: string
}

interface ErrorInfo {
    code: string | "auth/id-token-expired";
    message: string;
}

const checkAuth = async (req: Request, res: Response,
    callback: (req: Request, res: Response, uid: string) => void) => {

    const token = req.headers.authorization
    if (token === undefined) {
        res.status(400).send("Missing authorization")
        return
    }
    try {
        const verificationResult = await firebase.auth().verifyIdToken(token)
        const uid = verificationResult.uid
        callback(req, res, uid)
    } catch (e) {
        console.error("auth error",e);
        const err = e as AuthError
        switch (err.errorInfo.code) {
            case "auth/id-token-expired":
                res.status(408).send("Token expired")
                return;
            default:
                res.status(401).send("Unathorized")
                return;
        }
    }
}


/**
 * intercept the request to check if user is authenticated
 * @param {Callback} request Callback for request
 * @return {Void} request
 */
export function authInterceptor(request: (req: Request, res: Response, uid: string) => void) {
    return functions.https.onRequest((req, res) => checkAuth(req, res, request));
}
