import { FormEvent, useContext, useEffect, useState } from 'react';
import { Button, Form, FormControl, FormGroup, FormLabel, InputGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import UserContext from '../../../localComponents/contexts/UserContext';
import { useAppDispatch, useAppSelector } from '../../../localComponents/redux/store/healthRecordStore';
import { AccountType, HealthRecordEntryType, MedicationDispensionState } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { DateFormControl } from '../../../sharedCommonComponents/components/DateFormControl';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { uuid } from '../../../sharedCommonComponents/helpers/uuid';
import { DrugAutocomplete } from '../../components/Autocompletes/DrugAutocomplete';
import { PersonAutocomplete } from '../../components/Autocompletes/PersonAutocomplete';
import { UnitValueFormControl } from '../../components/UnitValueFormControl';
import { addOrUpdateImmunization } from '../../redux/slices/immunizationsSlice';
import { loadPerson } from '../../redux/slices/personsSlice';

interface AddImmunizationPageProps {}

export const AddImmunizationPage = (props: AddImmunizationPageProps) => {

    const { personId, id } = useParams();
    const [ isLoading, setIsLoading ] = useState<boolean>(!!id);
    const referencedPerson = useAppSelector(x => x.persons.items.find(x => x.id === personId));
    const [ person, setPerson ] = useState<Models.Person | undefined>(referencedPerson);
    const [ drug, setDrug ] = useState<Models.Medication.Drug>();
    const [ timestamp, setTimestamp ] = useState<Date>(new Date());
    const [ batchNumber, setBatchNumber ] = useState<string>('');
    const [ value, setValue ] = useState<number>(0);
    const [ unit, setUnit ] = useState<string>('');
    const [ note, setNote ] = useState<string>('');
    const [ administeredBy, setAdministeredBy ] = useState<string>('');
    const isStoring = useAppSelector(x => x.immunizations.isSubmitting);
    const user = useContext(UserContext);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(!id) {
            return;
        }
        setIsLoading(true);
        const loadImmunization = buildLoadObjectFunc<Models.Medication.Immunization>(
            `api/immunizations/${id}`, {},
            resolveText("Immunization_CouldNotLoad"),
            immunization => {
                setDrug(immunization.drug);
                setTimestamp(immunization.timestamp);
                setBatchNumber(immunization.batchNumber ?? '');
                setValue(immunization.value);
                setUnit(immunization.unit);
                setNote(immunization.note ?? '');
                setAdministeredBy(immunization.administeredBy ?? '');
            },
            () => {},
            () => setIsLoading(false)
        );
        loadImmunization();
    }, [ id ]);

    useEffect(() => {
        if(!personId) {
            return;
        }
        dispatch(loadPerson({ personId }));
    }, [ personId ]);

    useEffect(() => {
        if(!person) {
            setPerson(referencedPerson);
        }
    }, [ referencedPerson ]);

    useEffect(() => {
        if(!drug) {
            return;
        }
        setValue(drug.amountValue);
        setUnit(drug.amountUnit);
    }, [ drug ]);

    const store = async (e?: FormEvent) => {
        e?.preventDefault();
        const immunization: Models.Medication.Immunization = {
            id: id ?? uuid(),
            personId: personId!,
            createdBy: user!.accountId,
            drug: drug!,
            hasBeenSeenBySharer: personId === user!.profileData.id,
            isVerified: user!.accountType === AccountType.HealthProfessional,
            state: MedicationDispensionState.Dispensed,
            timestamp: timestamp!,
            type: HealthRecordEntryType.Immunization,
            batchNumber: batchNumber,
            administeredBy: administeredBy,
            note: note,
            value: value,
            unit: unit
        };
        dispatch(addOrUpdateImmunization({
            args: immunization,
            body: immunization,
            onSuccess: () => navigate(-1)
        }));
    }
    return (
        <>
            <h1>{resolveText("Immunization")}</h1>
            <Form onSubmit={store}>
                <FormGroup>
                    <FormLabel></FormLabel>
                    <PersonAutocomplete required
                        value={person}
                        onChange={setPerson}
                        isLoading={isLoading}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>{resolveText("Immunization_Drug")}</FormLabel>
                    <DrugAutocomplete
                        value={drug}
                        onChange={setDrug}
                        isLoading={isLoading}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>{resolveText("Immunization_Timestamp")}</FormLabel>
                    <InputGroup>
                        <DateFormControl
                            enableTime
                            value={timestamp}
                            onChange={(date) => {
                                if(date) {
                                    setTimestamp(date);
                                }
                            }}
                        />
                        <Button onClick={() => setTimestamp(new Date())}>{resolveText("Now")}</Button>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{resolveText("Immunization_AdministeredBy")}</FormLabel>
                    <InputGroup>
                        <FormControl
                            value={administeredBy}
                            onChange={(e:any) => setAdministeredBy(e.target.value)}
                        />
                        <Button onClick={() => setAdministeredBy(user!.accountId)}>
                            {resolveText("Me")}
                        </Button>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>{resolveText("Immunization_Amount")}</FormLabel>
                    <UnitValueFormControl
                        value={value}
                        unit={unit}
                        onValueChanged={setValue}
                        onUnitChanged={setUnit}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>{resolveText("Immunization_BatchNumber")}</FormLabel>
                    <FormControl
                        value={batchNumber}
                        onChange={(e:any) => setBatchNumber(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>{resolveText("Immunization_Note")}</FormLabel>
                    <FormControl
                        value={note}
                        onChange={(e:any) => setNote(e.target.value)}
                    />
                </FormGroup>
                <StoreButton
                    type='submit'
                    isStoring={isStoring}
                />
            </Form>
        </>
    );

}