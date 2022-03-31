import { KeyboardEvent, useContext, useMemo, useState } from 'react';
import { Badge, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../localComponents/contexts/UserContext';
import { Autocomplete } from '../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { formatSelectedCommandPart } from '../helpers/MedicalCommandFormatters';
import { CommandPartType } from '../types/medicalCommandEnums';
import { MedicalCommands } from '../types/medicalCommandTypes';
import { DiagnosisCommands } from './MedicalCommands/DiagnosisCommands';
import { MedicationCommands } from './MedicalCommands/MedicationCommands';
import { ObservationCommands } from './MedicalCommands/ObservationCommands';
import { TestResultCommands } from './MedicalCommands/TestResultCommands';
import { NotificationManager} from 'react-notifications';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';
import { groupBy } from '../../sharedCommonComponents/helpers/CollectionHelpers';
import { AutocompleteRunner } from '../../sharedCommonComponents/helpers/AutocompleteRunner';

import '../styles/medical-command-line.css';

interface MedicalCommandlineModalProps {
    personId: string;
    show: boolean;
    closeOnSuccess?: boolean;
    onCloseRequested: () => void;
    onCommandSuccessful?: () => void;
}

export const MedicalCommandlineModal = (props: MedicalCommandlineModalProps) => {

    const navigate = useNavigate();
    const user = useContext(UserContext);
    const personId = props.personId;

    const diagnosisCommands = useMemo(() => new DiagnosisCommands(personId, user!.username, navigate), [ personId, user, navigate ]);
    const observationCommands = useMemo(() => new ObservationCommands(personId, user!.username, navigate), [ personId, user, navigate ]);
    const medicationCommands = useMemo(() => new MedicationCommands(personId, user!.username, navigate), [ personId, user, navigate ]);
    const testResultCommands = useMemo(() => new TestResultCommands(personId, user!.username, navigate), [ personId, user, navigate ]);
    const commandHierarchy: MedicalCommands.CommandPart[] = useMemo(() => [
        diagnosisCommands.commandHierarchy,
        observationCommands.commandHierarchy,
        medicationCommands.commandHierarchy,
        testResultCommands.commandHierarchy
    ], [ diagnosisCommands, observationCommands, medicationCommands, testResultCommands ]);

    const [ activeCommandParts, setActiveCommandParts ] = useState<MedicalCommands.CommandPart[]>(commandHierarchy);
    const [ selectedParts, setSelectedParts ] = useState<MedicalCommands.SelectedCommandPart[]>([]);
    const [ moveBackOnNextBackspace, setMoveBackOnNextBackspace ] = useState<boolean>(false);

    const filterCommandParts = async (searchText: string): Promise<MedicalCommands.SelectedCommandPart[]> => {
        const groupedParts = groupBy(activeCommandParts, x => x.type);

        // Keywords
        const lowerSearchText = searchText.toLowerCase();
        const keywordParts = groupedParts
            .find(group => group.key === CommandPartType.Keyword)?.items
            .map(x => x as MedicalCommands.KeywordCommandPart) 
            ?? [];
        const filteredKeywordParts = keywordParts.filter(x => x.keywords.some(keyword => keyword.startsWith(lowerSearchText)));
        const selectedKeywords = filteredKeywordParts.map(x => ({
            commandPart: x,
            selectedValue: x.keywords.find(keyword => keyword.startsWith(lowerSearchText))
        } as MedicalCommands.SelectedCommandPart));

        // Object references
        const objectReferenceParts = groupedParts
            .find(group => group.key === CommandPartType.ObjectReference)?.items
            .map(x => x as MedicalCommands.ObjectReferenceCommandPart)
            ?? [];
        const selectedObjectReferences: MedicalCommands.SelectedCommandPart[] = [];
        for (const part of objectReferenceParts) {
            const autocompleteRunner = new AutocompleteRunner(part.autocompleteUrl, part.searchParameter, 10);
            const matches = await autocompleteRunner.search(searchText);
            for (const match of matches) {
                const selectedObjectReference: MedicalCommands.SelectedCommandPart = {
                    commandPart: part,
                    selectedValue: match
                };
                selectedObjectReferences.push(selectedObjectReference);
            }
        }

        // Autocomplete
        const autoCompleteParts = groupedParts
            .find(group => group.key === CommandPartType.AutoComplete)?.items
            .map(x => x as MedicalCommands.AutoCompleteCommandPart)
            ?? [];
        const selectedAutoCompletes: MedicalCommands.SelectedCommandPart[] = [];
        for (const part of autoCompleteParts) {
            const autocompleteRunner = new AutocompleteRunner(`api/autocomplete/${part.context}`, 'searchText', 10);
            const matches = await autocompleteRunner.search(searchText);
            for (const match of matches) {
                const selectedAutoComplete: MedicalCommands.SelectedCommandPart = {
                    commandPart: part,
                    selectedValue: match
                };
                selectedAutoCompletes.push(selectedAutoComplete);
            }
        }

        // Pattern
        const patternParts = groupedParts
            .find(group => group.key === CommandPartType.Pattern)?.items
            .map(x => x as MedicalCommands.PatternCommandPart)
            ?? [];
        const filteredPatterns = patternParts.filter(x => !!new RegExp(x.pattern).test(searchText));
        const selectedPatterns = filteredPatterns.map(x => ({
            commandPart: x,
            selectedValue: searchText
        } as MedicalCommands.SelectedCommandPart));

        // Freetext
        const freetextParts = groupedParts
            .find(group => group.key === CommandPartType.FreeText)?.items
            .map(x => x as MedicalCommands.FreeTextCommandPart)
            ?? [];
        const selectedFreetexts = freetextParts.map(x => ({
            commandPart: x,
            selectedValue: searchText
        } as MedicalCommands.SelectedCommandPart));

        return selectedKeywords
            .concat(selectedObjectReferences)
            .concat(selectedAutoCompletes)
            .concat(selectedPatterns)
            .concat(selectedFreetexts);
    }

    const onCommandPartSelected = (selectedPart: MedicalCommands.SelectedCommandPart) => {
        setSelectedParts(state => state.concat(selectedPart));
        setActiveCommandParts(selectedPart.commandPart.contextCommands);
    }
    
    const onMoveBack = () => {
        if(selectedParts.length === 0) {
            return; // Cannot move further back
        }
        if(selectedParts.length === 1) {
            setActiveCommandParts(commandHierarchy);
            setSelectedParts([]);
        }
        console.log(selectedParts);
        const parentCommandPart = selectedParts[selectedParts.length-2];
        setActiveCommandParts(parentCommandPart.commandPart.contextCommands);
        setSelectedParts(state => state.filter((_,index) => index < state.length - 1));
    }

    const executeAction = async () => {
        if(selectedParts.length === 0) {
            return;
        }
        const lastSelectedPart = selectedParts[selectedParts.length - 1];
        if(!lastSelectedPart.commandPart.action) {
            return;
        }
        if(await lastSelectedPart.commandPart.action(selectedParts)) {
            NotificationManager.success(resolveText("MedicalCommand_SuccessfullyExecuted"));
            if(props.onCommandSuccessful) {
                props.onCommandSuccessful();
            }
            if(props.closeOnSuccess) {
                props.onCloseRequested();
            }
            setSelectedParts([]);
            setActiveCommandParts(commandHierarchy);
        }
    }

    const onKeyPress = (keyEvent: KeyboardEvent<HTMLElement>, currentSearchText: string) => {
        if(currentSearchText === '' && keyEvent.key === "Backspace") {
            if(!moveBackOnNextBackspace) {
                setMoveBackOnNextBackspace(true);
            } else {
                onMoveBack();
            }
        } else {
            setMoveBackOnNextBackspace(false);
        }
        if(keyEvent.key === "Enter" && keyEvent.shiftKey) {
            executeAction();
        }
    }    


    return (
        <Modal 
            size='lg'
            show={props.show} 
            onHide={props.onCloseRequested}
            centered
        >
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <div className='d-flex'>
                    <div className='d-flex flex-grow-1 border border-dark'>
                        {selectedParts.map(selectedPart => (
                            <Badge
                                className='align-self-center mx-1'
                            >
                                {formatSelectedCommandPart(selectedPart)}
                            </Badge>
                        ))}
                        <Autocomplete<MedicalCommands.SelectedCommandPart> 
                            required
                            autoFocus
                            className="no-border flex-fill"
                            search={filterCommandParts}
                            onItemSelected={onCommandPartSelected}
                            onKeyUp={onKeyPress}
                            displayNameSelector={formatSelectedCommandPart}
                            resetOnSelect
                            minSearchTextLength={1}
                            searchDelayInMilliseconds={0}
                        />
                    </div>
                    <Button 
                        className='mx-2'
                        onClick={executeAction}
                        disabled={selectedParts.length === 0 || !selectedParts[selectedParts.length-1]?.commandPart.action}
                    >
                        {resolveText("Execute")}
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );

}