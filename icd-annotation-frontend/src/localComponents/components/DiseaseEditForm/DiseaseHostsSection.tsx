import React, { useMemo, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { DiseaseHostModal } from './DiseaseHostModal';
import { Autocomplete } from '../../../sharedCommonComponents/components/Autocompletes/Autocomplete';
import { ListFormControl } from '../../../sharedCommonComponents/components/ListFormControl';
import { AutocompleteRunner } from '../../../sharedCommonComponents/helpers/AutocompleteRunner';
import { Models } from '../../types/models';

interface DiseaseHostsSectionProps {
    hosts: Models.Icd.Annotation.Epidemiology.DiseaseHost[];
    setHosts: (hosts: Models.Icd.Annotation.Epidemiology.DiseaseHost[]) => void;
    disabled?: boolean;
}

export const DiseaseHostsSection = (props: DiseaseHostsSectionProps) => {

    const hostAutocompleteRunner = useMemo(() => new AutocompleteRunner<Models.Icd.Annotation.Epidemiology.DiseaseHost>('api/diseasehosts/search', 'searchText', 10), []);
    const hosts = props.hosts;
    const setHosts = props.setHosts;
    const [showDiseaseHostModal, setShowDiseaseHostModal] = useState<boolean>(false);

    const removeHost = (host: Models.Icd.Annotation.Epidemiology.DiseaseHost) => {
        if(props.disabled) {
            return;
        }
        setHosts(hosts.filter(x => x.name !== host.name));
    }

    return (
        <>
            <Form.Group as={Row}>
                <Form.Label as={Col}>Hosts</Form.Label>
                <Col>
                    {!props.disabled ? 
                    <Row>
                        <Col>
                            <Autocomplete
                                displayNameSelector={host => `${host.name}`}
                                search={hostAutocompleteRunner.search}
                                onItemSelected={(host) => {
                                    if(!hosts.find(x => x.id === host.id)) {
                                        setHosts(hosts.concat([host]));
                                    }
                                }}
                                minSearchTextLength={3}
                                resetOnSelect
                            />
                        </Col>
                        <Col xs="auto">
                            <Button onClick={() => setShowDiseaseHostModal(true)}>Add new...</Button>
                            <DiseaseHostModal
                                show={showDiseaseHostModal}
                                onCancel={() => setShowDiseaseHostModal(false)}
                                onDiseaseHostCreated={diseaseHost => {
                                    if (!hosts.find(x => x.id === diseaseHost.id))
                                        setHosts(hosts.concat([diseaseHost]));
                                    setShowDiseaseHostModal(false);
                                }}
                            />
                        </Col>
                    </Row> : null}
                </Col>
            </Form.Group>
            <Row>
                <Col></Col>
                <Col>
                    <ListFormControl<Models.Icd.Annotation.Epidemiology.DiseaseHost>
                        items={hosts}
                        idFunc={item => item.id}
                        displayFunc={item => item.name}
                        removeItem={removeHost}
                    />
                </Col>
            </Row>
        </>
    );
}