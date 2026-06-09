import { 
  ShieldCheck, 
  MapPin, 
  GraduationCap, 
  Search, 
  BookOpen, 
  Award, 
  Scale, 
  Compass, 
  Sparkles
} from 'lucide-react';

export const ABOUT_CONTENT = {
  en: {
    hero: {
      eyebrow: 'Who We Are',
      title: "Odisha's Dedicated",
      titleAccent: "Education Platform",
      subtitle: "Empowering students, parents, and educators with 100% verified information on colleges, courses, scholarships, and exams across Odisha. We bridge the gap between dreams and careers.",
    },
    mission: {
      title: "Our Mission & Vision",
      subtitle: "To simplify higher education selection for every student in Odisha by offering transparent, spam-free guidance and technology-driven tools.",
      values: [
        {
          title: "Transparency First",
          desc: "We provide clean, unbiased data on rankings, fees, and placements. No hidden sponsorships, no promotional bias.",
          icon: ShieldCheck,
          color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/30 glow-emerald"
        },
        {
          title: "Odisha Focused",
          desc: "Unlike generic national databases, we track local colleges, state-specific exams, and local scholarships that impact Odisha students directly.",
          icon: MapPin,
          color: "text-primary-500 bg-primary-500/10 border-primary-500/20 dark:border-primary-500/30 glow-primary"
        },
        {
          title: "Student Empowerment",
          desc: "From smart multi-college comparison grids to 1-on-1 career assistance, we put decision-making power back in your hands.",
          icon: GraduationCap,
          color: "text-amber-500 bg-amber-500/10 border-amber-500/20 dark:border-amber-500/30 glow-amber"
        }
      ]
    },
    services: {
      title: "Services We Provide",
      subtitle: "Explore the features and resources built specifically to ease your academic journey.",
      items: [
        {
          title: "Verified College Directory",
          desc: "Discover detailed information on fees, course options, NIRF rankings, and placement metrics for colleges in Odisha.",
          icon: Search
        },
        {
          title: "Comprehensive Exams Portal",
          desc: "Stay updated with registration timelines, eligibility requirements, syllabus details, and cutoff predictions for OJEE, JEE, NEET, and more.",
          icon: BookOpen
        },
        {
          title: "Local Scholarship Matcher",
          desc: "Unlock state government programs (like Prerana) and private scholarships. Filter by category, income level, and merit requirements.",
          icon: Award
        },
        {
          title: "Smart College Comparison",
          desc: "Compare up to 4 colleges side-by-side on critical metrics like fees, NAAC grades, placement packages, and student facilities.",
          icon: Scale
        },
        {
          title: "Interactive Career Maps",
          desc: "Explore comprehensive academic and salary paths mapped specifically for students after completing 10th and 12th standards.",
          icon: Compass
        },
        {
          title: "AI-Powered Assistant",
          desc: "Get instant, personalized guidance regarding colleges, eligibility, and courses in Odisha, 24/7.",
          icon: Sparkles
        }
      ]
    },
    stats: [
      { value: "1 Lakh+", label: "Students Helped" },
      { value: "500+", label: "Verified Colleges" },
      { value: "50+", label: "Scholarship Schemes" },
      { value: "100%", label: "Spam-Free Counseling" }
    ],
    cta: {
      title: "Need Personalized Advice?",
      desc: "Speak with our dedicated career counsellors. Get unbiased guidance tailored to your strengths and career aspirations.",
      btnCall: "Call Counsellor",
      btnBrowse: "Explore Colleges"
    }
  },
  hi: {
    hero: {
      eyebrow: 'हम कौन हैं',
      title: "ओडिशा का समर्पित",
      titleAccent: "शिक्षा मंच",
      subtitle: "ओडिशा भर के कॉलेजों, पाठ्यक्रमों, छात्रवृत्ति और परीक्षाओं के बारे में 100% सत्यापित जानकारी के साथ छात्रों, अभिभावकों और शिक्षकों को सशक्त बनाना। हम सपनों और करियर के बीच की दूरी को पाटते हैं।",
    },
    mission: {
      title: "हमारा उद्देश्य और दृष्टिकोण",
      subtitle: "पारदर्शी, स्पैम-मुक्त मार्गदर्शन और तकनीक-संचालित उपकरणों की पेशकश करके ओडिशा के प्रत्येक छात्र के लिए उच्च शिक्षा चयन को सरल बनाना।",
      values: [
        {
          title: "पारदर्शिता पहले",
          desc: "हम रैंकिंग, फीस और प्लेसमेंट पर स्पष्ट, निष्पक्ष डेटा प्रदान करते हैं। कोई छिपे हुए प्रायोजन नहीं, कोई प्रचार पक्षपात नहीं।",
          icon: ShieldCheck,
          color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/30 glow-emerald"
        },
        {
          title: "ओडिशा पर केंद्रित",
          desc: "सामान्य राष्ट्रीय डेटाबेस के विपरीत, हम स्थानीय कॉलेजों, राज्य-विशिष्ट परीक्षाओं और स्थानीय छात्रवृत्तियों पर नज़र रखते हैं जो सीधे ओडिशा के छात्रों को प्रभावित करते हैं।",
          icon: MapPin,
          color: "text-primary-500 bg-primary-500/10 border-primary-500/20 dark:border-primary-500/30 glow-primary"
        },
        {
          title: "छात्र सशक्तिकरण",
          desc: "स्मार्ट मल्टी-कॉलेज तुलना ग्रिड से लेकर 1-ऑन-1 करियर सहायता तक, हम निर्णय लेने की शक्ति वापस आपके हाथों में देते हैं।",
          icon: GraduationCap,
          color: "text-amber-500 bg-amber-500/10 border-amber-500/20 dark:border-amber-500/30 glow-amber"
        }
      ]
    },
    services: {
      title: "हमारी सेवाएं",
      subtitle: "अकादमिक यात्रा को आसान बनाने के लिए विशेष रूप से बनाई गई सुविधाओं और संसाधनों का पता लगाएं।",
      items: [
        {
          title: "सत्यापित कॉलेज निर्देशिका",
          desc: "ओडिशा के कॉलेजों के लिए फीस, पाठ्यक्रम विकल्प, NIRF रैंकिंग और प्लेसमेंट मेट्रिक्स पर विस्तृत जानकारी खोजें।",
          icon: Search
        },
        {
          title: "व्यापक परीक्षा पोर्टल",
          desc: "OJEE, JEE, NEET और अन्य परीक्षाओं के लिए पंजीकरण समय सीमा, पात्रता आवश्यकताओं, पाठ्यक्रम विवरण और कटऑफ भविष्यवाणियों के साथ अपडेट रहें।",
          icon: BookOpen
        },
        {
          title: "स्थानीय छात्रवृत्ति खोजक",
          desc: "राज्य सरकार के कार्यक्रमों (जैसे प्रेरणा) और निजी छात्रवृत्ति का लाभ उठाएं। श्रेणी, आय स्तर और योग्यता आवश्यकताओं के अनुसार फ़िल्टर करें।",
          icon: Award
        },
        {
          title: "स्मार्ट कॉलेज तुलना",
          desc: "फीस, NAAC ग्रेड, प्लेसमेंट पैकेज और छात्र सुविधाओं जैसे महत्वपूर्ण मापदंडों पर 4 कॉलेजों की आपस में तुलना करें।",
          icon: Scale
        },
        {
          title: "इंटरैक्टिव करियर मैप्स",
          desc: "10वीं और 12वीं कक्षा पूरी करने के बाद छात्रों के लिए विशेष रूप से तैयार किए गए शैक्षणिक और वेतन पथों का पता लगाएं।",
          icon: Compass
        },
        {
          title: "एआई-संचालित सहायक",
          desc: "ओडिशा में कॉलेजों, पात्रता और पाठ्यक्रमों के बारे में तुरंत, व्यक्तिगत मार्गदर्शन प्राप्त करें, 24/7।",
          icon: Sparkles
        }
      ]
    },
    stats: [
      { value: "1 लाख+", label: "मदद किए गए छात्र" },
      { value: "500+", label: "सत्यापित कॉलेज" },
      { value: "50+", label: "छात्रवृत्ति योजनाएं" },
      { value: "100%", label: "स्पैम-मुक्त परामर्श" }
    ],
    cta: {
      title: "व्यक्तिगत सलाह की आवश्यकता है?",
      desc: "हमारे समर्पित करियर सलाहकारों से बात करें। अपनी शक्तियों और करियर आकांक्षाओं के अनुरूप निष्पक्ष मार्गदर्शन प्राप्त करें।",
      btnCall: "सलाहकार को कॉल करें",
      btnBrowse: "कॉलेज देखें"
    }
  },
  or: {
    hero: {
      eyebrow: 'ଆମେ କିଏ',
      title: "ଓଡ଼ିଶାର ସମର୍ପିତ",
      titleAccent: "ଶିକ୍ଷା ପ୍ଲାଟଫର୍ମ",
      subtitle: "ଓଡ଼ିଶାର ସମସ୍ତ କଲେଜ, ପାଠ୍ୟକ୍ରମ, ବୃତ୍ତି ଏବଂ ପରୀକ୍ଷା ବିଷୟରେ ୧୦୦% ଯାଞ୍ଚ ହୋଇଥିବା ତଥ୍ୟ ଦ୍ୱାରା ଛାତ୍ର, ଅଭିଭାବକ ଓ ଶିକ୍ଷକମାନଙ୍କୁ ସଶକ୍ତ କରିବା। ଆମେ ସ୍ୱପ୍ନ ଓ କ୍ୟାରିୟର ମଧ୍ୟରେ ସେତୁ ନିର୍ମାଣ କରୁ।",
    },
    mission: {
      title: "ଆମର ଲକ୍ଷ୍ୟ ଓ ଦୂରଦୃଷ୍ଟି",
      subtitle: "ସ୍ୱଚ୍ଛ, ସ୍ପାମ୍-ମୁକ୍ତ ମାର୍ଗଦର୍ଶନ ଏବଂ ପ୍ରଯୁକ୍ତିବିଦ୍ୟା-ଚାଳିତ ଉପକରଣ ପ୍ରଦାନ କରି ଓଡ଼ିଶାର ପ୍ରତ୍ୟେକ ଛାତ୍ରଙ୍କ ପାଇଁ ଉଚ୍ଚଶିକ୍ଷା ଚୟନ ପ୍ରକ୍ରିୟାକୁ ସରଳ କରିବା।",
      values: [
        {
          title: "ସ୍ୱଚ୍ଛତା ପ୍ରଥମେ",
          desc: "ଆମେ ରାଙ୍କିଙ୍ଗ, ଫି ଏବଂ ପ୍ଲେସମେଣ୍ଟ ଉପରେ ସ୍ପଷ୍ଟ ଏବଂ ନିରପେକ୍ଷ ତଥ୍ୟ ପ୍ରଦାନ କରୁ। କୌଣସି ଗୁପ୍ତ ପ୍ରାୟୋଜକତା ବା ପକ୍ଷପାତ ନାହିଁ।",
          icon: ShieldCheck,
          color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/30 glow-emerald"
        },
        {
          title: "ଓଡ଼ିଶା କେନ୍ଦ୍ରିତ",
          desc: "ସାଧାରଣ ଜାତୀୟ ଡାଟาବେସ୍ ପରି ନୁହେଁ, ଆମେ ବିଶେଷ ଭାବେ ଓଡ଼ିଶାର କଲେଜ, ପରୀକ୍ଷା ଓ ରାଜ୍ୟ ସ୍କଲାରସିପ୍ ଉପରେ ନଜର ରଖୁ।",
          icon: MapPin,
          color: "text-primary-500 bg-primary-500/10 border-primary-500/20 dark:border-primary-500/30 glow-primary"
        },
        {
          title: "ଛାତ୍ର ସଶକ୍ତିକରଣ",
          desc: "ସ୍ମାର୍ଟ କଲେଜ ତୁଳନା ଠାରୁ ଆରମ୍ଭ କରି ବ୍ୟକ୍ତିଗତ କ୍ୟାରିୟର ପରାମର୍ଶ ପର୍ଯ୍ୟନ୍ତ, ଆମେ ନିଷ୍ପତ୍ତି ନେବାର ଶକ୍ତି ଆପଣଙ୍କ ହାତକୁ ଫେରାଇ ଦେଉ।",
          icon: GraduationCap,
          color: "text-amber-500 bg-amber-500/10 border-amber-500/20 dark:border-amber-500/30 glow-amber"
        }
      ]
    },
    services: {
      title: "ଆମେ ପ୍ରଦାନ କରୁଥିବା ସେବା ସମୂହ",
      subtitle: "ଆପଣଙ୍କ ଶିକ୍ଷାଗତ ଯାତ୍ରାକୁ ସହଜ କରିବା ପାଇଁ ବିଶେଷ ଭାବେ ନିର୍ମିତ ସୁବିଧା ଓ ସମ୍ବଳଗୁଡ଼ିକୁ ଅନ୍ୱେଷଣ କରନ୍ତୁ।",
      items: [
        {
          title: "ଯାଞ୍ଚ ହୋଇଥିବା କଲେଜ ଡିରେକ୍ଟୋରୀ",
          desc: "ଓଡ଼ିଶାର କଲେଜଗୁଡ଼ିକ ପାଇଁ ଫି, ପାଠ୍ୟକ୍ରମ ବିକଳ୍ପ, NIRF ରାଙ୍କିଙ୍ଗ ଏବଂ ପ୍ଲେସମେଣ୍ଟ ରେକର୍ଡର ସବିଶେଷ ତଥ୍ୟ ପାଆନ୍ତୁ।",
          icon: Search
        },
        {
          title: "ବ୍ୟାପକ ପରୀକ୍ଷା ପୋର୍ଟାଲ",
          desc: "OJEE, JEE, NEET ଏବଂ ଅନ୍ୟାନ୍ୟ ପରୀକ୍ଷାର ପଞ୍ଜୀକରଣ ସମୟସୀମା, ଯୋଗ୍ୟତା ମାନଦଣ୍ଡ ଓ କଟଅଫ୍ ବିଷୟରେ ଅଦ୍ୟତନ ରୁହନ୍ତୁ।",
          icon: BookOpen
        },
        {
          title: "ସ୍ଥାନୀୟ ବୃତ୍ତି ସନ୍ଧାନକାରୀ",
          desc: "ରାଜ୍ୟ ସରକାରଙ୍କ ଯୋଜନା (ଯେପରିକି ପ୍ରେରଣା) ଏବଂ ବେସରକାରୀ ସ୍କଲାରସିପ୍ ଫିଲ୍ଟର କରି ସହଜରେ ଆବେଦନ କରନ୍ତୁ।",
          icon: Award
        },
        {
          title: "ସ୍ମାର୍ଟ କଲେଜ ତୁଳନା",
          desc: "ଫି, NAAC ଗ୍ରେଡ୍, ପ୍ଲେସମେଣ୍ଟ ପ୍ୟାକେଜ୍ ଏବଂ କଲେଜ ସୁବିଧା ଆଦିକୁ ନେଇ ସହଜରେ ୪ଟି କଲେଜ ମଧ୍ୟରେ ତୁଳନା କରନ୍ତୁ।",
          icon: Scale
        },
        {
          title: "ଇଣ୍ଟରାକ୍ଟିଭ୍ କ୍ୟାରିୟର ମ୍ୟାପ୍",
          desc: "୧୦ମ ଏବଂ ୧୨ଶ ଶ୍ରେଣୀ ପରେ ଛାତ୍ରମାନଙ୍କ ପାଇଁ ପ୍ରସ୍ତୁତ ବିସ୍ତୃତ କ୍ୟାରିୟର ପଥ ଓ ଦରମା ସଂଭାବନା ଅନ୍ୱେଷଣ କରନ୍ତୁ।",
          icon: Compass
        },
        {
          title: "ଏଆଇ-ଚାଳିତ ସହାୟକ",
          desc: "ଓଡ଼ିଶାର କଲେଜ, ଯୋଗ୍ୟତା ଏବଂ ପାଠ୍ୟକ୍ରମ ସମ୍ବନ୍ଧରେ ୨୪/୭ ତତ୍କାଳ ଓ ବ୍ୟକ୍ତିଗତ ମାର୍ଗଦର୍ଶନ ପାଆନ୍ତୁ।",
          icon: Sparkles
        }
      ]
    },
    stats: [
      { value: "୧ ଲକ୍ଷ+", label: "ଛାତ୍ରଙ୍କୁ ସହାୟତା" },
      { value: "୫୦୦+", label: "ଯାଞ୍ଚ ହୋଇଥିବା କଲେଜ" },
      { value: "୫୦+", label: "ବୃତ୍ତି ଯୋଜନା" },
      { value: "୧୦୦%", label: "ସ୍ପାମ୍-ମୁକ୍ତ ପରାମର୍ଶ" }
    ],
    cta: {
      title: "ବ୍ୟକ୍ତିଗତ ପରାମର୍ଶ ଆବଶ୍ୟକ କି?",
      desc: "ଆମର ଅଭିଜ୍ଞ ପରାମର୍ଶଦାତାଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ। ଆପଣଙ୍କ ଆଗ୍ରହ ଓ ଦକ୍ଷତା ଅନୁଯାୟୀ ସଠିକ୍ ପରାମର୍ଶ ପାଆନ୍ତୁ।",
      btnCall: "କଲ୍ କରନ୍ତୁ",
      btnBrowse: "କଲେଜ ଦେଖନ୍ତୁ"
    }
  }
};
