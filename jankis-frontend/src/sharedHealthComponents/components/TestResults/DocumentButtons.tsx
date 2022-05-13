import { useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { downloadFile } from '../../../sharedCommonComponents/communication/FileDownloader';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { canViewDocument } from '../../helpers/DocumentHelper';
import { DocumentViewerModal } from '../../modals/DocumentViewerModal';
import { loadDocument } from '../../redux/slices/documentsSlice';

interface DocumentButtonsProps {
    documentId: string;
}

export const DocumentButtons = (props: DocumentButtonsProps) => {

    const [ showDocumentViewerModal, setShowDocumentViewerModal ] = useState<boolean>(false);
    const document = useAppSelector(state => state.documents.items.find(x => x.id === props.documentId));
    const canView = useMemo(() => document && canViewDocument(document), [ document ]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!props.documentId) {
            return;
        }
        dispatch(loadDocument({ args: props.documentId }));
    }, [ props.documentId ]);

    return (
        <>
            <Button 
                size="sm" 
                className='mx-1'
                onClick={() => downloadFile(`api/documents/${props.documentId}/download`)}
            >
                {resolveText('Download')}
            </Button>
            {canView
            ? <>
                <Button 
                    size="sm" 
                    className='mx-1'
                    onClick={() => setShowDocumentViewerModal(true)}
                >
                    {resolveText('View')}
                </Button>
                <DocumentViewerModal
                    document={document!}
                    show={showDocumentViewerModal}
                    onCloseRequested={() => setShowDocumentViewerModal(false)}
                />
            </>
            : null}
        </>
    );

}