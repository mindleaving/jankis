import React from 'react';
import { CreateEditPublicationModal } from '../modals/CreateEditPublicationModal';

interface CreateEditStudyPageProps {}

export const CreateEditStudyPage = (props: CreateEditStudyPageProps) => {

    return (
        <>
            <h1>Create/edit study</h1>
            <CreateEditPublicationModal />
        </>
    );

}