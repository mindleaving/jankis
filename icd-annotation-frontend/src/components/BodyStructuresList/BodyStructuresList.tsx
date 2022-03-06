import React, { useCallback, useState } from "react";
import Button from 'react-bootstrap/Button';
import { Models } from "../../types/models";
import { PagedTable } from "../PagedTable";
import { NotificationManager } from "react-notifications";
import { apiClient } from "../../communication/ApiClient";

export interface BodyStructuresFilters {
    searchText?: string;
}

interface BodyStructuresListProps {
    filter: BodyStructuresFilters;
    onBodyStructureSelected: (bodyStructure: Models.Symptoms.BodyStructure) => void;
}

export const BodyStructuresList = (props: BodyStructuresListProps) => {

    const [bodyStructures, setBodyStructures] = useState<Models.Symptoms.BodyStructure[]>([]);

    const loadBodyStructures = useCallback(async (pageIndex: number, entriesPerPage: number) => {
        try {
            let response;
            if(props.filter.searchText) {
                response = await apiClient.get(
                    'api/bodystructures/search',
                    { 
                        searchText: props.filter.searchText,
                        count: entriesPerPage + '',
                        skip: (pageIndex * entriesPerPage) + ''
                    });
            } else {
                response = await apiClient.get('api/bodystructures', {
                    count: entriesPerPage + '',
                    skip: (pageIndex * entriesPerPage) + ''
                });
            }
            const bodyStructures = await response.json() as Models.Symptoms.BodyStructure[];
            setBodyStructures(bodyStructures);
        } catch(error) {
            NotificationManager.error(error.message, 'Could not load body structures');
        }
    }, [ props.filter ]);

    return (
        <PagedTable
            onPageChanged={loadBodyStructures}
        >
            <thead>
                <tr>
                    <th>ICD-Code</th>
                    <th>Name</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {bodyStructures.length > 0
                ? bodyStructures.map(bodyStructure => (
                    <tr key={bodyStructure.id}>
                        <td>{bodyStructure.icdCode}</td>
                        <td>{bodyStructure.name}</td>
                        <td>
                            <Button className="mx-1" onClick={() => props.onBodyStructureSelected(bodyStructure)}>Select</Button>
                        </td>
                    </tr>
                ))
                :
                <tr>
                    <td colSpan={3} className="text-center">No entries</td>
                </tr>}
            </tbody>
        </PagedTable>
    );
}