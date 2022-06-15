import { Fragment, useContext } from 'react';
import { Accordion, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import UserContext from '../../contexts/UserContext';

interface DepartmentMenuProps {}

export const DepartmentMenu = (props: DepartmentMenuProps) => {

    const user = useContext(UserContext);
    const departments = user!.departments;
    const navigate = useNavigate();
    return (
        <Nav>
            <NavDropdown title={resolveText('Menu_Department')} id="menu-department">
                <NavDropdown.Item onClick={() => navigate('/rooms')}>{resolveText('Rooms')}</NavDropdown.Item>
                <Accordion>
                {departments.map(department => (
                    <Fragment key={department.id}>
                        <NavDropdown.Divider />
                        <NavDropdown title={<b>{department.name}</b>}>
                            <NavDropdown.Item onClick={() => navigate(`/departments/${department.id}/services`)}>{resolveText('Services')}</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate(`/departments/${department.id}/requests`)}>{resolveText('ServiceRequests')}</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate(`/departments/${department.id}/stocks`)}>{resolveText('Stocks')}</NavDropdown.Item>
                        </NavDropdown>
                    </Fragment>
                ))}
                </Accordion>
            </NavDropdown>
        </Nav>
    );

}