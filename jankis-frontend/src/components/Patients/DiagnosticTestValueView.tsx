import React from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { resolveText } from '../../helpers/Globalizer';
import { DiagnosticTestScaleType } from '../../types/enums.d';
import { Models } from '../../types/models';

interface DiagnosticTestValueViewProps {
    testResult: Models.DiagnosticTestResult;
}

export const DiagnosticTestValueView = (props: DiagnosticTestValueViewProps) => {

    const history = useHistory();
    const testResult = props.testResult;
    if(testResult.scaleType === DiagnosticTestScaleType.Freetext) {
        const freetextTestResult = testResult as Models.FreetextDiagnosticTestResult;
        return (<>
            {freetextTestResult.text}
        </>);
    } else if(testResult.scaleType === DiagnosticTestScaleType.Document) {
        const documentTestResult = testResult as Models.DocumentDiagnosticTestResult;
        return (<>
            <Button onClick={() => history.push(`/documents/${documentTestResult.documentId}`)}>{resolveText('Open')}</Button>
        </>);
    } else if(testResult.scaleType === DiagnosticTestScaleType.Quantitative) {
        const quantitiveResult = testResult as Models.QuantitativeDiagnosticTestResult;
        return (<>
            {quantitiveResult.value} {quantitiveResult.unit}
        </>);
    } else if(testResult.scaleType === DiagnosticTestScaleType.Ordinal) {
        const ordinalResult = testResult as Models.OrdinalDiagnosticTestResult;
        return (<>
            {ordinalResult.value}
        </>);
    } else if(testResult.scaleType === DiagnosticTestScaleType.Nominal) {
        const nominalResult = testResult as Models.NominalDiagnosticTestResult;
        return (<>
            {nominalResult.value}
        </>);
    }
    throw new Error(`Diagnostic test scale type '${testResult.scaleType}' is not supported`);

}