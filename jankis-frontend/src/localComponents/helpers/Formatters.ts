import { InstitutionLocationType, MaterialType, ServiceAudienceType } from "../types/enums.d";
import { Models } from "../types/models";
import { ViewModels } from "../types/viewModels";
import { resolveText } from "../../sharedCommonComponents/helpers/Globalizer";
import { formatPerson } from "../../sharedHealthComponents/helpers/Formatters";

export const formatServiceAudience = (item: ViewModels.ServiceAudienceViewModel) => {
    if(item.type === ServiceAudienceType.All) {
        return resolveText('ServiceAudienceType_All');
    }
    if(item.type === ServiceAudienceType.Role) {
        return `${resolveText('ServiceAudienceType_Role')}: ${item.role!.name}`;
    }
    if(item.type === ServiceAudienceType.Person) {
        return `${resolveText('ServiceAudienceType_Person')}: ${formatPerson(item.person!)}`;
    }
    throw new Error(`Formatting of service audience type '${item.type}' not implemented`);
}

export const formatLocation = (location: ViewModels.LocationViewModel) => {
    switch(location.type) {
        case InstitutionLocationType.Department:
            return `${resolveText(`InstitutionLocationType_${location.type}`)} ${location.department?.name ?? location.id}`;
        case InstitutionLocationType.Room:
            return `${resolveText(`InstitutionLocationType_${location.type}`)} ${location.room?.name ?? location.id}`;
    }
    return `${resolveText(`InstitutionLocationType_${location.type}`)} ${location.id}`;
}
export const formatStock = (stock: ViewModels.StockViewModel) => {
    return `${stock.name} (${resolveText('Department')} ${stock.department.name})`;
}
export const formatBed = (room: Models.Room, bedPosition: string) => {
    return `${room.name}${bedPosition}`;
}
export const formatEquipmentMaterial = (material: ViewModels.MaterialViewModel) => {
    switch(material.type) {
        case MaterialType.Consumable:
            return `${material.consumable!.name}`;
        case MaterialType.Resource:
            return `${material.resource!.name}`;
        default:
            throw new Error(`Unsupported material type '${material.type}'`);
    }
}