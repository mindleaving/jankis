import React, { useCallback, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { NotificationManager } from 'react-notifications';
import { confirmAlert } from 'react-confirm-alert';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { PagedTable } from '../../../sharedCommonComponents/components/PagedTable';
import { formatBodyStructure } from '../../helpers/Formatters';
import { ObservationModal } from '../../modals/ObservationModal';
import { Models } from '../../types/models';

export interface ObservationsFilters {
    searchText?: string;
}

interface ObservationsListProps {
    filter: ObservationsFilters;
    onObservationSelected: (observation: Models.Icd.Annotation.Diagnostics.Observation) => void;
}

export const ObservationsList = (props: ObservationsListProps) => {

    const [ observations, setObservations ] = useState<Models.Icd.Annotation.Diagnostics.Observation[]>([]);
    const [ showObservationModal, setShowObservationModal ] = useState<boolean>(false);
    const [ selectedObservation, setSelectedObservation ] = useState<Models.Icd.Annotation.Diagnostics.Observation>();

    const loadObservations = useCallback(async (pageIndex: number, entriesPerPage: number) => {
        try {
            let response;
            if(props.filter.searchText) {
                response = await apiClient.instance!.get(
                    'api/observations/search',
                    { 
                        searchText: props.filter.searchText,
                        count: entriesPerPage + '',
                        skip: (pageIndex * entriesPerPage) + ''
                    });
            } else {
                response = await apiClient.instance!.get('api/observations', {
                    count: entriesPerPage + '',
                    skip: (pageIndex * entriesPerPage) + ''
                });
            }
            const observations = await response.json() as Models.Icd.Annotation.Diagnostics.Observation[];
            setObservations(observations);
        } catch(error: any) {
            NotificationManager.error(error.message, 'Could not load observations');
        }
    }, [ props.filter ]);

    const editObservation = (observation: Models.Icd.Annotation.Diagnostics.Observation) => {
        if(!observation) {
            return;
        }
        setSelectedObservation(observation);
        setShowObservationModal(true);
    }
    const updateObservation = (observation: Models.Icd.Annotation.Diagnostics.Observation) => {
        setObservations(observations.map(x => {
            if(x.id === observation.id) {
                return observation;
            }
            return x;
        }));
    }
    const deleteObservation = async (observation: Models.Icd.Annotation.Diagnostics.Observation, isConfirmed: boolean = false) => {
        if(!isConfirmed) {
            confirmDeleteObservation(observation);
            return;
        }
        try {
            const id = observation.id;
            await apiClient.instance!.delete(`api/observations/${id}`, {});
            NotificationManager.success('Observation deleted!');
            setObservations(observations.filter(x => x.id !== id));
        } catch(error: any) {
            NotificationManager.error('Could not delete observation', error.message);
        }
    }
    const confirmDeleteObservation = (observation: Models.Icd.Annotation.Diagnostics.Observation) => {
        confirmAlert({
            title: `Delete ${observation.name}?`,
            message: 'Observation will be deleted and removed from all diseases. Are you sure?',
            buttons: [
                {
                    label: 'Yes, delete!',
                    onClick: () => {
                        deleteObservation(observation, true);
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
            onCreateNew={() => setShowObservationModal(true)}
            onPageChanged={loadObservations}
        >
            <thead>
                <tr>
                    <th></th>
                    <th style={{ width: '300px' }}>Name</th>
                    <th>Body part</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {observations.length > 0
                ? observations.map(observation => (
                    <tr key={observation.id}>
                        <td><i className="fa fa-trash" onClick={() => deleteObservation(observation)} style={{ cursor: 'pointer', color: 'red' }}></i></td>
                        <td>{observation.name}</td>
                        <td>{observation.bodyStructure ? formatBodyStructure(observation.bodyStructure) : ''}</td>
                        <td>
                            <Button className="mx-1" onClick={() => props.onObservationSelected(observation)}>Select</Button>
                            <Button className="mx-1" onClick={() => editObservation(observation)}>Edit...</Button>
                        </td>
                    </tr>
                ))
                :
                <tr>
                    <td colSpan={4} className="text-center"><span>No entries</span></td>
                </tr>}
            </tbody>
        </PagedTable>
        <ObservationModal
            show={showObservationModal}
            observation={selectedObservation}
            onCancel={() => setShowObservationModal(false)}
            onObservationCreated={async observation => {
                if(observations.some(x => x.id === observation.id)) {
                    updateObservation(observation);
                }
                setShowObservationModal(false);
            }}
        />
    </>);
}