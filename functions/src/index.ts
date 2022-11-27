import * as functions from "firebase-functions";
import { addGroupImpl } from './impl/add-group-impl';

export const addGroup = functions.https.onRequest(addGroupImpl)