import React from 'react';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { LoginInfo } from '../components/Tutorials/LoginInfo';

interface HomePageProps {

}

export const HomePage = (props: HomePageProps) => {

    const history = useHistory();
    const icd11WithExplanation = (
    <span 
        title="Ein von der WHO erstellter Katalog aller Krankheiten" 
        style={{ textDecoration: 'underline dotted', color: 'blue' }}
    >
        ICD-11
    </span>
    );
    return (
        <>
            <div className="d-flex justify-content-center mb-3">
                <Button size="lg" className="mx-auto" onClick={() => history.push('/diseases')}>
                    Direkt zu den Daten<br />
                    <small>(Bitte bei Gelegenheit die Projektbeschreibung lesen)</small>
                </Button>
            </div>
            <h1>Das Projekt</h1>
            <p>Liebe Kommilitonin, lieber Kommilitone.</p>
            <p>Danke für dein Interesse an dem Doctor's ToDo-Projekt.</p>
            <h3>Worum geht es?</h3>
            <ul>
                <li>Annotation aller Krankheiten des {icd11WithExplanation} mit Inzidenzen, Prävalenzen, Mortalität, Symptomen und einiges mehr um diese zu verwenden für...</li>
                <li>...die Entwicklung von Künstlicher Intelligenz für Ratgebung des Arztes in Form von statistisch fundierten Tipps und Checklisten, automatisierte Dokumentation und...</li>
                <li>...die Entwicklung eines dynamischen elektronischen Patientenfragebogens, in erster Linie die Notaufnahme, aber prinzipiell für alle Erstkontakte im Krankenhaus und Arztpraxen.</li>
                <li>
                    Ursprünglich fing das Projekt mit einer Android-App an für den Klinik-Alltag. 
                    Diese entwickle ich ab und zu weiter, könnte aber Unterstützung gebrauchen, falls jemand native Android-Entwicklung in Java beherrscht. 
                    Das Projekt soll zwar von den Daten und Technologien die wir hier zusammen sammeln und entwickeln profitieren, ist aber ein Nebenprojekt.
                </li>
            </ul>
            <h3>Warum mitmachen?</h3>
            <ul>
                <li>
                    Bekomme einen Einblick in die Arbeit mit Code-Standards wie dem ICD-11 (Krankheits-Codes) und LOINC (Labortest-Codes). 
                    Gemeinsamme Codes machen die Zusammenarbeit und Forschung mit Ärzten, Institutionen und Unternehmen aus aller Welt erst möglich!
                </li>
                <li>
                    Ermögliche die Entwicklung von coolen digitalen Werkzeugen die dir später im Berufsleben helfen können, 
                    Anderen das Leben erleichtert und Patienten ein gutes Erlebnis mit dem Gesundheitssystem geben.
                </li>
                <li>
                    Verstehe was Künstliche Intelligenz ist, was sie kann und vor allen Dingen, was sie <b><i>nicht</i></b> ist und kann. 
                    Der Begriff ist mitlerweile so sehr missbraucht dass er keine Bedeutung mehr hat. Alles was digital ist wird mitlerweile als KI verkauft.
                    Das bedeutet allerdings nicht dass alle KI-Systeme nutzlos sind. Lass uns hier eines von den Sinnvollen und Nützlichen bauen!
                </li>
            </ul>
            <h3>Zeithorizont</h3>
            <p>
                Ich stelle mir vor dass das Projekt vorläufig bis zu unserem 2. Staatsexamen in 2025 laufen wird. Die Annotation der Krankheiten kann passenderweise annotiert werden 
                wenn wir sie sowieso im Studium behandeln. Andere Informationen können aber schon vorher eingetragen werden, z.B. Epidemiologische Daten wie die Inzidenz und Prävalenz.
            </p>
            <h3>Wie kann ich mitmachen?</h3>
            <p>Wähle einen Bereich mit dem du helfen möchtest</p>
            <ul style={{ listStyleType: 'none' }}>
                <li>
                    <Button variant="link" onClick={() => history.push('/tutorials/icd11')}>Annotiere den ICD-11</Button>
                </li>
                <li>
                    <Button variant="link" onClick={() => history.push('/tutorials/patientsquestionaire')} disabled>Entwickle den Patientenbogen</Button>
                </li>
                <li>
                    <Button variant="link" onClick={() => history.push('/tutorials/docsupport')} disabled>Entwickle den Ärzte-Ratgeber</Button>
                </li>
                <li>
                    <Button variant="link" onClick={() => history.push('/tutorials/app')} disabled>Entwickle die Android-App</Button>
                </li>
            </ul>
            <h3>Verfügbarkeit der Seite</h3>
            <p>
                Diese Seite wird zur Zeit bei mir zu Hause gehostet. Es wird deshalb passieren dass die Seite ab und an nicht oder nur sehr langsam verfügbar ist.
                Sollte dies zu einem Problem werden, werde ich mich um eine andere Lösung bemühen.
            </p>
            <h3>Das Login-System</h3>
            <LoginInfo />
            <h3>Absender</h3>
            <p>
                Hi, ich heiße Jan Scholtyssek. Ihr erreicht mich unter meiner Uni-Email (ID: ck257). Was ich sonst noch so mache (und weitere Kontaktmöglichkeiten) könnt ihr auf meiner Internetseite sehen:<br/>
                <a href="https://janscholtyssek.dk" target="_blank" rel="noreferrer">https://janscholtyssek.dk/</a>
            </p>
        </>
    );
}