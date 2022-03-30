import React from 'react';

interface AndroidAppTutorialPageProps {

}
export const AndroidAppTutorialPage = (props: AndroidAppTutorialPageProps) => {
    return (
        <>
            <h1>Entwickle die Android-App weiter</h1>
            <p>
                Die Android-App ist ganz klassisch in Java entwickelt mit dem Android-SDK. Schreibe mir wenn du in Java entwickeln kannst. 
                Auch wenn du bisher noch nicht mit der Android-SDK entwickelt hast, höre ich gerne von dir :)
            </p>
            <p>
                Die App soll ein Allzweck-Werkzeug für den Arzt sein indem er Funktionen für verschiedene Klinik-Aufgaben bereitstellt, 
                z.B. die schnelle Bestimmung von Puls und Atemfrequenz durch tippen auf den Bildschirm (mindestens genauso genau wie mit einer Uhr), 
                schnelle medizinische Notizen, Checklisten und ToDo-Listen damit man keine Patienten oder Aufgaben vergisst
            </p>
            <p>
                Die App kann bisher folgendes:
            </p>
            <ul>
                <li>Patientenliste</li>
                <li>Neue Patienten anlegen, ändern und löschen (hierunter Kamera-basiertes auslesen der Gesundheitskarte)</li>
                <li>Erhebung von Vitalparametern</li>
                <li>Notfall-Mode (CPR- und ABCDE-Algorithmen, inkl. Timer)</li>
                <li>Erheben von Symptomen</li>
                <li>Erheben von Laborwerten</li>
            </ul>
            <p>Geplant ist noch folgende Funktionen:</p>
            <ul>
                <li>Übergabe von Patienten an anderes Personal</li>
                <li>Erweiterung von Anamnese-Erhebung</li>
                <li>Erweiterung von Erhebung von Vitalparametern, besonders Atem-Rhythmus durch Streichen auf Bildschirm und Erkennung von pathologischen Atem-Mustern</li>
                <li>Erstellen von Dokumentation anhand der gesammelten Daten</li>
                <li>Kommunikation mit PC zum Überführen der Daten</li>
                <li>Klären von Datenschutz-Fragen</li>
                <li>Integration mit den Daten, Funktionen und Patientenfragenbogen des Hauptprojektes wenn diese bereitstehen</li>
                <li>...was uns noch so einfällt wenn wir die App anfangen zu benutzen</li>
            </ul>
        </>
    );
}