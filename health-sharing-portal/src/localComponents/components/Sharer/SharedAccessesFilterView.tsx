import React, { useEffect, useState } from 'react';
import { Col, FormCheck, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import Flatpickr from 'react-flatpickr';
import { Models } from '../../types/models';

interface SharedAccessesFilterViewProps {
    onFilterChanged: (filter: Models.Filters.SharedAccessFilter) => void
}

export const SharedAccessesFilterView = (props: SharedAccessesFilterViewProps) => {

    const [ searchText, setSearchText ] = useState<string>('');
    const [ onlyActive, setOnlyActive ] = useState<boolean>(false);
    const [ startTime, setStartTime ] = useState<Date>();
    const [ endTime, setEndTime ] = useState<Date>();

    useEffect(() => {
        props.onFilterChanged({
            searchText, onlyActive, startTime, endTime
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ searchText, onlyActive, startTime, endTime ]);

    return (
        <AccordionCard standalone
            title={resolveText("Filters")}
            eventKey='accessesFilter'
        >
            <FormGroup>
                <FormLabel>{resolveText("Search")}</FormLabel>
                <FormControl
                    value={searchText}
                    onChange={(e:any) => setSearchText(e.target.value)}
                />
            </FormGroup>
            <FormGroup as={Row}>
                <FormLabel column xs={2}>{resolveText("SharedAccesses_OnlyActive")}</FormLabel>
                <Col>
                    <FormCheck
                        checked={onlyActive}
                        onChange={(e:any) => setOnlyActive(e.target.checked)}
                    />
                </Col>
            </FormGroup>
            <FormGroup as={Row}>
                <FormLabel column xs={2}>{resolveText("SharedAccesses_TimeRange")}</FormLabel>
                <Col>
                    <Flatpickr
                        options={{
                            allowInput: true,
                            enableTime: true,
                            time_24hr: true,
                            mode: 'range'
                        }}
                        onChange={(dates) => {
                            if(dates.length > 0) {
                                setStartTime(dates[0]);
                            }
                            if(dates.length > 1) {
                                setEndTime(dates[1]);
                            }
                        }}
                    />
                </Col>
            </FormGroup>
        </AccordionCard>
    );

}