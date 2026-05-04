import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'ratgeber');

mkdirSync(OUT_DIR, { recursive: true });

const pages = [
  {
    slug: 'maklerkosten-beim-immobilienkauf',
    title: 'Maklerkosten beim Immobilienkauf',
    desc: 'Was kostet ein Immobilienmakler? Alles \xfcber die Maklerprovision, Kostenaufteilung und Sonderf\xe4lle beim Immobilienkauf in K\xf6ln.',
    content: `## 1. Kostenaufteilung beim Immobilienkauf

Seit Dezember 2020 m\xfcssen beide Parteien die Maklergeb\xfchren teilen, falls der Vermittler von beiden beauftragt wurde. K\xe4ufer zahlen \xfcblicherweise maximal die H\xe4lfte der Kosten. Sollte allein der Verk\xe4ufer den Makler engagieren, tr\xe4gt dieser auch die gesamte Provision.

## 2. H\xf6he der Maklerprovision

Die Provision liegt zwischen 3\xa0% und 7,14\xa0% des Kaufpreises und variiert je nach Bundesland und Marktlage. Typischerweise bewegt sich die Geb\xfchr bei geteilter Zahlung im Bereich von 6\u20137\xa0Prozent. Fr\xfcher zahlten K\xe4ufer in einigen Bundesl\xe4ndern wie Berlin die vollst\xe4ndige Provision; dies hat sich durch die gesetzliche \xc4nderung jedoch \xfcberwiegend gewandelt.

## 3. Maklerkosten bei Mietwohnungen

F\xfcr Vermietungen von Wohnraum gilt weiterhin das Verursacherprinzip \u2013 wer den Makler beauftragt, zahlt. Dies betrifft in erster Linie Vermieter, da sie typischerweise einen Vermittler zur Mietersuche engagieren.

## 4. Ausnahmefall und Sonderregelungen

Falls ein K\xe4ufer einen unabh\xe4ngigen Makler f\xfcr die Immobiliensuche anstellt, k\xf6nnen abweichende Vereinbarungen gelten, wobei dieser dann die Kosten selbst tr\xe4gt.`
  },
  {
    slug: 'notarkosten-beim-immobilienkauf',
    title: 'Notarkosten beim Immobilienkauf',
    desc: 'Wie hoch sind die Notarkosten beim Immobilienkauf? Berechnung, Kostenverteilung und Leistungen des Notars im \xdcberblick.',
    content: `## 1. Notarkosten: H\xf6he und Berechnung

- Die Notarkosten liegen in der Regel bei etwa **1,0\u20131,5\xa0% des Kaufpreises** der Immobilie.
- Die Kosten sind bundesweit einheitlich und richten sich nach dem Gerichts- und Notarkostengesetz (GNotKG).
- Die Geb\xfchren basieren direkt auf dem Kaufpreis und umfassen neben der Beurkundung auch zus\xe4tzliche Dienstleistungen.

## 2. Leistungen des Notars

- **Kaufvertragsentwurf**: Der Notar erstellt den Entwurf und versendet ihn zur Pr\xfcfung an beide Parteien.
- **Beratung und Aufkl\xe4rung**: Informationen \xfcber Rechte und Pflichten erm\xf6glichen fundierte Entscheidungen.
- **Beurkundung**: Der Kaufvertrag wird offiziell beurkundet f\xfcr rechtliche Wirksamkeit.
- **Grundbucheintragung**: Anmeldung des neuen Eigent\xfcmers und L\xf6schung von Vorlasten werden \xfcbernommen.

## 3. Kostenverteilung

In der Regel tr\xe4gt der **K\xe4ufer die Notarkosten**.

## 4. Zus\xe4tzliche Geb\xfchren

- Kosten f\xfcr das Grundbuchamt fallen f\xfcr Umschreibungen und Eintragungen an.
- Diese liegen ebenfalls bei etwa **0,5\xa0% des Kaufpreises**.

## 5. Transparenz und Sicherheit

Notare fungieren als neutrale Vermittler und gew\xe4hrleisten Rechtskonformit\xe4t sowie transparente Prozesse.`
  },
  {
    slug: 'denkmal-afa',
    title: 'Denkmal-AfA',
    desc: 'Die Denkmal-AfA erm\xf6glicht erhebliche Steuererleichterungen bei denkmalgesch\xfctzten Immobilien. Alles \xfcber Voraussetzungen und steuerliche Vorteile.',
    content: `## 1. Was ist die Denkmal-AfA?

- Die Denkmal-AfA ist eine spezielle Abschreibungsm\xf6glichkeit f\xfcr den Kauf und die Sanierung von denkmalgesch\xfctzten Immobilien oder Geb\xe4uden in Sanierungsgebieten.
- Sie erlaubt, Sanierungskosten \xfcber einen bestimmten Zeitraum steuerlich abzusetzen.

## 2. Vorteile f\xfcr Selbstnutzer und Vermieter

- **Selbstnutzer**: K\xf6nnen 9\xa0% der Sanierungskosten j\xe4hrlich \xfcber 10 Jahre steuerlich geltend machen.
- **Vermieter**: K\xf6nnen 8\xa0% der Sanierungskosten j\xe4hrlich \xfcber die ersten 8 Jahre und danach 4\xa0% \xfcber weitere 4 Jahre abschreiben. Dies ergibt eine maximale Abschreibung von 100\xa0% der Sanierungskosten \xfcber 12 Jahre.

## 3. Was kann abgeschrieben werden?

- Die AfA gilt nur f\xfcr die Sanierungs- und Modernisierungskosten, nicht f\xfcr den Kaufpreis der Immobilie selbst.
- Die Sanierungsma\xdfnahmen m\xfcssen vom Denkmalamt genehmigt werden, und die Immobilie muss als erhaltenswertes Denkmal anerkannt sein.

## 4. Steuerliche Ersparnisse

Die Denkmal-AfA kann eine erhebliche Steuerersparnis bedeuten, besonders f\xfcr Immobilienk\xe4ufer mit hoher Steuerlast, da die Sanierungskosten vom zu versteuernden Einkommen abgezogen werden.

## 5. Voraussetzungen

- Die Immobilie muss offiziell unter Denkmalschutz stehen oder sich in einem ausgewiesenen Sanierungsgebiet befinden.
- Die Ma\xdfnahmen m\xfcssen mit der Denkmalbeh\xf6rde abgestimmt und genehmigt sein.`
  },
  {
    slug: 'abschreibung-bei-immobilien',
    title: 'Abschreibung bei Immobilien',
    desc: 'Alle Abschreibungsm\xf6glichkeiten f\xfcr Immobilien: lineare AfA, Sonderabschreibung, Denkmal-AfA und Sanierungsgebiete im \xdcberblick.',
    content: `## 1. Lineare Abschreibung f\xfcr Wohnimmobilien

- Bei Wohnimmobilien, die **nach dem 31. Dezember 1924** gebaut wurden, k\xf6nnen Vermieter die Anschaffungs- oder Herstellungskosten \xfcber **50 Jahre mit 2\xa0% pro Jahr** abschreiben.
- F\xfcr Immobilien, die **vor dem 1. Januar 1925** gebaut wurden, betr\xe4gt die Abschreibung **2,5\xa0% j\xe4hrlich \xfcber 40 Jahre**.

## 2. Lineare Abschreibung f\xfcr Gewerbeimmobilien

Bei gewerblich genutzten Immobilien k\xf6nnen die Anschaffungskosten ebenfalls linear abgeschrieben werden. Hier ist in der Regel eine **Nutzungsdauer von 33 Jahren** (3\xa0% j\xe4hrlich) anzusetzen.

## 3. Sonderabschreibung nach \xa7\xa07b EStG

- Diese Form der Sonderabschreibung gilt f\xfcr den **Neubau von Mietwohnungen** im bez\xe4hlbaren Wohnraum. Sie erlaubt eine zus\xe4tzliche Abschreibung von **5\xa0% pro Jahr \xfcber vier Jahre**.
- Voraussetzung ist, dass die Baukosten bestimmte Grenzen nicht \xfcberschreiten und die Wohnung f\xfcr mindestens zehn Jahre vermietet wird.

## 4. Denkmal-AfA (Denkmalabschreibung)

- F\xfcr denkmalgesch\xfctzte Geb\xe4ude gibt es besondere Abschreibungen. **Selbstnutzer** k\xf6nnen 9\xa0% der Sanierungskosten \xfcber 10 Jahre abschreiben, **Vermieter** sogar 8\xa0% in den ersten 8 Jahren und 4\xa0% in den darauffolgenden 4 Jahren.

## 5. Au\xdfergew\xf6hnliche Abschreibungen

In bestimmten F\xe4llen, z.\xa0B. bei nachweislicher au\xdfergew\xf6hnlicher Abnutzung, kann eine zus\xe4tzliche Abschreibung angesetzt werden.

## 6. AfA f\xfcr Geb\xe4ude in Sanierungsgebieten

F\xfcr Immobilien in Sanierungsgebieten k\xf6nnen die Sanierungskosten **\xfcber 12 Jahre** abgeschrieben werden (8 Jahre zu 9\xa0% und 4 Jahre zu 7\xa0%).

## Zusammenfassung

- **Wohnimmobilien**: 2\xa0% oder 2,5\xa0% lineare Abschreibung
- **Gewerbeimmobilien**: 3\xa0% lineare Abschreibung
- **Sonderabschreibung f\xfcr Neubauten**: 5\xa0% f\xfcr 4 Jahre (bei gef\xf6rdertem Wohnraum)
- **Denkmal- und Sanierungsobjekte**: 8\xa0% und 4\xa0% (Vermietung) oder 9\xa0% (Eigennutzung) bei Sanierungskosten`
  },
  {
    slug: 'immobilienkauf',
    title: 'Immobilienkauf',
    desc: 'Schritt f\xfcr Schritt zum Immobilienkauf: Finanzierung, Objektsuche, Unterlagenpr\xfcfung, Kaufvertrag und Eigentums\xfcbertragung erkl\xe4rt.',
    content: `## 1. Finanzierung und Budgetplanung

- Vor dem Kauf ist eine solide Finanzplanung entscheidend. K\xe4ufer sollten Eigenkapital einbringen (empfohlen mindestens 20\xa0% des Kaufpreises) und eine Finanzierungsbest\xe4tigung der Bank einholen.
- Zus\xe4tzliche Nebenkosten wie Grunderwerbsteuer (3,5\u20136,5\xa0% je nach Bundesland), Notarkosten (ca. 1,5\xa0%), Maklergeb\xfchren (i.\xa0d.\xa0R. 3\u20137\xa0%) und Grundbuchkosten (ca. 0,5\xa0%) sollten eingeplant werden.

## 2. Objektsuche und Besichtigung

- Eine sorgf\xe4ltige Auswahl und Besichtigung der Immobilie sind essenziell, um Zustand, Lage und Infrastruktur zu pr\xfcfen.
- Wichtige Aspekte sind die N\xe4he zu Schulen, Einkaufsm\xf6glichkeiten und die Verkehrsanbindung sowie potenzielle M\xe4ngel oder Sanierungsbedarf.

## 3. Pr\xfcfung der Immobilie und Unterlagen

- Vor dem Kauf ist eine gr\xfcndliche Pr\xfcfung der Unterlagen ratsam: Grundbuchauszug, Energieausweis, Baugenehmigungen und Baubeschreibungen.
- Bei Eigentumswohnungen sind zudem die Teilungserkl\xe4rung und Protokolle der Eigent\xfcmerversammlungen wichtig.

## 4. Kaufvertrag und Notar

- Der Kaufvertrag wird vom Notar erstellt und enth\xe4lt alle Vereinbarungen zwischen K\xe4ufer und Verk\xe4ufer. Der Notar sorgt f\xfcr eine neutrale Beurkundung und kl\xe4rt \xfcber Rechte und Pflichten auf.

## 5. Eigentums\xfcbertragung und Grundbuch

- Nach der Zahlung des Kaufpreises erfolgt die Eigentums\xfcbertragung und Eintragung des neuen Eigent\xfcmers im Grundbuch.

## Zusammenfassung der Schritte

1. Budget und Finanzierung planen
2. Passende Immobilie finden und besichtigen
3. Unterlagen pr\xfcfen und Kaufentscheidung treffen
4. Notar und Kaufvertrag abwickeln
5. Eigentums\xfcbertragung und Grundbucheintrag`
  },
  {
    slug: 'immobilienverkauf',
    title: 'Immobilienverkauf',
    desc: 'So l\xe4uft ein Immobilienverkauf ab: Marktwertermittlung, Vermarktung, Besichtigungen, Kaufvertrag und \xdcbergabe Schritt f\xfcr Schritt erkl\xe4rt.',
    content: `## 1. Marktwert ermitteln

- Der erste Schritt besteht darin, den Marktwert der Immobilie zu ermitteln, um einen angemessenen Verkaufspreis festzulegen.
- Faktoren wie Lage, Zustand, Ausstattung und Marktlage beeinflussen den Wert.

## 2. Unterlagen vorbereiten

- F\xfcr den Verkauf sind verschiedene Dokumente erforderlich: Grundbuchauszug, Energieausweis, Baup\xe4ne und bei Eigentumswohnungen die Teilungserkl\xe4rung sowie Protokolle der Eigent\xfcmerversammlungen.

## 3. Immobilie inserieren und vermarkten

- Die Immobilie wird in Immobilienportalen, Zeitungen oder \xfcber Makler angeboten. Professionelle Fotos und aussagekr\xe4ftige Beschreibungen sind entscheidend.

## 4. Besichtigungen und Verhandlungen

- Interessenten sollten die Immobilie pers\xf6nlich besichtigen k\xf6nnen. In dieser Phase werden oft Verhandlungen gef\xfchrt, um den Verkaufspreis und andere Bedingungen anzupassen.

## 5. Kaufvertrag und Notar

- Sobald ein K\xe4ufer gefunden ist, erstellt der Notar den Kaufvertrag, in dem alle Vereinbarungen festgehalten werden. Bei der Beurkundung wird der Vertrag offiziell rechtskr\xe4ftig.

## 6. \xdcbergabe und Eigentums\xfcbertragung

- Nach der Zahlung erfolgt die \xdcbergabe der Immobilie und die Eintragung des neuen Eigent\xfcmers im Grundbuch. Bei der \xdcbergabe sollten alle wichtigen Dokumente \xfcbergeben und ein \xdcbergabeprotokoll erstellt werden.`
  },
  {
    slug: 'immobilienportale',
    title: 'Immobilienportale',
    desc: 'ImmobilienScout24, Immonet, Immowelt und Co.: Wie Immobilienportale funktionieren, was sie kosten und f\xfcr wen sie geeignet sind.',
    content: `## 1. Funktionen und Vorteile

- Immobilienportale bieten eine breite Auswahl an Inseraten f\xfcr Kauf und Miete von Wohnungen, H\xe4usern und Gewerbeobjekten
- Die Plattformen stellen Suchfilter bereit, mit denen Nutzer nach Lage, Preis, Gr\xf6\xdfe und anderen Kriterien filtern k\xf6nnen
- Virtuelle Besichtigungen, Bildergalerien und Grundrisse unterst\xfctzen erste Eindr\xfccke von Immobilien

## 2. Bekannte Immobilienportale

- In Deutschland z\xe4hlen ImmobilienScout24, Immonet und Immowelt zu den gr\xf6\xdften und beliebtesten Portalen
- Es existieren spezialisierte Plattformen f\xfcr Luxusimmobilien, Ferienwohnungen oder Studentenwohnungen

## 3. Nutzergruppen

- Privatpersonen und Immobilienmakler k\xf6nnen Inserate ver\xf6ffentlichen
- Eigent\xfcmer und Vermieter nutzen diese Portale, um schnell Interessenten zu finden

## 4. Kosten und Geb\xfchren

- Die Suche ist f\xfcr Interessenten kostenfrei
- Inserenten zahlen Geb\xfchren f\xfcr das Schalten von Anzeigen, besonders f\xfcr Zusatzoptionen

## 5. Zus\xe4tzliche Services

- Finanzierungsrechner und Umzugsservices
- Beratung bei der Immobilienbewertung und Mustervertr\xe4ge`
  },
  {
    slug: 'heizungsgesetz',
    title: 'Heizungsgesetz',
    desc: 'Das neue Heizungsgesetz (GEG) ab 2024: Welche Heizungen sind erlaubt? Was gilt f\xfcr Bestandsgeb\xe4ude? F\xf6rderprogramme im \xdcberblick.',
    content: `## 1. Pflicht zur Nutzung erneuerbarer Energien

- Ab **2024** m\xfcssen neu eingebaute Heizungen zu **mindestens 65\xa0% mit erneuerbaren Energien** betrieben werden.
- Wo keine kommunale W\xe4rmeplanung vorliegt, werden \xdcbergangsfristen und F\xf6rderungen gew\xe4hrt.

## 2. Auswahl an Heizsystemen

- Eigent\xfcmer haben mehrere **Optionen f\xfcr umweltfreundliche Heizungen**, z.\xa0B. W\xe4rmepumpen, Solarthermie, Fernw\xe4rme oder Biomasse. Auch der Einbau einer Gasheizung ist noch m\xf6glich, sofern sie mit gr\xfcnen Gasen betrieben werden kann.

## 3. Bestandsschutz und Ausnahmen

- Bestehende Heizungen d\xfcrfen weiter genutzt werden, solange sie funktionst\xfcchtig sind. Eine **Austauschpflicht** gilt nur f\xfcr Heizungen, die \xe4lter als 30 Jahre sind.
- F\xfcr Menschen \xfcber 80 Jahre, die in ihrem eigenen Einfamilienhaus leben, gibt es Sonderregelungen.

## 4. F\xf6rderung und finanzielle Unterst\xfctzung

- F\xfcr den Einbau klimafreundlicher Heizungen gibt es **staatliche F\xf6rderprogramme**. Die F\xf6rderung besteht aus Zusch\xfcssen und zinsg\xfcnstigen Krediten, deren H\xf6he je nach Einkommen gestaffelt ist.

## 5. Kommunale W\xe4rmeplanung

- Kommunen sollen eine **W\xe4rmeplanung** erstellen, um zu kl\xe4ren, in welchen Gebieten auf Fernw\xe4rme oder andere zentrale Heizsysteme gesetzt werden kann.

## Zusammenfassung

- Ab 2024 m\xfcssen neue Heizungen zu **65\xa0% mit erneuerbaren Energien** betrieben werden.
- Es gibt verschiedene Heizsysteme und staatliche F\xf6rderungen f\xfcr den Umstieg.
- Bestandsschutz f\xfcr bestehende Heizungen; Austauschpflicht ab 30 Jahren.
- Kommunen erstellen W\xe4rmep\xe4ne zur langfristigen Orientierung.`
  },
  {
    slug: 'gebaeudeenergiegesetz',
    title: 'Geb\xe4udeenergiegesetz (GEG)',
    desc: 'Das Geb\xe4udeenergiegesetz (GEG) ab 2024: Anforderungen an Heizungen, Bestandsschutz, F\xf6rderprogramme und kommunale W\xe4rmeplanung.',
    content: `## 1. Pflicht zur Nutzung erneuerbarer Energien

- Ab **2024** m\xfcssen neu eingebaute Heizungen zu **mindestens 65\xa0% mit erneuerbaren Energien** betrieben werden.
- Wo keine kommunale W\xe4rmeplanung vorliegt, werden \xdcbergangsfristen und F\xf6rderungen gew\xe4hrt.

## 2. Auswahl an Heizsystemen

- Eigent\xfcmer haben mehrere **Optionen f\xfcr umweltfreundliche Heizungen**, z.\xa0B. W\xe4rmepumpen, Solarthermie, Fernw\xe4rme oder Biomasse.

## 3. Bestandsschutz und Ausnahmen

- Bestehende Heizungen d\xfcrfen weiter genutzt werden, solange sie funktionst\xfcchtig sind. Eine **Austauschpflicht** gilt nur f\xfcr Heizungen, die \xe4lter als 30 Jahre sind.
- F\xfcr Menschen \xfcber 80 Jahre, die in ihrem eigenen Einfamilienhaus leben, gibt es Sonderregelungen.

## 4. F\xf6rderung und finanzielle Unterst\xfctzung

- F\xfcr den Einbau klimafreundlicher Heizungen gibt es **staatliche F\xf6rderprogramme** \u2013 Zusch\xfcsse und zinsg\xfcnstige Kredite.

## 5. Kommunale W\xe4rmeplanung

- Kommunen sollen eine **W\xe4rmeplanung** erstellen, um zu kl\xe4ren, in welchen Gebieten auf Fernw\xe4rme oder andere zentrale Heizsysteme gesetzt werden kann.

## Zusammenfassung

- Ab 2024 m\xfcssen neue Heizungen zu **65\xa0% mit erneuerbaren Energien** betrieben werden.
- Es gibt verschiedene Optionen f\xfcr Heizsysteme und staatliche F\xf6rderungen.
- Bestandsschutz f\xfcr bestehende Heizungen; Austauschpflicht ab 30 Jahren.
- Kommunen erstellen W\xe4rmep\xe4ne zur langfristigen Orientierung.`
  },
  {
    slug: 'daecher',
    title: 'Dachformen im \xdcberblick',
    desc: 'Sattel-, Walm-, Mansard-, Flach- und Pultdach: Alle Dachformen f\xfcr Wohn- und Geb\xe4ude erkl\xe4rt mit Vor- und Nachteilen.',
    content: `## 1. Satteldach

Das Satteldach hat zwei geneigte Dachfl\xe4chen, die am Dachfirst aufeinandertreffen. Es ist die **h\xe4ufigste Dachform** in Deutschland, robust, leicht zu bauen und gut f\xfcr Regen- und Schneelasten geeignet.

## 2. Walmdach

Beim Walmdach sind auch die Giebelseiten geneigt, sodass alle vier Seiten des Hauses Dachfl\xe4chen aufweisen. Diese Form bietet einen guten **Windschutz** und eignet sich besonders f\xfcr exponierte Lagen.

## 3. Mansarddach

Das Mansarddach hat zwei unterschiedlich geneigte Fl\xe4chen pro Seite. Diese Konstruktion schafft **mehr Wohnraum im Dachgeschoss** und ist oft bei historischen Geb\xe4uden zu finden.

## 4. Flachdach

Flachd\xe4cher haben nur eine geringe Neigung. Sie eignen sich f\xfcr moderne Geb\xe4ude, k\xf6nnen als **Dachterrasse** oder f\xfcr **Begr\xfcnung** genutzt werden.

## 5. Pultdach

Ein Pultdach besteht nur aus einer geneigten Dachfl\xe4che. Oft bei Anbauten oder modernen H\xe4usern verwendet, bietet es gute Eignung f\xfcr **Photovoltaikanlagen**.

## 6. Zeltdach

Beim Zeltdach laufen alle Dachfl\xe4chen spitz zusammen. Es wird meist auf quadratischen Geb\xe4uden eingesetzt. Diese Form bietet eine hohe **Windbest\xe4ndigkeit**.

## 7. Weitere Dachformen

- **Sheddach**: Mehrere hintereinander angeordnete, steil geneigte Dachfl\xe4chen \u2013 h\xe4ufig bei Industriegeb\xe4uden f\xfcr maximalen Tageslichteinfall.
- **Kr\xfcppelwalmdach**: Giebelseiten nur teilweise abgeschr\xe4gt \u2013 kombiniert Vorteile von Walm- und Satteldach.
- **Tonnendach**: Abgerundete, gew\xf6lbte Form mit besonders stabiler Struktur.`
  },
  {
    slug: 'daemmung-bei-immobilien',
    title: 'D\xe4mmung bei Immobilien',
    desc: 'Alles zur Geb\xe4uded\xe4mmung: D\xe4mmarten, Materialien, Vorteile, gesetzliche Vorgaben (GEG) und F\xf6rderprogramme f\xfcr Eigent\xfcmer.',
    content: `## 1. Arten der D\xe4mmung

- **Dach- und Obergeschossd\xe4mmung**: Besonders wichtig, da warme Luft nach oben steigt. G\xe4ngige Methoden sind Zwischensparrend\xe4mmung, Untersparrend\xe4mmung und Aufsparrend\xe4mmung.
- **Au\xdfenwandd\xe4mmung**: Reduziert W\xe4rmeverluste und sch\xfctzt das Geb\xe4ude vor Witterungseinfl\xfcssen. Man unterscheidet die **Vollw\xe4rmeschutzdämmung** und die **Kernd\xe4mmung** bei zweischaligem Mauerwerk.
- **Innend\xe4mmung**: Wird oft bei denkmalgesch\xfctzten Geb\xe4uden angewendet.
- **Keller- und Bodend\xe4mmung**: Die D\xe4mmung der Kellerdecke oder Bodenplatte ist bei unbeheizten Kellern sinnvoll.
- **Fenster- und T\xfcren-D\xe4mmung**: Moderne Fenster und T\xfcren mit Mehrfachverglasung k\xf6nnen W\xe4rmeverluste deutlich verringern.

## 2. D\xe4mmmaterialien

- **Mineralwolle (Glaswolle, Steinwolle)**: Weit verbreitet, gute D\xe4mmwirkung, nicht brennbar und schallisolierend.
- **Polystyrol (EPS und XPS)**: H\xe4ufig als Hartschaumplatten, g\xfcnstig, wasserabweisend.
- **Naturd\xe4mmstoffe**: Holzfaser, Zellulose, Hanf und Schafwolle \u2013 umweltfreundlicher, aber h\xf6here Kosten.
- **Vakuumd\xe4mmung**: Sehr d\xfcnne Platten mit extrem guter D\xe4mmwirkung, teurer.

## 3. Vorteile einer guten D\xe4mmung

- **Energieeinsparung**: Eine gute D\xe4mmung reduziert den Heizbedarf und senkt Energiekosten um bis zu 30\xa0% oder mehr.
- **Umweltschutz**: Durch geringeren Energieverbrauch werden CO\u2082-Emissionen reduziert.
- **Wertsteigerung der Immobilie**: Energetisch sanierte Immobilien erzielen h\xf6here Verkaufspreise.
- **Wohnkomfort**: Sorgt f\xfcr gleichm\xe4\xdfige Temperaturen und d\xe4mpft Au\xdfenger\xe4usche.

## 4. Gesetzliche Vorgaben und F\xf6rderung

- Durch das **Geb\xe4udeenergiegesetz (GEG)** sind bestimmte D\xe4mmstandards festgelegt.
- **F\xf6rderprogramme**: Staatliche F\xf6rderungen durch die KfW-Bank oder BAFA unterst\xfctzen D\xe4mmma\xdfnahmen.

## 5. Wirtschaftlichkeit

- D\xe4mmma\xdfnahmen k\xf6nnen sich je nach Umfang innerhalb von 10 bis 20 Jahren amortisieren.
- Einzelma\xdfnahmen wie die D\xe4mmung der Kellerdecke sind oft g\xfcnstiger und schneller amortisierbar.`
  },
  {
    slug: 'fenster',
    title: 'Fenstertypen im \xdcberblick',
    desc: 'Dreh-Kipp-, Schiebe-, Dach- und Panoramafenster: Alle Fenstertypen f\xfcr Wohn- und Geb\xe4ude mit Eigenschaften und Einsatzbereichen.',
    content: `## 1. Dreh-Kipp-Fenster

Kombination aus Dreh- und Kippmechanismus. Sehr beliebt in Europa, erm\xf6glicht sowohl komplette \xd6ffnung als auch einfaches L\xfcften durch Kippen.

## 2. Schiebefenster

Fenster, das sich horizontal oder vertikal verschieben l\xe4sst. Spart Platz und ist besonders f\xfcr kleine R\xe4ume geeignet.

## 3. Schwingfenster (Mittelschwingfenster)

Fensterfl\xfcgel schwingt um eine mittige Achse. H\xe4ufig in Dachfl\xe4chen verwendet.

## 4. Dachfenster

Speziell f\xfcr den Einbau in Dachschr\xe4gen entwickelt. Verschiedene Mechanismen wie Schwing-, Klapp- oder Kippfunktion.

## 5. Panoramafenster

Gro\xdffl\xe4chige Fenster, die eine umfassende Aussicht bieten. H\xe4ufig festverglast.

## 6. Kastenfenster

Doppelfenster mit zwei Rahmen hintereinander. Besonders in Altbauten zu finden und bieten eine gute Isolierung.

## 7. Festverglasung (Fixverglasung)

Fester Fenstertyp ohne \xd6ffnungsmechanismus. Bietet hohe Stabilit\xe4t und wird oft f\xfcr gro\xdfe Fensterflächen genutzt.

## 8. Weitere Fenstertypen

- **Drehfenster**: \xd6ffnung nach innen oder au\xdfen, Fensterfl\xfcgel um vertikale Achse \u2013 weit verbreitet und vielseitig.
- **Kippfenster**: Fl\xfcgel kippt um horizontale Achse, h\xe4ufig mit Drehfenster kombiniert.
- **Klappfenster**: \xd6ffnet nach au\xdfen, Scharniere oben \u2013 oft bei Kellerfenstern.
- **Ausstellfenster**: Fl\xfcgel klappt nach au\xdfen mit oben angebrachten Scharnieren \u2013 h\xe4ufig bei Badezimmerfenstern.
- **Bogenfenster**: Mit abgerundeten Formen, h\xe4ufig in Altbauten und Kirchen.`
  },
  {
    slug: 'verglasung',
    title: 'Verglasung: Alle Arten im \xdcberblick',
    desc: 'Einfach-, Doppel-, Dreifachverglasung, Schallschutz- und Sicherheitsglas: Alle Verglasungsarten f\xfcr Fenster und Fassaden erkl\xe4rt.',
    content: `## 1. Einfachverglasung

Besteht aus nur einer Glasscheibe. Heute veraltet und kaum noch verwendet, da sie eine sehr geringe W\xe4rmed\xe4mmung bietet. H\xe4ufig in \xe4lteren oder historischen Geb\xe4uden zu finden.

## 2. Isolierverglasung (Doppelverglasung)

Besteht aus zwei Glasscheiben mit einem dazwischenliegenden luft- oder gasgef\xfcllten Zwischenraum. Der Zwischenraum wirkt isolierend und verbessert die W\xe4rme- und Schalld\xe4mmung. Standard in modernen Geb\xe4uden.

## 3. Dreifachverglasung

Drei Glasscheiben mit zwei dazwischenliegenden, gasgef\xfcllten Zwischenr\xe4umen. Bietet eine hervorragende W\xe4rme- und Schalld\xe4mmung und ist besonders energieeffizient. Geeignet f\xfcr Passivh\xe4user und Niedrigenergiegeb\xe4ude.

## 4. Schallschutzverglasung

Entwickelt, um L\xe4rmbeeintr\xe4chtigung zu minimieren. Besonders n\xfctzlich f\xfcr Fenster an lauten Stra\xdfen oder in der N\xe4he von Bahngleisen.

## 5. Sicherheitsverglasung

- **Einscheiben-Sicherheitsglas (ESG)**: Geh\xe4rtetes Glas, das bei Bruch in kleine, ungef\xe4hrliche St\xfccke zerf\xe4llt.
- **Verbundsicherheitsglas (VSG)**: Besteht aus zwei Glasscheiben, die durch eine Folie verbunden sind; bei Bruch bleiben die Splitter an der Folie haften.

## 6. Sonnenschutzverglasung

Reduziert den W\xe4rmeeintrag durch Sonnenstrahlen und verhindert \xdcberhitzung im Sommer. Besonders geeignet f\xfcr gro\xdfe Fensterflächen mit direkter Sonneneinstrahlung.

## 7. W\xe4rmeschutzverglasung

Eine Form der Isolierverglasung mit speziellen Beschichtungen, die die W\xe4rme im Raum halten. H\xe4ufig in modernen Fenstern f\xfcr Wohngeb\xe4ude verbaut.

## 8. Ornament- und Brandschutzverglasung

- **Ornamentverglasung**: Strukturiertes oder gemustertes Glas f\xfcr mehr Privatsph\xe4re \u2013 oft in Badeziimmerfenstern und Eingangst\xfcren.
- **Brandschutzverglasung**: Stabil im Brandfall \u2013 wichtig in \xf6ffentlichen Geb\xe4uden.`
  },
  {
    slug: 'haustueren',
    title: 'Haust\xfcren: Alle Typen und Materialien',
    desc: 'Holz-, Stahl-, Aluminium- und Kunststoffhaust\xfcren im Vergleich: Materialien, Eigenschaften, Sicherheit und Design f\xfcr jedes Geb\xe4ude.',
    content: `## 1. Holzt\xfcren

- **Material**: Massivholz oder Holz mit mehrschichtigen Konstruktionen.
- **Merkmale**: Sehr robust, nat\xfcrlich isolierend und langlebig. Bietet einen warmen und traditionellen Look.
- **Nachteil**: Erfordert regelm\xe4\xdfige Pflege.
- **Einsatz**: Ideal f\xfcr klassische oder traditionelle Geb\xe4ude.

## 2. Stahlt\xfcren

- **Material**: Stahlblech mit D\xe4mmkern.
- **Merkmale**: Sehr stabil und einbruchsicher, pflegeleicht und langlebig.
- **Einsatz**: Besonders gut f\xfcr erh\xf6hte Sicherheitsanforderungen.

## 3. Aluminiumt\xfcren

- **Material**: Aluminiumprofile mit D\xe4mmkern.
- **Merkmale**: Witterungsbest\xe4ndig, leicht und korrosionsfest. Hohe Stabilit\xe4t und lange Lebensdauer.
- **Nachteil**: Teurer als andere Materialien.
- **Einsatz**: Besonders gut geeignet f\xfcr moderne und gewerbliche Geb\xe4ude.

## 4. Kunststofft\xfcren

- **Material**: PVC mit Stahlverst\xe4rkung und D\xe4mmung.
- **Merkmale**: Kosteng\xfcnstig, pflegeleicht und gut isolierend.
- **Nachteil**: Weniger stabil als Aluminium oder Stahl.
- **Einsatz**: H\xe4ufig in Wohngeb\xe4uden bei geringem Budget.

## 5. Glashaust\xfcren

- **Material**: Sicherheitsglas mit Metall- oder Holzrahmen.
- **Merkmale**: Erm\xf6glicht viel Lichteinfall und eine moderne, elegante Optik.
- **Einsatz**: Ideal f\xfcr moderne Geb\xe4ude.

## 6. Sicherheits- und Feuerschutzt\xfcren

- **Sicherheitst\xfcren**: Oft Stahl oder verst\xe4rkte Verbundmaterialien, mit Mehrfachverriegelungen \u2013 f\xfcr hohe Sicherheitsanforderungen.
- **Feuerschutzt\xfcren**: Stahl oder feuerfeste Materialien, verhindert Brandausbreitung \u2013 in \xf6ffentlichen und gewerblichen Geb\xe4uden.

## 7. Weitere Haust\xfcrenarten

- **Kompositt\xfcren**: Kombination aus Kunststoff, Aluminium und Glasfaser \u2013 sehr stabil, gute D\xe4mmwerte.
- **Smarte Haust\xfcren**: Elektronische Schlie\xdfsysteme, Fingerabdruckscanner oder App-Steuerung \u2013 f\xfcr tech-orientierte Geb\xe4ude.
- **Landhaustüren**: Meist Holz oder Holzimitate, stilistisch l\xe4ndlich oder rustikal.`
  },
  {
    slug: 'smarthome',
    title: 'Smart Home',
    desc: 'Smart-Home-Systeme f\xfcr Beleuchtung, Sicherheit, Heizung und Energie: Vorteile, Komponenten und Steuerungsm\xf6glichkeiten im \xdcberblick.',
    content: `## 1. Beleuchtung

- **Intelligente Lampen**: Dimmbar und in der Farbtemperatur ver\xe4nderbar, oft per App oder Sprachsteuerung regelbar.
- **Automatisierte Szenen**: Vordefinierte Beleuchtungsszenen, die je nach Tageszeit oder Stimmung eingestellt werden.

## 2. Sicherheit

- **\xdcberwachungskameras**: Mit App-Zugriff und Bewegungsbenachrichtigungen.
- **Smart-T\xfcrschl\xf6sser**: Zugangskontrolle per Smartphone oder Fingerabdruck.
- **Alarmanlagen**: Integrierte Systeme zur Einbruchs- und Brand\xfcberwachung.

## 3. Heizung und Klima

- **Intelligente Thermostate**: Automatische Temperaturregelung basierend auf Anwesenheit und Zeitpl\xe4nen.
- **Klimaanlagen-Integration**: Steuerung von Klimaanlagen oder Ventilatoren f\xfcr optimales Raumklima.

## 4. Energieeffizienz

- **Energie\xfcberwachung**: Verfolgung des Energieverbrauchs einzelner Ger\xe4te zur Optimierung.
- **Automatische Abschaltung**: Ger\xe4te oder Steckdosen lassen sich bei Nichtnutzung ausschalten.

## 5. Steuerung und Automatisierung

- **Zentrale Steuerungsplattformen**: Google Home, Amazon Alexa oder Apple HomeKit verbinden alle Ger\xe4te.
- **Sprachsteuerung**: Smarte Assistenten wie Alexa, Google Assistant oder Siri.
- **Szenen und Routinen**: Automatische Abl\xe4ufe, die verschiedene Ger\xe4te gleichzeitig steuern.

## Vorteile des Smart Homes

- **Komfort**: Fernsteuerung und Automatisierung erleichtern den Alltag.
- **Sicherheit**: Verbesserte \xdcberwachung und Kontrolle.
- **Energieeffizienz**: Senkung der Energiekosten durch gezielte Steuerung.
- **Flexibilit\xe4t**: Ger\xe4te lassen sich je nach Bedarf erweitern und individualisieren.`
  },
  {
    slug: 'smart-heizung',
    title: 'Smart Heizung',
    desc: 'Intelligente Heizungssteuerung: Thermostate, Geofencing, Selbstlernfunktion, Energieeinsparung und Kompatibilit\xe4t mit Alexa, Google & Co.',
    content: `## 1. Intelligente Thermostate

- **Individuelle Temperatursteuerung**: Jeder Raum kann individuell gesteuert werden, per App, Sprachassistent oder direkt am Thermostat.
- **Zeitpl\xe4ne und Routinen**: Heizzeiten k\xf6nnen im Voraus festgelegt werden.
- **Geofencing**: Heizungen passen sich an die Anwesenheit an \u2013 wenn alle Bewohner das Haus verlassen, wird automatisch heruntergeregelt.

## 2. Fernsteuerung und Mobilzugriff

\xdcber eine Smartphone-App k\xf6nnen Nutzer die Heizung von \xfcberall aus steuern. Anpassungen k\xf6nnen in Echtzeit vorgenommen werden.

## 3. Selbstlernende Systeme

Einige smarte Thermostate lernen das Heizverhalten der Bewohner und passen die Temperatur automatisch an. Die Systeme ber\xfccksichtigen Gewohnheiten, Wettervorhersagen und Raumnutzung.

## 4. Zonale Steuerung

Die smarte Heizungssteuerung erm\xf6glicht die Bildung von Heizzonen, sodass nur genutzte R\xe4ume geheizt werden.

## 5. Energieeinsparung und Umwelt

Nutzer k\xf6nnen den Energieverbrauch einsehen und analysieren. Durch gezieltes Heizen l\xe4sst sich der Verbrauch deutlich senken und der CO\u2082-Ausstoß reduzieren.

## 6. Kompatibilit\xe4t

Die meisten Smart-Thermostate sind mit Alexa, Google Assistant oder Apple HomeKit kompatibel.

## Beispiele f\xfcr Smart-Heizungssysteme

- **Tado**: Intelligente Thermostate mit Geofencing und Wetteranpassung.
- **Nest Thermostat**: Selbstlernend und mit Google Assistant kompatibel.
- **Honeywell Evohome**: Heizungssteuerung mit zonaler Steuerung.
- **Netatmo Smart Thermostat**: Energieverbrauchsüberwachung und Fernsteuerung.`
  },
  {
    slug: 'asbest',
    title: 'Asbest in Immobilien',
    desc: 'Asbest in Geb\xe4uden: Gesundheitsgefahren, betroffene Materialien, gesetzliche Regelungen und fachgerechte Entsorgung im \xdcberblick.',
    content: `## Eigenschaften und Gefahren

Die winzigen Fasern k\xf6nnen in die Luft gelangen und bei Inhalation in der Lunge ablagern. Dies kann zu schwerwiegenden Erkrankungen f\xfchren:

- **Asbestose** \u2013 eine Lungenkrankheit mit Narbenbildung
- **Lungenkrebs**
- **Mesotheliom** \u2013 eine seltene Krebsart des Brust- und Bauchfells

Ein besonderes Risiko besteht darin, dass diese Krankheiten Jahrzehnte nach dem Kontakt auftreten k\xf6nnen.

## Verbot und Entsorgung

Aufgrund der Gesundheitsrisiken wurde die Verwendung von Asbest in Deutschland seit den 1990er Jahren untersagt. Der Umgang, Abbau und die Beseitigung erfordern strikte Kontrollen. Nur spezialisierte Fachleute d\xfcrfen asbesthaltige Materialien entfernen.

## Hinweis f\xfcr Immobilienk\xe4ufer

Beim Kauf \xe4lterer Geb\xe4ude (Baujahr vor 1993) sollte gepr\xfcft werden, ob asbesthaltige Materialien verbaut sind. Dies kann den Wert und die Sanierungskosten erheblich beeinflussen. Ein Sachverst\xe4ndiger kann eine Asbestuntersuchung durchf\xfchren.`
  },
  {
    slug: 'grundbuch',
    title: 'Grundbuch',
    desc: 'Was steht im Grundbuch? Aufbau, Abteilungen, Einsicht und Bedeutung f\xfcr den Immobilienkauf und -verkauf erkl\xe4rt.',
    content: `## Aufbau des Grundbuchs

Das Grundbuch ist in verschiedene Abteilungen gegliedert:

1. **Bestandsverzeichnis**: Informationen \xfcber das Grundst\xfcck (Flurst\xfcck, Gr\xf6\xdfe, Lage).
2. **Abteilung I**: Eintragungen des Eigent\xfcmers.
3. **Abteilung II**: Eintragungen \xfcber Lasten und Beschr\xe4nkungen (z.\xa0B. Wegerechte).
4. **Abteilung III**: Eintragungen \xfcber Grundpfandrechte (Hypotheken, Grundschulden).

## Einsicht und Bedeutung

Das Grundbuch kann nur von berechtigten Personen (z.\xa0B. Eigent\xfcmer, K\xe4ufer, Banken) eingesehen werden und wird beim zust\xe4ndigen Grundbuchamt gef\xfchrt. Es ist wichtig f\xfcr den rechtssicheren Erwerb und die Beleihung von Immobilien, da alle relevanten Rechte und Pflichten dokumentiert sind. \xc4nderungen im Grundbuch, wie ein Eigent\xfcmerwechsel, bed\xfcrfen meist der Mitwirkung eines Notars.

## Bedeutung beim Immobilienkauf

Vor jedem Immobilienkauf sollte ein aktueller Grundbuchauszug eingeholt werden. Er zeigt, ob Lasten, Hypotheken oder Nutzungsrechte auf dem Grundst\xfcck eingetragen sind \u2013 entscheidend f\xfcr eine sichere Kaufentscheidung.`
  },
  {
    slug: 'wirtschaftsplan',
    title: 'Wirtschaftsplan (WEG)',
    desc: 'Der Wirtschaftsplan in der Eigent\xfcmergemeinschaft: Inhalt, Aufstellung, Hausgeldvorauszahlungen und Bedeutung f\xfcr Eigent\xfcmer erkl\xe4rt.',
    content: `## Inhalt des Wirtschaftsplans

Der Wirtschaftsplan enth\xe4lt typischerweise:

- **Verwaltungskosten** (z.\xa0B. Hausmeister, Verwaltung)
- **Betriebskosten** (z.\xa0B. Heizung, Wasser, Abfall)
- **Instandhaltungskosten** f\xfcr Reparaturen und Wartung
- **R\xfccklagen** f\xfcr zuk\xfcnftige gr\xf6\xdfere Sanierungen

## Bedeutung und Verabschiedung

Der Wirtschaftsplan wird vom Verwalter aufgestellt und in der Eigent\xfcmerversammlung beschlossen. Die Hausgeldvorauszahlungen der Eigent\xfcmer werden auf Basis des Plans berechnet. Ein gut durchdachter Wirtschaftsplan stellt sicher, dass die Immobilie finanziell stabil verwaltet und langfristig instand gehalten werden kann.

## Hinweis beim Immobilienkauf

Beim Kauf einer Eigentumswohnung sollte der aktuelle Wirtschaftsplan eingeholt werden. Er zeigt, wie hoch das Hausgeld ist und ob ausreichende R\xfccklagen f\xfcr Instandhaltungen gebildet wurden.`
  },
  {
    slug: 'nebenkostenabrechnung',
    title: 'Nebenkostenabrechnung',
    desc: 'Nebenkostenabrechnung f\xfcr Mieter und Vermieter: Bestandteile, Fristen, Nachzahlung und Widerspruch erkl\xe4rt.',
    content: `## Typische Bestandteile der Nebenkostenabrechnung

- **Heiz- und Warmwasserkosten**: F\xfcr Heizung und Warmwasseraufbereitung.
- **Wasserkosten**: Kosten f\xfcr Frisch- und Abwasser.
- **Abfallentsorgung**: M\xfcllgeb\xfchren.
- **Hausmeisterkosten**: Falls ein Hausmeister f\xfcr das Geb\xe4ude t\xe4tig ist.
- **Reinigungskosten**: Reinigung von Gemeinschaftsfl\xe4chen.
- **Gartenpflege**: Pflege von gemeinschaftlich genutzten Au\xdfenanlagen.
- **Versicherungen**: Geb\xe4udeversicherung und Haftpflichtversicherung.
- **Verwaltungskosten**: Verwaltung der Immobilie (in bestimmten F\xe4llen umlegbar).

## Abgleich und Nachzahlung/Guthaben

In der Nebenkostenabrechnung werden die Vorauszahlungen des Mieters mit den tats\xe4chlich angefallenen Kosten verglichen. Ergibt sich eine Differenz, muss der Mieter entweder nachzahlen oder erh\xe4lt ein Guthaben zur\xfcck.

## Fristen und Einspruch

- Der Vermieter muss die Nebenkostenabrechnung sp\xe4testens 12 Monate nach Ende des Abrechnungszeitraums vorlegen.
- Der Mieter hat nach Erhalt 12 Monate Zeit, die Abrechnung zu pr\xfcfen und ggf. Einspruch einzulegen.`
  },
  {
    slug: 'kaufvertrag',
    title: 'Kaufvertrag beim Immobilienkauf',
    desc: 'Was steht im Immobilienkaufvertrag? Alle wichtigen Bestandteile, die Rolle des Notars und worauf K\xe4ufer achten sollten.',
    content: `## Wichtigste Bestandteile eines Immobilienkaufvertrags

1. **Vertragsparteien**: Angabe der K\xe4ufer und Verk\xe4ufer mit vollst\xe4ndigen Namen und Anschriften.
2. **Kaufgegenstand**: Detaillierte Beschreibung der Immobilie, einschlie\xdflich Grundst\xfccksnummer, Lage und Zubeh\xf6r.
3. **Kaufpreis und Zahlungsmodalit\xe4ten**: Festlegung des Kaufpreises sowie der Fristen und Bedingungen f\xfcr die Zahlung.
4. **\xdcbergabe und Besitz\xfcbergang**: Vereinbarungen zum Zeitpunkt, ab dem der K\xe4ufer die Immobilie nutzen darf.
5. **Belastungen und Grundbuchstand**: Angaben zu bestehenden Belastungen und die Verpflichtung, das Objekt lastenfrei zu \xfcbergeben.
6. **Haftung und Gew\xe4hrleistung**: Ausschluss oder Regelung der Haftung f\xfcr Sachmängel (bei gebrauchten Immobilien oft als \u201egekauft wie gesehen\u201c).
7. **R\xfccktrittsrechte und besondere Vereinbarungen**: Eventuelle Bedingungen, unter denen der Vertrag r\xfcckabgewickelt werden kann.
8. **Notarkosten und Grunderwerbsteuer**: Regelungen zur Kostentragung, wobei in der Regel der K\xe4ufer Notarkosten und Grunderwerbsteuer \xfcbernimmt.

Der Notar erl\xe4utert alle Vertragsinhalte und sorgt daf\xfcr, dass beide Parteien die Inhalte vollst\xe4ndig verstehen, bevor der Vertrag unterzeichnet wird.`
  },
  {
    slug: 'grundschuld',
    title: 'Grundschuld',
    desc: 'Was ist eine Grundschuld? Unterschied zur Hypothek, Flexibilit\xe4t, Risiken und Bedeutung f\xfcr die Baufinanzierung erkl\xe4rt.',
    content: `## Merkmale der Grundschuld

- **Unabh\xe4ngig vom Kredit**: Anders als eine Hypothek ist die Grundschuld nicht direkt an die Existenz eines Kredits gebunden und bleibt bestehen, auch wenn der Kredit zur\xfcckgezahlt ist.
- **Flexibilit\xe4t**: Sie kann mehrfach verwendet werden, z.\xa0B. f\xfcr neue Kredite, ohne eine erneute Eintragung ins Grundbuch.
- **H\xf6he der Grundschuld**: Meistens entspricht sie dem Kreditbetrag oder liegt etwas dar\xfcber, um m\xf6gliche zus\xe4tzliche Kosten abzudecken.

## Vorteile und Risiken

Die Grundschuld bietet Kreditgebern eine hohe Sicherheit und erm\xf6glicht oft g\xfcnstigere Zinskonditionen f\xfcr Kreditnehmer. Allerdings ist bei Zahlungsverzug des Kreditnehmers die Immobilie gef\xe4hrdet, da die Bank dann das Recht auf Verwertung hat.

## Unterschied zur Hypothek

W\xe4hrend die Hypothek direkt an den Kreditbetrag gekoppelt ist und sich mit jeder Tilgung reduziert, bleibt die Grundschuld als eigenst\xe4ndiges Recht im Grundbuch bestehen. In der Praxis bevorzugen Banken daher \xfcberwiegend die Grundschuld.`
  },
  {
    slug: 'hypothek',
    title: 'Hypothek',
    desc: 'Was ist eine Hypothek? Wie unterscheidet sie sich von der Grundschuld? Merkmale, Tilgung und Risiken f\xfcr Immobilienk\xe4ufer.',
    content: `## Merkmale der Hypothek

- **An den Kredit gebunden**: Anders als die Grundschuld ist die Hypothek direkt an die Existenz des Kredits gekoppelt. Sie reduziert sich mit jeder R\xfcckzahlung und erl\xf6scht vollst\xe4ndig, sobald das Darlehen abbezahlt ist.
- **Automatische Tilgung der Sicherheit**: Die Hypothek verringert sich automatisch parallel zur Kredittilgung.
- **Verkn\xfcpfung mit Darlehensbetrag**: Die Hypothekenh\xf6he entspricht \xfcblicherweise dem Darlehensbetrag oder liegt leicht dar\xfcber.

## Vorteile und Risiken

Die Hypothek bietet Kreditgebern hohe Sicherheit durch die Immobilie als Verm\xf6genswert. F\xfcr Kreditnehmer besteht der Vorteil in der automatischen Reduktion mit der Darlehenstilgung.

Als Risiko besteht die M\xf6glichkeit der Zwangsversteigerung bei Zahlungsr\xfcckst\xe4nden. Insgesamt stellt die Hypothek eine weniger flexible, aber klare Sicherungsform dar \u2013 besonders geeignet f\xfcr langfristige Finanzierungen.

## Praxis: Hypothek vs. Grundschuld

In der deutschen Bankenpraxis wird heute \xfcberwiegend die **Grundschuld** statt der Hypothek eingesetzt, da sie flexibler ist und f\xfcr Anschlussfinanzierungen wiederverwendet werden kann.`
  },
  {
    slug: 'grundsteuer',
    title: 'Grundsteuer',
    desc: 'Grundsteuer 2025: Neue Bewertungsgrundlagen, Hebesatz der Kommunen, Berechnung und Auswirkungen f\xfcr Eigent\xfcmer und Mieter.',
    content: `## Merkmale der Grundsteuer

- **Bemessungsgrundlage**: Die Steuer basiert auf dem Einheitswert, der vom Finanzamt festgelegt wird. Die Berechnung unterscheidet sich je nach Nutzungsart (unbebaute Grundst\xfccke, Wohnimmobilien, Gewerbeimmobilien).
- **Hebesatz der Kommune**: Jede Gemeinde legt einen individuellen Hebesatz fest, der die Steuerh\xf6he direkt beeinflusst.
- **Grundsteuerreform**: Ab 2025 werden alle Grundst\xfccke neu bewertet mit realistischeren Ma\xdfst\xe4ben. Die Reform soll zu einer gerechteren und aktuelleren Besteuerung f\xfchren und regionale Unterschiede besser ber\xfccksichtigen.

## Vorteile und Herausforderungen

Die Grundsteuer sichert stabile kommunale Einnahmen f\xfcr Infrastruktur, Bildung und \xf6ffentliche Dienste. Bei Mietobjekten wird sie h\xe4ufig auf Mieter umgelegt.

Allerdings k\xf6nnen Neubewertungen zu h\xf6heren Belastungen f\xfcr Eigent\xfcmer f\xfchren \u2013 ein wichtiger Kostenfaktor beim Immobilienkauf und bei der Renditenkalkulation f\xfcr Kapitalanleger.`
  },
  {
    slug: 'baufinanzierung',
    title: 'Baufinanzierung',
    desc: 'Baufinanzierung f\xfcr Immobilienk\xe4ufer: Eigenkapital, Zinsbindung, Tilgung, Sondertilgungen und Tipps f\xfcr die optimale Finanzierung.',
    content: `## Merkmale der Baufinanzierung

- **Eigenkapitalanteil**: Ein hoher Eigenkapitalanteil reduziert das Risiko f\xfcr die Bank und f\xfchrt oft zu besseren Kreditkonditionen. Banken empfehlen in der Regel, mindestens 10\u201330\xa0% der Gesamtkosten als Eigenkapital einzubringen.
- **Zinssatz und Zinsbindung**: Der Zinssatz ist ein zentraler Faktor, der die monatliche Belastung bestimmt. Die Zinsbindung legt fest, wie lange der vereinbarte Zinssatz konstant bleibt, meist zwischen 5 und 30 Jahren.
- **Tilgung und Sondertilgung**: Die Tilgung beschreibt den Anteil der monatlichen Rate, der zur R\xfcckzahlung des Darlehens dient. In der Regel liegt der Tilgungssatz zu Beginn bei 1\u20133\xa0% der Kreditsumme.

## Vorteile und Herausforderungen

Eine Baufinanzierung erm\xf6glicht es K\xe4ufern, hohe Immobilienwerte durch monatliche Ratenzahlungen zu stemmen und Eigentum langfristig zu erwerben. Sie bietet mit Zinsbindung und Sondertilgungsoptionen eine gute Planbarkeit und Flexibilit\xe4t. Gleichzeitig erfordert sie eine sorgf\xe4ltige Kalkulation der Belastung. Eine umfassende Beratung durch Banken oder Finanzierungsberater ist empfehlenswert.`
  },
  {
    slug: 'erbpacht',
    title: 'Erbpacht',
    desc: 'Was ist Erbpacht? Laufzeiten, Erbbauzins, Eigentum an der Immobilie, Vor- und Nachteile f\xfcr K\xe4ufer erkl\xe4rt.',
    content: `## Merkmale der Erbpacht

- **Lange Laufzeiten**: Erbpachtvertr\xe4ge haben typischerweise Laufzeiten zwischen 50 und 99 Jahren und bieten langfristige Planungssicherheit. Am Ende kann der Vertrag verl\xe4ngert oder das Grundst\xfcck zur\xfcckgegeben werden.
- **Erbbauzins**: Der P\xe4chter zahlt einen j\xe4hrlichen Erbbauzins, der meist einen festen Prozentsatz des Grundst\xfckswerts betr\xe4gt. Dieser wird regelm\xe4\xdfig angepasst.
- **Eigentum an der Immobilie**: Der P\xe4chter besitzt das Geb\xe4ude, nicht das Grundst\xfcck. Bei Vertragsende ohne Verl\xe4ngerung erh\xe4lt der Grundst\xfcckseigent\xfcmer die Immobilie und der P\xe4chter wird \xfcblicherweise entsch\xe4digt.

## Vorteile und Herausforderungen

Erbpacht erm\xf6glicht niedrigere Anfangskosten und mehr Flexibilit\xe4t beim Immobilienerwerb. F\xfcr Verp\xe4chter schafft es eine konstante Einnahmequelle.

Herausforderungen sind: steigende Erbbauzinsen f\xfchren zu h\xf6heren Langzeitkosten, sinkender Immobilienwert bei abnehmender Restlaufzeit, restriktivere Kreditvergabe durch Banken und das Risiko, Grundst\xfcck und Immobilie am Vertragsende zu verlieren.`
  },
  {
    slug: 'flurkarte',
    title: 'Flurkarte',
    desc: 'Was ist eine Flurkarte? Inhalt, Bedeutung f\xfcr Grundst\xfccksgesch\xe4fte, Bauvorhaben und wie man sie bekommt.',
    content: `## Merkmale der Flurkarte

- **Grafische Darstellung von Grundst\xfccken**: Die Flurkarte zeigt die Lage und Umrisse der Grundst\xfccke eines Gebiets und enth\xe4lt Flurst\xfccknummern zur eindeutigen Identifikation. Die Karte enth\xe4lt auch benachbarte Grundst\xfccke, angrenzende Stra\xdfen und andere relevante geografische Merkmale.
- **Zus\xe4tzliche Informationen**: Neben den Grundst\xfcccksgrenzen kann die Flurkarte Informationen wie die Bebauung, die Art der Nutzung und genaue Fl\xe4chengr\xf6\xdfen enthalten.
- **Rechtliche Relevanz**: Die Flurkarte dient als rechtliche Grundlage bei Grundst\xfccksgesch\xe4ften, Bauvorhaben und Planungen. Sie ist h\xe4ufig Bestandteil von Bauantr\xe4gen.

## Bedeutung und Herausforderungen

Die Flurkarte ist unverzichtbar f\xfcr Bauherren, Grundst\xfcckseigeent\xfcmer und Beh\xf6rden, da sie eine exakte und transparente \xdcbersicht \xfcber die Grundst\xfcckstruktur eines Gebiets bietet. Sie erleichtert die Planung und Bebauung und hilft, Streitigkeiten \xfcber Grenzverl\xe4ufe zu kl\xe4ren. Flurkarten m\xfcssen regelm\xe4\xdfig aktualisiert werden und sind beim zust\xe4ndigen Katasteramt erh\xe4ltlich.`
  },
  {
    slug: 'zwangsversteigerung',
    title: 'Zwangsversteigerung',
    desc: 'Zwangsversteigerung: Ablauf, Mindestgebot, Rolle der Gl\xe4ubiger, Chancen und Risiken f\xfcr K\xe4ufer erkl\xe4rt.',
    content: `## Merkmale der Zwangsversteigerung

### Verfahren und Ablauf

Die Zwangsversteigerung wird durch einen gerichtlichen Beschluss eingeleitet und findet \xf6ffentlich in Form einer Versteigerung vor dem Amtsgericht statt. Der Verkehrswert der Immobilie wird zuvor durch einen Gutachter ermittelt. Im Versteigerungstermin k\xf6nnen Interessenten Gebote abgeben. Es gibt meist zwei Versteigerungsrunden; in der zweiten Runde entf\xe4llt das Mindestgebot von 50\xa0% des Verkehrswerts.

### Rolle der Gl\xe4ubiger

Hauptinitiatoren von Zwangsversteigerungen sind Gl\xe4ubiger, z.\xa0B. Banken, die mit der Immobilie eine Kreditsicherheit haben. Wenn mehrere Gl\xe4ubiger existieren, erfolgt die Auszahlung gem\xe4\xdf ihrer Rangfolge im Grundbuch.

### Rechtsfolgen f\xfcr den Eigent\xfcmer

Mit Abschluss des Verfahrens geht das Eigentum auf den K\xe4ufer \xfcber. Der Versteigerungserl\xf6s wird zur Schuldentilgung verwendet. Sollte ein \xdcberschuss entstehen, steht dieser Betrag dem ehemaligen Eigent\xfcmer zu.

## Vorteile und Risiken f\xfcr K\xe4ufer

F\xfcr K\xe4ufer bietet eine Zwangsversteigerung die M\xf6glichkeit, Immobilien oft unter Marktwert zu erwerben. Allerdings m\xfcssen K\xe4ufer oft ohne vorherige Besichtigung und in \u201ewie besehen\u201c-Zustand kaufen. M\xf6gliche Altlasten und Instandhaltungsr\xfcckst\xe4nde sind oft unklar.`
  },
  {
    slug: 'bauvoranfrage',
    title: 'Bauvoranfrage',
    desc: 'Was ist eine Bauvoranfrage? Wann ist sie sinnvoll? Verbindlichkeit, Kosten, Bearbeitungszeit und Unterschied zur Baugenehmigung erkl\xe4rt.',
    content: `## Merkmale der Bauvoranfrage

- **Verbindliche Teilgenehmigung**: Das Bauamt beantwortet spezifische Fragen zur zul\xe4ssigen Nutzung, maximalen Geb\xe4udeh\xf6he, Geschossanzahl oder Abstandsfl\xe4chen. Die Zusage ist f\xfcr einen bestimmten Zeitraum (meist zwei bis drei Jahre) verbindlich.
- **Kosten und Bearbeitungszeit**: Geb\xfchren h\xe4ngen von Komplexit\xe4t und kommunalen Geb\xfchrenordnungen ab. Die Bearbeitungszeit liegt h\xe4ufig zwischen einigen Wochen und mehreren Monaten.
- **Sinnvoll bei Sonderbauten**: Die Bauvoranfrage ist besonders n\xfctzlich bei Vorhaben, die nicht den typischen Vorgaben entsprechen.

## Vorteile und Herausforderungen

Die Bauvoranfrage bietet rechtliche Absicherung und reduziert finanzielles Risiko, da potenzielle Konflikte fr\xfchzeitig erkennbar werden. Eine Herausforderung besteht darin, dass die Bauvoranfrage keine vollst\xe4ndige Baugenehmigung ersetzt. Sie bietet keine Garantie, dass das Bauamt sp\xe4ter nicht zus\xe4tzliche Auflagen stellt.`
  },
  {
    slug: 'energieausweis',
    title: 'Energieausweis',
    desc: 'Verbrauchs- oder Bedarfsausweis: Wann ist welcher Energieausweis erforderlich? Energieeffizienzklassen, Kosten und Bedeutung beim Verkauf.',
    content: `## Merkmale des Energieausweises

### Verbrauchs- und Bedarfsausweis

Der **Verbrauchsausweis** orientiert sich am tats\xe4chlichen Energieverbrauch der Bewohner der letzten drei Jahre. Diese Variante ist kosteng\xfcnstiger und besonders f\xfcr Mehrfamilienh\xe4user mit mindestens f\xfcnf Wohneinheiten geeignet.

Der **Bedarfsausweis** ermittelt den Energiebedarf anhand der Geb\xe4udetechnik und -h\xfclle (Fenster, W\xe4nde, Dach) sowie weiterer baulicher Merkmale. Diese Variante ist aufw\xe4ndiger und teurer, liefert jedoch eine objektivere Bewertung und wird f\xfcr \xe4ltere Geb\xe4ude mit weniger als f\xfcnf Wohneinheiten ben\xf6tigt.

### Energieeffizienzklassen und Skala

Das Dokument zeigt eine farbcodierte Skala von gr\xfcn (geringer Verbrauch) bis rot (hoher Verbrauch). Die Klassifizierung reicht von A+ (sehr effizient) bis H (sehr ineffizient), gemessen in Kilowattstunden pro Quadratmeter pro Jahr.

### Empfehlungen zur energetischen Sanierung

Das Dokument enth\xe4lt oft unverbindliche Vorschl\xe4ge zur Effizienzverbesserung, etwa durch W\xe4rmed\xe4mmung, Fenstererneuerung oder Heizungsmodernisierung.

## Bedeutung beim Immobilienverkauf

Beim Verkauf oder der Vermietung einer Immobilie ist der Energieausweis gesetzlich vorgeschrieben. Er muss Kaufinteressenten bei der Besichtigung unaufgefordert vorgelegt werden. Ein gutes Energierating kann den Immobilienwert positiv beeinflussen.`
  },
  {
    slug: 'mietspiegel',
    title: 'Mietspiegel',
    desc: 'Was ist ein Mietspiegel? Einfacher und qualifizierter Mietspiegel, ortsübliche Vergleichsmiete und Bedeutung f\xfcr Mieter und Vermieter.',
    content: `## Merkmale des Mietspiegels

### Ortsübliche Vergleichsmiete

Die angegebenen Mieten stellen Durchschnittswerte dar, die auf Basis vergleichbarer Wohnungen in der jeweiligen Region ermittelt werden. Sie fungieren als Referenzpunkt f\xfcr Mietanpassungen und Neuvermietungen.

### Unterscheidung nach Wohnungsmerkmalen

Mietspiegel unterscheiden zwischen Kriterien wie Wohnfl\xe4che, Baujahr, Lage und Ausstattungsmerkmalen (etwa Balkon, Einbauk\xfcche, Energieeffizienz).

### Einfacher und qualifizierter Mietspiegel

Ein einfacher Mietspiegel basiert auf freiwilligen Daten und bietet grundlegende Orientierung. Ein qualifizierter Mietspiegel folgt wissenschaftlichen Standards, wird von Kommunen entwickelt und bietet h\xf6here Rechtssicherheit sowie G\xfcltigkeit bei Gerichtsverfahren.

## Vorteile und Herausforderungen

Der Mietspiegel schafft Transparenz und stabilisiert Mietpreise. Mieter erhalten eine rechtliche Grundlage gegen \xfcberh\xf6hte Forderungen, w\xe4hrend Vermieter gerechtfertigte Erh\xf6hungen durchsetzen k\xf6nnen. Ein Nachteil ist, dass Mietspiegel nicht alle Wohnlagen genau abbilden und auf Durchschnittswerten beruhen.`
  },
  {
    slug: 'baulastenverzeichnis',
    title: 'Baulastenverzeichnis',
    desc: 'Was ist das Baulastenverzeichnis? Arten von Baulasten, Unterschied zum Grundbuch und Bedeutung beim Immobilienkauf.',
    content: `## Merkmale des Baulastenverzeichnisses

- **Eintragung von Baulasten**: Baulasten werden freiwillig von Grundst\xfcckseigeent\xfcmern \xfcbernommen und anschlie\xdfend ins Baulastenverzeichnis eingetragen. Diese Eintragung ist bindend und bleibt auch bei Eigentums\xfcberg\xe4ngen erhalten.
- **Arten von Baulasten**: Das Register umfasst verschiedene Kategorien wie Abstandsfl\xe4chenbaulast (bei Unterschreitung vorgeschriebener Geb\xe4udeabst\xe4nde), Stellplatzbaulast (f\xfcr Parkplatzfl\xe4chen auf anderen Grundst\xfccken) und Erschlie\xdfungsbaulast (f\xfcr Wege oder Zufahrten zu anderen Grundst\xfccken).
- **Unterschied zum Grundbuch**: Im Gegensatz zum Grundbuch, das privatrechtliche Belastungen und Eigentumsverh\xe4ltnisse dokumentiert, umfasst das Baulastenverzeichnis nur \xf6ffentlich-rechtliche Verpflichtungen.

## Bedeutung beim Immobilienkauf

Beim Kauf eines Grundst\xfccks sollte das Baulastenverzeichnis beim zust\xe4ndigen Bauamt eingesehen werden. Eingetragene Baulasten k\xf6nnen die Bebauungsm\xf6glichkeiten erheblich einschr\xe4nken und sind nicht im Grundbuch sichtbar.`
  },
  {
    slug: 'eigenbedarfsklage',
    title: 'Eigenbedarfsk\xfcndigung: Voraussetzungen & Fristen',
    desc: 'Eigenbedarfsk\xfcndigung: Wann ist sie zul\xe4ssig? K\xfcndigungsfristen, Widerspruchsrecht des Mieters und gerichtliche Durchsetzung erkl\xe4rt.',
    content: `## 1. Voraussetzungen f\xfcr Eigenbedarf

- Der Vermieter muss die Wohnung f\xfcr sich, seine Familie oder andere enge Angeh\xf6rige ben\xf6tigen.
- Der Bedarf muss tats\xe4chlich bestehen und ernsthaft sein; vorgesch\xfctzter Eigenbedarf ist unzul\xe4ssig.

## 2. K\xfcndigung wegen Eigenbedarf

- Der Vermieter muss eine **ordentliche K\xfcndigung** aussprechen, in der der Eigenbedarf nachvollziehbar dargelegt wird.
- K\xfcndigungsfristen je nach Mietdauer: **3 Monate** (bis 5 Jahre), **6 Monate** (5\u20138 Jahre), **9 Monate** (mehr als 8 Jahre).

## 3. Widerspruch des Mieters

- Mieter haben das Recht, der K\xfcndigung zu widersprechen, etwa aus **H\xe4rtegr\xfcnden** (z.\xa0B. hohes Alter, Krankheit, fehlende alternative Wohnm\xf6glichkeiten).
- Der Widerspruch muss sp\xe4testens zwei Monate vor Ablauf der K\xfcndigungsfrist schriftlich eingehen.

## 4. Einreichung der Klage

- Wenn der Mieter nicht auszieht, kann der Vermieter eine **R\xe4umungsklage** beim zust\xe4ndigen Gericht einreichen.

## 5. Gerichtsverfahren

- Im Verfahren m\xfcssen der Vermieter den Eigenbedarf und der Mieter eventuelle H\xe4rtegr\xfcnde glaubhaft machen.
- Bei Urteil zugunsten des Vermieters erh\xe4lt der Mieter eine R\xe4umungsfrist von **2 Wochen bis mehreren Monaten**.`
  },
  {
    slug: 'vergleichsmiete',
    title: 'Vergleichsmiete',
    desc: 'Was ist die Vergleichsmiete? Berechnung, Bedeutung f\xfcr Mieterhöhungen, Mietpreisbremse und ortsübliche Miete in Köln erkl\xe4rt.',
    content: `## 1. Definition der Vergleichsmiete

- Beschreibt den durchschnittlichen Mietpreis f\xfcr \xe4hnliche Wohnungen vor Ort basierend auf Mieten der letzten sechs Jahre in der Region.
- Dient zur Ermittlung des Marktwerts und zur Sicherung angemessener Mieterhöhungen.

## 2. Grundlage der Berechnung

Die Vergleichsmiete ber\xfccksichtigt:

- **Lage**: Region oder Stadt
- **Gr\xf6\xdfe und Ausstattung**: Quadratmeter, Baujahr, Modernisierungsstand, Balkon
- **Art des Geb\xe4udes**: Mietwohnung, Einfamilienhaus, Mehrfamilienhaus

## 3. Mietspiegel als Orientierung

Ein Mietspiegel zeigt die orts\xfcblichen Vergleichsmieten auf Basis st\xe4dtischer oder kommunaler Datensammlungen. Es gibt qualifizierte Mietspiegel mit wissenschaftlichen Methoden und einfache Varianten.

## 4. Anwendung der Vergleichsmiete

- **Mieterhöhungen**: Vermieter d\xfcrfen bis zur Vergleichsmiete erh\xf6hen, begrenzt durch Kappungsgrenzen von 15\u201320\xa0% in drei Jahren.
- **Neuvermietungen**: In Gebieten mit Mietpreisbremse darf die Miete maximal 10\xa0% \xfcber der orts\xfcblichen Vergleichsmiete liegen.
- **Mietsenkungen**: Mieter k\xf6nnen Reduktion fordern, wenn ihre Miete erheblich \xfcber dem Vergleichswert liegt.

## 5. Mietpreisbremse

In deutschen Ballungsr\xe4umen gilt eine Mietpreisbremse, welche Neuvermietungen auf maximal 10\xa0% \xfcber der Vergleichsmiete begrenzt, au\xdfer bei Neubauten und gro\xdffl\xe4chigen Renovierungen.`
  },
  {
    slug: 'eigenbedarfsklage-2',
    title: 'Eigenbedarfsk\xfcndigung: Ablauf und Zusammenfassung',
    desc: 'Der vollst\xe4ndige Ablauf einer Eigenbedarfsk\xfcndigung: Form, Fristen, Widerspruch, Klage und gerichtliches Verfahren Schritt f\xfcr Schritt.',
    content: `## 1. Eigenbedarfsk\xfcndigung

Der Vermieter kann das Mietverh\xe4ltnis beenden, wenn er oder ein naher Angeh\xf6riger die Wohnung selbst ben\xf6tigt. Der Eigenbedarf muss berechtigt sein, mit einem nachvollziehbaren Grund.

## 2. Form und Inhalt der K\xfcndigung

- Die K\xfcndigung muss schriftlich erfolgen und vom Vermieter oder Vertreter unterzeichnet sein.
- Der Vermieter muss den Eigenbedarf genau begr\xfcnden, einschlie\xdflich der Person, die einziehen soll, und des Nutzungsgrundes.

## 3. Fristen bei Eigenbedarfsk\xfcndigung

Die K\xfcndigungsfrist h\xe4ngt von der Mietdauer ab:

- Bis 5 Jahre: 3 Monate
- 5 bis 8 Jahre: 6 Monate
- Mehr als 8 Jahre: 9 Monate

## 4. Widerspruch des Mieters

Mieter k\xf6nnen widersprechen, wenn der Eigenbedarf unberechtigt ist oder besondere pers\xf6nliche H\xe4rten bestehen. Der Widerspruch muss sp\xe4testens zwei Monate vor Fristablauf schriftlich eingehen.

## 5. Eigenbedarfsklage

Wenn der Mieter nicht auszieht, muss der Vermieter beim Amtsgericht eine Eigenbedarfsklage einreichen.

## 6. Gerichtliches Verfahren und R\xe4umungsfrist

Das Gericht pr\xfcft, ob der Eigenbedarf gerechtfertigt ist und ob H\xe4rtegr\xfcnde vorliegen. Bei erfolgreicher Klage wird eine R\xe4umungsfrist zwischen 2 Wochen bis maximal 6 Monaten gesetzt.

## 7. Ausnahmef\xe4lle

- Die Eigenbedarfsk\xfcndigung ist nicht m\xf6glich, wenn der Vermieter im Mietvertrag auf das K\xfcndigungsrecht verzichtet hat.
- Mieter mit besonderem K\xfcndigungsschutz sind gesch\xfctzt.
- Vorget\xe4uschter Eigenbedarf kann zu Schadensersatzpflichten f\xfchren.`
  },
  {
    slug: 'annuitaetendarlehen',
    title: 'Annuit\xe4tendarlehen',
    desc: 'Wie funktioniert ein Annuit\xe4tendarlehen? Konstantrate, Zins- und Tilgungsanteil, Zinsbindung, Vor- und Nachteile mit Rechenbeispiel.',
    content: `## 1. Funktionsweise

- **Die Rate bleibt konstant**: Die monatliche Rate (Annuit\xe4t) ist w\xe4hrend der gesamten Zinsbindungsphase gleich hoch.
- **Zins und Tilgung**: Der Zinsanteil sinkt mit der Zeit, w\xe4hrend der Tilgungsanteil steigt.

## 2. Ver\xe4nderung des Zins- und Tilgungsanteils

Das Annuit\xe4tendarlehen beginnt mit einem hohen Zinsanteil und niedrigen Tilgungsanteil. Da die Restschuld durch monatliche Tilgung reduziert wird, sinkt der zu zahlende Zinsanteil \u2013 der Tilgungsanteil steigt entsprechend.

## 3. Zinsbindungsfrist

Das Annuit\xe4tendarlehen hat \xfcblicherweise eine Zinsbindungsfrist von 5, 10, 15 oder 20 Jahren. Nach Ablauf der Zinsbindung bleibt h\xe4ufig eine Restschuld, die entweder mit einer Anschlussfinanzierung oder einer Volltilgung beglichen werden muss.

## 4. Vorteile

- **Planungssicherheit**: Die gleichbleibenden Raten sorgen f\xfcr eine verl\xe4ssliche Kalkulationsgrundlage.
- **Kostentransparenz**: Die festen Raten machen die Kostenentwicklung vorhersehbar.
- **Tilgungsanstieg**: Durch den sinkenden Zinsanteil erh\xf6ht sich der Tilgungsanteil automatisch.

## 5. Nachteile

- **Lange R\xfcckzahlungsdauer**: Je niedriger die anf\xe4ngliche Tilgung, desto l\xe4nger dauert die vollst\xe4ndige R\xfcckzahlung.
- **Zins\xe4nderungsrisiko**: Nach Ablauf der Zinsbindungsfrist kann sich der Zinssatz \xe4ndern.

## 6. Rechenbeispiel

- **Kreditsumme**: 200.000\xa0\u20ac
- **Zinssatz**: 2,5\xa0% pro Jahr
- **Anf\xe4ngliche Tilgung**: 2\xa0% pro Jahr
- **Monatliche Rate**: 750\xa0\u20ac (Zinsanteil anf\xe4nglich 416,67\xa0\u20ac / Tilgung 333,33\xa0\u20ac)`
  },
  {
    slug: 'kapitalanlage',
    title: 'Kapitalanlage Immobilien',
    desc: 'Immobilien als Kapitalanlage: Renditen, Risiken, Steuervorteile und warum K\xf6lner Stadtteile f\xfcr Investoren interessant sind.',
    content: `## 1. Ziele einer Kapitalanlage

- **Verm\xf6gensaufbau**: Geld langfristig vermehren, z.\xa0B. f\xfcr Altersvorsorge oder gr\xf6\xdfere Anschaffungen.
- **Kapitalerhalt**: Wert des Verm\xf6gens erhalten, besonders bei Inflationssorgen.
- **Einkommen erzielen**: Regelm\xe4\xdfige Aussch\xfcttungen oder Einnahmen, z.\xa0B. durch Mietzahlungen.

## 2. Immobilien als Kapitalanlage

Immobilien bieten stabile Wertentwicklung und regelm\xe4\xdfige Mieteinnahmen. Langfristig ausgerichtet, weniger flexibel als andere Anlageformen.

- **Bruttorendite in K\xf6ln**: Je nach Lage und Objektart typischerweise 3\u20135\xa0%.
- **Steuervorteile**: Abschreibungen (AfA), Denkmal-AfA, absetzbare Werbungskosten.
- **Finanzierungshebel**: Durch Fremdkapital kann die Eigenkapitalrendite erh\xf6ht werden.

## 3. Risikoklassen und Diversifikation

- **Risikoprofil**: Immobilien gelten als vergleichsweise wertstabile Anlage.
- **Diversifikation**: Kapital auf verschiedene Anlageklassen verteilen, um das Risiko zu minimieren.
- **Standortrisiko**: Lage ist entscheidend \u2013 strukturschwache Regionen bergen h\xf6here Leerstandsrisiken.

## 4. Steuern und Renditen

- Mieteinnahmen unterliegen der Einkommensteuer; Verkaufsgewinne nach 10 Jahren Haltedauer sind steuerfrei.
- Werbungskosten (Zinsen, Instandhaltung, Verwaltung) k\xf6nnen abgesetzt werden.

## 5. Anlagetypen je nach Risikobereitschaft

- **Konservativ**: Wohnimmobilien in etablierten Lagen mit solider Mietnachfrage.
- **Ausgewogen**: Mehrfamilienh\xe4user mit Wertsteigerungspotenzial.
- **Risikofreudig**: Projektentwicklungen oder Objekte mit hohem Sanierungsbedarf.`
  },
];

function mdToHtml(md) {
  const lines = md.split('\n');
  let html = '';
  let inUl = false;
  let inOl = false;

  const closeList = () => {
    if (inUl) { html += '</ul>\n'; inUl = false; }
    if (inOl) { html += '</ol>\n'; inOl = false; }
  };

  const inline = (s) => s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('### ')) {
      closeList();
      html += `<h3>${inline(line.slice(4))}</h3>\n`;
    } else if (line.startsWith('## ')) {
      closeList();
      html += `<h2>${inline(line.slice(3))}</h2>\n`;
    } else if (/^- /.test(line)) {
      if (inOl) { html += '</ol>\n'; inOl = false; }
      if (!inUl) { html += '<ul>\n'; inUl = true; }
      html += `<li>${inline(line.slice(2))}</li>\n`;
    } else if (/^\d+\. /.test(line)) {
      if (inUl) { html += '</ul>\n'; inUl = false; }
      if (!inOl) { html += '<ol>\n'; inOl = true; }
      html += `<li>${inline(line.replace(/^\d+\. /, ''))}</li>\n`;
    } else if (line.trim() === '') {
      closeList();
    } else {
      closeList();
      html += `<p>${inline(line)}</p>\n`;
    }
  }
  closeList();
  return html;
}

function buildPage(page) {
  const contentHtml = mdToHtml(page.content);
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title} – Roman Becker - EVERNEST | Immobilienmakler & Immobilienbewertung K\xf6ln</title>
  <meta name="description" content="Roman Becker - EVERNEST | Immobilienmakler & Immobilienbewertung K\xf6ln. ${page.desc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://romanbecker.de/ratgeber/${page.slug}/">

  <!-- Open Graph -->
  <meta property="og:title" content="${page.title} – Roman Becker - EVERNEST | Immobilienmakler & Immobilienbewertung K\xf6ln">
  <meta property="og:description" content="Roman Becker - EVERNEST | Immobilienmakler & Immobilienbewertung K\xf6ln. ${page.desc}">
  <meta property="og:url" content="https://romanbecker.de/ratgeber/${page.slug}/">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="de_DE">

  <!-- JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${page.title}",
    "description": "${page.desc}",
    "url": "https://romanbecker.de/ratgeber/${page.slug}/",
    "author": {
      "@type": "Person",
      "name": "Roman Becker",
      "url": "https://romanbecker.de/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Roman Becker Immobilienmakler K\xf6ln",
      "url": "https://romanbecker.de/"
    },
    "dateModified": "2026-04-17"
  }
  </script>

  <link rel="icon" href="https://romanbecker.de/favicon.ico" type="image/x-icon">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../stadtteile/shared.css">
  <style>
    .article-content { max-width: 800px; }
    .article-content h2 { font-family: var(--font-heading); font-size: 1.5rem; margin: 2rem 0 0.75rem; color: var(--navy); }
    .article-content h3 { font-size: 1.1rem; font-weight: 600; margin: 1.5rem 0 0.5rem; color: var(--navy); }
    .article-content p { color: var(--gray-600); line-height: 1.75; margin-bottom: 1rem; }
    .article-content ul, .article-content ol { color: var(--gray-600); line-height: 1.75; margin: 0 0 1rem 1.5rem; }
    .article-content li { margin-bottom: 0.4rem; }
    .article-content strong { color: var(--navy); font-weight: 600; }
    .article-hero { background: var(--navy); color: var(--white); padding: var(--space-16) 0 var(--space-12); }
    .article-hero h1 { font-family: var(--font-heading); font-size: clamp(1.75rem, 4vw, 2.75rem); margin-bottom: var(--space-4); color: var(--white); }
    .article-hero p { color: var(--gold-light); font-size: 1.1rem; max-width: 650px; }
    .ratgeber-nav { margin-top: var(--space-8); padding: var(--space-6); background: var(--gray-100); border-radius: var(--radius); }
    .ratgeber-nav h3 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--gray-600); margin-bottom: var(--space-4); }
    .ratgeber-nav-links { display: flex; flex-wrap: wrap; gap: var(--space-2); }
    .ratgeber-nav-links a { font-size: 0.85rem; color: var(--gray-600); text-decoration: none; padding: 0.25rem 0.6rem; border: 1px solid var(--gray-200); border-radius: 4px; }
    .ratgeber-nav-links a:hover { background: var(--gold); color: var(--white); border-color: var(--gold); }
  </style>
  <!-- ClickRank.ai SEO verification -->
  <script>
    var clickRankAi = document.createElement("script");
    clickRankAi.src = "https://js.clickrank.ai/seo/4c44e18d-84e4-4e10-9bf0-bec62a93d56f/script?" + new Date().getTime();
    clickRankAi.async = true;
    document.head.appendChild(clickRankAi);
  </script>
</head>
<body>

  <!-- HEADER -->
  <header class="site-header">
    <div class="container">
      <div class="site-header__inner">
        <a href="https://romanbecker.de/" class="site-header__logo">Roman <span>Becker</span></a>
        <nav class="site-header__nav" aria-label="Hauptnavigation">
          <a href="https://romanbecker.de/stadtteile/">Stadtteile</a>
          <a href="https://romanbecker.de/ratgeber/">Ratgeber</a>
          <a href="https://romanbecker.de/immobilienbewertung/">Sofort-Immobilienbewertung</a>
          <a href="https://romanbecker.de/#kontakt">Kontakt</a>
        </nav>
        <a href="tel:+491775156969" class="site-header__cta">+49\xa0177\xa0515\xa069\xa069</a>
      </div>
    </div>
  </header>

  <main>

  <!-- BREADCRUMB -->
  <div class="container" style="padding-top: var(--space-4);">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="https://romanbecker.de/">Start</a>
      <span>\u203a</span>
      <a href="https://romanbecker.de/ratgeber/">Ratgeber</a>
      <span>\u203a</span>
      ${page.title}
    </nav>
  </div>

  <!-- HERO -->
  <section class="article-hero">
    <div class="container">
      <div class="hero__badge">\u2713 Immobilienwissen von Roman Becker \u00b7 Makler K\xf6ln \u00b7 EVERNEST</div>
      <h1>${page.title}</h1>
      <p>${page.desc}</p>
    </div>
  </section>

  <!-- ARTICLE CONTENT -->
  <section class="section">
    <div class="container">
      <div class="article-content">
        ${contentHtml}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="section section--gray">
    <div class="container">
      <div class="cta-box">
        <span class="section-label">Pers\xf6nliche Beratung</span>
        <h2>Fragen zur Ihrer Immobilie in K\xf6ln?</h2>
        <p>Ich berate Sie pers\xf6nlich, unverbindlich und diskret. Als IHK-zertifizierter Immobilienmakler in K\xf6ln mit EVERNEST-Netzwerk stehe ich f\xfcr marktgerechte Bewertung und professionelle Vermarktung.</p>
        <div class="cta-buttons">
          <a href="https://romanbecker.de/immobilienbewertung/" class="btn btn--primary">Kostenlose Immobilienbewertung</a>
          <a href="tel:+491775156969" class="btn btn--white-outline">+49\xa0177\xa0515\xa069\xa069</a>
        </div>
      </div>
    </div>
  </section>

  <!-- RATGEBER NAV -->
  <section class="section">
    <div class="container">
      <div class="ratgeber-nav">
        <h3>Weitere Ratgeber-Themen</h3>
        <div class="ratgeber-nav-links">
          <a href="https://romanbecker.de/ratgeber/maklerkosten-beim-immobilienkauf/">Maklerkosten</a>
          <a href="https://romanbecker.de/ratgeber/notarkosten-beim-immobilienkauf/">Notarkosten</a>
          <a href="https://romanbecker.de/ratgeber/baufinanzierung/">Baufinanzierung</a>
          <a href="https://romanbecker.de/ratgeber/annuitaetendarlehen/">Annuit\xe4tendarlehen</a>
          <a href="https://romanbecker.de/ratgeber/grundbuch/">Grundbuch</a>
          <a href="https://romanbecker.de/ratgeber/grundschuld/">Grundschuld</a>
          <a href="https://romanbecker.de/ratgeber/hypothek/">Hypothek</a>
          <a href="https://romanbecker.de/ratgeber/grundsteuer/">Grundsteuer</a>
          <a href="https://romanbecker.de/ratgeber/energieausweis/">Energieausweis</a>
          <a href="https://romanbecker.de/ratgeber/kaufvertrag/">Kaufvertrag</a>
          <a href="https://romanbecker.de/ratgeber/denkmal-afa/">Denkmal-AfA</a>
          <a href="https://romanbecker.de/ratgeber/abschreibung-bei-immobilien/">Abschreibung</a>
          <a href="https://romanbecker.de/ratgeber/heizungsgesetz/">Heizungsgesetz</a>
          <a href="https://romanbecker.de/ratgeber/gebaeudeenergiegesetz/">GEG</a>
          <a href="https://romanbecker.de/ratgeber/kapitalanlage/">Kapitalanlage</a>
          <a href="https://romanbecker.de/ratgeber/erbpacht/">Erbpacht</a>
          <a href="https://romanbecker.de/ratgeber/mietspiegel/">Mietspiegel</a>
          <a href="https://romanbecker.de/ratgeber/vergleichsmiete/">Vergleichsmiete</a>
          <a href="https://romanbecker.de/ratgeber/immobilienkauf/">Immobilienkauf</a>
          <a href="https://romanbecker.de/ratgeber/immobilienverkauf/">Immobilienverkauf</a>
        </div>
      </div>
    </div>
  </section>

  </main>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container">
      <div class="footer__links">
        <a href="https://romanbecker.de/">Startseite</a>
        <a href="https://romanbecker.de/stadtteile/">Alle Stadtteile</a>
        <a href="https://romanbecker.de/ratgeber/">Ratgeber</a>
        <a href="https://romanbecker.de/immobilienbewertung/">Immobilienbewertung</a>
        <a href="https://romanbecker.de/impressum/">Impressum</a>
        <a href="https://romanbecker.de/agb/">AGB &amp; Datenschutz</a>
      </div>
      <p>&copy; 2026 Roman Becker &middot; Immobilienmakler K&ouml;ln &middot; EVERNEST GmbH</p>
      <p style="margin-top: var(--space-2);">Kaiser-Wilhelm-Ring 17-21, 50672 K&ouml;ln &middot; <a href="tel:+491775156969">+49 177 515 69 69</a> &middot; <a href="mailto:roman.becker@evernest.com">roman.becker@evernest.com</a> &middot; <a href="https://www.instagram.com/roman_becker_immobilien/" target="_blank" rel="noopener">Instagram</a></p>
    </div>
  </footer>

  <!-- MOBILE CALL BUTTON -->
  <a href="tel:+491775156969" class="mobile-cta" aria-label="Jetzt anrufen">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.15 2.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.28-1.35a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  </a>

</body>
</html>`;
}

let count = 0;
for (const page of pages) {
  const html = buildPage(page);
  const outPath = join(OUT_DIR, `${page.slug}.html`);
  writeFileSync(outPath, html, 'utf-8');
  count++;
}

console.log(`✓ ${count} Ratgeber-Seiten generiert in ${OUT_DIR}`);
