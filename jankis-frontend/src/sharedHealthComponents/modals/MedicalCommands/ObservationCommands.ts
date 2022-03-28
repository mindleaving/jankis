import { HealthRecordEntryType, MeasurementType } from "../../../localComponents/types/enums.d";
import { Models } from "../../../localComponents/types/models";
import { CommandPartType } from "../../types/medicalCommandEnums";
import { MedicalCommands } from "../../types/medicalCommandTypes";
import { v4 as uuid } from 'uuid';
import { sendPutRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";

export class ObservationCommands {
    personId: string;
    username: string;
    navigate: (path: string) => void;
    commandHierarchy: MedicalCommands.CommandPart;

    addPulseObservation = async (commandParts: string[]) => {
        const bpm = Number(commandParts[commandParts.length-1]);
        const pulseObservation: Models.Observations.PulseObservation = {
            id: uuid(),
            type: HealthRecordEntryType.Observation,
            createdBy: this.username,
            personId: this.personId,
            timestamp: new Date(),
            measurementType: MeasurementType.Pulse,
            bpm: bpm
        };
        await sendPutRequest(
            `api/observations/${pulseObservation.id}`,
            resolveText("Observation_CouldNotStore"),
            pulseObservation
        );
    }
    addBloodpressureObservation = async (commandParts: string[]) => {
        const bloodPressure = commandParts[commandParts.length-1].split('/');
        const systolic = Number(bloodPressure[0]);
        const diastolic = Number(bloodPressure[1]);
        const bloodPressureObservation: Models.Observations.BloodPressureObservation = {
            id: uuid(),
            type: HealthRecordEntryType.Observation,
            createdBy: this.username,
            personId: this.personId,
            timestamp: new Date(),
            measurementType: MeasurementType.BloodPressure,
            systolic: systolic,
            diastolic: diastolic
        };
        await sendPutRequest(
            `api/observations/${bloodPressureObservation.id}`,
            resolveText("Observation_CouldNotStore"),
            bloodPressureObservation
        );
    }
    addTemperatureObservation = async (commandParts: string[]) => {
        const temperature = Number(commandParts[commandParts.length-1].replace(',','.'));
        const temperatureObservation: Models.Observations.TemperatureObservation = {
            id: uuid(),
            type: HealthRecordEntryType.Observation,
            createdBy: this.username,
            personId: this.personId,
            timestamp: new Date(),
            measurementType: MeasurementType.Temperature,
            value: temperature,
            unit: '°C'
        };
        await sendPutRequest(
            `api/observations/${temperatureObservation.id}`,
            resolveText("Observation_CouldNotStore"),
            temperatureObservation
        );
    }
    addGenericObservation = async (commandParts: string[]) => {
        const measurementType = commandParts[2];
        const value = commandParts[3];
        const unit = commandParts.length > 4 ? commandParts[4] : undefined;
        const genericObservation: Models.Observations.GenericObservation = {
            id: uuid(),
            type: HealthRecordEntryType.Observation,
            createdBy: this.username,
            personId: this.personId,
            timestamp: new Date(),
            measurementType: measurementType,
            value: value,
            unit: unit
        };
        await sendPutRequest(
            `api/observations/${genericObservation.id}`,
            resolveText("Observation_CouldNotStore"),
            genericObservation
        );
    }

    editObservation = (commandParts: string[]) => {
        const observationId = commandParts[commandParts.length-1];
        this.navigate(`/healthrecord/${this.personId}/edit/observation/${observationId}`);
    }

    constructor(
        personId: string, 
        username: string, 
        navigate: (path: string) => void) {
            this.personId = personId;
            this.username = username;
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
                                type: CommandPartType.FreeText,
                                description: 'Other',
                                contextCommands: [
                                    {
                                        type: CommandPartType.FreeText,
                                        description: 'Value',
                                        action: this.addGenericObservation,
                                        contextCommands: [
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
                                autocompleteUrl: `api/persons/${this.personId}/observations`,
                                action: this.editObservation,
                                contextCommands: []
                            } as MedicalCommands.ObjectReferenceCommandPart
                        ]
                    }
                ] as MedicalCommands.KeywordCommandPart[]
            } as MedicalCommands.KeywordCommandPart;
    }
}