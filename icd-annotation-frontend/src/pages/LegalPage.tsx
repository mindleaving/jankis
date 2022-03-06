import React from 'react';

interface LegalPageProps {

}

export const LegalPage = (props: LegalPageProps) => {
    return (
        <>
            <h1>Legal statements</h1>
            <h3>LOINC</h3>
            <p>
                This material contains content from LOINC (<a href="http://loinc.org" target="_blank" rel="noreferrer">http://loinc.org</a>). LOINC is copyright © 1995-2020, Regenstrief Institute, Inc. 
                and the Logical Observation Identifiers Names and Codes (LOINC) Committee and is available at no cost under the license at <a href="http://loinc.org/license" target="_blank" rel="noreferrer">http://loinc.org/license</a>. <br />
                LOINC® is a registered United States trademark of Regenstrief Institute, Inc.
            </p>
        </>
    )
}