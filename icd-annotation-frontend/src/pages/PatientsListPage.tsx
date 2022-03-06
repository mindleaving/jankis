import React from 'react';

interface PatientsListPageProps {

}

export const PatientsListPage = (props: PatientsListPageProps) => {
    return (
        <>
            <h1>List of Patients</h1>
            <p>
                In the finished system, with login, roles, etc. this will be where the healthcare professional 
                can see the patients that are assigned to them 
                or not currently assigned to any treatment group (patients in waiting area).
            </p>
            Ideas: 
            <ul>
                <li>Could show color-coded triaging and progress of patient questionaire.
                The patient questionaire could be used to suggest patients to doctors based on their
                speciality, time left in shift and experience.</li>
                <li>Quick actions, like transferring to other doctor, discharging, change priority</li>
            </ul>
        </>
    );
}