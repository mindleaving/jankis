import React, { FormEvent, useState } from 'react';
import { Button, Col, Form, FormGroup, FormLabel, Modal, Row } from 'react-bootstrap';
import { DrugAutocomplete } from '../components/Autocompletes/DrugAutocomplete';
import { resolveText } from '../helpers/Globalizer';
import { Models } from '../types/models';
import { v4 as uuid } from 'uuid';

interface MedicationModalProps {
    show: boolean;
    onMedicationAdded: (medication: Models.MedicationScheduleItem) => void;
    onClose: () => void;
}

export const MedicationModal = (props: MedicationModalProps) => {

    const [ selectedDrug, setSelectedDrug ] = useState<Models.Drug>();
    const addMedication = (e?: FormEvent) => {
        e?.preventDefault();
        if(!selectedDrug) {
            return;
        }
        const medication: Models.MedicationScheduleItem = {
            id: uuid(),
            drug: selectedDrug!,
            dispensions: [],
            isDispendedByPatient: false,
            isPaused: false,
            note: ''
        };
        props.onMedicationAdded(medication);
        props.onClose();
        setSelectedDrug(undefined);
    }
    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{resolveText('AddMedication')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="MedicationModal" onSubmit={addMedication}>
                    <FormGroup as={Row}>
                        <FormLabel column>{resolveText('Medication_Drug')}</FormLabel>
                        <Col>
                            <DrugAutocomplete
                                value={selectedDrug}
                                onChange={setSelectedDrug}
                            />
                        </Col>
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.onClose()}>{resolveText('Cancel')}</Button>
                <Button type="submit" form="MedicationModal" disabled={!selectedDrug}>{resolveText('Add')}</Button>
            </Modal.Footer>
        </Modal>
    );

}