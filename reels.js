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
