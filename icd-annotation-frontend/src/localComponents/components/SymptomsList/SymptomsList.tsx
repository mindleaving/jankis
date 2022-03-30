import React, { useCallback, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { NotificationManager } from 'react-notifications';
import { confirmAlert } from 'react-confirm-alert';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { PagedTable } from '../../../sharedCommonComponents/components/PagedTable';
import { formatBodyStructure } from '../../helpers/Formatters';
import { SymptomModal } from '../../modals/SymptomModal';
import { SymptomType } from '../../types/enums.d';
import { Models } from '../../types/models';

export interface SymptomsFilters {
    searchText?: string;
}

interface SymptomsListProps {
    filter: SymptomsFilters;
    onSymptomSelected: (symptom: Models.Symptoms.Symptom) => void;
}

export const SymptomsList = (props: SymptomsListProps) => {

    const [ symptoms, setSymptoms ] = useState<Models.Symptoms.Symptom[]>([]);
    const [ showSymptomModal, setShowSymptomModal ] = useState<boolean>(false);
    const [ selectedSymptom, setSelectedSymptom ] = useState<Models.Symptoms.Symptom>();

    const loadSymptoms = useCallback(async (pageIndex: number, entriesPerPage: number) => {
        try {
            let response;
            if(props.filter.searchText) {
                response = await apiClient.instance!.get(
                    'api/symptoms/search',
                    { 
                        searchText: props.filter.searchText,
                        count: entriesPerPage + '',
                        skip: (pageIndex * entriesPerPage) + ''
                    });
            } else {
                response = await apiClient.instance!.get('api/symptoms', {
                    count: entriesPerPage + '',
                    skip: (pageIndex * entriesPerPage) + ''
                });
            }
            const symptoms = await response.json() as Models.Symptoms.Symptom[];
            setSymptoms(symptoms);
        } catch(error: any) {
            NotificationManager.error(error.message, 'Could not load symptoms');
        }
    }, [ props.filter ]);

    
    const editSymptom = (symptom: Models.Symptoms.Symptom) => {
        if(!symptom) {
            return;
        }
        setSelectedSymptom(symptom);
        setShowSymptomModal(true);
    }
    const updateSymptom = (symptom: Models.Symptoms.Symptom) => {
        setSymptoms(symptoms.map(x => {
            if(x.id === symptom.id) {
                return symptom;
            }
            return x;
        }));
    }
    const getBodyStructures = (symptom: Models.Symptoms.Symptom) => {
        if(symptom.type === SymptomType.Localized) {
            const localizedSymptom = symptom as Models.Symptoms.LocalizedSymptom;
            return localizedSymptom.bodyStructures ?? [];
        }
        return [];
    }
    const deleteSymptom = async (symptom: Models.Symptoms.Symptom, isConfirmed: boolean = false) => {
        if(!isConfirmed) {
            confirmDeleteSymptom(symptom);
            return;
        }
        try {
            const id = symptom.id;
            await apiClient.instance!.delete(`api/symptoms/${id}`, {});
            NotificationManager.success('Symptom deleted!');
            setSymptoms(symptoms.filter(x => x.id !== id));
        } catch(error: any) {
            NotificationManager.error('Could not delete symptom', error.message);
        }
    }
    const confirmDeleteSymptom = (symptom: Models.Symptoms.Symptom) => {
        confirmAlert({
            title: `Delete ${symptom.name}?`,
            message: 'Symptom will be deleted and removed from all diseases. Are you sure?',
            buttons: [
                {
                    label: 'Yes, delete!',
                    onClick: () => {
                        deleteSymptom(symptom, true);
                    }
                },
                {
                    label: 'No, abort!',
                    onClick: () => {}
                }
            ]
        });
    }

    return (
    <>
        <PagedTable
            hasCreateNewButton
            onCreateNew={() => setShowSymptomModal(true)}
            onPageChanged={loadSymptoms}
        >
            <thead>
                <tr>
                    <th></th>
                    <th style={{ width: '300px' }}>Name</th>
                    <th>Type</th>
                    <th>Body parts</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {symptoms.length > 0
                ? symptoms.map(symptom => (
                    <tr key={symptom.id}>
                        <td><i className="fa fa-trash" onClick={() => deleteSymptom(symptom)} style={{ cursor: 'pointer', color: 'red' }}></i></td>
                        <td>{symptom.name}</td>
                        <td>{symptom.type}</td>
                        <td>{getBodyStructures(symptom).map(formatBodyStructure).join(", ")}</td>
                        <td>
                            <Button className="mx-1" onClick={() => props.onSymptomSelected(symptom)}>Select</Button>
                            <Button className="mx-1" onClick={() => editSymptom(symptom)}>Edit...</Button>
                        </td>
                    </tr>
                ))
                :
                <tr>
                    <td colSpan={5} className="text-center">No entries</td>
                </tr>}
            </tbody>
        </PagedTable>
        <SymptomModal
            show={showSymptomModal}
            symptom={selectedSymptom}
            onCancel={() => setShowSymptomModal(false)}
            onSymptomCreated={async symptom => {
                if(symptoms.some(x => x.id === symptom.id)) {
                    updateSymptom(symptom);
                }
                setShowSymptomModal(false);
            }}
        />
    </>);
}