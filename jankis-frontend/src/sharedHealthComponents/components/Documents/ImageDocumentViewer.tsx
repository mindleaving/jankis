import React from 'react';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';

interface ImageDocumentViewerProps {
    documentId: string;
}

export const ImageDocumentViewer = (props: ImageDocumentViewerProps) => {

    return (
        <img
            src={apiClient.instance!.buildUrl(`api/documents/${props.documentId}/download`, { "access_token": apiClient.instance!.accessToken })}
            alt={`Document ${props.documentId}`}
            width="100%"
        />
    );

}