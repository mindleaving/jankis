import { useContext, useState } from 'react';
import { Form, FormControl, FormGroup } from 'react-bootstrap';
import { ServicesList } from '../../components/Services/ServicesList';
import UserContext from '../../contexts/UserContext';
import { resolveText } from '../../helpers/Globalizer';
import { AccountType } from '../../types/enums.d';

interface DepartmentServicesProps {}

export const DepartmentServices = (props: DepartmentServicesProps) => {

    const [ searchText, setSearchText ] = useState<string>('');

    const user = useContext(UserContext);
    if(user?.accountType !== AccountType.Employee) {
        return (<h1>{resolveText('NotPermitted')}</h1>);
    }
    const departments = user.departments;
    
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
            {departments.map(department => (
                <>
                    <h2>{departments.find(x => x.id === department.id)?.name}</h2>
                    <ServicesList filter={{ searchText: searchText, departmentId: department.id }} />
                </>
            ))}
        </>
    );

}