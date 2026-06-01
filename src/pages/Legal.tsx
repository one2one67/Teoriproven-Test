import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../lib/store';
import { Shield, Cookie, FileText, Mail } from 'lucide-react';

interface LegalPageProps {
  pageType: 'privacy' | 'terms' | 'cookies' | 'contact';
}

export default function Legal({ pageType }: LegalPageProps) {
  const { lang } = useStore();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const openCookieSettings = () => {
    window.dispatchEvent(new Event('openCookieSettings'));
  };

  const businessInfo = {
    name: 'Teorigo.no',
    orgNo: 'Teorigo.no',
    address: 'Oslo Norway',
    email: 'one2one@live.no',
    contactPerson: 'Teorigo.no kundeservice',
  };

  const t = {
    no: {
      privacy: { title: 'Personvernerklæring', icon: <Shield className="w-6 h-6" /> },
      terms: { title: 'Brukervilkår', icon: <FileText className="w-6 h-6" /> },
      cookies: { title: 'Informasjonskapsler', icon: <Cookie className="w-6 h-6" /> },
      contact: { title: 'Legal / Kontakt', icon: <Mail className="w-6 h-6" /> },
      pending: '* Virksomhetsdetaljer vil bli oppdatert når selskapsregistreringen er fullført.',
      cookieButton: 'Åpne innstillinger for informasjonskapsler',
    },
    en: {
      privacy: { title: 'Privacy Policy', icon: <Shield className="w-6 h-6" /> },
      terms: { title: 'Terms of Use', icon: <FileText className="w-6 h-6" /> },
      cookies: { title: 'Cookies', icon: <Cookie className="w-6 h-6" /> },
      contact: { title: 'Legal / Contact', icon: <Mail className="w-6 h-6" /> },
      pending: '* Business details will be updated once company registration is completed.',
      cookieButton: 'Open Cookie Settings',
    },
    ar: {
      privacy: { title: 'سياسة الخصوصية', icon: <Shield className="w-6 h-6" /> },
      terms: { title: 'شروط الاستخدام', icon: <FileText className="w-6 h-6" /> },
      cookies: { title: 'ملفات تعريف الارتباط', icon: <Cookie className="w-6 h-6" /> },
      contact: { title: 'اتصل بنا / قانوني', icon: <Mail className="w-6 h-6" /> },
      pending: '* سيتم تحديث تفاصيل الأعمال بمجرد اكتمال تسجيل الشركة.',
      cookieButton: 'فتح إعدادات ملفات تعريف الارتباط',
    },
    pl: {
      privacy: { title: 'Polityka prywatności', icon: <Shield className="w-6 h-6" /> },
      terms: { title: 'Warunki użytkowania', icon: <FileText className="w-6 h-6" /> },
      cookies: { title: 'Pliki cookie', icon: <Cookie className="w-6 h-6" /> },
      contact: { title: 'Kontakt / Informacje prawne', icon: <Mail className="w-6 h-6" /> },
      pending: '* Dane firmy zostaną zaktualizowane po zakończeniu rejestracji firmy.',
      cookieButton: 'Otwórz ustawienia plików cookie',
    }
  };

  const labels = t[lang as keyof typeof t] || t.no;
  const pageInfo = labels[pageType];

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col pt-24 pb-12 px-4">
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue-lt">
            {pageInfo.icon}
          </div>
          <h1 className="text-3xl font-display font-black text-white">{pageInfo.title}</h1>
        </div>

        <div className="bg-brand-dark-2/90 border border-brand-border rounded-3xl p-6 sm:p-10 shadow-xl prose prose-invert prose-slate max-w-none font-sans">
          
          <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200/90 text-sm">
            {labels.pending}
          </div>

          <div className="space-y-6 text-slate-300 leading-relaxed text-sm">
            
            {/* -------------------- PRIVACY -------------------- */}
            {pageType === 'privacy' && (
              <>
                <p>
                  <strong>{labels.privacy.title}</strong> beskriver hvordan Teorigo.no samler inn, bruker og beskytter dine personopplysninger. Denne policyen vil bli formelt oppdatert når selskapsregistreringen er fullført.
                </p>
                <h3 className="text-white mt-6 font-bold text-base">Innsamlede Data</h3>
                <p>Når du oppretter en konto, samler vi inn e-postadresse og navn (hvis oppgitt) for å kunne tilby våre tjenester og holde oversikt over din progresjon.</p>
                
                <h3 className="text-white mt-6 font-bold text-base">Lagring og Sikkerhet</h3>
                <p>All data lagres trygt. Dine passord behandles via sikker autentisering (Supabase), og vi har aldri tilgang til ditt rå-passord.</p>

                <h3 className="text-white mt-6 font-bold text-base">Behandlingsansvarlig</h3>
                <ul className="list-none pl-0 space-y-1">
                  <li><strong>Virksomhet:</strong> {businessInfo.name}</li>
                  <li><strong>Org. nr:</strong> {businessInfo.orgNo}</li>
                  <li><strong>Adresse:</strong> {businessInfo.address}</li>
                  <li><strong>E-post:</strong> {businessInfo.email}</li>
                </ul>
              </>
            )}

            {/* -------------------- TERMS -------------------- */}
            {pageType === 'terms' && (
              <>
                <p>
                  Ved å bruke Teorigo.no aksepterer du disse <strong>{labels.terms.title}</strong>, inkludert eventuelle fremtidige abonnementsvilkår (Purchase/Subscription Terms) som vil spesifiseres når kommersielle funksjoner er fullt registrert.
                </p>
                
                <h3 className="text-white mt-6 font-bold text-base">Bruk av Tjenesten</h3>
                <p>Plattformen, inkludert spørsmålsbank, eksamensimulator og flashkort, er ment som et pedagogisk verktøy for forberedelse til teoriprøver. Innholdet kan ikke kopieres, videreselges eller distribueres uten eksplisitt tillatelse.</p>

                <h3 className="text-white mt-6 font-bold text-base">Konto og Tilgang</h3>
                <p>Du er ansvarlig for å holde påloggingsinformasjonen din sikker. Kontodeling er ikke tillatt og kan medføre utestengelse.</p>
                
                <h3 className="text-white mt-6 font-bold text-base">Kjøpsvilkår og Abonnement</h3>
                <p>Dersom du foretar betalinger for premium-tilgang, gjelder vilkår for kjøp inngått med {businessInfo.name}. Nøyaktige retningslinjer for angrerett og refusjon vil oppdateres her under lovpålagte standarder så snart virksomheten er registrert.</p>
              </>
            )}

            {/* -------------------- COOKIES -------------------- */}
            {pageType === 'cookies' && (
              <>
                <p>Informasjon om hvordan vi bruker informasjonskapsler (cookies) og lignende teknologier på Teorigo.no.</p>

                <h3 className="text-white mt-6 font-bold text-base">Hva er informasjonskapsler?</h3>
                <p>Informasjonskapsler er små tekstfiler som lagres på enheten din når du besøker vår nettside. De hjelper oss med å huske dine innstillinger (som språk) og holde deg innlogget.</p>

                <h3 className="text-white mt-6 font-bold text-base">Våre informasjonskapsler</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Nødvendige:</strong> Kreves for kjernefunksjoner som autentisering og språkvalg. Disse kan ikke deaktiveres hvis du skal bruke tjenesten.</li>
                  <li><strong>Analyse & Markedsføring:</strong> Brukes til å forstå trafikkmønstre og forbedre våre tjenester. Spesifikke tredjeparts-cookies vil listes når dette implementeres.</li>
                </ul>

                <div className="mt-8">
                  <button 
                    onClick={openCookieSettings}
                    className="px-4 py-2 bg-brand-blue/10 text-brand-blue-lt border border-brand-blue/20 rounded-lg text-sm font-medium hover:bg-brand-blue/20 transition-all font-sans"
                  >
                    {labels.cookieButton}
                  </button>
                </div>
              </>
            )}

            {/* -------------------- CONTACT -------------------- */}
            {pageType === 'contact' && (
              <>
                <p>Har du spørsmål, henvendelser eller trenger support? Du kan også nå oss angående juridiske spørsmål eller personvern.</p>
                
                <div className="mt-6 p-6 bg-white/[0.02] border border-brand-border/40 rounded-xl space-y-4">
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Virksomhet</div>
                    <div className="text-white font-medium">{businessInfo.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Organisasjonsnummer</div>
                    <div className="text-white font-medium">{businessInfo.orgNo}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Adresse</div>
                    <div className="text-white font-medium">{businessInfo.address}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">E-post / Support</div>
                    <div className="text-brand-blue-lt font-medium">{businessInfo.email}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Kontaktperson</div>
                    <div className="text-white font-medium">{businessInfo.contactPerson}</div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
