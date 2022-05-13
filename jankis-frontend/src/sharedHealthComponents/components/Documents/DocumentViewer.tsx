import { Models } from '../../../localComponents/types/models';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { hasExtension, ImageExtensions, JsonExtensions, PdfExtensions, TextExtensions } from '../../helpers/DocumentHelper';
import { ImageDocumentViewer } from './ImageDocumentViewer';
import { JsonDocumentViewer } from './JsonDocumentViewer';
import { PdfDocumentViewer } from './PdfDocumentViewer';
import { TextDocumentViewer } from './TextDocumentViewer';

interface DocumentViewerProps {
    document: Models.PatientDocument;
}

export const DocumentViewer = (props: DocumentViewerProps) => {

    const lowerFilename = props.document.fileName.toLowerCase();
    if(hasExtension(lowerFilename, ImageExtensions)) {
        return (<ImageDocumentViewer documentId={props.document.id} />);
    }
    if(hasExtension(lowerFilename, PdfExtensions)) {
        return (<PdfDocumentViewer documentId={props.document.id} />);
    }
    if(hasExtension(lowerFilename, JsonExtensions)) {
        return (<JsonDocumentViewer documentId={props.document.id} />);
    }
    if(hasExtension(lowerFilename, TextExtensions)) {
        return (<TextDocumentViewer documentId={props.document.id} />);
    }
    return (
        <div>{resolveText("Document")}</div>
    );

}