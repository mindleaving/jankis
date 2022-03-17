import { differenceInMilliseconds } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Alert, Badge, Card, FormControl } from 'react-bootstrap';

interface MedicalTextEditorProps {}

enum MedicalTextPartType {
    Text = "Text",
    Abbreviation = "Abbreviation",
    Disease = "Disease"
};
interface MedicalTextPart {
    toString: () => string;
    type: MedicalTextPartType;
}
interface TextMedicalTextPart extends MedicalTextPart {
    text: string;
}
interface AbbreviationMedicalTextPart extends MedicalTextPart {
    abbreviation: string;
    fullText: string;
}
interface DiseaseMedicalTextPart extends MedicalTextPart {
    icd11Code: string;
}

class TextMedicalTextPart implements TextMedicalTextPart {
    text: string;
    type: MedicalTextPartType = MedicalTextPartType.Text;

    constructor(text: string) {
        this.text = text;
    }

    toString = () => {
        return this.text;
    }
}

export const MedicalTextEditor = (props: MedicalTextEditorProps) => {

    const [ parts, setParts ] = useState<MedicalTextPart[]>([]);
    const [ currentPartText, setCurrentPartText ] = useState<string>('');
    const [ searchText, setSearchText ] = useState<string>();
    const [ specialMeaningCode, setSpecialMeaningCode ] = useState<string>();
    const [ ctrlPressTimestamp, setCtrlPressTimestamp ] = useState<Date>();

    useEffect(() => {
        if(currentPartText.endsWith("$")) {
            const partText = currentPartText.substring(0, currentPartText.length-1).trim();
            if(partText.length > 0) {
                setParts(state => state.concat(new TextMedicalTextPart(partText)));
            }
            setCurrentPartText('$');
        }
        const splittedText = currentPartText.split(' ');
        for(let part of splittedText) {
            if(part.startsWith("$")) {
                setSpecialMeaningCode(part.substring(1));
            } else {
                setSearchText(part);
            }
        }
    }, [ currentPartText ]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.ctrlKey) {
            const now = new Date();
            if(ctrlPressTimestamp && differenceInMilliseconds(now, ctrlPressTimestamp) < 500) {
                setCurrentPartText(state => state + "$");
            }
            setCtrlPressTimestamp(now);
        }
        if(e.key === "Backspace" && currentPartText === "") {
            setParts(state => state.filter((_, index) => index < state.length-1));
        }
    }

    return (
        <>
            <hr />
            <FormControl
                as="textarea"
                value={currentPartText}
                onChange={(e:any) => setCurrentPartText(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <Alert variant='info'>Search text: {searchText}</Alert>
            <Alert variant='info'>Special meaning: {specialMeaningCode}</Alert>
            <Card>
                <Card.Body>
                    {parts.map(part => (
                        <Badge bg="info">{part.toString()}</Badge>
                    ))}
                </Card.Body>
            </Card>
        </>
    );

}