import React, { useContext, useEffect, useState } from 'react';
import {  Button, Card, Col, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import UserContext from '../../contexts/UserContext';
import { AccountType } from '../../types/enums.d';
import { Models } from '../../types/models';
import { ViewModels } from '../../types/viewModels';

interface StudyPageProps {}

export const StudyPage = (props: StudyPageProps) => {

    const user = useContext(UserContext);
    const { studyId } = useParams();
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ study, setStudy ] = useState<Models.Study>();
    const [ enrollmentStatistics, setEnrollmentStatistics ] = useState<Models.StudyEnrollmentStatistics>();
    const [ myAssociation, setMyAssociation ] = useState<Models.StudyAssociation>();

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
            },
            () => setIsLoading(false)
        );
        loadStudyData();
    }, [ studyId ]);


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
        buttons = (
            <>
                <Button className='m-2' onClick={() => navigate(`/study/${studyId}/offerparticipation`)}>{resolveText("Study_OfferParticipation")}</Button>
            </>
        );
    }

    return (
        <>
            <h1>Study - {study.title}</h1>
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
                            ? study.publications.map(publication => (
                                <AccordionCard 
                                    eventKey={study.id}
                                    title={<>
                                        {publication.title}
                                        <div className='ms-2'><small>{publication.authors.map(author => `${author.lastName}, ${author.firstName}`).join(", ")}</small></div>
                                    </>}
                                >
                                    <b>{resolveText("Publication_Abstract")}</b>
                                    <div>{publication.abstract}</div>
                                </AccordionCard>
                            ))
                            : resolveText("NoPublications")}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );

}