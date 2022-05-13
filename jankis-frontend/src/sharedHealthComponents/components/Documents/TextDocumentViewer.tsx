import { useEffect, useState } from "react";
import { apiClient } from "../../../sharedCommonComponents/communication/ApiClient";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { NotificationManager } from 'react-notifications';

interface TextDocumentViewerProps {
    documentId: string;
}

export const TextDocumentViewer = (props: TextDocumentViewerProps) => {

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ text, setText ] = useState<string>();

    useEffect(() => {
        setIsLoading(true);
        const loadJson = async () => {
            try {
                const response = await apiClient.instance!.get(`api/documents/${props.documentId}/download`, {});
                const json = await response.text();
                setText(json);
            } catch(error: any) {
                NotificationManager.error(resolveText("Document_CouldNotLoad"));
            } finally {
                setIsLoading(false);
            }
        };
        loadJson();
    }, [ props.documentId ]);

    if(isLoading) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }
    if(!text) {
        return (<h3>{resolveText("Document_CouldNotLoad")}</h3>);
    }

    return (
        <pre>
            <code>
                {text}
            </code>
        </pre>
    );

}