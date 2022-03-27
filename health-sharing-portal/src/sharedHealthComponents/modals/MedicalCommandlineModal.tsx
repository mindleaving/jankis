import { useContext, useMemo, useState } from 'react';
import { FormControl, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../localComponents/contexts/UserContext';
import { MedicalCommands } from '../types/medicalCommandTypes';
import { DiagnosisCommands } from './MedicalCommands/DiagnosisCommands';
import { ObservationCommands } from './MedicalCommands/ObservationCommands';

interface MedicalCommandlineModalProps {
    personId: string;
}

export const MedicalCommandlineModal = (props: MedicalCommandlineModalProps) => {

    const navigate = useNavigate();
    const user = useContext(UserContext);
    const personId = props.personId;
    

    const diagnosisCommands = useMemo(() => new DiagnosisCommands(personId, user!.username, navigate), [ personId, user, navigate ]);
    const observationCommands = useMemo(() => new ObservationCommands(personId, user!.username, navigate), [ personId, user, navigate ]);

    const commandHierarchy: MedicalCommands.CommandPart[] = [
        diagnosisCommands.commandHierarchy,
        observationCommands.commandHierarchy
    ];

    const [ commandText, setCommandText ] = useState<string>('');

    return (
        <Modal>
            <Modal.Body>
                <FormControl
                    value={commandText}
                    onChange={(e:any) => setCommandText(e.target.value)}
                />
            </Modal.Body>
        </Modal>
    );

}