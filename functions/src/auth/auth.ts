import * as firebase from "firebase-admin";
import { Request, Response } from "firebase-functions";


export interface AuthError {
    errorInfo: ErrorInfo;
    codePrefix: string
}

interface ErrorInfo {
    code: string | "auth/id-token-expired";
    message: string;
}

export const checkAuth = async (req: Request, res: Response,
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
        console.error(e);
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

