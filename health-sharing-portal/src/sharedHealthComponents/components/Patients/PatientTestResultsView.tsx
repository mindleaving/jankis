import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { TestResultTable } from "./TestResultTable";

interface PatientTestResultsViewProps {
    personId: string;
    testResults: Models.DiagnosticTestResults.DiagnosticTestResult[];
}

export const PatientTestResultsView = (props: PatientTestResultsViewProps) => {

    const navigate = useNavigate();
    const hasGenomeSequencing = props.testResults.some(x => x.testCodeLoinc === "86206-0");
    return (
        <div className='m-3'>
            {hasGenomeSequencing 
            ? <div className="text-center">
                <Button variant="info" onClick={() => navigate(`/healthrecord/${props.personId}/genome`)}>
                    <i className="fa fa-connectdevelop me-2" />{resolveText("GenomeAvailable_ExploreNow")}
                </Button>
            </div> : null}
            <div className="timelineSeparator">
                <span className="text-secondary">{resolveText('Now')}</span>
            </div>
            <TestResultTable
                items={props.testResults}
            />
        </div>
    );
}