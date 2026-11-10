// Conținutul feedului: lecții de câteva secunde și „adevăr sau minciună”.
// **cuvânt** apare evidențiat pe ecran.
const REELS = [];
const TRAPS = [];
function L(t, h, b, m) { REELS.push({ k: "L", id: "L" + REELS.length, t, h, b, m }); }
function T(t, s, ok, e) { TRAPS.push({ k: "T", id: "T" + TRAPS.length, t, s, ok, e }); }

// MĂSURARE
L("mas", "Construct și indicator", ["Fericirea e un **construct**: există, dar n-o vezi direct.", "Ce măsori e un **indicator**: nota dată la o întrebare.", "Indicatorul se mai numește proxy și măsoară imperfect."], "Construct = ce vrei. Indicator = ce măsori.");
L("mas", "Cum măsori CO2 din trecut", ["Vrei CO2 de acum sute de mii de ani.", "Ăla e **constructul**.", "Bulele prinse în ghețari sunt **indicatorul**."], "CO2 din trecut = construct. Bulele din ghețari = indicator.");
L("mas", "Nivelul nominal", ["**Nominal** = categorii fără ordine.", "Leu nu e „mai mult” decât Rac.", "Poți calcula doar frecvențe, procente și **modul**."], "Fără ordine, fără mediană.");
L("mas", "Nivelul ordinal", ["**Ordinal** = categorii ordonate.", "Știi ce e mai sus, dar nu cu cât.", "În plus față de nominal: **mediana** și percentilele."], "Ordine da. Distanțe egale nu.");
L("mas", "Nivelul numeric", ["**Numeric** = numere cu distanțe egale.", "Aici ai medie, abatere standard și **corelație**.", "Scala 1–10 e tratată numeric, dar e o **aproximare**."], "9→10 poate să nu fie cât 4→5.");
L("mas", "Media unei variabile 0/1", ["Gen feminin: 1 = da, 0 = nu.", "Media 0,46 înseamnă **46% femei**.", "Așa se citesc variabilele dummy."], "Media 0/1 = proporția de 1.");
L("mas", "Corelația cu o variabilă 0/1", ["Semnul spune **care grup are media mai mare**.", "Gen feminin–sănătate = −0,071.", "Deci femeile au media ceva **mai mică**."], "1 = femeie. r negativ = media femeilor e mai mică.");
L("mas", "Modelul reflectiv", ["**Constructul produce indicatorii.**", "Deci indicatorii **corelează** între ei.", "Exemple: IQ, temperatura resimțită."], "Reflectiv → analiză factorială.");
L("mas", "Modelul formativ", ["**Formativ**: indicatorii compun constructul.", "Corelațiile dintre ei **pot lipsi**.", "Exemple: coșul inflației, nota unui hotel."], "Formativ → sumă sau medie ponderată.");
L("mas", "Erorile aleatorii", ["**Erori aleatorii**: abateri în orice direcție.", "În medie se compensează.", "Lovesc **fidelitatea**, adică repetabilitatea."], "Aleator → fidelitate → precizie.");
L("mas", "Erorile sistematice", ["**Erori sistematice**: mereu în aceeași direcție.", "Exemplu: **dezirabilitatea socială**.", "Lovesc **validitatea**."], "Sistematic → validitate → acuratețe.");
L("mas", "Fidel, dar nevalid: zodia", ["Aceeași dată dă mereu aceeași zodie: **fidelă**.", "Ca indicator al personalității: **nevalidă**.", "Precis nu înseamnă corect."], "Repetabil nu înseamnă valid.");
L("mas", "Precizie vs. acuratețe", ["**Precizia**: măsurătorile sunt apropiate între ele.", "**Acuratețea**: sunt apropiate de adevăr.", "Precizie ≈ fidelitate. Acuratețe ≈ validitate."], "Aproape între ele vs. aproape de adevăr.");
L("mas", "Efectul erorilor asupra corelațiilor", ["Erorile aleatorii independente **slăbesc** corelațiile.", "Le apropie de **zero**.", "Erorile sistematice legate de altă variabilă pot crea asocieri **false**."], "Aleatorii: slăbesc corelația. Sistematice: pot crea asocieri false.");
L("mas", "Scale diferite: 1–10 și 0–10", ["EVS folosește scala **1–10**.", "Eurostat folosește scala **0–10**.", "Mediile nu se compară direct."], "Compari medii doar pe aceeași scală.");
L("mas", "PIB-ul ca indicator imperfect", ["PIB-ul e umflat de **multinaționale** și navetiști.", "Indicatorul **supraestimează** nivelul de trai.", "PIB-ul e aici un indicator imperfect."], "PIB-ul nu arată direct nivelul de trai.");
L("mas", "Valori imposibile în date", ["Trei studenți au scris 99, 121 și 1.000.", "Le **verifici**, apoi le tratezi ca erori.", "Nu scoți o valoare doar pentru că strică media."], "Verifică întâi. Elimină după.");
L("mas", "Date lipsă și N", ["Dacă lipsesc la întâmplare, doar scade eșantionul.", "Dacă lipsesc **anumite tipuri** de oameni, rezultatul se deformează.", "N nu arată asta."], "N = câți. Nu de ce.");

// DISTRIBUȚII
L("dist", "Media, mediana, modul", ["**Media** o trag valorile extreme.", "**Mediana** e valoarea din mijloc și rezistă.", "**Modul** e valoarea cea mai frecventă."], "Extremele strică media, nu mediana.");
L("dist", "Valori extreme: media vs. mediana", ["Media a sărit de la 23,0 la **27,7**.", "Mediana a rămas **22**.", "Exact de asta te uiți la amândouă."], "Mediana nu s-a schimbat.");
L("dist", "Distribuție asimetrică", ["România 2018: media **7,49**, mediana **8**, modul **10**.", "Câțiva foarte nemulțumiți trag media în jos.", "Coada e spre valorile **mici**."], "Media e trasă spre coada distribuției.");
L("dist", "Aceeași medie, variabilitate diferită", ["La primul, note între 7 și 9.", "La al doilea, note între 1 și 10.", "Diferența o vede **abaterea standard**."], "Aceeași medie poate avea abateri standard diferite.");
L("dist", "Varianța și abaterea standard", ["**Varianța**: media pătratelor abaterilor față de medie.", "**Abaterea standard**: rădăcina ei.", "Are aceeași unitate ca datele."], "Varianța = abaterea standard la pătrat.");
L("dist", "Distribuția normală: 68, 95, 99,7", ["**68%** la o abatere standard.", "**95%** la două.", "**99,7%** la trei."], "În normală, media = mediana = modul.");
L("dist", "Indicele Gini", ["**0** = toți au la fel.", "**1 sau 100** = unul are totul.", "Din curba Lorenz: **A / (A + B)**."], "Gini mare = inegalitate mare.");
L("dist", "Medii și indivizi", ["Afirmația e despre **medii**.", "Distribuțiile se **suprapun**.", "Pentru doi indivizi îți trebuie distribuțiile."], "Media descrie grupul, nu persoana.");

// CORELAȚIE
L("cor", "Când două variabile sunt asociate?", ["Știi A.", "Îl ghicești pe B **mai bine decât la întâmplare**.", "Merge și la variabile nominale."], "Asociere = informație despre cealaltă.");
L("cor", "Covarianță vs. corelație", ["**Covarianța** arată doar sensul.", "Mărimea depinde de unități.", "**Corelația** arată sens și intensitate, fără unități."], "Corelație = covarianță standardizată.");
L("cor", "r ia valori între −1 și +1", ["**r > 0**: mare cu mare.", "**r < 0**: mare cu mic.", "**±1**: toate punctele sunt exact pe o dreaptă."], "Semnul e direcția.");
L("cor", "Intensitatea lui r: valoarea absolută", ["Intensitatea se judecă în **valoare absolută**.", "Semnul nu contează pentru tărie.", "Cea mai comună capcană din tabele."], "Scoate minusul, apoi compară.");
L("cor", "r = 0,35 NU e 35%", ["r **nu e procent**.", "**Nu e pantă**.", "**Nu arată cauză**."], "r = direcție și tărie liniară. Atât.");
L("cor", "r = 0,5 înseamnă 25%", ["Ridici la pătrat: **r²**.", "E variația pe care o au **în comun**.", "Nu 50%. Niciodată 50%."], "0,5 × 0,5 = 0,25.");
L("cor", "r = 0 și totuși relație clară", ["Pearson vede doar **linii drepte**.", "O formă de **U** poate da r aproape zero.", "Lipsește doar relația liniară."], "r = 0 nu înseamnă nicio legătură.");
L("cor", "Dreaptă aproape plată, r = 1", ["r arată cât de **strâns** e norul.", "**Nu cât de abruptă** e dreapta.", "Panta și r sunt lucruri diferite."], "r măsoară apropierea de dreaptă, nu panta.");
L("cor", "71% și 27% pot corela", ["Treburile: alese de 71%.", "Acordul politic: ales de 27%.", "Corelează **0,29**, pentru că r **nu compară mediile**."], "Un item ales des și unul ales rar pot corela.");
L("cor", "Praguri orientative pentru r", ["**0,1** e slabă.", "**0,3** e moderată.", "**Peste 0,5** e puternică."], "Sunt convenții, nu legi.");
L("cor", "Nor de puncte: ce citești", ["**Sens**: urcă sau coboară.", "**Formă**: dreaptă sau curbă.", "**Intensitate** și **excepții**."], "Sens, formă, tărie, excepții.");
L("cor", "Cazurile extreme schimbă r", ["PIB–satisfacție: r = **0,54**.", "Fără Luxemburg și Irlanda: **0,69**.", "Câteva cazuri extreme schimbă mult r."], "Verifică extremele.");
L("cor", "Tabel de contingență", ["Procente **pe coloane**.", "Diferă mult între coloane? **Asociere**.", "Aproape egale? Fără asociere."], "Compari coloanele.");

// SPSS
L("spss", "SPSS omite zeroul din față", [".540 înseamnă **0,540**.", "−.229 înseamnă **−0,229**.", "Așa afișează SPSS valorile."], "Citește-l cu 0 în față.");
L("spss", "Sig. = .000 NU înseamnă zero", ["SPSS afișează trei zecimale.", ".000 înseamnă **p < 0,001**.", "Probabilitatea nu e exact zero."], ".000 → sub 0,001.");
L("spss", "Ce conține o celulă SPSS", ["**Pearson Correlation**: r.", "**Sig.**: semnificația.", "**N**: câți au răspuns la ambele variabile."], "r, Sig., N. Mereu.");
L("spss", "Steluțele arată semnificația", ["**\\*\\*** = semnificativ la 0,01.", "**\\*** = semnificativ la 0,05.", "Fără steluță: nesemnificativ la 0,05."], "Steluțele arată Sig., nu intensitatea.");
L("spss", "De ce N se schimbă din celulă în celulă?", ["**Excludere pe perechi**.", "Intră oricine a răspuns la acele două variabile.", "Corelațiile cu vârsta au mai puține cazuri."], "Fiecare pereche are N-ul ei.");
L("spss", "Diagonala tabelului", ["Variabila cu ea însăși: **1**.", "Tabelul e **simetric**.", "Aceeași valoare apare de două ori."], "Diagonala nu se interpretează.");
L("spss", "Cea mai puternică corelație din EVS România", ["Satisfacție–fericire: 0,540.", "Sănătate–vârstă: **−0,541**.", "Este cea mai mare în valoare absolută."], "|−0,541| > 0,540.");
L("spss", "r mic, Sig. mic. Cum e posibil?", ["Gen–sănătate: r = **−0,071**, Sig. = 0,004.", "Eșantion mare: **N = 1.612**.", "Semnificativă, dar foarte slabă."], "N mare face și r mic semnificativ.");
L("spss", "Cum citești un tabel SPSS", ["Găsești **rândul** și **coloana**.", "Citești r, Sig., N.", "Compari în **valoare absolută** și nu zici cauză."], "Corelația din tabel nu arată cauza.");

// ERORI DE MODELARE
L("err", "Corelație și model", ["Aceeași corelație poate avea explicații diferite.", "Modelul spune **ce produce ce**.", "Un model greșit dă o concluzie greșită."], "Cursul descrie șapte erori de modelare.");
L("err", "Corelații coincidentale", ["Corelează aproape perfect.", "E **coincidență**.", "Cauți prin destule date și găsești orice."], "Eroarea 1: corelații coincidentale.");
L("err", "Sensul cauzării", ["Poate efectul e de fapt cauza.", "Sau merge în **ambele sensuri**.", "Corelația nu spune direcția."], "Eroarea 2: sensul cauzării.");
L("err", "Corect din rațiuni false", ["Erau rare în profesii intelectuale.", "Cauza reală: **accesul la educație**.", "Relația exista, explicația era falsă."], "Eroarea 3: corect din rațiuni false.");
L("err", "Cauzalitate iluzorie", ["Pantof și citit corelează la copii.", "Ambele cresc cu **vârsta**.", "O **cauză comună** le produce pe amândouă."], "Eroarea 4: cauzalitate iluzorie.");
L("err", "Cauzalitate iluzorie: terța variabilă", ["Ambele cresc în același timp.", "Cauza comună: **vara**.", "Asta e terța variabilă."], "A ← C → B.");
L("err", "Eroare sistematică de măsurare", ["Sau **recunosc mai ușor** în chestionar.", "O variabilă omisă deformează măsurarea.", "Asocierea vine din bias."], "Eroarea 5: eroare sistematică de măsurare.");
L("err", "Paradoxul lui Simpson", ["În fiecare cartier, mai multe camere = mai scump.", "Pe tot orașul: casele mari sunt mai ieftine.", "Variabila omisă: **cartierul**."], "Eroarea 6: paradoxul lui Simpson.");
L("err", "Eroarea ecologică", ["Țările bogate fumează mai mult și trăiesc mai mult.", "La **persoane**, fumatul scade speranța de viață.", "Datele despre țări nu vorbesc despre indivizi."], "Eroarea 7: eroarea ecologică.");
L("err", "Ciocolată și premii Nobel", ["r = **0,79**.", "Nobel corelează și cu IKEA: **0,82**.", "Cauza comună probabilă: **bogăția**."], "Corelația nu arată că ciocolata produce premii.");
L("err", "Vârstă → sănătate → satisfacție", ["Sănătatea nu produce vârsta.", "Deci nu e cauză comună, e **verigă intermediară**.", "Asta e eroarea 3, nu 4."], "Verigă intermediară ≠ cauză comună.");
L("err", "PIB 0,54 între țări. Venit 0,11 între români.", ["Relația dintre țări nu se mută pe oameni.", "Țările diferă și prin instituții, cultură, istorie.", "Exemplu direct de **eroare ecologică**."], "Relația dintre țări nu e relația dintre oameni.");

// EȘANTIONARE ȘI SIG.
L("esa", "Populație, eșantion, generalizare", ["**Populația**: toți.", "**Eșantionul**: cei studiați.", "Generalizarea cere eșantion **probabilist**."], "Fără probabilist, fără generalizare.");
L("esa", "Patru eșantioane probabiliste", ["**Simplu aleatoriu**: toți au aceeași șansă.", "**Sistematic**: din k în k.", "**Stratificat** și **pe clustere**."], "Toate patru folosesc tragerea la sorți.");
L("esa", "Stratificat vs. clustere", ["**Stratificat**: extragi din fiecare strat.", "**Clustere**: tragi la sorți grupuri întregi.", "Clusterele: cost mai mic, eroare mai mare."], "Din fiecare grup vs. grupuri întregi.");
L("esa", "Eșantioane neprobabiliste", ["**Disponibilitate**: cine e la îndemână.", "**Bulgăre de zăpadă**: se recomandă între ei.", "**Teoretic**: alegi intenționat."], "Nu permit generalizarea la populație.");
L("esa", "Ce este Sig. (p)", ["Presupui că în populație **nu există relație**.", "Cât de probabil e un rezultat măcar atât de mare **din întâmplare**?", "Asta e p."], "p nu e șansa ca relația să existe.");
L("esa", "Sig. = 0,02 nu înseamnă 98%", ["Nu e 98% șansă că relația există.", "Nu vor ieși 98 din 100 de eșantioane la fel.", "Doar: e **puțin probabil din întâmplare**."], "Interpretare greșită frecventă.");
L("esa", "Sig. nu măsoară tăria", ["Tăria o dă **r**.", "Sig. scade cu r mai mare și cu **N mai mare**.", "Prag obișnuit: **0,05**."], "Sig. mic ≠ corelație mare.");
L("esa", "Studenții din sală, Sig. = 0,001", ["Eșantion de **disponibilitate**.", "Nu generalizezi, **oricât de mic e Sig.**", "De asta Sig. e doar ilustrativ la Cursul 06."], "Sig. mic nu face eșantionul reprezentativ.");
L("esa", "Nesemnificativ ≠ nu există", ["Relația poate fi slabă.", "Eșantionul poate fi prea mic.", "Lipsa semnificației **nu dovedește absența**."], "Relația poate exista și fără Sig. < 0,05.");
L("esa", "Semnificativ și cauzal: vinul roze", ["Diferența e semnificativă statistic.", "Femeile beau mai des roze și sunt mai scunde în medie.", "**Semnificativ nu înseamnă cauzal**."], "p nu exclude terța variabilă.");
L("esa", "Non-răspunsul la sondajele telefonice", ["La telefon răspund mai ales cei **agreabili**.", "Și cei mai **încrezători**.", "Eșantionul se deformează."], "Cine răspunde contează.");

// FACTORIALĂ
L("fac", "Factor vs. cluster", ["**Factorii grupează variabile.**", "**Clusterele grupează oameni.**", "Un factor nu e un tip de oameni."], "Variabile vs. cazuri.");
L("fac", "Ce face analiza factorială", ["Indicatori care corelează puternic.", "Probabil au o **dimensiune comună**.", "Aia e factorul latent."], "Indicatori corelați → factor.");
L("fac", "Etapele analizei factoriale", ["**1. Matricea de corelații.**", "**2. Selecția factorilor.**", "**3. Interpretare și etichetare.**"], "Corelezi, alegi, numești.");
L("fac", "Regula Kaiser", ["Fiecare factor are o **valoare proprie**.", "Peste **1** explică mai mult decât un singur indicator.", "Sub 1 nu îl păstrezi."], "Eigenvalue > 1.");
L("fac", "Testul grohotișului (scree plot)", ["Curba coboară abrupt.", "Apoi se aplatizează.", "Păstrezi factorii **dinainte** de aplatizare."], "Se citește punctul unde curba se aplatizează.");
L("fac", "Matricea de structură se citește pe coloane", ["Celulele sunt corelații **indicator–factor**.", "Le mai zice **încărcări**.", "Valorile mari îți dau numele factorului."], "Indicatorii puternici de pe coloană dau numele factorului.");
L("fac", "Fiecare om are un scor pe fiecare factor", ["Scorurile sunt variabile noi, **continue**.", "Poți avea scor mare pe **mai mulți** factori.", "Le poți băga apoi în regresie."], "Scor continuu, nu etichetă.");
L("fac", "−0,86 la venit. Ce înseamnă?", ["La factorul „Banii”, semnul e minus.", "Scor mare = cere **puțin** venit și locuință.", "Semnul e o convenție, dar contează la citit."], "Citește semnul.");
L("fac", "Numărul și numele factorilor", ["Numărul și numele sunt **decizii ale analistului**.", "Numele e o interpretare.", "Nu e dovada unei cauze latente."], "SPSS nu dă nume factorilor.");
L("fac", "PCA vs. analiză factorială", ["**PCA** rezumă toată variația.", "**Analiza factorială**: doar variația comună.", "În curs sunt folosite ca sinonime."], "Toată vs. comună.");

// CLUSTER
L("clu", "Algoritmul K-means", ["Alegi **k** și pui k centre.", "Fiecare caz merge la centrul **cel mai apropiat**.", "Recalculezi centrele și **repeți**."], "Repeți până când grupurile nu se mai schimbă.");
L("clu", "Rezultatul e o singură variabilă", ["Valori de la **1 la k**.", "Sunt doar **etichete nominale**.", "Fiecare caz are **un singur** tip."], "Un caz aparține unui singur tip.");
L("clu", "Cine alege numărul de grupuri", ["**Analistul** alege k.", "Încearcă mai multe soluții.", "Se uită la cât de bine se pot interpreta."], "k e decizia ta.");
L("clu", "Citești clusterele pe coloane", ["Fiecare coloană e un **profil**.", "Te uiți la mediile criteriilor.", "Numele tipului e interpretarea analistului."], "Profil = mediile pe tip.");
L("clu", "Membrii unui cluster nu sunt identici", ["Seamănă **mai mult între ei** decât cu ceilalți.", "Nu sunt identici.", "Tipul e o combinație, **nu o cauză**."], "Asemănător ≠ identic.");
L("clu", "Tipul cu cea mai mică importanță a copiilor", ["Copii la „Cuplu fără copii”: **0,5**.", "Copii la „Parteneri egali”: **0,1**.", "Citește numărul, nu numele tipului."], "Numele poate păcăli.");
L("clu", "Sănătate fragilă și totuși mulțumiți", ["Un tip are 21% din români.", "Satisfacție **7,8**, sănătate doar **2,8**.", "Clusterele arată combinații pe care corelația nu le arată."], "Corelația nu arată tipuri de respondenți.");

// REGRESIE
L("reg", "Regresia și controlul variabilelor", ["Y explicat de mai mulți **X odată**.", "Coeficientul arată relația cu Y **când ceilalți sunt constanți**.", "Corelația ia doar două variabile."], "Controlat = ținut constant.");
L("reg", "Beta se poate compara", ["Lucrează în **abateri standard**.", "Beta cel mai mare în valoare absolută arată cea mai puternică legătură.", "La ceilalți predictori constanți."], "Compari Beta, în modul.");
L("reg", "R²: cât explică modelul", ["R² = proporția din variația lui Y explicată.", "15% lasă **85% neexplicat**.", "Nu arată cauză."], "R² = proporția din variația lui Y explicată.");
L("reg", "Efectul adăugării unui predictor", ["Coeficienții se estimează **simultan**.", "Scoți sau adaugi un X.", "**Toți** coeficienții se pot schimba."], "Coeficienții depind de predictorii din model.");
L("reg", "Vârstă și sănătate în regresie", ["Beta vârstei singură: **−0,23**.", "Cu sănătatea: **−0,03**, nesemnificativ.", "R² urcă de la 5% la **15%**."], "Se explica prin sănătate.");
L("reg", "Religiozitate și țară în regresie", ["Fără țară în model: **−0,43**.", "Cu țară: **−0,22**.", "Variabila omisă era **contextul**."], "Include contextul.");

// REȚELE ȘI SERII
L("ret", "Rețea = noduri și legături", ["Nodurile pot fi oameni, orașe, cuvinte.", "**Centralitatea**: cât de bine conectat e nodul.", "Familia Medici ocupă centrul rețelei florentine."], "Cine e conectat cu cine.");
L("ret", "Contagiune sau homofilie?", ["**Contagiune**: te influențează cei din jur.", "**Homofilie**: te alegi cu cei ca tine.", "Asemănarea singură **nu le deosebește**."], "Influență vs. alegere.");
L("ret", "Componentele unei serii de timp", ["**Tendință**.", "**Variație sezonieră** sau ciclică.", "**Variație aleatorie**."], "Tendință, sezonalitate, variație aleatorie.");
L("ret", "Ruptura de serie", ["Poate fi **ruptură de serie**.", "Altă metodă, altă sursă, alt chestionar.", "**Verifici sursa** înainte să explici."], "Întâi verifici notele sursei.");
L("ret", "Marcajele Eurostat: b și u", ["**b** = break in time series.", "**u** = low reliability.", "Germania 2022: fiabilitate scăzută."], "b = ruptură. u = nesigur.");

// GRAFICE
L("gra", "Axa care nu începe de la zero", ["Multe grafice nu încep de la zero.", "Asta **mărește** diferențele.", "Te uiți la axe înainte de orice."], "Primul lucru: axele.");
L("gra", "Limitele axei nu sunt limitele datelor", ["Axa merge de la 4,5 la 8,5.", "Valorile reale: **4,8 – 7,9**.", "Citești punctele, nu marginile."], "Punctele, nu marginile.");
L("gra", "Efectul de plafon", ["Suedia pornește de la 8.", "Aproape de capătul scalei ai **puțin loc** să urci.", "La fel și procentele aproape de 100%."], "Aproape de capătul scalei, valoarea mai crește puțin.");
L("gra", "Nor de puncte cu țări", ["Relația descrie **țările**.", "Și **un singur moment**.", "Nu evoluția unei țări în timp."], "Verifici ce reprezintă un punct.");
L("gra", "Caz contrar tendinței", ["Are satisfacție mare pentru PIB-ul ei.", "Un caz contrar **nu infirmă** tendința.", "Și nu înseamnă că datele sunt greșite."], "Un caz contrar nu infirmă tendința.");
L("gra", "Bulgaria: de la 4,8 la 6,3", ["România 2013: 7,2. Bulgaria: 4,8. Diferența **2,4**.", "În 2025: 7,8 și 6,3. Diferența **1,5**.", "Distanța s-a **micșorat**."], "Scazi în același an.");
L("gra", "Distanța România–Suedia", ["1999: România 5,2, Suedia 7,7.", "2018: România 7,5.", "Distanța: de la circa **2,4** la circa **0,1**."], "Suedia a rămas aproape constantă, România a crescut.");
L("gra", "Restricția intervalului", ["Te uiți doar la țări europene, relativ bogate.", "Variația e mai mică.", "Asocierea poate părea **mai slabă**."], "Un interval restrâns poate slăbi asocierea observată.");

// STUDII DE CAZ
L("caz", "Patru teorii despre căsătorie", ["**Banii**, **familia tradițională**.", "**Parteneriatul egal**, **intimitatea**.", "Corelează între ele cel mult 0,14."], "Patru dimensiuni distincte.");
L("caz", "Doar 18 din 245 au fost căsătoriți", ["Studenții nu spun ce face o căsătorie să reușească.", "Spun ce **cred** că o face.", "Teorii anticipative, nu experiențe."], "Așteptări, nu experiențe.");
L("caz", "Religiozitate vs. facultate", ["Beta **+0,47** pe Familia tradițională.", "Facultatea nu atinge pragul.", "Diferența se explică în bună parte prin gen."], "Diferența vine mai ales din compoziția pe gen.");
L("caz", "12% vs. 76%", ["Acord cu părinții de același sex.", "România **12%**, Suedia **76%**.", "Țara singură explică **29%** din variație."], "Țara explică mult din variație.");
L("caz", "Șase reguli finale", ["Verifică datele. Alege atent indicatorii.", "Spune cine lipsește. Compară metode.", "Include contextul. **Corelația nu e cauzalitate.**"], "Regulile din Cursul 06.");

// CURS 1
L("c1", "Statistică vs. știința datelor", ["Statistica: date structurate, **înțelegere** și predicție.", "DS: date vaste, **clasificare** și predicție.", "Modelele vin din discipline vs. din date."], "Fenomen vs. pattern.");
L("c1", "Reflexivitate: Hawthorne și Thomas", ["**Efectul Hawthorne**: productivitatea creștea la orice schimbare.", "**Teorema lui Thomas**: situații definite ca reale devin reale prin consecințe.", "Asta e reflexivitate."], "Obiectul studiat reacționează.");
L("c1", "Contaminarea logicilor dovezilor", ["Reviste medicale, marketing, Reddit.", "Toate devin **tokenuri**.", "Marcajele logicii dovezilor se pierd."], "Un pattern fără origine nu e dovadă.");
L("c1", "Cine ia vina când IA greșește?", ["**Zonă morală de șoc**: omul preia vina.", "**Scurgere de responsabilitate**: nimeni nu răspunde.", "**Centaur inversat**: mașina conduce."], "Trei concepte despre responsabilitate.");

// ADEVĂR SAU MINCIUNĂ
T("cor", "r = 0,35 înseamnă că 35% dintre cazuri se asociază.", false, "r nu e procent. Arată direcția și tăria legăturii liniare.");
T("cor", "r = 0 înseamnă că variabilele n-au nicio legătură.", false, "Lipsește doar legătura liniară. Una curbă rămâne posibilă.");
T("cor", "r = 0,5 înseamnă 25% variație comună.", true, "r² = 0,25.");
T("cor", "Dacă doi itemi corelează puternic, au medii apropiate.", false, "r nu compară mediile.");
T("cor", "−0,4 e mai slabă decât 0,3.", false, "În valoare absolută, 0,4 > 0,3.");
T("cor", "r măsoară cât de abruptă e dreapta.", false, "r arată cât de strâns e norul în jurul dreptei.");
T("cor", "Corelația nu are unitate de măsură.", true, "Covarianța are, corelația nu.");
T("cor", "Covarianța arată și intensitatea relației.", false, "Covarianța arată doar sensul.");
T("esa", "Sig. foarte mic înseamnă corelație puternică.", false, "Sig. nu măsoară intensitatea.");
T("esa", "Sig. = 0,02: 98 de eșantioane din 100 ar da aceeași corelație.", false, "Sig. nu e probabilitate de repetare.");
T("esa", "Nesemnificativ înseamnă că în populație nu există relație.", false, "Lipsa semnificației nu dovedește absența.");
T("esa", "Semnificativ înseamnă cauzal.", false, "Terța variabilă rămâne posibilă.");
T("esa", "Eșantion de disponibilitate cu Sig. < 0,05: putem generaliza.", false, "Generalizarea cere eșantion probabilist.");
T("esa", "Sig. scade când eșantionul crește.", true, "Sig. e mai mic pentru coeficienți mari și eșantioane mari.");
T("esa", "Pe clustere e un eșantion probabilist.", true, "Se trag la sorți grupuri întregi.");
T("esa", "Bulgărele de zăpadă permite generalizarea.", false, "E neprobabilist, util pentru populații greu de găsit.");
T("spss", "Sig. = .000 înseamnă că probabilitatea e exact zero.", false, "Înseamnă p < 0,001.");
T("spss", "Două steluțe înseamnă corelație puternică.", false, "Steluțele arată semnificația, la pragul 0,01.");
T("spss", "Diagonala tabelului conține valoarea 1.", true, "Fiecare variabilă corelată cu ea însăși.");
T("spss", "N poate diferi de la o celulă la alta.", true, "Cu excludere pe perechi, da.");
T("err", "Între țări X și Y corelează, deci și oamenii.", false, "Asta e eroarea ecologică.");
T("err", "O comparație între țări explică evoluția unei țări.", false, "Un moment între țări nu descrie anii unei țări.");
T("err", "Paradoxul lui Simpson e și paradoxul variabilei omise.", true, "Variabila omisă inversează relația.");
T("err", "Pantof–citit la copii e un exemplu de cauzalitate iluzorie.", true, "Cauza comună e vârsta.");
T("err", "Sănătatea e cauza comună pentru vârstă și satisfacție.", false, "Sănătatea nu produce vârsta. E verigă intermediară.");
T("dist", "Grupul A are media mai mare, deci orice membru A îl bate pe orice membru B.", false, "Mediile descriu grupuri.");
T("dist", "Mediana rezistă la valori extreme.", true, "Media e cea sensibilă.");
T("dist", "Gini = 100 înseamnă egalitate perfectă.", false, "100 = o singură persoană are totul.");
T("dist", "În distribuția normală, 95% din valori sunt la cel mult două abateri standard.", true, "68, 95, 99,7.");
T("mas", "Erorile aleatorii de măsurare creează corelații.", false, "Cele independente slăbesc corelațiile.");
T("mas", "Erorile sistematice scad validitatea.", true, "Abateri în aceeași direcție.");
T("mas", "Inflația e un model reflectiv.", false, "Prețurile compun indicele, deci formativ.");
T("mas", "La nivel nominal putem calcula modul.", true, "Doar frecvențe, procente și modul.");
T("mas", "Precizia e apropiată de validitate.", false, "Precizia e apropiată de fidelitate.");
T("fac", "Analiza factorială împarte oamenii în grupuri.", false, "Factorii grupează variabile.");
T("fac", "Un om poate avea scoruri mari pe mai mulți factori.", true, "Fiecare factor e o variabilă separată.");
T("fac", "Regula Kaiser păstrează factorii cu valoarea proprie sub 1.", false, "Peste 1.");
T("fac", "Numărul factorilor e decizia analistului.", true, "Regulile doar ajută.");
T("clu", "Numărul de clustere rezultă automat din date.", false, "Îl alege analistul.");
T("clu", "Toți membrii unui cluster au aceleași valori.", false, "Seamănă mai mult între ei, dar nu sunt identici.");
T("clu", "Un caz aparține unui singur cluster în K-means.", true, "Un caz, un tip.");
T("reg", "Beta standardizați pot fi comparați între ei.", true, "Lucrează în abateri standard.");
T("reg", "Dacă scoți un predictor, restul coeficienților rămân identici.", false, "Se pot schimba toți.");
T("gra", "Axa merge de la 4,5 la 8,5, deci valorile sunt între 4,5 și 8,5.", false, "Limitele axei nu sunt limitele datelor.");
T("gra", "Un salt brusc într-o serie arată o schimbare reală.", false, "Verifici întâi dacă s-a schimbat măsurarea.");
T("gra", "Un caz contrar tendinței nu o infirmă.", true, "Și nici nu înseamnă că datele sunt greșite.");
T("ret", "În Eurostat, „u” înseamnă ruptură de serie.", false, "„u” e low reliability. Ruptura e „b”.");
T("ret", "Homofilia și contagiunea se deosebesc doar privind asemănarea vecinilor.", false, "Asemănarea singură nu le deosebește.");

// COMPLETARE: restul materiei din cursuri și din suport.
L("mas", "Măsurare vs. colectarea datelor", ["**Măsurarea** transformă fenomenul în variabilă.", "**Colectarea** organizează și stochează datele.", "Datele pot veni din măsurători proprii sau din alte surse."], "Măsurare ≠ colectare.");
L("mas", "Armonizarea datelor", ["Fiecare sursă poate avea **propria metodologie**.", "Asta se numește heterogenitatea datelor.", "Datele din surse diferite se **armonizează**."], "Surse diferite → armonizare.");
L("mas", "Reziduurile de plumb din Groenlanda", ["Construct: **circulația monetară în argint**.", "Indicator: **reziduurile de plumb** din gheață.", "Trecutul e măsurat prin ce găsim azi."], "Plumbul = indicator.");
L("mas", "Keeling Curve", ["Măsurare **directă** a CO2.", "Plus inferențe din **analiza ghețarilor**.", "Două tipuri de date pe scale de timp diferite."], "Date din epoci diferite se agregă.");
L("mas", "Scala Likert", ["Răspunsuri: foarte mult, mult, puțin, foarte puțin.", "Valorile sunt cuvinte care se pot **ordona**.", "Uneori sunt traduse în numere."], "Likert = nivel ordinal.");
L("mas", "Ordinal aproximat numeric", ["Școala generală, codată 0, 1, 2 după mărimea localității.", "Liceul, codat 0 și 1.", "Corelația: **r = .672**, N = 197."], "Codurile urmează ordinea categoriilor.");
L("mas", "Note: reflectiv sau formativ", ["Reflectiv: testele arată aceeași **competență latentă** și corelează.", "Formativ: fiecare test acoperă **altă tematică**.", "La formativ, notele pot să nu coreleze."], "Competență latentă vs. tematici care se adună.");
L("mas", "IQ și modelul Carroll", ["Modelul lui Carroll are **trei straturi**.", "Abilitățile largi: inteligență fluidă, cristalizată, memorie și altele.", "Carroll le vede ca variante ale factorului general **g**."], "IQ = model reflectiv.");
L("mas", "Cum se calculează inflația", ["Un coș de bunuri, fiecare cu preț propriu.", "Compari coșul cu **aceeași lună din anul precedent**.", "Produsele pe care cheltuim mai mult au **ponderi mai mari**."], "Inflația = sumă ponderată.");
L("mas", "Stilul de răspuns", ["Preferința de a răspunde „Da”: **aquiescență**.", "Preferința de a răspunde „Nu știu”.", "Afectează măsurarea opiniei."], "Stilul de răspuns e o sursă de eroare.");
L("mas", "Alegerea scalei", ["Scală **cu** punct de mijloc.", "Scală **fără** punct de mijloc.", "Alegerea poate schimba rezultatele."], "Scala influențează răspunsurile.");
L("mas", "Patru scenarii de măsurare", ["Exact și repetabil: **termometrul**.", "Repetabil, inexact: **ceasul care o ia înainte**. Exact, nerepetabil: **ora după capul pe geam**.", "Inexact și nerepetabil: **auto-estimarea inteligenței**."], "Acuratețe și repetabilitate sunt separate.");
L("mas", "Orientarea sexuală prin chestionar", ["Răspunsurile sunt afectate de **dezirabilitatea socială**.", "Eroare sistematică.", "Estimările sunt stabile, dar nu acurate."], "Repetabil, dar afectat de bias.");
L("mas", "Like-uri și trăsături personale", ["Trăsăturile pot fi deduse din like-urile Facebook.", "Validarea s-a făcut pe voluntari din **SUA**.", "Întrebarea este **validitatea** pentru utilizatorii din România."], "Validitatea depinde de context.");
L("mas", "PIB-ul în regimurile autoritare", ["PIB-ul raportat crește mai repede decât **luminile de noapte** văzute din satelit.", "Direcția abaterii este aceeași.", "Este o **eroare sistematică**."], "Indicatorul raportat e deformat.");
L("dist", "Amplitudinea", ["**Amplitudine = valoarea maximă − valoarea minimă.**", "Este o măsură a variabilității.", "Exemplu: 2, 5, 9 are amplitudinea 7."], "Max − min.");
L("dist", "Percentile, cuartile, decile", ["**Percentila**: valoarea sub care se află un procent din cazuri.", "**Cuartila 1** = 25%. **Mediana** = 50%.", "**Decilele** merg din 10 în 10%."], "Cuartila 1 = 25% sub ea.");
L("dist", "Cuplarea selectivă și înălțimea", ["Soții sunt aproape întotdeauna mai înalți decât soțiile.", "Fenomenul se numește **cuplare selectivă**.", "Nu rezultă că toți bărbații sunt mai înalți decât toate femeile."], "Distribuțiile se suprapun.");
L("dist", "Agresivitate și închisori", ["Închisorile au mult mai mulți bărbați pentru infracțiuni violente.", "Nu rezultă că femeile nu sunt violente.", "Contează **distribuția violenței extreme** și discriminările din sentințe."], "Sentința e un indicator imperfect.");
L("dist", "Schimbarea climatică și extremele", ["Cursul folosește clima ca exemplu pentru **valori extreme**.", "Nu te uiți doar la tendința centrală.", "Te uiți și la variabilitate și excepții."], "Tendință, variabilitate, excepții.");
L("dist", "Extincția în masă", ["Definiție: dispariția a **peste 70%** din specii într-o perioadă scurtă.", "Perioadă scurtă înseamnă **1–2 milioane de ani**.", "Avem date pe câteva sute de ani, deci **extrapolăm**."], "Problema: scale temporale diferite.");
L("cor", "Corelații de estimat", ["Vârsta și anul nașterii: aproape **−1**.", "Animale de companie și cod poștal: aproape **0**.", "Estimezi sensul și tăria înainte să calculezi."], "Sens, apoi tărie.");
L("cor", "Exemple de nori din Curs 04", ["PIB–speranța de viață: corelație **pozitivă**, PIB pe scară logaritmică.", "Speranța de viață–slujbe religioase: **negativă**.", "Rugăciune zilnică–PIB: asociere **neliniară**."], "Pearson subestimează relațiile curbe.");
L("cor", "Alcool, PIB și variabila de control", ["PIB-ul spune puțin despre consumul de alcool: corelație slabă.", "În afara țărilor cu majoritate musulmană, alcoolul crește cu PIB-ul.", "În țările cu majoritate musulmană rămâne aproape **zero**."], "Variabila de control separă grupurile.");
L("spss", "Biserică, gen, mediu: BCC 2012", ["Biserică–gen feminin: **.120\\*\\***, femeile merg ceva mai des.", "Biserică–vârstă: **.081\\*\\***, slabă.", "Biserică–mediu urban: **.009**, Sig. .676, fără asociere."], "Slab, dar semnificativ la N ≈ 2.358.");
L("spss", "Hipermarket: BCC 2012", ["Mediu urban: **.360\\*\\***, cea mai puternică.", "Vârstă: **−.298\\*\\***, vârstnicii merg mai rar.", "În cuplu: **.053**, semnificativ doar fiindcă N ≈ 2.360."], "Citești r întâi, apoi Sig.");
L("err", "Procesul A–C–B", ["Exemplul din curs: usturoiul purtat la gât și imunitatea.", "Te întrebi **prin ce variabilă trece** relația.", "Procesul A–C–B schimbă interpretarea corelației A–B."], "Corect din rațiuni false.");
L("err", "Pirateria și încălzirea globală", ["Corelează în timp.", "Curs 04 o tratează la **cauzalitate iluzorie**.", "Două serii care evoluează în timp pot corela fără să se producă una pe alta."], "Corelație în timp ≠ cauză.");
L("err", "Ore de muncă și PIB", ["Unde se muncește mai mult, PIB-ul pe locuitor e mai mic.", "Punctele sunt **țări**.", "Nu rezultă că indivizii care muncesc mai mult câștigă mai puțin."], "Eroare ecologică.");
L("err", "Viteza de tastare: două niveluri", ["Între persoane: cine tastează mai repede face **mai puține** greșeli.", "La aceeași persoană: mai repede înseamnă **mai multe** greșeli.", "Relația se inversează la schimbarea nivelului."], "Între persoane vs. în interiorul persoanei.");
L("err", "Modelul de mediere", ["Exemplu: cunoștințe → atitudini → consum.", "Efectul direct: **c′**.", "Efectul care trece prin variabila intermediară: **a × b**."], "Direct: c′. Indirect: a × b.");
L("err", "Niveluri care concordă: venit și fericire", ["Între țări: venit mai mare, fericire mai mare.", "În interiorul fiecărei țări: la fel.", "Relațiile de pe niveluri pot și să **concorde**."], "Se verifică separat fiecare nivel.");
L("err", "Nobel: alte corelații", ["Nobel–publicații: **0,71**. Nobel–cercetare: **0,69**.", "Nobel–cacao: **0,51**.", "Cacao–PIB: **0,78**."], "Activitatea științifică explică mai bine.");
L("esa", "Reprezentativitatea Twitter", ["O companie promite o audiență „reprezentativă”.", "Întrebarea: utilizatorii Twitter sunt reprezentativi pentru populație?", "Mult volum de date nu garantează reprezentativitate."], "Volum mare ≠ reprezentativ.");
L("esa", "Sondajele din SUA, 2016 și 2020", ["Au subestimat republicanii în **aceleași state**.", "Mai ales unde sunt mulți alegători albi fără studii superioare.", "Este o **eroare sistematică de eșantionare**."], "Aceeași direcție de două ori.");
L("esa", "Cadrul de eșantionare", ["Contează cine lipsește din lista din care extragi.", "Sondajele nu includ oameni din **spitale, închisori, mănăstiri**.", "Rezultatul descrie doar populația acoperită."], "Cine lipsește din cadru?");
L("esa", "p, Sig. și pragurile", ["**p** și **Sig.** sunt sinonime.", "p se mai numește „probabilitatea de eroare”.", "Prag obișnuit: 5%. Domenii stricte: **1% sau 1‰**."], "Sig. < 0,05 = semnificativ.");
L("fac", "Reducerea dimensionalității: utilizări", ["Compresia datelor și descoperirea structurilor.", "Eliminarea erorilor de măsurare.", "Vizualizare și date pentru antrenarea altor modele."], "Mai puține dimensiuni, aceeași structură.");
L("fac", "Bunăstarea autoevaluată: PCA", ["Trei indicatori: satisfacție, fericire, sănătate.", "O singură componentă peste 1: **1,98**, explică **66%**.", "Încărcări: 0,79, 0,86, 0,78."], "Un factor comun.");
L("fac", "AI și munca: doi factori", ["9 itemi, Eurobarometru 2024.", "Valori proprii **2,85** și **2,23**, împreună **56%** din variație.", "**AI e util** și **AI e dăunător** aproape nu corelează: 0,015."], "Beneficii și riscuri sunt dimensiuni separate.");
L("fac", "Itemul ambivalent", ["„Cere gestionare atentă” corelează cu ambii factori.", ".396 cu AI e util.", ".479 cu AI e dăunător."], "Un item poate încărca pe doi factori.");
L("fac", "Consum cultural: trei factori", ["Valori proprii **4,75**, **1,40**, **1,17**: 52% din variație.", "Prima componentă: toate activitățile, mai puțin biserica.", "A treia e dominată de **biserică** (0,71)."], "Biserica nu corelează cu celelalte.");
L("fac", "EVS: patru factori despre căsătorie", ["**Similaritate**: mediu, religie, politică.", "**Intimitate**: locuit singuri, relație sexuală, treburi.", "**Familia tradițională**: fidelitate, copii. **Banii NU contează**: venit, locuință."], "Patru factori din 10 itemi.");
L("fac", "Jocuri video: două axe", ["417 studenți norvegieni, 64 de serii de jocuri.", "Jocurile menționate împreună apar aproape.", "Axe: **inclusiv/exclusiv** și **mainstream/nișă**."], "Reducerea dimensionalității poziționează jocurile.");
L("fac", "Big Five și singurătatea", ["Extraversie **−0,37**, agreabilitate **−0,24**.", "Conștiinciozitate **−0,20**, deschidere **−0,11**.", "Nevrotism **+0,36**."], "Meta-analiza Buecker, 2020.");
L("clu", "AI și munca: patru tipuri", ["Agreabili **42%**, de acord cu aproape tot.", "Dezacord **12%**, scoruri în jur de 2.", "Optimiști **22%**, Pesimiști **24%**."], "Citești mediile pe coloane.");
L("clu", "Tipurile pe țări", ["Optimiștii: mai frecvenți în nordul Europei, până la **54%**.", "Pesimiștii: Franța, Grecia, Cipru, până la **38%**.", "Ponderea tipurilor se poate compara între țări."], "Tip × țară.");
L("clu", "Tipuri de jucători", ["Nintendos: Zelda **53%**, Super Mario **42%**.", "Lads: **4%** femei, **47%** joacă cel puțin 5 zile pe săptămână.", "Casuals: **69%** femei."], "Clusterul grupează respondenți.");
L("clu", "Tipurile EVS despre căsătorie", ["România: domină „Totul contează”, **47%**.", "Franța: domină cuplul cu copii, familie nucleară, **40%**.", "Tipul 3: copiii au doar 0,64."], "Compari ponderile între țări.");
L("clu", "Profilurile din „Relații de succes”", ["Familie extinsă **19%**: socri 0,3, locuință 0,4.", "Parteneri egali **30%**: acord politic 1,7, copii 0,1.", "Cuplu fără copii **26%**: socri 1,9. Totul contează **26%**: copii, religie, mediu 1,3."], "Fidelitatea e mare la toate tipurile.");
L("clu", "Profil socio-demografic al tipurilor", ["Totul contează: religiozitate **3,2**, cea mai mare.", "Femei: Familie extinsă **22%**, Parteneri egali **58%**.", "Vârsta medie: între 21,5 și 24,8."], "Variabilele externe se compară ulterior.");
L("clu", "Tipurile pe loturi", ["Socio 2025: **55%** Parteneri egali.", "Socio 2022: **38%** Totul contează, **36%** Cuplu fără copii.", "ACS 2026: **37%** Totul contează."], "Alt lot, alt tip dominant.");
L("reg", "Obiectivele tehnicilor de analiză", ["**Explorare**: frecvențe, medii, corelații. **Măsurare**: factorială.", "**Clasificare**: cluster.", "**Explicare**: regresie, rețea. **Extrapolare**: serii de timp."], "Scop → tehnică.");
L("reg", "Regresia ca bază a predicției", ["Estimezi modelul pe date.", "Anticipezi Y necunoscut când știi valorile X.", "Funcția poate fi liniară, polinomială, exponențială."], "Regresie → predicție.");
L("reg", "Predictorii opiniilor despre AI", ["„Vocea mea contează”: **0,187**, cel mai puternic pentru AI util.", "R²: **11,1%** la AI util.", "R²: **1,4%** la AI dăunător."], "Modelele explică puțin din variație.");
L("reg", "Predictorii teoriilor EVS", ["Vârsta este cel mai puternic predictor.", "Pozitiv: similaritate **0,220**, familie tradițională **0,105**.", "Negativ: intimitate **−0,195**, banii nu contează **−0,143**."], "Gen și localitate sunt controlate.");
L("reg", "Gen și religiozitate: căi cu semne opuse", ["Gen feminin–acord: r = **0,15**.", "La aceeași religiozitate: β = **0,20**.", "Femeile sunt mai religioase, iar religiozitatea scade acordul."], "Coeficientul crește după control.");
L("reg", "Educație și religiozitate: căi cu același sens", ["Educație–acord: r = **0,21**.", "La aceeași religiozitate: β = **0,12**.", "Cei educați sunt mai puțin religioși, ceea ce adaugă la corelație."], "Coeficientul scade după control.");
L("ret", "Autocorelația", ["În ce măsură suntem influențați de cei similari.", "Sau de **noi înșine în trecut**.", "Exemple: orașe vecine, căsătorii între familii, tendințe inerțiale."], "Asemănare în rețea sau în timp.");
L("ret", "Proprietățile rețelei", ["**Densitatea** și homofilia sunt proprietăți ale rețelei.", "Filter bubble este legată de homofilie.", "Se pot identifica **clustere de noduri** după interconectivitate."], "Rețea, noduri, clustere.");
L("ret", "VOSviewer: co-ocurență", ["Harta cuvintelor-cheie din articole.", "Mărimea punctului arată **frecvența**.", "Culorile grupează cuvintele care apar des **împreună**."], "Co-ocurență = apar împreună.");
L("ret", "Star Wars în analiza de rețea", ["Episodul VII: Finn, Han, Rey și Chewbacca sunt centrali.", "Personaje feminine/masculine: **1 la 10** în 1977.", "**6 la 8** în 2018."], "Centralitate = relevanță în rețea.");
L("ret", "Boți și știri false", ["Noduri: conturi Twitter. Legături: retweeturi.", "Mărimea nodului: de câte ori a fost retweetat.", "Culoarea: scorul de bot."], "Influență și bot score.");
L("ret", "Prognoza cu serii de timp", ["Prezice valori numerice continue.", "Combină cicluri, tendințe și **cauze externe**.", "Exemple: gradele de mâine, prețul Bitcoin."], "Temporal + factori externi.");
L("ret", "Căsătorii și divorțuri în timp", ["Căsătoriile la 1.000 de locuitori scad pe termen lung.", "SUA: divorțurile urcă la 5,3 în jur de 1980, apoi scad la 2,9.", "România 1967: prăbușire prin **restricționarea legală a divorțului**."], "Cauză externă în serie.");
L("ret", "Vârsta femeilor la căsătorie", ["Crește peste tot.", "România: de la **22 la 27** ani (1990–2017).", "Franța: de la **28 la 32** ani."], "Tendință de durată.");
L("ret", "Rate cumulative", ["Fiecare curbă este o generație de căsătorii.", "Ponderea celor încheiate prin divorț crește cu anii.", "Cifrele cumulative se schimbă **lent**."], "Cumulative = mai stabile.");
L("caz", "Venit și divorț", ["Ponderea divorțaților scade de la circa **43%** la circa **30%**.", "Până pe la 100.000 USD pe an.", "Categoriile cu venit mare au puțini indivizi și variabilitate mare."], "Puține cazuri → mai multă variabilitate.");
L("caz", "Loturile din „Relații de succes”", ["Șase loturi, **N = 245**, 2022–2026.", "Femei: 20–38% la ACS, 74–85% la Sociologie.", "Eșantion de **disponibilitate**."], "Corelațiile descriu acești respondenți.");
L("caz", "Studenți vs. EVS", ["Copii: **0,8** la ACS 2026, **1,5** în EVS.", "Treburi: **1,7** vs. **1,1**.", "Acord politic: **1,1** vs. **0,5**."], "Scala 0–2.");
L("caz", "Religie și politică: EVS vs. studenți", ["Religie–acord politic: **0,32** în EVS.", "La studenți: **0,10**.", "Venit–locuință: 0,45 în EVS, **0,66** la studenți."], "Compari aceeași pereche.");
L("caz", "Religiozitate și copii", ["Copii măcar „destul” de importanți: **29%** la religiozitate mică.", "**73%** la religiozitate mare.", "Religiozitate–copii: r = **0,39**."], "Asociere, nu cauză.");
L("caz", "Vârstă sau generație", ["Datele sunt dintr-un **singur moment**.", "Nu putem separa vârsta de generație.", "Tineri–vârstnici: 13–14 puncte. Suedia–România: 64–66 puncte."], "Țara diferențiază mai mult.");
L("caz", "Justificarea homosexualității în timp", ["Scală 1–10, alt indicator decât cel despre părinți.", "Suedia: de la 4,5 la **8,7**. România: de la 1,5 la **2,3**.", "Distanța: de la 3 la **6 puncte**."], "Țările s-au îndepărtat.");
L("caz", "Metode: beneficii și riscuri (1)", ["Indicatori: fac vizibil un fenomen, dar pot măsura și altceva.", "Frecvențe: arată consensul, dar o valoare greșită schimbă rezultatul.", "Corelație: arată asocierea, dar amestecă mai multe căi."], "Fiecare metodă are limite.");
L("caz", "Metode: beneficii și riscuri (2)", ["Factorială: rezumă indicatori, dar numărul și numele factorilor sunt decizii.", "Regresie: separă efecte, dar o variabilă în plus schimbă coeficienții.", "Cluster: arată tipuri, dar trebuie ales numărul de grupuri."], "Deciziile analistului contează.");
L("c1", "Ce este o știință", ["Studiul prin **metode falsificabile** al unei forme de ordine a lumii.", "Științe ale naturii, ale minții, ale creațiilor oamenilor.", "Din acest punct de vedere, matematica nu e știință."], "Falsificabil.");
L("c1", "Ce sunt patternurile", ["Distribuții, tendințe, asocieri și corelații.", "Dimensiuni, inegalități.", "Estimări cauzale, categorii."], "Statistica dă vocabularul DS.");
L("c1", "Abilități în știința datelor", ["**Design-ul cercetării**: întrebări, colectare, model.", "**Automatizare**: programare, procesare.", "**Comunicare**: diagnoză, decizie, beneficiari."], "Trei grupe de abilități.");
L("c1", "Șase logici ale dovezilor", ["Demonstrație: matematică. Experiment: științe naturale.", "Compromis: inginerie, medicină. Interpretare: științe sociale, umanioare.", "Procedură: drept, jurnalism. Persuasiune: marketing."], "O hartă, nu o ierarhie.");
L("c1", "Cinci dimensiuni de comparație", ["Perisabilitatea faptelor. Reflexivitatea.", "Tipul de incertitudine.", "Garanțiile instituționale. Tipurile de raționament."], "Cinci criterii.");
L("c1", "Logica demonstrației", ["O demonstrație validă **nu expiră**.", "Conjectura numerelor prime gemene e verificată pe trilioane de cazuri.", "Totuși, rămâne **nedemonstrată**."], "Testarea nu înlocuiește demonstrația.");
L("c1", "Logica experimentului", ["Fizică: legi universale, replicare prin măsurare precisă.", "Biologie: mecanisme stabile în cadrul speciilor.", "Dovada: experiment, măsurare, replicare."], "Aceeași logică, altă complexitate.");
L("c1", "Logica compromisului necesar", ["Inginerie: optimizare sub constrângeri, cost, siguranță, timp.", "Medicină: judecată clinică, cunoștințe aplicate individual.", "Garanții: licențiere, reglementări, răspundere."], "Decizii sub incertitudine.");
L("c1", "Logica interpretării", ["Științe sociale: pluralism metodologic, reflexivitate ridicată.", "Psihologie de profunzime: studii de caz, transfer.", "Umanioare: lectură atentă, arhive, sens."], "Rigoare în interpretare.");
L("c1", "Logica procedurii", ["Drept: argumentare în contradictoriu, reguli ale probelor.", "Jurnalism: mai multe surse, fact-checking, corectări.", "Produc judecăți prin reguli procedurale, nu măsurători."], "Procedură, nu măsurătoare.");
L("c1", "Common law vs. drept civil", ["Common law: procedură adversarială, precedent obligatoriu.", "Drept civil: judecător anchetator, reguli codificate.", "România e la **drept civil**; datele IA sunt dominate de common law."], "Risc pentru avocații români.");
L("c1", "Regulamentul UE privind IA", ["**Inacceptabil**: scoring social. **Ridicat**: angajare, credit.", "**Limitat**: chatboți, deepfake.", "**Minim**: filtre spam, jocuri video."], "Patru niveluri de risc.");
L("c1", "Logica persuasiunii", ["Dovada este **eficacitatea**: produce acțiunea dorită.", "Exemplu: testare A/B.", "Garanții instituționale slabe."], "Marketing = ce funcționează acum.");
L("c1", "Experimentul Facebook", ["**689.003** utilizatori, o săptămână, ianuarie 2012.", "Fluxuri manipulate fără consimțământ.", "Cei cu mai puține postări pozitive au scris mai multe postări negative."], "Contagiune emoțională.");
L("c1", "Profeții auto-împlinite", ["Recesiune prevăzută: firmele concediază preventiv.", "Sondaje: susținătorii candidatului din față pot să nu mai voteze.", "Teoria etichetării: copiii cresc conform așteptărilor."], "Predicția schimbă rezultatul.");
L("c1", "Chatboți ca terapeuți", ["Terapia cere alianță terapeutică, evaluare clinică, supervizare.", "Chatboții oferă vocabular cu sunet terapeutic.", "Fără relație, obligație de îngrijire, confidențialitate sau recunoașterea crizei."], "Vulnerabilitate reală.");
L("c1", "De ce e greu de detectat contaminarea", ["Fluența maschează amestecul.", "Lipsesc marcajele de logică a dovezilor.", "Orbire trans-domeniu și dezechilibre în datele de antrenament."], "Patru motive.");
L("c1", "Modele specializate: trei niveluri", ["Nivel 1: doar date de specialitate, evită contaminarea.", "Nivel 2: model general ajustat fin, reduce contaminarea.", "Nivel 3: model general RLHF, ajustează comportamentul."], "Doar nivelul 1 o evită prin construcție.");
L("c1", "Boeing 737 MAX", ["Două prăbușiri, **346 de morți**, sistemul MCAS.", "Promisiunea: MAX zboară „la fel” ca modelele anterioare.", "Logica profitului a constrâns deciziile tehnice."], "Conflict de logici ale dovezilor.");
L("c1", "Semmelweis, Viena 1847", ["Clinica cu medici: **18%** mortalitate. Cu moașe: **2%**.", "Spălarea mâinilor cu clor: sub **2%** în două luni.", "A fost respins: lipsea explicația teoretică, medicii s-au simțit insultați."], "Dovada a fost ignorată 20 de ani.");
L("c1", "Medicina: logica lui „depinde”", ["Efectul **placebo** și efectul **nocebo**, boli psihosomatice.", "Medicina bazată pe dovezi: protocoale de îngrijire.", "Specializarea strictă poate da viziune de tunel."], "Multiple interacțiuni corp–minte.");

// Lecțiile merg pe capitole, în ordinea cursului.
(function () {
  const order = ["mas", "dist", "cor", "spss", "err", "esa", "fac", "clu", "reg", "ret", "gra", "caz", "c1"];
  REELS.sort((a, b) => order.indexOf(a.t) - order.indexOf(b.t));
})();
