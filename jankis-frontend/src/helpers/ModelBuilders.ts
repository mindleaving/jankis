import { ServiceAudienceType } from "../types/enums.d";
import { Models } from "../types/models";
import { ViewModels } from "../types/viewModels";

export const buildServiceAudienceModel = (viewModel: ViewModels.ServiceAudienceViewModel): Models.ServiceAudience => {
    switch(viewModel.type) {
        case ServiceAudienceType.All:
            return {
                type: ServiceAudienceType.All
            };
        case ServiceAudienceType.Role:
            const roleAudience: Models.RoleServiceAudience = {
                type: ServiceAudienceType.Role,
                roleId: viewModel.role!.id
            };
            return roleAudience;
        case ServiceAudienceType.Person:
            const personAudience: Models.PersonServiceAudience = {
                type: ServiceAudienceType.Person,
                personId: viewModel.person!.id
            };
            return personAudience;
    }
}