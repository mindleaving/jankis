import React, { useMemo, useState } from 'react';
import { Col, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { AccordionCard } from '../../../sharedCommonComponents/components/AccordionCard';
import { PagedTable } from '../../../sharedCommonComponents/components/PagedTable';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import PagedTableLoader from '../../../sharedCommonComponents/helpers/PagedTableLoader';
import { formatPerson } from '../../../sharedHealthComponents/helpers/Formatters';
import { DataRepresentationType, StudyEnrollementState } from '../../types/enums.d';
import { ViewModels } from '../../types/viewModels';
import { StudyEnrollmentActionButton } from './StudyEnrollmentActionButton';

interface StudyEnrollmentsListProps {
    studyId: string;
}
interface StudyEnrollmentFilter {
    searchText?: string;
    state?: StudyEnrollementState;
}
export const StudyEnrollmentsList = (props: StudyEnrollmentsListProps) => {

    const [ enrollments, setEnrollments ] = useState<ViewModels.StudyEnrollmentViewModel[]>([]);
    const [ filter, setFilter ] = useState<StudyEnrollmentFilter>({});
    const enrollmentsLoader = useMemo(() => new PagedTableLoader<ViewModels.StudyEnrollmentViewModel>(
        `api/studies/${props.studyId}/enrollments`,
        resolveText("StudyEnrollments_CouldNotload"),
        setEnrollments,
        Object.assign(filter, { mode: DataRepresentationType.ViewModel })
    ), [ filter, props.studyId ]);

    const updateEnrollmentState = (enrollmentId: string, newState: StudyEnrollementState) => {
        setEnrollments(state => state.map(enrollment => {
            if(enrollment.enrollment.id === enrollmentId) {
                return {
                    ...enrollment,
                    enrollment: {
                        ...enrollment.enrollment,
                        state: newState
                    }
                };
            }
            return enrollment;
        }));
    }

    return (
        <>
            <AccordionCard standalone
                title={resolveText("Filters")}
                eventKey='studyEnrollments'
                className='mb-3'
            >
                <FormGroup as={Row} className="my-2">
                    <FormLabel column>{resolveText("StudyEnrollmentFilter_SearchText")}</FormLabel>
                    <Col>
                        <FormControl
                            value={filter.searchText ?? ''}
                            onChange={(e:any) => setFilter(state => ({
                                ...state,
                                searchText: e.target.value
                            }))}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row} className="my-2">
                    <FormLabel column>{resolveText("StudyEnrollmentFilter_State")}</FormLabel>
                    <Col>
                        <FormControl
                            as="select"
                            value={filter.state ?? ''}
                            onChange={(e:any) => setFilter(state => ({
                                ...state,
                                state: e.target.value
                            }))}
                        >
                            {Object.keys(StudyEnrollementState).map(state => (
                                <option key={state} value={state}>{resolveText(`StudyEnrollementState_${state}`)}</option>
                            ))}
                        </FormControl>
                    </Col>
                </FormGroup>
            </AccordionCard>
            <PagedTable
                onPageChanged={enrollmentsLoader.load}
            >
                <thead>
                    <tr>
                        <th>{resolveText("StudyEnrollment_Person")}</th>
                        <th>{resolveText("StudyEnrollment_State")}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {!enrollments || enrollments.length === 0
                    ? <tr className='text-center'>
                        <td colSpan={3}>{resolveText("NoEntries")}</td>
                    </tr>
                    : enrollments.map(enrollment => (
                    <tr key={enrollment.enrollment.id}>
                        <td>{formatPerson(enrollment.person)}</td>
                        <td>{resolveText(`StudyEnrollementState_${enrollment.enrollment.state}`)}</td>
                        <td className='text-end'>
                            <StudyEnrollmentActionButton
                                studyId={props.studyId}
                                enrollmentId={enrollment.enrollment.id}
                                person={enrollment.person}
                                state={enrollment.enrollment.state}
                                onStateChanged={(newState) => updateEnrollmentState(enrollment.enrollment.id, newState)}
                            />
                        </td>
                    </tr>))}
                </tbody>
            </PagedTable>
        </>
    );

}