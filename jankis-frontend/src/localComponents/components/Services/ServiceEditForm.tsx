import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { Models } from '../../types/models';
import { v4 as uuid } from 'uuid';
import { NotificationManager } from 'react-notifications';
import { Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { formatServiceAudience } from '../../helpers/Formatters';
import { ServiceParameterEditForm } from './ServiceParameterEditForm';
import { ServiceAudienceEditForm } from './ServiceAudienceEditForm';
import { useNavigate } from 'react-router';
import UserContext from '../../contexts/UserContext';
import { ViewModels } from '../../types/viewModels';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { ListFormControl } from '../../../sharedCommonComponents/components/ListFormControl';
import { RowFormGroup } from '../../../sharedCommonComponents/components/RowFormGroup';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface ServiceEditFormProps {
    serviceId?: string;
}

export const ServiceEditForm = (props: ServiceEditFormProps) => {

    const [ isLoading, setIsLoading ] = useState<boolean>(!!props.serviceId);
    const [ isStoring, setIsStoring ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>();
    const [ description, setDescription ] = useState<string>();
    const [ selectedDepartment, setSelectedDepartment ] = useState<Models.Department>();
    const [ parameters, setParameters ] = useState<Models.Services.ServiceParameter[]>([]);
    const [ audience, setAudience ] = useState<ViewModels.ServiceAudienceViewModel[]>([]);
    const user = useContext(UserContext);
    const navigate = useNavigate();

    const serviceId = props.serviceId;
    useEffect(() => {
        if(!serviceId) return;
        const loadService = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.instance!.get(`api/services/${serviceId}`, {});
                const service = await response.json() as ViewModels.ServiceViewModel;
                setName(service.name);
                setDescription(service.description);
                setSelectedDepartment(service.department);
                setParameters(service.parameters);
                setAudience(service.audienceViewModels);
            } catch(error: any) {
                NotificationManager.error(error.message, resolveText('Service_CouldNotLoad'));
            } finally {
                setIsLoading(false);
            }
        };
        loadService();
    }, [ serviceId ]);
    

    const buildService = () => {
        const service: Models.Services.ServiceDefinition = {
            id: serviceId ?? uuid(),
            name: name!,
            description: description!,
            departmentId: selectedDepartment!.id,
            audience: audience,
            parameters: parameters,
            isAvailable: true,
            autoAcceptRequests: false
        };
        return service;
    }

    const store = async (e: FormEvent) => {
        e.preventDefault();
        setIsStoring(true);
        try {
            const service = buildService();
            await apiClient.instance!.put(`api/departments/${service.departmentId}/services/${service.id}`, {}, service);
            NotificationManager.success(resolveText('Service_Stored'));
            navigate(-1);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText('Service_CannotStore'));
        } finally {
            setIsStoring(false);
        }
    }

    const addParameter = (parameter: Models.Services.ServiceParameter) => {
        if(parameters.some(x => x.name === parameter.name)) {
            return;
        }
        setParameters(parameters.concat([parameter]));
    }
    const removeParameter = (parameterName: string) => {
        setParameters(parameters.filter(x => x.name !== parameterName));
    }

    const addAudience = (item: Models.Services.ServiceAudience) => {
        setAudience(audience.concat([ item ]));
    }
    const removeAudience = (item: Models.Services.ServiceAudience) => {
        setAudience(audience.filter(x => x !== item));
    }

    if(isLoading) {
        return (<h1>{resolveText('Loading...')}</h1>);
    }
    return (
        <Form className="needs-validation was-validated" onSubmit={store}>
            <RowFormGroup required
                label={resolveText('Service_Name')}
                value={name}
                onChange={setName}
            />
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('Service_Description')}</FormLabel>
                <Col>
                    <FormControl
                        as="textarea"
                        value={description}
                        onChange={(e:any) => setDescription(e.target.value)}
                    />
                </Col>
            </FormGroup>
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('Service_Department')}</FormLabel>
                <Col>
                    <FormControl
                        as="select"
                        value={selectedDepartment?.id ?? ''}
                        onChange={(e:any) => setSelectedDepartment(user!.departments.find(x => x.id === e.target.value))}
                    >
                        <option value="" disabled>{resolveText('PleaseSelect...')}</option>
                        {user!.departments.map(department => (
                            <option value={department.id} key={department.id}>{department.name}</option>
                        ))}
                    </FormControl>
                </Col>
            </FormGroup>
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('Service_Audience')}</FormLabel>
                <Col>
                    <ServiceAudienceEditForm
                        addAudience={addAudience}
                    />
                </Col>
            </FormGroup>
            <Row>
                <Col></Col>
                <Col>
                    <ListFormControl
                        items={audience}
                        idFunc={formatServiceAudience}
                        displayFunc={formatServiceAudience}
                        removeItem={removeAudience}
                    />
                </Col>
            </Row>
            <FormGroup as={Row}>
                <FormLabel column>{resolveText('Service_Parameters')}</FormLabel>
                <Col>
                    <ServiceParameterEditForm
                        addParameter={addParameter}
                    />
                </Col>
            </FormGroup>
            <Row>
                <Col></Col>
                <Col>
                    <ListFormControl
                        items={parameters}
                        idFunc={x => x.name}
                        displayFunc={x => `${x.name} (${resolveText('Service_Parameter_ValueType')}: ${x.valueType})`}
                        removeItem={x => removeParameter(x.name)}
                    />
                </Col>
            </Row>
            <AsyncButton
                type="submit"
                activeText={resolveText('Store')}
                executingText={resolveText('Storing...')}
                isExecuting={isStoring}
            />
        </Form>
    );

}