import React, { useContext, useEffect, useState } from 'react';
import {  Accordion, Button, Card, Col, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import UserContext from '../../contexts/UserContext';
import { AccountType, StudyEnrollementState } from '../../types/enums.d';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';
import { NotificationManager } from 'react-notifications';
import { StudyEnrollmentsList } from '../../components/Researcher/StudyEnrollmentsList';
import { confirmAlert } from 'react-confirm-alert';

interface StudyPageProps {}

export const StudyPage = (props: StudyPageProps) => {

    const user = useContext(UserContext);
    const { studyId } = useParams();
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ study, setStudy ] = useState<Models.Study>();
    const [ enrollmentStatistics, setEnrollmentStatistics ] = useState<Models.StudyEnrollmentStatistics>();
    const [ myAssociation, setMyAssociation ] = useState<Models.StudyAssociation>();
    const [ myEnrollment, setMyEnrollment ] = useState<Models.StudyEnrollment>();
    const [ isPerformingAction, setIsPerformingAction] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        if(!studyId) return;
        const loadStudyData = buildLoadObjectFunc<ViewModels.StudyViewModel>(
            `api/viewmodels/studies/${studyId}`,
            {},
            resolveText("Study_CouldNotLoad"),
            vm => {
                setStudy(vm.study);
                setEnrollmentStatistics(vm.enrollmentStatistics);
                setMyAssociation(vm.myAssociation);
                setMyEnrollment(vm.myEnrollment);
            },
            () => {},
            () => setIsLoading(false)
        );
        loadStudyData();
    }, [ studyId ]);
    const setEnrollmentState = (newState: StudyEnrollementState) => {
        setMyEnrollment(enrollment => !enrollment 
            ? enrollment
            : ({
                ...enrollment!,
                state: newState
            }));
    }

    const offerParticipation = () => {
        navigate(`/study/${studyId}/offerparticipation`);
    }
    const leaveStudy = async () => {
        setIsPerformingAction(true);
        try {
            await apiClient.instance!.post(`api/studies/${studyId}/leave`, {}, null);
            setEnrollmentState(StudyEnrollementState.Left);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("Study_SuccessfulLeft"));
        } finally {
            setIsPerformingAction(false);
        }
    }
    const acceptEnrollment = async (force: boolean = false) => {
        if(!force) {
            confirmAlert({
                title: resolveText("Study_ConfirmEnroll_Title"),
                message: resolveText("Study_ConfirmEnroll_Message"),
                closeOnClickOutside: true,
                buttons: [
                    {
                        label: resolveText("Study_ConfirmEnroll_Yes"),
                        onClick: () => acceptEnrollment(true)
                    },
                    {
                        label: resolveText("Study_ConfirmEnroll_No"),
                        onClick: () => {}
                    }
                ]
            })
            return;
        }
        setIsPerformingAction(true);
        try {
            await apiClient.instance!.post(`api/studies/${studyId}/accept`, {}, null);
            setEnrollmentState(StudyEnrollementState.Enrolled);
        } catch(error: any) {
            NotificationManager.error(error.message, resolveText("Study_EnrollmentSuccessful"));
        } finally {
            setIsPerformingAction(false);
        }
    }

    if(isLoading) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }
    if(!study) {
        return (<h3>{resolveText("Study_CouldNotLoad")}</h3>);
    }

    let buttons = null;
    if(user!.accountType === AccountType.Researcher) {
        if(!!myAssociation) {
            buttons = (<Button onClick={() => navigate(`/edit/study/${studyId}`)}>{resolveText("Edit")}</Button>);
        }
    } else if(user!.accountType === AccountType.Sharer) {
        if(!myEnrollment) {
            buttons = (<Button className='m-2' onClick={offerParticipation}>{resolveText("Study_OfferParticipation")}</Button>);
        } else {
            switch(myEnrollment.state) {
                case StudyEnrollementState.ParticipationOffered:
                    buttons = (<>
                        <span className='me-2 text-dark'><strong>{resolveText("Study_YouHaveOfferedParticipation")}</strong></span>
                        <Button className='m-2' variant='danger' onClick={leaveStudy}>{resolveText("Study_Leave")}</Button>
                    </>);
                    break;
                case StudyEnrollementState.Enrolled:
                    buttons = (<>
                        <span className='me-2 text-success'><strong>{resolveText("Study_YouAreEnrolled")}</strong></span>
                        <Button className='m-2' variant='danger' onClick={leaveStudy}>{resolveText("Study_Leave")}</Button>
                    </>);
                    break;
                case StudyEnrollementState.Eligible:
                    buttons = (<>
                        <span className='me-2 text-dark'><strong>{resolveText("Study_YouAreEligible")}</strong></span>
                        <Button className='m-2' variant='success' onClick={() => acceptEnrollment(false)}>{resolveText("Study_AcceptEnrollment")}</Button>
                        <Button className='m-2' variant='danger' onClick={leaveStudy}>{resolveText("Study_Leave")}</Button>
                    </>);
                    break;
                case StudyEnrollementState.Excluded:
                case StudyEnrollementState.Rejected:
                    buttons = (<>
                        <span className='me-2 text-danger'><strong>{resolveText("Study_YouAreNotEligible")}</strong></span>
                    </>);
                    break;
                case StudyEnrollementState.Left:
                    buttons = (<>
                        <span className='me-2 text-dark'><strong>{resolveText("Study_YouHaveWithdrawn")}</strong></span>
                        <Button className='m-2' onClick={offerParticipation}>{resolveText("Study_OfferParticipation")}</Button>
                    </>);
                    break;
            }
        }
    }

    return (
        <>
            <h1>{resolveText("Study")} - {study.title}</h1>
            <Row className='mb-2'>
                <Col></Col>
                <Col xs="auto">
                    {buttons}
                </Col>
            </Row>
            <Row className='my-2'>
                <Col>
                    <Card>
                        <Card.Header>{resolveText("Study_Description")}</Card.Header>
                        <Card.Body>
                            {study.description}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className='my-2'>
                <Col>
                    {!!enrollmentStatistics
                    ? <Card>
                        <Card.Header>{resolveText("Study_Statistics")}</Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>{resolveText("Study_Statistics_Offers")}</Col>
                                <Col>{enrollmentStatistics.openOffers}</Col>
                            </Row>
                            <Row>
                                <Col>{resolveText("Study_Statistics_Enrolled")}</Col>
                                <Col>{enrollmentStatistics.enrolled}</Col>
                            </Row>
                            <Row>
                                <Col>{resolveText("Study_Statistics_Rejected")}</Col>
                                <Col>{enrollmentStatistics.rejected}</Col>
                            </Row>
                            <Row>
                                <Col>{resolveText("Study_Statistics_Excluded")}</Col>
                                <Col>{enrollmentStatistics.excluded}</Col>
                            </Row>
                            <Row>
                                <Col>{resolveText("Study_Statistics_Left")}</Col>
                                <Col>{enrollmentStatistics.left}</Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    : null}
                </Col>
            </Row>
            <Row className='my-2'>
                <Col>
                    <Card>
                        <Card.Header>{resolveText("Study_Publications")}</Card.Header>
                        <Card.Body>
                            {study.publications?.length > 0
                            ? <Accordion>
                                {study.publications.map(publication => (
                                    <AccordionCard
                                        key={publication.title}
                                        eventKey={study.id}
                                        title={<>
                                            {publication.title}
                                            <div className='ms-2'><small>{publication.authors.map(author => `${author.lastName}, ${author.firstName}`).join(", ")}</small></div>
                                        </>}
                                    >
                                        <b>{resolveText("Publication_Abstract")}</b>
                                        <div>{publication.abstract}</div>
                                    </AccordionCard>
                                ))}
                            </Accordion>
                            : resolveText("NoPublications")}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {!!myAssociation
            ? <>
                <h3 className='mt-3'>{resolveText("Study_Enrollments")}</h3>
                <Row>
                    <Col>
                        <StudyEnrollmentsList
                            studyId={studyId!}
                        />
                    </Col>
                </Row>
            </>
            : null}
        </>
    );

}