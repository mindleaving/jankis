import { Button } from 'react-bootstrap';
import { DiagnosticTestScaleType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { downloadFile } from '../../../sharedCommonComponents/communication/FileDownloader';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';

interface DiagnosticTestValueViewProps {
    testResult: Models.DiagnosticTestResults.DiagnosticTestResult;
}

export const DiagnosticTestValueView = (props: DiagnosticTestValueViewProps) => {

    const testResult = props.testResult;
    if(testResult.scaleType === DiagnosticTestScaleType.Freetext) {
        const freetextTestResult = testResult as Models.DiagnosticTestResults.FreetextDiagnosticTestResult;
        return (<>
            {freetextTestResult.text}
        </>);
    } else if(testResult.scaleType === DiagnosticTestScaleType.Document) {
        const documentTestResult = testResult as Models.DiagnosticTestResults.DocumentDiagnosticTestResult;
        return (<>
            <Button 
                size="sm" 
                onClick={() => downloadFile(`api/documents/${documentTestResult.documentId}/download`)}
            >
                {resolveText('Download')}
            </Button>
        </>);
    } else if(testResult.scaleType === DiagnosticTestScaleType.Quantitative) {
        const quantitiveResult = testResult as Models.DiagnosticTestResults.QuantitativeDiagnosticTestResult;
        return (<>
            {quantitiveResult.value} {quantitiveResult.unit}
        </>);
    } else if(testResult.scaleType === DiagnosticTestScaleType.Ordinal) {
        const ordinalResult = testResult as Models.DiagnosticTestResults.OrdinalDiagnosticTestResult;
        return (<>
            {ordinalResult.value}
        </>);
    } else if(testResult.scaleType === DiagnosticTestScaleType.Nominal) {
        const nominalResult = testResult as Models.DiagnosticTestResults.NominalDiagnosticTestResult;
        return (<>
            {nominalResult.value}
        </>);
    }
    throw new Error(`Diagnostic test scale type '${testResult.scaleType}' is not supported`);

}