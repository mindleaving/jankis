import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { resolveText } from '../helpers/Globalizer';
import { buildLoadObjectFunc } from '../helpers/LoadingHelpers';
import { Models } from '../types/models';

interface PatientPageProps {}

export const PatientPage = (props: PatientPageProps) => {

    const { id } = useParams();
    const [ person, setPerson ] = useState<Models.Person>();
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    
    useEffect(() => {
        const loadPatient = buildLoadObjectFunc<Models.Person>(
            `api/patients/${id}`,
            {},
            resolveText("Patient_CouldNotLoad"),
            setPerson,
            () => setIsLoading(false)
        );
        loadPatient();
    }, [ id ]);

    if(isLoading) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }
    if(!person) {
        return (<h3>{resolveText("Patient_CouldNotLoad")}</h3>);
    }

    return (
        <>
            <h1>{person.firstName} {person.lastName}</h1>
        </>
    );

}