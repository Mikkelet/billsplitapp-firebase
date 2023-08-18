import { Service } from "../../interfaces/models/service";
import { ServiceV2 } from "../models/services_v2";

/**
 * Convert V2 to V3
 * @param {ServiceV2} service
 * @return {Service} service
 */
export function convertServiceV2toV3(service: ServiceV2): Service {
    return {
        ...service,
        currency: "usd",
    }
}