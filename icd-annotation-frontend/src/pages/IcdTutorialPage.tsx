import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import { useNavigate } from 'react-router-dom';
import { LoginInfo } from '../components/Tutorials/LoginInfo';

interface IcdTutorialPageProps {

}

export const IcdTutorialPage = (props: IcdTutorialPageProps) => {
    const navigate = useNavigate();
    return (
        <>
            <h1>Annotiere den ICD-11</h1>
            <Accordion defaultActiveKey="-1">
                <Accordion.Toggle as={Card.Header} className="clickable mt-2" eventKey="icd11">
                    <b>Über den ICD-11 und LOINC</b>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="icd11">
                    <Card.Body className="border border-secondary">
                        <b>ICD-11</b>
                        <p>
                            Der ICD-11 ist ein Katalog über alle Krankheiten der von der WHO entwickelt wird. Zur Zeit ist der ICD-10 noch die meist verbreitete Version, 
                            allerdings wird in den kommenden Jahren und Jahrzehnten der ICD-11 immer mehr übernehmen. Die Krankheiten sind in Kapitel unterteilt mit zugehörigen Code-Präfixe, z.B.
                            enthält das erste Kapitel alle infektiösen Krankheiten und diese haben alle einen Code der mit "1" anfängt. Danach kommen die Neoplasien (Tumore) die Codes mit einer "2" am
                            Anfang haben, usw.
                        </p>
                        <p>
                            Der Sinn von solchen Katalogen ist die einheitliche Kommunikation, Berichterstattung und Statistik in der ganzen Welt. Hierdurch wird Forschung und Monitoring ermöglicht, 
                            indem Daten aus dem einen Land mit Daten aus einem anderen Land verglichen werden können. Genau diese Vereinheitlichung soll dieses Projekt nutzen und unterstützen indem 
                            Daten zusammengeführt werden können und wieder für andere Projekte zur Verfügung gestellt werden können.
                        </p>
                        <b>LOINC</b>
                        <p>
                            Ein anderer Katalog ist LOINC, dieses Mal ein Katalog für alle medizinischen Labor- und Untersuchungsergebnisse. Jedem Test ist ein Code zugeordnet der dazu verwendet 
                            werden kann Laborergebnisse in der ganzen Welt zu vergleichen und zu standardisieren.
                        </p>
                        <p>
                            Dieses Projekt nutzt LOINC dazu Krankheiten mit Labortests, bildgebenden Verfahren und anderen Untersuchungen zu verknüpfen, z.B. ist ein erhöhter Blutzuckerspiegel mit
                            Zuckerkrankheit assoziiert, was anhand von Grenzwerten angegeben werden kann.
                        </p>
                    </Card.Body>
                </Accordion.Collapse>
                <Accordion.Toggle as={Card.Header} className="clickable mt-2" eventKey="intro">
                    <b>Bevor du anfängst</b>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="intro">
                    <Card.Body className="border border-secondary">
                        <p>
                            Verschaffe dir erst einen Überblick über die Aufgabe indem du dir die Seiten unter dem Menüpunkt "For maintainers" anguckst. Beginne am besten hier:
                        </p>
                        <ul style={{ listStyleType: 'none' }}>
                            <li><Button variant="link" onClick={() => navigate('/diseases')}>Liste aller ICD-11 Krankheiten</Button> (&gt; 16.000 Einträge!)</li>
                        </ul>
                        <p>
                            Um die Krankheiten des ICD-11 zu annotieren sollte man sich einen von den folgenden Aspekten der Krankheiten aussuchen, 
                            da sich oft viel Zeit sparen lässt wenn man z.B. Symptome ganzen Kategorien von Krankheiten zuteilt statt dies für jede
                            Krankheit einzeln zu tun.
                        </p>
                        <p>
                            Wenn du eine Datenquelle findest mit strukturierten, z.B. tabellarischen, Daten für viele Krankheiten auf einmal, lass es mich bitte wissen,
                            denn oft kann ich die Daten schneller einlesen und in die Datenbank übertragen als dass du die Daten selber eintippst. Dies macht allerdings 
                            erst Sinn bei mehr als 10 Krankheiten.
                        </p>
                    </Card.Body>
                </Accordion.Collapse>
                <Accordion.Toggle as={Card.Header} className="clickable mt-2" eventKey="reference">
                    <b>!!! Referenzen !!!</b>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="reference">
                    <Card.Body className="border border-secondary">
                        <p>
                            WICHTIG: Wann immer möglich, füge eine Referenz zu dem Krankheitseintrag hinzu wenn du Daten hinzufügst. Jede Referenz braucht/kann nur einmal angegeben werden, auch wenn sie für mehrere oder alle Angaben benutzt wird. 
                            Wenn du mehrere Unterseiten von einem Hauptartikel benutzt, reicht die Angabe des Hauptartikels. Es geht nur darum dass andere nachverfolgen können wo die Daten herkommen.
                        </p>
                    </Card.Body>
                </Accordion.Collapse>
                <Accordion.Toggle as={Card.Header} className="clickable mt-2" eventKey="incidence">
                    <b>Inzidenz, Prävalenz und Mortalität</b>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="incidence">
                    <Card.Body className="border border-secondary">
                        <p>
                            Dies ist wahrscheinlich die aufwendigste, aber auch wichtigste Aufgabe.
                        </p>
                        <p>
                            Die Inzidenz (wie viele Menschen werden pro Jahr mit der Krankheit diagnostiziert?), 
                            Prävalenz (wie viele Menschen haben zur Zeit die Krankheit?)
                            und Mortalität (wie viele und wie schnell sterben die Erkrankten?)
                            spielen entscheidende Rolle um die wahrscheinlichste Diagnose mit dem kleinst möglichen Aufwand und Risiko für den Patienten bestimmen zu können/vorherzusagen.
                        </p>
                        <p>
                            Da jede Krankheit verschieden häufig auftritt müssen diese Daten für jede Krankheit einzeln recherchiert werden. 
                            Bei mehr als 16.000 Krankheiten kann das wie eine endlose Aufgabe wirken. Deshalb ist es wichtig Geduld zu haben 
                            und so viele Leute wie möglich mit in das Projekt einzubinden. Jeder Beitrag zählt und bringt uns dem Ziel näher.
                        </p>
                        <p>
                            Wähle deshalb am besten eine Krankheit aus der List, klicke auf "Edit..." und suche auf <a href="https://scholar.google.com/" rel="noreffer">Google Scholar</a>, 
                            <a href="https://pubmed.ncbi.nlm.nih.gov/" rel="noreffer">PubMed</a> oder anderen vertrauenswürdigen Portalen nach der Krankheit plus z.B. "Incidence" 
                            und trage die gefundenden Daten für die Krankheit ein:
                        </p>
                        <h4>Inzidenz:</h4>
                        <ul>
                            <li>
                                <b>Value</b>: Die Anzahl von Fällen pro 100.000 Personen der Gesamtbevölkerung. 
                                Wenn die Inzidenz in den Daten als Prozentwert ausgedrückt ist, z.B. 23%, multipliziert man 100.000 mit 0.23 = 23.000 um den Inzidenz-Wert pro 100.000 zu bekommen.
                            </li>
                            <li>
                                <b>Location</b>: Wo wurde die Inzidenz erhoben? Da nur Städte eingetragen werden können, gebe irgendeine Stadt ein die erfasst wurde in dem Datensatz. 
                                Wenn ein ganzes Land erfasst wurde, gebe vorzugsweise die Hauptstadt an. Bevorzugt sollten die Daten für Deutschland eingetragen werden, wenn verfügbar.
                            </li>
                            <li>
                                <b>Sex</b>: Das Geschlecht für das der Inzidenz-Wert gilt. Oft wird die Inzidenz für alle Geschlechter gleich sein, aber manchmal gibt es zwei verschiedene Werte. 
                                Extremes Beispiel: Schwangerschaftskomplikationen, hier ist die Inzidenz für Männer 0.
                            </li>
                            <li><b>Age range</b>: Gebe hier an für welche Altersgruppe der Inzidenz-Wert gilt. Vorzugsweise sollten die Intervalle sich nicht überschneiden, z.B. 0-9, 10-19, usw.</li>
                            <li>
                                <b>Is seasonal?</b>: Wenn Daten für verschiedene Jahreszeiten vorliegt kann hier angegeben werden für welche Jahreszeiten der Inzidenz-Wert gilt. 
                                Beispielsweise könnte es in den Daten heißen "Jeden Winter erkranken etwa 26% der Bevölkerung an der Grippe".
                            </li>
                        </ul>
                        <p>Für einige seltene Krankheiten gibt es keine guten Inzidenz/Prävalenz-Daten. Gebe hier das beste Estimat an. Es ist wichtiger zu wissen in welcher Größenordnung die Inzidenz/Prävalenz liegt als der genaue Wert.</p>
                        <h4>Prävalenz:</h4>
                        <ul>
                            <li><b>Value</b>: siehe "Inzidenz"</li>
                            <li><b>Location</b>: siehe "Inzidenz"</li>
                            <li><b>Sex</b>: siehe "Inzidenz"</li>
                            <li><b>Age range</b>: siehe "Inzidenz"</li>
                        </ul>
                        <h4>Mortalität:</h4>
                        <ul>
                            <li><b>Value</b>: Anzahl von Toten pro 100.000 Fällen. Bemerke dass hier die Zahl relativ zu der Nummer von Fällen ist und nicht der Gesamtbevölkerung.</li>
                            <li>
                                <b>Years after diagnosis</b>: Oft wird Mortalität angegeben in Form von "60% lebten noch nach 5 Jahren". 
                                Dies entspricht einem Mortalitätswert von 40.000/100.000 und "Years after diagnosis" ist 5. 1 Monat wäre 0.0822 (=30/365).
                                Wenn der Zeitraum nicht bekannt ist und als kurz (wenige Tage oder Wochen) angenommen werden kann ist ein Wert von 0 Jahren in Ordnung. Für viele Infektionskrankheiten wird dies der Fall sein.
                            </li>
                            <li><b>Sex</b>: siehe "Inzidenz"</li>
                            <li><b>Age range</b>: siehe "Inzidenz"</li>
                        </ul>
                    </Card.Body>
                </Accordion.Collapse>
                <Accordion.Toggle as={Card.Header} className="clickable mt-2" eventKey="symptoms">
                    <b>Symptome und Observationen</b>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="symptoms">
                    <Card.Body className="border border-secondary">
                        <ul style={{ listStyleType: 'none' }}>
                            <li><b>Symptom</b>: Ein subjektives Krankheitszeichen das der Patient berichtet, z.B. Schmerzen oder Schwächegefühl</li>
                            <li><b>Observation</b>: Ein objektives Krankheitszeichen das der Arzt bei der körperlichen Untersuchung feststellen kann, z.B. Rötungen, Deformitäten oder verminderte Muskelkraft</li>
                            <li><b>Diagnostische Tests</b>: Eine Unterschuchung die typischerweise einer Maschine bedarf, z.B. Labortests, bildgebende Verfahren (CT, MRT, Ultraschall).</li>
                        </ul>
                        <p>
                            Die Unterscheidung zwischen Symptomen (subjektiv) under Observationen (objektiv) ist nicht immer eindeutig.
                            Erstelle das Krankheitszeichen in der Kategorie in der es deiner Meinung nach am besten rein passt, oder erstelle es in beiden Kategorien (z.B. Fieber).
                            Die Unterscheidung dient dazu mit der Künstlichen Intelligenz bei der Anamnese (Symptome) und körperlichen Untersuchung (Observationen) relevante Vorschläge machen zu können.
                        </p>
                        <p>
                            Um Krankheiten mit Symptomen und Observationen zu bereichern benutzt du am besten die Symptom- oder Observations-Ansicht im Menü "For maintainers".
                            Hier kannst du neue Symptome oder Observationen erstellen und diese zu einer oder mehreren Krankheiten oder ganzen Kategorien hinzufügen.
                        </p>
                        <p>
                            Es spielt keine Rolle in welcher Sprache du die Symptome oder Observationen erstellst. Vorzugsweise Englisch, aber der Name kann später problemlos geändert werden, 
                            da die Symptome und Observationen per ID an die Krankheiten geknüpft werden.
                        </p>
                        <p>
                            Diagnostische Tests müssen angegeben werden mit dem erwartetem Ergebnis des Tests. 
                            Beispielsweise ist bei Typ-1 Zuckerkrankheit (Diabetes) der Blutzucker nach einem Glukose-Test nach 2 Stunden erhöht. 
                            Hier sollte der diagnostische Wert angegeben werden (11.1 mmol/L). Die Tests haben verschiedene Skalen:
                        </p>
                        <p>
                            Die Diagnostischen Tests werden durch Suchen in der LOINC-Datenbank ausgewählt, gebe deshalb den Suchtext in Englisch ein, z.B. "Creatinine urine". Klein/Großschreibung wird ignoriert.
                        </p>
                        <ul>
                            <li>
                                <b>Quantitativ</b>: Ein Test der einen Zahlenwert hat, z.B. Puls, Blutdruck, Natrium-Konzentration. Gebe hier das erwartete Zahlen-Interval (MIT EINHEIT falls verfügbar/relevant) ein. 
                                Die Einheit sollte vorzugsweise eine SI-Einheit sein. Die Einheit wird von der Software gedeutet und in SI-Einheiten umgewandelt. Daher wirst du erleben dass z.B. "40 mmol/L" in "40 mol/m^3" umgewandelt wird nach dem speichern.
                            </li>
                            <li><b>Ordinal</b>: Ein Test mit sortierbaren Kategorien, z.B. "niedrig", "normal", "hoch". Gebe hier die Kategorien an die bei der Krankheit typischerweise erwartet werden würden.</li>
                            <li><b>Nominal/Set</b>: Ein Test mit nicht-sortierbaren Kategorien, z.B. "positiv"/"negativ" beim Schwangerschaftstest. Gebe hier die Kategorien an die bei der Krankheit typischerweise erwartet werden würden.</li>
                            <li><b>Freetext/Document</b>: Ein Test der mit einem Bericht oder anderem Text-Ergebnis abgeschlossen wird. Hier brauchen außer dem Test keine weiteren Daten angegeben werden.</li>
                        </ul>
                    </Card.Body>
                </Accordion.Collapse>
                <Accordion.Toggle as={Card.Header} className="clickable mt-2" eventKey="bodyStructure">
                    <b>Körperstrukturen</b>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="bodyStructure">
                    <Card.Body className="border border-secondary">
                        <p>
                            Wie schon für Symptome und Observationen macht es auch hier Sinn die bei den Krankheiten betroffenen Körperteile ganzen Krankheitskategorien zuteilen zu können.
                        </p>
                    </Card.Body>
                </Accordion.Collapse>
                <Accordion.Toggle as={Card.Header} className="clickable mt-2" eventKey="infectious">
                    <b>Infektionskrankheiten</b>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="infectious">
                    <Card.Body className="border border-secondary">
                        <p>
                            Wenn die Krankheit durch einen Krankheitserreger ausgelöst wird sollte das "Is infectious disease"-Häkchen gesetzt sein, was weitere Felder aktiviert. 
                            Da der ICD-11 einen kompletten Abschnitt für Infektionskrankheiten hat (alle mit Code beginnend mit "1"), sollte das Häkchen schon für alle entsprechenden Krankheiten gesetzt sein.
                        </p>
                        <p>
                            Die extra Felder sind "Pathogens" (Krankheitserreger, z.B. E. coli, Aspergillus) und "Hosts" (Krankheitsträger, z.B. Menschen, Tiere oder Insekten). 
                            Wenn diese Informationen bekannt sind sollten diese ausgefüllt werden. Das "Pathogens"-Feld ist wichtiger als "Hosts", da Letzteres oft später generiert werden kann anhand der Krankheitserreger. 
                            Beispielsweise kann (programmatisch) "Mensch" als Krankheitsträger zu allen Krankheiten gefügt werden die E. coli als Krankheitserreger haben, da der Mensch E. coli in Fäzes ausscheidet.
                        </p>
                        <p>
                            Der Krankheitserreger steht oft auch im Namen der Krankheit, z.B. hat "Ecthyma" (Code: 1B73) Unterkategorien für verschiedene Krankheitserreger: "Streptococcal ecthyma" (Code: 1B73.0), "Staphylococcal ecthyma" (Code: 1B73.1), etc.
                            Hier brauchen die Krankheitserreger nur für die Unterkategorien eingegeben werden. Diese können dann später programmatisch auf die Überkategorie übertragen werden.
                        </p>
                    </Card.Body>
                </Accordion.Collapse>
                <Accordion.Toggle as={Card.Header} className="clickable mt-2" eventKey="login">
                    <b>Die Sperrfunktion und das Login-System</b>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="login">
                    <Card.Body className="border border-secondary">
                        <LoginInfo />
                    </Card.Body>
                </Accordion.Collapse>
            </Accordion>
        </>
    )
}