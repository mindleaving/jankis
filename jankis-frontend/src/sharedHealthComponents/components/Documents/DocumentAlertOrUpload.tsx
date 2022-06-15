import { useEffect, useState } from 'react';
import { Alert, Col, Row } from 'react-bootstrap';
import { Models } from '../../../localComponents/types/models';
import { AsyncButton } from '../../../sharedCommonComponents/components/AsyncButton';
import { FileUpload } from '../../../sharedCommonComponents/components/FileUpload';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface DocumentAlertOrUploadProps {
    document?: Models.PatientDocument;
    onFileSelected: (file: File) => void;
    isUploading: boolean;
    isFileUploaded: boolean;
    onUploadClicked: () => Promise<void>;
}

export const DocumentAlertOrUpload = (props: DocumentAlertOrUploadProps) => {

    const [ isDismissed, setIsDismissed ] = useState<boolean>(false);
    const [ file, setFile ] = useState<File>();

    useEffect(() => {
        if(props.document) {
            setIsDismissed(false);
        }
    }, [ props.document ]);
    useEffect(() => {
        if(file) {
            props.onFileSelected(file);
        }
    }, [ file ]);

    if(file) {
        return (
            <Alert 
                variant="info" 
                dismissible 
                onClose={() => setFile(undefined)}
            >
                {file.name} 
                {!props.isFileUploaded ? <AsyncButton
                    size="sm"
                    type='button'
                    className='mx-2'
                    activeText={resolveText('Upload')}
                    executingText={resolveText('Uploading...')}
                    isExecuting={props.isUploading}
                    onClick={props.onUploadClicked} 
                /> 
                : <i className="fa fa-check green" />}
            </Alert>
        )
    }
    if(props.document && !isDismissed) {
        return (
            <Alert
                variant="info"
                dismissible
                onClose={() => setIsDismissed(true)}
            >
                <Row>
                    <Col>
                        {props.document.fileName}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <small>{props.document.note}</small>
                    </Col>
                </Row>
            </Alert>
        )
    }
    return (
        <FileUpload
            onDrop={files => setFile(files[0])}
        />
    );

}