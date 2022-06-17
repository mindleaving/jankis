import { format } from 'date-fns';
import React, { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { CopyButton } from '../../../sharedCommonComponents/components/CopyButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import UserContext from '../../contexts/UserContext';
import { Models } from '../../types/models';

interface BasicInformationBoxProps {
    profileData: Models.Person;
}

export const BasicInformationBox = (props: BasicInformationBoxProps) => {

    const user = useContext(UserContext);
    const profileData = props.profileData;
    const menschId = profileData.id;
    const name = `${profileData.firstName} ${profileData.lastName}`;
    const birthday = new Date(profileData.birthDate);
    const healthInsurance = profileData.healthInsurance;
    const addresses = profileData.addresses;
    const telephone = profileData.phoneNumber;
    const email = profileData.email;
    const navigate = useNavigate();
    const thisIsMe = user!.profileData.id === profileData.id;
    return (
        <AccordionCard
            standalone
            isOpenAtCreate
            eventKey='basicInformation'
            title={resolveText("HealthRecord_BasicInformation")}
            collapsedTitle={name}
        >
            <Row>
                <Col>
                    <h2>{name}</h2>
                </Col>
                <Col xs="auto">
                    {thisIsMe ? <i className='fa fa-edit clickable' onClick={() => navigate(`/edit/person/${profileData.id}`)} /> : null}
                </Col>
            </Row>
            <Row>
                <Col>웃ID</Col>
                <Col>
                    <strong>{menschId}</strong>
                    <CopyButton
                        size="sm"
                        className="mx-2 py-1"
                        value={menschId}
                    />
                </Col>
            </Row>
            <Row>
                <Col>{resolveText("Person_BirthDate")}</Col>
                <Col>{format(birthday, 'yyyy-MM-dd')}</Col>
            </Row>
            {healthInsurance ? <Row>
                <Col>{resolveText("Person_HealthInsurance")}</Col>
                <Col>{healthInsurance.insuranceNumber} ({healthInsurance.insurerName}, {healthInsurance.insurerNumber})</Col>
            </Row> : null}
            {addresses.length > 0
            ? <Row>
                <Col>{resolveText("Person_Addresses")}</Col>
                <Col>
                    <Address address={addresses[0]} />
                </Col>
            </Row> : null}
            {telephone ? <Row>
                <Col>{resolveText("Person_PhoneNumber")}</Col>
                <Col>{telephone}</Col>
            </Row> : null}
            {email ? <Row>
                <Col>{resolveText("Person_Email")}</Col>
                <Col>{email}</Col>
            </Row> : null}
        </AccordionCard>
    );

}

interface AddressProps {
    address: Models.Address;
}
const Address = (props: AddressProps) => {
    const address = props.address;
    return (
        <>
            {address.street} {address.houseNumber}<br/>
            {address.postalCode} {address.city} <br />
            {address.country}
        </>
    );
}