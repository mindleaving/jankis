import { useEffect, useState } from 'react';
import { FormGroup, FormLabel } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { Models } from '../../../localComponents/types/models';
import { DateFormControl } from '../../../sharedCommonComponents/components/DateFormControl';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { PatientAutocomplete } from '../../components/Autocompletes/PatientAutocomplete';
import { addObservation, loadObservation } from '../../redux/slices/observationsSlice';
import { loadPerson } from '../../redux/slices/personsSlice';

interface EditObservationPageProps {}

export const EditObservationPage = (props: EditObservationPageProps) => {

    const { personId, id } = useParams();
    const isLoading = useAppSelector(state => state.observations.isLoading || state.persons.isLoading);
    const matchedObservation = useAppSelector(state => state.observations.items.find(x => x.id === id));
    const [ observation, setObservation ] = useState<Models.Observations.Observation | undefined>(matchedObservation);
    const matchedProfileData = useAppSelector(state => state.persons.items.find(x => x.id === personId));
    const [ profileData, setProfileData ] = useState<Models.Person | undefined>(matchedProfileData);
    const isSubmitting = useAppSelector(state => state.observations.isSubmitting);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(!id) {
            return;
        }
        dispatch(loadObservation({ args: id }));
    }, [ id ]);
    useEffect(() => {
        if(!observation) {
            setObservation(matchedObservation);
        }
    }, [ matchedObservation]);
    useEffect(() => {
        if(!personId) {
            return;
        }
        dispatch(loadPerson({ personId }));
    }, [ personId ]);
    useEffect(() => {
        if(!profileData) {
            setProfileData(matchedProfileData);
        }
    }, [ matchedProfileData ]);

    const setTimestamp = (date?: Date) => {
        if(!date) {
            return;
        }
        setObservation(state => ({
            ...state!,
            timestamp: date
        }));
    }
    const setObservationAndSubmit = (observation: Models.Observations.Observation) => {
        if(!observation) {
            return;
        }
        setObservation(observation);
        submit();
    }
    const submit = () => {
        dispatch(addObservation({
            args: observation!,
            body: observation!,
            onSuccess: () => navigate(-1)
        }));
    }

    if(isLoading) {
        return (<h3>{resolveText("Loading...")}</h3>);
    }

    if(!observation) {
        return (<h3>{resolveText("NotFound")}</h3>);
    }

    let editor;
    // if(observation.measurementType === MeasurementType.Pulse) {
    //     editor = (<PulseMeasurementForm
    //         personId={observation.personId}
    //         onSubmit={setObservationAndSubmit}
    //         id="observationForm"
    //     />);
    // } else if(observation.measurementType === MeasurementType.BloodPressure) {
    //     editor = (<BloodPressureMeasurementForm
    //         personId={observation.personId}
    //         onSubmit={setObservationAndSubmit}
    //         id="observationForm"
    //     />);
    // } else if(observation.measurementType === MeasurementType.Temperature) {
    //     editor = (<TemperatureMeasurementForm
    //         personId={observation.personId}
    //         onSubmit={setObservationAndSubmit}
    //         id="observationForm"
    //     />);
    // } else {
    //     editor = (<GenericMeasurementForm
    //         personId={observation.personId}
    //         onSubmit={setObservationAndSubmit}
    //         id="observationForm"
    //     />);
    // }
    return (
        <>
            <h1>{resolveText("Observation_Edit")}</h1>
            <FormGroup>
                <FormLabel>{resolveText("Person")}</FormLabel>
                <PatientAutocomplete
                    value={profileData}
                    onChange={setProfileData}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>{resolveText("Observation_Timestamp")}</FormLabel>
                <DateFormControl required
                    enableTime
                    value={observation.timestamp}
                    onChange={setTimestamp}
                />
            </FormGroup>
            <div className='my-3'>
                {editor}
            </div>
            <StoreButton
                form='observationForm'
                onClick={submit}
                isStoring={isSubmitting}
            />
        </>
    );

}