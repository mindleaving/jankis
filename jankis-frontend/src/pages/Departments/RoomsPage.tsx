import { useEffect, useState } from 'react';
import { Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { RoomCard } from '../../components/Departments/RoomCard';
import { UniformGrid } from '../../components/UniformGrid';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { Models } from '../../types/models';

interface RoomsPageProps {}

export const RoomsPage = (props: RoomsPageProps) => {

    const [ isLoading, setIsLoading] = useState<boolean>(true);
    const [ institutions, setInstitutions] = useState<Models.Institution[]>([]);
    const [ selectedInstitution, setSelectedInstitution ] = useState<Models.Institution>();
    const [ bedOccupancies, setBedOccupancies] = useState<Models.BedOccupancy[]>([]);

    useEffect(() => {
        setIsLoading(true);
        const loadInstitutions = buildLoadObjectFunc<Models.Institution[]>(
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
    const now = new Date();
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
            {selectedInstitution
            ? <>
                {selectedInstitution.departments.map(department => (
                    <>
                        <h2>{department.name}</h2>
                        <UniformGrid
                            columnCount={3}
                            size="lg"
                            items={department.rooms.map(room => (
                                <RoomCard
                                    room={room}
                                    department={department}
                                    bedOccupancies={bedOccupancies}
                                    now={now}
                                />
                            ))}
                        />
                        
                    </>
                ))}
            </> : null}
        </>
    );

}