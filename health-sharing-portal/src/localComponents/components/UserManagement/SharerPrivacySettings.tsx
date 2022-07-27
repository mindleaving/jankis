import React, { useState } from 'react';
import { Alert, Card, Col, FormCheck, FormGroup, Row } from 'react-bootstrap';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface SharerPrivacySettingsProps {}

enum SharerPrivacyPreset {
    Strict,
    Lax,
    Public,
    Custom
}
export const SharerPrivacySettings = (props: SharerPrivacySettingsProps) => {

    const [ allowOption1, setAllowOption1 ] = useState<boolean>(false);
    const [ allowOption2, setAllowOption2 ] = useState<boolean>(false);

    const preset = allowOption1 && allowOption2 ? SharerPrivacyPreset.Public
        : !allowOption1 && allowOption2 ? SharerPrivacyPreset.Lax
        : !allowOption1 && !allowOption2 ? SharerPrivacyPreset.Strict
        : SharerPrivacyPreset.Custom;

    const setStrictPreset = () => {
        setAllowOption1(false);
        setAllowOption2(false);
    }

    const setLaxPreset = () => {
        setAllowOption1(false);
        setAllowOption2(true);
    }

    const setPublicPreset = () => {
        setAllowOption1(true);
        setAllowOption2(true);
    }

    return (
        <>
            <Row>
                <Col>
                    <Alert variant="danger">
                        Settings not yet in use!
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5>{resolveText("Privacy_Presets")}</h5>
                </Col>
            </Row>
            <Row>
                <Col lg={4}>
                    <Card>
                        <Card.Body>
                            <div className='text-center'>
                                Strict
                            </div>
                            <div className='text-center'>
                                <FormCheck 
                                    type='radio'
                                    checked={preset === SharerPrivacyPreset.Strict}
                                    onClick={setStrictPreset}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card>
                        <Card.Body>
                            <div className='text-center'>
                                Lax
                            </div>
                            <div className='text-center'>
                                <FormCheck 
                                    type='radio'
                                    checked={preset === SharerPrivacyPreset.Lax}
                                    onClick={setLaxPreset}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card>
                        <Card.Body>
                            <div className='text-center'>
                                Public
                            </div>
                            <div className='text-center'>
                                <FormCheck 
                                    type='radio'
                                    checked={preset === SharerPrivacyPreset.Public}
                                    onClick={setPublicPreset}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5>{resolveText("Privacy_CustomOptions")}</h5>
                </Col>
            </Row>
            <FormGroup>
                <FormCheck 
                    label="Option 1" 
                    checked={allowOption1}
                    onChange={(e:any) => setAllowOption1(e.target.checked)}
                />
            </FormGroup>
            <FormGroup>
                <FormCheck 
                    label="Option 2" 
                    checked={allowOption2}
                    onChange={(e:any) => setAllowOption2(e.target.checked)}
                />
            </FormGroup>
        </>
    );

}