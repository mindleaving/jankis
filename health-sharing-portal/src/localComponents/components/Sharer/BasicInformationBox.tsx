import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { Models } from '../../types/models';

interface BasicInformationBoxProps {
    profileData: Models.Person;
}

export const BasicInformationBox = (props: BasicInformationBoxProps) => {

    const profileData = props.profileData;
    const name = `${profileData.firstName} ${profileData.lastName}`;
    const birthday = new Date(profileData.birthDate);
    const addresses = profileData.addresses;
    const telephone = profileData.phoneNumber;
    return (
        <AccordionCard
            standalone
            isOpenAtCreate
            eventKey='basicInformation'
            title={resolveText("HealthRecord_BasicInformation")}
            collapsedTitle={name}
        >
            <h2>{name}</h2>
            <Row>
                <Col>Birthday</Col>
                <Col>{birthday.toISOString().substring(0, 10)}</Col>
            </Row>
            <Row>
                <Col>Address</Col>
                <Col>
                    {addresses.length > 0
                    ? <Address address={addresses[0]} /> : resolveText("None")}
                </Col>
            </Row>
            <Row>
                <Col>Telephone</Col>
                <Col>{telephone ?? resolveText('None')}</Col>
            </Row>
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