import { FormEvent, useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router';
import { resolveText } from '../../helpers/Globalizer';
import { buildLoadObjectFunc } from '../../helpers/LoadingHelpers';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';
import { AutoCompleteContext } from '../../types/enums.d';
import { RowFormGroup } from '../../components/RowFormGroup';
import Form from 'react-bootstrap/esm/Form';
import { Col, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { StoreButton } from '../../components/StoreButton';
import { MemoryFormControl } from '../../components/MemoryFormControl';
import { LocationFormControl } from '../../components/LocationFormControl';
import { ViewModels } from '../../types/viewModels';
import { buidlAndStoreObject } from '../../helpers/StoringHelpers';

interface ResourceParams {
    resourceId?: string;
}
interface ResourceEditPageProps extends RouteComponentProps<ResourceParams> {}

export const ResourceEditPage = (props: ResourceEditPageProps) => {

    const isNew = props.match.path.toLowerCase().startsWith('/create');
    if(!isNew && !props.match.params.resourceId) {
        throw new Error('Invalid link');
    }
    const matchedId = props.match.params.resourceId;
    const id = matchedId ?? uuid();

    const [ isLoading, setIsLoading ] = useState<boolean>(!isNew);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>('');
    const [ groupName, setGroupName ] = useState<string>();
    const [ location, setLocation ] = useState<ViewModels.LocationViewModel>();
    const [ note, setNote ] = useState<string>('');
    const history = useHistory();
    

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
        await buidlAndStoreObject(
            `api/resources/${id}`,
            resolveText('Resource_SuccessfullyStored'),
            resolveText('Resource_CouldNotStore'),
            buildResource,
            () => history.goBack(),
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