import React from 'react';
import { Alert, Button, Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { MemoryFormControl } from '../../../sharedCommonComponents/components/MemoryFormControl';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { AutoCompleteContext } from '../../types/enums.d';
import { Models } from '../../types/models';

interface RegistrationContactInformationStepProps {
    profileData: Models.Person;
    onChange: (update: Update<Models.Person>) => void;
    onNext: () => void;
    onPrevious: () => void;
}

export const RegistrationContactInformationStep = (props: RegistrationContactInformationStepProps) => {

    return (
        <>
            <h1>{resolveText("Registration_ContactInformationStep_Title")}</h1>
            <Alert variant="info">
                {resolveText("Registration_InformationOptional")}
            </Alert>
            <FormGroup>
                <FormLabel>{resolveText("Person_PhoneNumber")}</FormLabel>
                <FormControl
                    value={props.profileData.phoneNumber ?? ''}
                    onChange={(e:any) => props.onChange(state => ({
                        ...state,
                        phoneNumber: e.target.value
                    }))}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>{resolveText("Person_Email")}</FormLabel>
                <FormControl
                    value={props.profileData.email ?? ''}
                    onChange={(e:any) => props.onChange(state => ({
                        ...state,
                        email: e.target.value
                    }))}
                />
            </FormGroup>

            <h4 className='mt-3'>{resolveText("Person_Addresses")}</h4>
            <Row>
                <Col md={8}>
                    <FormGroup>
                        <FormLabel>{resolveText("Address_Street")}</FormLabel>
                        <FormControl
                            value={props.profileData.addresses[0].street}
                            onChange={(e:any) => props.onChange(state => ({
                                ...state,
                                addresses: state.addresses.map((address,idx) => {
                                    if(idx === 0) {
                                        return {
                                            ...address,
                                            street: e.target.value
                                        };
                                    }
                                    return address;
                                })
                            }))}
                        />
                    </FormGroup>
                </Col>
                <Col md={4}>
                    <FormGroup>
                        <FormLabel>{resolveText("Address_HouseNumber")}</FormLabel>
                        <FormControl
                            value={props.profileData.addresses[0].houseNumber}
                            onChange={(e:any) => props.onChange(state => ({
                                ...state,
                                addresses: state.addresses.map((address,idx) => {
                                    if(idx === 0) {
                                        return {
                                            ...address,
                                            houseNumber: e.target.value
                                        };
                                    }
                                    return address;
                                })
                            }))}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col md={3}>
                    <FormGroup>
                        <FormLabel>{resolveText("Address_PostalCode")}</FormLabel>
                        <FormControl
                            value={props.profileData.addresses[0].postalCode}
                            onChange={(e:any) => props.onChange(state => ({
                                ...state,
                                addresses: state.addresses.map((address,idx) => {
                                    if(idx === 0) {
                                        return {
                                            ...address,
                                            postalCode: e.target.value
                                        };
                                    }
                                    return address;
                                })
                            }))}
                        />
                    </FormGroup>
                </Col>
                <Col md={9}>
                    <FormGroup>
                        <FormLabel>{resolveText("Address_City")}</FormLabel>
                        <FormControl
                            value={props.profileData.addresses[0].city}
                            onChange={(e:any) => props.onChange(state => ({
                                ...state,
                                addresses: state.addresses.map((address,idx) => {
                                    if(idx === 0) {
                                        return {
                                            ...address,
                                            city: e.target.value
                                        };
                                    }
                                    return address;
                                })
                            }))}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <FormLabel>{resolveText("Address_Country")}</FormLabel>
                        <MemoryFormControl
                            context={AutoCompleteContext.Country}
                            defaultValue={props.profileData.addresses[0].country}
                            onChange={value => props.onChange(state => ({
                                ...state,
                                addresses: state.addresses.map((address,idx) => {
                                    if(idx === 0) {
                                        return {
                                            ...address,
                                            country: value
                                        };
                                    }
                                    return address;
                                })
                            }))}
                        />
                    </FormGroup>
                </Col>
            </Row>

            <Row className='mt-3'>
                <Col xs="auto">
                    <Button onClick={props.onPrevious}>
                        {resolveText("Previous")}
                    </Button>
                </Col>
                <Col></Col>
                <Col xs="auto">
                    <Button onClick={props.onNext}>
                        {resolveText("Next")}
                    </Button>
                </Col>
            </Row>
        </>
    );

}