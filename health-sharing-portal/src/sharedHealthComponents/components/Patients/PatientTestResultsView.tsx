import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, FormControl, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { HealthRecordEntryType } from "../../../localComponents/types/enums.d";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { TestResultCategories } from "../../types/frontendTypes.d";
import { TestResultTable } from "./TestResultTable";

interface PatientTestResultsViewProps {
    personId: string;
    testResults: Models.DiagnosticTestResults.DiagnosticTestResult[];
    onMarkAsSeen: (entryType: HealthRecordEntryType, entryId: string, update: Update<Models.IHealthRecordEntry>) => void;
}

export const PatientTestResultsView = (props: PatientTestResultsViewProps) => {

    const [ searchText, setSearchText ] = useState<string>('');
    const [ filteredTestResults, setFilteredTestResults ] = useState<Models.DiagnosticTestResults.DiagnosticTestResult[]>([]);
    const [ activeCategories, setActiveCategories ] = useState<string[]>(Object.keys(TestResultCategories));
    const navigate = useNavigate();
    const hasGenomeSequencing = props.testResults.some(x => x.testCodeLoinc === "86206-0");

    const mapLoincCategoryToOurSimplifiedCategories = (loincCategory: string) => {
        const upperLoincCategory = loincCategory.toUpperCase();
        if(upperLoincCategory === "RAD") {
            return TestResultCategories.Imaging;
        }
        if(upperLoincCategory === "DENTAL") {
            return TestResultCategories.Dental;
        }
        if(upperLoincCategory.includes("PATH")) {
            return TestResultCategories.Pathology;
        }
        return TestResultCategories.Lab;
    }
    const isMatch = (testResult: Models.DiagnosticTestResults.DiagnosticTestResult) => {
        if(!activeCategories.includes(TestResultCategories.All)) {
            const simplifiedCategory = mapLoincCategoryToOurSimplifiedCategories(testResult.testCategory);
            if(!activeCategories.includes(simplifiedCategory)) {
                return false;
            }
        }
        const lowerSearchText = searchText.toLowerCase();
        if(testResult.testName.toLowerCase().includes(lowerSearchText)) {
            return true;
        }
        if(testResult.testCodeLoinc.toLowerCase().includes(lowerSearchText)) {
            return true;
        }
        if(testResult.testCodeLocal && testResult.testCodeLocal.toLowerCase().includes(lowerSearchText)) {
            return true;
        }
        return false;
    }
    useEffect(() => {
        setFilteredTestResults(props.testResults.filter(isMatch))
    }, [ props.testResults, searchText, activeCategories ]);

    const toggleCategory = (category: string) => {
        if(category === TestResultCategories.All) {
            setActiveCategories(state => state.length > 0 ? [] : Object.keys(TestResultCategories));
        } else {
            setActiveCategories(state => state.includes(category) ? state.filter(x => x !== category && x !== TestResultCategories.All) : state.concat(category));
        }
    }

    return (
        <div className='m-3'>
            <Row>
                <Col xs="auto">
                    <ButtonGroup>
                        {Object.keys(TestResultCategories).map(category => (
                            <Button 
                                key={category}
                                variant={activeCategories.includes(category) ? 'success' : 'outline-secondary'}
                                onClick={() => toggleCategory(category)}
                            >
                                {resolveText(`TestResult_Category_${category}`)}
                            </Button>
                        ))}
                    </ButtonGroup>
                </Col>
                <Col>
                    <FormControl
                        value={searchText}
                        onChange={(e:any) => setSearchText(e.target.value)}
                        placeholder={resolveText("Search")}
                    />
                </Col>
                <Col lg={3}>
                    {hasGenomeSequencing 
                    ? <div className="text-center">
                        <Button variant="info" onClick={() => navigate(`/healthrecord/${props.personId}/genome`)}>
                            <i className="fa fa-connectdevelop me-2" />{resolveText("GenomeAvailable_ExploreNow")}
                        </Button>
                    </div> : null}
                </Col>
            </Row>
            <div className="timelineSeparator">
                <span className="text-secondary">{resolveText('Now')}</span>
            </div>
            <TestResultTable
                items={filteredTestResults}
                onMarkAsSeen={props.onMarkAsSeen}
            />
        </div>
    );
}