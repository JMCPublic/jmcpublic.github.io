#!/usr/bin/env python3
"""Build the German Aperture Landmarks pages (11 Nov 2026).
   aperture/landmarks/index.html        -> aperture/landmarks/de/index.html
   aperture/landmarks/mobile/index.html -> aperture/landmarks/de/mobile/index.html
   Run from the repo root:  python3 tools/build_lm_de.py
   Every replacement reports how often it matched in each page, so missed strings show up."""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from lm_de_data import DE_LM, POOL_DE, Q_OPEN_DE, Q_CLOSE_DE, Q_STAR_DE, OTD_DE

UI_FIRST = [
 ("Press Start when you\\'re ready.", 'Drück auf Start, wenn du bereit bist.'),
 ('A new viewpoint, fewer words (a fifth of the wrong ones go), or a vowel, which drops every copy of that vowel into your answer.', 'Ein neuer Blickwinkel, weniger Wörter (ein Fünftel der falschen verschwindet) oder ein Vokal, der überall in deiner Antwort eingesetzt wird.'),
 ('A new viewpoint, fewer words (a fifth of the wrong ones go), or a vowel dropped into your answer.', 'Ein neuer Blickwinkel, weniger Wörter (ein Fünftel der falschen verschwindet) oder ein Vokal in deiner Antwort.'),
 ('>Got it<', '>Verstanden<'),
 ('<span class="label">Today</span><b id="setLabel">', '<span class="label">Heute</span><b id="setLabel">'), ('<span class="label">Players</span>', '<span class="label">Spieler</span>'),
 ('<small>visits</small>', '<small>Besuche</small>'), ('<small>unique</small>', '<small>Besucher</small>'), ('<small>games</small>', '<small>Spiele</small>'),
 ('<span class="label">Top countries</span>', '<span class="label">Top-Länder</span>'),
 ('aria-label="A: Viewpoints"', 'aria-label="A: Blickwinkel"'),
 ('<h2><span>A</span>Viewpoints</h2>', '<h2><span>A</span>Blickwinkel</h2>'),
 ('<span class="hint">drag · scroll</span>', '<span class="hint">ziehen · scrollen</span>'),
 ('id="askViewpoint">Viewpoint<', 'id="askViewpoint">Blickwinkel<'),
 ('<span id="helpCount">0 used</span>', '<span id="helpCount">0 genutzt</span>'),
 ('`${S.helps} used`', '`${S.helps} genutzt`'),
 ('>Help<span id="helpCount">', '>Hilfe<span id="helpCount">'),
 ('aria-label="Obscured picture of the landmark"', 'aria-label="Verdecktes Bild des Wahrzeichens"'),
 ('aria-label="Order words"', 'aria-label="Wörter sortieren"'),
 ('aria-label="Help"', 'aria-label="Hilfe"'),
 ('aria-label="How to play"', 'aria-label="Anleitung"'),
 ('placeholder="e.g. After round 1 the picture didn\'t load"', 'placeholder="z. B. Nach Runde 1 hat das Bild nicht geladen"'),
 ("'Clock running. A free viewpoint opens every 20 seconds.'", "'Die Uhr läuft. Alle 20 Sekunden öffnet sich ein neuer Blickwinkel.'"),
 ("'Skipped. Counts as 2:00 plus 30 seconds.'", "'Übersprungen. Zählt als 2:00 plus 30 Sekunden.'"),
 ("'Two minutes are up.'", "'Die zwei Minuten sind um.'"),
 ('On a phone? Play the mobile version →', 'Am Handy? Zur Handy-Version →'),
 ('<span>Loading…</span>', '<span>Wird geladen …</span>'),
 ('Help · each adds 15 s', 'Hilfe · jeweils +15 s'),
 ('aria-label="B: The negative"', 'aria-label="B: Das Negativ"'),
 ('<h2><span>B</span>The negative</h2><span class="label">fills in</span>', '<h2><span>B</span>Das Negativ</h2><span class="label">füllt sich</span>'),
 ('aria-label="C: The words"', 'aria-label="C: Die Wörter"'),
 ('Your answer · tap a word or type', 'Deine Antwort · Wort antippen oder tippen'),
 ('Skip this one ›', 'Weiter ›'),
 ('<b>Fastest time wins</b>Five landmarks. Everyone gets the same five each day, so you can compare times.', '<b>Die schnellste Zeit gewinnt</b>Fünf Wahrzeichen. Alle bekommen jeden Tag dieselben fünf, so könnt ihr eure Zeiten vergleichen.'),
 ('<b>Six 20-second stages</b>Every 20 seconds a free viewpoint opens in A and more of B fills in. Each landmark has 2 minutes.', '<b>Sechs Stufen à 20 Sekunden</b>Alle 20 Sekunden öffnet sich in A ein neuer Blickwinkel und B füllt sich weiter. Jedes Wahrzeichen hat 2 Minuten.'),
 ('<b>Stuck? Skip</b>Press Skip this one, then press again to move on. A skipped landmark counts as not solved: 2:00 plus 30 seconds.', '<b>Festgefahren? Weiter</b>Drück auf Weiter und dann noch einmal. Ein übersprungenes Wahrzeichen zählt als nicht gelöst: 2:00 plus 30 Sekunden.'),
 ("<b>The words</b>The answer is somewhere in C's 56 words. Each word always has the same three-digit number, whatever round or day it appears in.", '<b>Die Wörter</b>Die Antwort steckt irgendwo in den 56 Wörtern von C. Jedes Wort hat immer dieselbe dreistellige Nummer, egal in welcher Runde oder an welchem Tag.'),
 ('<b>Answering</b>Tap words in C or type letters. It checks itself when every space is full. A wrong answer adds 15 seconds.', '<b>Antworten</b>Tipp Wörter in C an oder schreib die Buchstaben. Sobald alle Felder voll sind, wird geprüft. Eine falsche Antwort kostet 15 Sekunden.'),
 ('<b>Your time</b>Shown as total time with penalties in brackets, e.g. <code>2:30 (30)</code>. Not solved in 2 minutes counts as 2:00 plus 30 seconds.', '<b>Deine Zeit</b>Angezeigt als Gesamtzeit mit Strafzeit in Klammern, z. B. <code>2:30 (30)</code>. Nicht in 2 Minuten gelöst zählt als 2:00 plus 30 Sekunden.'),
 ('"tag": "Where is Bigger?"', '"tag": "Wo ist es größer?"'),
 ('"cta": "Play Where is Bigger?"', '"cta": "Wo ist es größer? spielen"'),
 ('"cta": "Play Natural Wonders"', '"cta": "Natural Wonders spielen"'),
 ('"cta": "Play Aperture"', '"cta": "Aperture spielen"'),
]
# (English, German). Longer, more specific strings first.
UI = [
 ('https://twominute.games/og-landmarks.png', 'https://twominute.games/de/landmarks/card-v1.png'),
 # leftovers found by the string scan
 ('<p>Ideas, likes, gripes or something broken. It goes privately to Two Minute Games; nobody else can read it.</p>', '<p>Ideen, Lob, Ärger oder etwas kaputt? Es geht vertraulich an Two Minute Games, sonst liest es niemand.</p>'),
 ('aria-label="Your message"', 'aria-label="Deine Nachricht"'),
 ('placeholder="Name or email, only if you’d like a reply (optional)" aria-label="Name or email (optional)"', 'placeholder="Name oder E-Mail, nur wenn du eine Antwort möchtest (optional)" aria-label="Name oder E-Mail (optional)"'),

 ("innerHTML='Tap again to skip'", "innerHTML='Sicher?'"),
 ("textContent='Copied'", "textContent='Kopiert'"), ("textContent='Copy failed'", "textContent='Kopieren fehlgeschlagen'"),
 ("textContent='Copied.'", "textContent='Kopiert.'"),
 ("textContent='Send'", "textContent='Senden'"), ("textContent='Sending…'", "textContent='Wird gesendet…'"), ("textContent='Sent'", "textContent='Gesendet'"),
 ("textContent='Tap the words in C to fill the answer'", "textContent='Tippe die Wörter in C an, um die Antwort zu füllen'"),
 ('id="copyBtn">Copy result<', 'id="copyBtn">Kopieren<'),
 ("id=\"dailyBtn\">Today\\'s set<", "id=\"dailyBtn\">Heutiges Quiz<"),
 ("helps===0?'no help':helps===1?'1 help':helps+' helps'", "helps===0?'ohne Hilfe':helps===1?'1 Hilfe':helps+' Hilfen'"),
 ('\\ntwominute.games/aperture/landmarks`', '\\ntwominute.games/aperture/landmarks/de`'),
 ('title="All games at twominute.games"', 'title="Alle Spiele auf twominute.games"'),
 ('aria-label="Music"', 'aria-label="Musik"'), ('aria-label="Sound effects"', 'aria-label="Soundeffekte"'),
 ('aria-label="Zoom out"', 'aria-label="Verkleinern"'), ('aria-label="Zoom in"', 'aria-label="Vergrößern"'),
 ('aria-label="Reveal a"', 'aria-label="a zeigen"'), ('aria-label="Reveal e"', 'aria-label="e zeigen"'), ('aria-label="Reveal i"', 'aria-label="i zeigen"'),
 ('aria-label="Reveal o"', 'aria-label="o zeigen"'), ('aria-label="Reveal u"', 'aria-label="u zeigen"'),
 ('aria-label="Negative image, partly filled in"', 'aria-label="Negativbild, teilweise gefüllt"'), ('aria-label="Game stats"', 'aria-label="Spielstatistik"'),

 # page head and links
 ('<html lang="en">', '<html lang="de">'),
 ('/aperture/landmarks/mobile/', '/aperture/landmarks/de/mobile/'),
 ('https://twominute.games/aperture/landmarks/?desktop=1', 'https://twominute.games/aperture/landmarks/de/?desktop=1'),
 ('href="https://twominute.games/aperture/landmarks/"', 'href="https://twominute.games/aperture/landmarks/de/"'),
 ('content="https://twominute.games/aperture/landmarks/"', 'content="https://twominute.games/aperture/landmarks/de/"'),
 ("location.replace('/aperture/landmarks/'", "location.replace('/aperture/landmarks/de/'"),
 ('href="/aperture/landmarks/"', 'href="/aperture/landmarks/de/"'),
 ('<title>Aperture Landmarks · Two Minute Games</title>', '<title>Aperture Landmarks auf Deutsch · Two Minute Games</title>'),
 ('Aperture Landmarks: your 2 minute daily quiz', 'Aperture Landmarks: dein 2-Minuten-Tagesquiz'),
 ('Where in the world is this? The same puzzle for everyone, every day.', 'Wo auf der Welt ist das? Jeden Tag dasselbe Rätsel für alle.'),
 ('A famous place, revealed bit by bit in a real photo. Where in the world? Your 2 minute daily quiz, the same for everyone.', 'Ein berühmter Ort, Stück für Stück in einem echten Foto enthüllt. Wo auf der Welt? Dein 2-Minuten-Tagesquiz, für alle gleich.'),
 # header and clocks
 ('>Time left<', '>Zeit<'), ('Time left', 'Zeit'),
 ('This round', 'Diese Runde'), ('>Total<', '>Gesamt<'), ('>Round<', '>Runde<'),
 ('>How to play<', '>Anleitung<'), ("'How to play'", "'Anleitung'"),
 ('Music on · click to turn off', 'Musik an · zum Ausschalten klicken'), ('Music off · click to turn on', 'Musik aus · zum Einschalten klicken'),
 ('Sounds on · click to turn off', 'Töne an · zum Ausschalten klicken'), ('Sounds off · click to turn on', 'Töne aus · zum Einschalten klicken'),
 ("'Music on'", "'Musik an'"), ("'Music off'", "'Musik aus'"), ("'Sound effects on'", "'Soundeffekte an'"), ("'Sound effects off'", "'Soundeffekte aus'"),
 # quiz head, overlay, labels
 ("'Your 2 minute daily quiz · '", "'Dein 2-Minuten-Tagesquiz · '"), ("'Your 2 minute random quiz'", "'Dein 2-Minuten-Zufallsquiz'"),
 ('Your 2 minute daily quiz', 'Dein 2-Minuten-Tagesquiz'),
 ("toLocaleDateString('en-GB'", "toLocaleDateString('de-DE'"),
 ('`Daily · ', '`Tagesquiz · '), ("/^Daily · /", "/^Tagesquiz · /"),
 ("'Random set'", "'Zufallsrunde'"), ("'random set'", "'Zufallsrunde'"), ('>Random set<', '>Zufallsrunde<'),
 ('Loading the photos…', 'Fotos werden geladen …'),
 ('Where in the world?', 'Wo auf der Welt?'),
 ("Press Start when you're ready.", 'Drück auf Start, wenn du bereit bist.'),
 ('Round ${G.round+1} of ${ROUNDS}', 'Runde ${G.round+1} von ${ROUNDS}'),
 ("${n} word${n>1?'s':''}", "${n} ${n>1?'Wörter':'Wort'}"),
 ('aria-label="${won} of ${ROUNDS} solved"', 'aria-label="${won} von ${ROUNDS} gelöst"'),
 ('>Words<', '>Wörter<'), ('>Mixed<', '>Gemischt<'),
 ('${56-S.gone.size} words', '${56-S.gone.size} Wörter'), ('56 words', '56 Wörter'),
 ('>Clear<', '>Löschen<'), ('>Skip ›<', '>Weiter ›<'), ('>Help<', '>Hilfe<'), (' used<', ' genutzt<'), ('0 used', '0 genutzt'),
 ('>Vowel<', '>Vokal<'), ('>First letters<', '>Buchstabe<'), ('>Fewer words<', '>Weniger Wörter<'), ('>New viewpoint<', '>Neuer Blickwinkel<'),
 ('>Look closer<', '>Genauer hinsehen<'), ('>Answer<', '>Antwort<'),
 ('Stuck? Skip', 'Festgefahren? Weiter'),
 ('Show the negative larger', 'Negativ größer zeigen'), ('B · The negative. Tap to close.', 'B · Das Negativ. Zum Schließen tippen.'),
 ('Reset view', 'Ansicht zurücksetzen'),
 # results
 ("`Solved: ${S.obj.title}.`", "`Gelöst: ${S.obj.tde||S.obj.title}.`"),
 ("${skipped?'Skipped':'Out of time'}. It was ${S.obj.name}.", "${skipped?'Übersprungen':'Zeit abgelaufen'}. Es war ${S.obj.name}."),
 ("${win?'Solved':(skipped?`Skipped · +${MISS} s`:`Out of time · +${MISS} s`)}", "${win?'Gelöst':(skipped?`Übersprungen · +${MISS} s`:`Zeit abgelaufen · +${MISS} s`)}"),
 ("<h3>It was ${S.obj.name.replace(S.obj.title,`<span class=\"ans\">${S.obj.title}</span>`)}.</h3>", "<h3>Es war ${S.obj.name.replace(S.obj.tde||S.obj.title,`<span class=\"ans\">${S.obj.tde||S.obj.title}</span>`)}.</h3>"),
 ('answer:S.obj.title', 'answer:S.obj.tde||S.obj.title'),
 ('<span class="ans">${S.obj.title}</span>', '<span class="ans">${S.obj.tde||S.obj.title}</span>'),
 ("'Next round'", "'Nächste Runde'"), ('>Next round<', '>Nächste Runde<'),
 ('Final time ${fmt(G.total)}, with ${fmtPen(G.totalPen)} s of penalties.', 'Endzeit ${fmt(G.total)}, davon ${fmtPen(G.totalPen)} s Strafzeit.'),
 ("'Final time'", "'Endzeit'"), ('>Final time<', '>Endzeit<'),
 ('A new best on this device.', 'Neue Bestzeit auf diesem Gerät.'),
 ('Your best here is ${fmt(best)}.', 'Deine Bestzeit hier: ${fmt(best)}.'),
 ("'🔥 Day 1 of your streak. Come back tomorrow.'", "'🔥 Tag 1 deiner Serie. Komm morgen wieder.'"),
 ('🔥 ${streak} days in a row', '🔥 ${streak} Tage in Folge'),
 ('Next quiz in', 'Nächstes Quiz in'), ('Until tomorrow', 'Bis morgen'),
 ('Challenge a friend', 'Herausfordern'),
 ('☕ Enjoyed it?', '☕ Hat’s gefallen?'), ('Buy me a coffee', 'Spendier mir einen Kaffee'),
 ('>Another<', '>Noch eine<'), ("'Today\\'s set'", "'Heutige Runde'"), ('>Today\'s set<', '>Heutige Runde<'),
 ('Out of time · +${MISS} s', 'Zeit abgelaufen · +${MISS} s'),
 ('${S.stages*STAGE} seconds gone. A free viewpoint is open and the negative filled in.', '${S.stages*STAGE} Sekunden vorbei. Ein neuer Blickwinkel ist offen und das Negativ füllt sich.'),
 ('No ${v} in this answer', 'Kein ${v} in dieser Antwort'),
 ('First letter of word ${gi+1} of ${n}', 'Anfangsbuchstabe von Wort ${gi+1} von ${n}'),
 # quote and on this day
 ("Today's quote", 'Zitat des Tages'), ('>On this day', '>An diesem Tag'), ("'On this day'", "'An diesem Tag'"),
 ('· Wikipedia', '· Wikipedia'),
 # how to play
 ('Five landmarks a day, the same five for everyone.', 'Fünf Wahrzeichen am Tag, für alle dieselben fünf.'),
 ('Pinch or use + and − to zoom, drag to look around.', 'Zum Zoomen die Finger spreizen oder + und − nutzen, zum Umsehen ziehen.'),
 ('A free viewpoint opens and more of the negative fills in. Tap the small picture to see the negative full size. Each landmark has 2 minutes.', 'Ein neuer Blickwinkel öffnet sich und das Negativ füllt sich weiter. Tipp auf das kleine Bild, um das Negativ groß zu sehen. Jedes Wahrzeichen hat 2 Minuten.'),
 ('Tap the right word in the list. A wrong answer adds 15 seconds. Not solved in 2 minutes counts as 2:00 plus 30 seconds.', 'Tipp das richtige Wort in der Liste an. Eine falsche Antwort kostet 15 Sekunden. Nicht in 2 Minuten gelöst zählt als 2:00 plus 30 Sekunden.'),
 ('Tap Skip, then tap again to move on. A skipped landmark counts as not solved: 2:00 plus 30 seconds.', 'Tipp auf Weiter und noch einmal, um fortzufahren. Ein übersprungenes Wahrzeichen zählt als nicht gelöst: 2:00 plus 30 Sekunden.'),
 ('Each press shows the first letter of the next word: once for word one, twice for word two, and so on.', 'Jeder Druck zeigt den Anfangsbuchstaben des nächsten Wortes: einmal für das erste Wort, zweimal für das zweite und so weiter.'),
 ('Real photos from Wikimedia Commons. The photographer and licence show after each round.', 'Echte Fotos von Wikimedia Commons. Fotograf und Lizenz stehen nach jeder Runde da.'),
 ('Fastest time wins', 'Die schnellste Zeit gewinnt'), ('Every 20 seconds', 'Alle 20 Sekunden'),
 ('Help adds 15 seconds', 'Hilfe kostet 15 Sekunden'), ('First letters add 30 seconds', 'Anfangsbuchstaben kosten 30 Sekunden'),
 ('each one adds 15 s', 'jeweils +15 s'), ('>The photos<', '>Die Fotos<'), ('>Daily<', '>Täglich<'),
 ('Playing on a computer? Use the desktop version', 'Am Computer? Zur Desktop-Version'),
 ('Playing on a phone? Use the mobile version', 'Am Handy? Zur Handy-Version'),
 ('>Photo:', '>Foto:'), ('Photo:', 'Foto:'),
 ('Loading stats…', 'Statistik wird geladen …'),
 # have you tried and promos
 ('Have you tried', 'Schon probiert?'),
 ('Maps have been lying to you', 'Karten haben dich belogen'),
 ('Two countries side by side, true to scale. You won’t look at a world map the same way again.', 'Zwei Länder nebeneinander, maßstabsgetreu. Du wirst Weltkarten nie wieder gleich ansehen.'),
 ('Ten quick geography games: rivers, lakes, peaks and deserts. The answers surprise most people.', 'Zehn schnelle Erdkunde-Spiele: Flüsse, Seen, Gipfel und Wüsten. Die Antworten überraschen fast alle.'),
 ('The same two-minute game, with everyday things instead of famous places. Five objects, the same for everyone. Easy, until it isn’t.', 'Dasselbe Zwei-Minuten-Spiel, mit Alltagsgegenständen statt berühmter Orte. Fünf Dinge, für alle gleich. Leicht – bis es schwer wird.'),
 ("'Play Where is Bigger?'", "'Wo ist es größer? spielen'"), ("'Play Natural Wonders'", "'Natural Wonders spielen'"), ("'Play Aperture'", "'Aperture spielen'"),
 ('Greenland or Africa: which is bigger?', 'Grönland oder Afrika: Was ist größer?'),
 ('Which river is really the longest?', 'Welcher Fluss ist wirklich der längste?'),
 ('The Nile or the Amazon?', 'Nil oder Amazonas?'),
 ('What everyday thing is this?', 'Was für ein Alltagsding ist das?'),
 ('Can you name an everyday object from a few tiny gaps?', 'Erkennst du einen Alltagsgegenstand durch ein paar winzige Lücken?'),
 ('Try another game', 'Probier ein anderes Spiel'), ('Not now', 'Jetzt nicht'),
 ('/natural-wonders-where-is-bigger/', '/natural-wonders-where-is-bigger/de/'),
 # feedback box
 ('Tell us what you think', 'Sag uns deine Meinung'),
 ("'💡 Idea','What would make it better?'", "'💡 Idee','Was würde es besser machen?'"),
 ("'👍 Like it','What did you enjoy?'", "'👍 Gefällt mir','Was hat dir gefallen?'"),
 ("'🐞 Something’s wrong','What went wrong, and where?'", "'🐞 Etwas stimmt nicht','Was ist schiefgegangen, und wo?'"),
 ('We also send which game you were on and your type of device, nothing else.', 'Wir schicken nur mit, welches Spiel du gespielt hast und deinen Gerätetyp, sonst nichts.'),
 ('Write a few words first.', 'Schreib zuerst ein paar Worte.'),
 ('Thank you. Sent!', 'Danke. Gesendet!'),
 ('Couldn’t send just now. Please try again in a moment.', 'Konnte gerade nicht senden. Bitte versuch es gleich noch einmal.'),
 ('Feedback or report a problem', 'Feedback oder Problem melden'), ('Feedback or bug', 'Feedback oder Fehler'),
 ('>Send<', '>Senden<'), ('>Cancel<', '>Abbrechen<'),
 ('Report a problem', 'Problem melden'),
 ('Tell us what went wrong. Your phone or computer type and where you were in the game are added for you.', 'Sag uns, was schiefging. Dein Gerätetyp und wo du im Spiel warst, werden automatisch ergänzt.'),
 ('Copy the report and message it to Jonathan.', 'Kopier den Bericht und schick ihn per Nachricht.'),
 ("Couldn't send. Copy it and message it instead.", 'Konnte nicht senden. Kopier ihn und schick ihn per Nachricht.'),
 ('Thanks, report sent.', 'Danke, Bericht gesendet.'), ('Copy report', 'Bericht kopieren'),
]

def js(o): return json.dumps(o, ensure_ascii=False)

def build(src, dst):
    s = open(src, encoding='utf-8').read()
    report = []
    for en, de in UI_FIRST+UI:
        n = s.count(en)
        if n: s = s.replace(en, de)
        report.append((n, en))
    # German data: answers and names (titles stay English inside, so spotlight days still match)
    anchor = "/* load a landmark's photo once"
    assert s.count(anchor) == 1, 'objects anchor'
    lm = {k: {'t': v[0], 'p': v[1], 'a': v[2]} for k, v in DE_LM.items()}
    s = s.replace(anchor, "/* German names and answers (tools/build_lm_de.py) */\nconst DE_LM=" + js(lm) + ";\nOBJECTS.forEach(o=>{const d=DE_LM[o.title];if(d){o.answer=d.a;o.name=d.p+d.t;o.tde=d.t}});\n" + anchor, 1)
    # word pool
    i = s.index('const POOL=('); j = s.index(';\n', i)
    s = s[:i] + "const POOL=(" + js(' '.join(POOL_DE)) + ").split(/\\s+/).filter(Boolean)" + s[j:]
    # quotes and on this day
    for name, data in (('Q_OPEN', Q_OPEN_DE), ('Q_CLOSE', Q_CLOSE_DE), ('Q_STAR', Q_STAR_DE)):
        i = s.index('const ' + name + '='); j = s.index(';\n', i)
        s = s[:i] + 'const ' + name + '=' + js(data) + s[j:]
    i = s.index('const OTD='); j = s.index('};', i) + 1
    s = s[:i] + 'const OTD=' + js(OTD_DE) + s[j:]
    # German labels run longer: keep the desktop help buttons inside their card
    if '/mobile/' not in src:
        k = s.index('</style>')
        s = s[:k] + '.asks{grid-template-columns:auto auto auto}.ask{font-size:12px;padding:8px 6px}.ask small{margin-left:3px}\n' + s[k:]
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    open(dst, 'w', encoding='utf-8').write(s)
    return report

if __name__ == '__main__':
    pairs = [('aperture/landmarks/index.html', 'aperture/landmarks/de/index.html'),
             ('aperture/landmarks/mobile/index.html', 'aperture/landmarks/de/mobile/index.html')]
    reps = [build(a, b) for a, b in pairs]
    print('matches  desktop mobile  string')
    for (n1, en), (n2, _) in zip(*reps):
        pass
    for (n1, en), (n2, _) in zip(*reps):
        flag = '   <-- not found' if n1 == 0 and n2 == 0 else ''
        print(f'{n1:7} {n2:6}  {en[:70]}{flag}')
