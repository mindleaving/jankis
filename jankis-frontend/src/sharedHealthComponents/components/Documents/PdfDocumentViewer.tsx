import React from 'react';
import { apiClient } from '../../../sharedCommonComponents/communication/ApiClient';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface PdfDocumentViewerProps {
    documentId: string;
}

export const PdfDocumentViewer = (props: PdfDocumentViewerProps) => {

    const url = apiClient.instance!.buildUrl(`api/documents/${props.documentId}/download`, { "access_token": apiClient.instance!.accessToken });
    return (
        <object
            type='application/pdf'
            data={url}
            width="100%"
        >
            <embed
                type='application/pdf'
                src={url}
                width="100%"
            />
            <p>{resolveText("PDF_View_NotSupported")}</p>
        </object>
    );

}