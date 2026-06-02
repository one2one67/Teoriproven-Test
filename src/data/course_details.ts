import { CategoryId, Language } from './q_base';

export interface CourseDetail {
  overview: Record<Language, string>;
  topics: Record<Language, string[]>;
  learningGoals: Record<Language, string[]>;
}

export const COURSE_DETAILS: Partial<Record<CategoryId, CourseDetail>> = {
  personbil_b: {
    overview: {
      no: 'Forbered deg til teoriprøven for klasse B. Her lærere du alt fra vikeplikt og trafikkskilt til riktig plassering og kjøring i ulike miljøer.',
      en: 'Prepare for the Class B theory test. Learn everything from right of way and traffic signs to road positioning and driving in various environments.',
      ar: 'استعد لاختبار النظري للفئة B. تعلم كل شيء بدءًا من حق الأولوية وإشارات المرور وحتى التموضع على الطريق والقيادة في بيئات مختلفة.',
      pl: 'Przygotuj się do egzaminu teoretycznego kategorii B. Dowiedz się wszystkiego, od pierwszeństwa przejazdu i znaków drogowych po pozycjonowanie na drodze i jazdę w różnych środowiskach.'
    },
    topics: {
      no: ['Trafikkskilt og veioppmerking', 'Trafikkregler og vikeplikt', 'Fart og plassering', 'Sikkerhet og førerens ansvar'],
      en: ['Traffic signs and road markings', 'Traffic rules and right of way', 'Speed and road positioning', 'Safety and driver responsibility'],
      ar: ['إشارات المرور وعلامات الطريق', 'قواعد المرور وحق الأولوية', 'السرعة والتموضع على الطريق', 'السلامة ومسؤولية السائق'],
      pl: ['Znaki drogowe i oznakowanie', 'Przepisy ruchu drogowego i pierwszeństwo przejazdu', 'Prędkość i pozycjonowanie', 'Bezpieczeństwo i odpowiedzialność kierowcy']
    },
    learningGoals: {
      no: ['Forstå alle viktige trafikkskilt.', 'Mestre reglene for vikeplikt i ulike veikryss.', 'Vite hvordan du sikrer passasjerer og last.'],
      en: ['Understand all essential traffic signs.', 'Master right of way rules in various intersections.', 'Know how to secure passengers and cargo.'],
      ar: ['فهم جميع إشارات المرور الأساسية.', 'إتقان قواعد حق الأولوية في التقاطعات المختلفة.', 'معرفة كيفية تأمين الركاب والبضائع.'],
      pl: ['Zrozumienie wszystkich najważniejszych znaków drogowych.', 'Opanowanie zasad pierwszeństwa przejazdu na różnych skrzyżowaniach.', 'Wiedza, jak zabezpieczyć pasażerów i ładunek.']
    }
  },
  personbil_b96: {
    overview: {
      no: 'Forbered deg for kl. B96. Få kunnskap om vektbegrensninger, sikring av last, og kjøring med tyngre tilhenger.',
      en: 'Prepare for class B96. Gain knowledge about weight limitations, securing cargo, and driving with a heavier trailer.',
      ar: 'استعد للفئة B96. اكتسب معرفة حول قيود الوزن، وتأمين البضائع، والقيادة بمقطورة أثقل.',
      pl: 'Przygotuj się do kategorii B96. Zdobądź wiedzę na temat ograniczeń wagowych, zabezpieczania ładunku i jazdy z cięższą przyczepą.'
    },
    topics: {
      no: ['Vogntogets samlede vekt', 'Sikring av last', 'Kjøring og rygging med henger', 'Sikkerhet og vedlikehold'],
      en: ['Total combined weight', 'Securing cargo', 'Driving and reversing with trailer', 'Safety and maintenance'],
      ar: ['الوزن الإجمالي المجمع', 'تأمين البضائع', 'القيادة والرجوع للخلف بالمقطورة', 'السلامة والصيانة'],
      pl: ['Całkowita waga zespołu pojazdów', 'Zabezpieczanie ładunku', 'Jazda i cofanie z przyczepą', 'Bezpieczeństwo i konserwacja']
    },
    learningGoals: {
      no: ['Forstå vognkortet for bil og henger.', 'Regne ut tillatt totalvekt.', 'Mestre prinsipper for rygging med henger.'],
      en: ['Understand the registration certificates for car and trailer.', 'Calculate permitted total weight.', 'Master principles for reversing with a trailer.'],
      ar: ['فهم شهادات تسجيل السيارة والمقطورة.', 'حساب الوزن الإجمالي المسموح به.', 'إتقان مبادئ الرجوع للخلف بالمقطورة.'],
      pl: ['Zrozumienie dowodów rejestracyjnych samochodu i przyczepy.', 'Obliczanie dopuszczalnej masy całkowitej.', 'Opanowanie zasad cofania z przyczepą.']
    }
  },
  personbil_be: {
    overview: {
      no: 'Det fulle tilhengerkurset. Alt som kreves for å bestå både teori (om det gjelder) og den praktiske prøven for BE.',
      en: 'The complete trailer course. Everything required to pass both theory (if applicable) and the practical test for BE.',
      ar: 'دورة المقطورة الشاملة. كل ما تحتاجه لاجتياز النظري (إن وجد) والاختبار العملي للفئة BE.',
      pl: 'Pełny kurs jazdy z przyczepą. Wszystko, co niezbędne do zdania zarówno teorii (jeśli dotyczy), jak i egzaminu praktycznego na kategorię BE.'
    },
    topics: {
      no: ['Vekt og lastberegning', 'Sikkerhetskontroll før kjøring', 'Manøvrering med tung tilhenger', 'Bremseanlegg på tilhenger'],
      en: ['Weight and load calculation', 'Safety checks before driving', 'Maneuvering with heavy trailer', 'Trailer braking systems'],
      ar: ['حساب الوزن والحمولة', 'فحوصات السلامة قبل القيادة', 'المناورة بمقطورة ثقيلة', 'أنظمة فرامل المقطورة'],
      pl: ['Obliczanie wagi i ładunku', 'Kontrole bezpieczeństwa przed jazdą', 'Manewrowanie ciężką przyczepą', 'Układy hamulcowe przyczepy']
    },
    learningGoals: {
      no: ['Gjennomføre full sikkerhetskontroll.', 'Forstå påløpsbremsen', 'Sikker kjøring med maksimal lovlig last.'],
      en: ['Perform a full safety check.', 'Understand the overrun brake', 'Safe driving with maximum legal load.'],
      ar: ['إجراء فحص سلامة شامل.', 'فهم فرامل التجاوز', 'القيادة الآمنة بالحمولة القصوى القانونية.'],
      pl: ['Przeprowadzanie pełnej kontroli bezpieczeństwa.', 'Zrozumienie hamulca najazdowego', 'Bezpieczna jazda z maksymalnym dozwolonym ładunkiem.']
    }
  }
};
