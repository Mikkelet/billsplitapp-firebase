import { Service } from "../../interfaces/models/service";
import { ServiceV1 } from "../models/service/services_v1";

/**
 * Convert V2 to V3
 * @param {ServiceV2} service
 * @return {Service} service
 */
export function convertServiceV2toV3(service: ServiceV1): Service {
    return {
        ...service,
        currency: "usd",
    }
}