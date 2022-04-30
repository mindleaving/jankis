import { HealthRecordEntryType, DiagnosticTestScaleType } from "../../../localComponents/types/enums.d";
import { Models } from "../../../localComponents/types/models";
import { CommandPartType } from "../../types/medicalCommandEnums";
import { MedicalCommands } from "../../types/medicalCommandTypes";
import { v4 as uuid } from 'uuid';
import { sendPutRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { ViewModels } from "../../../localComponents/types/viewModels";
import { formatDiagnosticTestCode } from "../../helpers/Formatters";
import { NotificationManager } from 'react-notifications';

export class TestResultCommands {
    personId: string;
    user: ViewModels.IUserViewModel;
    navigate: (path: string) => void;
    commandHierarchy: MedicalCommands.CommandPart;

    addTestResult = async (commandParts: MedicalCommands.SelectedCommandPart[]) => {
        const testDefinition = commandParts[2].selectedValue as Models.Services.DiagnosticTestDefinition;
        const value = commandParts[3].selectedValue;
        let testResult: Models.DiagnosticTestResults.DiagnosticTestResult = {
            id: uuid(),
            type: HealthRecordEntryType.TestResult,
            createdBy: this.user.accountId,
            personId: this.personId,
            timestamp: new Date(),
            isVerified: false,
            hasBeenSeenBySharer: this.user!.profileData.id === this.personId,
            testCodeLoinc: testDefinition.testCodeLoinc,
            testName: testDefinition.name,
            testCategory: testDefinition.category,
            scaleType: testDefinition.scaleType
        };
        switch(testDefinition.scaleType) {
            case DiagnosticTestScaleType.Quantitative:
                case DiagnosticTestScaleType.OrdinalOrQuantitative:
                const quantitativeTestResult = testResult as Models.DiagnosticTestResults.QuantitativeDiagnosticTestResult;
                const [ parsedValue, parsedUnit ] = this.parseQuantitativeValue(value);
                quantitativeTestResult.value = parsedValue;
                quantitativeTestResult.unit = parsedUnit;
                testResult = quantitativeTestResult;
                break;
            case DiagnosticTestScaleType.Nominal:
                const nominalTestResult = testResult as Models.DiagnosticTestResults.NominalDiagnosticTestResult;
                nominalTestResult.value = value;
                testResult = nominalTestResult;
                break;
            case DiagnosticTestScaleType.Ordinal:
                const ordinalTestResult = testResult as Models.DiagnosticTestResults.OrdinalDiagnosticTestResult;
                ordinalTestResult.value = value;
                testResult = ordinalTestResult;
                break;
            case DiagnosticTestScaleType.Freetext:
                const freeTextTestResult = testResult as Models.DiagnosticTestResults.FreetextDiagnosticTestResult;
                freeTextTestResult.text = value;
                testResult = freeTextTestResult;
                break;
            default:
                NotificationManager.error(resolveText("MedicalCommand_TestResult_UnsupportedScaleType"));
                return;
        }
        let isSuccess = false;
        await sendPutRequest(
            `api/testresults/${testResult.id}`,
            resolveText("TestResult_CouldNotStore"),
            testResult,
            response => isSuccess = response.ok
        );
        return isSuccess;
    }

    parseQuantitativeValue = (value: string): [ value: number, unit: string] => {
        const match = value.trim().match(/([-0-9.,]+)(\s*[a-zA-Z].*)?/);
        if(!match) {
            return [ 0, '' ];
        }
        const parsedValue = Number(match[1].replace(",", "."));
        const parsedUnit = match.length > 2 ? match[2].trim() : '';
        return [ parsedValue, parsedUnit ];
    }

    gotoTestResults = () => {
        this.navigate(`/healthrecord/${this.personId}#test-results`);
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
                keywords: ['test', 'testresult', 'lab', 'labresult' ],
                contextCommands: [
                    {
                        type: CommandPartType.Keyword,
                        keywords: ['add'],
                        contextCommands: [
                            {
                                type: CommandPartType.ObjectReference,
                                description: '',
                                autocompleteUrl: 'api/diagnostictests/search',
                                searchParameter: 'searchText',
                                displayFunc: formatDiagnosticTestCode,
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