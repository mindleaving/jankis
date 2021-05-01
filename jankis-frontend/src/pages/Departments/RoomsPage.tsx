import React, { useEffect, useState } from 'react';
import { ButtonGroup, Button, Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { RoomCard } from '../../components/Departments/RoomCard';
import { RoomGridView } from '../../components/Departments/RoomGridView';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';
import { BedOccupancyTimelineView } from '../../components/Departments/BedOccupancyTimelineView';

interface RoomsPageProps {}

enum RoomsViewType {
    Grid,
    Timeline
}
export const RoomsPage = (props: RoomsPageProps) => {

    const [ isLoading, setIsLoading] = useState<boolean>(true);
    const [ institutions, setInstitutions] = useState<ViewModels.InstitutionViewModel[]>([]);
    const [ selectedInstitution, setSelectedInstitution ] = useState<ViewModels.InstitutionViewModel>();
    const [ viewType, setViewType ] = useState<RoomsViewType>(RoomsViewType.Grid);
    const [ bedOccupancies, setBedOccupancies] = useState<Models.BedOccupancy[]>([]);

    useEffect(() => {
        setIsLoading(true);
        const loadInstitutions = buildLoadObjectFunc<ViewModels.InstitutionViewModel[]>(
            'api/institutions',
            {},
            resolveText('Institutions_CouldNotLoad'),
            items => {
                setInstitutions(items);
                if(items.length === 1) {
                    setSelectedInstitution(items[0]);
                }
            },
            () => setIsLoading(false)
        );
        loadInstitutions();
    }, []);
    useEffect(() => {
        if(!selectedInstitution) return;
        setIsLoading(true);
        const loadOccupancies = buildLoadObjectFunc<Models.BedOccupancy[]>(
            `api/institutions/${selectedInstitution.id}/bedoccupancies`,
            {},
            resolveText('BedOccupancies_CouldNotLoad'),
            items => {
                items = items.map(item => ({
                    ...item,
                    startTime: new Date(item.startTime),
                    endTime: item.endTime ? new Date(item.endTime) : undefined
                }));
                setBedOccupancies(items);
            },
            () => setIsLoading(false)
        );
        loadOccupancies();
    }, [ selectedInstitution ]);

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }
    return (
        <>
            <h1>{resolveText('BedOccupancies')}</h1>
            <FormGroup as={Row}>
                <Col></Col>
                <FormLabel column xs="auto">{resolveText('Institution')}</FormLabel>
                <Col>
                    <FormControl
                        as="select"
                        value={selectedInstitution?.id ?? ''}
                        onChange={(e: any) => setSelectedInstitution(institutions.find(x => x.id === e.target.value))}
                    >
                        {institutions.length > 0
                        ? <>
                            <option value="" disabled>{resolveText('PleaseSelect...')}</option>
                            {institutions.map(institution => (
                                <option key={institution.id} value={institution.id}>{institution.name}</option>
                            ))}
                        </>
                        : <option value="">{resolveText('NoInstitutions')}</option>}
                    </FormControl>
                </Col>
            </FormGroup>
            <Row className="mb-3">
                <Col></Col>
                <Col xs="auto">
                    <ButtonGroup>
                        <Button 
                            variant={viewType === RoomsViewType.Grid ? 'primary' : 'light'} 
                            onClick={() => setViewType(RoomsViewType.Grid)} 
                            title={resolveText('Rooms_GridView')}
                            style={{ width: '100px'}}
                        >
                            <i className="fa fa-th" />
                        </Button>
                        <Button 
                            variant={viewType === RoomsViewType.Timeline ? 'primary' : 'light'} 
                            onClick={() => setViewType(RoomsViewType.Timeline)} 
                            title={resolveText('Rooms_TimelineView')}
                            style={{ width: '100px' }}
                        >
                            <i className="fa fa-calendar" />
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
            {selectedInstitution
                ? viewType === RoomsViewType.Grid ? <RoomGridView institution={selectedInstitution} bedOccupancies={bedOccupancies} />
                : viewType === RoomsViewType.Timeline ? <BedOccupancyTimelineView institution={selectedInstitution} bedOccupancies={bedOccupancies} />
                : null
            : null}
        </>
    );

}