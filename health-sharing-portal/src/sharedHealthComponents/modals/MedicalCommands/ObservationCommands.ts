import { HealthRecordEntryType, MeasurementType } from "../../../localComponents/types/enums.d";
import { Models } from "../../../localComponents/types/models";
import { CommandPartType } from "../../types/medicalCommandEnums";
import { MedicalCommands } from "../../types/medicalCommandTypes";
import { v4 as uuid } from 'uuid';
import { storeObject } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";

export class ObservationCommands {
    personId: string;
    username: string;
    navigate: (path: string) => void;

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
        await storeObject(
            `api/observations/${pulseObservation.id}`,
            resolveText("Observation_CouldNotStore"),
            pulseObservation
        );
    }

    commandHierarchy: MedicalCommands.CommandPart = {
        type: CommandPartType.Keyword,
        value: 'observation',
        contextCommands: [
            {
                type: CommandPartType.Keyword,
                value: 'add',
                contextCommands: [
                    {
                        type: CommandPartType.Keyword,
                        value: 'pulse',
                        contextCommands: [
                            {
                                type: CommandPartType.Pattern,
                                pattern: '[0-9]+',
                                action: this.addPulseObservation,
                                contextCommands: []
                            } as MedicalCommands.PatternCommandPart
                        ]
                    }
                ] as MedicalCommands.KeywordCommandPart[]
            }
        ] as MedicalCommands.KeywordCommandPart[]
    } as MedicalCommands.KeywordCommandPart;

    constructor(
        personId: string, 
        username: string, 
        navigate: (path: string) => void) {
            this.personId = personId;
            this.username = username;
            this.navigate = navigate;
    }
}