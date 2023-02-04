import { ServiceDTO } from "./dto/service-dto";

export interface AddServiceRequest {
    groupId: string;
    service: ServiceDTO
}

export interface AddServiceResponse {
    service: ServiceDTO
}