import { useContext, useState } from 'react';
import { Form, FormControl, FormGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { ServicesList } from '../../components/Services/ServicesList';
import UserContext from '../../contexts/UserContext';
import { resolveText } from '../../helpers/Globalizer';
import { getDepartments } from '../../stores/selectors/departmentSelectors';
import { AccountType } from '../../types/enums.d';

interface DepartmentServicesProps {}

export const DepartmentServices = (props: DepartmentServicesProps) => {

    const [ searchText, setSearchText ] = useState<string>('');
    const departments = useSelector(getDepartments);

    const user = useContext(UserContext);
    if(user?.accountType !== AccountType.Employee) {
        return (<h1>{resolveText('NotPermitted')}</h1>);
    }
    const departmentIds = user.departmentIds;
    
    return (
        <>
            <h1>{resolveText('Department_Services')}</h1>
            <Form onSubmit={e => e.preventDefault()}>
                <FormGroup>
                    <FormControl
                        value={searchText}
                        onChange={(e:any) => setSearchText(e.target.value)}
                    />
                </FormGroup>
            </Form>
            {departmentIds.map(departmentId => (
                <>
                    <h2>{departments.find(x => x.id === departmentId)?.name}</h2>
                    <ServicesList filter={{ searchText: searchText, departmentId: departmentId }} />
                </>
            ))}
        </>
    );

}