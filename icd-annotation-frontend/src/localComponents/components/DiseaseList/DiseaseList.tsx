import React, { useCallback, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { NotificationManager } from 'react-notifications';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { PagedTable } from '../../../sharedCommonComponents/components/PagedTable';
import { Models } from '../../types/models';

interface DiseaseListProps {
    filter: Models.Filters.DiseaseFilter;
}

export const DiseaseList = (props: DiseaseListProps) => {

    const [ diseases, setDiseases ] = useState<Models.Icd.Annotation.Disease[]>([]);

    const loadDiseases = useCallback(async (pageIndex: number, entriesPerPage: number) => {
        try {
            let response;
            if(props.filter.searchText) {
                response = await apiClient.instance!.get(
                    'api/diseases/search',
                    { 
                        searchText: props.filter.searchText,
                        count: entriesPerPage + '',
                        skip: (pageIndex * entriesPerPage) + ''
                    });
            } else {
                response = await apiClient.instance!.post('api/diseases', {
                    count: entriesPerPage + '',
                    skip: (pageIndex * entriesPerPage) + ''
                },
                props.filter);
            }
            const diseases = await response.json() as Models.Icd.Annotation.Disease[];
            setDiseases(diseases);
        } catch(error: any) {
            NotificationManager.error(error.message, 'Could not load diseases');
        }
    }, [ props.filter ]);

    return (
    <>
        <hr />
        <Row>
            <Col>
                <div className="float-right"><i className="fa fa-check-circle-o green" /> = Data exists, may not be complete!</div>
            </Col>
        </Row>
        <PagedTable
            bordered
            className="disease-list"
            onPageChanged={loadDiseases}
        >
            <colgroup>
                <col width="10%" />
                <col width="*" />
                <col width="5%" />
                <col width="5%" />
                <col width="5%" />
                <col width="5%" />
                <col width="5%" />
                <col width="5%" />
                <col width="5%" />
                <col width="5%" />
                <col width="5%" />
                <col width="10%" />
            </colgroup>
            <thead>
                <tr style={{ height: '120px'}}>
                    <th>ICD-Code</th>
                    <th>Title</th>
                    <th className="rotate">Incidence</th>
                    <th className="rotate">Prevalence</th>
                    <th className="rotate">Mortality</th>
                    <th className="rotate">Symptoms</th>
                    <th className="rotate">Observations</th>
                    <th className="rotate">Diagnostic tests</th>
                    <th className="rotate">Body structures</th>
                    <th className="rotate">Hosts</th>
                    <th className="rotate">Pathogens</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {diseases.length > 0
                ? diseases.map(disease => (
                    <tr key={disease.icd11Code}>
                        <td>{disease.icd11Code}</td>
                        <td>{disease.editLock ? <i className="fa fa-lock red" title={`Locked by ${disease.editLock.user}`} /> : null} {disease.name}</td>
                        <td className="text-center">{disease.epidemiology.incidenceDataPoints.length > 0 ? <i className="fa fa-check-circle-o green" /> : ''}</td>
                        <td className="text-center">{disease.epidemiology.prevalenceDataPoints.length > 0 ? <i className="fa fa-check-circle-o green" /> : ''}</td>
                        <td className="text-center">{disease.epidemiology.mortalityDataPoints.length > 0 ? <i className="fa fa-check-circle-o green" /> : ''}</td>
                        <td className="text-center">{disease.symptoms.length > 0 ? <i className="fa fa-check-circle-o green" /> : ''}</td>
                        <td className="text-center">{disease.observations.length > 0 ? <i className="fa fa-check-circle-o green" /> : ''}</td>
                        <td className="text-center">{disease.diagnosticCriteria.length > 0 ? <i className="fa fa-check-circle-o green" /> : ''}</td>
                        <td className="text-center">{disease.affectedBodyStructures.length > 0 ? <i className="fa fa-check-circle-o green" /> : ''}</td>
                        <td className="text-center">{(disease as Models.Icd.Annotation.InfectiousDisease).hosts?.length > 0 ? <i className="fa fa-check-circle-o green" /> : ''}</td>
                        <td className="text-center">{(disease as Models.Icd.Annotation.InfectiousDisease).pathogens?.length > 0 ? <i className="fa fa-check-circle-o green" /> : ''}</td>
                        <td><a href={`/diseases/${disease.icd11Code}/edit`} target="_blank" rel="noreferrer">Edit...</a></td>
                    </tr>
                ))
                : 
                <tr>
                    <td colSpan={12} className="text-center">No entries</td>
                </tr>}
            </tbody>
        </PagedTable>
    </>);
}