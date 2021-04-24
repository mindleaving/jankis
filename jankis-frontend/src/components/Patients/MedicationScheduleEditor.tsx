import React, { FormEvent, useEffect, useState } from 'react';
import { Col, Form, FormCheck, FormControl, FormGroup, FormLabel, Row, Table } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { formatDrug } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';
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
    const [ medications, setMedications ] = useState<Models.MedicationScheduleItem[]>([]);
    const [ note, setNote ] = useState<string>('');
    const [ isPaused, setIsPaused ] = useState<boolean>(false);
    const [ isDispendedByPatient, setIsDispendedByPatient ] = useState<boolean>(false);
    const [ selectedScheduleItemIds, setSelectedScheduleItemIds ] = useState<string[]>([]);
    const history = useHistory();

    useEffect(() => {
        const loadMedicationSchedule = buildLoadObjectFunc<Models.MedicationSchedule>(
            `api/medicationschedules/${props.medicationScheduleId}`,
            {},
            resolveText('MedicationSchedule_CouldNotLoad'),
            medicationSchedule => {
                setName(medicationSchedule.name ?? '');
                setMedications(medicationSchedule.items);
                setNote(medicationSchedule.note);
            },
            () => setIsLoading(false)
        );
        loadMedicationSchedule();
    }, [ props.medicationScheduleId ]);

    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        setIsStoring(true);
        await buidlAndStoreObject<Models.MedicationSchedule>(
            `api/medicationschedules/${props.medicationScheduleId}`,
            resolveText('MedicationSchedule_SuccessfullyStored'),
            resolveText('MedicationSchedule_CouldNotStore'),
            buildMedicationSchedule,
            () => history.goBack(),
            () => setIsStoring(false)
        );
    }
    const buildMedicationSchedule = (): Models.MedicationSchedule => {
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
    const updateMedication = (medication: Models.MedicationScheduleItem) => {
        setMedications(medications.map(x => {
            return x.id === medication.id ? medication : x;
        }));
    }
    const deleteMedication = (medicationId: string) => {
        setMedications(medications.filter(x => x.id !== medicationId));
    }
    
    return (
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
                        <th>{resolveText('Medication_Drug')}</th>
                        <th>{resolveText('Medication_Note')}</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {medications.map(medication => (
                        <MedicationScheduleItemEditTableRow
                            medication={medication}
                            isSelected={selectedScheduleItemIds.includes(medication.id)}
                            onSelectionChanged={(isSelected) => updateSelection(isSelected, medication.id)}
                            onStore={updateMedication}
                            onDelete={deleteMedication}
                        />
                    ))}
                </tbody>
            </Table>
            <StoreButton
                type="submit"
                isStoring={isStoring}
            />
        </Form>
    );

}