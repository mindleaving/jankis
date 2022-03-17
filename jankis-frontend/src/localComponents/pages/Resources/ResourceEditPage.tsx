import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';
import { AutoCompleteContext } from '../../types/enums.d';
import Form from 'react-bootstrap/esm/Form';
import { Col, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { LocationFormControl } from '../../components/LocationFormControl';
import { ViewModels } from '../../types/viewModels';
import { MemoryFormControl } from '../../../sharedCommonComponents/components/MemoryFormControl';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { buildAndStoreObject } from '../../../sharedCommonComponents/helpers/StoringHelpers';

interface ResourceEditPageProps {}

export const ResourceEditPage = (props: ResourceEditPageProps) => {

    const routerLocation = useLocation();
    const { resourceId } = useParams();
    const isNew = routerLocation.pathname.toLowerCase().startsWith('/create');
    if(!isNew && !resourceId) {
        throw new Error('Invalid link');
    }
    const matchedId = resourceId;
    const id = matchedId ?? uuid();

    const [ isLoading, setIsLoading ] = useState<boolean>(!isNew);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>('');
    const [ groupName, setGroupName ] = useState<string>();
    const [ location, setLocation ] = useState<ViewModels.LocationViewModel>();
    const [ note, setNote ] = useState<string>('');
    const navigate = useNavigate();
    

    useEffect(() => {
        if(isNew) return;
        setIsLoading(true);
        const loadResource = buildLoadObjectFunc<ViewModels.ResourceViewModel>(
            `api/resources/${matchedId}`,
            {},
            resolveText('Resource_CouldNotLoad'),
            resource => {
                setName(resource.name);
                setGroupName(resource.groupName);
                setLocation(resource.locationViewModel);
                setNote(resource.note);
            },
            () => setIsLoading(false)
        );
        loadResource();
    }, [ isNew, matchedId ]);

    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        setIsStoring(true);
        await buildAndStoreObject(
            `api/resources/${id}`,
            resolveText('Resource_SuccessfullyStored'),
            resolveText('Resource_CouldNotStore'),
            buildResource,
            () => navigate(-1),
            () => setIsStoring(false)
        )
    }

    const buildResource = (): Models.Resource => {
        return {
            id: id,
            name: name,
            groupName: groupName,
            location: location 
            ? {
                type: location.type,
                id: location.id
            } : undefined,
            note: note
        };
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }

    return (
        <>
        <h1>{resolveText('Resource')} '{name}'</h1>
            <Form onSubmit={store}>
                <RowFormGroup required
                    label={resolveText('Resource_Name')}
                    value={name}
                    onChange={setName}
                />
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Resource_Group')}</FormLabel>
                    <Col>
                        <MemoryFormControl
                            context={AutoCompleteContext.ResourceGroup}
                            defaultValue={groupName}
                            onChange={setGroupName}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row}>
                    <FormLabel column>{resolveText('Resource_Location')}</FormLabel>
                    <Col>
                        <LocationFormControl
                            value={location}
                            onChange={setLocation}
                        />
                    </Col>
                </FormGroup>
                <StoreButton
                    type="submit"
                    isStoring={isStoring}
                />
            </Form>
        </>
    );

}