import { useEffect, useState } from 'react';
import { Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { RoomCard } from '../../components/Departments/RoomCard';
import { UniformGrid } from '../../components/UniformGrid';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';

interface RoomsPageProps {}

export const RoomsPage = (props: RoomsPageProps) => {

    const [ isLoading, setIsLoading] = useState<boolean>(true);
    const [ institutions, setInstitutions] = useState<Models.Institution[]>([]);
    const [ selectedInstitutionId, setSelectedInstitutionId ] = useState<string>();
    const [ selectedInstitution, setSelectedInstitution ] = useState<ViewModels.InstitutionViewModel>();
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
                    setSelectedInstitutionId(items[0].id);
                }
            },
            () => setIsLoading(false)
        );
        loadInstitutions();
    }, []);
    useEffect(() => {
        if(!selectedInstitutionId) return;
        setIsLoading(true);
        const loadInstitutionViewModel = buildLoadObjectFunc<ViewModels.InstitutionViewModel>(
            `api/institutions/${selectedInstitutionId}/viewmodel`,
            {},
            resolveText('Institution_CouldNotLoad'),
            setSelectedInstitution
        );
        loadInstitutionViewModel();
        const loadOccupancies = buildLoadObjectFunc<Models.BedOccupancy[]>(
            `api/institutions/${selectedInstitutionId}/bedoccupancies`,
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
    }, [ selectedInstitutionId ]);

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
                        onChange={(e: any) => setSelectedInstitutionId(e.target.value)}
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
                            items={department.roomIds.map(roomId => {
                                const room = selectedInstitution.rooms.find(x => x.id === roomId)!;
                                return (<RoomCard
                                    room={room}
                                    department={department}
                                    bedOccupancies={bedOccupancies}
                                    now={now}
                                />);
                            })}
                        />
                        
                    </>
                ))}
            </> : null}
        </>
    );

}