import { ServiceAudienceType } from "../types/enums.d";
import { Models } from "../types/models";
import { ViewModels } from "../types/viewModels";


export const buildServiceAudienceModel = (viewModel: ViewModels.ServiceAudienceViewModel): Models.Services.ServiceAudience => {
    switch(viewModel.type) {
        case ServiceAudienceType.All:
            return {
                type: ServiceAudienceType.All
            };
        case ServiceAudienceType.Role:
            const roleAudience: Models.Services.RoleServiceAudience = {
                type: ServiceAudienceType.Role,
                roleId: viewModel.role!.id
            };
            return roleAudience;
        case ServiceAudienceType.Person:
            const personAudience: Models.Services.PersonServiceAudience = {
                type: ServiceAudienceType.Person,
                personId: viewModel.person!.id
            };
            return personAudience;
    }
}