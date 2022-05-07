import { compareDesc } from 'date-fns';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { PatientDocumentView } from './PatientDocumentView';

interface PatientDocumentsViewProps {
    personId: string;
}

export const PatientDocumentsView = (props: PatientDocumentsViewProps) => {

    const documents = useAppSelector(state => state.documents.items.filter(x => x.personId === props.personId));

    return (<div className="mt-3">
        <div className="timelineSeparator">
            <span className="text-secondary">{resolveText('Now')}</span>
        </div>
        {[...documents]
            .sort((a,b) => compareDesc(new Date(a.timestamp), new Date(b.timestamp)))
            .map(document => (
                <PatientDocumentView
                    key={document.id}
                    document={document}
                />
            )
        )}
    </div>);

}