import { AutoCompleteContext, HealthRecordEntryType, MeasurementType } from "../../../localComponents/types/enums.d";
import { Models } from "../../../localComponents/types/models";
import { CommandPartType } from "../../types/medicalCommandEnums";
import { MedicalCommands } from "../../types/medicalCommandTypes";
import { v4 as uuid } from 'uuid';
import { sendPutRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { getObjectReferenceValue } from "../../helpers/MedicalCommandHelpers";
import { formatObservation } from "../../helpers/Formatters";
import { ViewModels } from "../../../localComponents/types/viewModels";

export class ObservationCommands {
    personId: string;
    user: ViewModels.IUserViewModel;
    navigate: (path: string) => void;
    commandHierarchy: MedicalCommands.CommandPart;

    addPulseObservation = async (commandParts: MedicalCommands.SelectedCommandPart[]) => {
        const bpm = Number(commandParts[commandParts.length-1].selectedValue);
        const pulseObservation: Models.Observations.PulseObservation = {
            id: uuid(),
            type: HealthRecordEntryType.Observation,
            createdBy: this.user.accountId,
            personId: this.personId,
            timestamp: new Date(),
            isVerified: false,
            hasBeenSeenBySharer: this.user.profileData.id === this.personId,
            measurementType: MeasurementType.Pulse,
            bpm: bpm
        };
        let isSuccess = false;
        await sendPutRequest(
            `api/observations/${pulseObservation.id}`,
            resolveText("Observation_CouldNotStore"),
            pulseObservation,
            response => isSuccess = response.ok
        );
        return isSuccess;
    }
    addBloodpressureObservation = async (commandParts: MedicalCommands.SelectedCommandPart[]) => {
        const bloodPressure = commandParts[commandParts.length-1].selectedValue.split('/');
        const systolic = Number(bloodPressure[0]);
        const diastolic = Number(bloodPressure[1]);
        const bloodPressureObservation: Models.Observations.BloodPressureObservation = {
            id: uuid(),
            type: HealthRecordEntryType.Observation,
            createdBy: this.user.accountId,
            personId: this.personId,
            timestamp: new Date(),
            isVerified: false,
            hasBeenSeenBySharer: this.user.profileData.id === this.personId,
            measurementType: MeasurementType.BloodPressure,
            systolic: systolic,
            diastolic: diastolic
        };
        let isSuccess = false;
        await sendPutRequest(
            `api/observations/${bloodPressureObservation.id}`,
            resolveText("Observation_CouldNotStore"),
            bloodPressureObservation,
            response => isSuccess = response.ok
        );
        return isSuccess;
    }
    addTemperatureObservation = async (commandParts: MedicalCommands.SelectedCommandPart[]) => {
        const temperature = Number(commandParts[commandParts.length-1].selectedValue.replace(',','.'));
        const temperatureObservation: Models.Observations.TemperatureObservation = {
            id: uuid(),
            type: HealthRecordEntryType.Observation,
            createdBy: this.user.accountId,
            personId: this.personId,
            timestamp: new Date(),
            isVerified: false,
            hasBeenSeenBySharer: this.user.profileData.id === this.personId,
            measurementType: MeasurementType.Temperature,
            value: temperature,
            unit: '°C'
        };
        let isSuccess = false;
        await sendPutRequest(
            `api/observations/${temperatureObservation.id}`,
            resolveText("Observation_CouldNotStore"),
            temperatureObservation,
            response => isSuccess = response.ok
        );
        return isSuccess;
    }
    addGenericObservation = async (commandParts: MedicalCommands.SelectedCommandPart[]) => {
        const measurementType = commandParts[2].selectedValue;
        const value = commandParts[3].selectedValue;
        const unit = commandParts.length > 4 ? commandParts[4].selectedValue : undefined;
        const genericObservation: Models.Observations.GenericObservation = {
            id: uuid(),
            type: HealthRecordEntryType.Observation,
            createdBy: this.user.accountId,
            personId: this.personId,
            timestamp: new Date(),
            isVerified: false,
            hasBeenSeenBySharer: this.user.profileData.id === this.personId,
            measurementType: measurementType,
            value: value,
            unit: unit
        };
        let isSuccess = false;
        await sendPutRequest(
            `api/observations/${genericObservation.id}`,
            resolveText("Observation_CouldNotStore"),
            genericObservation,
            response => isSuccess = response.ok
        );
        return isSuccess;
    }

    editObservation = async (commandParts: MedicalCommands.SelectedCommandPart[]) => {
        const observation = getObjectReferenceValue<Models.Observations.Observation>(commandParts, "Observation");
        const observationId = observation!.id;
        this.navigate(`/healthrecord/${this.personId}/edit/observation/${observationId}`);
        return true;
    }

    constructor(
        personId: string, 
        user: ViewModels.IUserViewModel, 
        navigate: (path: string) => void) {
            this.personId = personId;
            this.user = user;
            this.navigate = navigate;
            this.commandHierarchy = {
                type: CommandPartType.Keyword,
                keywords: ['observation'],
                contextCommands: [
                    {
                        type: CommandPartType.Keyword,
                        keywords: ['add'],
                        contextCommands: [
                            {
                                type: CommandPartType.Keyword,
                                keywords: ['pulse'],
                                contextCommands: [
                                    {
                                        type: CommandPartType.Pattern,
                                        description: 'BPM',
                                        pattern: '[0-9]+',
                                        action: this.addPulseObservation,
                                        contextCommands: []
                                    } as MedicalCommands.PatternCommandPart
                                ]
                            } as MedicalCommands.KeywordCommandPart,
                            {
                                type: CommandPartType.Keyword,
                                keywords: ['bloodpressure', 'bp', 'rr'],
                                contextCommands: [
                                    {
                                        type: CommandPartType.Pattern,
                                        description: 'Systolic/diastolic',
                                        pattern: '[0-9]+/[0-9]+',
                                        action: this.addBloodpressureObservation,
                                        contextCommands: []
                                    } as MedicalCommands.PatternCommandPart
                                ]
                            } as MedicalCommands.KeywordCommandPart,
                            {
                                type: CommandPartType.Keyword,
                                keywords: ['temperature', 'temp'],
                                contextCommands: [
                                    {
                                        type: CommandPartType.Pattern,
                                        description: 'Temperature in °C',
                                        pattern: '[0-9]+([,.][0-9]+)?',
                                        action: this.addTemperatureObservation,
                                        contextCommands: []
                                    } as MedicalCommands.PatternCommandPart
                                ]
                            } as MedicalCommands.KeywordCommandPart,
                            {
                                type: CommandPartType.AutoComplete,
                                description: 'Other',
                                context: AutoCompleteContext.MeasurementType,
                                contextCommands: [
                                    {
                                        type: CommandPartType.FreeText,
                                        description: 'Value',
                                        action: this.addGenericObservation,
                                        contextCommands: [
                                            {
                                                type: CommandPartType.AutoComplete,
                                                context: AutoCompleteContext.Unit,
                                                description: 'Unit',
                                                action: this.addGenericObservation,
                                                contextCommands: []
                                            } as MedicalCommands.AutoCompleteCommandPart,
                                            {
                                                type: CommandPartType.FreeText,
                                                description: 'Unit',
                                                action: this.addGenericObservation,
                                                contextCommands: []
                                            } as MedicalCommands.FreeTextCommandPart
                                        ]
                                    } as MedicalCommands.FreeTextCommandPart
                                ]
                            } as MedicalCommands.AutoCompleteCommandPart,
                            {
                                type: CommandPartType.FreeText,
                                description: 'Other',
                                contextCommands: [
                                    {
                                        type: CommandPartType.FreeText,
                                        description: 'Value',
                                        action: this.addGenericObservation,
                                        contextCommands: [
                                            {
                                                type: CommandPartType.AutoComplete,
                                                context: AutoCompleteContext.Unit,
                                                description: 'Unit',
                                                action: this.addGenericObservation,
                                                contextCommands: []
                                            } as MedicalCommands.AutoCompleteCommandPart,
                                            {
                                                type: CommandPartType.FreeText,
                                                description: 'Unit',
                                                action: this.addGenericObservation,
                                                contextCommands: []
                                            } as MedicalCommands.FreeTextCommandPart
                                        ]
                                    } as MedicalCommands.FreeTextCommandPart
                                ]
                            } as MedicalCommands.FreeTextCommandPart
                        ]
                    },
                    {
                        type: CommandPartType.Keyword,
                        keywords: ['edit'],
                        contextCommands: [
                            {
                                type: CommandPartType.ObjectReference,
                                description: 'Observation',
                                objectType: 'Observation',
                                autocompleteUrl: `api/persons/${this.personId}/observations`,
                                searchParameter: 'searchText',
                                displayFunc: (observation: Models.Observations.Observation) => formatObservation(observation),
                                action: this.editObservation,
                                contextCommands: []
                            } as MedicalCommands.ObjectReferenceCommandPart
                        ]
                    }
                ] as MedicalCommands.KeywordCommandPart[]
            } as MedicalCommands.KeywordCommandPart;
    }
}