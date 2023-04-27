import { Response } from "firebase-functions";

interface BillSplitError {
    code: number;
    message: string;
}

/**
 * Creates new error
 * @param {number} code error code
 * @param {string} message error message
 * @return {BillSplitError} return error instance
 */
export function billSplitError(code: number, message: string): BillSplitError {
    return {
        code: code,
        message: message,
    }
}

/**
 * Default error handling. Will send a BillSplitError as response
 * @param {any} error error to be sent
 * @param {Response} res response object of the request
 */
export function handleError(error: any, res: Response) {
    console.error(error);
    if ((error as BillSplitError).code !== undefined &&
        (error as BillSplitError).message !== undefined) {
        res.status(error.code).send(error.message)
        return
    }
    const bsError: BillSplitError = billSplitError(500, `${error}`)
    handleError(bsError, res)
}