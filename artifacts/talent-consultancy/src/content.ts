export type Language = "ES" | "EN" | "PT";

export const languages: Language[] = ["ES", "EN", "PT"];

export const translations = {
  ES: {
    languageLabel: "Seleccionar idioma",
    navLabel: "Navegación principal",
    navCompanies: "Empresas",
    navPipeline: "Nuestro proceso",
    navConnect: "Conecta tu talento",
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
    hero: {
      eyebrow: "Consultoría independiente de talento",
      title: "Conectando talento con oportunidades.",
      intro:
        "Acompañamos a empresas y profesionales en decisiones que transforman carreras y hacen crecer organizaciones. Búsqueda precisa. Conexiones con propósito.",
      primaryCta: "Hablemos",
      secondaryCta: "Ver servicios",
      stats: [
        { value: "Búsqueda", label: "especializada" },
        { value: "Alcance", label: "internacional" },
        { value: "Trato", label: "personalizado" },
      ],
      imageAlt: "Profesionales conversan durante una reunión en una oficina luminosa",
      imageLabel: "Talento conectado · En todas partes",
      ariaLabel: "Fortuna Connect: consultoría de talento",
    },
    ticker: [
      "Búsqueda ejecutiva",
      "Selección especializada",
      "Equipos dedicados",
      "Evaluación",
      "Idiomas",
    ],
    services: {
      eyebrow: "01 / Empresas",
      title: "Las personas adecuadas impulsan lo que sigue.",
      intro:
        "Cada decisión de talento define el rumbo de una organización. Combinamos conocimiento del mercado, criterio y cercanía en cada proceso.",
      items: [
        {
          title: "Headhunting Ejecutivo",
          description:
            "Identificamos líderes y perfiles C-level que impulsan decisiones y transforman el negocio.",
        },
        {
          title: "Selección de Personal",
          description:
            "Encontramos especialistas con experiencia y motivación alineadas con tu equipo.",
        },
        {
          title: "Outsourcing de Talento",
          description:
            "Sumamos talento dedicado y flexible para acelerar proyectos y fortalecer equipos.",
        },
        {
          title: "Nivelación de Idiomas",
          description:
            "Evaluamos el nivel actual e impulsamos habilidades lingüísticas para el trabajo.",
        },
        {
          title: "Evaluaciones Psicotécnicas",
          description:
            "Analizamos competencias y comportamientos para tomar decisiones con mayor claridad.",
        },
      ],
    },
    pipeline: {
      eyebrow: "02 / Nuestro proceso",
      title: "Señal sobre ruido. Siempre.",
      intro:
        "Hacemos el trabajo antes de presentar un perfil: contexto, capacidades, motivación y esos detalles que convierten una contratación en una buena decisión.",
      principles: [
        "Entender el reto antes de definir el perfil.",
        "Evaluar capacidades, motivación y contexto.",
        "Acompañar la decisión hasta una integración sólida.",
      ],
      widgetLabel: "Así conectamos talento",
      widgetCaption: "Un proceso claro, de principio a fin",
      illustrative: "Vista ilustrativa",
      tabsLabel: "Etapas del proceso de selección",
      profileLabel: "Perfil profesional",
      profileDetail: "Liderazgo · Operaciones",
      profileStatus: "En evaluación",
      stageProgress: "Etapa",
      stages: [
        {
          name: "Búsqueda",
          status: "Mapeo de talento",
          title: "Encontramos la señal.",
          body:
            "Definimos el contexto y mapeamos profesionales cuyo recorrido y momento encajan con el reto.",
          metric: "01",
          metricLabel: "Identificar",
        },
        {
          name: "Evaluación",
          status: "Conversaciones",
          title: "Conocemos a la persona.",
          body:
            "Profundizamos en experiencia, motivación, competencias y expectativas para validar el ajuste.",
          metric: "02",
          metricLabel: "Comprender",
        },
        {
          name: "Conexión",
          status: "Alineación final",
          title: "Creamos una conexión duradera.",
          body:
            "Presentamos perfiles con fundamento y acompañamos a ambas partes hacia una decisión segura.",
          metric: "03",
          metricLabel: "Conectar",
        },
      ],
      next: "Siguiente etapa",
      restart: "Volver al inicio",
      progressLabel: "Avance del proceso",
    },
    candidate: {
      eyebrow: "03 / Profesionales",
      title: "Una nueva oportunidad empieza con menos fricción.",
      intro:
        "Sin portales interminables ni formularios confusos. Comparte lo esencial y nuestro equipo dará seguimiento personalmente.",
      panelLabel: "Conexión de talento",
      completeLabel: "COMPLETADO",
      progressLabel: "Avance",
      startTitle: "Empecemos por conocerte.",
      startBody:
        "Continúa con LinkedIn o comparte tus datos en unos pocos pasos. Nuestro equipo revisará tu perfil personalmente.",
      linkedin: "Continuar con LinkedIn",
      manualDivider: "o continúa manualmente",
      manual: "Usar el formulario breve",
      roleTitle: "¿Qué tipo de oportunidad buscas?",
      roleBody:
        "Cuéntanos qué función o próximo paso tienes en mente.",
      roleLabel: "Puesto o área de interés",
      rolePlaceholder: "Ej.: Dirección de Producto, tecnología",
      cvTitle: "Comparte tu experiencia.",
      cvBody:
        "Adjunta tu CV en PDF, DOC o DOCX. Tamaño máximo: 8 MB.",
      cvChoose: "Arrastra tu CV o selecciona un archivo",
      cvConfidential: "Tu información se trata de forma confidencial.",
      emailTitle: "¿Dónde podemos contactarte?",
      emailBody:
        "Usaremos tu correo para responderte personalmente. Sin boletines ni mensajes automáticos.",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu@correo.com",
      submit: "Enviar mis datos",
      next: "Siguiente",
      back: "Volver",
      completeTitle: "Ya estás en nuestro radar.",
      completeBody:
        "Gracias por compartir tu próximo paso con Fortuna Connect. Nuestro equipo revisará tu información y se pondrá en contacto contigo en {email}.",
      restart: "Iniciar otra conversación",
      errors: {
        fileSize: "El archivo debe pesar menos de 8 MB.",
        roleRequired: "Cuéntanos qué puesto o área estás buscando.",
        cvRequired: "Adjunta tu CV para que podamos conocerte mejor.",
        invalidEmail: "Escribe un correo electrónico válido.",
      },
      progressAria: "Avance: {current} de 4",
    },
    quote: {
      ariaLabel: "La perspectiva de Fortuna Connect",
      text: "“El talento adecuado no solo ocupa un puesto. Abre nuevas posibilidades.”",
      aside:
        "Conectamos la ambición de las personas con el momento y la visión de cada organización.",
    },
    footer: {
      tagline: "Conectamos talento con las oportunidades que vienen.",
      explore: "Explorar",
      contact: "Conectar",
      companies: "Empresas",
      pipeline: "Nuestro proceso",
      connect: "Conecta tu talento",
      website: "Visita thefortunaconnect.com",
      locations: "Conectando talento, en todas partes",
      rights: "Todos los derechos reservados.",
    },
  },
  EN: {
    languageLabel: "Select language",
    navLabel: "Main navigation",
    navCompanies: "For companies",
    navPipeline: "Our process",
    navConnect: "Connect talent",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    hero: {
      eyebrow: "Independent talent consultancy",
      title: "Connecting talent with opportunity.",
      intro:
        "We support companies and professionals through decisions that shape careers and grow organizations. Precise search. Connections with purpose.",
      primaryCta: "Start a conversation",
      secondaryCta: "Explore services",
      stats: [
        { value: "Focused", label: "search" },
        { value: "Global", label: "reach" },
        { value: "Personal", label: "attention" },
      ],
      imageAlt: "Professionals talking during a meeting in a bright office",
      imageLabel: "Talent connected · Everywhere",
      ariaLabel: "Fortuna Connect: talent consultancy",
    },
    ticker: [
      "Executive search",
      "Specialist recruitment",
      "Dedicated teams",
      "Assessment",
      "Languages",
    ],
    services: {
      eyebrow: "01 / Companies",
      title: "The right people move what comes next.",
      intro:
        "Every talent decision shapes an organization's direction. We bring market insight, sound judgment, and personal attention to every search.",
      items: [
        {
          title: "Executive Search",
          description:
            "We find leaders and C-level talent who shape decisions and move businesses forward.",
        },
        {
          title: "Specialist Recruitment",
          description:
            "We find specialists whose experience and motivation align with your team.",
        },
        {
          title: "Talent Outsourcing",
          description:
            "Add flexible, dedicated talent to accelerate projects and strengthen teams.",
        },
        {
          title: "Language Assessment",
          description:
            "Assess current proficiency and build language skills for the workplace.",
        },
        {
          title: "Psychometric Assessments",
          description:
            "Understand capabilities and behavior to make clearer hiring decisions.",
        },
      ],
    },
    pipeline: {
      eyebrow: "02 / Our process",
      title: "Signal over noise. Always.",
      intro:
        "We do the work before introducing a profile: context, capability, motivation, and the details that make a hire a good decision.",
      principles: [
        "Understand the challenge before defining the role.",
        "Assess capability, motivation, and context.",
        "Support the decision through a strong start.",
      ],
      widgetLabel: "How we connect talent",
      widgetCaption: "A clear process, from start to finish",
      illustrative: "Illustrative preview",
      tabsLabel: "Recruitment process stages",
      profileLabel: "Professional profile",
      profileDetail: "Leadership · Operations",
      profileStatus: "In assessment",
      stageProgress: "Stage",
      stages: [
        {
          name: "Sourcing",
          status: "Talent mapping",
          title: "We find the signal.",
          body:
            "We define the context and map professionals whose experience and timing fit the challenge.",
          metric: "01",
          metricLabel: "Identify",
        },
        {
          name: "Assessment",
          status: "Conversations",
          title: "We get to know the person.",
          body:
            "We explore experience, motivation, capabilities, and expectations to validate the fit.",
          metric: "02",
          metricLabel: "Understand",
        },
        {
          name: "Match",
          status: "Final alignment",
          title: "We build a lasting connection.",
          body:
            "We present well-supported profiles and guide both sides toward a confident decision.",
          metric: "03",
          metricLabel: "Connect",
        },
      ],
      next: "Next stage",
      restart: "Back to start",
      progressLabel: "Process progress",
    },
    candidate: {
      eyebrow: "03 / Professionals",
      title: "A new opportunity starts with less friction.",
      intro:
        "No endless portals or confusing forms. Share the essentials and our team will follow up personally.",
      panelLabel: "Talent connection",
      completeLabel: "COMPLETE",
      progressLabel: "Progress",
      startTitle: "Let's start with you.",
      startBody:
        "Continue with LinkedIn or share your details in a few short steps. Our team will review your profile personally.",
      linkedin: "Continue with LinkedIn",
      manualDivider: "or continue manually",
      manual: "Use the short form",
      roleTitle: "What kind of opportunity are you looking for?",
      roleBody:
        "Tell us the role or next step you have in mind.",
      roleLabel: "Role or area of interest",
      rolePlaceholder: "e.g. Product leadership, technology",
      cvTitle: "Share your experience.",
      cvBody:
        "Attach your CV in PDF, DOC, or DOCX format. Maximum size: 8 MB.",
      cvChoose: "Drop your CV or choose a file",
      cvConfidential: "Your information is handled confidentially.",
      emailTitle: "Where can we reach you?",
      emailBody:
        "We'll use your email to reply personally. No newsletters or automated messages.",
      emailLabel: "Email address",
      emailPlaceholder: "you@email.com",
      submit: "Send my details",
      next: "Next",
      back: "Back",
      completeTitle: "You're on our radar.",
      completeBody:
        "Thank you for sharing your next step with Fortuna Connect. Our team will review your details and get in touch at {email}.",
      restart: "Start another conversation",
      errors: {
        fileSize: "Please choose a file smaller than 8 MB.",
        roleRequired: "Tell us which role or area you're exploring.",
        cvRequired: "Attach your CV so we can get to know you.",
        invalidEmail: "Enter a valid email address.",
      },
      progressAria: "Progress: {current} of 4",
    },
    quote: {
      ariaLabel: "The Fortuna Connect perspective",
      text: "“The right talent does more than fill a role. It opens new possibilities.”",
      aside:
        "We connect people's ambition with the right moment and vision for each organization.",
    },
    footer: {
      tagline: "Connecting talent with the opportunities ahead.",
      explore: "Explore",
      contact: "Connect",
      companies: "For companies",
      pipeline: "Our process",
      connect: "Connect talent",
      website: "Visit thefortunaconnect.com",
      locations: "Connecting talent, everywhere",
      rights: "All rights reserved.",
    },
  },
  PT: {
    languageLabel: "Selecionar idioma",
    navLabel: "Navegação principal",
    navCompanies: "Empresas",
    navPipeline: "Nosso processo",
    navConnect: "Conecte talentos",
    menuOpen: "Abrir menu",
    menuClose: "Fechar menu",
    hero: {
      eyebrow: "Consultoria independente de talentos",
      title: "Conectando talentos a oportunidades.",
      intro:
        "Apoiamos empresas e profissionais em decisões que transformam carreiras e fazem organizações crescer. Busca precisa. Conexões com propósito.",
      primaryCta: "Vamos conversar",
      secondaryCta: "Conheça os serviços",
      stats: [
        { value: "Busca", label: "especializada" },
        { value: "Alcance", label: "internacional" },
        { value: "Atenção", label: "personalizada" },
      ],
      imageAlt: "Profissionais conversam durante uma reunião em um escritório iluminado",
      imageLabel: "Talentos conectados · Em toda parte",
      ariaLabel: "Fortuna Connect: consultoria de talentos",
    },
    ticker: [
      "Busca executiva",
      "Recrutamento especializado",
      "Equipes dedicadas",
      "Avaliação",
      "Idiomas",
    ],
    services: {
      eyebrow: "01 / Empresas",
      title: "As pessoas certas impulsionam o que vem a seguir.",
      intro:
        "Cada decisão de talentos define os rumos de uma organização. Unimos conhecimento de mercado, critério e proximidade em cada processo.",
      items: [
        {
          title: "Headhunting Executivo",
          description:
            "Encontramos líderes e profissionais C-level que orientam decisões e transformam negócios.",
        },
        {
          title: "Recrutamento Especializado",
          description:
            "Encontramos especialistas cuja experiência e motivação combinam com a sua equipe.",
        },
        {
          title: "Terceirização de Talentos",
          description:
            "Reforçamos projetos e equipes com talentos dedicados e flexíveis.",
        },
        {
          title: "Avaliação de Idiomas",
          description:
            "Avaliamos o nível atual e desenvolvemos competências linguísticas para o trabalho.",
        },
        {
          title: "Avaliações Psicotécnicas",
          description:
            "Analisamos competências e comportamentos para decisões mais claras.",
        },
      ],
    },
    pipeline: {
      eyebrow: "02 / Nosso processo",
      title: "Sinal acima do ruído. Sempre.",
      intro:
        "Fazemos o trabalho antes de apresentar um perfil: contexto, capacidades, motivação e os detalhes que tornam uma contratação uma boa decisão.",
      principles: [
        "Entender o desafio antes de definir o perfil.",
        "Avaliar capacidades, motivação e contexto.",
        "Acompanhar a decisão até uma integração sólida.",
      ],
      widgetLabel: "Como conectamos talentos",
      widgetCaption: "Um processo claro, do início ao fim",
      illustrative: "Visualização ilustrativa",
      tabsLabel: "Etapas do processo seletivo",
      profileLabel: "Perfil profissional",
      profileDetail: "Liderança · Operações",
      profileStatus: "Em avaliação",
      stageProgress: "Etapa",
      stages: [
        {
          name: "Busca",
          status: "Mapeamento de talentos",
          title: "Encontramos o sinal.",
          body:
            "Definimos o contexto e mapeamos profissionais cuja trajetória e momento combinam com o desafio.",
          metric: "01",
          metricLabel: "Identificar",
        },
        {
          name: "Avaliação",
          status: "Conversas",
          title: "Conhecemos a pessoa.",
          body:
            "Aprofundamos experiência, motivação, competências e expectativas para validar a compatibilidade.",
          metric: "02",
          metricLabel: "Compreender",
        },
        {
          name: "Conexão",
          status: "Alinhamento final",
          title: "Criamos uma conexão duradoura.",
          body:
            "Apresentamos perfis bem fundamentados e apoiamos ambas as partes até uma decisão segura.",
          metric: "03",
          metricLabel: "Conectar",
        },
      ],
      next: "Próxima etapa",
      restart: "Voltar ao início",
      progressLabel: "Progresso do processo",
    },
    candidate: {
      eyebrow: "03 / Profissionais",
      title: "Uma nova oportunidade começa com menos etapas.",
      intro:
        "Sem portais intermináveis ou formulários confusos. Compartilhe o essencial e nossa equipe entrará em contato pessoalmente.",
      panelLabel: "Conexão de talentos",
      completeLabel: "CONCLUÍDO",
      progressLabel: "Progresso",
      startTitle: "Vamos começar por você.",
      startBody:
        "Continue com o LinkedIn ou compartilhe seus dados em poucas etapas. Nossa equipe analisará seu perfil pessoalmente.",
      linkedin: "Continuar com LinkedIn",
      manualDivider: "ou continue manualmente",
      manual: "Usar formulário breve",
      roleTitle: "Que tipo de oportunidade você procura?",
      roleBody:
        "Conte qual função ou próximo passo você tem em mente.",
      roleLabel: "Cargo ou área de interesse",
      rolePlaceholder: "Ex.: Liderança de Produto, tecnologia",
      cvTitle: "Compartilhe sua experiência.",
      cvBody:
        "Anexe seu currículo em PDF, DOC ou DOCX. Tamanho máximo: 8 MB.",
      cvChoose: "Arraste seu currículo ou selecione um arquivo",
      cvConfidential: "Suas informações são tratadas com confidencialidade.",
      emailTitle: "Como podemos entrar em contato?",
      emailBody:
        "Usaremos seu e-mail para responder pessoalmente. Sem newsletters ou mensagens automáticas.",
      emailLabel: "E-mail",
      emailPlaceholder: "voce@email.com",
      submit: "Enviar meus dados",
      next: "Avançar",
      back: "Voltar",
      completeTitle: "Você já está no nosso radar.",
      completeBody:
        "Obrigado por compartilhar seu próximo passo com a Fortuna Connect. Nossa equipe analisará seus dados e entrará em contato pelo e-mail {email}.",
      restart: "Iniciar outra conversa",
      errors: {
        fileSize: "Escolha um arquivo com menos de 8 MB.",
        roleRequired: "Conte qual cargo ou área você está buscando.",
        cvRequired: "Anexe seu currículo para que possamos conhecer você.",
        invalidEmail: "Informe um endereço de e-mail válido.",
      },
      progressAria: "Progresso: {current} de 4",
    },
    quote: {
      ariaLabel: "A perspectiva da Fortuna Connect",
      text: "“O talento certo faz mais do que preencher uma vaga. Abre novas possibilidades.”",
      aside:
        "Conectamos a ambição das pessoas ao momento e à visão de cada organização.",
    },
    footer: {
      tagline: "Conectamos talentos às oportunidades que estão por vir.",
      explore: "Explore",
      contact: "Conecte-se",
      companies: "Empresas",
      pipeline: "Nosso processo",
      connect: "Conecte talentos",
      website: "Acesse thefortunaconnect.com",
      locations: "Conectando talentos, em toda parte",
      rights: "Todos os direitos reservados.",
    },
  },
} as const;

export type Translations = (typeof translations)[Language];
