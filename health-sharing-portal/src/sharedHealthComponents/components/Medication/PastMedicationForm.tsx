import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { Form, FormControl, FormGroup, FormLabel, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../../localComponents/contexts/UserContext';
import { AutoCompleteContext, MedicationSchedulePatternType } from '../../../localComponents/types/enums.d';
import { Models } from '../../../localComponents/types/models';
import { ViewModels } from '../../../localComponents/types/viewModels';
import { DateRangeFormControl } from '../../../sharedCommonComponents/components/DateRangeFormControl';
import { MemoryFormControl } from '../../../sharedCommonComponents/components/MemoryFormControl';
import { StoreButton } from '../../../sharedCommonComponents/components/StoreButton';
import { resolveText } from '../../../sharedCommonComponents/helpers/Globalizer';
import { buildLoadObjectFunc } from '../../../sharedCommonComponents/helpers/LoadingHelpers';
import { sendPostRequest } from '../../../sharedCommonComponents/helpers/StoringHelpers';
import { DrugAutocomplete } from '../Autocompletes/DrugAutocomplete';
import { PersonAutocomplete } from '../Autocompletes/PersonAutocomplete';

interface PastMedicationFormProps {
    personId?: string;
}

export const PastMedicationForm = (props: PastMedicationFormProps) => {

    const user = useContext(UserContext);
    const [ profileData, setProfileData ] = useState<Models.Person>();
    const [ drug, setDrug ] = useState<Models.Medication.Drug>();
    const [ selectedPatternType, setSelectedPatternType ] = useState<MedicationSchedulePatternType>(MedicationSchedulePatternType.PillCount);
    const [ patternString, setPatternString ] = useState<string>('1-1-1');
    const [ dosageValue, setDosageValue ] = useState<number>(0);
    const [ dosageUnit, setDosageUnit ] = useState<string>('');
    const [ startTime, setStartTime ] = useState<Date>();
    const [ endTime, setEndTime ] = useState<Date>();
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(!props.personId) {
            return;
        }
        const loadPerson = buildLoadObjectFunc(
            `api/persons/${props.personId}`,
            {},
            resolveText('Patient_CouldNotLoad'),
            setProfileData
        )
        loadPerson();
    }, [ props.personId ]);

    useEffect(() => {
        if(drug) {
            setDosageValue(drug.amountValue);
            setDosageUnit(drug.amountUnit);
        }
    }, [ drug ]);

    const submit = async (e?: FormEvent) => {
        e?.preventDefault();
        const pattern = constructPattern(selectedPatternType, patternString);
        const vm: ViewModels.PastMedicationViewModel = {
            drug: drug!,
            personId: profileData!.id,
            dosage: {
                value: dosageValue,
                unit: dosageUnit
            },
            pattern: pattern,
            startTimestamp: startTime!,
            endTimestamp: endTime!,
            createdBy: user!.accountId
        };
        setIsSubmitting(true);
        await sendPostRequest(
            `api/medicationdispensions/pastmedication`,
            resolveText("Medication_CouldNotStore"),
            vm,
            () => navigate(-1),
            () => setIsSubmitting(false)
        );
    }

    const constructPattern = (patternType: MedicationSchedulePatternType, patternString: string) => {
        const patternParts = patternString.split('-');
        if(patternParts.length < 3) {
            throw new Error("Invalid pattern");
        }
        const pattern: Models.Medication.MedicationSchedulePattern = {
            patternType: patternType,
            morning: Number(patternParts[0]),
            noon: Number(patternParts[1]),
            evening: Number(patternParts[2]),
            night: patternParts.length >= 4 ? Number(patternParts[3]) : 0
        };
        return pattern;
    }

    const getAmountFromPattern = (str: string) => {
        const patternParts = str.split('-');
        return Number(patternParts[0]);
    }

    return (
        <Form onSubmit={submit}>
            <FormGroup>
                <FormLabel>{resolveText("Person")}</FormLabel>
                <PersonAutocomplete required
                    value={profileData}
                    onChange={setProfileData}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>{resolveText("Drug")}</FormLabel>
                <DrugAutocomplete required
                    value={drug} 
                    onChange={setDrug}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>{resolveText("Medication_Pattern")}</FormLabel>
                <InputGroup>
                    <FormControl
                        value={patternString}
                        onChange={(e:any) => setPatternString(e.target.value)}
                        pattern='[0-9]+(-[0-9]+){2,3}'
                    />
                    <FormControl
                        as="select"
                        value={selectedPatternType}
                        onChange={(e:any) => setSelectedPatternType(e.target.value)}
                    >
                        {Object.values(MedicationSchedulePatternType).map(patternType => (
                            <option key={patternType} value={patternType}>{resolveText(`MedicationSchedulePatternType_${patternType}`)}</option>
                        ))}
                    </FormControl>
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <FormLabel>{resolveText("Medication_Dosage")}</FormLabel>
                <InputGroup>
                    <FormControl required
                        type="number"
                        value={selectedPatternType === MedicationSchedulePatternType.Amount ? getAmountFromPattern(patternString) :dosageValue}
                        onChange={(e:any) => setDosageValue(e.target.value)}
                        disabled={selectedPatternType === MedicationSchedulePatternType.Amount}
                    />
                    <MemoryFormControl required
                        context={AutoCompleteContext.Unit}
                        defaultValue={dosageUnit}
                        onChange={setDosageUnit}
                        minSearchTextLength={1}
                        placeholder={resolveText("Unit")}
                    />
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <FormLabel>{resolveText("Medication_Period")}</FormLabel>
                <DateRangeFormControl
                    value={startTime && endTime ? [ startTime, endTime ] : undefined}
                    onChange={(date1, date2) => {
                        setStartTime(date1);
                        setEndTime(date2);
                    }}
                />
            </FormGroup>
            <StoreButton
                type="submit"
                isStoring={isSubmitting}
            />
        </Form>
    );

}