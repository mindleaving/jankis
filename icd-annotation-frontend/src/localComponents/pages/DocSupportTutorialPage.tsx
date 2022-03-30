import React from 'react';

interface DocSupportTutorialPageProps {

}

export const DocSupportTutorialPage = (props: DocSupportTutorialPageProps) => {
    return (
        <>
            <h1>Entwickle den Ratgeber für den Arzt</h1>
            <p>
                Mit den Daten von der ICD-11-Annotation können wir richtig coole statistische Analysen und Nachschlagfunktionen bauen 
                die dir und deinen Arztkollegen helfen kann bei der Abschätzung von Nutzen und Risiken im Klinik-Alltag. 
            </p>
            <p>
                Beispielsweise sollte der Ratgeber helfen können bei Fragen wie:
            </p>
            <ul>
                <li>Ist z.B. die Strahlenbelastung eines Ganzkörper-CTs vertretbar um die Verdachtsdiagnose zu sichern oder gibt es andere Methoden die auch zum Ziel führen könnten?</li>
                <li>Welche Laborwerte sollten bestellt werden?</li>
                <li>Mit den bisher verfügbaren Informationen, welche Krankheiten sind am wahrscheinlichsten?</li>
                <li>Welche Fragen an den Patienten sind im Moment am sinnvollsten um die möglichen Diagnosen einzuengen?</li>
            </ul>
            <p>
                Wenn du Lust hast den Ratgeber mit zu entwickeln, dann schreibe mir gerne :) 
                Im Moment hat dies noch niedrige Priorität solange die Annotation des ICD-11 noch nicht weiter fortgeschritten ist.
            </p>
        </>
    );
}