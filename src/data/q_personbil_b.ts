export const personbilBData = {
  themes: {
    no: {
      'Trafikkregler': 'Trafikkregler og vikeplikt',
      'Skilt': 'Trafikkskilt',
      'Sikkerhet': 'Sikkerhet',
    },
    en: {
      'Trafikkregler': 'Traffic rules',
      'Skilt': 'Traffic signs',
      'Sikkerhet': 'Safety',
    },
    ar: {
      'Trafikkregler': 'قواعد المرور',
      'Skilt': 'علامات المرور',
      'Sikkerhet': 'سلامة',
    },
    pl: {
      'Trafikkregler': 'Zasady ruchu drogowego',
      'Skilt': 'Znaki drogowe',
      'Sikkerhet': 'Bezpieczeństwo',
    }
  },
  q: [
    {
      sourceTitle: "Statens vegvesen",
      difficulty: "easy",
      image: "https://placehold.co/400x300/1e293b/cbd5e1?text=Vikeplikt",
      imageAlt: "Vikeplikt sign / Yield sign",
      no: {
        t: "Trafikkregler",
        q: "Hva betyr høyreregelen?",
        o: [
           "Du har vikeplikt for trafikk fra høyre",
           "Du har forkjørsrett hvis du svinger til høyre",
           "Trafikk fra venstre må vike for deg, men du kan overse trafikk fra høyre",
           "Gjelder kun på motorvei"
        ],
        c: 0,
        e: "Høyreregelen er en grunnleggende vikepliktsregel som sier at du har vikeplikt for kjøretøy som kommer fra din høyre side, med mindre annet er skiltet."
      },
      en: {
        t: "Traffic rules",
        q: "What does the right-hand rule mean?",
        o: [
           "You must yield to traffic from the right",
           "You have right of way if turning right",
           "Traffic from left must yield, but you can ignore traffic from right",
           "Only applies on highways"
        ],
        c: 0,
        e: "The right-hand rule requires you to yield to vehicles approaching from your right unless signs indicate otherwise."
      },
      ar: {
        t: "قواعد المرور",
        q: "ماذا تعني قاعدة اليمين؟",
        o: [
           "يجب أن تعطي الأولوية للمرور القادم من اليمين",
           "لك حق الأولوية إذا كنت تنعطف يميناً",
           "المرور من اليسار يجب أن يعطيك الأولوية",
           "تنطبق فقط على الطرق السريعة"
        ],
        c: 0,
        e: "قاعدة اليمين تتطلب منك إعطاء الأولوية للمركبات القادمة من يمينك ما لم توضح اللافتات عكس ذلك."
      },
      pl: {
        t: "Zasady ruchu drogowego",
        q: "Co oznacza reguła prawej ręki?",
        o: [
           "Musisz ustąpić pierwszeństwa pojazdom z prawej strony",
           "Masz pierwszeństwo, jeśli skręcasz w prawo",
           "Ruch z lewej musi ustąpić, ale możesz zignorować ruch z prawej",
           "Dotyczy tylko autostrad"
        ],
        c: 0,
        e: "Reguła prawej ręki wymaga ustąpienia pierwszeństwa pojazdom nadjeżdżającym z prawej strony, o ile znaki nie stanowią inaczej."
      }
    },
    {
      sourceTitle: "Statens vegvesen",
      difficulty: "medium",
      image: "https://placehold.co/400x300/1e293b/cbd5e1?text=Gangfelt",
      imageAlt: "Pedestrian crossing / Fotgjengerfelt",
      no: {
        t: "Trafikkregler",
        q: "Hvordan skal du forholde deg til en fotgjenger som står og venter ved et fotgjengerfelt uten lysregulering?",
        o: [
           "Du må stoppe og la fotgjengeren krysse veien",
           "Du kan kjøre forbi hvis du holder lav fart",
           "Du har vikeplikt kun hvis fotgjengeren allerede er i veibanen",
           "Du må bruke hornet for å advare"
        ],
        c: 0,
        e: "Du har alltid vikeplikt for gående som befinner seg i, eller er på vei ut i, et gangfelt uten lysregulering."
      },
      en: {
        t: "Traffic rules",
        q: "How should you react to a pedestrian waiting at an uncontrolled pedestrian crossing?",
        o: [
           "You must stop and let the pedestrian cross",
           "You can drive past if you keep a low speed",
           "You only yield if the pedestrian is already on the road",
           "You must use the horn to warn them"
        ],
        c: 0,
        e: "You must always yield to pedestrians who are in, or are about to enter, an uncontrolled pedestrian crossing."
      },
      ar: {
        t: "قواعد المرور",
        q: "كيف يجب أن تتصرف تجاه مشاة ينتظرون عند ممر مشاة غير منظم بإشارات ضوئية؟",
        o: [
           "يجب أن تتوقف وتدع المشاة يعبرون",
           "يمكنك القيادة إذا حافظت على سرعة منخفضة",
           "تعطي الأولوية فقط إذا كان المشاة في الشارع بالفعل",
           "يجب أن تستخدم البوق لتحذيرهم"
        ],
        c: 0,
        e: "يجب عليك دائمًا إعطاء الأولوية للمشاة المتواجدين في ممر المشاة غير المنظم بإشارة ضوئية أو على وشك دخوله."
      },
      pl: {
        t: "Zasady ruchu drogowego",
        q: "Jak powinieneś się zachować wobec pieszego czekającego na przejściu bez sygnalizacji świetlnej?",
        o: [
           "Musisz się zatrzymać i pozwolić pieszemu przejść",
           "Możesz przejechać, jeśli dół utrzymasz niską prędkość",
           "Ustępujesz pierwszeństwa tylko wtedy, gdy pieszy jest już na drodze",
           "Musisz użyć klaksonu, aby go ostrzec"
        ],
        c: 0,
        e: "Musisz zawsze ustąpić pierwszeństwa pieszym, którzy znajdują się na przejściu bez sygnalizacji świetlnej lub wkraczają na nie."
      }
    },
    {
      sourceTitle: "Statens vegvesen",
      difficulty: "easy",
      no: {
        t: "Sikkerhet",
        q: "Hva er den viktigste funksjonen til bilbeltet?",
        o: [
           "Å holde deg fast i setet ved en bråstopp eller kollisjon",
           "Å forhindre at du får fartsbot",
           "Å holde deg varm om vinteren",
           "Å gjøre setet mer komfortabelt"
        ],
        c: 0,
        e: "Bilbeltets primære funksjon er å holde deg og passasjerene fast i setet ved bråbremsing eller ulykker, og er det viktigste sikkerhetsutstyret vi har i bilen."
      },
      en: {
        t: "Safety",
        q: "What is the most important function of the seatbelt?",
        o: [
           "To hold you in your seat during a sudden stop or collision",
           "To prevent you from getting a speeding ticket",
           "To keep you warm in winter",
           "To make the seat more comfortable"
        ],
        c: 0,
        e: "The primary function of the seatbelt is to hold you and your passengers securely in the seat during hard braking or crashes, making it the most critical safety device."
      },
      ar: {
        t: "سلامة",
        q: "ما هي الوظيفة الأهم لحزام الأمان؟",
        o: [
           "تثبيتك في المقعد أثناء التوقف المفاجئ أو الاصطدام",
           "منعك من الحصول على مخالفة سرعة",
           "إبقاؤك دافئاً في الشتاء",
           "جعل المقعد أكثر راحة"
        ],
        c: 0,
        e: "الوظيفة الأساسية لحزام الأمان هي تثبيتك وركابك بأمان في المقعد أثناء الكبح الشديد أو الحوادث، مما يجعله أهم جهاز للسلامة."
      },
      pl: {
        t: "Bezpieczeństwo",
        q: "Jaka jest najważniejsza funkcja pasa bezpieczeństwa?",
        o: [
           "Utrzymanie cię w fotelu podczas nagłego zatrzymania lub kolizji",
           "Zapobieganie otrzymaniu mandatu za przekroczenie prędkości",
           "Ogrzewanie zimą",
           "Zwiększenie wygody siedzenia"
        ],
        c: 0,
        e: "Podstawową funkcją pasa bezpieczeństwa jest bezpieczne utrzymanie ciebie i pasażerów w fotelu podczas ostrego hamowania lub wypadku, co czyni go najważniejszym urządzeniem bezpieczeństwa."
      }
    },
    {
      sourceTitle: "Statens vegvesen",
      difficulty: "medium",
      no: {
        t: "Skilt",
        q: "Hva betyr et trekantet skilt med rød kant og hvit bunn?",
        o: [
           "Fareskilt, som advarer om en fare lenger fremme",
           "Forbudsskilt, som forbyr en handling",
           "Vikepliktskilt",
           "Opplysningsskilt"
        ],
        c: 0,
        e: "Trekantete skilt med spissen opp, rød kant og hvit bunn er fareskilt som advarer om fare på den strekningen du kjører inn på."
      },
      en: {
        t: "Traffic signs",
        q: "What does a triangular sign with a red border and white background mean?",
        o: [
           "Warning sign, alerting you to a danger ahead",
           "Prohibition sign, forbidding an action",
           "Yield sign",
           "Information sign"
        ],
        c: 0,
        e: "Triangular signs pointing upwards with a red border are warning signs alerting to a hazard ahead."
      },
      ar: {
        t: "علامات المرور",
        q: "ماذا تعني لافتة مثلثة بحافة حمراء وخلفية بيضاء؟",
        o: [
           "لافتة تحذيرية من خطر قادم",
           "لافتة منع تحرم القيام بفعل معين",
           "لافتة إعطاء الأولوية",
           "لافتة معلومات"
        ],
        c: 0,
        e: "اللافتات المثلثة التي تشير لأعلى ذات الحدود الحمراء هي لافتات تحذيرية تنبه إلى وجود خطر."
      },
      pl: {
        t: "Znaki drogowe",
        q: "Co oznacza trójkątny znak z czerwoną obwódką i białym tłem?",
        o: [
           "Znak ostrzegawczy o niebezpieczeństwie z przodu",
           "Znak zakazu",
           "Znak ustąp pierwszeństwa",
           "Znak informacyjny"
        ],
        c: 0,
        e: "Trójkątne znaki wskazujące w górę z czerwoną obwódką to znaki ostrzegawcze przed zbliżającym się niebezpieczeństwem."
      }
    },
    {
      sourceTitle: "Statens vegvesen",
      difficulty: "hard",
      no: {
        t: "Trafikkregler",
        q: "Hvor nær et gangfelt er det forbudt å parkere?",
        o: [
           "Nærmere enn 5 meter foran gangfeltet",
           "Nærmere enn 5 meter etter gangfeltet",
           "Nærmere enn 10 meter foran og etter gangfeltet",
           "Helt inntil, så lenge motoren er i gang"
        ],
        c: 0,
        e: "Det er forbudt å stanse eller parkere helt fram til 5 meter foran et gangfelt for at fotgjengerne skal være synlige for andre bilister."
      },
      en: {
        t: "Traffic rules",
        q: "How close to a pedestrian crossing is it illegal to park?",
        o: [
           "Closer than 5 meters before the crossing",
           "Closer than 5 meters after the crossing",
           "Closer than 10 meters before and after",
           "Right next to it, as long as the engine is running"
        ],
        c: 0,
        e: "It is strictly to park closer than 5 meters prior to a pedestrian crossing to ensure pedestrians are visible to oncoming traffic."
      },
      ar: {
        t: "قواعد المرور",
        q: "ما هي المسافة الممنوع الوقوف خلالها قبل ممر المشاة؟",
        o: [
           "أقرب من 5 أمتار قبل ممر المشاة",
           "أقرب من 5 أمتار بعد ممر المشاة",
           "أقرب من 10 أمتار قبل وبعد الممر",
           "بجوار الممر طالما المحرك يعمل"
        ],
        c: 0,
        e: "يمنع الوقوف والتوقف على مسافة تقل عن 5 أمتار قبل ممر المشاة لضمان وضوح رؤية المشاة للسيارات القادمة."
      },
      pl: {
        t: "Zasady ruchu drogowego",
        q: "Jak blisko przejścia dla pieszych obowiązuje zakaz parkowania?",
        o: [
           "Bliżej niż 5 metrów przed przejściem",
           "Bliżej niż 5 metrów po przejściu",
           "Bliżej niż 10 metrów przed i po",
           "Tuż obok, dopóki silnik pracuje"
        ],
        c: 0,
        e: "Zatrzymywanie się i parkowanie w odległości mniejszej niż 5 metrów przed przejściem jest zabronione, aby piesi byli widoczni dla innych kierowców."
      }
    },
    {
      sourceTitle: "Statens vegvesen",
      difficulty: "medium",
      status: "review",
      no: {
        t: "Trafikkregler",
        q: "Hvilken regel gjelder for bruk av blinklys når du skal kjøre ut av en rundkjøring?",
        o: [
           "Du skal alltid blinke til høyre når du kjører ut av rundkjøringen",
           "Du trenger ikke blinke hvis det ikke er andre biler i nærheten",
           "Du skal blinke til venstre for å vise at du fortsetter i rundkjøringen",
           "Blinking i rundkjøring er kun en anbefaling, ikke et krav"
        ],
        c: 0,
        e: "Det er påbudt å gi tegn til høyre når du kjører ut av en rundkjøring, for å tydelig informere andre trafikanter og fotgjengere."
      },
      en: {
        t: "Traffic rules",
        q: "What is the rule for using turn signals when exiting a roundabout?",
        o: [
           "You must always signal right when exiting the roundabout",
           "You don't need to signal if there are no other cars nearby",
           "You must signal left to show you are continuing in the roundabout",
           "Signaling in a roundabout is only a recommendation, not a requirement"
        ],
        c: 0,
        e: "It is mandatory to signal right when exiting a roundabout to clearly inform other road users and pedestrians."
      },
      ar: {
        t: "قواعد المرور",
        q: "ما هي قاعدة استخدام إشارات الانعطاف عند الخروج من الدوار؟",
        o: [
           "يجب عليك دائمًا الإشارة يمينًا عند الخروج من الدوار",
           "لا تحتاج إلى الإشارة إذا لم تكن هناك سيارات أخرى قريبة",
           "يجب الإشارة يسارًا للإشارة إلى استمرارك في الدوار",
           "الإشارة في الدوار مجرد توصية، وليست إلزامية"
        ],
        c: 0,
        e: "من الإلزامي إعطاء إشارة لليمين عند الخروج من الدوار لإبلاغ مستخدمي الطريق والمشاة بوضوح."
      },
      pl: {
        t: "Zasady ruchu drogowego",
        q: "Jaka jest zasada używania kierunkowskazów podczas zjeżdżania z ronda?",
        o: [
           "Musisz zawsze włączyć prawy kierunkowskaz podczas zjeżdżania z ronda",
           "Nie musisz sygnalizować, jeśli w pobliżu nie ma innych samochodów",
           "Musisz włączyć lewy kierunkowskaz, aby pokazać, że kontynuujesz jazdę po rondzie",
           "Sygnalizacja na rondzie to tylko zalecenie, a nie wymóg"
        ],
        c: 0,
        e: "Włączenie prawego kierunkowskazu przy zjeździe z ronda jest obowiązkowe, aby wyraźnie poinformować innych użytkowników drogi i pieszych."
      }
    },
    {
      sourceTitle: "Statens vegvesen",
      difficulty: "hard",
      status: "ready",
      no: {
        t: "Førstehjelp",
        q: "Du er førstemann til en trafikkulykke. Hvilken rekkefølge av tiltak er mest riktig?",
        o: [
           "Sikre skadestedet, varsle 113, gi livreddende førstehjelp",
           "Varsle 113, gi livreddende førstehjelp, sikre skadestedet",
           "Løp rett til de skadde og sjekk puls, varsle deretter",
           "Begynn hjerte-lungeredning, og håp at noen andre ringer"
        ],
        c: 0,
        e: "Hovedregelen er å sikre skadestedet først for å hindre flere ulykker (bruk varseltrekant/nødblink). Deretter varsle nødnummeret (113 for helse), og til slutt gi livreddende førstehjelp."
      },
      en: {
        t: "First aid",
        q: "You are the first to arrive at a traffic accident. Which sequence of actions is most correct?",
        o: [
           "Secure the scene, alert 113, give life-saving first aid",
           "Alert 113, give life-saving first aid, secure the scene",
           "Run straight to the injured, check pulse, then alert",
           "Begin CPR and hope someone else calls"
        ],
        c: 0,
        e: "The main rule is to secure the scene first to prevent further accidents (use warning triangle/hazard lights). Then alert emergency services (113), and finally provide life-saving first aid."
      },
      ar: {
        t: "الإسعافات الأولية",
        q: "أنت أول الواصلين إلى حادث مرور. ما هو التسلسل الأصح للإجراءات؟",
        o: [
           "تأمين موقع الحادث، الاتصال بـ 113، تقديم إسعافات منقذة للحياة",
           "الاتصال بـ 113، تقديم إسعافات منقذة للحياة، تأمين الموقع",
           "الركض المباشر للمصابين والتأكد من النبض، ثم الإبلاغ",
           "بدء الإنعاش القلبي الرئوي وتأمل أن يتصل شخص آخر"
        ],
        c: 0,
        e: "القاعدة الأولية هي تأمين الموقع لمنع المزيد من الحوادث. ثم الاتصال بخدمات الطوارئ 113، وأخيرًا تقديم الإسعافات المنقذة للحياة."
      },
      pl: {
        t: "Pierwsza pomoc",
        q: "Jesteś pierwszą osobą na miejscu wypadku drogowego. Jaka kolejność działań jest najbardziej poprawna?",
        o: [
           "Zabezpiecz miejsce zdarzenia, zadzwoń pod 113, udziel pierwszej pomocy",
           "Zadzwoń pod 113, udziel pierwszej pomocy, zabezpiecz miejsce zdarzenia",
           "Pobiegnij prosto do rannych, sprawdź puls, a potem powiadom",
           "Rozpocznij RKO i miej nadzieję, że zadzwoni ktoś inny"
        ],
        c: 0,
        e: "Główną zasadą jest najpierw zabezpieczenie miejsca, aby zapobiec kolejnym wypadkom. Potem należy powiadomić służby ratunkowe (113), a na końcu udzielić pomocy ratującej życie."
      }
    },
    {
      sourceTitle: "Statens vegvesen",
      difficulty: "medium",
      status: "review",
      no: {
        t: "Sikkerhet",
        q: "Hva er den lovlige promillegrensen for å kjøre bil i Norge?",
        o: [
           "0,2 promille",
           "0,5 promille",
           "0,8 promille",
           "Det er ingen spesifikk grense så lenge du føler deg edru"
        ],
        c: 0,
        e: "Den lovlige promillegrensen i Norge er 0,2. Hvis du har mer enn dette, regnes det som kjøring i ruspåvirket tilstand."
      },
      en: {
        t: "Safety",
        q: "What is the legal blood alcohol BAC limit for driving in Norway?",
        o: [
           "0.2 parts per thousand (0.02%)",
           "0.5 parts per thousand (0.05%)",
           "0.8 parts per thousand (0.08%)",
           "There is no specific limit as long as you feel sober"
        ],
        c: 0,
        e: "The legal blood alcohol limit in Norway is 0.2. Anything above this is considered driving under the influence."
      },
      ar: {
        t: "سلامة",
        q: "ما هو الحد القانوني لنسبة الكحول المسموح بها للقيادة في النرويج؟",
        o: [
           "0.2 في الألف",
           "0.5 في الألف",
           "0.8 في الألف",
           "لا يوجد حد محدد طالما أنك تشعر بالوعي"
        ],
        c: 0,
        e: "الحد القانوني في النرويج هو 0.2. أي نسبة أعلى تعتبر قيادة تحت تأثير الكحول."
      },
      pl: {
        t: "Bezpieczeństwo",
        q: "Jaki jest prawny limit stężenia alkoholu we krwi u kierowcy w Norwegii?",
        o: [
           "0,2 promila",
           "0,5 promila",
           "0,8 promila",
           "Nie ma określonego limitu, o ile czujesz się trzeźwy"
        ],
        c: 0,
        e: "Dopuszczalny limit promili w Norwegii to 0,2. Wartość powyżej tego limitu jest traktowana jako jazda pod wpływem alkoholu."
      }
    },
    {
      sourceTitle: "Statens vegvesen",
      difficulty: "medium",
      status: "ready",
      image: "/images/signs/yield.svg",
      imageAlt: "Vikepliktskilt",
      no: {
        t: "Trafikkregler",
        q: "Hva betyr dette skiltet?",
        o: [
           "Du har vikeplikt for kryssende trafikk.",
           "Du kjører på en forkjørsvei.",
           "Stoppeplikt før krysset.",
           "Rundkjøring forut."
        ],
        c: 0,
        e: "Dette er et vikepliktskilt (visuell varseltrekant med spissen ned). Det betyr at du må vike for trafikk fra både høyre og venstre på kryssende vei."
      },
      en: {
        t: "Traffic rules",
        q: "What does this sign mean?",
        o: [
           "You must give way to cross traffic.",
           "You have priority.",
           "You must stop before the intersection.",
           "Roundabout ahead."
        ],
        c: 0,
        e: "This is a yield sign. It means you must give way to traffic from both right and left on the crossing road."
      },
      ar: {
        t: "قواعد المرور",
        q: "ماذا تعني هذه الإشارة؟",
        o: [
           "يجب أن تفسح المجال لحركة المرور المتقاطعة.",
           "لديك حق الأولوية.",
           "يجب عليك التوقف قبل التقاطع.",
           "يوجد دوار أمامك."
        ],
        c: 0,
        e: "هذه إشارة إعطاء الأولوية. تعني أنه يجب أن تفسح المجال لحركة المرور من اليمين واليسار."
      },
      pl: {
        t: "Zasady ruchu drogowego",
        q: "Co oznacza ten znak?",
        o: [
           "Musisz ustąpić pierwszeństwa ruchowi poprzecznemu.",
           "Masz pierwszeństwo przejazdu.",
           "Obowiązek zatrzymania się przed skrzyżowaniem.",
           "Rondo przed tobą."
        ],
        c: 0,
        e: "To jest znak ustąp pierwszeństwa. Oznacza on, że musisz ustąpić ruchowi z prawej i lewej strony na drodze poprzecznej."
      }
    },
    {
      sourceTitle: "Statens vegvesen",
      difficulty: "easy",
      status: "ready",
      image: "/images/signs/speed_50.svg",
      imageAlt: "Fartsgrense 50",
      no: {
        t: "Trafikkregler",
        q: "Hva er regelen når du passerer dette skiltet?",
        o: [
           "Du må holde nøyaktig 50 km/t",
           "Høyeste tillatte hastighet under ideelle forhold er 50 km/t",
           "Gjennomsnittsfarten din bør være 50 km/t",
           "Anbefalt fart er 50 km/t"
        ],
        c: 1,
        e: "Skiltet angir fartsgrensen. Dette er den absolutt høyeste tillatte farten under optimale forhold. Du må alltid tilpasse farten til vei-, føre- og trafikkforhold."
      },
      en: {
        t: "Traffic rules",
        q: "What is the rule when you pass this sign?",
        o: [
           "You must maintain exactly 50 km/h",
           "The maximum permitted speed under ideal conditions is 50 km/h",
           "Your average speed should be 50 km/h",
           "The recommended speed is 50 km/h"
        ],
        c: 1,
        e: "The sign indicates the speed limit. This is the absolute maximum permitted speed under optimal conditions. You must always adjust your speed to road, weather, and traffic conditions."
      },
      ar: {
        t: "قواعد المرور",
        q: "ما هي القاعدة عند تجاوز هذه الإشارة؟",
        o: [
           "يجب عليك الحفاظ على سرعة 50 كم/ساعة بالضبط",
           "السرعة القصوى المسموح بها في الظروف المثالية هي 50 كم/ساعة",
           "يجب أن يكون متوسط سرعتك 50 كم/ساعة",
           "السرعة الموصى بها هي 50 كم/ساعة"
        ],
        c: 1,
        e: "تحدد اللوحة الحد الأقصى للسرعة في الظروف المثالية ويجب تكييف السرعة حسب ظروف الطريق."
      },
      pl: {
        t: "Zasady ruchu drogowego",
        q: "Jaka zasada obowiązuje po minięciu tego znaku?",
        o: [
           "Musisz utrzymywać dokładnie 50 km/h",
           "Maksymalna dozwolona prędkość w idealnych warunkach to 50 km/h",
           "Twoja średnia prędkość powinna wynosić 50 km/h",
           "Zalecana prędkość to 50 km/h"
        ],
        c: 1,
        e: "Znak określa ograniczenie prędkości."
      }
    },
    {
      sourceTitle: "Statens vegvesen",
      difficulty: "medium",
      status: "ready",
      image: "/images/situations/intersection.svg",
      imageAlt: "Kryss-situasjon",
      no: {
        t: "Vikeplikt",
        q: "Se på illustrasjonen. Du er den røde bilen som skal rett frem. Har du vikeplikt for den blå bilen?",
        o: [
           "Ja, fordi den kommer fra høyre (felles forkjørsregel).",
           "Nei, fordi jeg kjører rett frem.",
           "Nei, fordi den blå bilen skal svinge.",
           "Ja, fordi den blå bilen er størst."
        ],
        c: 0,
        e: "I et uregulert kryss (uten skilt, lys eller politi) gjelder høyreregelen. Siden den blå bilen kommer fra høyre, har din bil (den røde) vikeplikt."
      },
      en: {
        t: "Right of Way",
        q: "Look at the illustration. You are the red car going straight. Do you have to give way to the blue car?",
        o: [
           "Yes, because it is coming from the right (right-hand rule).",
           "No, because I am going straight.",
           "No, because the blue car is turning.",
           "Yes, because the blue car is bigger."
        ],
        c: 0,
        e: "In an unregulated intersection, the right-hand rule applies. Since the blue car comes from the right, the red car must yield."
      },
      ar: {
        t: "أولوية المرور",
        q: "انظر إلى التوضيح. أنت السيارة الحمراء المتجهة للأمام. هل يجب عليك إفساح المجال للسيارة الزرقاء؟",
        o: [
           "نعم، لأنها قادمة من اليمين (قاعدة اليمين).",
           "لا، لأنني أتجه بشكل مستقيم.",
           "لا، لأن السيارة الزرقاء تنعطف.",
           "نعم، لأن السيارة الزرقاء أكبر."
        ],
        c: 0,
        e: "في التقاطع غير المنظم تنطبق قاعدة اليمين. لذا يجب أن تفسح السيارة الحمراء المجال للزرقاء."
      },
      pl: {
        t: "Pierwszeństwo przejazdu",
        q: "Spójrz na ilustrację. Jesteś czerwonym samochodem jadącym prosto. Czy musisz ustąpić pierwszeństwa niebieskiemu samochodowi?",
        o: [
           "Tak, ponieważ nadjeżdża z prawej strony (zasada prawej ręki).",
           "Nie, ponieważ jadę prosto.",
           "Nie, ponieważ niebieski samochód skręca.",
           "Tak, ponieważ niebieski samochód jest większy."
        ],
        c: 0,
        e: "Na skrzyżowaniu równorzędnym obowiązuje zasada prawej ręki. Czerwony samochód musi ustąpić."
      }
    }
  ]
};
