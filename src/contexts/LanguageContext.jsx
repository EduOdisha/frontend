import { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

const LanguageContext = createContext();

const translations = {
  en: {
    nav: {
      colleges: 'Colleges',
      courses: 'Courses',
      exams: 'Exams',
      scholarships: 'Scholarships',
      compare: 'Compare',
      career: 'Career',
      signIn: 'Sign In',
      getStarted: 'Get Started',
      dashboard: 'Dashboard',
      signOut: 'Sign Out'
    },
    hero: {
      badge: "🎓 Odisha's Trusted Education Platform",
      title: "Find Your Perfect",
      titleAccent: "College in Odisha",
      subtitle: "Discover 500+ colleges, compare courses, explore scholarships, and get personalized career guidance — all in one platform.",
      searchPlaceholder: "Search {type} in Odisha...",
      trending: "Trending",
      cta: "🔍 Search"
    },
    common: {
      viewAll: "View All",
      comingSoon: "Coming Soon"
    }
  },
  or: {
    nav: {
      colleges: 'କଲେଜଗୁଡିକ',
      courses: 'ପାଠ୍ୟକ୍ରମ',
      exams: 'ପରୀକ୍ଷା',
      scholarships: 'ଛାତ୍ରବୃତ୍ତି',
      compare: 'ତୁଳନା',
      career: 'କ୍ୟାରିଅର୍',
      signIn: 'ଲଗ୍ ଇନ୍',
      getStarted: 'ଆରମ୍ଭ କରନ୍ତୁ',
      dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
      signOut: 'ଲଗ୍ ଆଉଟ୍'
    },
    hero: {
      badge: "🎓 ଓଡିଶାର ବିଶ୍ୱସ୍ତ ଶିକ୍ଷା ପ୍ଲାଟଫର୍ମ",
      title: "ଆପଣଙ୍କର ଉପଯୁକ୍ତ",
      titleAccent: "ଓଡିଶାରେ କଲେଜ ଖୋଜନ୍ତୁ",
      subtitle: "୫୦୦+ କଲେଜ୍ ଆବିଷ୍କାର କରନ୍ତୁ, ପାଠ୍ୟକ୍ରମ ତୁଳନା କରନ୍ତୁ, ଛାତ୍ରବୃତ୍ତି ଅନୁସନ୍ଧାନ କରନ୍ତୁ ଏବଂ ବ୍ୟକ୍ତିଗତ କ୍ୟାରିଅର୍ ମାର୍ଗଦର୍ଶନ ପାଆନ୍ତୁ - ସବୁ ଗୋଟିଏ ପ୍ଲାଟଫର୍ମରେ।",
      searchPlaceholder: "ଓଡିଶାରେ {type} ଖୋଜନ୍ତୁ...",
      trending: "ଟ୍ରେଣ୍ଡିଂ",
      cta: "🔍 ଖୋଜନ୍ତୁ"
    },
    common: {
      viewAll: "ସବୁ ଦେଖନ୍ତୁ",
      comingSoon: "ଖୁବ୍ ଶୀଘ୍ର ଆସୁଛି"
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const { language } = useSelector((state) => state.ui);
  
  const t = (path) => {
    const keys = path.split('.');
    let result = translations[language] || translations.en;
    
    for (const key of keys) {
      if (result[key]) {
        result = result[key];
      } else {
        // Fallback to English if key missing in Odia
        let fallback = translations.en;
        for (const fKey of keys) {
          fallback = fallback[fKey] || path;
        }
        return fallback;
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ t, language }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
