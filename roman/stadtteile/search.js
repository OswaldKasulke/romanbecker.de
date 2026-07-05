(function() {
    var IDX = [
      {t:'Immobilienbewertung Köln', u:'/immobilienbewertung.html', c:'Seite', k:'bewertung wert schätzung gutachten verkehrswert marktwert wertermittlung haus wohnung grundstück kostenlos immobilie immobilienpreis berechnen preisermittlung wertgutachten'},
      {t:'Bodenrichtwert Köln & Umland', u:'/bodenrichtwert-koeln.html', c:'Seite', k:'bodenwert grundstück boris nrw quadratmeterpreis boden richtwert lagebewertung mikrolage makrolage immobilienpreise preise nrw'},
      {t:'Immobilien verkaufen Köln', u:'/immobilien-verkaufen-koeln.html', c:'Seite', k:'verkauf haus wohnung notar makler provision käufer kaufvertrag grunderwerbsteuer spekulationssteuer eigentum mehrfamilienhaus reihenhaus doppelhaus doppelhaushälfte eigentumswohnung gewerbeimmobilie gewerbe grundstück maklervertrag alleinauftrag verkaufsstrategie immobilienmarketing exposé expose erstellen homestaging besichtigung organisieren offene einzelbesichtigung bieterverfahren kaufpreisverhandlung preisstrategie mindestpreis diskret off-market erbschaft erbschaftsimmobilie geerbtes scheidungsimmobilie scheidung vermietete leerstehende leerstand kredit trotz tipps checkliste ablauf dauer käufer bonitätsprüfung finanzierungsbestätigung übergabeprotokoll besitzübergang schlüsselübergabe vorfälligkeitsentschädigung löschungsbewilligung restschuld renovierung wertsteigernde maßnahmen neubau sanierungsbedürftig sanierungsbedürftiges seniorenimmobilie barrierefrei barrierefreie anzeige schreiben zielgruppe zielgruppenanalyse käuferzielgruppe eigennutzer kapitalanleger ansprechen emotional psychologie erfolgreicher diskreter reservierungsvereinbarung kaufpreisfälligkeit sachmängelhaftung gewährleistung immobilienrecht balkon terrasse garten stellplatz garage aufzug maisonette'},
      {t:'Für Bauträger', u:'/bautraeger.html', c:'Seite', k:'projektentwickler grundstück baurecht bebauung gfz bauplanung architekt investor neubauprojekt neubau'},
      {t:'Luxus Immobilienmakler Köln', u:'/luxus-immobilienmakler-koeln.html', c:'Seite', k:'luxus premium villa penthouse exklusiv hochwertig luxusimmobilie drohnenaufnahmen immobilienfotos virtuelle besichtigung 360 grad rundgang grundriss erstellen homestaging professionelle fotos immobilienmarketing'},
      {t:'Immobiliengutachter Köln', u:'/immobiliengutachter-koeln.html', c:'Seite', k:'gutachter gutachten wertermittlung sachverständiger verkehrswert schätzung immobiliengutachten verkehrswertgutachten'},
      {t:'Marktanalyse Köln', u:'/marktanalyse/', c:'Seite', k:'markt preise analyse trend immobilienmarkt preisspiegel bericht immobilienpreise nrw lagebewertung mikrolage makrolage infrastruktur umgebung schulen öpnv anbindung einkauf einkaufsmöglichkeiten'},
      {t:'Köln-Agnesviertel', u:'/stadtteile/agnesviertel.html', c:'Stadtteil Köln', k:'agnesviertel 50670 50672 neustadt-nord makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Altstadt-Nord', u:'/stadtteile/altstadt-nord.html', c:'Stadtteil Köln', k:'altstadt-nord altstadt nord 50667 innenstadt makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Altstadt-Süd', u:'/stadtteile/altstadt-sued.html', c:'Stadtteil Köln', k:'altstadt-sued altstadt-süd altstadt süd 50676 innenstadt makler immobilien haus wohnung verkaufen grundstück köln Anna-Schneider-Steig Teutoburger Straße Kleine Witschgasse Darmstädter Straße Steinstraße Ubierring Großer Griechenmarkt Weyerstraße Agrippinawerft'},
      {t:'Köln-Bayenthal', u:'/stadtteile/bayenthal.html', c:'Stadtteil Köln', k:'bayenthal 50678 rhein makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Belgisches Viertel', u:'/stadtteile/belgisches-viertel.html', c:'Stadtteil Köln', k:'belgisches viertel belgisch belgischen 50672 50674 innenstadt makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Bezirk Chorweiler', u:'/stadtteile/bezirk-chorweiler.html', c:'Stadtteil Köln', k:'bezirk chorweiler 50765 50769 makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Bezirk Porz', u:'/stadtteile/bezirk-porz.html', c:'Stadtteil Köln', k:'bezirk porz 51143 51147 makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Bickendorf', u:'/stadtteile/bickendorf.html', c:'Stadtteil Köln', k:'bickendorf 50827 ehrenfeld makler immobilien haus wohnung verkaufen grundstück köln August-von-Willich-Straße Butzweilerstraße'},
      {t:'Köln-Bilderstöckchen', u:'/stadtteile/bilderstoeckchen.html', c:'Stadtteil Köln', k:'bilderstoeckchen bilderstöckchen 50739 ossendorf makler immobilien haus wohnung verkaufen grundstück köln Mülhauser Straße'},
      {t:'Köln-Blumenberg', u:'/stadtteile/blumenberg.html', c:'Stadtteil Köln', k:'blumenberg 50769 chorweiler makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Bocklemünd/Mengenich', u:'/stadtteile/bocklemuend-mengenich.html', c:'Stadtteil Köln', k:'bocklemuend bocklemünd mengenich 50829 ehrenfeld makler immobilien haus wohnung verkaufen grundstück köln Hindemithweg Schaffrathsgasse'},
      {t:'Köln-Braunsfeld', u:'/stadtteile/braunsfeld.html', c:'Stadtteil Köln', k:'braunsfeld 50933 lindenthal makler immobilien haus wohnung verkaufen grundstück köln Auf dem Hügel Malmedyer Straße Würselener Straße'},
      {t:'Köln-Brück', u:'/stadtteile/brueck.html', c:'Stadtteil Köln', k:'brueck brück 51065 mülheim makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Buchforst', u:'/stadtteile/buchforst.html', c:'Stadtteil Köln', k:'buchforst 51065 51067 mülheim makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Buchheim', u:'/stadtteile/buchheim.html', c:'Stadtteil Köln', k:'buchheim 51063 51065 mülheim makler immobilien haus wohnung verkaufen grundstück köln Genovevastraße Buchheimer Str.'},
      {t:'Köln-Chorweiler', u:'/stadtteile/chorweiler.html', c:'Stadtteil Köln', k:'chorweiler 50765 bezirk chorweiler makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Dellbrück', u:'/stadtteile/dellbrueck.html', c:'Stadtteil Köln', k:'dellbrueck dellbrück 51069 mülheim makler immobilien haus wohnung verkaufen grundstück köln Paffrather Str. Waldhausstraße Heidestr. Preußen-Dellbrück-Weg Thurner Straße Heidestraße Brandrosterweg Neufelder Str. Berliner Str. Bensberger Marktweg Thurner Str. Wiesenstraße Paffrather Straße'},
      {t:'Köln-Deutz', u:'/stadtteile/deutz.html', c:'Stadtteil Köln', k:'deutz 50679 rechtsrheinisch messe makler immobilien haus wohnung verkaufen grundstück köln Benediktusgasse Deutz-Kalker Straße'},
      {t:'Köln-Dünnwald', u:'/stadtteile/duennwald.html', c:'Stadtteil Köln', k:'duennwald dünnwald 51069 51063 mülheim makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Ehrenfeld', u:'/stadtteile/ehrenfeld.html', c:'Stadtteil Köln', k:'ehrenfeld 50823 kreativviertel szeneviertel makler immobilien haus wohnung verkaufen grundstück köln Klarastraße Försterstraße Stammstraße Lukasstraße Graeffstraße'},
      {t:'Köln-Eil', u:'/stadtteile/eil.html', c:'Stadtteil Köln', k:'eil 51147 bezirk porz makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Ensen', u:'/stadtteile/ensen.html', c:'Stadtteil Köln', k:'ensen 51107 porz makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Esch/Auweiler', u:'/stadtteile/esch-auweiler.html', c:'Stadtteil Köln', k:'esch auweiler 50769 chorweiler makler immobilien haus wohnung verkaufen grundstück köln Irisweg Kelzenberger Weg Forststraße'},
      {t:'Köln-Finkenberg', u:'/stadtteile/finkenberg.html', c:'Stadtteil Köln', k:'finkenberg 51107 porz makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Flittard', u:'/stadtteile/flittard.html', c:'Stadtteil Köln', k:'flittard 51061 mülheim rhein makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Fühlingen', u:'/stadtteile/fuehlingen.html', c:'Stadtteil Köln', k:'fuehlingen fühlingen 50769 chorweiler makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Godorf', u:'/stadtteile/godorf.html', c:'Stadtteil Köln', k:'godorf 50997 rodenkirchen rhein makler immobilien haus wohnung verkaufen grundstück köln Am Godorfer Kirchweg Kurische Straße Am Rodderpfädchen'},
      {t:'Köln-Gremberghoven', u:'/stadtteile/gremberghoven.html', c:'Stadtteil Köln', k:'gremberghoven 51109 kalk makler immobilien haus wohnung verkaufen grundstück köln Rosenstraße'},
      {t:'Köln-Grengel', u:'/stadtteile/grengel.html', c:'Stadtteil Köln', k:'grengel 51107 porz makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Hahnwald', u:'/stadtteile/hahnwald.html', c:'Stadtteil Köln', k:'hahnwald 50999 rodenkirchen villa luxus exklusiv makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Heimersdorf', u:'/stadtteile/heimersdorf.html', c:'Stadtteil Köln', k:'heimersdorf 50769 chorweiler makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Höhenberg', u:'/stadtteile/hoehenberg.html', c:'Stadtteil Köln', k:'hoehenberg höhenberg 51065 kalk makler immobilien haus wohnung verkaufen grundstück köln Kratzweg Paderborner Str.'},
      {t:'Köln-Höhenhaus', u:'/stadtteile/hoehenhaus.html', c:'Stadtteil Köln', k:'hoehenhaus höhenhaus 51069 mülheim makler immobilien haus wohnung verkaufen grundstück köln Wuppertaler Straße Piccoloministraße'},
      {t:'Köln-Holweide', u:'/stadtteile/holweide.html', c:'Stadtteil Köln', k:'holweide 51065 mülheim makler immobilien haus wohnung verkaufen grundstück köln Im Bischofsacker Genovevastraße'},
      {t:'Köln-Humboldt/Gremberg', u:'/stadtteile/humboldt-gremberg.html', c:'Stadtteil Köln', k:'humboldt gremberg 51103 51109 kalk makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Immendorf', u:'/stadtteile/immendorf.html', c:'Stadtteil Köln', k:'immendorf 50997 rodenkirchen makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Junkersdorf', u:'/stadtteile/junkersdorf.html', c:'Stadtteil Köln', k:'junkersdorf 50859 lindenthal makler immobilien haus wohnung verkaufen grundstück köln Else-Lang-Straße Ludwig-Jahn-Straße Von-Nell-Breuning-Straße Hans-Katzer-Straße Leipziger Straße Am Römerhof Stüttgerhofweg'},
      {t:'Köln-Kalk', u:'/stadtteile/kalk.html', c:'Stadtteil Köln', k:'kalk 51103 rechtsrheinisch makler immobilien haus wohnung verkaufen grundstück köln Eythstraße Schwarzburger Str. Kalker Hauptstraße Erfurter Straße Burgstraße Rothenburger Straße'},
      {t:'Köln-Klettenberg', u:'/stadtteile/klettenberg.html', c:'Stadtteil Köln', k:'klettenberg 50935 lindenthal makler immobilien haus wohnung verkaufen grundstück köln Breibergstraße Klettenberggürtel'},
      {t:'Köln-Komponistenviertel', u:'/stadtteile/komponistenviertel.html', c:'Stadtteil Köln', k:'komponistenviertel 50931 lindenthal makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Langel', u:'/stadtteile/langel.html', c:'Stadtteil Köln', k:'langel 51143 porz rhein makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Libur', u:'/stadtteile/libur.html', c:'Stadtteil Köln', k:'libur 51107 porz makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Lind', u:'/stadtteile/lind.html', c:'Stadtteil Köln', k:'lind 51107 porz makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Lindenthal', u:'/stadtteile/lindenthal.html', c:'Stadtteil Köln', k:'lindenthal 50931 universitätsviertel makler immobilien haus wohnung verkaufen grundstück köln Joseph-Stelzmann-Straße Lortzingstraße Bachemer Str. Gottfried-Keller-Straße Wüllnerstraße'},
      {t:'Köln-Lindweiler', u:'/stadtteile/lindweiler.html', c:'Stadtteil Köln', k:'lindweiler 50769 chorweiler makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Lövenich', u:'/stadtteile/loevenich.html', c:'Stadtteil Köln', k:'loevenich lövenich 50858 ehrenfeld makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Longerich', u:'/stadtteile/longerich.html', c:'Stadtteil Köln', k:'longerich 50737 nippes makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Marienburg', u:'/stadtteile/marienburg.html', c:'Stadtteil Köln', k:'marienburg 50997 rodenkirchen villa luxus exklusiv rhein makler immobilien haus wohnung verkaufen grundstück köln Bonner Straße Bernhardstraße Hebbelstraße Lindenallee Parkstraße'},
      {t:'Köln-Mauenheim', u:'/stadtteile/mauenheim.html', c:'Stadtteil Köln', k:'mauenheim 50739 nippes makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Merheim', u:'/stadtteile/merheim.html', c:'Stadtteil Köln', k:'merheim 51063 51067 mülheim makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Merkenich', u:'/stadtteile/merkenich.html', c:'Stadtteil Köln', k:'merkenich 50769 chorweiler rhein makler immobilien haus wohnung verkaufen grundstück köln Grimlinghauser Weg Roggendorfer Weg'},
      {t:'Köln-Meschenich', u:'/stadtteile/meschenich.html', c:'Stadtteil Köln', k:'meschenich 50997 rodenkirchen makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Mülheim', u:'/stadtteile/muelheim.html', c:'Stadtteil Köln', k:'muelheim mülheim 51061 rechtsrheinisch makler immobilien haus wohnung verkaufen grundstück köln Hufelandstrasse Melanchthonstraße Narzissenweg'},
      {t:'Köln-Müngersdorf', u:'/stadtteile/muengersdorf.html', c:'Stadtteil Köln', k:'muengersdorf müngersdorf 50933 lindenthal makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Neubrück', u:'/stadtteile/neubrueck.html', c:'Stadtteil Köln', k:'neubrueck neubrück 51065 mülheim makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Neuehrenfeld', u:'/stadtteile/neuehrenfeld.html', c:'Stadtteil Köln', k:'neuehrenfeld 50733 nippes ehrenfeld makler immobilien haus wohnung verkaufen grundstück köln Takustraße Helmholtzstr. Lessingstraße Eisenstraße Nußbaumerstraße Helmholtzstraße'},
      {t:'Köln-Neustadt-Nord', u:'/stadtteile/neustadt-nord.html', c:'Stadtteil Köln', k:'neustadt-nord neustadt nord 50668 innenstadt makler immobilien haus wohnung verkaufen grundstück köln Friesenwall Brüsseler Straße Balthasarstraße Maybachstraße Melchiorstraße Kasparstr. Gereonshof Brüsseler Platz Kamekestraße Hohenzollernring Vogteistraße Konrad-Adenauer-Ufer Wörthstraße Maastrichter Straße'},
      {t:'Köln-Neustadt-Süd', u:'/stadtteile/neustadt-sued.html', c:'Stadtteil Köln', k:'neustadt-sued neustadt-süd neustadt süd 50674 innenstadt makler immobilien haus wohnung verkaufen grundstück köln Salierring Aachener Straße Kaesenstraße Martin-Luther-Platz Luxemburger Straße Brüsseler Straße Gabelsbergerstraße'},
      {t:'Köln-Niehl', u:'/stadtteile/niehl.html', c:'Stadtteil Köln', k:'niehl 50735 50737 nippes rhein makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Nippes', u:'/stadtteile/nippes.html', c:'Stadtteil Köln', k:'nippes 50733 schanzenviertel makler immobilien haus wohnung verkaufen grundstück köln Louis-Ferdinand-Straße Florastraße Turmstraße Mauenheimer Str. Kuenstraße Bülowstraße Mauenheimer Straße Neusser Straße'},
      {t:'Köln-Ossendorf', u:'/stadtteile/ossendorf.html', c:'Stadtteil Köln', k:'ossendorf 50739 ehrenfeld makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Ostheim', u:'/stadtteile/ostheim.html', c:'Stadtteil Köln', k:'ostheim 51109 kalk makler immobilien haus wohnung verkaufen grundstück köln Rösrather Straße In der Konde'},
      {t:'Köln-Pesch', u:'/stadtteile/pesch.html', c:'Stadtteil Köln', k:'pesch 50737 nippes makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Poll', u:'/stadtteile/poll.html', c:'Stadtteil Köln', k:'poll 50679 deutz rhein makler immobilien haus wohnung verkaufen grundstück köln Am Zinnenkranz Zum Bergfried Linder Mauspfad Am Büllesgarten Akazienweg'},
      {t:'Köln-Porz', u:'/stadtteile/porz.html', c:'Stadtteil Köln', k:'porz 51143 bezirk porz flughafen makler immobilien haus wohnung verkaufen grundstück köln Viktoriastraße'},
      {t:'Köln-Raderberg', u:'/stadtteile/raderberg.html', c:'Stadtteil Köln', k:'raderberg 50968 rodenkirchen makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Raderthal', u:'/stadtteile/raderthal.html', c:'Stadtteil Köln', k:'raderthal 50997 rodenkirchen makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Rath/Heumar', u:'/stadtteile/rath-heumar.html', c:'Stadtteil Köln', k:'rath heumar 51107 porz makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Rheinauhafen', u:'/stadtteile/rheinauhafen.html', c:'Stadtteil Köln', k:'rheinauhafen 50678 50679 loft hafen innenstadt makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Riehl', u:'/stadtteile/riehl.html', c:'Stadtteil Köln', k:'riehl 50735 nippes zoo makler immobilien haus wohnung verkaufen grundstück köln An der Schanz Riehler Gürtel Am Botanischen Garten Theodor-Schwann-Straße Pliniusstraße Hildegardisstraße Friedrich-Karl-Straße Niehler Damm'},
      {t:'Köln-Rodenkirchen', u:'/stadtteile/rodenkirchen.html', c:'Stadtteil Köln', k:'rodenkirchen 50999 rhein villen makler immobilien haus wohnung verkaufen grundstück köln Unter den Birken Wieselweg Hauptstraße Gartenstraße Mettfelder Straße'},
      {t:'Köln-Roggendorf/Thenhoven', u:'/stadtteile/roggendorf-thenhoven.html', c:'Stadtteil Köln', k:'roggendorf thenhoven 50769 chorweiler makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Rondorf', u:'/stadtteile/rondorf.html', c:'Stadtteil Köln', k:'rondorf 50997 rodenkirchen makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Seeberg', u:'/stadtteile/seeberg.html', c:'Stadtteil Köln', k:'seeberg 51065 kalk makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Stammheim', u:'/stadtteile/stammheim.html', c:'Stadtteil Köln', k:'stammheim 51061 mülheim rhein makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Sülz', u:'/stadtteile/suelz.html', c:'Stadtteil Köln', k:'suelz sülz 50939 lindenthal uni makler immobilien haus wohnung verkaufen grundstück köln Scheffelstraße Grafenwerthstraße Zülpicher Straße Lindauer Straße Enckestraße Remigiusstraße Lindenthalgürtel'},
      {t:'Köln-Sürth', u:'/stadtteile/suerth.html', c:'Stadtteil Köln', k:'suerth sürth 50999 rodenkirchen rhein makler immobilien haus wohnung verkaufen grundstück köln Hammerschmidtstraße Rodderweg Eygelshovener Straße Lisztstraße'},
      {t:'Köln-Urbach', u:'/stadtteile/urbach.html', c:'Stadtteil Köln', k:'urbach 51109 kalk makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Vingst', u:'/stadtteile/vingst.html', c:'Stadtteil Köln', k:'vingst 51103 kalk makler immobilien haus wohnung verkaufen grundstück köln Wetzlarer Straße Gremberger Straße'},
      {t:'Köln-Vogelsang', u:'/stadtteile/vogelsang.html', c:'Stadtteil Köln', k:'vogelsang 50829 ehrenfeld makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Volkhoven/Weiler', u:'/stadtteile/volkhoven-weiler.html', c:'Stadtteil Köln', k:'volkhoven weiler 50765 chorweiler makler immobilien haus wohnung verkaufen grundstück köln Hermann-Löns-Straße'},
      {t:'Köln-Wahn', u:'/stadtteile/wahn.html', c:'Stadtteil Köln', k:'wahn 51147 porz flughafen makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Wahnheide', u:'/stadtteile/wahnheide.html', c:'Stadtteil Köln', k:'wahnheide 51147 porz makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Weiden', u:'/stadtteile/weiden.html', c:'Stadtteil Köln', k:'weiden 50858 ehrenfeld makler immobilien haus wohnung verkaufen grundstück köln Unter Gottes Gnaden An der Ronne Gartenweg Dachsweg Nettengasse Auf der Aspel Bistritzer Straße Erftstraße'},
      {t:'Köln-Weidenpesch', u:'/stadtteile/weidenpesch.html', c:'Stadtteil Köln', k:'weidenpesch 50737 nippes makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Weiß', u:'/stadtteile/weiss.html', c:'Stadtteil Köln', k:'weiss weiß 50999 rodenkirchen rhein makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Westhoven', u:'/stadtteile/westhoven.html', c:'Stadtteil Köln', k:'westhoven 51107 porz makler immobilien haus wohnung verkaufen grundstück köln Altenberger Straße Sankt-Rochus-Straße Pfaffenpfädchen Auf dem Knöpp'},
      {t:'Köln-Widdersdorf', u:'/stadtteile/widdersdorf.html', c:'Stadtteil Köln', k:'widdersdorf 50858 ehrenfeld makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Worringen', u:'/stadtteile/worringen.html', c:'Stadtteil Köln', k:'worringen 50769 chorweiler rhein makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Köln-Zollstock', u:'/stadtteile/zollstock.html', c:'Stadtteil Köln', k:'zollstock 50937 rodenkirchen makler immobilien haus wohnung verkaufen grundstück köln Kierberger Straße Zollstockgürtel Briedeler Straße Türnicher Straße Höninger Weg Briedeler Str.'},
      {t:'Köln-Zündorf', u:'/stadtteile/zuendorf.html', c:'Stadtteil Köln', k:'zuendorf zündorf 51143 porz rhein makler immobilien haus wohnung verkaufen grundstück köln'},
      {t:'Bedburg', u:'/stadtteile/bedburg.html', c:'Umland', k:'bedburg 50181 rhein-erft-kreis makler immobilien haus wohnung verkaufen grundstück Am Vogsberg'},
      {t:'Bergheim', u:'/stadtteile/bergheim.html', c:'Umland', k:'bergheim 50126 rhein-erft-kreis erft makler immobilien haus wohnung verkaufen grundstück Im Wohnpark Birkenweg'},
      {t:'Bergisch Gladbach', u:'/stadtteile/bergisch-gladbach.html', c:'Umland', k:'bergisch gladbach 51429 51465 rheinisch-bergischer kreis makler immobilien haus wohnung verkaufen grundstück An der Engelsfuhr Töpferweg Voiswinkeler Straße Giselbertstraße Im Bruch Imbuschstraße Hackberg Im Vogelsang Jakob-Euler-Straße Kurt-Schumacher-Straße Mülheimer Str. Platzer Höhenweg Beningsfeld Am Rittersteg Enrico-Fermi-Straße Braunsberg Bensberger Str. Scheidtbachstraße Broicher Straße Straßen Hufer Weg Dombach-Sander-Straße Theodor-Storm-Straße Im Mondsröttchen Reuterstraße Löher Höhenweg Eichelstraße Im Neuen Feld Häuser Dombach Hans-Böckler-Straße Burgstraße Neufeldweg Arnold-von-Lülsdorf-Straße Engelbertstraße Pippelstein Sonnenweg Merkelweg Weidenbuscher Weg Auf dem Kirchenfeld Wingertsheide An der Jüch Im Lüh Franz-Coenen-Straße In der Taufe Quellenweg Reginharstraße Herkenrather Straße Hasselstraße Odenthaler Straße Broicher Feld Am Eichenkamp'},
      {t:'Brühl', u:'/stadtteile/bruehl.html', c:'Umland', k:'bruehl brühl 50321 rhein-erft-kreis phantasialand makler immobilien haus wohnung verkaufen grundstück'},
      {t:'Elsdorf', u:'/stadtteile/elsdorf.html', c:'Umland', k:'elsdorf 50189 rhein-erft-kreis makler immobilien haus wohnung verkaufen grundstück'},
      {t:'Erftstadt', u:'/stadtteile/erftstadt.html', c:'Umland', k:'erftstadt 50374 rhein-erft-kreis erft lechenich liblar makler immobilien haus wohnung verkaufen grundstück Zum Grünen Weg Judenstraße Gustav-Heinemann-Straße Heerstraße'},
      {t:'Frechen', u:'/stadtteile/frechen.html', c:'Umland', k:'frechen 50226 rhein-erft-kreis makler immobilien haus wohnung verkaufen grundstück Baumschulenstraße Mauritiusstraße Freiheitsring'},
      {t:'Kerpen', u:'/stadtteile/kerpen.html', c:'Umland', k:'kerpen 50169 rhein-erft-kreis horrem sindorf makler immobilien haus wohnung verkaufen grundstück Finkenweg Im Gotteskircher Feld Am Hauserbach Schildgenstraße Heerstraße Graf-Berghe-von-Trips-Ring Am Ginsterberg Bredaer Straße Gassenfeldweg Bredaerstraße'},
      {t:'Leverkusen', u:'/stadtteile/leverkusen.html', c:'Umland', k:'leverkusen 51373 51375 51377 bergisch bayer makler immobilien haus wohnung verkaufen grundstück Schubertstraße Scharnhorststraße Lützenkirchener Str. Mozartstraße Heinrich-Brüning-Straße Schäfershütte Karlstraße Am Märchen Winand-Rossi-Straße Pfarrer-Jekel-Straße Ahrstraße Fakultätsstraße Finkenweg Wiehbachtal Winterberg Hamberger Straße Lützenkirchener Straße Ölbergstraße Johannes-Baptist-Straße Am Sandberg Debengasse Europa-Allee Grunewaldstraße Wiesdorfer Platz Schlebuscher Straße'},
      {t:'Pulheim', u:'/stadtteile/pulheim.html', c:'Umland', k:'pulheim 50259 rhein-erft-kreis makler immobilien haus wohnung verkaufen grundstück Amselweg Fliederweg Sinnersdorfer Feld Tomburgstraße Auf dem Driesch'},
      {t:'Rommerskirchen', u:'/stadtteile/rommerskirchen.html', c:'Umland', k:'rommerskirchen 41569 rhein-kreis neuss makler immobilien haus wohnung verkaufen grundstück Am Rosenend'},
      {t:'Bonn', u:'/bodenrichtwert-koeln.html', c:'Umland', k:'bonn 53111 53115 53119 53121 bundesstadt rhein makler immobilien haus wohnung verkaufen grundstück'},
      {t:'Alfter', u:'/stadtteile/alfter.html', c:'Umland', k:'alfter 53347 rhein-sieg-kreis bonn makler immobilien haus wohnung verkaufen grundstück'},
      {t:'Bornheim', u:'/stadtteile/bornheim.html', c:'Umland', k:'bornheim 53332 rhein-sieg-kreis vorgebirge makler immobilien haus wohnung verkaufen grundstück Heisterbacher Str.'},
      {t:'Dormagen', u:'/stadtteile/dormagen.html', c:'Umland', k:'dormagen 41539 rhein-kreis neuss zons rhein makler immobilien haus wohnung verkaufen grundstück Kurt-Schumacher-Straße Neusser Str. Raabestraße'},
      {t:'Düren', u:'/stadtteile/duerren.html', c:'Umland', k:'düren duerren 52349 kreis düren rur makler immobilien haus wohnung verkaufen grundstück'},
      {t:'Eschweiler', u:'/stadtteile/eschweiler.html', c:'Umland', k:'eschweiler 52249 städteregion aachen makler immobilien haus wohnung verkaufen grundstück'},
      {t:'Hürth', u:'/stadtteile/huerth.html', c:'Umland', k:'hürth huerth 50354 rhein-erft-kreis köln makler immobilien haus wohnung verkaufen grundstück Minnepfad Eintrachtstraße Nelkenweg Theresiastr. Bergmannstraße Josef-Metternich-Straße'},
      {t:'Jüchen', u:'/stadtteile/juechen.html', c:'Umland', k:'jüchen juechen 41363 rhein-kreis neuss makler immobilien haus wohnung verkaufen grundstück Auf der Hecke Peter-Stahs-Straße'},
      {t:'Jülich', u:'/stadtteile/juelich.html', c:'Umland', k:'jülich juelich 52428 kreis düren rur forschungszentrum makler immobilien haus wohnung verkaufen grundstück'},
      {t:'Leichlingen', u:'/stadtteile/leichlingen.html', c:'Umland', k:'leichlingen 42799 rheinisch-bergischer kreis wupper blütenstadt makler immobilien haus wohnung verkaufen grundstück Bismarckstraße In der Meffert'},
      {t:'Lohmar', u:'/stadtteile/lohmar.html', c:'Umland', k:'lohmar 53797 rhein-sieg-kreis bergisches land makler immobilien haus wohnung verkaufen grundstück Algerter Straße'},
      {t:'Much', u:'/stadtteile/much.html', c:'Umland', k:'much 53804 rhein-sieg-kreis bergisches land makler immobilien haus wohnung verkaufen grundstück'},
      {t:'Neunkirchen-Seelscheid', u:'/stadtteile/neunkirchen-seelscheid.html', c:'Umland', k:'neunkirchen seelscheid 53819 rhein-sieg-kreis bergisches land makler immobilien haus wohnung verkaufen grundstück'},
      {t:'Niederkassel', u:'/stadtteile/niederkassel.html', c:'Umland', k:'niederkassel 53859 rhein-sieg-kreis rhein makler immobilien haus wohnung verkaufen grundstück Dahlienweg Uferstraße Oberstraße'},
      {t:'Odenthal', u:'/stadtteile/odenthal.html', c:'Umland', k:'odenthal 51519 rheinisch-bergischer kreis altenberger dom bergisches land makler immobilien haus wohnung verkaufen grundstück Wingensiefer Kamp Am Geus Garten Am Köttersbach Auf dem Heidchen Am Steinhauser Busch'},
      {t:'Overath', u:'/stadtteile/overath.html', c:'Umland', k:'overath 51491 rheinisch-bergischer kreis bergisches land s-bahn makler immobilien haus wohnung verkaufen grundstück Nachtigallenweg Untergründemich Krombacher Straße'},
      {t:'Rösrath', u:'/stadtteile/roesrath.html', c:'Umland', k:'rösrath roesrath 51503 rheinisch-bergischer kreis königsforst makler immobilien haus wohnung verkaufen grundstück Holunderweg Rotdornallee Ölbergweg Menzlinger Weg Vor dem Klosterhof Nonnenstrombergweg Zum Sandfeld An der Krumbach Leibnizpark Hirschstraße Dammelsfurther Weg Pestalozziweg Im Weidenauel Zum Sandfeld 2 b'},
      {t:'Sankt Augustin', u:'/stadtteile/sankt-augustin.html', c:'Umland', k:'sankt augustin 53757 rhein-sieg-kreis hochschule makler immobilien haus wohnung verkaufen grundstück Holzweg'},
      {t:'Swisttal', u:'/stadtteile/swisttal.html', c:'Umland', k:'swisttal 53913 rhein-sieg-kreis vorgebirge makler immobilien haus wohnung verkaufen grundstück'},
      {t:'Troisdorf', u:'/stadtteile/troisdorf.html', c:'Umland', k:'troisdorf 53840 rhein-sieg-kreis flughafen köln bonn s-bahn makler immobilien haus wohnung verkaufen grundstück Essener Straße'},
      {t:'Wesseling', u:'/stadtteile/wesseling.html', c:'Umland', k:'wesseling 50389 rhein-erft-kreis rhein makler immobilien haus wohnung verkaufen grundstück Im Blauen Garn Langgasse Schützenweg Eichholzer Str.'},
      {t:'Ratgeber: Zwangsversteigerung', u:'/ratgeber/zwangsversteigerung.html', c:'Ratgeber', k:'zwangsversteigerung auktion bieter gebot gericht insolvenz schulden vermeiden'},
      {t:'Ratgeber: Grundbuch', u:'/ratgeber/grundbuch.html', c:'Ratgeber', k:'grundbuch grundbuchauszug notar eintrag hypothek grundschuld eigentümer flurstück abteilung auflassungsvormerkung teilungserklärung immobilienrecht'},
      {t:'Ratgeber: Hypothek', u:'/ratgeber/hypothek.html', c:'Ratgeber', k:'hypothek kredit darlehen bank zinsen schulden sicherheit pfandrecht löschungsbewilligung restschuld vorfälligkeitsentschädigung'},
      {t:'Ratgeber: Erbpacht', u:'/ratgeber/erbpacht.html', c:'Ratgeber', k:'erbpacht erbbaurecht pacht erbpachtzins laufzeit'},
      {t:'Ratgeber: Eigenbedarfskündigung', u:'/ratgeber/eigenbedarfsklage.html', c:'Ratgeber', k:'eigenbedarf kündigung mieter vermieter wohnrecht räumung mietvertrag eigenbedarfskündigung eigenbedarfsklage widerspruch'},
      {t:'Ratgeber: Baufinanzierung', u:'/ratgeber/baufinanzierung.html', c:'Ratgeber', k:'baufinanzierung kredit bank zinsen darlehen finanzierung eigenkapital nebenkosten notar immobilienfinanzierung finanzierungsbestätigung bonitätsprüfung'},
      {t:'Ratgeber: Heizungsgesetz', u:'/ratgeber/heizungsgesetz.html', c:'Ratgeber', k:'heizung geg gebäudeenergiegesetz wärmepumpe sanierung energieausweis klimaschutz solaranlage hauswert'},
      {t:'Ratgeber: Baulastenverzeichnis', u:'/ratgeber/baulastenverzeichnis.html', c:'Ratgeber', k:'baulast baulastenverzeichnis bebauung einschränkung baurecht grundstück altlastenauskunft bauakte'},
      {t:'Ratgeber: Annuitätendarlehen', u:'/ratgeber/annuitaetendarlehen.html', c:'Ratgeber', k:'annuität darlehen kredit tilgung zinsen rate bank rückzahlung finanzierung'},
      {t:'Ratgeber: Wirtschaftsplan', u:'/ratgeber/wirtschaftsplan.html', c:'Ratgeber', k:'wirtschaftsplan wohneigentümer eigentümergemeinschaft weg hausgeld rücklage verwalter'},
      {t:'Ratgeber: Mietspiegel', u:'/ratgeber/mietspiegel.html', c:'Ratgeber', k:'mietspiegel mietpreis miete vergleichsmiete mietrecht mieterhöhung ortsüblich mieter vermieter mietvertrag'},
      {t:'Ratgeber: Smart Home', u:'/ratgeber/smarthome.html', c:'Ratgeber', k:'smarthome smart home automation beleuchtung heizung sicherheit technik haussteuerung'},
      {t:'Ratgeber: Energieausweis', u:'/ratgeber/energieausweis.html', c:'Ratgeber', k:'energieausweis energieeffizienz verbrauch bedarfsausweis verbrauchsausweis pflicht energieeffizienzklasse sanierung unterlagen hausverkauf modernisierungsnachweise sanierungsnachweise'},
      {t:'Ratgeber: Grundschuld', u:'/ratgeber/grundschuld.html', c:'Ratgeber', k:'grundschuld hypothek bank kredit sicherheit darlehen eintragung grundbuch löschung löschungsbewilligung restschuld'},
      {t:'Ratgeber: Grundsteuer', u:'/ratgeber/grundsteuer.html', c:'Ratgeber', k:'grundsteuer steuer reform hebesatz grundstück bewertung grundsteuererklärung'},
      {t:'Ratgeber: Kaufvertrag', u:'/ratgeber/kaufvertrag.html', c:'Ratgeber', k:'kaufvertrag notar beurkundung immobilienkauf eigentümer übergabe auflassung auflassungsvormerkung notartermin übergabeprotokoll besitzübergang schlüsselübergabe kaufpreisfälligkeit reservierungsvereinbarung'},
      {t:'Ratgeber: Notarkosten', u:'/ratgeber/notarkosten-beim-immobilienkauf.html', c:'Ratgeber', k:'notar notarkosten notartermin kaufnebenkosten beurkundung grunderwerbsteuer nebenkosten immobilienkauf'},
      {t:'Ratgeber: Maklerkosten', u:'/ratgeber/maklerkosten-beim-immobilienkauf.html', c:'Ratgeber', k:'makler maklerprovision maklerkosten courtage käufer verkäufer provision bestellerprinzip maklervertrag alleinauftrag immobilienmakler finden bester'},
      {t:'Ratgeber: Immobilienkauf', u:'/ratgeber/immobilienkauf.html', c:'Ratgeber', k:'immobilienkauf kaufen haus wohnung notar finanzierung makler besichtigung eigenkapital wohnflächenberechnung grundriss'},
      {t:'Ratgeber: Immobilienverkauf', u:'/ratgeber/immobilienverkauf.html', c:'Ratgeber', k:'immobilienverkauf verkaufen haus wohnung makler notar provision kaufpreis verkaufspreis exposé homestaging besichtigung bieterverfahren kaufpreisverhandlung preisstrategie diskreter off-market ablauf tipps checkliste vorbereitung dauer erfolgreicher käufer finden zielgruppe eigennutzer kapitalanleger vermietete leerstand erbschaft scheidung seniorenimmobilie barrierefrei solaranlage fassadensanierung renovierung wertsteigernde immobilienmarketing verkaufspsychologie psychologie'},
      {t:'Ratgeber: Nebenkostenabrechnung', u:'/ratgeber/nebenkostenabrechnung.html', c:'Ratgeber', k:'nebenkosten betriebskosten abrechnung heizkostenabrechnung mieter vermieter heizkosten'},
      {t:'Ratgeber: Vergleichsmiete', u:'/ratgeber/vergleichsmiete.html', c:'Ratgeber', k:'vergleichsmiete mietspiegel ortsübliche miete mietrecht mieterhöhung mietpreisbremse'},
      {t:'Ratgeber: Abschreibung', u:'/ratgeber/abschreibung-bei-immobilien.html', c:'Ratgeber', k:'abschreibung afa steuer vermietung investition abschreibungssatz linear degression'},
      {t:'Ratgeber: Denkmal-AfA', u:'/ratgeber/denkmal-afa.html', c:'Ratgeber', k:'denkmal denkmalschutz denkmalgeschützte afa abschreibung steuer förderung denkmalimmobilie sanierung'},
      {t:'Ratgeber: Kapitalanlage', u:'/ratgeber/kapitalanlage.html', c:'Ratgeber', k:'kapitalanlage rendite investment mietrendite vermietung wertanlage immobilieninvestment renditeobjekt immobilieninvestor kapitalanleger'},
      {t:'Ratgeber: Immobilienportale', u:'/ratgeber/immobilienportale.html', c:'Ratgeber', k:'immobilienportale immoscout immobilienscout24 immowelt ebay kleinanzeigen verkauf inserat anzeige portale immobilienanzeige'},
      {t:'Ratgeber: Asbest', u:'/ratgeber/asbest.html', c:'Ratgeber', k:'asbest sanierung gesundheit gefahr altbau entsorgung asbestsanierung asbesthaltig'},
      {t:'Ratgeber: Bauvoranfrage', u:'/ratgeber/bauvoranfrage.html', c:'Ratgeber', k:'bauvoranfrage baugenehmigung baurecht behörde bauantrag bebaubarkeit grundstück bauakte'},
      {t:'Ratgeber: Dächer', u:'/ratgeber/daecher.html', c:'Ratgeber', k:'dach dachsanierung dachdeckung dacheindeckung dachfenster dachdämmung flachdach satteldach dachgeschoss dachgeschosswohnung'},
      {t:'Ratgeber: Dämmung', u:'/ratgeber/daemmung-bei-immobilien.html', c:'Ratgeber', k:'dämmung wärmedämmung energieeffizienz wdvs sanierung fassadendämmung fassadensanierung kellerdecke wertsteigernde renovierung'},
      {t:'Ratgeber: Fenster', u:'/ratgeber/fenster.html', c:'Ratgeber', k:'fenster verglasung wärmeschutz schallschutz sanierung fenstertausch kunststoff holz fenster erneuern'},
      {t:'Ratgeber: Flurkarte', u:'/ratgeber/flurkarte.html', c:'Ratgeber', k:'flurkarte kataster grundstück liegenschaftskarte flurstück katasteramt wohnflächenberechnung kubatur kubaturberechnung'},
      {t:'Ratgeber: Gebäudeenergiegesetz', u:'/ratgeber/gebaeudeenergiegesetz.html', c:'Ratgeber', k:'gebäudeenergiegesetz geg heizung wärmepumpe energieeffizienz heizungsgesetz sanierung'},
      {t:'Ratgeber: Haustüren', u:'/ratgeber/haustueren.html', c:'Ratgeber', k:'haustür einbruchschutz sicherheit energieeffizienz sanierung türsicherung einbruch'},
      {t:'Ratgeber: Smart Heizung', u:'/ratgeber/smart-heizung.html', c:'Ratgeber', k:'smart heizung heizthermostat steuerung energie smart home heizungssteuerung thermostat'},
      {t:'Ratgeber: Verglasung', u:'/ratgeber/verglasung.html', c:'Ratgeber', k:'verglasung fenster doppelverglasung dreifachverglasung wärmeschutz isolierverglasung'},
      {t:'Ratgeber: Spekulationssteuer', u:'/ratgeber/spekulationssteuer.html', c:'Ratgeber', k:'spekulationssteuer steuer gewinn verkauf haltefrist 10 jahre eigennutzung veräußerungsgewinn estg einkommensteuer immobilienverkauf steuer'},
      {t:'Ratgeber: KfW-Förderung', u:'/ratgeber/kfw-foerderung.html', c:'Ratgeber', k:'kfw förderung kfw297 kfw298 kfw300 kfw124 kfw261 kfw458 energieeffizient neubau sanierung wohngebäude kredit zuschuss tilgungszuschuss beg bundesförderung effizienzhaus wärmepumpe'},
      {t:'Ratgeber: Kaufnebenkosten', u:'/ratgeber/kaufnebenkosten.html', c:'Ratgeber', k:'kaufnebenkosten grunderwerbsteuer nrw 6,5 prozent notar notarkosten grundbuch maklerprovision nebenkosten immobilienkauf köln nordrhein westfalen'},
      {t:'Immobilien-Ratgeber Übersicht', u:'/ratgeber/', c:'Ratgeber', k:'ratgeber immobilien tipps wissen leitfaden übersicht'},
    ];

  function norm(s) {
    return s.toLowerCase()
      .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss');
  }

  var wrap = document.getElementById('navSearch');
  var btn  = document.getElementById('navSearchBtn');
  var inp  = document.getElementById('navSearchInput');
  var drop = document.getElementById('navSearchDropdown');
  if (!wrap || !btn || !inp || !drop) return;

  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    var isOpen = wrap.classList.toggle('open');
    if (isOpen) { inp.focus(); }
    else { inp.value = ''; drop.classList.remove('visible'); drop.innerHTML = ''; }
  });

  inp.addEventListener('input', function() {
    var q = norm(this.value.trim());
    if (q.length < 2) { drop.classList.remove('visible'); drop.innerHTML = ''; return; }
    var res = IDX.filter(function(r) { return norm(r.t + ' ' + (r.k||'')).includes(q); }).sort(function(a, b) {
      var aTitle = norm(a.t).includes(q) ? 0 : 1;
      var bTitle = norm(b.t).includes(q) ? 0 : 1;
      return aTitle - bTitle;
    }).slice(0, 7);
    if (!res.length) {
      drop.innerHTML = '<p class="search-no-results">Keine Ergebnisse f\u00fcr \u201e' + this.value + '\u201c</p>';
    } else {
      drop.innerHTML = res.map(function(r) {
        return '<a href="' + r.u + '" class="search-result"><div class="search-result__title">' + r.t + '</div><div class="search-result__type">' + r.c + '</div></a>';
      }).join('');
    }
    drop.classList.add('visible');
  });

  inp.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      wrap.classList.remove('open'); inp.value = '';
      drop.classList.remove('visible'); drop.innerHTML = '';
    }
  });

  document.addEventListener('click', function(e) {
    if (!wrap.contains(e.target)) {
      wrap.classList.remove('open'); inp.value = '';
      drop.classList.remove('visible'); drop.innerHTML = '';
    }
  });
})();
