import { beExpansionQuestions } from "./be_questions";

export const personbilBEData = {
  themes: {
    no: {
      'Bremser': 'Bremseanlegg og Sikkerhet',
      'Vekt': 'Vekt og Begrensninger',
      'Kontroll': 'Sikkerhetskontroll',
    },
    en: {
      'Bremser': 'Brakes and Safety',
      'Vekt': 'Weight and Limitations',
      'Kontroll': 'Safety Control',
    },
    ar: {
      'Bremser': 'فرامل وسلامة',
      'Vekt': 'وزن وقيود',
      'Kontroll': 'فحص السلامة',
    },
    pl: {
      'Bremser': 'Hamulce i bezpieczeństwo',
      'Vekt': 'Waga i ograniczenia',
      'Kontroll': 'Kontrola bezpieczeństwa',
    }
  },
  q: [
    {
      sourceTitle: "Statens vegvesen",
      difficulty: "medium",
      image: "https://placehold.co/400x300/1e293b/cbd5e1?text=BE+3500+kg",
      imageAlt: "Class BE weight limits illustration",
      no: {
        t: "Vekt",
        q: "Kan den tillatte totalvekten på tilhengeren være større enn 3500 kg med førerkort i klasse BE?",
        o: [
           "Nei, for klasse BE kan ikke tilhengerens tillatte totalvekt overstige 3500 kg.",
           "Ja, det finnes ingen øvre vektgrense for tilhengeren med klasse BE.",
           "Ja, inntil 4250 kg.",
           "Nei, maksimum lovlig er 750 kg."
        ],
        c: 0,
        e: "Med klasse BE tatt etter 19. januar 2013, er det en begrensning på at tilhengerens tillatte totalvekt ikke kan være over 3500 kg."
      },
      en: {
        t: "Vekt",
        q: "Can the permitted total weight of the trailer exceed 3500 kg with a class BE license?",
        o: [
           "No, for class BE, the trailer's permitted total weight cannot exceed 3500 kg.",
           "Yes, there is no upper weight limit for the trailer with class BE.",
           "Yes, up to 4250 kg.",
           "No, the maximum legal weight is 750 kg."
        ],
        c: 0,
        e: "With class BE taken after January 19, 2013, there is a limitation that the trailer's permitted total weight cannot be more than 3500 kg."
      },
      ar: {
        t: "Vekt",
        q: "هل يمكن أن يتجاوز الوزن الإجمالي المسموح به للمقطورة 3500 كجم مع رخصة الفئة BE؟",
        o: [
           "لا، بالنسبة للفئة BE، لا يمكن أن يتجاوز الوزن الإجمالي للمقطورة 3500 كجم.",
           "نعم، لا يوجد حد أقصى لوزن المقطورة مع الفئة BE.",
           "نعم، حتى 4250 كجم.",
           "لا، الحد الأقصى للوزن القانوني هو 750 كجم."
        ],
        c: 0,
        e: "مع الفئة BE المستخرجة بعد 19 يناير 2013، هناك قيد يمنع أن يتجاوز الوزن الإجمالي المسموح للمقطورة أكثر من 3500 كجم."
      },
      pl: {
        t: "Vekt",
        q: "Czy dopuszczalna masa całkowita przyczepy może przekroczyć 3500 kg z prawem jazdy kategorii BE?",
        o: [
           "Nie, w kategorii BE dopuszczalna masa całkowita przyczepy nie może przekroczyć 3500 kg.",
           "Tak, dla kategorii BE nie ma górnego limitu wagi przyczepy.",
           "Tak, do 4250 kg.",
           "Nie, maksymalna legalna waga wynosi 750 kg."
        ],
        c: 0,
        e: "W przypadku kategorii BE uzyskanej po 19 stycznia 2013 roku, obowiązuje ograniczenie, według którego dopuszczalna masa całkowita przyczepy nie może wynosić więcej niż 3500 kg."
      }
    },
    {
      sourceTitle: "Statens vegvesen",
      difficulty: "hard",
      image: "https://placehold.co/400x300/1e293b/cbd5e1?text=Bremser",
      imageAlt: "Trailer brakes/Påløpsbrems illustration",
      no: {
        t: "Bremser",
        q: "Når skal en tilhenger være utstyrt med driftsbrems (oftest påløpsbrems)?",
        o: [
           "Når tilhengeren har en tillatt totalvekt over 750 kg.",
           "Når tilhengerens veier mer enn 300 kg uten last.",
           "Når bilen mangler ABS-bremser.",
           "Bare for tilhengere som brukes til godstransport for næringsdrift."
        ],
        c: 0,
        e: "Dersom tilhengerens tillatte totalvekt er over 750 kg, er det påkrevd at den har en egen brems (driftsbrems), vanligvis i form av en påløpsbrems."
      },
      en: {
        t: "Bremser",
        q: "When must a trailer be equipped with service brakes (usually overrun brakes)?",
        o: [
           "When the trailer has a permitted total weight of over 750 kg.",
           "When the trailer weighs more than 300 kg without a load.",
           "When the car lacks ABS brakes.",
           "Only for trailers used for commercial goods transport."
        ],
        c: 0,
        e: "If the trailer's permitted total weight exceeds 750 kg, it is required to have its own brake (service brake), typically in the form of an overrun brake."
      },
      ar: {
        t: "Bremser",
        q: "متى يجب أن تكون المقطورة مجهزة بفرامل خدمة (عادةً فرامل تجاوز)؟",
        o: [
           "عندما يكون للمقطورة وزن إجمالي مسموح به يزيد عن 750 كجم.",
           "عندما تزن المقطورة أكثر من 300 كجم بدون حمولة.",
           "عندما تفتقر السيارة لمكابح ABS.",
           "فقط للمقطورات المستخدمة في نقل البضائع التجاري."
        ],
        c: 0,
        e: "إذا كان الوزن الإجمالي المسموح للمقطورة يتجاوز 750 كجم، يجب أن تكون مزودة بفراملها الخاصة (فرامل خدمة)، وعادة ما تكون على شكل فرامل تجاوز."
      },
      pl: {
        t: "Bremser",
        q: "Kiedy przyczepa musi być wyposażona w hamulce robocze (zazwyczaj hamulce najazdowe)?",
        o: [
           "Kiedy przyczepa ma dopuszczalną masę całkowitą przekraczającą 750 kg.",
           "Kiedy przyczepa waży więcej niż 300 kg bez ładunku.",
           "Kiedy samochód nie ma hamulców ABS.",
           "Tylko dla przyczep używanych do komercyjnego transportu towarów."
        ],
        c: 0,
        e: "Jeśli dopuszczalna masa całkowita przyczepy przekracza 750 kg, wymagane jest posiadanie własnego hamulca (roboczego), zazwyczaj w postaci hamulca najazdowego."
      }
    },
    {
      sourceTitle: "Statens vegvesen",
      difficulty: "medium",
      no: {
        t: "Kontroll",
        q: "Hvordan kan du kontrollere om tilhengerens påløpsbrems fungerer?",
        o: [
           "Ved å kjøre rygge og la hengeren stoppe av seg selv, eller kjenne at bremsene kobles inn når du bremser svakt fra 20-30 km/t",
           "Ved å koble ut kontakten og sjekke om nødbremsen fungerer",
           "Påløpsbrems kan kun sjekkes av et autorisert verksted",
           "Det er ikke påkrevd å sjekke påløpsbremsen før vanlig kjøring"
        ],
        c: 0,
        e: "Du kan funksjonsteste påløpsbremsen ved en Bremseprøve: Kjør i ca. 20–30 km/t og brems forsiktig, da skal du kjenne at tilhengeren bremser. Man kan også dytte påløpet manuelt inn mot hengerdraget mens hengeren står stille for å sjekke at bremsene låser hjulene (trenger krefter)."
      },
      en: {
        t: "Kontroll",
        q: "How can you check if the trailer's overrun brake is working?",
        o: [
           "By braking weakly from 20-30 km/h and feeling the trailer engage its brakes",
           "By unplugging the electrics and checking the emergency brake",
           "Overrun brakes can only be checked by an authorized workshop",
           "It is not required to check the overrun brake before normal driving"
        ],
        c: 0,
        e: "You can test the overrun brake by driving at about 20-30 km/h and braking gently; you should feel the trailer brake."
      },
      ar: {
        t: "Kontroll",
        q: "كيف يمكنك التحقق مما إذا كانت فرامل تجاوز المقطورة تعمل؟",
        o: [
           "بالكبح ببطء من 20-30 كم / ساعة والشعور بتفعيل المقطورة للفرامل الخاصة بها",
           "عن طريق فصل الكهرباء والتحقق من فرامل الطوارئ",
           "فرامل التجاوز يمكن التحقق منها فقط في ورشة متخصصة",
           "لا يُطلب التحقق من فرامل التجاوز قبل القيادة العادية"
        ],
        c: 0,
        e: "يمكنك اختبار فرامل التجاوز عن طريق القيادة المعتدلة والفرملة بلطف والشعور بفرامل المقطورة."
      },
      pl: {
        t: "Kontroll",
        q: "Jak możesz sprawdzić, czy hamulec najazdowy przyczepy działa?",
        o: [
           "Łagodnie hamując przy 20-30 km/h i czując, jak przyczepa włącza swoje hamulce",
           "Odłączając elektrykę i sprawdzając hamulec awaryjny",
           "Hamulce najazdowe mogą być sprawdzane tylko przez autoryzowany warsztat",
           "Sprawdzanie hamulca najazdowego nie jest wymagane przed normalną jazdą"
        ],
        c: 0,
        e: "Hamulec najazdowy można przetestować, jadąc około 20-30 km/h i delikatnie hamując; powinieneś poczuć hamowanie przyczepy."
      }
    },
    {
      sourceTitle: "Statens vegvesen",
      difficulty: "medium",
      status: "review",
      no: {
        t: "Kontroll",
        q: "Hvordan kontrollerer du at tilhengerens lys fungerer riktig?",
        o: [
           "Du må koble til kontakten, slå på bilens lys og gå bak for å sjekke baklys, bremselys, blinklys og skiltlys før kjøring.",
           "Lyset sjekkes automatisk av bilens datasystem.",
           "Det er nok å sjekke lysene en gang i året på verksted.",
           "Du sjekker ved å se i bakspeilet i mørket."
        ],
        c: 0,
        e: "Før du kjører med tilhenger er det førerens ansvar å ta en rask visuell sjekk at baklys, bremselys og blinklys virker. Dette krever at en person sjekker mens en annen opererer lysene, eller at man bruker bilens varselblink og sjekker alle lamper."
      },
      en: {
        t: "Safety Control",
        q: "How do you check that the trailer's lights are working correctly?",
        o: [
           "Connect the plug, turn on the car's lights, and walk behind to check taillights, brake lights, turn signals, and license plate lights.",
           "The lights are checked automatically by the car's computer.",
           "It's enough to check the lights once a year at a workshop.",
           "You check by looking in the rearview mirror in the dark."
        ],
        c: 0,
        e: "Before driving, the driver must visually check that all trailer lights work correctly. You can use hazard lights to check indicators and ask someone to step on the brakes while you look."
      },
      ar: {
        t: "فحص السلامة",
        q: "كيف تتحقق من عمل أضواء المقطورة بشكل صحيح؟",
        o: [
           "قم بتوصيل القابس وتشغيل أضواء السيارة والمشي خلفها لفحص الأضواء الخلفية وأضواء الفرامل وإشارات الانعطاف وأضواء لوحة الترخيص.",
           "يتم فحص الأضواء تلقائيًا بواسطة كمبيوتر السيارة.",
           "يكفي فحص الأضواء مرة واحدة في السنة في الورشة.",
           "تتحقق من خلال النظر في مرآة الرؤية الخلفية في الظلام."
        ],
        c: 0,
        e: "قبل القيادة، يجب على السائق التحقق بصريًا من أن جميع أضواء المقطورة تعمل بشكل صحيح."
      },
      pl: {
        t: "Kontrola bezpieczeństwa",
        q: "Jak sprawdzić, czy światła przyczepy działają prawidłowo?",
        o: [
           "Podłącz wtyczkę, włącz światła samochodu i przejdź do tyłu, aby sprawdzić światła pozycyjne, stopu, kierunkowskazy i podświetlenie tablicy.",
           "Światła są sprawdzane automatycznie przez komputer samochodu.",
           "Wystarczy sprawdzić światła raz w roku w warsztacie.",
           "Sprawdzasz, patrząc w lusterko wsteczne w ciemności."
        ],
        c: 0,
        e: "Przed jazdą kierowca musi wizualnie sprawdzić, czy wszystkie światła przyczepy działają prawidłowo."
      }
    },
    {
      sourceTitle: "Statens vegvesen",
      difficulty: "hard",
      status: "ready",
      no: {
        t: "Vekt",
        q: "Er det greit å laste mesteparten av vekten bakerst i tilhengeren?",
        o: [
           "Nei, det kan gi negativt kuletrykk som gjør vogntoget livsfarlig ustabilt (pendling).",
           "Ja, det gjør at bilen får bedre feste på forhjulene.",
           "Ja, det har ingen betydning hvor vekten er plassert.",
           "Nei, men kun fordi det ser rart ut."
        ],
        c: 0,
        e: "Å plassere vekten for langt bak i tilhengeren fører til et negativt kuletrykk (løfter bakenden på bilen), noe som reduserer styregrepet og kan utløse ukontrollerbar pendling / sleng."
      },
      en: {
        t: "Weight and Limitations",
        q: "Is it a good idea to load most of the weight at the back of the trailer?",
        o: [
           "No, it can cause negative nose weight, making the vehicle combination dangerously unstable (swaying).",
           "Yes, it gives the car better grip on the front wheels.",
           "Yes, it doesn't matter where the weight is placed.",
           "No, but only because it looks strange."
        ],
        c: 0,
        e: "Loading weight too far back causes negative nose weight (lifting the rear of the car), reducing steering grip and potentially triggering uncontrollable swaying."
      },
      ar: {
        t: "وزن وقيود",
        q: "هل من الجيد تحميل معظم الوزن في الجزء الخلفي من المقطورة؟",
        o: [
           "لا، يمكن أن يتسبب في وزن قطر سلبي، مما يجعل مجموعة المركبات غير مستقرة وخطيرة (تأرجح).",
           "نعم، يمنح السيارة تماسكًا أفضل على العجلات الأمامية.",
           "نعم، لا يهم مكان وضع الوزن.",
           "لا، ولكن فقط لأنه يبدو غريباً."
        ],
        c: 0,
        e: "يؤدي تحميل الوزن في الخلف إلى زيادة الوزن السلبي للمقدمة، مما يقلل من تماسك التوجيه ويمكن أن يؤدي إلى تأرجح لا يمكن السيطرة عليه."
      },
      pl: {
        t: "Waga i ograniczenia",
        q: "Czy dobrym pomysłem jest załadowanie większości ciężaru z tyłu przyczepy?",
        o: [
           "Nie, może to spowodować ujemny nacisk na hak, czyniąc zespół pojazdów niebezpiecznie niestabilnym (wężykowanie).",
           "Tak, daje to lepszą przyczepność przednich kół samochodu.",
           "Tak, nie ma znaczenia, gdzie umieszczony jest ciężar.",
           "Nie, ale tylko dlatego, że wygląda to dziwnie."
        ],
        c: 0,
        e: "Zbyt dalekie załadowanie ciężaru w tył powoduje ujemny nacisk na hak (podnosi tył samochodu), zmniejszając przyczepność kierownicy i potencjalnie wywołując niekontrolowane wężykowanie."
      }
    },
    ...beExpansionQuestions
  ]
};
