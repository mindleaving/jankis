import { FormEvent, useEffect, useState } from 'react';
import { Button, Col, Form, FormCheck, FormGroup, FormLabel, Row, Table } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';
import { MedicationModal } from '../../modals/MedicationModal';
import { Models } from '../../types/models';
import { RowFormGroup } from '../RowFormGroup';
import { StoreButton } from '../StoreButton';
import { MedicationScheduleItemEditTableRow } from './MedicationScheduleItemEditTableRow';

interface MedicationScheduleEditorProps {
    medicationScheduleId: string;
}

export const MedicationScheduleEditor = (props: MedicationScheduleEditorProps) => {

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const [ patientId, setPatientId ] = useState<string>();
    const [ admissionId, setAdmissionId ] = useState<string>();
    const [ name, setName ] = useState<string>('');
    const [ medications, setMedications ] = useState<Models.Medication.MedicationScheduleItem[]>([]);
    const [ note, setNote ] = useState<string>('');
    const [ isPaused, setIsPaused ] = useState<boolean>(false);
    const [ isDispendedByPatient, setIsDispendedByPatient ] = useState<boolean>(false);
    const [ selectedScheduleItemIds, setSelectedScheduleItemIds ] = useState<string[]>([]);
    const [ showMedicationModal, setShowMedicationModal] = useState<boolean>(false);
    const history = useHistory();

    useEffect(() => {
        const loadMedicationSchedule = buildLoadObjectFunc<Models.Medication.MedicationSchedule>(
            `api/medicationschedules/${props.medicationScheduleId}`,
            {},
            resolveText('MedicationSchedule_CouldNotLoad'),
            medicationSchedule => {
                setPatientId(medicationSchedule.patientId);
                setAdmissionId(medicationSchedule.admissionId);
                setName(medicationSchedule.name ?? '');
                setMedications(medicationSchedule.items);
                setNote(medicationSchedule.note);
                setIsPaused(medicationSchedule.isPaused);
                setIsDispendedByPatient(medicationSchedule.isDispendedByPatient);
            },
            () => setIsLoading(false)
        );
        loadMedicationSchedule();
    }, [ props.medicationScheduleId ]);

    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        setIsStoring(true);
        await buidlAndStoreObject<Models.Medication.MedicationSchedule>(
            `api/medicationschedules/${props.medicationScheduleId}`,
            resolveText('MedicationSchedule_SuccessfullyStored'),
            resolveText('MedicationSchedule_CouldNotStore'),
            buildMedicationSchedule,
            () => history.goBack(),
            () => setIsStoring(false)
        );
    }
    const buildMedicationSchedule = (): Models.Medication.MedicationSchedule => {
        return {
            id: props.medicationScheduleId,
            name: name,
            note: note,
            items: medications,
            patientId: patientId!,
            admissionId: admissionId,
            isPaused: isPaused,
            isDispendedByPatient: isDispendedByPatient
        }
    }
    const updateSelection = (isSelected: boolean, medicationId: string) => {
        const alreadyIncluded = selectedScheduleItemIds.includes(medicationId);
        if(isSelected && alreadyIncluded) {
            return;
        }
        if(!isSelected && !alreadyIncluded) {
            return;
        }
        if(isSelected) {
            setSelectedScheduleItemIds(selectedScheduleItemIds.concat(medicationId));
        } else {
            setSelectedScheduleItemIds(selectedScheduleItemIds.filter(x => x !== medicationId));
        }
    }
    const addMedication = async (medication: Models.Medication.MedicationScheduleItem) => {
        setMedications(medications.concat(medication));
    }
    const updateMedication = (medication: Models.Medication.MedicationScheduleItem) => {
        setMedications(medications.map(x => {
            return x.id === medication.id ? medication : x;
        }));
    }
    const deleteMedication = (medicationId: string) => {
        setMedications(medications.filter(x => x.id !== medicationId));
    }
    
    return (
        <>
        <Form onSubmit={store}>
            <RowFormGroup
                label={resolveText('MedicationSchedule_Name')}
                value={name}
                onChange={setName}
            />
            <RowFormGroup
                label={resolveText('MedicationSchedule_Note')}
                as="textarea"
                value={note}
                onChange={setNote}
            />
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('MedicationSchedule_IsPaused')}</FormLabel>
                <Col>
                    <FormCheck
                        checked={isPaused}
                        onChange={(e:any) => setIsPaused(e.target.checked)}
                    />
                </Col>
            </FormGroup>
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('MedicationSchedule_IsDispensedByPatient')}</FormLabel>
                <Col>
                    <FormCheck
                        checked={isDispendedByPatient}
                        onChange={(e:any) => setIsDispendedByPatient(e.target.checked)}
                    />
                </Col>
            </FormGroup>
            <Table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>{resolveText('Medication_Drug')} / {resolveText('Medication_Note')}</th>
                        <th>{resolveText('MedicationSchedule_IsPaused')}</th>
                        <th>{resolveText('MedicationSchedule_IsDispensedByPatient')}</th>
                        <th>{resolveText('MedicationScheduleItem_DispensionsToday')}</th>
                        <th>{resolveText('MedicationScheduleItem_DispensionsTomorrow')}</th>
                    </tr>
                </thead>
                <tbody>
                    {medications.map(medication => (
                        <MedicationScheduleItemEditTableRow
                            medication={medication}
                            patientId={patientId!}
                            admissionId={admissionId}
                            isSelected={selectedScheduleItemIds.includes(medication.id)}
                            onSelectionChanged={(isSelected) => updateSelection(isSelected, medication.id)}
                            onChange={updateMedication}
                            onDelete={deleteMedication}
                        />
                    ))}
                </tbody>
            </Table>
            <Row>
                <Col className="text-center">
                    <Button onClick={() => setShowMedicationModal(true)}>{resolveText('Medication_Add')}</Button>
                </Col>
            </Row>
            <StoreButton
                type="submit"
                isStoring={isStoring}
            />
        </Form>
        <MedicationModal
            show={showMedicationModal}
            onMedicationAdded={addMedication}
            onClose={() => setShowMedicationModal(false)}
        />
        </>
    );

}