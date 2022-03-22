import React, { useState } from 'react';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface GenomeUploadPageProps {}

export const GenomeUploadPage = (props: GenomeUploadPageProps) => {

    const [ files, setFiles ] = useState<File[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const submit = async () => {
        
    }

    return (
        <>
            <h1>Upload genome</h1>

            <AsyncButton
                onClick={submit}
                activeText={resolveText('Submit')}
                executingText={resolveText('Submitting...')}
                isExecuting={isSubmitting}
                disabled={!files || files.length === 0}
            />
        </>
    );

}