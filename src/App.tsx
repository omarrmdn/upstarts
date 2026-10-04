import { useState, useEffect, useRef } from 'react';

type Lang = 'ar' | 'en';

interface WordItem {
  ar: string;
  en: string;
}

const ROTOR_WORDS: WordItem[] = [
  { ar: 'زبائن', en: 'customers' },
  { ar: 'ليدز', en: 'leads' },
  { ar: 'زيارات', en: 'visits' },
  { ar: 'ريتش', en: 'reach' },
];

const LONGEST_ROTOR_WORD: Record<Lang, string> = {
  ar: 'زيارات',
  en: 'customers',
};

const ROTOR_COLORS = ['#0432FF', '#2ED47A', '#FF7A45', '#7B5CFF'];

const RAIN_DROPS = [
  { cls: 't-fb', style: { '--l': '3%', '--dur': '6.4s', '--delay': '-0.5s', '--s': '52px' } as React.CSSProperties, icon: '#i-fb', stroke: false, notif: '3' },
  { cls: 't-gpt', style: { '--l': '10%', '--dur': '5.7s', '--delay': '-3.2s', '--s': '48px' } as React.CSSProperties, icon: '#i-gpt', stroke: false, notif: '2' },
  { cls: 't-ig', style: { '--l': '17%', '--dur': '7.2s', '--delay': '-1.8s', '--s': '56px' } as React.CSSProperties, icon: '#i-ig', stroke: false, notif: '7' },
  { cls: 't-wa', style: { '--l': '24%', '--dur': '5.5s', '--delay': '-4.1s', '--s': '52px' } as React.CSSProperties, icon: '#i-wa', stroke: false, notif: '9' },
  { cls: 't-tt', style: { '--l': '31%', '--dur': '6.8s', '--delay': '-2.6s', '--s': '50px' } as React.CSSProperties, icon: '#i-tt', stroke: false, notif: '4' },
  { cls: 't-g', style: { '--l': '39%', '--dur': '6.1s', '--delay': '-5.4s', '--s': '54px' } as React.CSSProperties, icon: '#i-g', stroke: false, notif: '5' },
  { cls: 't-sc', style: { '--l': '47%', '--dur': '7.6s', '--delay': '-3.6s', '--s': '50px' } as React.CSSProperties, icon: '#i-sc', stroke: false, notif: '6' },
  { cls: 't-store', style: { '--l': '54%', '--dur': '6.3s', '--delay': '-1.2s', '--s': '54px' } as React.CSSProperties, icon: '#i-store', stroke: true, notif: '1' },
  { cls: 't-ms', style: { '--l': '62%', '--dur': '5.8s', '--delay': '-4.5s', '--s': '50px' } as React.CSSProperties, icon: '#i-ms', stroke: false, notif: '3' },
  { cls: 't-ig', style: { '--l': '70%', '--dur': '7.0s', '--delay': '-2.4s', '--s': '56px' } as React.CSSProperties, icon: '#i-ig', stroke: false, notif: '8' },
  { cls: 't-fb', style: { '--l': '77%', '--dur': '6.2s', '--delay': '-0.9s', '--s': '52px' } as React.CSSProperties, icon: '#i-fb', stroke: false, notif: '4' },
  { cls: 't-wa', style: { '--l': '84%', '--dur': '5.6s', '--delay': '-3.8s', '--s': '54px' } as React.CSSProperties, icon: '#i-wa', stroke: false, notif: '9' },
  { cls: 't-gpt', style: { '--l': '91%', '--dur': '6.5s', '--delay': '-2.1s', '--s': '48px' } as React.CSSProperties, icon: '#i-gpt', stroke: false, notif: '3' },
  { cls: 't-tt', style: { '--l': '97%', '--dur': '7.1s', '--delay': '-5.0s', '--s': '52px' } as React.CSSProperties, icon: '#i-tt', stroke: false, notif: '5' },
];

interface FaqItem {
  qAr: string;
  qEn: string;
  aAr: string;
  aEn: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    qAr: 'السعر بيتحدد ازاي؟',
    qEn: 'How is pricing decided?',
    aAr: 'بيختلف حسب السوق والحجم المطلوب، عشان كده بنفضل نكلمك مباشرة قبل ما نحدد رقم.',
    aEn: 'It depends on the market and volume you need, which is why we prefer a quick chat before quoting a number.',
  },
  {
    qAr: 'هل محتاج موقع عشان أبدأ إعلانات؟',
    qEn: 'Do I need a website to start advertising?',
    aAr: 'مش دائمًا. حسب عرضك وحملتك، ممكن نجهّز لك صفحة هبوط مخصصة أو نقترح التجهيز الأنسب لطبيعة شغلك.',
    aEn: 'Not always. Depending on your offer and campaign, we can build a dedicated landing page or recommend the setup that makes the most sense for your business.',
  },
  {
    qAr: 'المفروض أصرف كام على الإعلانات؟',
    qEn: 'How much should I spend on ads?',
    aAr: 'مفيش ميزانية واحدة تنفع لكل المشاريع. بنرشح ميزانية بداية بناءً على سوقك، عرضك، المنافسين، وأهداف الحملة.',
    aEn: 'There is no single budget that works for every business. We recommend a starting budget based on your market, offer, competition, and campaign objectives.',
  },
  {
    qAr: 'بتحددوا المنصة الإعلانية المناسبة ازاي؟',
    qEn: 'How do you decide which advertising platform to use?',
    aAr: 'بنختار المنصات بناءً على نشاطك، جمهورك المستهدف، عرضك، وأهدافك. وده ممكن يشمل منصات زي ميتا، جوجل، تيك توك، أو غيرها من الأماكن اللي بيتواجد فيها عملاؤك المحتملين.',
    aEn: 'We choose platforms based on your business, target audience, offer, and goals. This can include platforms such as Meta, Google, TikTok, or others where your customers are most likely to be found.',
  },
];

export default function App() {
  const [lang, setLang] = useState<Lang>('ar');
  const [activeSection, setActiveSection] = useState('hero');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', phone: '' });

  // Rotating words state
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [exitingWordIdx, setExitingWordIdx] = useState<number | null>(null);
  const rotorTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync lang to html attributes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Handle rotor cycling
  useEffect(() => {
    setCurrentWordIdx(0);
    setExitingWordIdx(null);

    rotorTimerRef.current = setInterval(() => {
      setCurrentWordIdx((prev) => {
        setExitingWordIdx(prev);
        setTimeout(() => {
          setExitingWordIdx(null);
        }, 600);
        return (prev + 1) % ROTOR_WORDS.length;
      });
    }, 2200);

    return () => {
      if (rotorTimerRef.current) clearInterval(rotorTimerRef.current);
    };
  }, [lang]);

  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Precision scroll helper with sticky header offset
  const scrollToTarget = (targetId: string, updateUrl: boolean = true) => {
    setActiveSection(targetId);

    const targetPath = targetId === 'hero' ? '/' : `/${targetId}`;
    if (updateUrl && window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }

    isProgrammaticScrollRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    if (targetId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        const headerOffset = 108;
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: Math.max(0, elementPosition - headerOffset),
          behavior: 'smooth',
        });
      }
    }

    // Release programmatic scroll lock once smooth scroll settles
    scrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 750);
  };

  // Navigation handler for clean URLs
  const navigate = (path: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const sectionMap: Record<string, string> = {
      '/': 'hero',
      '/services': 'services',
      '/markets': 'markets',
      '/faq': 'faq',
      '/pricing': 'pricing',
    };
    const targetId = sectionMap[path] || 'hero';
    scrollToTarget(targetId, true);
  };

  // Sync initial URL path and listen for popstate (back/forward)
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      const sectionMap: Record<string, string> = {
        '/': 'hero',
        '/services': 'services',
        '/markets': 'markets',
        '/faq': 'faq',
        '/pricing': 'pricing',
      };
      const targetId = sectionMap[path];
      if (targetId) {
        setTimeout(() => {
          scrollToTarget(targetId, false);
        }, 60);
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Accurate scrollspy with requestAnimationFrame and line-of-sight calculation
  useEffect(() => {
    const sectionIds = ['hero', 'services', 'markets', 'faq', 'pricing'];
    let rafId: number | null = null;

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;

      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        // 1. If reached bottom of document, lock to pricing
        if (windowHeight + scrollY >= docHeight - 70) {
          updateActiveSection('pricing');
          return;
        }

        // 2. If at the top of the document, lock to hero
        if (scrollY < 100) {
          updateActiveSection('hero');
          return;
        }

        // 3. Focal line: sections scrolled into view past the header line
        const focalLine = scrollY + 175;

        let activeId = 'hero';
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            if (el.offsetTop <= focalLine) {
              activeId = id;
            }
          }
        }

        updateActiveSection(activeId);
      });
    };

    const updateActiveSection = (id: string) => {
      setActiveSection((prev) => {
        if (prev !== id) {
          const targetPath = id === 'hero' ? '/' : `/${id}`;
          if (window.location.pathname !== targetPath) {
            window.history.replaceState({}, '', targetPath);
          }
          return id;
        }
        return prev;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const toggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const isNameValid = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const isPhoneValid = (phone: string): boolean => {
    const trimmed = phone.trim();
    if (/[a-zA-Z\u0600-\u06FF]/.test(trimmed)) return false;
    const digits = trimmed.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15;
  };

  const isFormValid = isNameValid(formData.name) && isPhoneValid(formData.phone);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || formStatus === 'submitting') return;

    setFormStatus('submitting');

    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();
    const notificationBody = `New call request\n\nName: ${trimmedName}\nPhone: ${trimmedPhone}`;

    const web3FormsKey =
      (import.meta.env.webformvite as string | undefined) ||
      import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ||
      '7372cb90-2eae-46c6-9948-94d5711b4ce4';
    const formspreeId = import.meta.env.VITE_FORMSPREE_ID;

    try {
      let isSuccess = false;

      if (formspreeId) {
        const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            subject: 'New call request',
            name: trimmedName,
            phone: trimmedPhone,
            message: notificationBody,
          }),
        });
        isSuccess = response.ok;
      } else if (web3FormsKey) {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: web3FormsKey,
            subject: 'New call request',
            from_name: 'UpStarts Call Request',
            name: trimmedName,
            phone: trimmedPhone,
            message: notificationBody,
            botcheck: '',
          }),
        });
        const data = await response.json();
        isSuccess = response.ok && data.success === true;
      } else {
        console.warn(
          'No form service configured. Set VITE_WEB3FORMS_ACCESS_KEY or VITE_FORMSPREE_ID in your environment variables.'
        );
        isSuccess = false;
      }

      if (isSuccess) {
        setFormStatus('success');
        setFormData({ name: '', phone: '' });
        setTimeout(() => {
          setFormStatus('idle');
        }, 4000);
      } else {
        setFormStatus('error');
        setTimeout(() => {
          setFormStatus('idle');
        }, 4000);
      }
    } catch (err) {
      console.error('Error submitting call request:', err);
      setFormStatus('error');
      setTimeout(() => {
        setFormStatus('idle');
      }, 4000);
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  return (
    <>
      {/* SVG Symbol Definitions */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <symbol id="i-fb" viewBox="0 0 24 24">
            <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
          </symbol>
          <symbol id="i-ig" viewBox="0 0 24 24">
            <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
          </symbol>
          <symbol id="i-tt" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </symbol>
          <symbol id="i-g" viewBox="0 0 24 24">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </symbol>
          <symbol id="i-wa" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </symbol>
          <symbol id="i-sc" viewBox="0 0 24 24">
            <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" />
          </symbol>
          <symbol id="i-ms" viewBox="0 0 24 24">
            <path d="M12 0C5.24 0 0 4.952 0 11.64c0 3.499 1.434 6.521 3.769 8.61a.96.96 0 0 1 .323.683l.065 2.135a.96.96 0 0 0 1.347.85l2.381-1.053a.96.96 0 0 1 .641-.046A13 13 0 0 0 12 23.28c6.76 0 12-4.952 12-11.64S18.76 0 12 0m6.806 7.44c.522-.03.971.567.63 1.094l-4.178 6.457a.707.707 0 0 1-.977.208l-3.87-2.504a.44.44 0 0 0-.49.007l-4.363 3.01c-.637.438-1.415-.317-.995-.966l4.179-6.457a.706.706 0 0 1 .977-.21l3.87 2.505c.15.097.344.094.491-.007l4.362-3.008a.7.7 0 0 1 .364-.13" />
          </symbol>
          <symbol id="i-gpt" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
          </symbol>
          <symbol id="i-store" viewBox="0 0 24 24">
            <path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" />
            <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" />
            <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" />
          </symbol>
          <symbol id="i-trend" viewBox="0 0 24 24">
            <path d="M16 7h6v6" />
            <path d="m22 7-8.5 8.5-5-5L2 17" />
          </symbol>
          <symbol id="i-list" viewBox="0 0 24 24">
            <path d="M13 5h8" />
            <path d="M13 12h8" />
            <path d="M13 19h8" />
            <path d="m3 17 2 2 4-4" />
            <path d="m3 7 2 2 4-4" />
          </symbol>
          <symbol id="i-bag" viewBox="0 0 24 24">
            <path d="M16 10a4 4 0 0 1-8 0" />
            <path d="M3.103 6.034h17.794" />
            <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
          </symbol>
          <symbol id="i-chat" viewBox="0 0 24 24">
            <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
          </symbol>
          <symbol id="i-pin" viewBox="0 0 24 24">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </symbol>
          <symbol id="i-globe" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </symbol>
        </defs>
      </svg>

      {/* Announcement Banner */}
      <div className="announce-bar">
        <a href="/pricing" onClick={(e) => navigate('/pricing', e)}>
          {lang === 'ar' ? 'احجز استشارة مجانيه!' : 'book your free audit!'}
        </a>
      </div>

      {/* Header */}
      <header>
        <div className="navbar">
          <a className="logo" href="/" onClick={(e) => navigate('/', e)} aria-label={lang === 'ar' ? 'الرئيسية' : 'Home'}>
            <span className="logo-mark">
              <svg viewBox="0 0 504 676" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M109.196 513.755C117.802 512.929 126.186 516.176 133.312 521.073L152.588 534.321C157.702 537.836 162.289 542.226 164.722 547.935C178.458 580.174 169.094 639.978 39.1436 675.373C32.8245 622.356 38.958 520.5 109.196 513.755ZM503.865 0.964844C504.236 192.188 412.262 340.662 324.562 432.885C333.636 473.579 325.41 561.883 227.793 643.645C231.69 615.145 236.034 550.54 222.434 518.977C222.023 519.235 221.614 519.494 221.207 519.748C217.429 524.444 211.767 525.168 206.345 524.237C201.536 523.412 196.825 521.275 193.554 519.322L130.241 475.809C127.246 473.454 123.562 469.821 121.068 465.628C118.256 460.899 116.539 455.699 119.569 450.489C119.641 450.117 119.807 449.656 119.973 449.194C120.136 448.739 120.3 448.282 120.375 447.909L118.862 451.686C84.6025 449.981 25.3458 477.407 0 491.334C41.5337 370.36 121.553 331.226 162.635 325.385C216.905 209.916 322.825 69.0931 502.964 0.344727L503.864 0L503.865 0.964844ZM405.881 135.983C386.765 122.845 360.617 127.691 347.479 146.808C334.34 165.924 339.187 192.072 358.303 205.21C377.419 218.348 403.568 213.502 416.706 194.386C429.844 175.269 424.997 149.122 405.881 135.983Z"
                  fill="#fff"
                />
              </svg>
            </span>
          </a>
          <nav className="desktop-nav">
            <a href="/" onClick={(e) => navigate('/', e)} className={activeSection === 'hero' ? 'active' : ''}>
              {lang === 'ar' ? 'الرئيسية' : 'Home'}
            </a>
            <a href="/services" onClick={(e) => navigate('/services', e)} className={activeSection === 'services' ? 'active' : ''}>
              {lang === 'ar' ? 'خدماتنا' : 'Services'}
            </a>
            <a href="/markets" onClick={(e) => navigate('/markets', e)} className={activeSection === 'markets' ? 'active' : ''}>
              {lang === 'ar' ? 'الأسواق' : 'Markets'}
            </a>
            <a href="/faq" onClick={(e) => navigate('/faq', e)} className={activeSection === 'faq' ? 'active' : ''}>
              {lang === 'ar' ? 'الأسئلة' : 'FAQ'}
            </a>
            <a href="/pricing" onClick={(e) => navigate('/pricing', e)} className={activeSection === 'pricing' ? 'active' : ''}>
              {lang === 'ar' ? 'بكام؟' : 'Pricing'}
            </a>
          </nav>
          <div className="nav-actions">
            <button className="lang-btn" id="langBtn" onClick={toggleLang}>
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
            <a href="/pricing" onClick={(e) => navigate('/pricing', e)} className="cta-btn">
              {lang === 'ar' ? 'اطلب عرض سعر' : 'Get a quote'}
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Tabs */}
      <nav className="mobile-tabs">
        <a href="/" onClick={(e) => navigate('/', e)} className={activeSection === 'hero' ? 'active' : ''}>
          <span className="pip"></span>
          <span className="label">{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
        </a>
        <a href="/services" onClick={(e) => navigate('/services', e)} className={activeSection === 'services' ? 'active' : ''}>
          <span className="pip"></span>
          <span className="label">{lang === 'ar' ? 'خدماتنا' : 'Services'}</span>
        </a>
        <a href="/markets" onClick={(e) => navigate('/markets', e)} className={activeSection === 'markets' ? 'active' : ''}>
          <span className="pip"></span>
          <span className="label">{lang === 'ar' ? 'الأسواق' : 'Markets'}</span>
        </a>
        <a href="/faq" onClick={(e) => navigate('/faq', e)} className={activeSection === 'faq' ? 'active' : ''}>
          <span className="pip"></span>
          <span className="label">{lang === 'ar' ? 'أسئلة' : 'FAQ'}</span>
        </a>
        <a href="/pricing" onClick={(e) => navigate('/pricing', e)} className={activeSection === 'pricing' ? 'active' : ''}>
          <span className="pip"></span>
          <span className="label">{lang === 'ar' ? 'بكام' : 'Price'}</span>
        </a>
      </nav>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="hero" id="hero">
          {/* Floating platform tiles filling the whole hero */}
          <div className="rain-box" aria-hidden="true">
            {RAIN_DROPS.map((drop, i) => (
              <div key={i} className={`drop ${drop.cls}`} style={drop.style}>
                <svg className={`ico ${drop.stroke ? 'stroke' : ''}`}>
                  <use href={drop.icon} />
                </svg>
                <span className="notif">{drop.notif}</span>
              </div>
            ))}
          </div>

          <div className="wrap hero-wrap">
            <div className="hero-content">
              <h1>
                <span className="hero-static">{lang === 'ar' ? 'خليها تمطر' : 'Let it rain'}</span>
                <span className="rotor" id="rotor">
                  <span className="rotor-sizer" aria-hidden="true">
                    {LONGEST_ROTOR_WORD[lang]}
                  </span>
                  {ROTOR_WORDS.map((w, idx) => {
                    const isCurrent = idx === currentWordIdx;
                    const isExiting = idx === exitingWordIdx;
                    const className = isCurrent ? 'show' : isExiting ? 'exit' : '';
                    return (
                      <span
                        key={idx}
                        className={className}
                        style={{ color: ROTOR_COLORS[idx % ROTOR_COLORS.length] }}
                      >
                        {w[lang]}
                      </span>
                    );
                  })}
                </span>
              </h1>
              <p className="lead">
                {lang === 'ar'
                  ? 'بنساعدك تكسب اكتر من خلال حملات تسويقيه متصممه عشان تحقق هدفك سواء مبيعات او ليدز او زيارات او ريتش.'
                  : "We help you grow revenue through tailored marketing campaigns designed to achieve your specific goals, whether it's sales, leads, website traffic, or reach."}
              </p>
              <div className="hero-actions">
                <a href="/pricing" onClick={(e) => navigate('/pricing', e)} className="cta-btn">
                  {lang === 'ar' ? 'ابدأ دلوقتي' : 'Start now'}
                </a>
                <a href="/services" onClick={(e) => navigate('/services', e)} className="btn-outline">
                  {lang === 'ar' ? 'شوف خدماتنا' : 'See services'}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services">
          <div className="wrap">
            <div className="section-head">
              <h2>{lang === 'ar' ? 'بنعمل ايه بالظبط' : 'What we actually do'}</h2>
            </div>
            <div className="card-grid">
              <div className="card">
                <div className="icon">
                  <svg className="ico stroke">
                    <use href="#i-trend" />
                  </svg>
                </div>
                <h3>{lang === 'ar' ? 'ديجيتال ماركتنج' : 'Digital marketing'}</h3>
                <p>
                  {lang === 'ar'
                    ? 'حملات وتسويق رقمي يركز على الوصول للعملاء المناسبين وتحويل الاهتمام لنتائج.'
                    : 'Digital campaigns focused on reaching the right customers and turning attention into results.'}
                </p>
              </div>
              <div className="card">
                <div className="icon">
                  <svg className="ico stroke">
                    <use href="#i-bag" />
                  </svg>
                </div>
                <h3>{lang === 'ar' ? 'مواقع' : 'Websites'}</h3>
                <p>
                  {lang === 'ar'
                    ? 'مواقع سريعة وواضحة ومصممة لتقديم الخدمة أو المنتج بشكل احترافي.'
                    : 'Fast, clear websites built to present your service or product professionally.'}
                </p>
              </div>
              <div className="card">
                <div className="icon">
                  <svg className="ico stroke">
                    <use href="#i-globe" />
                  </svg>
                </div>
                <h3>{lang === 'ar' ? 'SEO' : 'SEO'}</h3>
                <p>
                  {lang === 'ar'
                    ? 'تحسين الظهور في محركات البحث وزيادة فرص اكتشافك من العملاء.'
                    : 'Search optimization that increases your chances of being discovered by customers.'}
                </p>
              </div>
              <div className="card">
                <div className="icon">
                  <svg className="ico stroke">
                    <use href="#i-chat" />
                  </svg>
                </div>
                <h3>{lang === 'ar' ? 'عملاء من كل العالم' : 'Worldwide customers'}</h3>
                <p>
                  {lang === 'ar'
                    ? 'وصول وحملات تستهدف أسواقًا متعددة بدل الاعتماد على سوق واحد فقط.'
                    : 'Reach and campaigns built for multiple markets instead of relying on one market.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Markets & Platforms Section */}
        <section
          id="markets"
          style={{
            background: 'var(--surface)',
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <div className="wrap">
            <div className="section-head">
              <h2>{lang === 'ar' ? 'الأسواق والمنصات' : 'Markets & Platforms'}</h2>
            </div>
            <p className="group-label">{lang === 'ar' ? 'الأسواق' : 'Markets'}</p>
            <div className="chips-row" style={{ marginBottom: '28px' }}>
              <span className="chip-lg">
                <svg className="ico stroke">
                  <use href="#i-pin" />
                </svg>
                <span>{lang === 'ar' ? 'مصر' : 'Egypt'}</span>
              </span>
              <span className="chip-lg">
                <svg className="ico stroke">
                  <use href="#i-globe" />
                </svg>
                <span>{lang === 'ar' ? 'الخليج والوطن العربي' : 'Gulf & Arab world'}</span>
              </span>
              <span className="chip-lg">
                <svg className="ico stroke">
                  <use href="#i-pin" />
                </svg>
                <span>{lang === 'ar' ? 'أمريكا' : 'USA'}</span>
              </span>
              <span className="chip-lg">
                <svg className="ico stroke">
                  <use href="#i-pin" />
                </svg>
                <span>{lang === 'ar' ? 'كندا' : 'Canada'}</span>
              </span>
              <span className="chip-lg">
                <svg className="ico stroke">
                  <use href="#i-pin" />
                </svg>
                <span>{lang === 'ar' ? 'بريطانيا' : 'UK'}</span>
              </span>
              <span className="chip-lg">
                <svg className="ico stroke">
                  <use href="#i-pin" />
                </svg>
                <span>{lang === 'ar' ? 'أستراليا' : 'Australia'}</span>
              </span>
            </div>

            <p className="group-label">{lang === 'ar' ? 'المنصات' : 'Platforms'}</p>
            <div className="platform-grid">
              <div className="plat">
                <div className="badge t-fb">
                  <svg className="ico">
                    <use href="#i-fb" />
                  </svg>
                </div>
                Facebook
              </div>
              <div className="plat">
                <div className="badge t-ig">
                  <svg className="ico">
                    <use href="#i-ig" />
                  </svg>
                </div>
                Instagram
              </div>
              <div className="plat">
                <div className="badge t-tt">
                  <svg className="ico">
                    <use href="#i-tt" />
                  </svg>
                </div>
                TikTok
              </div>
              <div className="plat">
                <div className="badge t-g">
                  <svg className="ico">
                    <use href="#i-g" />
                  </svg>
                </div>
                Google
              </div>
              <div className="plat">
                <div className="badge t-sc">
                  <svg className="ico">
                    <use href="#i-sc" />
                  </svg>
                </div>
                Snapchat
              </div>
              <div className="plat">
                <div className="badge t-wa">
                  <svg className="ico">
                    <use href="#i-wa" />
                  </svg>
                </div>
                WhatsApp
              </div>
              <div className="plat">
                <div className="badge t-gpt">
                  <svg className="ico">
                    <use href="#i-gpt" />
                  </svg>
                </div>
                ChatGPT
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq">
          <div className="wrap">
            <div className="section-head">
              <h2>{lang === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked'}</h2>
            </div>
            <div className="faq">
              {FAQ_ITEMS.map((item, idx) => (
                <div key={idx} className={`faq-item ${openFaq === idx ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-q"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={openFaq === idx}
                  >
                    <span>{lang === 'ar' ? item.qAr : item.qEn}</span>
                    <span className="plus">+</span>
                  </button>
                  <div className="faq-a">
                    <p>{lang === 'ar' ? item.aAr : item.aEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing / Contact Section */}
        <section id="pricing">
          <div className="wrap">
            <div className="price-wrap">
              <div className="price-card">
                <h2>{lang === 'ar' ? 'بكام؟' : 'How much?'}</h2>
                <form onSubmit={handleFormSubmit}>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={lang === 'ar' ? 'اسمك' : 'Your name'}
                    disabled={formStatus === 'submitting'}
                  />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={lang === 'ar' ? 'رقمك' : 'Phone number'}
                    disabled={formStatus === 'submitting'}
                  />
                  <button
                    type="submit"
                    disabled={!isFormValid || formStatus === 'submitting' || formStatus === 'success'}
                  >
                    {formStatus === 'submitting'
                      ? lang === 'ar'
                        ? 'جاري الإرسال...'
                        : 'Sending...'
                      : formStatus === 'success'
                      ? lang === 'ar'
                        ? 'تم الإرسال ✓'
                        : 'Sent ✓'
                      : formStatus === 'error'
                      ? lang === 'ar'
                        ? 'فشل الإرسال، حاول مجدداً'
                        : 'Failed, try again'
                      : lang === 'ar'
                      ? 'إرسال'
                      : 'Send'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
