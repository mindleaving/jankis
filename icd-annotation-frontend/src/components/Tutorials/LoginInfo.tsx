import React from 'react';

export const LoginInfo = () => {
    return (
        <>
            <p>
                In der oberen rechten Ecke gibt es einen "Login"-Knopf. Wenn du auf ihn klickst wirst du um einen Benutzernamen gebeten. Es handelt sich hierbei (im Moment) <b>nicht</b> um einen richtigen Login!
                Den Benuztername kannst du frei wählen und eingeben um die "Lock"-Funktion benutzen zu können. Diese Funktion ermöglicht es einen ICD-Krankheitseintrag als reserviert/gesperrt zu markieren 
                damit Andere wissen dass an dem gerade gearbeitet wird und diesen nicht gleichzeitig ändern (es gilt was zuletzt gespeichert wird, alle anderen Änderungen werden überschrieben!).
                Wenn du die Funktion nicht nutzen möchtest kannst du auch auf "Cancel" klicken.
                Gesperrte Krankheiten können von anderen Nutzern nicht als Ganzes überschrieben werden. Allerdings können sogenannte "Batch-assignments" (Massen-Änderungen) über die 
                "Symptoms"-, "Observations"- und "Body structures"-Seiten weiterhin ausgeführt werden. Hierbei werden nur die entsprechenden Felder geändert, nicht die gesamte Krankheit.
                Wenn die Krankheit als Ganzes von dem Sperrer gespeichert wird, gehen die Massen-Änderungen die in der zwischenzeit vorgenommen wurden für diese Krankheit allerdings verloren.
                Dies gilt aber unabhängig davon ob die Krankheit gesperrt wird oder nicht, da weiterhin gilt: Was zuletzt gespeichert wurde gilt.
            </p>
            <p>
                <b>WICHTIG:</b> Jeder kann alle Benutzernamen eingeben, denn es ist nichts durch Passwörter oder echte Logins geschützt. 
                Die Benutzernamen dienen ausschließlich dazu sich leichter orienteren zu können, aber es kann passieren und (aus)genutzt werden dass verschieden Besucher der Seite den gleichen Benutzername eingeben.
            </p>
            <p>
                Der Benutzername wird in deinem Browser und während eines aktiven "Locks" in der Datenbank gespeichert. 
                Außerdem wird er während eines aktiven "Locks" anderen Benutzern angezeigt.
            </p>
        </>
    );
}