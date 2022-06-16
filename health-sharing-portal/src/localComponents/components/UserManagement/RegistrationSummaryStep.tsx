import { Row, Col, Button } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { AccountType } from '../../types/enums.d';
import { Models } from '../../types/models';

interface RegistrationSummaryStepProps {
    accountType: AccountType;
    profileData: Models.Person;
    onPrevious: () => void;
    onNext: () => void;
}

export const RegistrationSummaryStep = (props: RegistrationSummaryStepProps) => {

    const address = props.profileData.addresses[0];
    const healthInsurance = props.profileData.healthInsurance;
    return (
        <>
            <h1>{resolveText("Registration_SummaryStep_Title")}</h1>
            <Row>
                <Col xs={4}>{resolveText("AccountType")}</Col>
                <Col>{resolveText(`AccountType_${props.accountType}`)}</Col>
            </Row>
            <Row>
                <Col xs={4}>{resolveText("Person_ID")}</Col>
                <Col>{props.profileData.id}</Col>
            </Row>
            <Row>
                <Col xs={4}>{resolveText("Person_FirstName")}</Col>
                <Col>{props.profileData.firstName}</Col>
            </Row>
            <Row>
                <Col xs={4}>{resolveText("Person_LastName")}</Col>
                <Col>{props.profileData.lastName}</Col>
            </Row>
            <Row>
                <Col xs={4}>{resolveText("Person_BirthDate")}</Col>
                <Col>{props.profileData.birthDate}</Col>
            </Row>
            {props.profileData.phoneNumber
            ? <Row>
                <Col xs={4}>{resolveText("Person_PhoneNumber")}</Col>
                <Col>{props.profileData.phoneNumber}</Col>
            </Row>
            : null}
            {props.profileData.email
            ? <Row>
                <Col xs={4}>{resolveText("Person_Email")}</Col>
                <Col>{props.profileData.email}</Col>
            </Row>
            : null}
            {address
            ? <Row>
                <Col xs={4}>{resolveText("Person_Addresses")}</Col>
                <Col>
                    <Row>
                        <Col>{address.street} {address.houseNumber}</Col>
                    </Row>
                    <Row>
                        <Col>{address.postalCode} {address.city}</Col>
                    </Row>
                    <Row>
                        <Col>{address.country}</Col>
                    </Row>
                </Col>
            </Row>
            : null}
            {healthInsurance
            ? <Row>
                <Col xs={4}>{resolveText("Person_HealthInsurance")}</Col>
                <Col>
                    <Row>
                        <Col xs={4}>{resolveText("HealthInsurance_InsuranceNumber")}</Col>
                        <Col>{healthInsurance.insuranceNumber}</Col>
                    </Row>
                    <Row>
                        <Col xs={4}>{resolveText("HealthInsurance_InsurerName")}</Col>
                        <Col>{healthInsurance.insurerName}</Col>
                    </Row>
                    <Row>
                        <Col xs={4}>{resolveText("HealthInsurance_InsurerNumber")}</Col>
                        <Col>{healthInsurance.insurerNumber}</Col>
                    </Row>
                </Col>
            </Row>
            : null}
            <Row className='mt-3'>
                <Col xs="auto">
                    <Button onClick={props.onPrevious}>
                        {resolveText("Previous")}
                    </Button>
                </Col>
                <Col></Col>
                <Col xs="auto">
                    <Button onClick={props.onNext}>
                        {resolveText("Submit")}
                    </Button>
                </Col>
            </Row>
        </>
    );

}