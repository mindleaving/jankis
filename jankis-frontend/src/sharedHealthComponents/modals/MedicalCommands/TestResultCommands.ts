import { DiagnosticTestScaleType, HealthRecordEntryType } from "../../../localComponents/types/enums.d";
import { Models } from "../../../localComponents/types/models";
import { CommandPartType } from "../../types/medicalCommandEnums";
import { MedicalCommands } from "../../types/medicalCommandTypes";
import { v4 as uuid } from 'uuid';
import { sendPutRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";

export class TestResultCommands {
    personId: string;
    username: string;
    navigate: (path: string) => void;
    commandHierarchy: MedicalCommands.CommandPart;

    addTestResult = async (commandParts: MedicalCommands.SelectedCommandPart[]) => {
        const loincCode = commandParts[2].selectedValue;
        const value = commandParts[3].selectedValue;
        const testResult: Models.DiagnosticTestResults.FreetextDiagnosticTestResult = {
            id: uuid(),
            type: HealthRecordEntryType.TestResult,
            createdBy: this.username,
            personId: this.personId,
            timestamp: new Date(),
            testCodeLoinc: loincCode,
            testName: '',
            scaleType: DiagnosticTestScaleType.Undefined,
            text: value
        };
        let isSuccess = false;
        await sendPutRequest(
            `api/testresults/${testResult.id}`,
            resolveText("TestResult_CouldNotStore"),
            testResult,
            response => isSuccess = response.ok
        );
        return isSuccess;
    }

    gotoTestResults = () => {
        this.navigate(`/healthrecord/${this.personId}#test-results`);
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
                keywords: ['test', 'testresult', 'lab', 'labresult' ],
                contextCommands: [
                    {
                        type: CommandPartType.Keyword,
                        keywords: ['add'],
                        contextCommands: [
                            {
                                type: CommandPartType.ObjectReference,
                                description: 'LOINC code',
                                autocompleteUrl: 'api/diagnostictests/search',
                                contextCommands: [
                                    {
                                        type: CommandPartType.FreeText,
                                        description: 'Value',
                                        action: this.addTestResult,
                                        contextCommands: []
                                    } as MedicalCommands.FreeTextCommandPart
                                ]
                            } as MedicalCommands.ObjectReferenceCommandPart
                        ]
                    },
                    {
                        type: CommandPartType.Keyword,
                        keywords: ['show'],
                        action: this.gotoTestResults,
                        contextCommands: []
                    }
                ] as MedicalCommands.KeywordCommandPart[]
            } as MedicalCommands.KeywordCommandPart;
    }
}