// Testul în formatul din curs: aceleași tipuri de tabele și grafice, cu valori noi.
EXHIBITS.tc_corr = corr("Correlations (Barometru de consum cultural, date fictive)",
  ["C2_3", "I1. Genul", "Mediu de rezidență", "I2. Vârsta"],
  [".164**", ".221**", "-.047*", ".012", ".081**", "-.076**"],
  [".000", ".000", ".023", ".559", ".000", ".000"],
  [2352, 2352, 2352, 2371, 2371, 2371],
  [2352, 2371, 2371, 2371],
  "C2_3 = De obicei, cât de des citiți cărți? (1 Deloc … 5 Zilnic). I1. Genul: 0 Masculin, 1 Feminin. Mediu de rezidență: 0 Rural, 1 Urban.");
EXHIBITS.tc_ct = table("C2_3 × Mediu de rezidență Crosstabulation (% within Mediu de rezidență)",
  ["C2_3", "0 Rural", "1 Urban", "Total"],
  [["1 Deloc", "41.2%", "24.6%", "31.7%"], ["2 Mai rar", "27.5%", "26.1%", "26.7%"], ["3 De câteva ori pe lună", "19.8%", "27.4%", "24.1%"], ["4 De câteva ori pe săptămână", "9.1%", "16.8%", "13.5%"], ["5 Zilnic", "2.4%", "5.1%", "3.9%"], ["Total", "100.0%", "100.0%", "100.0%"]]);
EXHIBITS.tc_tve = table("Total Variance Explained (9 itemi despre încredere)",
  ["Component", "Initial Eigenvalues Total", "% of Variance", "Cumulative %"],
  [["1", "3.12", "34.7", "34.7"], ["2", "1.86", "20.7", "55.3"], ["3", "1.08", "12.0", "67.3"], ["4", ".78", "8.7", "76.0"], ["5", ".62", "6.9", "82.9"], ["6", ".51", "5.7", "88.6"], ["7", ".42", "4.7", "93.2"], ["8", ".35", "3.9", "97.1"], ["9", ".26", "2.9", "100.0"]],
  "Extraction Method: Principal Component Analysis.");
EXHIBITS.tc_scree = { type: "line", title: "Scree Plot", yl: "Eigenvalue", xr: [1, 9, 1], yr: [0, 3.5, .5],
  series: [{ n: "Eigenvalue pe componentă (axa orizontală: Component Number)", d: [[1, 3.12], [2, 1.86], [3, 1.08], [4, .78], [5, .62], [6, .51], [7, .42], [8, .35], [9, .26]], m: "c" }],
  note: "Aceleași valori ca în tabelul Total Variance Explained." };
EXHIBITS.tc_sm = table("Structure Matrix",
  ["Item", "Component 1", "Component 2"],
  [["Încredere în parlament", ".812", ".104"], ["Încredere în guvern", ".786", ".152"], ["Încredere în partide", ".741", ".031"], ["Corupția este o problemă gravă", "-.682", "-.095"], ["Încredere în poliție", ".128", ".803"], ["Încredere în armată", ".066", ".777"], ["Încredere în justiție", ".209", ".694"], ["Încredere în presă", ".452", ".418"]],
  "Extraction Method: Principal Component Analysis. Rotation Method: Oblimin.");
EXHIBITS.tc_km = table("K-means: profilul tipurilor (munca de acasă, scala 1–4)",
  ["", "Cluster 1", "Cluster 2", "Cluster 3"],
  [["Total membri (%)", "38%", "27%", "35%"], ["Lucrez mai productiv acasă", "3.41", "1.62", "2.95"], ["Am program mai flexibil", "3.58", "1.88", "3.44"], ["Mă simt izolat", "1.72", "3.21", "3.05"], ["Economisesc bani", "3.35", "2.04", "3.12"], ["Am nevoie de birou", "1.94", "3.46", "2.10"]],
  "1 = total dezacord … 4 = total acord.");
EXHIBITS.tc_reg = table("Predictorii încrederii în știință și ai temerii de tehnologie (Beta, Sig.)",
  ["", "Știință Beta", "Sig.", "Teamă Beta", "Sig."],
  [["Gender (0=Man, 1=Woman)", "-0.031", "0.012", "0.062", "0.000"], ["Age", "-0.094", "0.000", "0.088", "0.000"], ["Education (1–8)", "0.241", "0.000", "-0.041", "0.003"], ["Internet use (1–7)", "0.126", "0.000", "0.019", "0.162"], ["R Square", "14.2%", "", "2.1%", ""]],
  "Regresie liniară, coeficienți standardizați.");
EXHIBITS.tc_cr = table("Corelație și regresie (acordul cu o afirmație, cinci țări)",
  ["Predictor", "Corelație, r", "Beta fără țară", "Beta cu țară"],
  [["Religiozitate", "-0.38", "-0.36", "-0.18"], ["Gen feminin", "0.09", "0.14", "0.12"], ["Educație", "0.25", "0.15", "0.11"], ["R²", "", "21%", "33%"]],
  "Scor mai mare = mai mult acord.");

const TC_START = Q.length;
q("spss", "Test format curs", "Care variabilă corelează cel mai puternic cu C2_3 (cât de des citesc)?", ["Mediu de rezidență", "I1. Genul", "I2. Vârsta", "toate au aceeași intensitate"], "Pe rândul C2_3: .164, .221, −.047. Cea mai mare în valoare absolută este .221.", "tc_corr");
q("spss", "Test format curs", "Cum citești C2_3 – I1. Genul (.164**)?", ["femeile citesc ceva mai des, relație slabă, semnificativă", "bărbații citesc mai des, relație puternică", "16,4% dintre femei citesc zilnic", "genul nu are legătură cu cititul"], "Genul e codat 1 = feminin, iar r e pozitiv. 0,164 este slab, iar ** arată că e semnificativ.", "tc_corr");
q("spss", "Test format curs", "C2_3 – I2. Vârsta are −.047* și Sig. .023. Ce e corect?", ["semnificativă la 0,05, dar foarte slabă", "semnificativă la 0,01", "nesemnificativă", "puternică, pentru că are steluță"], "0,023 este sub 0,05, dar peste 0,01. Cu N = 2352, și o corelație foarte slabă devine semnificativă.", "tc_corr");
q("spss", "Test format curs", "I1. Genul – Mediu de rezidență (.012, Sig. .559). Ce înseamnă?", ["practic nicio asociere liniară, nesemnificativă", "asociere puternică", "femeile locuiesc mai ales la oraș", "asociere semnificativă la 0,05"], "r e aproape 0, iar Sig. 0,559 e mult peste 0,05.", "tc_corr");
q("spss", "Test format curs", "Mediu de rezidență – I2. Vârsta este −.076**. Cu codarea 0 Rural, 1 Urban:", ["orășenii sunt, în medie, puțin mai tineri", "orășenii sunt, în medie, mult mai în vârstă", "sătenii sunt mai tineri", "nu există diferență de vârstă"], "Urban = 1, iar r e negativ: valoarea 1 merge cu vârste mai mici. Relație slabă.", "tc_corr");
q("cor", "Test format curs", "Ce procent dintre cei din mediul urban citesc „De câteva ori pe săptămână”?", ["16.8%", "9.1%", "13.5%", "27.4%"], "% within Mediu de rezidență: procentele sunt pe coloane. Coloana 1 Urban, rândul 4.", "tc_ct");
q("cor", "Test format curs", "Ce arată compararea coloanelor Rural și Urban?", ["cititul e asociat cu mediul: orășenii citesc mai des", "nu există asociere, procentele sunt egale", "mediul urban produce cititul", "sătenii citesc mai des"], "„Deloc”: 41.2% rural față de 24.6% urban. Procentele diferă clar, deci există asociere, dar nu cauză.", "tc_ct");
q("fac", "Test format curs", "Câte componente păstrezi după regula Kaiser?", ["3", "2", "4", "9"], "Eigenvalue peste 1: 3.12, 1.86, 1.08. Componenta 4 are .78.", "tc_tve");
q("fac", "Test format curs", "Ce procent din variație explică împreună componentele păstrate?", ["67.3%", "55.3%", "12.0%", "76.0%"], "Cumulative % la componenta 3.", "tc_tve");
q("fac", "Test format curs", "Cât explică doar componenta 2?", ["20.7%", "55.3%", "1.86%", "34.7%"], "Coloana % of Variance. 55.3% este suma cumulată.", "tc_tve");
q("fac", "Test format curs", "Ce arată scree plot-ul?", ["curba coboară abrupt până la componenta 3, apoi se aplatizează: păstrezi 3", "curba crește constant: păstrezi 9", "toate componentele au aceeași valoare", "păstrezi doar componentele de după aplatizare"], "Păstrezi componentele dinainte de punctul unde curba se aplatizează.", "tc_scree");
q("fac", "Test format curs", "Ce itemi formează Component 2?", ["poliție, armată, justiție", "parlament, guvern, partide", "presă, corupție, guvern", "toți itemii"], "Coloana Component 2: .803, .777, .694.", "tc_sm");
q("fac", "Test format curs", "Ce item corelează cu ambele componente?", ["Încredere în presă", "Încredere în parlament", "Încredere în armată", "Încredere în partide"], "Presa are .452 și .418.", "tc_sm");
q("fac", "Test format curs", "„Corupția este o problemă gravă” are −.682 pe Component 1. Ce înseamnă un scor mare la Component 1?", ["încredere mare în politică și corupția văzută ca mai puțin gravă", "corupția văzută ca foarte gravă", "neîncredere în toate instituțiile", "încredere mare în armată"], "Semnul minus: scor mare la componentă înseamnă scor mic la acest item.", "tc_sm");
q("clu", "Test format curs", "Care tip preferă clar munca la birou?", ["Cluster 2", "Cluster 1", "Cluster 3", "niciunul"], "Cluster 2: productivitate acasă 1.62, nevoie de birou 3.46, izolare 3.21.", "tc_km");
q("clu", "Test format curs", "Cum descrii Cluster 3?", ["îi place flexibilitatea muncii de acasă, dar se simte izolat", "respinge munca de acasă", "se simte izolat și nu are program flexibil", "e identic cu Cluster 1"], "Cluster 3: flexibil 3.44, dar izolare 3.05. Cluster 1 are izolare 1.72.", "tc_km");
q("clu", "Test format curs", "Ce criteriu deosebește cel mai puțin tipurile?", ["Economisesc bani", "Lucrez mai productiv acasă", "Am program mai flexibil", "Am nevoie de birou"], "Diferența max − min: economisesc bani 3.35 − 2.04 = 1.31, cea mai mică.", "tc_km");
q("clu", "Test format curs", "Ce procent dintre respondenți sunt în Cluster 3?", ["35%", "38%", "27%", "3.05%"], "Rândul „Total membri (%)”.", "tc_km");
q("reg", "Test format curs", "Ce predictor are cea mai puternică legătură cu încrederea în știință, la ceilalți constanți?", ["Education", "Gender", "Age", "Internet use"], "Compari Beta în valoare absolută: Education 0.241.", "tc_reg");
q("reg", "Test format curs", "Câți predictori NU sunt semnificativi la 0,05 pentru teama de tehnologie?", ["unul", "niciunul", "doi", "toți"], "Doar Internet use are Sig. 0.162.", "tc_reg");
q("reg", "Test format curs", "Ce înseamnă R Square = 2.1% la teama de tehnologie?", ["modelul explică foarte puțin din variația temerii", "doar 2,1% dintre oameni se tem", "corelația este 0,021", "Sig. este 0,021"], "R² este proporția din variația variabilei dependente explicată de model.", "tc_reg");
q("reg", "Test format curs", "Ce s-a întâmplat cu religiozitatea când am adăugat țara în model?", ["Beta a scăzut de la −0,36 la −0,18: o parte din efect era diferența dintre țări", "Beta a crescut, deci religiozitatea contează mai mult", "corelația a devenit pozitivă", "R² a scăzut"], "Variabila omisă era țara. Cu țara controlată, efectul se înjumătățește.", "tc_cr");
q("reg", "Test format curs", "Educația: r = 0,25, dar Beta fără țară = 0,15. De ce scade?", ["o parte din legătură trece prin alte variabile din model, de exemplu religiozitatea", "regresia e calculată greșit", "educația nu are legătură cu acordul", "pentru că R² este 21%"], "Corelația simplă adună toate căile. Regresia ține ceilalți predictori constanți.", "tc_cr");
const TC_IDS = Q.slice(TC_START).map(o => o.id);
