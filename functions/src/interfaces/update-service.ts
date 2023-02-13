import { ServiceDTO } from "./dto/service-dto";

export interface UpdateServiceRequest {
    groupId: string;
    service: ServiceDTO
}