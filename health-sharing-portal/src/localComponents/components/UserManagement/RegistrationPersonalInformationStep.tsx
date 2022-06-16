import { Row, Col, Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { Sex } from '../../types/enums.d';
import { Models } from '../../types/models';

interface RegistrationPersonalInformationStepProps {
    profileData: Models.Person;
    onChange: (update: Update<Models.Person>) => void;
    onNext: () => void;
    onPrevious: () => void;
}

export const RegistrationPersonalInformationStep = (props: RegistrationPersonalInformationStepProps) => {

    return (
        <>
            <h1>{resolveText("Registration_PersonalInformationStep_Title")}</h1>
            <FormGroup>
                <FormLabel>{resolveText("Person_FirstName")}</FormLabel>
                <FormControl
                    value={props.profileData.firstName}
                    onChange={(e:any) => props.onChange(state => ({
                        ...state,
                        firstName: e.target.value
                    }))}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>{resolveText("Person_LastName")}</FormLabel>
                <FormControl
                    value={props.profileData.lastName}
                    onChange={(e:any) => props.onChange(state => ({
                        ...state,
                        lastName: e.target.value
                    }))}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>{resolveText("Person_Sex")}</FormLabel>
                <FormControl
                    as="select"
                    value={props.profileData.sex}
                    onChange={(e:any) => props.onChange(state => ({
                        ...state,
                        sex: e.target.value
                    }))}
                >
                    <option value={Sex.Other}>{resolveText(`Sex_${Sex.Other}`)}</option>
                    <option value={Sex.Female}>{resolveText(`Sex_${Sex.Female}`)}</option>
                    <option value={Sex.Male}>{resolveText(`Sex_${Sex.Male}`)}</option>
                </FormControl>
            </FormGroup>
            

            <Row className='mt-3'>
                <Col xs="auto">
                    <Button onClick={props.onPrevious}>
                        {resolveText("Previous")}
                    </Button>
                </Col>
                <Col></Col>
                <Col xs="auto">
                    <Button onClick={props.onNext} disabled={!props.profileData.firstName || !props.profileData.lastName}>
                        {resolveText("Next")}
                    </Button>
                </Col>
            </Row>
        </>
    );

}