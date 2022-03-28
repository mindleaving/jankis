import { useContext, useMemo, useState } from 'react';
import { Badge, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../localComponents/contexts/UserContext';
import { Autocomplete } from '../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { formatCommandPart } from '../helpers/MedicalCommandFormatters';
import { CommandPartType } from '../types/medicalCommandEnums';
import { MedicalCommands } from '../types/medicalCommandTypes';
import { DiagnosisCommands } from './MedicalCommands/DiagnosisCommands';
import { MedicationCommands } from './MedicalCommands/MedicationCommands';
import { ObservationCommands } from './MedicalCommands/ObservationCommands';
import { TestResultCommands } from './MedicalCommands/TestResultCommands';

import '../styles/medical-command-line.css';
import { resolveText } from '../../sharedCommonComponents/helpers/Globalizer';

interface MedicalCommandlineModalProps {
    personId: string;
    show: boolean;
    onCloseRequested: () => void;
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

    const [ upstreamCommands, setUpstreamCommands ] = useState<MedicalCommands.CommandPart[]>([]);
    const [ parentCommandPart, setParentCommandPart ] = useState<MedicalCommands.CommandPart>();
    const [ activeCommandParts, setActiveCommandParts ] = useState<MedicalCommands.CommandPart[]>(commandHierarchy);
    const [ inputParts, setInputParts ] = useState<string[]>([ 'diagnosis', 'add' ]);

    const filterCommandParts = async (searchText: string): Promise<MedicalCommands.CommandPart[]> => {
        const lowerSearchText = searchText.toLowerCase();
        const keywordParts = activeCommandParts.filter(x => x.type === CommandPartType.Keyword).map(x => x as MedicalCommands.KeywordCommandPart);
        const filteredKeywordParts = keywordParts.filter(x => x.keywords.some(keyword => keyword.startsWith(lowerSearchText)))
        const nonKeywordParts = activeCommandParts.filter(x => x.type !== CommandPartType.Keyword);
        return filteredKeywordParts.map(x => x as MedicalCommands.CommandPart).concat(nonKeywordParts);
    }

    const onCommandPartSelected = (commandPart: MedicalCommands.CommandPart) => {
        setParentCommandPart(commandPart);
        setUpstreamCommands(activeCommandParts);
        setActiveCommandParts(commandPart.contextCommands);
    }
    const onMoveBack = () => {
        // TODO: How to move up and down command hierarchy?
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
                        {inputParts.map(inputPart => (
                            <Badge
                                className='align-self-center mx-1'
                            >
                                {inputPart}
                            </Badge>
                        ))}
                        <Autocomplete<MedicalCommands.CommandPart> 
                            required
                            className="no-border flex-fill"
                            search={filterCommandParts}
                            onItemSelected={onCommandPartSelected}
                            displayNameSelector={formatCommandPart}
                            resetOnSelect
                            minSearchTextLength={1}
                            searchDelayInMilliseconds={0}
                        />
                    </div>
                    <Button 
                        className='mx-2'
                        disabled={!parentCommandPart?.action}
                    >
                        {resolveText("Execute")}
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );

}