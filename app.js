// Función global para cambiar el tema
function toggleTheme() {
     const isLightTheme = document.body.classList.toggle('light-theme');
     if (typeof GAME_DATA !== 'undefined') {
         const cells = document.querySelectorAll('.board-cell');
         cells.forEach(cell => {
             if (cell.dataset.owned === 'false') {
                 const id = parseInt(cell.dataset.id, 10);
                 const cellData = GAME_DATA.BOARD.find(d => d.id === id);
                 if (cellData) {
                     cell.style.backgroundColor = isLightTheme ? cellData.colorLight : cellData.colorDark;
                 }
             }
         });
     }
}

/* --- CONFIGURACIÓN DE SUPABASE --- */
const SUPABASE_URL = 'https://obyzkatytlxltmldclno.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ieXprYXR5dGx4bHRtbGRjbG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1Njk1OTIsImV4cCI6MjA5MTE0NTU5Mn0.fHOlgNiGmeKAMOdydM1RyT77bq_MlDvzURaGgMayJZY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* --- DATABASE (CONFIGURACIÓN CENTRAL DEL JUEGO) --------------------------- */
const GAME_DATA = {
    /* Perfiles de Inteligencia Artificial (Fundadoras AeB) */
    AI_PROFILES: [
        {
            id: 'paula', name: 'PaulaAeb',
            reactionMin: 2000, reactionMax: 3000,
            shouldBuy: (price) => Math.random() < 0.99,
            solveDebt: (actions) => actions.find(a => a.className === 'button--sell') || actions[0]
        },
        {
            id: 'fran', name: 'FranAeb',
            reactionMin: 3000, reactionMax: 5000,
            shouldBuy: (price) => price <= 3000 && Math.random() < 0.99,
            solveDebt: (actions) => Math.random() < 0.99 ? (actions.find(a => a.text === 'Ir a la Cárcel') || actions[0]) : (actions.find(a => a.className === 'button--sell') || actions[0])
        },
        {
            id: 'coni', name: 'ConiAeb',
            reactionMin: 1000, reactionMax: 2000,
            shouldBuy: (price) => price >= 2400 && Math.random() < 0.99,
            solveDebt: (actions) => Math.random() < 0.5 ? (actions.find(a => a.className === 'button--sell') || actions[0]) : (actions.find(a => a.text === 'Ir a la Cárcel') || actions[0])
        }
    ],
    /* Configuración de la Ruleta de Premios */
    PRIZES: [
        { id: 1,  chance: 50, url: "https://www.aricaesbacan.cl/lgapremio" },
        { id: 2,  chance: 20, url: "https://www.aricaesbacan.cl" },
        { id: 3,  chance: 10, url: "https://www.aricaesbacan.cl" },
        { id: 4,  chance: 5,  url: "https://www.aricaesbacan.cl" },
        { id: 5,  chance: 5,  url: "https://www.aricaesbacan.cl" },
        { id: 6,  chance: 5,  url: "https://www.aricaesbacan.cl" },
        { id: 7,  chance: 2,  url: "https://www.aricaesbacan.cl" },
        { id: 8,  chance: 2,  url: "https://www.aricaesbacan.cl" },
        { id: 9,  chance: 1,  url: "https://www.aricaesbacan.cl" },
        { id: 10, chance: 0,  url: "https://www.aricaesbacan.cl" },
        { id: 11, chance: 0,  url: "https://www.aricaesbacan.cl" },
        { id: 12, chance: 0,  url: "https://www.aricaesbacan.cl" },
    ],
    /* Configuración de Jugadores */
    PLAYERS: {
        COLORS: ['#DC3545', '#0D6EFD', '#198754', '#FFC107'],
        INITIAL_MONEY: [7100, 7200, 7300, 7400]
    },
    /* Tiempos y Retrasos (Ritmo del juego) */
    DELAYS: {
        DICE_ANIMATION: 1200,
        DICE_ANIMATION_INTERVAL: 100,
        DICE_ROLL_TO_MOVE: 200,
        PAWN_STEP: 200,
        LAND_TO_ACTION: 2500,
        ACTION_TO_NEXT_TURN: 2500,
        AFK_WAIT: 30000,
    },
    /* Recursos Visuales */
    ASSETS: {
        CENTRAL_IMAGES: [
            'https://i.imgur.com/0SB6o2n.jpeg',
            'https://i.imgur.com/r4f4zsr.jpeg',
            'https://i.imgur.com/5c0zM3M.jpeg',
            'https://i.imgur.com/AxMom8y.jpeg',
            'https://i.imgur.com/osfhOnt.jpeg',
            'https://i.imgur.com/vQP72M8.jpeg',
            'https://i.imgur.com/0SB6o2n.jpeg', 
            'https://i.imgur.com/Cjuh58I.jpeg',
            'https://i.imgur.com/ibo9xOT.jpeg', 
            'https://i.imgur.com/osfhOnt.jpeg',
            'https://i.imgur.com/5c0zM3M.jpeg',
            'https://i.imgur.com/r4f4zsr.jpeg',
        ],
        GENERIC_CENTRAL_IMAGE: 'https://i.imgur.com/TAsh9DF.png',
        FALLBACK_PROPERTY_IMAGE: 'https://i.imgur.com/gAEN3p2.jpeg'
    },
    /* UI Helpers */
    UI: {
        COLOR_TO_EMOJI: {
            '#DC3545': '🔴', 
            '#0D6EFD': '🔵', 
            '#198754': '🟢', 
            '#FFC107': '🟡'  
        }
    },
    /* CONFIGURACIÓN DE CARTAS TEMÁTICAS */
    CARDS: [
        { text: "Vocal de Mesa", subtext: "Salió seleccionado como vocal de mesa en las nuevas elecciones presidenciales. Reciba $100 por concepto de honorarios.\nJusto me tocó en el emblemático Colegio Integrado… y en la mesa 11, para más remate 🤭", amount: 100 },
        { text: "Deuda Histórica", subtext: "Usted es uno de los más de cuatrocientos profesores que, por fin, recibió el pago de la deuda histórica. Reciba $500.\nValió la pena esperar… solo unas cuantas décadas.", amount: 500 },
        { text: "Premio a la Mejor Empanada", subtext: "¡Felicidades! Ganó el concurso de la mejor empanada de Arica. Reciba $200.\n¡École cuí, école cuá… la empanadá! Orgullo regional.", amount: 200 },
        { text: "Dividendo Bancario", subtext: "El banco le paga un dividendo de $400.\nGástelo en el comercio local… el retail puede esperar.", amount: 400 },
        { text: "Buena Suerte", subtext: "¡Al fin le achuntó al hoyo del cuye borracho! Cobre $100.\n¡Cuye borracho, cuye ganadorrrr! 🐹💰", amount: 100 },
        { text: "Bingo Vecinal", subtext: "Ganó un premio en el bingo de la Junta de Vecinos N°41. Cobre $100.\nLos picarones estaban mejor que el premio.", amount: 100 },
        { text: "Incendio Controlado", subtext: "Bomberos de Arica lograron controlar un mega incendio en Asocapec.\nGracias bomberos, los verdaderos chicos buenos. Apóyalos siempre.", amount: 0 },
        { text: "Consternación", subtext: "Predicen el mega terremoto de Arica, ese que se anuncia desde hace años.\nMe voy a encomendar a Marcelito Lagos y a todos los santos.", amount: 0 },
        { text: "Denuncia Vecinal", subtext: "Sus vecinos la denunciaron por ser la vecina conflictiva del condominio. Pague una multa de $200 en el banco y pierda una jugada.\nAl menos me volvieron a agregar al grupo de WhatsApp… por ahora.", amount: -200, action: 'skip', skipTurns: 1 },
        { text: "Cine Colón", subtext: "El Cine Colón reestrenará la película La Rata de América. Invite a su pareja y pague $100 por ambas entradas.\n¿Aún estará vivo Charles Aznavour?", amount: -100 },
        { text: "Licencia Vencida", subtext: "Su licencia de conducir está vencida. Pague $100 por la renovación.\nSi Zapatitos Blancos aún estuviera, esto no habría pasado.", amount: -100 },
        { text: "Impuesto a la Renta", subtext: "Pague $500 al banco.\nCon fe: que esta plata sirva para tapar aunque sea un hoyo.", amount: -500 },
        { text: "Multa de Tránsito", subtext: "Por exceso de velocidad, pague una multa de $200.\nPero si iba despacio… solo a 150 km/h por avenida Beretta Porcel.", amount: -200 },
        { text: "Castigado", subtext: "Por hacer la cimarra en el liceo y arrancarse a playa Chinchorro, han castigado a su hijo. Pierda una jugada.\nEs que con esa remodelación… cualquiera.", amount: 0, action: 'skip', skipTurns: 1 },
        { text: "Curso de Automaquillaje", subtext: "Fuiste elegida para brillar ✨. Este 10 de enero te espera el curso de automaquillaje de Cata Belén en el Hotel Arica. Asegura tu cupo con $200.\nVen a sacar tu mejor versión carnavalera 💄🎉", amount: -200 },
        { text: "A la Urgencia", subtext: "Por intoxicación, vaya directo a la posta del Hospital Juan Noé. Pague $100 por gastos médicos y pierda una jugada.\nIgual estaba bueno el ceviche del puerto… creo.", amount: -100, action: 'move', targetId: 9, skipTurns: 1 },
        { text: "Delincuentes", subtext: "Entraron a robar una de sus propiedades. Pierde $300.\nPor suerte el traje del Carnaval sigue a salvo.", amount: -300 },
        { text: "Al Estadio", subtext: "Diríjase al Estadio Carlos Dittborn y vaya a apoyar a la celeste. Pague $100 por la entrada.\nOjalá hoy sí caiga un golcito.", amount: -100, action: 'move', targetId: 26 },
        { text: "Lluvia en Arica", subtext: "Las lluvias estivales hicieron de las suyas. Pague $500 para reparar el techo.\nEste verano, ahora sí, no se me lloverá la casa.", amount: -500 }
    ],
    /* EL TABLERO */
    BOARD: [
        { id: 1, name: 'Edificio\nEmpresarial', type: 'start', isCorner: true, colorLight: '#efc205', colorDark: '#efc205', image01: 'https://i.imgur.com/fdJ0dTM.jpeg', image02: 'https://i.imgur.com/fdJ0dTM.jpeg', description01: 'Sueldo de $3.000 al pasar. ¡Y $5.000 si te detienes exactamente aquí!', description02: 'Sueldo de $3.000 al pasar. ¡Y $5.000 si te detienes exactamente aquí!', promo01: 'Cobra $3.000 al pasar. ¡Y $5.000 si te detienes exactamente aquí!', promo02: 'Cobra $3.000 al pasar. ¡Y $5.000 si te detienes exactamente aquí!' },
        { id: 2, name: 'Terminal\nRodoviario', type: 'property', price: 600, rent: 120, colorLight: '#C8E6C9', colorDark: '#7ca8ab', image01: 'https://i.imgur.com/4WkSAEH.jpeg', image02: 'https://i.imgur.com/4WkSAEH.jpeg', description01: 'Joya arquitectónica de estilo brutalista, construida en 1977 por la Junta de Adelanto de Arica. Fue declarada Monumento Histórico en 2024.', description02: 'Joya arquitectónica de estilo brutalista, construida en 1977 por la Junta de Adelanto de Arica. Fue declarada Monumento Histórico en 2024.', promo01: 'Fue construido con la tecnología más avanzada de su época, lo que la Junta de Adelanto de Arica denominó arquitectura “high tech”, destacando su carácter innovador y funcional.', promo02: 'Dato curioso: es el único terminal de buses del país que cobra ticket de embarque para poder viajar, una particularidad que lo hace único dentro del sistema de transporte nacional.' },
        { id: 3, name: 'Humedal\nRío Lluta', type: 'property', price: 900, rent: 180, colorLight: '#FFCCE5', colorDark: '#c82f6f', image01: 'https://i.imgur.com/9QmaTKJ.jpeg', image02: 'https://i.imgur.com/9QmaTKJ.jpeg', description01: 'Un oasis natural a tan solo 5 km de Arica, refugio de aves migratorias y de una biodiversidad única.', description02: 'Un oasis natural a tan solo 5 km de Arica, refugio de aves migratorias y de una biodiversidad única.', promo01: '¿Sabías que este humedal alberga más de 140 especies de aves, incluyendo flamencos rosados?', promo02: 'Aquí descansan aves migratorias que ya viajan miles de kilómetros desde Norteamérica, como la gaviota de Franklin y el gaviotín chico, convirtiendo este humedal en un punto clave para la biodiversidad.' },
        { id: 4, name: 'Cargo\nArica', type: 'property', price: 1200, rent: 240, colorLight: '#E0BBE4', colorDark: '#633e7f', image01: 'https://i.imgur.com/qHOJ1C6.jpeg', image02: 'https://i.imgur.com/qHOJ1C6.jpeg', description01: 'Servicio de carga y encomiendas seguras y rápidas desde Arica a Iquique, Pozo Almonte y Alto Hospicio.', description02: 'Servicio de carga y encomiendas seguras y rápidas desde Arica a Iquique, Pozo Almonte y Alto Hospicio.', promo01: 'Cargo Arica, 25 años de experiencia transportando su carga de forma segura, protegida y eficiente. Gracias por confiar en nosotros.', promo02: 'Cargo Arica les desea muy felices fiestas a usted y su familia, e invita a conocer su hermoso árbol navideño, ubicado en Santa María con Diego Portales' },
        { id: 5, name: 'Teccel\nArica', type: 'property', price: 1500, rent: 300, colorLight: '#FFF888', colorDark: '#e3be43', image01: 'https://i.imgur.com/ZtoHd1n.jpeg', image02: 'https://i.imgur.com/ZtoHd1n.jpeg', description01: 'Tienda exclusiva dedicada a la venta de artículos electrónicos, accesorios y reparación de celulares.', description02: 'Tienda exclusiva dedicada a la venta de artículos electrónicos, accesorios y reparación de celulares.', promo01: '📱¡Reparamos tu celular! Pantalla negra o dañada, tenemos repuestos y accesorios al instante.', promo02: 'Visita cualquiera de nuestras sucursales Teccel y participa en el sorteo de un Samsung A56 por compras o reparaciones desde $20.000. Sorteo el 31 de diciembre. 📱🎉' },
        { id: 6, name: 'Librería\nCampodónico', type: 'property', price: 1800, rent: 360, colorLight: '#E0BBE4', colorDark: '#633e7f', image01: 'https://i.imgur.com/dXVR36Q.jpeg', image02: 'https://i.imgur.com/dXVR36Q.jpeg', description01: 'En 1954 nace librería Campodónico con la misión de entretener con sana diversión y cultura a los ariqueños.', description02: 'En 1954 nace librería Campodónico con la misión de entretener con sana diversión y cultura a los ariqueños.', promo01: 'Tienda de libros, agendas, calendarios y planners, artículos de oficina y más.', promo02: 'Con más de 70 años de historia en pleno centro de la ciudad, Librería Campodónico conserva hasta hoy la misma fachada, convirtiéndose en parte del patrimonio urbano de Arica.' },
        { id: 7, name: 'Catedral\nSan Marcos', type: 'property', price: 2100, rent: 420, colorLight: '#FFDAB9', colorDark: '#CFA882', image01: 'https://i.imgur.com/JvAkWtH.jpeg', image02: 'https://i.imgur.com/JvAkWtH.jpeg', description01: 'Iglesia principal de la ciudad, que reemplazó a la iglesia La Matriz tras el maremoto y terremoto de 1868.', description02: 'Iglesia principal de la ciudad, que reemplazó a la iglesia La Matriz tras el maremoto y terremoto de 1868.', promo01: 'Sus gradas han sido lugar de reunión y celebración. Aquí, en una visita histórica, fue recibido el presidente francés Charles de Gaulle.', promo02: 'Sus piezas metálicas llegaron desde Europa en el siglo XIX, poco antes de la Guerra del Pacífico, convirtiendo a la Catedral San Marcos en una obra única de la arquitectura histórica de Arica.' },
        { id: 8, name: 'Paseo 21\nde Mayo', type: 'property', price: 2400, rent: 480, colorLight: '#A7C7E7', colorDark: '#2d3c7e', image01: 'https://i.imgur.com/qhoe5fv.jpeg', image02: 'https://i.imgur.com/qhoe5fv.jpeg', description01: 'En la década de los 80, esta calle fue el motor comercial de Arica, donde se establecieron reconocidas marcas nacionales e internacionales.', description02: 'En la década de los 80, esta calle fue el motor comercial de Arica, donde se establecieron reconocidas marcas nacionales e internacionales.', promo01: 'Corazón peatonal y comercial de Arica, lleno de música, arte y pasacalles que dan vida y color al centro de la ciudad todo el año.', promo02: 'No siempre fue un paseo peatonal: esta transformación ocurrió recién en la década de 1990. Antiguamente se llamó calle 2 de Mayo, cuando Arica era peruana, en honor al Combate del Callao.' },
        { id: 9, name: 'Hospital\nRegional', type: 'hospital', isCorner: true, colorLight: '#efc205', colorDark: '#efc205', image01: 'https://i.imgur.com/cyAafbQ.jpeg', image02: 'https://i.imgur.com/cyAafbQ.jpeg', description01: 'Para una pronta recuperación, pierdes 1 turno y abonas $1.000 por gastos médicos.', description02: 'Para una pronta recuperación, pierdes 1 turno y abonas $1.000 por gastos médicos.', promo01: 'Para una pronta recuperación, pierdes 1 turno y abonas $1.000 por gastos médicos.', promo02: 'Para una pronta recuperación, pierdes 1 turno y abonas $1.000 por gastos médicos.' },
        { id: 10, name: 'Ferrocarril\nArica-La Paz', type: 'property', price: 2700, rent: 540, colorLight: '#A7C7E7', colorDark: '#2d3c7e', image01: 'https://i.imgur.com/zoZ34be.jpeg', image02: 'https://i.imgur.com/zoZ34be.jpeg', description01: 'Línea férrea que une Arica con La Paz, construida como parte del Tratado de Paz y Amistad de 1904 con Bolivia.', description02: 'Línea férrea que une Arica con La Paz, construida como parte del Tratado de Paz y Amistad de 1904 con Bolivia.', promo01: 'Inaugurado en 1913, alcanza más de 4.000 metros de altura, siendo uno de los ferrocarriles más altos de Sudamérica.', promo02: 'Este Monumento Nacional se proyecta como la futura Biblioteca Regional de Arica y Parinacota, iniciativa que lleva más de 20 años en tramitación y busca dar nuevo valor al histórico Ferrocarril Arica–La Paz.' },
        { id: 11, name: 'Destino', type: 'luck', isCorner: false, colorLight: '#08afb7', colorDark: '#db0868', image01: 'https://i.imgur.com/9V1hix8.jpeg', image02: 'https://i.imgur.com/t72vYpP.jpeg', description01: '¡La fortuna te sonríe! Saca una carta y recibe tu premio.', description02: '¡La fortuna te sonríe! Saca una carta y recibe tu premio.', promo01: '¡La fortuna te sonríe! Saca una carta y recibe tu premio.', promo02: '¡La fortuna te sonríe! Saca una carta y recibe tu premio.' },
        { id: 12, name: 'Museo\nSan Miguel\nde Azapa', type: 'property', price: 3300, rent: 660, colorLight: '#E0BBE4', colorDark: '#633e7f', image01: 'https://i.imgur.com/MRsIWVO.jpeg', image02: 'https://i.imgur.com/MRsIWVO.jpeg', description01: 'Es el museo más grande de la ciudad, creado en 1967 y alberga una amplia colección de piezas de las culturas Arica, Tiwanaku, Inca, Chinchorro, entre otras.', description02: 'Es el museo más grande de la ciudad, creado en 1967 y alberga una amplia colección de piezas de las culturas Arica, Tiwanaku, Inca, Chinchorro, entre otras.', promo01: 'Es más que un museo arqueológico ya que también cuenta con un bello jardín botánico que complementa la experiencia de la visita.', promo02: 'El arqueólogo alemán Percy Dauelsberg, quien llegó a Arica en la década de 1950, fue uno de los pioneers en la creación del Museo Arqueológico San Miguel de Azapa.' },
        { id: 13, name: 'Aeropuerto\nChacalluta', type: 'property', price: 3600, rent: 720, colorLight: '#C8E6C9', colorDark: '#7ca8ab', image01: 'https://i.imgur.com/RByxrwi.jpeg', image02: 'https://i.imgur.com/RByxrwi.jpeg', description01: 'Puerta aérea de Arica, ubicada a 18 km al norte, siendo el aeropuerto más septentrional de Chile.', description02: 'Puerta aérea de Arica, ubicada a 18 km al norte, siendo el aeropuerto más septentrional de Chile.', promo01: 'Fue completamente remodelado entre 1922 y 2025 por el Ministerio de Obras Públicas, modernizando su infraestructura y mejorando los servicios del Aeropuerto Chacalluta.', promo02: 'Dato curioso: el sector del aeropuerto tuvo un oasis de vegetación que estuvo a punto de desaparecer. Su defensa fue impulsada públicamente por el comercialista deportivo Julio Martínez.' },
        { id: 14, name: 'Cerro\nla Cruz', type: 'property', price: 3900, rent: 780, colorLight: '#E0BBE4', colorDark: '#633e7f', image01: 'https://i.imgur.com/wkwg9v8.jpeg', image02: 'https://i.imgur.com/wkwg9v8.jpeg', description01: 'Emblemática población al pie del Morro de Arica, paso obligado para ascender a la cima de este icónico cañón, símbolo histórico y patrimonial de la ciudad.', description02: 'Emblemática población al pie del Morro de Arica, paso obligado para ascender a la cima de este icónico cañón, símbolo histórico y patrimonial de la ciudad.', promo01: 'En este barrio nació y creció Manuel García, reconocido cantautor ariqueño, donde vivió su infancia, sus primeras canciones, amores y recuerdos que inspiraron su arte.', promo02: 'En los terrenos de la población Cerro La Cruz se encuentran los fuertes Ciudadela y del Este, Monumentos Nacionales que formaron parte de las líneas defensivas peruanas durante el asalto y toma del Morro de Arica.' },
        { id: 15, name: 'Valle de\nAzapa', type: 'property', price: 4200, rent: 840, colorLight: '#FFCCE5', colorDark: '#c82f6f', image01: 'https://i.imgur.com/IScyGWt.jpeg', image02: 'https://i.imgur.com/IScyGWt.jpeg', description01: 'Principal valle agrícola de la región, con más de 50 km cultivables y producción durante todo el año.', description02: 'Principal valle agrícola de la región, con más de 50 km cultivables y producción durante todo el año.', promo01: 'Produce más de 100 hortalizas y frutas. Destacan el tomate, la aceituna, el morrón, el zapallo italiano y la berenjena, productos emblemáticos del Valle de Azapa distribuidos en todo Chile.', promo02: 'En el valle se encuentra uno de los olivos más antiguos de América, llamado El Señor de Ocurica. Tiene más de 450 años y fue plantado por colonizadores españoles.' },
        { id: 16, name: 'Universidad\nTarapacá', type: 'property', price: 4500, rent: 900, colorLight: '#FFF888', colorDark: '#c33f2e', image01: 'https://i.imgur.com/QSrHtSs.jpeg', image02: 'https://i.imgur.com/QSrHtSs.jpeg', description01: 'Universidad regional con más de 40 años de historia, destacada en investigación sobre la Cultura Chinchorro.', description02: 'Universidad regional con más de 40 años de historia, destacada en investigación sobre la Cultura Chinchorro.', promo01: 'Nació de la fusión entre el Instituto Profesional de Arica, ex sede de la Universidad de Chile, y la sede local de la Universidad del Norte.', promo02: 'La Universidad de Tarapacá fue construida sobre el antiguo cauce del río Acha, el cual fue desviado en 1979 para permitir el desarrollo del campus.' },
        { id: 17, name: ' Casino\n Luckia', type: 'casino', isCorner: true, colorLight: '#efc205', colorDark: '#efc205', image01: 'https://i.imgur.com/vxoI5RL.jpeg', image02: 'https://i.imgur.com/vxoI5RL.jpeg', description01: '¡Prueba tu suerte! En el mejor lugar de encuentro en Arica & Parinacota. Puedes ganar hasta $1.000, pero juega con responsabilidad.', description02: '¡Prueba tu suerte! En el mejor lugar de encuentro en Arica & Parinacota. Puedes ganar hasta $1.000, pero juega con responsabilidad.', promo01: '¡Prueba tu suerte! En el mejor lugar de encuentro en Arica & Parinacota. Puedes ganar hasta $1.000, pero juega con responsabilidad.', promo02: '¡Prueba tu suerte! En el mejor lugar de encuentro en Arica & Parinacota. Puedes ganar hasta $1.000, pero juega con responsabilidad.' },
        { id: 18, name: 'Poblado\nArtesanal', type: 'property', price: 4500, rent: 900, colorLight: '#A7C7E7', colorDark: '#2d3c7e', image01: 'https://i.imgur.com/TG2HtO0.jpeg', image02: 'https://i.imgur.com/TG2HtO0.jpeg', description01: 'Mercado tradicional donde podrás encontrar artesanía andina y productos locales únicos.', description02: 'Mercado tradicional donde podrás encontrar artesanía andina y productos locales únicos.', promo01: '¿Sabías que aquí se venden tejidos aymaras originales y productos típicos de tres países? El Poblado Artesanal es un punto clave para conocer la cultura andina del norte de Chile.', promo02: 'Es una recreación del poblado de Parinacota y fue inaugurado el 28 de noviembre de 1978, destacándose como un espacio que celebra la arquitectura y cultura del altiplano.' },
        { id: 19, name: 'Museo\nde Armas', type: 'property', price: 4200, rent: 840, colorLight: '#FFDAB9', colorDark: '#CFA882', image01: 'https://i.imgur.com/7FQXjAa.jpeg', image02: 'https://i.imgur.com/7FQXjAa.jpeg', description01: 'Ubicado en la cima del Morro de Arica, el Museo de Armas conserva piezas e información histórica sobre la Guerra del Pacífico y el asalto y toma del Morro.', description02: 'Ubicado en lo alto del Morro, el Museo de Armas resguarda armamento, documentos y objetos que permiten comprender el valor histórico y estratégico de Arica en la Guerra del Pacífico.', promo01: 'Este museo promueve la paz y la integración ya que en su interior conviven bustos de Francisco Bolognesi y José de San Martín, iniciativa impulsada por el general Juan Emilio Cheyre.', promo02: 'Ubicado en lo alto del Morro, el Museo de Armas resguarda armamento, documentos y objetos que permiten comprender el valor histórico y estratégico de Arica en la Guerra del Pacífico.' },
        { id: 20, name: 'Cine\nColón', type: 'property', price: 3900, rent: 780, colorLight: '#E0BBE4', colorDark: '#633e7f', image01: 'https://i.imgur.com/fAsQcBS.jpeg', image02: 'https://i.imgur.com/fAsQcBS.jpeg', description01: 'Emblemático cine construido en 1962 que funcionó hasta 2018, proyectando miles de películas y marcando la vida cultural de varias generaciones', description02: 'Emblemático cine conruido en 1962 que funcionó hasta 2018, proyectando miles de películas y marcando la vida cultural de varias generaciones', promo01: 'En su inauguración contó con el proyector cinematográfico más moderno de Sudamérica, atrayendo la atención de cinéfilos y curiosos por igual.', promo02: 'Actualmente es administrado por la Municipalidad de Arica como espacio cultural. El Cine Colón se utiliza para la exhibición de películas, conciertos y ceremonias de graduación.' },
        { id: 21, name: 'Aurus\nJoyería', type: 'property', price: 3600, rent: 720, colorLight: '#FFF888', colorDark: '#e3be43', image01: 'https://i.imgur.com/AZUGfMA.jpeg', image02: 'https://i.imgur.com/AZUGfMA.jpeg', description01: 'Empresa comercializadora de Oro que ofrece a sus clientes diferentes modalidades de compra y venta.', description02: 'Empresa comercializadora de Oro que ofrece a sus clientes diferentes modalidades de compra y venta.', promo01: '💎 Vende tus joyas con opción de recuperarlas en 90 días. Aurus te respalda con contrato y seguridad. ¡Fácil, rápido y confiable!', promo02: 'Aurus Joyería celebra 19 años en 2025 y lo festeja en grande con descuentos especiales, incluyendo hasta un 30% en joyas de oro seleccionadas. Visítanos✨💍' },
        { id: 22, name: 'Hotel\nPacífico', type: 'property', price: 3300, rent: 660, colorLight: '#E0BBE4', colorDark: '#633e7f', image01: 'https://i.imgur.com/ouO9InS.jpeg', image02: 'https://i.imgur.com/ouO9InS.jpeg', description01: 'Construido en 1927, el Hotel Pacífico contaba con seis pisos, escalera de mármol y amplios salones. Fue el principal punto de encuentro de la alta sociedad ariqueña.', description02: 'Construido en 1927, el Hotel Pacífico contaba con seis pisos, escalera de mármol y amplios salones. Fue el principal punto de encuentro de la alta sociedad ariqueña.', promo01: 'Considerado uno de los hoteles más elegantes de su época, el Hotel Pacífico alojó a importantes visitantes y se convirtió en un símbolo de la arquitectura urbana del puerto.', promo02: 'Fue demolido en la década de 1950. La leyenda cuenta que su demolición se debió al daño en sus cimientos, poniendo fin a uno de los íconos del Arica histórico.' },
        { id: 23, name: 'Cuevas\nde Anzota', type: 'property', price: 3000, rent: 600, colorLight: '#FFCCE5', colorDark: '#c82f6f', image01: 'https://i.imgur.com/MA4AOS5.jpeg', image02: 'https://i.imgur.com/MA4AOS5.jpeg', description01: 'Conjunto de cuevas costeras a 12 km al sur de Arica, hogar de chungungos, aves marinas, lagartijas y murciélagos que viven en su interior.', description02: 'Conjunto de cuevas costeras a 12 km al sur de Arica, hogar de chungungos, aves marinas, lagartijas y murciélagos que viven en su interior.', promo01: 'Entre fines del siglo XIX y comienzos del XX, las Cuevas de Anzota fueron una importante zona de extracción de guano, mineral altamente valorado por su productividad agrícola.', promo02: 'Con el paso del tiempo se convirtió en el principal atractivo turístico de la ciudad. Actualmente, las Cuevas de Anzota se encuentran cerradas por riesgo de desprendimiento de rocas.' },
        { id: 24, name: 'Terminal\nInternacional', type: 'property', price: 2700, rent: 540, colorLight: '#C8E6C9', colorDark: '#7ca8ab', image01: 'https://i.imgur.com/vsb5vZu.jpeg', image02: 'https://i.imgur.com/vsb5vZu.jpeg', description01: 'Terminal de pasajeros para viajes a Perú y Bolivia, ubicado en pleno centro de la ciudad, junto al terminal nacional de Arica, conectando el norte de Chile con países vecinos.', description02: 'Terminal de pasajeros para viajes a Perú y Bolivia, ubicado en pleno centro de la ciudad, junto al terminal nacional de Arica, conectando el norte de Chile con países vecinos.', promo01: 'Desde aquí salen buses a Tacna y La Paz. En feriados largos suele colapsar por la alta demanda de ariqueños que viajan al extranjero. También es recordado por un caso de corrupción en tiempos de Waldo Zancan.', promo02: 'Una de sus principales problemáticas es la alta afluencia de pasajeros y la escasa fiscalización de taxis informales que operan a diario en los alrededores del terminal.' },
        { id: 25, name: 'Cárcel\nde Acha', type: 'jail', isCorner: true, colorLight: '#efc205', colorDark: '#efc205', image01: 'https://i.imgur.com/wAe2CNM.jpeg', image02: 'https://i.imgur.com/wAe2CNM.jpeg', description01: 'Si caes aquí, o si te quedas con capital negativo y sin propiedades para vender, serás encarcelado por 3 turnos. ¡Gestiona bien tus finanzas!', description02: 'Si caes aquí, o si te quedas con capital negativo y sin propiedades para vender, serás encarcelado por 3 turnos. ¡Gestiona bien tus finanzas!', promo01: 'Si caes aquí, o si te quedas con capital negativo y sin propiedades para vender, serás encarcelado por 3 turnos. ¡Gestiona bien tus finanzas!', promo02: 'Si caes aquí, o si te quedas con capital negativo y sin propiedades para vender, serás encarcelado por 3 turnos. ¡Gestiona bien tus finanzas!' },
        { id: 26, name: 'Estadio\nCarlos\nDittborn', type: 'property', price: 2400, rent: 480, colorLight: '#FFF888', colorDark: '#c33f2e', image01: 'https://i.imgur.com/8hPmaFx.jpeg', image02: 'https://i.imgur.com/8hPmaFx.jpeg', description01: 'Construido para el Mundial de 1962 por la Junta de Adelanto, su diseño fue considerado uno de los más modernos de Sudamérica en la época', description02: 'Construido para el Mundial de 1962 por la Junta de Adelanto, su diseño fue considerado uno de los más modernos de Sudamérica en la época', promo01: 'Aquí nació la célebre frase “justicia divina”, pronunciada por el relator Julio Martínez durante el histórico partido entre Chile y la Unión Soviética en el Mundial de 1962.', promo02: 'Actualmente es la casa del club local San Marcos de Arica, conocido popularmente como los Bravos del Morro, símbolo del orgullo deportivo de la ciudad.' },
        { id: 27, name: 'Destino', type: 'destiny', isCorner: false, colorLight: '#08afb7', colorDark: '#db0868', image01: 'https://i.imgur.com/9V1hix8.jpeg', image02: 'https://i.imgur.com/t72vYpP.jpeg', description01: 'El destino es caprichoso. Saca una carta y enfrenta tu suerte.', description02: 'El destino es caprichoso. Saca una carta y enfrenta tu suerte.', promo01: 'El destino es caprichoso. Saca una carta y enfrenta tu suerte.', promo02: 'El destino es caprichoso. Saca una carta y enfrenta tu suerte.' },
        { id: 28, name: 'Valle de\nLluta', type: 'property', price: 1800, rent: 360, colorLight: '#E0BBE4', colorDark: '#633e7f', image01: 'https://i.imgur.com/u0IfeU8.jpeg', image02: 'https://i.imgur.com/u0IfeU8.jpeg', description01: 'Segundo valle agrícola más productivo de la región, conocido por su maíz lluteño y cebollas, muy apreciados en todo el norte de Chile.', description02: 'Segundo valle agrícola más productivo de la región, conocido por su maíz lluteño y cebollas, muy apreciados en todo el norte de Chile.', promo01: 'Las zonas agrícolas del valle de Lluta se abastecen gracias al Embalse Chironta, una obra hidráulica clave ubicada en la cuenca del río Lluta.', promo02: 'El maíz lluteño cuenta con Indicación Geográfica reconocida por el INAPI, lo que protege su origen y valor como producto típico del valle de Lluta.' },
        { id: 29, name: 'Elsaborcito', type: 'property', price: 1500, rent: 300, colorLight: '#C8E6C9', colorDark: '#7ca8ab', image01: 'https://i.imgur.com/ThyyF6S.jpeg', image02: 'https://i.imgur.com/ThyyF6S.jpeg', description01: 'ELSAborcito, la casa del helado tailandés en Arica. Vive una nueva forma de disfrutar helados 100% artesanales, naturales y servidos en rollitos', description02: 'ELSAborcito, la casa del helado tailandés en Arica. Vive una nueva forma de disfrutar helados 100% artesanales, naturales y servidos en rollitos', promo01: 'Somos más que una heladería: disfruta nuestro café de grano y variedad de bebidas frías. Te esperamos en Paseo Bolognesi 362.', promo02: 'Conoce, disfruta y refréscate con nuestros exclusivos Bubble Tea 100% naturales, con perlas explosivas de distintos sabores. Solo en ELSAborcito.' },
        { id: 30, name: 'Feria\nDominical', type: 'property', price: 1200, rent: 240, colorLight: '#E0BBE4', colorDark: '#633e7f', image01: 'https://i.imgur.com/DHYQFyd.jpeg', image02: 'https://i.imgur.com/DHYQFyd.jpeg', description01: 'Feria ambulante que se instala cada domingo en avenida Chacabuco, extendiéndose por más de 12 cuadras en pleno centro de Arica, convirtiéndose en un recorrido infaltable del día domingo en la ciudad.', description02: 'Feria ambulante que se instala cada domingo en avenida Chacabuco, extendiéndose por más de 12 cuadras en pleno centro de Arica, convirtiéndose en un recorrido infaltable del día domingo en la ciudad.', promo01: 'Solo dejó de funcionar durante antiguos procesos electorales y la pandemia, interrumpiendo por un año una tradición dominical que se había mantenido activa por varias décadas.', promo02: 'En el pasado, esta feria ambulante se instaló por un tiempo en avenida Maipú, para luego trasladarse definitivamente a calle Chacabuco, donde se mantiene hasta hoy.' },
        { id: 31, name: 'Museo\nColón 10', type: 'property', price: 900, rent: 180, colorLight: '#FFDAB9', colorDark: '#CFA882', image01: 'https://i.imgur.com/FXHdb20.jpeg', image02: 'https://i.imgur.com/FXHdb20.jpeg', description01: 'Museo de sitio único dedicado a las momias Chinchorro. El Museo Colón 10 es administrado por la Universidad de Tarapacá para su investigación y difusión', description02: 'Museo de sitio único dedicado a las momias Chinchorro. El Museo Colón 10 es administrado por la Universidad de Tarapacá para su investigación y difusión', promo01: 'En 2002, Fernando Antequera donó este terreno a la Universidad de Tarapacá, evitando la construcción de un hotel y permitiendo el rescate patrimonial del sitio.', promo02: 'El 27 de julio de 2021, la UNESCO declaró los asentamiento y momificación artificial de la cultura Chinchorro como Patrimonio Mundial de la Humanidad.' },
        { id: 32, name: 'Asoagro', type: 'property', price: 600, rent: 120, colorLight: '#A7C7E7', colorDark: '#2d3c7e', image01: 'https://i.imgur.com/XCRfpq6.jpeg', image02: 'https://i.imgur.com/XCRfpq6.jpeg', description01: 'Principal centro de abastos de la ciudad, ideal para recorrer, comprar productos frescos y conocer de cerca la identidad regional y agrícola de Arica.', description02: 'Principal centro de abastos de la ciudad, ideal para recorrer, comprar productos frescos y conocer de cerca la identidad regional y agrícola de Arica.', promo01: 'Cada fin de semana, Melvin “Corazón Américo”, padre del cantante Américo, canta en la entrada principal, animando a comerciantes y visitantes del terminal agropecuario.', promo02: 'Este terminal se divide en tres áreas: mercado de frutas y hortalizas, feria de ropa de segunda mano y mueblería. ASOAGRO nació hace más de 40 años por iniciativa de agricultores locales.' },
    ]
};
const delay = (ms) => new Promise(res => setTimeout(res, ms));
const playAudio = (id) => {
    const audio = document.getElementById(id);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Audio play blocked."));
    }
};
const getGridPosition = (id) => {
    if (id >= 1 && id <= 9) return `9 / ${id} / 10 / ${id+1}`;
    if (id >= 10 && id <= 16) return `${9 - (id - 9)} / 9 / ${10 - (id - 9)} / 10`;
    if (id >= 17 && id <= 25) return `1 / ${9 - (id - 17)} / 2 / ${10 - (id - 17)}`;
    if (id >= 26 && id <= 32) return `${id - 25 + 1} / 1 / ${id - 25 + 2} / 2`;
    if (id === 1) return '9 / 1 / 10 / 2';
    if (id === 9) return '9 / 9 / 10 / 10';
    if (id === 17) return '1 / 9 / 2 / 10';
    if (id === 25) return '1 / 1 / 2 / 2';
    return '5 / 5 / 6 / 6';
};
const getWinningLink = () => {
    const roll = Math.random() * 100;
    let accumulatedChance = 0;
    for (const prize of GAME_DATA.PRIZES) {
        accumulatedChance += prize.chance;
        if (roll <= accumulatedChance) {
            return prize.url;
        }
    }
    return GAME_DATA.PRIZES[0].url; 
};
/* --- COMPONENTES MEMOIZADOS --- */
const ActionPopup = React.memo(({ show, title, message, actions, property, isAfk, disableInteractions }) => {
    if (!show) return null;
    const fallbackImage = GAME_DATA.ASSETS.FALLBACK_PROPERTY_IMAGE;
    
    let imageUrl = property?.image01 || fallbackImage;
    let promoText = '';
    if (property && property.visitCount !== undefined) {
         const visitCount = property.visitCount || 1; 
         const useFirstSet = visitCount % 2 !== 0; 
         if (useFirstSet) {
            imageUrl = property.image01;
            promoText = property.promo01 || '';
         } else {
            imageUrl = property.image02;
            promoText = property.promo02 || '';
         }
    }
    const handleImageError = (e) => {
        e.target.onerror = null; 
        e.target.src = fallbackImage;
    };

    const closeBtnAction = actions.find(a => a.isCloseButton);
    const panelActions = actions.filter(a => !a.isCloseButton);

    return (
        <div className="popup-overlay">
            <div className="popup-content"> 
                {closeBtnAction && (
                    <button
                        className={`button popup-close-style-override ${isAfk ? 'afk-active' : ''}`}
                        onClick={closeBtnAction.handler}
                        disabled={disableInteractions}
                        style={{ 
                            opacity: disableInteractions ? 0.5 : 1, 
                            cursor: disableInteractions ? 'not-allowed' : 'pointer',
                            ...(isAfk ? { animationDuration: `${GAME_DATA.DELAYS.AFK_WAIT}ms` } : {})
                        }}
                        title={closeBtnAction.text === 'Pasar' ? 'Pasar Turno' : (closeBtnAction.text === 'X' ? 'Cerrar' : closeBtnAction.text)}
                    >
                        X
                    </button>
                )}

                <div className="popup-image-container">
                    <img 
                        src={imageUrl} 
                        alt={title || 'Imagen de la Propiedad'}
                        onError={handleImageError}
                    />
                </div>
                <div className="popup-controls-panel">
                    <h2>{title}</h2>
                    {promoText && <p style={{ fontStyle: 'italic' }}>{promoText}</p>}
                    {message && <div className="popup-message-container">{message}</div>}
                    <div className="popup-actions">
                        {panelActions.map((action, index) => {
                             const isCritical = action.text.includes('Comprar') || action.text.includes('Vender') || action.text === 'Aceptar' || action.text === 'Continuar';
                             
                             return (
                                 <button
                                    key={index}
                                    className={`button ${action.className || ''} ${isAfk && isCritical ? 'afk-active' : ''}`}
                                    style={isAfk && isCritical ? { animationDuration: `${GAME_DATA.DELAYS.AFK_WAIT}ms` } : {}}
                                    onClick={action.handler}
                                    disabled={action.disabled || disableInteractions}> 
                                    {action.text}
                                </button>
                             );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
});
/* NUEVO COMPONENTE: MODAL DE GANADOR */
const WinnerModal = React.memo(({ show, winner, onClose, isAfk, playerCount, startTime }) => {
    const [prizeLink, setPrizeLink] = React.useState('#');
    const isAI = winner?.isAI;

    React.useEffect(() => {
        if (show && winner && !isAI) {
            const now = new Date();
            const start = new Date(startTime || Date.now());

            const formatDate = (d) => d.toLocaleDateString('es-CL');
            const formatTime = (d) => d.toLocaleTimeString('es-CL');

            const payload = {
                g: winner.name,           
                j: playerCount || 1,      
                f: formatDate(now),       
                t_s: formatTime(start),   
                t_e: formatTime(now)      
            };

            const SECRET_KEY = "LGA-S3CRET-2026";
            const applyXOR = (text, key) => {
                return text.split('').map((char, i) => 
                    String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
                ).join('');
            };

            const jsonString = JSON.stringify(payload);
            const encrypted = applyXOR(jsonString, SECRET_KEY);
            const token = btoa(encodeURIComponent(encrypted));
            
            setPrizeLink(`./Premiacion.html?data=${token}`);
        }
    }, [show, winner, playerCount, startTime, isAI]);

    if (!show || !winner) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content"> 
                <button 
                    className="button popup-close-style-override"
                    onClick={onClose}
                    title="Cerrar y Volver al Inicio"
                >
                    X
                </button>
                <div className="popup-image-container" style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '1rem',
                    backgroundColor: 'rgba(var(--page-bg-rgb), 1)'
                }}>
                    <h1 style={{ 
                        fontSize: 'clamp(2rem, 7vw, 4rem)', 
                        color: 'var(--title-color)', 
                        marginBottom: 'clamp(1rem, 3vmin, 2rem)',
                        lineHeight: 1.1
                    }}>
                        {isAI ? "¡Gana la Máquina!" : "¡Magnate\nAriqueño!"}
                    </h1>
                    <h2 style={{ 
                        fontSize: 'clamp(1.5rem, 5vw, 2.8rem)', 
                        color: 'var(--text-color)',
                        wordBreak: 'break-word',
                        lineHeight: 1
                    }}>
                        {winner.name}
                    </h2>
                </div>
                <div className="popup-controls-panel" style={{ 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    padding: 'clamp(1rem, 3vmin, 2rem)',
                    gap: 'clamp(1.5rem, 5vmin, 3rem)' 
                }}> 
                     <p style={{ 
                        fontSize: 'clamp(1.1rem, 3.5vmin, 1.6rem)', 
                        textAlign: 'center',
                        fontStyle: 'italic',
                        lineHeight: 1.4,
                        margin: 0
                    }}>
                        {isAI 
                            ? "La inteligencia artificial ha conquistado el mercado. ¡Mejor suerte para la próxima!" 
                            : "¡Felicitaciones y gracias por participar en este recorrido por nuestra ciudad!"
                        }
                    </p>
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        {isAI ? (
                            <button 
                                onClick={onClose}
                                className="button"
                                style={{ 
                                    width: 'auto',
                                    minWidth: '60%',
                                    fontSize: 'clamp(0.8rem, 5vmin, 2.1rem)',
                                    padding: 'clamp(12px, 2.5vmin, 20px) clamp(25px, 5vw, 50px)'
                                }}
                            >
                                Intentar de Nuevo
                            </button>
                        ) : (
                            <a 
                                href={prizeLink} 
                                target="_self" 
                                rel="noopener noreferrer"
                                className={`button ${isAfk ? 'afk-active' : ''}`}
                                style={{ 
                                    textDecoration: 'none', 
                                    display: 'inline-block',
                                    width: 'auto',
                                    minWidth: '60%',
                                    fontSize: 'clamp(0.8rem, 5vmin, 2.1rem)',
                                    padding: 'clamp(12px, 2.5vmin, 20px) clamp(25px, 5vw, 50px)',
                                    animationDuration: isAfk ? `${GAME_DATA.DELAYS.AFK_WAIT}ms` : '0ms'
                                }}
                            >
                                Cobrar Premio
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});
const DiceFace = React.memo(({ value }) => {
    const dots = [];
    if (value === 1 || value === 3 || value === 5) dots.push(<div key="mid-center" className="dice-dot" style={{ gridArea: '2 / 2' }}></div>);
    if (value >= 2 && value <= 6) {
        dots.push(<div key="top-left" className="dice-dot" style={{ gridArea: '1 / 1' }}></div>);
        dots.push(<div key="bottom-right" className="dice-dot" style={{ gridArea: '3 / 3' }}></div>);
    }
    if (value >= 4 && value <= 6) {
        dots.push(<div key="top-right" className="dice-dot" style={{ gridArea: '1 / 3' }}></div>);
        dots.push(<div key="bottom-left" className="dice-dot" style={{ gridArea: '3 / 1' }}></div>);
    }
    if (value === 6) {
        dots.push(<div key="mid-left" className="dice-dot" style={{ gridArea: '2 / 1' }}></div>);
        dots.push(<div key="mid-right" className="dice-dot" style={{ gridArea: '2 / 3' }}></div>);
    }
    return <div className="die">{dots}</div>;
});
const Casilla = React.memo(({ data, ownerColor, onClick }) => {
    const isLightTheme = document.body.classList.contains('light-theme');
    const themeColor = isLightTheme ? data.colorLight : data.colorDark;
    const bgColor = ownerColor || themeColor;
    const style = {
        gridArea: getGridPosition(data.id),
        backgroundColor: bgColor,
    };
    if (ownerColor) {
        style.color = '#FFFFFF';
    }
    return (
        <div
            className={`board-cell ${data.isCorner ? 'corner' : ''}`}
            style={style}
            data-id={data.id}
            data-owned={!!ownerColor}
            onClick={() => onClick(data.id)}
        >
            <div className="cell-text-wrapper">
                <div className="property-name">{data.name}</div>
                {data.price && <div className="property-price">${data.price.toLocaleString('es-CL')}</div>}
            </div>
        </div>
    );
});
const PlayerToken = React.memo(({ player, index }) => {
    const gridPosition = getGridPosition(player.position);
    const offsets = [
        { top: '10%', left: '10%' },
        { top: '10%', right: '10%' },
        { bottom: '10%', left: '10%' },
        { bottom: '10%', right: '10%' }
    ];
    return (
        <div style={{ 
            position: 'absolute',
            gridArea: gridPosition,
            width: '34%',
            height: '34%',
            backgroundColor: player.color,
            borderRadius: '50%',
            border: '1px solid #fff',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.55)',
            transition: 'all 0.5s ease-in-out',
            ...offsets[index % 4],
            zIndex: 10 + index,
        }} />
    );
});
const Tablero = React.memo(({ players, properties, centralImage, onCellClick }) => {
    const getOwnerColorForCell = (cellData) => {
        if (cellData.type !== 'property') return null;
        const propertyState = properties[cellData.id];
        const ownerId = propertyState?.owner;
        const owner = (typeof ownerId === 'number' && players && players[ownerId]) ? players[ownerId] : null;
        return owner ? owner.color : null;
    }
    const handleSponsorError = (e) => {
        e.target.onerror = null;
        e.target.src = GAME_DATA.ASSETS.GENERIC_CENTRAL_IMAGE;
    };
    return (
        <div className="board-container">
            {GAME_DATA.BOARD.map(casillaData => (
                <Casilla key={casillaData.id} data={casillaData} ownerColor={getOwnerColorForCell(casillaData)} onClick={onCellClick} />
            ))}
            <div className="center-logo" style={{ padding: centralImage ? '0' : '1rem' }}>
                {centralImage ? (
                    <img 
                        id="sponsor-image-dynamic" 
                        src={centralImage.src} 
                        alt="Patrocinio" 
                        onError={handleSponsorError}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                ) : (
                    <h1 style={{fontSize: 'clamp(2rem, 8vmin, 4rem)'}}>La Gran Arica</h1>
                )}
            </div>
            {players.map((player, index) => (
                <PlayerToken key={`player-${player.id}`} player={player} index={index} />
            ))}
        </div>
    );
});
const PantallaInicio = React.memo(({ activeScreen, setActiveScreen, user, onLogout, oauthProcessing }) => {
    if (activeScreen !== 'inicio') return null;

    const handleOnlineLogin = async () => {
        if (user) {
            setActiveScreen('lobbyOnline');
            return;
        }
        try {
            // Usar URL completa actual para redirección correcta
            const currentUrl = window.location.href.split('#')[0]; // Quitar cualquier hash previo
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: currentUrl
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error("Error al iniciar sesión:", error.message);
            alert("No pudimos conectar con Google. Verifica tu conexión.");
        }
    };

    return (
        <div id="inicio" className="screen active">
            <div className="inicio-frame">
                <header className="inicio-header">
                    <h1>¡La Gran Arica!</h1>
                    {user && (
                        <div className="user-badge">
                            <img src={user.user_metadata.avatar_url} alt="Foto" />
                            <span>Hola, {user.user_metadata.full_name.split(' ')[0]}</span>
                            <button className="logout-mini" onClick={onLogout}>Cerrar</button>
                        </div>
                    )}
                </header>
                <main className="inicio-main"></main>
                <footer className="inicio-footer">
                    <button className="button" onClick={() => setActiveScreen('setupLocal')}>Juega en Local</button>
                    <button className="button" onClick={handleOnlineLogin} disabled={oauthProcessing}>
                        {oauthProcessing ? 'Procesando...' : (user ? 'Entrar al Lobby Online' : 'Juega en Línea')}
                    </button>
                </footer>
            </div>
        </div>
    );
});

// Función helper para insertar jugador (maneja BD con o sin campo email)
const insertPlayer = async (supabase, playerData) => {
    try {
        // Intentar insertar con email primero
        const { error } = await supabase
            .from('players_online')
            .insert([playerData]);

        if (error && error.message && error.message.includes('email')) {
            // Si falla por email, intentar sin email
            const { email, ...dataWithoutEmail } = playerData;
            const { error: error2 } = await supabase
                .from('players_online')
                .insert([dataWithoutEmail]);
            return { error: error2 };
        }

        return { error };
    } catch (e) {
        return { error: e };
    }
};

const PantallaLobbyOnline = React.memo(({ activeScreen, setActiveScreen, user, onStartGame }) => {
    // Validación temprana: no renderizar si no es la pantalla activa
    if (activeScreen !== 'lobbyOnline') return null;

    const [roomCode, setRoomCode] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [loadingMessage, setLoadingMessage] = React.useState('Buscando partidas disponibles...');
    const [currentRoom, setCurrentRoom] = React.useState(null);
    const [players, setPlayers] = React.useState([]);
    // Tiempo de espera basado en el servidor - se calcula dinámicamente
    const [timeLeft, setTimeLeft] = React.useState(180);
    const [roomCreatedAt, setRoomCreatedAt] = React.useState(null);
    const [copied, setCopied] = React.useState(false);
    const [matchmakingAttempted, setMatchmakingAttempted] = React.useState(false);
    const [showJoinByCode, setShowJoinByCode] = React.useState(false);
    const [showRoomSelector, setShowRoomSelector] = React.useState(false);
    const [availableRooms, setAvailableRooms] = React.useState([]);
    const [manualCode, setManualCode] = React.useState('');
    const matchmakingInProgress = React.useRef(false);
    const gameStarting = React.useRef(false);

    // Función para iniciar partida local con IA aleatoria
    const startLocalGameWithAI = () => {
        const randomAI = GAME_DATA.AI_PROFILES[Math.floor(Math.random() * GAME_DATA.AI_PROFILES.length)];
        const userName = user.user_metadata?.full_name || 'Jugador';
        const userEmail = user.email || user.user_metadata?.email || '';

        // Guardar email para análisis
        console.log('Jugador redirigido a local:', { name: userName, email: userEmail, reason: 'no_players_found' });

        // Configurar partida local: Usuario + IA aleatoria
        const playerData = [
            { id: 1, name: userName, isAI: false },
            { id: 2, name: randomAI.name, isAI: true }
        ];

        // Limpiar sala si estaba en una
        if (currentRoom) {
            supabase.from('players_online').delete().eq('room_id', currentRoom.id).eq('user_id', user.id);
        }

        // Configurar partida de 10 minutos (600 segundos)
        const gameConfig = {
            gameDurationMs: 600 * 1000, // 10 minutos
            isLocal: true,
            startedFromLobby: true,
            playerEmail: userEmail // Para tracking
        };

        onStartGame(playerData, gameConfig);
    };

    // Función para limpiar salas huérfanas
    const cleanupEmptyRooms = async () => {
        try {
            console.log('Limpiando salas huérfanas...');
            // Obtener todas las salas waiting
            const { data: rooms } = await supabase
                .from('rooms')
                .select('id, code')
                .eq('status', 'waiting');

            for (const room of rooms || []) {
                const { count } = await supabase
                    .from('players_online')
                    .select('*', { count: 'exact' })
                    .eq('room_id', room.id);

                if (count === 0) {
                    console.log('Eliminando sala huérfana:', room.code);
                    await supabase.from('rooms').delete().eq('id', room.id);
                }
            }
        } catch (e) {
            console.error('Error limpiando salas:', e);
        }
    };

    // Función para cargar salas disponibles (para el dropdown)
    const loadAvailableRooms = async () => {
        try {
            const { data: rooms } = await supabase
                .from('rooms')
                .select('id, code, status')
                .eq('status', 'waiting');

            const roomsWithCount = await Promise.all(
                (rooms || []).map(async (room) => {
                    const { count } = await supabase
                        .from('players_online')
                        .select('*', { count: 'exact' })
                        .eq('room_id', room.id);
                    return { ...room, playerCount: count || 0 };
                })
            );

            // Solo salas con 1-3 jugadores (no vacías, no llenas)
            const validRooms = roomsWithCount.filter(r => r.playerCount >= 1 && r.playerCount < 4);
            setAvailableRooms(validRooms);
        } catch (e) {
            console.error('Error cargando salas disponibles:', e);
        }
    };

    // Recuperación de sesión del lobby - ejecutar antes del matchmaking
    React.useEffect(() => {
        if (currentRoom || matchmakingInProgress.current) return;

        const restoreLobbySession = async () => {
            const savedLobby = localStorage.getItem('lga_lobby_session');
            if (savedLobby) {
                try {
                    const lobbyData = JSON.parse(savedLobby);
                    const now = Date.now();
                    const MAX_AGE_MS = 5 * 60 * 1000; // 5 minutos máximo

                    if (now - lobbyData.timestamp < MAX_AGE_MS && lobbyData.roomId) {
                        console.log('[DEBUG] Intentando recuperar sesión del lobby:', lobbyData.roomId);

                        // Verificar si la sala aún existe y está en espera
                        const { data: room } = await supabase
                            .from('rooms')
                            .select('*')
                            .eq('id', lobbyData.roomId)
                            .eq('status', 'waiting')
                            .single();

                        if (room) {
                            console.log('[DEBUG] Sala recuperada exitosamente:', room.code);
                            setCurrentRoom(room);
                            setRoomCreatedAt(new Date(room.created_at).getTime());

                            // Recargar jugadores de la sala
                            const { data: roomPlayers } = await supabase
                                .from('players_online')
                                .select('*')
                                .eq('room_id', room.id)
                                .order('id', { ascending: true });

                            if (roomPlayers) {
                                const uniquePlayers = [];
                                const seenUserIds = new Set();
                                for (const player of roomPlayers) {
                                    if (!seenUserIds.has(player.user_id)) {
                                        seenUserIds.add(player.user_id);
                                        uniquePlayers.push(player);
                                    }
                                }
                                setPlayers(uniquePlayers);
                                console.log('[DEBUG] Jugadores recuperados:', uniquePlayers.length);
                            }

                            setMatchmakingAttempted(true);
                            setLoading(false);
                            return true;
                        } else {
                            console.log('[DEBUG] Sala ya no existe o ya inició, limpiando sesión');
                            localStorage.removeItem('lga_lobby_session');
                        }
                    } else {
                        localStorage.removeItem('lga_lobby_session');
                    }
                } catch (e) {
                    console.error('[DEBUG] Error recuperando sesión del lobby:', e);
                    localStorage.removeItem('lga_lobby_session');
                }
            }
            return false;
        };

        restoreLobbySession();
    }, []);

    // Matchmaking automático al entrar
    React.useEffect(() => {
        if (matchmakingAttempted || currentRoom || matchmakingInProgress.current) return;

        const attemptMatchmaking = async () => {
            // Evitar ejecuciones simultáneas
            if (matchmakingInProgress.current) return;
            matchmakingInProgress.current = true;
            setLoading(true);
            setLoadingMessage('Buscando salas activas...');

            try {
                // Primero limpiar salas huérfanas
                await cleanupEmptyRooms();

                // Limpiar cualquier membresía previa de este usuario
                // (registros residuales de sesiones anteriores que no se borraron)
                console.log('Limpiando membresías previas del usuario...');
                const { error: cleanupError } = await supabase
                    .from('players_online')
                    .delete()
                    .eq('user_id', user.id);

                if (cleanupError) {
                    console.warn('No se pudieron limpiar membresías previas:', cleanupError);
                } else {
                    console.log('Membresías previas limpiadas exitosamente');
                }

                // Buscar salas "waiting" ordenadas por created_at (las más antiguas primero)
                console.log('Buscando salas disponibles...');
                const { data: rooms, error: roomsError } = await supabase
                    .from('rooms')
                    .select('*')
                    .eq('status', 'waiting')
                    .order('created_at', { ascending: true });

                if (roomsError) throw roomsError;
                console.log('Salas encontradas:', rooms?.length || 0, rooms?.map(r => r.code));

                // Buscar una sala con espacio disponible (1-3 jugadores, no vacías ni llenas)
                let joinedRoom = null;
                // Ordenar salas: primero las que tienen 1-3 jugadores (activas), luego las vacías
                const sortedRooms = (rooms || []).sort((a, b) => {
                    // Las salas con jugadores tienen prioridad sobre las vacías
                    return 0; // Mantener orden original por ahora
                });

                for (const room of sortedRooms) {
                    // Contar jugadores en esta sala
                    const { count, error: countError } = await supabase
                        .from('players_online')
                        .select('*', { count: 'exact' })
                        .eq('room_id', room.id);

                    if (countError) continue;

                    // Verificar si el usuario ya está en esta sala
                    const { data: existingPlayers } = await supabase
                        .from('players_online')
                        .select('*')
                        .eq('room_id', room.id)
                        .eq('user_id', user.id);

                    if (existingPlayers && existingPlayers.length > 0) {
                        // Ya está en esta sala
                        joinedRoom = room;
                        break;
                    }

                    console.log(`Sala ${room.code} tiene ${count} jugadores`);

                    // Ignorar salas vacías (0 jugadores) - probablemente huérfanas de pruebas anteriores
                    // Ignorar salas llenas (4+ jugadores)
                    if (count === 0) {
                        console.log(`Ignorando sala ${room.code} vacía`);
                        continue;
                    }
                    if (count >= 4) {
                        console.log(`Sala ${room.code} llena, saltando`);
                        continue;
                    }

                    console.log(`Sala ${room.code} tiene espacio disponible`);
                    if (count < 4) {
                        // Unirse a esta sala
                        const userEmail = user.email || user.user_metadata?.email || '';
                        console.log('Intentando unirse a sala:', room.code, 'como jugador #', count + 1);
                        const { error: joinError } = await insertPlayer(supabase, {
                            room_id: room.id,
                            user_id: user.id,
                            name: user.user_metadata?.full_name || 'Jugador',
                            email: userEmail,
                            photo: user.user_metadata?.avatar_url || '',
                            color: GAME_DATA.PLAYERS.COLORS[count] || GAME_DATA.PLAYERS.COLORS[0],
                            is_ready: true,
                            position: 1,
                            money: GAME_DATA.PLAYERS.INITIAL_MONEY[count]
                        });

                        if (!joinError) {
                            console.log('Unido exitosamente a sala:', room.code);
                            joinedRoom = room;

                            // Cargar TODOS los jugadores de la sala (incluyendo el recién insertado)
                            const { data: allPlayers } = await supabase
                                .from('players_online')
                                .select('*')
                                .eq('room_id', room.id)
                                .order('id', { ascending: true });

                            // Deduplicar por user_id por seguridad
                            const uniquePlayers = [];
                            const seenUserIds = new Set();
                            for (const player of allPlayers || []) {
                                if (!seenUserIds.has(player.user_id)) {
                                    seenUserIds.add(player.user_id);
                                    uniquePlayers.push(player);
                                }
                            }

                            console.log('Jugadores cargados tras unirse:', uniquePlayers.length);
                            setPlayers(uniquePlayers);
                            break;
                        } else if (joinError.code === '23505') {
                            // Error: jugador ya existe en esta sala ( UNIQUE constraint violation )
                            console.log('Jugador ya estaba en la sala, recuperando estado...', room.code);
                            joinedRoom = room;

                            // Cargar todos los jugadores de la sala (incluyendo al usuario actual)
                            const { data: existingPlayers } = await supabase
                                .from('players_online')
                                .select('*')
                                .eq('room_id', room.id)
                                .order('id', { ascending: true });

                            // Deduplicar por user_id
                            const uniquePlayers = [];
                            const seenUserIds = new Set();
                            for (const player of existingPlayers || []) {
                                if (!seenUserIds.has(player.user_id)) {
                                    seenUserIds.add(player.user_id);
                                    uniquePlayers.push(player);
                                }
                            }

                            if (uniquePlayers) {
                                console.log('Jugadores recuperados:', uniquePlayers.length);
                                setPlayers(uniquePlayers);
                            }
                            break;
                        } else {
                            console.error('Error al unirse a sala:', joinError);
                        }
                    }
                }

                if (joinedRoom) {
                    setCurrentRoom(joinedRoom);
                    setRoomCode(joinedRoom.code);
                    setRoomCreatedAt(new Date(joinedRoom.created_at).getTime());

                    // Guardar sesión del lobby para recuperación
                    localStorage.setItem('lga_lobby_session', JSON.stringify({
                        roomId: joinedRoom.id,
                        code: joinedRoom.code,
                        timestamp: Date.now()
                    }));
                } else {
                    // No hay salas disponibles, crear una
                    setLoadingMessage('Creando nueva sala...');
                    await createNewRoom();
                }
            } catch (error) {
                console.error('Error en matchmaking:', error);
                // Fallback: crear sala propia
                await createNewRoom();
            } finally {
                setLoading(false);
                setMatchmakingAttempted(true);
                matchmakingInProgress.current = false;
            }
        };

        attemptMatchmaking();
    }, [matchmakingAttempted, currentRoom, user]);

    const createNewRoom = async () => {
        // Verificar si el jugador ya está en una sala
        console.log('Verificando si jugador ya está en una sala...');
        const { data: existingMemberships, error: membershipError } = await supabase
            .from('players_online')
            .select('room_id, rooms(*)')
            .eq('user_id', user.id);

        if (membershipError) {
            console.warn('Error verificando membresía existente:', membershipError);
        }

        if (existingMemberships && existingMemberships.length > 0) {
            const existingMembership = existingMemberships[0];
            console.log('Jugador ya está en sala existente, recuperando:', existingMembership);
            setCurrentRoom(existingMembership.rooms);
            setRoomCode(existingMembership.rooms.code);

            // Cargar jugadores de esa sala
            const { data: playersInRoom } = await supabase
                .from('players_online')
                .select('*')
                .eq('room_id', existingMembership.room_id)
                .order('id', { ascending: true });

            if (playersInRoom) {
                setPlayers(playersInRoom);
            }
            return existingMembership.rooms;
        }

        const code = Math.random().toString(36).substring(2, 6).toUpperCase();
        try {
            const { data: room, error: roomError } = await supabase
                .from('rooms')
                .insert([{ code, status: 'waiting' }])
                .select()
                .single();

            if (roomError) throw roomError;

            const userEmail = user.email || user.user_metadata?.email || '';
            const { error: playerError } = await insertPlayer(supabase, {
                room_id: room.id,
                user_id: user.id,
                name: user.user_metadata?.full_name || 'Jugador',
                email: userEmail,
                photo: user.user_metadata?.avatar_url || '',
                color: GAME_DATA.PLAYERS.COLORS[0],
                is_ready: true,
                position: 1,
                money: GAME_DATA.PLAYERS.INITIAL_MONEY[0]  // Anfitrión siempre 7100
            });

            if (playerError) {
                console.error('Error al insertar jugador en nueva sala:', playerError);
                throw playerError;
            }

            console.log('Sala creada y jugador insertado:', { roomId: room.id, code, userId: user.id });

            // Agregar el jugador manualmente al estado para evitar race condition
            const newPlayer = {
                id: Date.now(), // ID temporal hasta que el suscriptor traiga el real
                room_id: room.id,
                user_id: user.id,
                name: user.user_metadata?.full_name || 'Jugador',
                email: user.email || user.user_metadata?.email || '',
                photo: user.user_metadata?.avatar_url || '',
                color: GAME_DATA.PLAYERS.COLORS[0],
                is_ready: true,
                position: 1,
                money: GAME_DATA.PLAYERS.INITIAL_MONEY[0]
            };
            setPlayers([newPlayer]);

            setCurrentRoom(room);
            setRoomCode(code);
            setRoomCreatedAt(new Date(room.created_at).getTime());

            // Guardar sesión del lobby para recuperación
            localStorage.setItem('lga_lobby_session', JSON.stringify({
                roomId: room.id,
                code: code,
                timestamp: Date.now()
            }));

            return room;
        } catch (error) {
            console.error('Error al crear sala:', error);
            alert('No se pudo crear la sala. Intenta de nuevo.');
            return null;
        }
    };

    // Guardar roomCreatedAt cuando se crea/une a una sala
    React.useEffect(() => {
        if (currentRoom?.created_at) {
            setRoomCreatedAt(new Date(currentRoom.created_at).getTime());
        }
    }, [currentRoom?.id]);

    // Timer y lógica de inicio automático - SINCRONIZADO CON SERVIDOR
    React.useEffect(() => {
        if (!currentRoom || !roomCreatedAt) return;

        const WAIT_TIME_MS = 3 * 60 * 1000; // 3 minutos en ms

        const timer = setInterval(() => {
            const now = Date.now();
            const elapsed = now - roomCreatedAt;
            const remaining = Math.max(0, Math.ceil((WAIT_TIME_MS - elapsed) / 1000));

            setTimeLeft(remaining);

            const playerCount = players.length;

            // Solo el anfitrión puede iniciar la partida automáticamente
            const isHost = players.length > 0 && players[0]?.user_id === user?.id;

            // Si llegamos a 4 jugadores → iniciar inmediatamente (solo anfitrión)
            if (playerCount >= 4 && isHost) {
                clearInterval(timer);
                startOnlineGame();
                return;
            }

            // Si el tiempo llegó a 0
            if (remaining <= 0) {
                clearInterval(timer);
                if (playerCount === 1) {
                    // Solo el anfitrión, ir a partida local
                    if (isHost) startLocalGameWithAI();
                } else if (playerCount >= 2) {
                    // 2-3 jugadores, iniciar (solo anfitrión)
                    if (isHost) startOnlineGame();
                }
                return;
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [currentRoom, players.length, roomCreatedAt, user?.id]);

    // Iniciar partida online (2-4 jugadores)
    const startOnlineGame = () => {
        // Evitar ejecuciones simultáneas o repetidas
        if (gameStarting.current) {
            console.log('[DEBUG] startOnlineGame: Partida ya está iniciando, ignorando llamada duplicada');
            return;
        }
        gameStarting.current = true;
        console.log('[DEBUG] startOnlineGame() iniciado');

        try {
            // Validación 1: Verificar cantidad de jugadores
            if (!players || players.length < 2) {
                console.warn('[DEBUG] startOnlineGame: No hay suficientes jugadores', { players });
                gameStarting.current = false;
                return;
            }
            console.log('[DEBUG] Jugadores validados:', players.length, players);

            // Validación 2: Verificar currentRoom
            if (!currentRoom) {
                console.error('[DEBUG] startOnlineGame: currentRoom es null/undefined');
                alert('Error: No se encontró la sala actual. Intenta recargar.');
                return;
            }
            console.log('[DEBUG] Sala actual:', currentRoom);

            // Validación 3: Verificar onStartGame
            if (typeof onStartGame !== 'function') {
                console.error('[DEBUG] startOnlineGame: onStartGame no es una función', onStartGame);
                return;
            }

            // Convertir jugadores online al formato del juego
            console.log('[DEBUG] Convirtiendo jugadores al formato del juego...');
            const gamePlayers = players.map((p, idx) => {
                console.log(`[DEBUG] Procesando jugador ${idx}:`, p);

                if (!p) {
                    console.error(`[DEBUG] Jugador ${idx} es null/undefined`);
                    return null;
                }

                const color = p.color || GAME_DATA.PLAYERS.COLORS[idx];
                if (!color) {
                    console.warn(`[DEBUG] No hay color definido para jugador ${idx}, usando default`);
                }

                return {
                    id: idx,
                    name: p.name || `Jugador ${idx + 1}`,
                    isAI: false,
                    color: color || '#FF6B6B',
                    userId: p.user_id // Guardar el user_id de Supabase
                };
            }).filter(p => p !== null); // Eliminar nulos

            console.log('[DEBUG] gamePlayers convertidos:', gamePlayers);

            if (gamePlayers.length < 2) {
                console.error('[DEBUG] No hay suficientes jugadores válidos después de la conversión');
                return;
            }

            // Marcar sala como playing
            console.log('[DEBUG] Marcando sala como playing...');
            supabase.from('rooms').update({ status: 'playing' }).eq('id', currentRoom.id)
                .then(({ error }) => {
                    if (error) console.error('[DEBUG] Error marcando sala como playing:', error);
                    else console.log('[DEBUG] Sala marcada como playing exitosamente');
                });

            // Iniciar partida - duración según cantidad de jugadores
            // 2 jugadores: 10 min, 3 jugadores: 20 min, 4 jugadores: 30 min
            const playerCount = gamePlayers.length;
            const durationMinutes = playerCount === 2 ? 10 : (playerCount === 3 ? 20 : 30);
            const gameConfig = {
                gameDurationMs: durationMinutes * 60 * 1000,
                isOnline: true,
                roomId: currentRoom.id,
                roomCode: currentRoom.code,
                userId: user?.id // Guardar el user_id del jugador actual
            };
            console.log('[DEBUG] Duración de partida:', durationMinutes, 'minutos para', playerCount, 'jugadores');
            console.log('[DEBUG] gameConfig:', gameConfig);

            console.log('[DEBUG] Llamando a onStartGame...');
            // Limpiar sesión del lobby al iniciar el juego
            localStorage.removeItem('lga_lobby_session');
            onStartGame(gamePlayers, gameConfig);
            console.log('[DEBUG] onStartGame completado');

        } catch (error) {
            console.error('[DEBUG] ERROR CRÍTICO en startOnlineGame:', error);
            console.error('[DEBUG] Stack trace:', error.stack);
            alert('Error al iniciar la partida: ' + error.message);
            gameStarting.current = false;
        }
    };

    // Suscripción Realtime a jugadores
    React.useEffect(() => {
        if (!currentRoom) return;

        const loadPlayers = async () => {
            console.log('Cargando jugadores para sala:', currentRoom.id);
            const { data, error } = await supabase
                .from('players_online')
                .select('*')
                .eq('room_id', currentRoom.id)
                .order('id', { ascending: true });

            if (error) {
                console.error('Error cargando jugadores:', error);
            } else {
                console.log('Jugadores cargados desde BD:', data?.length || 0, data);

                // Deduplicar por user_id para evitar jugadores fantasma
                if (data) {
                    const uniquePlayers = [];
                    const seenUserIds = new Set();

                    for (const player of data) {
                        if (seenUserIds.has(player.user_id)) {
                            console.warn('Jugador duplicado en BD, ignorando:', player.name, player.user_id);
                            continue;
                        }
                        seenUserIds.add(player.user_id);
                        uniquePlayers.push(player);
                    }

                    if (uniquePlayers.length !== data.length) {
                        console.warn(`Deduplicación: ${data.length} → ${uniquePlayers.length} jugadores`);
                    }

                    setPlayers(uniquePlayers);
                }
            }
        };
        loadPlayers();

        // Suscribirse a cambios en la sala (para detectar inicio de partida)
        const roomSubscription = supabase
            .channel(`room-status-${currentRoom.id}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'rooms',
                filter: `id=eq.${currentRoom.id}`
            }, (payload) => {
                console.log('Room status changed:', payload.new);
                if (payload.new.status === 'playing' && activeScreen === 'lobbyOnline') {
                    console.log('Sala iniciada por otro jugador, uniéndose...');
                    // Cargar jugadores actuales e iniciar
                    loadPlayers().then(() => {
                        startOnlineGame();
                    });
                }
            })
            .subscribe();

        const subscription = supabase
            .channel(`room-${currentRoom.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'players_online',
                filter: `room_id=eq.${currentRoom.id}`
            }, (payload) => {
                console.log('Realtime event:', payload.eventType, payload);
                if (payload.eventType === 'INSERT') {
                    // Verificar si el jugador ya existe para evitar duplicados
                    setPlayers(prev => {
                        const exists = prev.some(p => p.user_id === payload.new.user_id);
                        if (exists) {
                            console.log('Jugador ya existe, ignorando INSERT:', payload.new.user_id);
                            return prev;
                        }
                        console.log('Agregando nuevo jugador:', payload.new);
                        return [...prev, payload.new];
                    });
                } else if (payload.eventType === 'DELETE') {
                    setPlayers(prev => prev.filter(p => p.id !== payload.old.id));
                } else if (payload.eventType === 'UPDATE') {
                    setPlayers(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
                }
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
            roomSubscription.unsubscribe();
        };
    }, [currentRoom, activeScreen]);

    // Unirse por código (opción manual para amigos)
    const joinRoomByCode = async () => {
        if (!roomCode || roomCode.length !== 4) {
            alert('Ingresa un código válido de 4 caracteres');
            return;
        }
        setLoading(true);
        try {
            const { data: room, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('code', roomCode.toUpperCase())
                .eq('status', 'waiting')
                .single();

            if (error || !room) {
                alert('Sala no encontrada o ya iniciada');
                setLoading(false);
                return;
            }

            const { count } = await supabase
                .from('players_online')
                .select('*', { count: 'exact' })
                .eq('room_id', room.id);

            if (count >= 4) {
                alert('La sala está llena');
                setLoading(false);
                return;
            }

            // Cargar jugadores existentes antes de unirse
            const { data: existingPlayers } = await supabase
                .from('players_online')
                .select('*')
                .eq('room_id', room.id)
                .order('id', { ascending: true });

            const userEmail = user.email || user.user_metadata?.email || '';
            await insertPlayer(supabase, {
                room_id: room.id,
                user_id: user.id,
                name: user.user_metadata?.full_name || 'Jugador',
                email: userEmail,
                photo: user.user_metadata?.avatar_url || '',
                color: GAME_DATA.PLAYERS.COLORS[count] || GAME_DATA.PLAYERS.COLORS[0],
                is_ready: true,
                position: 1,
                money: GAME_DATA.PLAYERS.INITIAL_MONEY[count]
            });

            // Agregar el jugador actual a la lista
            const joinedPlayer = {
                id: Date.now(),
                room_id: room.id,
                user_id: user.id,
                name: user.user_metadata?.full_name || 'Jugador',
                email: userEmail,
                photo: user.user_metadata?.avatar_url || '',
                color: GAME_DATA.PLAYERS.COLORS[count] || GAME_DATA.PLAYERS.COLORS[0],
                is_ready: true,
                position: 1,
                money: GAME_DATA.PLAYERS.INITIAL_MONEY[count]
            };
            setPlayers(existingPlayers ? [...existingPlayers, joinedPlayer] : [joinedPlayer]);

            setCurrentRoom(room);
            setRoomCreatedAt(new Date(room.created_at).getTime());
            setShowJoinByCode(false);

            // Guardar sesión del lobby para recuperación
            localStorage.setItem('lga_lobby_session', JSON.stringify({
                roomId: room.id,
                code: room.code,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('Error al unirse:', error);
            alert('No se pudo unir a la sala');
        } finally {
            setLoading(false);
        }
    };

    const leaveRoom = async () => {
        if (currentRoom) {
            console.log('Saliendo de sala:', currentRoom.code);
            await supabase.from('players_online').delete().eq('room_id', currentRoom.id).eq('user_id', user.id);
            const { count } = await supabase.from('players_online').select('*', { count: 'exact' }).eq('room_id', currentRoom.id);
            console.log('Jugadores restantes en sala:', count);
            if (count === 0) {
                console.log('Eliminando sala vacía:', currentRoom.code);
                await supabase.from('rooms').delete().eq('id', currentRoom.id);
            }
        }
        // Limpiar sesión del lobby al salir
        localStorage.removeItem('lga_lobby_session');
        setActiveScreen('inicio');
    };

    // Función para cambiar a otra sala
    const switchToRoom = async (newRoom) => {
        console.log('Cambiando a sala:', newRoom.code);
        setShowRoomSelector(false);

        // Salir de la sala actual
        if (currentRoom) {
            await supabase.from('players_online').delete()
                .eq('room_id', currentRoom.id)
                .eq('user_id', user.id);

            // Verificar si la sala anterior quedó vacía
            const { count } = await supabase
                .from('players_online')
                .select('*', { count: 'exact' })
                .eq('room_id', currentRoom.id);

            if (count === 0) {
                await supabase.from('rooms').delete().eq('id', currentRoom.id);
            }
        }

        // Unirse a la nueva sala
        try {
            const { count } = await supabase
                .from('players_online')
                .select('*', { count: 'exact' })
                .eq('room_id', newRoom.id);

            const userEmail = user.email || user.user_metadata?.email || '';
            await insertPlayer(supabase, {
                room_id: newRoom.id,
                user_id: user.id,
                name: user.user_metadata?.full_name || 'Jugador',
                email: userEmail,
                photo: user.user_metadata?.avatar_url || '',
                color: GAME_DATA.PLAYERS.COLORS[count] || GAME_DATA.PLAYERS.COLORS[0],
                is_ready: true,
                position: 1,
                money: GAME_DATA.PLAYERS.INITIAL_MONEY[count] || 7100
            });

            // Cargar jugadores de la nueva sala
            const { data: existingPlayers } = await supabase
                .from('players_online')
                .select('*')
                .eq('room_id', newRoom.id)
                .order('id', { ascending: true });

            // Agregar el jugador actual
            const joinedPlayer = {
                id: Date.now(),
                room_id: newRoom.id,
                user_id: user.id,
                name: user.user_metadata?.full_name || 'Jugador',
                email: userEmail,
                photo: user.user_metadata?.avatar_url || '',
                color: GAME_DATA.PLAYERS.COLORS[count] || GAME_DATA.PLAYERS.COLORS[0],
                is_ready: true,
                position: 1,
                money: GAME_DATA.PLAYERS.INITIAL_MONEY[count] || 7100
            };

            setPlayers(existingPlayers ? [...existingPlayers, joinedPlayer] : [joinedPlayer]);
            setCurrentRoom(newRoom);
            setRoomCode(newRoom.code);
            setTimeLeft(180); // Reset timer

        } catch (error) {
            console.error('Error cambiando de sala:', error);
            alert('No se pudo unir a la sala. Intenta de nuevo.');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Pantalla de carga inicial (matchmaking)
    if (loading && !currentRoom) {
        return (
            <div id="lobbyOnline" className="screen active">
                <div className="inicio-frame no-background">
                    <main className="inicio-main" style={{ justifyContent: 'center' }}>
                        <div className="matchmaking-loading">
                            <div className="loading-spinner"></div>
                            <h2>{loadingMessage}</h2>
                            <p>Buscando jugadores de la comunidad...</p>
                            <button className="button" onClick={() => { setLoading(false); setMatchmakingAttempted(true); }} style={{ marginTop: '20px' }}>
                                Cancelar
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // Pantalla de unirse por código (opción secundaria)
    if (showJoinByCode) {
        return (
            <div id="lobbyOnline" className="screen active">
                <div className="inicio-frame no-background">
                    <header className="inicio-header"><h1>Unirse por Código</h1></header>
                    <main className="inicio-main" style={{ justifyContent: 'center' }}>
                        <div className="action-card" style={{ maxWidth: '300px' }}>
                            <h3>Ingresa el código de tu amigo</h3>
                            <input
                                type="text"
                                placeholder="ABCD"
                                maxLength="4"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                className="text-input"
                                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '10px' }}
                            />
                            <button className="button" onClick={joinRoomByCode} disabled={roomCode.length !== 4}>
                                {loading ? 'Entrando...' : 'Unirse a Sala'}
                            </button>
                            <button className="button button-secondary" onClick={() => setShowJoinByCode(false)}>
                                Volver
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // Sala de espera
    if (currentRoom) {
        const isFull = players.length >= 4;
        const isAlone = players.length === 1;
        // Solo el anfitrión (primer jugador en la sala) puede iniciar la partida
        // Ordenar jugadores por ID para asegurar consistencia
        const sortedPlayers = [...players].sort((a, b) => a.id?.localeCompare(b.id));
        const firstPlayer = sortedPlayers[0];
        const isHost = firstPlayer?.user_id === user?.id;
        const canStart = players.length >= 2 && isHost;

        // Debug para verificar identificación del anfitrión
        console.log('[DEBUG] Lobby - Jugadores:', players.length, 'Primer jugador:', firstPlayer?.name, 'user?.id:', user?.id, 'isHost:', isHost);

        return (
            <div id="lobbyOnline" className="screen active">
                <div className="inicio-frame no-background">
                    <header className="inicio-header">
                        {/* Dropdown selector de sala */}
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <h1
                                onClick={() => {
                                    loadAvailableRooms();
                                    setShowRoomSelector(!showRoomSelector);
                                }}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    userSelect: 'none'
                                }}
                            >
                                Sala: {currentRoom.code}
                                <span style={{
                                    fontSize: '0.6em',
                                    transition: 'transform 0.2s',
                                    transform: showRoomSelector ? 'rotate(180deg)' : 'rotate(0deg)'
                                }}>▼</span>
                            </h1>

                            {showRoomSelector && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(0,0,0,0.95)',
                                    border: '2px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '15px',
                                    minWidth: '280px',
                                    zIndex: 100,
                                    marginTop: '10px'
                                }}>
                                    <h3 style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Otras Salas Disponibles</h3>

                                    {availableRooms.filter(r => r.id !== currentRoom.id).length === 0 ? (
                                        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>No hay otras salas activas</p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                                            {availableRooms
                                                .filter(r => r.id !== currentRoom.id)
                                                .map(room => (
                                                    <button
                                                        key={room.id}
                                                        onClick={() => switchToRoom(room)}
                                                        style={{
                                                            background: 'rgba(255,255,255,0.1)',
                                                            border: '1px solid var(--border-color)',
                                                            borderRadius: 'var(--radius-sm)',
                                                            padding: '8px',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <span>{room.code}</span>
                                                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{room.playerCount}/4</span>
                                                    </button>
                                                ))}
                                        </div>
                                    )}

                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '10px' }}>
                                        <p style={{ fontSize: '0.8rem', marginBottom: '8px' }}>¿Tienes un código?</p>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <input
                                                type="text"
                                                placeholder="ABCD"
                                                maxLength="4"
                                                value={manualCode}
                                                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                                                style={{
                                                    flex: 1,
                                                    padding: '8px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    border: '1px solid var(--border-color)',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    color: 'white',
                                                    textAlign: 'center',
                                                    letterSpacing: '3px',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    setRoomCode(manualCode);
                                                    joinRoomByCode();
                                                    setShowRoomSelector(false);
                                                }}
                                                disabled={manualCode.length !== 4}
                                                style={{
                                                    padding: '8px 15px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    border: 'none',
                                                    background: manualCode.length === 4 ? 'var(--button-bg)' : '#666',
                                                    color: manualCode.length === 4 ? 'var(--button-text)' : '#999',
                                                    cursor: manualCode.length === 4 ? 'pointer' : 'not-allowed',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Unirse
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setShowRoomSelector(false)}
                                        style={{
                                            marginTop: '10px',
                                            width: '100%',
                                            padding: '8px',
                                            background: 'transparent',
                                            border: '1px solid #666',
                                            borderRadius: 'var(--radius-sm)',
                                            color: '#999',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            )}
                        </div>

                        {canStart && !isFull && (
                            <div className="lobby-timer waiting">
                                Esperando jugadores: {formatTime(timeLeft)}
                            </div>
                        )}
                        {isAlone && (
                            <div className="lobby-timer alone">
                                Buscando jugadores: {formatTime(timeLeft)}
                            </div>
                        )}
                        {isFull && (
                            <div className="lobby-timer full">
                                ¡Sala completa! Iniciando...
                            </div>
                        )}
                    </header>
                    <main className="inicio-main">
                        <div className="lobby-room">
                            <div className="players-grid">
                                {players.map((player, idx) => (
                                    <div key={player.id} className={`player-slot ${player.is_ready ? 'ready' : ''}`}>
                                        <div className="player-avatar" style={{ borderColor: player.color }}>
                                            {player.photo ? (
                                                <img src={player.photo} alt={player.name} />
                                            ) : (
                                                <div className="avatar-placeholder">{player.name?.[0] || '?'}</div>
                                            )}
                                        </div>
                                        <span className="player-name">{player.name}</span>
                                        <span className="player-status">
                                            {player.is_ready ? '✓ Listo' : '...'}
                                        </span>
                                        {player.user_id === firstPlayer?.user_id && <span className="host-badge">Anfitrión</span>}
                                    </div>
                                ))}
                                {Array.from({ length: 4 - players.length }).map((_, idx) => (
                                    <div key={`empty-${idx}`} className="player-slot empty">
                                        <div className="player-avatar empty">+</div>
                                        <span className="player-name">Esperando...</span>
                                    </div>
                                ))}
                            </div>

                            <div className="lobby-info">
                                <p className="players-count">
                                    {players.length} de 4 jugadores
                                </p>
                                {isAlone && (
                                    <p className="lobby-message">
                                        Esperando jugadores... Si nadie entra en {formatTime(timeLeft)},
                                        jugarás contra la IA <strong>(AEB)</strong>
                                    </p>
                                )}
                                {canStart && !isFull && (
                                    <p className="lobby-message">
                                        ¡Bien! Sala con {players.length} jugadores.<br/>
                                        {players.length === 2 ? 'Esperando un 3er jugador...' :
                                         players.length === 3 ? 'Esperando un 4to jugador...' : 'Esperando más jugadores...'}<br/>
                                        Eres el anfitrión. Puedes iniciar cuando quieras.
                                    </p>
                                )}
                                {!canStart && players.length >= 2 && !isFull && !isHost && (
                                    <p className="lobby-message">
                                        Sala con {players.length} jugadores listos.<br/>
                                        Esperando a que el anfitrión ({firstPlayer?.name}) inicie la partida...
                                    </p>
                                )}
                            </div>

                            <div className="lobby-actions-row">
                                <button className="button" onClick={() => {
                                    navigator.clipboard.writeText(currentRoom.code);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}>
                                    {copied ? '¡Copiado!' : 'Copiar Código'}
                                </button>
                                {canStart && (
                                    <button className="button button-success" onClick={startOnlineGame}>
                                        Iniciar Ahora
                                    </button>
                                )}
                                <button className="button button-secondary" onClick={leaveRoom}>
                                    Salir
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // Fallback: Si el matchmaking no encontró sala, crear una nueva automáticamente
    React.useEffect(() => {
        if (!currentRoom && matchmakingAttempted && !loading) {
            console.log('Matchmaking sin éxito, creando sala automáticamente...');
            createNewRoom();
        }
    }, [currentRoom, matchmakingAttempted, loading]);

    // Mientras se crea la sala, mostrar loading
    return (
        <div id="lobbyOnline" className="screen active">
            <div className="inicio-frame no-background">
                <main className="inicio-main" style={{ justifyContent: 'center' }}>
                    <div className="matchmaking-loading">
                        <div className="loading-spinner"></div>
                        <h2>Preparando sala...</h2>
                        <p>Creando nueva partida</p>
                    </div>
                </main>
            </div>
        </div>
    );
});

const PantallaSetupLocal = React.memo(({ activeScreen, setActiveScreen, onStartGame }) => {
    const [localPlayers, setLocalPlayers] = React.useState([
        { id: 1, name: '', isAI: false },
        { id: 2, name: '', isAI: false },
        { id: 3, name: '', isAI: false },
        { id: 4, name: '', isAI: false },
    ]);
    const handlePlayerChange = (id, field, value) => {
        let processedValue = value;
        
        setLocalPlayers(prev => prev.map(p => {
            if (p.id !== id) return p;

            const updates = { [field]: processedValue };

            if (field === 'isAI') {
                if (processedValue === true) {
                    const usedNames = prev
                        .filter(other => other.id !== id && other.isAI && other.name)
                        .map(other => other.name);
                    
                    const availableProfiles = GAME_DATA.AI_PROFILES.filter(prof => !usedNames.includes(prof.name));
                    const pool = availableProfiles.length > 0 ? availableProfiles : GAME_DATA.AI_PROFILES;
                    updates.name = pool[Math.floor(Math.random() * pool.length)].name;
                } else {
                    updates.name = '';
                }
            }

            if (field === 'name' && typeof processedValue === 'string') {
                let formatted = processedValue.replace(/\s/g, ''); 
                if (formatted.length > 0) {
                   formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
                }
                updates.name = formatted;
            }
            
            return { ...p, ...updates };
        }));
    };
    const handleStart = () => {
        const reserved = ['paulaaeb', 'franaeb', 'coniaeb'];
        const finalPlayers = localPlayers.filter(p => p.name.trim() !== '');
        
        const hasReserved = finalPlayers.some(p => !p.isAI && reserved.includes(p.name.trim().toLowerCase()));
        if (hasReserved) {
            alert('¡Atención! Los nombres PaulaAeb, FranAeb y ConiAeb están reservados para la IA de las fundadoras.');
            return;
        }

        if (finalPlayers.length < 2) {
            alert('¡Atención! Necesitas al menos 2 jugadores para comenzar.');
            return;
        }

        const humanCount = finalPlayers.filter(p => !p.isAI).length;
        if (humanCount < 1) {
            alert('¡Atención! El juego requiere al menos un jugador humano.');
            return;
        }

        const elem = document.documentElement;
        try {
            if (elem.requestFullscreen) { elem.requestFullscreen().catch(err => console.log("Full Screen bloqueado.")); }
            else if (elem.webkitRequestFullscreen) { elem.webkitRequestFullscreen(); }
            else if (elem.msRequestFullscreen) { elem.msRequestFullscreen(); }
        } catch (error) { console.log("El dispositivo no soporta Full Screen automático."); }
        onStartGame(finalPlayers);
    };
    if (activeScreen !== 'setupLocal') return null;
    return (
        <div id="setupLocal" className="screen active">
            <div className="inicio-frame no-background">
                <header className="inicio-header">
                    <h1>Ingresar Nombres</h1>
                </header>
                <main className="inicio-main">
                    <div className="input-group">
                        {localPlayers.map((player, index) => {
                            const aiCount = localPlayers.filter(p => p.isAI).length;
                            const isLockedAsHuman = !player.isAI && aiCount >= 3;
                            
                            return (
                                <div key={player.id} className="player-input-row">
                                    <input
                                        type="text"
                                        className="text-input"
                                        value={player.name}
                                        placeholder={`Jugador0${index + 1}`}
                                        maxLength="12"
                                        title="Máximo 12 caracteres, sin espacios."
                                        onChange={(e) => handlePlayerChange(player.id, 'name', e.target.value)}
                                    />
                                    <label style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        whiteSpace: 'nowrap',
                                        opacity: isLockedAsHuman ? 0.7 : 1,
                                        cursor: isLockedAsHuman ? 'not-allowed' : 'pointer',
                                        minWidth: '45px'
                                    }}
                                    title={isLockedAsHuman ? "Debe haber al menos un humano" : "Activar Inteligencia Artificial"}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={player.isAI}
                                            disabled={isLockedAsHuman}
                                            onChange={(e) => handlePlayerChange(player.id, 'isAI', e.target.checked)}
                                            style={{ marginRight: '5px' }}
                                        /> 
                                        {isLockedAsHuman ? '👤' : 'IA'}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </main>
                <footer className="inicio-footer">
                    <button className="button" onClick={() => setActiveScreen('inicio')}> 
                        Regresar al Inicio
                    </button>
                    <button className="button" onClick={handleStart}>
                        Comenzar el Juego
                    </button>
                </footer>
            </div>
        </div>
    );
});
const GameHeaderWithOptions = () => {
    const [isInfoMenuOpen, setInfoMenuOpen] = React.useState(false);
    
    const toggleInfoMenu = () => {
        setInfoMenuOpen(!isInfoMenuOpen);
    };
    return (
        <>
            <header className="game-header">
                <div id="theme-toggle-logo" className="game-header__logo" onClick={toggleTheme} title="Cambiar Tema">
                    <img src="https://i.imgur.com/UErigL7.jpeg" alt="Logo Arica es Bacán" />
                </div>
                <div className="game-header__title-container">
                    <h1 className="game-header__title">LA GRAN ARICA</h1>
                    <p className="game-header__slogan">Un juego ariqueño para niños de hasta 100 años</p>
                </div>
                <div id="info-menu-trigger" className="game-header__logo" title="Informaciones" onClick={toggleInfoMenu}>
                    <img src="https://i.imgur.com/BqcC3zY.png" alt="Icono de Información" />
                </div>
            </header>
            <div id="info-menu" className={isInfoMenuOpen ? 'open' : ''}>
                <header className="inicio-header">
                    <h1>Reglas del Juego</h1>
                </header>
                
                <h3>🎯 Objetivos</h3>
                <p>El principal objetivo es convertirte en el "Magnate Ariqueño" más rico de la ciudad. Acumula la mayor fortuna comprando, arrendando o vendiendo propiedades. ¡El jugador con el mayor patrimonio (capital + valor de propiedades) al final del juego gana!</p>
                
                <h3>⚙️ Configuración</h3>
                <p>Antes de empezar, personaliza tu juego:</p>
                <ul>
                    <li><strong>Cantidad de jugadores:</strong> Elige jugar entre 2, 3 o 4 participantes, ya sean familiares, amigos, nuestros bots de IA o miembros de la comunidad On Line.</li>
                    <li><strong>Ingresar Nombres:</strong> Dale un nombre único a cada participante para una experiencia personalizada. Se necesita un mínimo de dos jugadores para iniciar. Si quieres jugar con menos de cuatro participantes, deja en blanco los nombres de los jugadores que no participarán y el sistema los omitirá automáticamente.</li>
                    <li><strong>Tiempo de juego:</strong> Para equilibrar la partida, la duración se ajusta automáticamente según si hay 2, 3 o 4 jugadores, con 10, 20 y 30 minutos respectivamente. El juego finaliza cuando se agota el tiempo.</li>
                </ul>
                
                <h3>🎲 ¿Cómo se Juega?</h3>
                <p>En tu turno, toca el dado para probar tu suerte. Tu ficha se moverá automáticamente el número de casillas indicado. La casilla donde aterrices determinará tu siguiente acción.</p>
                <h3>🗺️ El Tablero: Un Recorrido por Arica</h3>
                <p>Cada casilla representa un lugar icónico de Arica. ¡Descubre la ciudad mientras juegas!</p>
                <h4>Propiedades (Sectores y Empresas)</h4>
                <p>Si caes en una propiedad sin dueño, puedes comprarla al precio indicado en la ventana emergente. Si ya tiene dueño, ¡debes pagarle la renta! Si la propiedad es tuya durante tu turno puedes venderla por si necesitas capital, aunque lo harás por un 80% de su valor original.</p>
                <h3>🗺️ Casillas Especiales de las Esquinas</h3>
                <ul>
                    <li><strong>🏢 Edificio Empresarial (Partida):</strong> ¡Día de pago! Recibes $3.000 cada vez que pases por esta casilla y un bono especial de $2.000 extras ($5.000 en total) si caes exactamente en ella.</li>
                    <li><strong>🏥 Hospital Regional:</strong> Una visita inesperada. Pierdes un turno y pagas $1.000 por gastos médicos. La salud es lo primero.</li>
                    <li><strong>🎰 Casino:</strong> ¿Te sientes con suerte? Arriésgate a ganar o perder hasta $1.000. ¡La fortuna favorece a los audaces!</li>
                    <li><strong>🚨 Cárcel de Acha:</strong> Si caes aquí, o si te quedas con capital negativo y sin propiedades para vender, serás encarcelado por 3 turnos. ¡Gestiona bien tus finanzas!</li>
                </ul>
                <h3>✨ Ventajas de la Versión Digital</h3>
                <ul>
                    <li><strong>Juego Ágil:</strong> Olvídate de los cálculos. El juego se encarga de todo: rentas, sueldos y saldos.</li>
                    <li><strong>Educativo e Interactivo:</strong> Conoce datos curiosos y descripciones de lugares emblemáticos de Arica con cada jugada.</li>
                    <li><strong>Conexión Social:</strong> Una oportunidad perfecta para compartir, reír y disfrutar sanamente con tus seres queridos.</li>
                </ul>
                <h3>👍🏻 Un proyecto más de:</h3>
                <h3>"Arica es Bacán"</h3>
            </div>
        </>
    );
};
const App = () => {
    const [user, setUser] = React.useState(null);
    const [activeScreen, setActiveScreen] = React.useState('inicio');
    const [centralImages, setCentralImages] = React.useState([]);
    const [currentSponsorIndex, setCurrentSponsorIndex] = React.useState(0);
    const [oauthProcessing, setOauthProcessing] = React.useState(false);

    // Manejar callback de OAuth (token en URL hash)
    React.useEffect(() => {
        const handleOAuthCallback = async () => {
            // Verificar si hay hash con access_token en la URL
            const hash = window.location.hash;
            if (hash && hash.includes('access_token=')) {
                setOauthProcessing(true);
                console.log('OAuth callback detectado, procesando token...');

                // Supabase procesará automáticamente el hash al llamar getSession
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Error al procesar OAuth:', error);
                } else if (session?.user) {
                    console.log('Sesión establecida:', session.user.email);
                    setUser(session.user);
                    // Limpiar URL
                    window.history.replaceState(null, null, window.location.pathname);
                    // Redirigir al lobby
                    setActiveScreen('lobbyOnline');
                }

                setOauthProcessing(false);
            }
        };

        handleOAuthCallback();
    }, []);

    // Escuchar cambios en la sesión de Supabase
    React.useEffect(() => {
        // Verificar sesión actual al cargar
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Escuchar cambios (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            // Redirigir al lobby cuando el usuario se loguea
            if (event === 'SIGNED_IN' && currentUser) {
                setActiveScreen('lobbyOnline');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        alert("Sesión cerrada correctamente.");
    };
    React.useEffect(() => {
        const { ASSETS, BOARD } = GAME_DATA;
        const { CENTRAL_IMAGES } = ASSETS;
        const initialSponsors = CENTRAL_IMAGES.map(src => ({ src }));
        setCentralImages(initialSponsors);
        const preloadQueue = [];
        preloadQueue.push(CENTRAL_IMAGES[0]);
        const sortedBoard = [...BOARD].sort((a, b) => a.id - b.id);
        const remainingSponsors = CENTRAL_IMAGES.slice(1);
        let sponsorIdx = 0;
        sortedBoard.forEach((cell, i) => {
            if (cell.image01) preloadQueue.push(cell.image01);
            if (cell.image02) preloadQueue.push(cell.image02);
            if ((i + 1) % 3 === 0 && sponsorIdx < remainingSponsors.length) {
                preloadQueue.push(remainingSponsors[sponsorIdx]);
                sponsorIdx++;
            }
        });
        while (sponsorIdx < remainingSponsors.length) {
            preloadQueue.push(remainingSponsors[sponsorIdx]);
            sponsorIdx++;
        }
        setTimeout(() => {
            console.log(`Sistema: Iniciando pre-carga optimizada de ${preloadQueue.length} recursos.`);
            preloadQueue.forEach(src => {
                const img = new Image();
                img.src = src;
                img.decoding = 'async';
            });
        }, 1500);
    }, []);
    React.useEffect(() => {
        document.body.classList.remove('light-theme'); 
    }, []);
    const [players, setPlayers] = React.useState([]);
    const [properties, setProperties] = React.useState({});
    const [currentPlayerIndex, setCurrentPlayerIndex] = React.useState(0);
    const [dice, setDice] = React.useState([1, 1]);
    const [gameState, setGameState] = React.useState('AWAITING_ROLL'); 
    const [gameMessage, setGameMessage] = React.useState('¡Bienvenido a La Gran Arica! Configura tu partida.');
    const [gameConfig, setGameConfig] = React.useState(null); 
    const [clientServerOffset, setClientServerOffset] = React.useState(0); 
    const [displayTime, setDisplayTime] = React.useState('00:00'); 
    const [gameStartTime, setGameStartTime] = React.useState(null);
    const playersRef = React.useRef(players);
    const currentPlayerIndexRef = React.useRef(currentPlayerIndex);
    React.useEffect(() => {
        playersRef.current = players;
    }, [players]);
    React.useEffect(() => {
        currentPlayerIndexRef.current = currentPlayerIndex;
    }, [currentPlayerIndex]);
    const [turnStartPos, setTurnStartPos] = React.useState(null);
    React.useEffect(() => {
        if (players.length > 0 && players[currentPlayerIndex]) {
            setTurnStartPos(players[currentPlayerIndex].position);
        }
    }, [currentPlayerIndex, players.length]);
    
    const [isTurnAI, setIsTurnAI] = React.useState(false);
    React.useEffect(() => {
        setIsTurnAI(players.length > 0 && players[currentPlayerIndex]?.isAI);
    }, [currentPlayerIndex, players]);

    const [isSoundEnabled, setIsSoundEnabled] = React.useState(true);

    // Estado para juego online
    const [onlineGameState, setOnlineGameState] = React.useState({
        isOnline: false,
        roomId: null,
        userId: null,
        playerMapping: {} // Mapeo de índice local a user_id
    });
    const gameActionsSubscriptionRef = React.useRef(null);
    const processedActionsRef = React.useRef(new Set()); // Para evitar procesar acciones duplicadas

    /* --- CEREBRO DE LA IA --- */
    React.useEffect(() => {
        if (gameState === 'GAME_OVER' || activeScreen !== 'juego') return;
        
        const currentPlayer = players[currentPlayerIndex];
        if (!currentPlayer || !currentPlayer.isAI || !currentPlayer.aiProfile) return;

        const { aiProfile } = currentPlayer;

        if (gameState === 'AWAITING_ROLL') {
            const reactionTime = Math.random() * (aiProfile.reactionMax - aiProfile.reactionMin) + aiProfile.reactionMin;
            const timer = setTimeout(() => {
                handleDiceRoll();
            }, reactionTime);
            return () => clearTimeout(timer);
        }

        if (gameState === 'AWAITING_ACTION' && showPopup) {
            const readingTime = Math.random() * (aiProfile.reactionMax - aiProfile.reactionMin) + aiProfile.reactionMin;
            const decisionTime = Math.random() * (aiProfile.reactionMax - aiProfile.reactionMin) + aiProfile.reactionMin;
            const totalDelay = readingTime + decisionTime;

            const decisionTimer = setTimeout(() => {
                const buyAction = popupInfo.actions.find(a => a.text.includes('Comprar'));
                const sellAction = popupInfo.actions.find(a => a.className === 'button--sell');
                const jailAction = popupInfo.actions.find(a => a.text === 'Ir a la Cárcel');
                const passAction = popupInfo.actions.find(a => a.text === 'Pasar' || a.text === 'Continuar' || a.text === 'Aceptar' || a.isCloseButton);

                if (buyAction && !buyAction.disabled) {
                    const price = popupInfo.property?.price || 0;
                    if (aiProfile.shouldBuy(price)) {
                        buyAction.handler();
                    } else {
                        if (passAction) passAction.handler();
                    }
                }
                else if (sellAction || jailAction) {
                    const actionToExecute = aiProfile.solveDebt(popupInfo.actions);
                    if (actionToExecute) actionToExecute.handler();
                }
                else if (passAction) {
                    passAction.handler();
                }
            }, totalDelay);
            return () => clearTimeout(decisionTimer);
        }
    }, [gameState, currentPlayerIndex, showPopup, players, activeScreen, popupInfo]);

    /* --- SISTEMA DE PERSISTENCIA AUTOMÁTICA --- */
    React.useEffect(() => {
        if (activeScreen === 'juego' && gameState !== 'GAME_OVER' && gameConfig) {
            const sessionData = {
                players,
                properties,
                currentPlayerIndex,
                gameState,
                gameMessage,
                gameConfig,
                clientServerOffset,
                turnStartPos,
                onlineGameState, // Guardar estado online para recuperación de sesión
                timestamp: Date.now()
            };
            localStorage.setItem('lga_auto_save_session', JSON.stringify(sessionData));
        }
    }, [players, properties, currentPlayerIndex, gameState, gameMessage, gameConfig, clientServerOffset, activeScreen, turnStartPos]);
    React.useEffect(() => {
        const saved = localStorage.getItem('lga_auto_save_session');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                const now = Date.now();
                const endTime = data.gameConfig.gameStartTime + data.gameConfig.gameDurationMs;
                if (now < endTime) {
                    setPlayers(data.players);
                    setProperties(data.properties);
                    setCurrentPlayerIndex(data.currentPlayerIndex);
                    setGameConfig(data.gameConfig);
                    setClientServerOffset(data.clientServerOffset);
                    setTurnStartPos(data.turnStartPos);

                    // Restaurar estado online si existe
                    if (data.onlineGameState) {
                        setOnlineGameState(data.onlineGameState);
                        console.log("[DEBUG] Estado online restaurado:", data.onlineGameState);
                    }

                    if (data.gameState === 'PLAYER_MOVING' || data.gameState === 'AWAITING_ACTION') {
                        const currentPlayer = data.players[data.currentPlayerIndex];
                        const startPos = data.turnStartPos || currentPlayer.position;
                        if (currentPlayer.position !== startPos) {
                            const nextIndex = (data.currentPlayerIndex + 1) % data.players.length;
                            const nextPlayer = data.players[nextIndex];
                            setCurrentPlayerIndex(nextIndex);
                            setGameState('AWAITING_ROLL');
                            setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[nextPlayer.color]} Es el turno de ${nextPlayer.name}.`);
                        } else {
                            setGameState('AWAITING_ROLL');
                            setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[currentPlayer.color]} Es el turno de ${currentPlayer.name}.`);
                        }
                    } else {
                        setGameState(data.gameState);
                        setGameMessage(data.gameMessage);
                    }
                    setActiveScreen('juego');
                    console.log("Sistema: Sesión restaurada.");
                } else {
                    localStorage.removeItem('lga_auto_save_session');
                }
            } catch (e) {
                console.error("Sistema: Error al restaurar sesión:", e);
                localStorage.removeItem('lga_auto_save_session');
            }
        }
    }, []);

    // Guardar sesión antes de cerrar la página o cambiar de pestaña
    React.useEffect(() => {
        const saveBeforeUnload = () => {
            if (activeScreen === 'juego' && gameState !== 'GAME_OVER' && gameConfig) {
                const sessionData = {
                    players,
                    properties,
                    currentPlayerIndex,
                    gameState,
                    gameMessage,
                    gameConfig,
                    clientServerOffset,
                    turnStartPos,
                    onlineGameState,
                    timestamp: Date.now()
                };
                localStorage.setItem('lga_auto_save_session', JSON.stringify(sessionData));
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                saveBeforeUnload();
            }
        };

        window.addEventListener('beforeunload', saveBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('beforeunload', saveBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [activeScreen, gameState, gameConfig, players, properties, currentPlayerIndex, gameMessage, clientServerOffset, turnStartPos, onlineGameState]);

    const [winner, setWinner] = React.useState(null);
    const [showWinnerModal, setShowWinnerModal] = React.useState(false);
    const [showPopup, setShowPopup] = React.useState(false);
    const [popupInfo, setPopupInfo] = React.useState({ title: '', message: '', actions: [] });
    const toggleSound = () => {
        const newState = !isSoundEnabled;
        setIsSoundEnabled(newState);
        document.querySelectorAll('audio').forEach(audio => {
            audio.muted = !newState;
        });
        const bgAudio = document.getElementById('background-audio');
        if (bgAudio) {
            if (newState && activeScreen === 'juego' && gameState !== 'GAME_OVER') {
                bgAudio.play().catch(() => {});
            }
        }
    };
    /* --- SISTEMA AFK --- */
    const [afkActive, setAfkActive] = React.useState(false);
    const afkTimerRef = React.useRef(null);
    React.useEffect(() => {
        if (afkTimerRef.current) clearTimeout(afkTimerRef.current);
        setAfkActive(false);
        if (activeScreen !== 'juego' || gameState === 'GAME_OVER' || gameState === 'PLAYER_MOVING') return;

        // En modo online, solo activar AFK si es el turno del jugador local
        if (onlineGameState.isOnline) {
            const isLocalPlayerTurn = players[currentPlayerIndex]?.userId === onlineGameState.userId ||
                (!players[currentPlayerIndex]?.userId && currentPlayerIndex === players.findIndex(p => p.userId === onlineGameState.userId));
            if (!isLocalPlayerTurn) return; // No activar AFK si no es mi turno
        }

        let timeoutAction = null;
        if (gameState === 'AWAITING_ROLL') {
            timeoutAction = () => handleDiceRoll();
        }
        else if (showPopup) {
            const passAction = popupInfo.actions.find(a => a.text === 'Pasar' || a.text === 'Continuar' || a.text === 'Aceptar' || a.isCloseButton);
            const jailAction = popupInfo.actions.find(a => a.text === 'Ir a la Cárcel');

            if (passAction) timeoutAction = passAction.handler;
            else if (jailAction) timeoutAction = jailAction.handler;
            else if (popupInfo.actions.length > 0) timeoutAction = popupInfo.actions[0].handler;
        }
        else if (showWinnerModal) {
            timeoutAction = () => handleRestartGame();
        }
        if (timeoutAction) {
            setAfkActive(true);
            afkTimerRef.current = setTimeout(() => {
                timeoutAction();
                setAfkActive(false);
            }, GAME_DATA.DELAYS.AFK_WAIT);
        }
        return () => {
            if (afkTimerRef.current) clearTimeout(afkTimerRef.current);
        };
    }, [gameState, showPopup, showWinnerModal, activeScreen, currentPlayerIndex, popupInfo, onlineGameState, players]);

    /* --- SUSCRIPCIÓN REALTIME A GAME_ACTIONS (MODO ONLINE) --- */
    React.useEffect(() => {
        // Solo suscribirse si es juego online y tenemos roomId
        if (!onlineGameState.isOnline || !onlineGameState.roomId || activeScreen !== 'juego') {
            // Limpiar suscripción si existe
            if (gameActionsSubscriptionRef.current) {
                gameActionsSubscriptionRef.current.unsubscribe();
                gameActionsSubscriptionRef.current = null;
            }
            return;
        }

        console.log('[DEBUG] Suscribiéndose a game_actions para room:', onlineGameState.roomId);

        const subscription = supabase
            .channel(`game-actions-${onlineGameState.roomId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'game_actions',
                filter: `room_id=eq.${onlineGameState.roomId}`
            }, (payload) => {
                const action = payload.new;
                console.log('[DEBUG] Nueva acción recibida:', action);

                // Evitar procesar acciones duplicadas
                if (processedActionsRef.current.has(action.id)) {
                    console.log('[DEBUG] Acción ya procesada, ignorando:', action.id);
                    return;
                }
                processedActionsRef.current.add(action.id);

                // Limpiar el set periódicamente para evitar crecimiento infinito
                if (processedActionsRef.current.size > 1000) {
                    processedActionsRef.current.clear();
                }

                // No procesar nuestras propias acciones (ya aplicadas localmente)
                if (action.player_id === onlineGameState.userId) {
                    console.log('[DEBUG] Acción propia, ignorando');
                    return;
                }

                // Procesar la acción según su tipo
                handleIncomingGameAction(action);
            })
            .subscribe();

        gameActionsSubscriptionRef.current = subscription;

        return () => {
            console.log('[DEBUG] Desuscribiendo de game_actions');
            subscription.unsubscribe();
            gameActionsSubscriptionRef.current = null;
        };
    }, [onlineGameState.isOnline, onlineGameState.roomId, activeScreen]);

    /* --- MANEJADOR DE ACCIONES ENTRANTES --- */
    const handleIncomingGameAction = async (action) => {
        console.log('[DEBUG] Procesando acción entrante:', action);

        try {
            switch (action.action_type) {
                case 'dice_roll':
                    await applyOpponentDiceRoll(action.action_data);
                    break;
                case 'buy_property':
                    await applyOpponentBuyProperty(action.action_data);
                    break;
                case 'sell_property':
                    await applyOpponentSellProperty(action.action_data);
                    break;
                case 'pass_turn':
                    await applyOpponentPassTurn(action.action_data);
                    break;
                case 'jail':
                    await applyOpponentJail(action.action_data);
                    break;
                case 'pay_rent':
                    await applyOpponentPayRent(action.action_data);
                    break;
                default:
                    console.warn('[DEBUG] Tipo de acción desconocido:', action.action_type);
            }
        } catch (error) {
            console.error('[DEBUG] Error procesando acción entrante:', error);
        }
    };

    /* --- APLICADORES DE ACCIONES DE OPONENTES --- */
    const applyOpponentDiceRoll = async (data) => {
        const { playerIndex, diceValue, newPosition, passedStart } = data;
        console.log('[DEBUG] Aplicando dados de oponente:', { playerIndex, diceValue, newPosition });

        // Verificar que es un índice válido
        if (playerIndex >= players.length) {
            console.error('[DEBUG] Índice de jugador inválido:', playerIndex);
            return;
        }

        // Animar los dados
        setDice([diceValue, 0]);
        setGameState('PLAYER_MOVING');

        // Animar el movimiento de la ficha
        const player = players[playerIndex];
        const startPos = player.position;

        for (let i = startPos; i < newPosition; i++) {
            await delay(GAME_DATA.DELAYS.PAWN_STEP);
            setPlayers(prev => prev.map((p, idx) => {
                if (idx === playerIndex) {
                    const nextPos = (p.position % 32) + 1;
                    return { ...p, position: nextPos };
                }
                return p;
            }));
        }

        // Si pasó por la partida, darle el dinero
        if (passedStart) {
            setPlayers(prev => prev.map((p, idx) => {
                if (idx === playerIndex) {
                    return { ...p, money: p.money + 3000 };
                }
                return p;
            }));
        }

        // Aplicar el efecto de la casilla de aterrizaje
        await handleLandingForPlayer(playerIndex, newPosition);
    };

    const handleLandingForPlayer = async (playerIndex, position) => {
        const player = players[playerIndex];
        const square = GAME_DATA.BOARD.find(s => s.id === position);

        if (!square) return;

        setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name} llegó a ${square.name}.`);

        // Para propiedades, el dueño debe decidir
        if (square.type === 'property') {
            const property = properties[square.id];
            if (property.owner === null) {
                // Propiedad sin dueño - esperar a que el jugador decida
                // (Esto se maneja mediante la acción 'buy_property' o 'pass_turn')
                setGameState('AWAITING_ACTION');
            } else if (property.owner !== player.id) {
                // Pagar renta
                const owner = players.find(p => p.id === property.owner);
                if (owner) {
                    const rentAmount = property.rent;
                    setPlayers(prev => prev.map(p => {
                        if (p.id === player.id) return { ...p, money: p.money - rentAmount };
                        if (p.id === owner.id) return { ...p, money: p.money + rentAmount };
                        return p;
                    }));
                    setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name} pagó $${rentAmount.toLocaleString('es-CL')} de arriendo a ${owner.name}.`);
                }
                setTimeout(nextTurn, GAME_DATA.DELAYS.ACTION_TO_NEXT_TURN);
            } else {
                // Propiedad propia - puede vender
                setGameState('AWAITING_ACTION');
            }
        } else {
            // Casillas especiales
            handleSpecialSquareForPlayer(playerIndex, square);
        }
    };

    const handleSpecialSquareForPlayer = async (playerIndex, square) => {
        const player = players[playerIndex];
        let message = '';
        let moneyChange = 0;
        let skipChange = 0;

        switch (square.type) {
            case 'start':
                moneyChange = 2000;
                message = `${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name}: Recibe $2.000 extras.`;
                break;
            case 'jail':
                skipChange = 3;
                message = `${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ¡Consternación! ${player.name} ha caído en la cárcel.`;
                break;
            case 'hospital':
                moneyChange = -1000;
                skipChange = 1;
                message = `${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name}: Pierde 1 turno y paga $1.000 por gastos médicos.`;
                break;
            case 'casino':
                // El casino ya se resolvó en el lado del emisor
                // Solo pasamos al siguiente turno
                setTimeout(nextTurn, GAME_DATA.DELAYS.ACTION_TO_NEXT_TURN);
                return;
            case 'luck':
            case 'destiny':
                // Las cartas ya se resolvón en el lado del emisor
                // Solo aplicamos el resultado
                if (square.type === 'luck') {
                    message = `${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} 🍀 ${player.name} sacó una carta de Suerte.`;
                } else {
                    message = `${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ⚓ ${player.name} sacó una carta de Destino.`;
                }
                break;
            default:
                message = `${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name} está en ${square.name}.`;
        }

        if (moneyChange !== 0 || skipChange !== 0) {
            setPlayers(prev => prev.map((p, idx) => {
                if (idx === playerIndex) {
                    return { ...p, money: p.money + moneyChange, skipTurns: p.skipTurns + skipChange };
                }
                return p;
            }));
        }

        setGameMessage(message);
        setTimeout(nextTurn, GAME_DATA.DELAYS.ACTION_TO_NEXT_TURN);
    };

    const applyOpponentBuyProperty = async (data) => {
        const { playerIndex, propertyId, price } = data;
        console.log('[DEBUG] Aplicando compra de propiedad:', { playerIndex, propertyId, price });

        setProperties(prev => ({
            ...prev,
            [propertyId]: { ...prev[propertyId], owner: playerIndex, visitCount: 1 }
        }));

        setPlayers(prev => prev.map((p, idx) => {
            if (idx === playerIndex) {
                return { ...p, money: p.money - price, properties: [...p.properties, propertyId] };
            }
            return p;
        }));

        const property = properties[propertyId];
        setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[players[playerIndex].color]} ${players[playerIndex].name} compró ${property.name}.`);

        setTimeout(nextTurn, GAME_DATA.DELAYS.ACTION_TO_NEXT_TURN);
    };

    const applyOpponentSellProperty = async (data) => {
        const { playerIndex, propertyId, price } = data;
        console.log('[DEBUG] Aplicando venta de propiedad:', { playerIndex, propertyId, price });

        setProperties(prev => ({
            ...prev,
            [propertyId]: { ...prev[propertyId], owner: null, visitCount: 0 }
        }));

        setPlayers(prev => prev.map((p, idx) => {
            if (idx === playerIndex) {
                return { ...p, money: p.money + price, properties: p.properties.filter(id => id !== propertyId) };
            }
            return p;
        }));
    };

    const applyOpponentPassTurn = async (data) => {
        const { playerIndex } = data;
        console.log('[DEBUG] Aplicando paso de turno:', { playerIndex });

        setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[players[playerIndex].color]} ${players[playerIndex].name} ha pasado el turno.`);
        await nextTurn();
    };

    const applyOpponentJail = async (data) => {
        const { playerIndex } = data;
        console.log('[DEBUG] Aplicando envío a cárcel:', { playerIndex });

        setPlayers(prev => prev.map((p, idx) => {
            if (idx === playerIndex) {
                return { ...p, position: 25, skipTurns: 3 }; // 25 es la cárcel
            }
            return p;
        }));

        setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[players[playerIndex].color]} ¡Consternación! ${players[playerIndex].name} va a la cárcel.`);
        setTimeout(nextTurn, GAME_DATA.DELAYS.ACTION_TO_NEXT_TURN);
    };

    const applyOpponentPayRent = async (data) => {
        const { fromPlayerIndex, toPlayerIndex, amount } = data;
        console.log('[DEBUG] Aplicando pago de renta:', { fromPlayerIndex, toPlayerIndex, amount });

        setPlayers(prev => prev.map((p, idx) => {
            if (idx === fromPlayerIndex) return { ...p, money: p.money - amount };
            if (idx === toPlayerIndex) return { ...p, money: p.money + amount };
            return p;
        }));

        setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[players[fromPlayerIndex].color]} ${players[fromPlayerIndex].name} pagó $${amount.toLocaleString('es-CL')} de arriendo a ${players[toPlayerIndex].name}.`);
    };

    const viewImageToggleRef = React.useRef(false);
    const handleViewProperty = (cellId) => {
        playAudio('property-popup-audio');
        const property = GAME_DATA.BOARD.find(p => p.id === cellId);
        if (!property) return;
        viewImageToggleRef.current = !viewImageToggleRef.current;
        const imageUrl = viewImageToggleRef.current ? property.image02 : property.image01;
        const description = viewImageToggleRef.current ? (property.description02 || property.description01) : property.description01;
        let messageContent = null;
        if (property.type === 'property') {
            const sellPrice = Math.floor(property.price * 0.8);
            messageContent = (
                <>
                    <div style={{ marginBottom: '0.5rem' }}>{description}</div>
                    <div className="price-list">
                        <span><strong>Compra:</strong> ${property.price.toLocaleString('es-CL')}</span>
                        <span><strong>Renta:</strong> ${property.rent.toLocaleString('es-CL')}</span>
                        <span><strong>Venta:</strong> ${sellPrice.toLocaleString('es-CL')}</span>
                    </div>
                </>
            );
        } else {
            messageContent = <div style={{ marginBottom: '0.5rem' }}>{description}</div>;
        }
        setPopupInfo({
            title: property.name.replace(/\n/, ' ' ),
            message: messageContent,
            actions: [{ text: 'Cerrar', handler: () => setShowPopup(false), isCloseButton: true }],
            property: { ...property, image01: imageUrl }
        });
        setShowPopup(true);
    };
    const formatTime = (totalSeconds) => {
        if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    React.useEffect(() => {
        const bgAudio = document.getElementById('background-audio');
        if (bgAudio) {
            if (activeScreen === 'juego' && gameState !== 'GAME_OVER') {
                bgAudio.muted = !isSoundEnabled;
                bgAudio.play().catch(() => {});
            } else {
                bgAudio.pause();
                bgAudio.currentTime = 0;
            }
        }
        if (!gameConfig || activeScreen !== 'juego' || gameState === 'GAME_OVER') return;
        let animationFrameId;
        const unifiedTimerLoop = () => {
            const authoritativeNow = Date.now() + clientServerOffset;
            const elapsedTimeMs = authoritativeNow - gameConfig.gameStartTime;
            const remainingGameTimeMs = Math.max(0, gameConfig.gameDurationMs - elapsedTimeMs);
            const remainingSeconds = Math.floor(remainingGameTimeMs / 1000);
            setDisplayTime(formatTime(remainingSeconds));
            if (centralImages.length > 0) {
                const imageCyclesElapsed = Math.floor(elapsedTimeMs / gameConfig.imageCycleDurationMs);
                const newSponsorIndex = imageCyclesElapsed % centralImages.length;
                setCurrentSponsorIndex(newSponsorIndex);
            }
            if (remainingGameTimeMs > 0) {
                animationFrameId = requestAnimationFrame(unifiedTimerLoop);
            } else {
                if (gameState !== 'GAME_OVER') {
                    setGameMessage('¡Se acabó el tiempo!');
                    setGameState('GAME_OVER');
                }
            }
        };
        animationFrameId = requestAnimationFrame(unifiedTimerLoop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [gameConfig, clientServerOffset, activeScreen, gameState, centralImages.length, isSoundEnabled]);
    React.useEffect(() => {
        if (gameState === 'GAME_OVER' && !winner) {
            let maxPatrimony = -Infinity;
            let currentWinner = null;
            players.forEach(p => {
                const propsValue = p.properties.reduce((sum, propId) => {
                    const prop = GAME_DATA.BOARD.find(b => b.id === propId);
                    return sum + (prop ? prop.price : 0);
                }, 0);
                const totalPatrimony = p.money + propsValue;
                if (totalPatrimony > maxPatrimony) {
                    maxPatrimony = totalPatrimony;
                    currentWinner = { ...p, propertiesValue: propsValue, patrimony: totalPatrimony };
                }
            });
            if (currentWinner) {
                setWinner(currentWinner);
                setShowWinnerModal(true);
                playAudio('applause-audio');
            }
        }
    }, [gameState, players, winner]);
    const startGame = (playerData) => {
        console.log('[DEBUG] startGame() iniciado con playerData:', playerData);

        try {
            // Validación de entrada
            if (!playerData || !Array.isArray(playerData) || playerData.length === 0) {
                console.error('[DEBUG] startGame: playerData inválido', playerData);
                alert('Error: Datos de jugadores inválidos');
                return;
            }

            setGameStartTime(Date.now());

            try {
                playAudio('background-audio');
            } catch (audioError) {
                console.warn('[DEBUG] Error al reproducir audio:', audioError);
            }

            const initialProperties = {};
            GAME_DATA.BOARD.forEach(square => {
                if (square.type === 'property') {
                    initialProperties[square.id] = { ...square, owner: null, visitCount: 0 };
                }
            });
            setProperties(initialProperties);

            const initialCapitals = GAME_DATA.PLAYERS.INITIAL_MONEY;
            console.log('[DEBUG] INITIAL_MONEY:', initialCapitals);

            const availableProfiles = [...GAME_DATA.AI_PROFILES];

            const gamePlayers = playerData.map((p, index) => {
                console.log(`[DEBUG] Procesando playerData[${index}]:`, p);

                if (!p) {
                    console.error(`[DEBUG] playerData[${index}] es null/undefined`);
                    return null;
                }

                let assignedProfile = null;
                let playerName = p.name || `Jugador ${index + 1}`;

                if (p.isAI) {
                    const existingProfileIndex = availableProfiles.findIndex(prof => prof.name === p.name);

                    if (existingProfileIndex !== -1) {
                        assignedProfile = availableProfiles.splice(existingProfileIndex, 1)[0];
                    } else {
                        if (availableProfiles.length > 0) {
                            const randomIndex = Math.floor(Math.random() * availableProfiles.length);
                            assignedProfile = availableProfiles.splice(randomIndex, 1)[0];
                        } else {
                            const profiles = GAME_DATA.AI_PROFILES;
                            assignedProfile = profiles[Math.floor(Math.random() * profiles.length)];
                        }
                    }
                    playerName = assignedProfile.name;
                }

                const playerColor = GAME_DATA.PLAYERS.COLORS[index];
                if (!playerColor) {
                    console.warn(`[DEBUG] No hay color definido para índice ${index}`);
                }

                const initialMoney = initialCapitals[index];
                if (initialMoney === undefined) {
                    console.warn(`[DEBUG] No hay dinero inicial definido para índice ${index}`);
                }

                return {
                    ...p,
                    id: index,
                    name: playerName,
                    position: 1,
                    money: initialMoney || 7000,
                    color: playerColor || '#FF6B6B',
                    properties: [],
                    skipTurns: 0,
                    aiProfile: assignedProfile,
                };
            }).filter(p => p !== null);

            console.log('[DEBUG] gamePlayers procesados:', gamePlayers);

            if (gamePlayers.length === 0) {
                console.error('[DEBUG] No hay jugadores válidos después del procesamiento');
                alert('Error: No se pudieron procesar los jugadores');
                return;
            }

            let duration = gamePlayers.length === 2 ? 600 : (gamePlayers.length === 3 ? 1200 : 1800);
            const now = Date.now();
            const serverMessage = {
                event: "GAME_SETUP",
                gameStartTime: now,
                gameDurationMs: duration * 1000,
                imageCycleDurationMs: 13000,
                serverTime: now + 50
            };
            console.log('[DEBUG] serverMessage:', serverMessage);

            setClientServerOffset(serverMessage.serverTime - Date.now());
            setGameConfig(serverMessage);
            setPlayers(gamePlayers);
            setCurrentPlayerIndex(0);
            setGameState('AWAITING_ROLL');
            setWinner(null);
            setShowWinnerModal(false);

            const firstPlayer = gamePlayers[0];
            console.log('[DEBUG] firstPlayer:', firstPlayer);

            if (!firstPlayer || !firstPlayer.color) {
                console.error('[DEBUG] firstPlayer o firstPlayer.color es undefined');
            }

            const emoji = firstPlayer?.color ? GAME_DATA.UI.COLOR_TO_EMOJI[firstPlayer.color] : '⚪';
            const playerName = firstPlayer?.name || 'Jugador 1';
            setGameMessage(`${emoji} Es el turno de ${playerName}.`);
            console.log('[DEBUG] Mensaje de juego establecido');

            // Guardar configuración de juego online si aplica
            if (playerData.gameConfig?.isOnline) {
                console.log('[DEBUG] Configurando juego online...');
                const playerMapping = {};
                gamePlayers.forEach((p, idx) => {
                    // En modo online, el id original es el user_id de Supabase
                    playerMapping[idx] = p.userId || idx;
                });
                setOnlineGameState({
                    isOnline: true,
                    roomId: playerData.gameConfig.roomId,
                    userId: playerData.gameConfig.userId, // Usar el userId del gameConfig
                    playerMapping: playerMapping
                });
            }

            setActiveScreen('juego');
            console.log('[DEBUG] Pantalla cambiada a juego');

        } catch (error) {
            console.error('[DEBUG] ERROR CRÍTICO en startGame:', error);
            console.error('[DEBUG] Stack trace:', error.stack);
            alert('Error al iniciar el juego: ' + error.message);
        }
    };
    const handleRestartGame = () => {
        localStorage.removeItem('lga_auto_save_session');

        // Limpiar suscripción a game_actions si existe
        if (gameActionsSubscriptionRef.current) {
            gameActionsSubscriptionRef.current.unsubscribe();
            gameActionsSubscriptionRef.current = null;
        }

        setShowWinnerModal(false);
        setWinner(null);
        setGameConfig(null);
        setPlayers([]);
        setProperties({});
        setGameState('AWAITING_ROLL');
        setGameMessage('¡Bienvenido a La Gran Arica! Configura tu partida.');
        setOnlineGameState({
            isOnline: false,
            roomId: null,
            userId: null,
            playerMapping: {}
        });
        setActiveScreen('inicio');
    };
    const handleDiceRoll = async () => {
        if (gameState !== 'AWAITING_ROLL') return;

        const currentPlayer = players[currentPlayerIndex];
        if (!currentPlayer) return;

        playAudio('dice-roll-audio');
        setGameState('PLAYER_MOVING');

        // Generar valor del dado
        const d1 = Math.floor(Math.random() * 6) + 1;

        // Calcular nueva posición antes de animar
        const startPos = currentPlayer.position;
        let newPos = startPos;
        let passedStart = false;

        for (let i = 0; i < d1; i++) {
            newPos = (newPos % 32) + 1;
            if (newPos === 1 && startPos + i + 1 > 32) {
                passedStart = true;
            }
        }

        // Si es modo online, enviar la acción a Supabase
        if (onlineGameState.isOnline && onlineGameState.roomId) {
            console.log('[DEBUG] Enviando acción dice_roll a Supabase');
            try {
                await supabase.from('game_actions').insert({
                    room_id: onlineGameState.roomId,
                    player_id: onlineGameState.userId,
                    action_type: 'dice_roll',
                    action_data: {
                        playerIndex: currentPlayerIndex,
                        diceValue: d1,
                        startPosition: startPos,
                        newPosition: newPos,
                        passedStart: passedStart
                    }
                });
                console.log('[DEBUG] Acción dice_roll enviada exitosamente');
            } catch (error) {
                console.error('[DEBUG] Error enviando acción dice_roll:', error);
            }
        }

        const animationInterval = setInterval(() => {
            setDice([Math.floor(Math.random() * 6) + 1, 0]);
        }, GAME_DATA.DELAYS.DICE_ANIMATION_INTERVAL);

        setTimeout(async () => {
            clearInterval(animationInterval);
            setDice([d1, 0]);
            await delay(GAME_DATA.DELAYS.DICE_ROLL_TO_MOVE);

            // Animar el movimiento
            for (let i = 0; i < d1; i++) {
                setCurrentPlayerIndex(currentIndex => {
                    setPlayers(currentPlayers => {
                        return currentPlayers.map((player, index) => {
                            if (index === currentIndex) {
                                const oldPosition = player.position;
                                const newPosition = (oldPosition % 32) + 1;
                                let newMoney = player.money;
                                if (oldPosition === 32 && newPosition === 1) {
                                    newMoney += 3000;
                                    setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name} pasó por la Partida y recibió $3.000.`);
                                }
                                return { ...player, position: newPosition, money: newMoney };
                            }
                            return player;
                        });
                    });
                    return currentIndex;
                });
                await delay(GAME_DATA.DELAYS.PAWN_STEP);
            }
            await handleLanding();
        }, GAME_DATA.DELAYS.DICE_ANIMATION);
    };
    const handleLanding = async () => {
        setCurrentPlayerIndex(currentIndex => {
            setPlayers(currentPlayers => {
                setProperties(currentProperties => {
                    const player = currentPlayers[currentIndex];
                    const square = GAME_DATA.BOARD.find(s => s.id === player.position);
                    setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name} llegó a ${square.name}.`);
                    setTimeout(async () => {
                        if (square.type === 'property') {
                            const property = currentProperties[square.id];
                            if (property.owner === null) {
                                playAudio('property-popup-audio');
                                const newVisitCount = (property.visitCount || 0) + 1;
                                const updatedProperty = { ...property, visitCount: newVisitCount };
                                setProperties(prev => ({ ...prev, [square.id]: updatedProperty }));
                                const canAfford = player.money >= property.price;
                                setPopupInfo({
                                    title: property.name.replace(/\n/, ' ' ),
                                    message: '', 
                                    actions: [
                                        { text: `Comprar x $${property.price.toLocaleString('es-CL')}`, handler: () => handleBuyProperty(square.id), disabled: !canAfford },
                                        { text: 'Pasar', handler: () => handlePassTurn(), isCloseButton: true }
                                    ],
                                    property: updatedProperty
                                });
                                setShowPopup(true);
                                setGameState('AWAITING_ACTION');
                            } else if (property.owner !== player.id) {
                                const owner = currentPlayers.find(p => p.id === property.owner);
                                const rentAmount = property.rent;
                                playAudio('cash-register-audio');
                                const newMoney = player.money - rentAmount;
                                setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name} pagó $${rentAmount.toLocaleString('es-CL')} de arriendo a ${owner.name}.`);
                                setPlayers(prev => prev.map(p => {
                                    if (p.id === player.id) return { ...p, money: newMoney };
                                    if (p.id === owner.id) return { ...p, money: p.money + rentAmount };
                                    return p;
                                }));
                                if (newMoney < 0) {
                                    const playerProps = player.properties.map(id => currentProperties[id]);
                                    const savior = playerProps.filter(p => (Math.floor(p.price * 0.8) + newMoney) >= 0).sort((a, b) => a.price - b.price)[0];
                                    if (savior) {
                                        setPopupInfo({
                                            title: '¡Multa por Deuda!',
                                            message: `Saldo: $${newMoney.toLocaleString('es-CL')}. Vende "${savior.name}" por $${Math.floor(savior.price*0.8).toLocaleString('es-CL')} para evitar la cárcel`,
                                            actions: [
                                                { text: `Vender ${savior.name}`, handler: () => handleForcedSale(savior.id, player.id), className: 'button--sell' },
                                                { text: 'Ir a la Cárcel', handler: () => sendToJail(player.id) }
                                            ],
                                            property: savior
                                        });
                                        setShowPopup(true);
                                        setGameState('AWAITING_ACTION');
                                    } else {
                                        setPopupInfo({
                                            title: '¡Bancarrota!',
                                            message: `${player.name}, no tienes capital ni propiedades suficientes. Vas a la Cárcel`,
                                            actions: [{ text: 'Aceptar', handler: () => sendToJail(player.id) }]
                                        });
                                        setShowPopup(true);
                                        setGameState('AWAITING_ACTION');
                                    }
                                } else {
                                    setTimeout(nextTurn, GAME_DATA.DELAYS.ACTION_TO_NEXT_TURN);
                                }
                            } else {
                                playAudio('property-popup-audio');
                                const sellPrice = Math.floor(property.price * 0.8);
                                const updatedProperty = { ...property, visitCount: (property.visitCount || 0) + 1 };
                                setProperties(prev => ({ ...prev, [square.id]: updatedProperty }));
                                setPopupInfo({
                                    title: `¿Vender ${property.name}?`,
                                    message: ``,
                                    actions: [
                                        { text: `Vender x $${sellPrice.toLocaleString('es-CL')}`, handler: () => handleSellProperty(square.id), className: 'button--sell' },
                                        { text: 'Pasar', handler: () => handlePassTurn(), isCloseButton: true }
                                    ],
                                    property: updatedProperty
                                });
                                setShowPopup(true);
                                setGameState('AWAITING_ACTION');
                            }
                        } else {
                            playAudio('property-popup-audio');
                            let message = ''; let moneyChange = 0; let skipChange = 0;
                            let popupMessageContent = null;
                            let moveAction = null;
                            
                            let popupTitle = square.name.replace(/\n/, ' ');
                            let customPropertyData = { ...square, image01: square.image01 || GAME_DATA.ASSETS.FALLBACK_PROPERTY_IMAGE };

                            if (square.type === 'luck' || square.type === 'destiny') {
                                const card = GAME_DATA.CARDS[Math.floor(Math.random() * GAME_DATA.CARDS.length)];
                                moneyChange = card.amount || 0;
                                skipChange = card.skipTurns || 0;
                                popupTitle = card.text;
                                customPropertyData.promo01 = ''; 
                                customPropertyData.promo02 = '';
                                const typeEmoji = square.type === 'luck' ? '🍀' : '⚓';
                                message = `${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${typeEmoji} ${card.text}`;
                                if (card.action === 'move' && card.targetId) {
                                    moveAction = card.targetId;
                                }
                                popupMessageContent = (
                                    <div style={{ textAlign: 'center' }}>
                                        {card.subtext && <p style={{ fontStyle: 'italic', marginBottom: '1.2rem', fontSize: '1.05em' }}>{card.subtext}</p>}
                                        <p style={{ 
                                            fontWeight: 'bold', 
                                            fontSize: '1.2em',
                                            color: moneyChange > 0 ? '#198754' : (moneyChange < 0 ? '#DC3545' : 'var(--title-color)')
                                        }}>
                                            {moneyChange > 0 && `¡Cobras $${moneyChange.toLocaleString('es-CL')}!`}
                                            {moneyChange < 0 && `Pagas $${Math.abs(moneyChange).toLocaleString('es-CL')}`}
                                            {skipChange > 0 && ` (Pierdes ${skipChange} turno${skipChange > 1 ? 's' : ''})`}
                                            {moneyChange === 0 && skipChange === 0 && "¡Sigue adelante!"}
                                        </p>
                                    </div>
                                );
                            } else {
                                switch (square.type) {
                                    case 'start': 
                                        moneyChange = 2000; 
                                        message = `${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name}: Recibes $3.000 + $2.000 extras por entrar directamente al Edificio Empresarial.`; 
                                        break;
                                    case 'jail': skipChange = 3; message = `${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ¡Consternación! ${player.name} ha caído en la cárcel.`; break;
                                    case 'hospital': moneyChange = -1000; skipChange = 1; message = `${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name}: Para una pronta recuperación, pierdes 1 turno y abonas $1.000 por gastos médicos.`; break;
                                    case 'casino':
                                        const amount = (Math.floor(Math.random() * 21) - 10) * 100; moneyChange = amount;
                                        message = amount >= 0 
                                            ? `${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ¡Buena Suerte! ${player.name} ganó $${amount.toLocaleString('es-CL')} en el Casino.` 
                                            : `${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ¡Mala Racha! ${player.name} perdió $${Math.abs(amount).toLocaleString('es-CL')} en el Casino.`;
                                        break;
                                    default: message = `${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name} está en ${square.name}.`; break;
                                }
                                popupMessageContent = <div>{message}</div>;
                            }
                            setGameMessage(message);
                            setPlayers(prev => prev.map(p => {
                                if (p.id === player.id) {
                                    const newPos = moveAction ? moveAction : p.position;
                                    return { 
                                        ...p, 
                                        money: p.money + moneyChange, 
                                        skipTurns: p.skipTurns + skipChange,
                                        position: newPos
                                    };
                                }
                                return p;
                            }));
                            const continueHandler = async () => { setShowPopup(false); await delay(GAME_DATA.DELAYS.ACTION_TO_NEXT_TURN); nextTurn(); };
                            
                            setPopupInfo({
                                title: popupTitle,
                                message: popupMessageContent,
                                actions: [
                                    { text: 'Continuar', handler: continueHandler },
                                    { text: 'X', handler: continueHandler, isCloseButton: true }
                                ],
                                property: customPropertyData
                            });
                            setShowPopup(true);
                            setGameState('AWAITING_ACTION');
                        }
                    }, GAME_DATA.DELAYS.LAND_TO_ACTION);
                    return currentProperties;
                });
                return currentPlayers;
            });
            return currentIndex;
        });
    };
    const handleForcedSale = async (squareId, playerId) => {
        setShowPopup(false); playAudio('cash-register-audio');
        const player = players.find(p => p.id === playerId);
        const propName = GAME_DATA.BOARD.find(b => b.id === squareId).name.replace(/\n/, ' ');
        setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name} vendió ${propName} por deuda.`);
        setCurrentPlayerIndex(currentIndex => {
            const sellPrice = Math.floor(properties[squareId].price * 0.8);
            setPlayers(curr => curr.map(p => p.id === playerId ? { ...p, money: p.money + sellPrice, properties: p.properties.filter(id => id !== squareId) } : p));
            setProperties(curr => ({ ...curr, [squareId]: { ...curr[squareId], owner: null } }));
            return currentIndex;
        });
        await delay(GAME_DATA.DELAYS.ACTION_TO_NEXT_TURN); nextTurn();
    };
    const sendToJail = async (playerId) => {
        setShowPopup(false);
        const player = players.find(p => p.id === playerId);
        const playerIndex = players.findIndex(p => p.id === playerId);

        // Enviar acción en modo online
        if (onlineGameState.isOnline && onlineGameState.roomId && playerIndex !== -1) {
            await supabase.from('game_actions').insert({
                room_id: onlineGameState.roomId,
                player_id: onlineGameState.userId,
                action_type: 'jail',
                action_data: {
                    playerIndex: playerIndex
                }
            });
        }

        setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, position: 25, skipTurns: 3 } : p));
        setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name} fue enviado a la Cárcel.`);
        await delay(GAME_DATA.DELAYS.ACTION_TO_NEXT_TURN); nextTurn();
    };
    const handleBuyProperty = async (squareId) => {
        setShowPopup(false); playAudio('cash-register-audio');
        const player = players[currentPlayerIndex];
        const propName = GAME_DATA.BOARD.find(b => b.id === squareId).name.replace(/\n/, ' ');
        setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name} compró ${propName}.`);

        // Enviar acción en modo online
        if (onlineGameState.isOnline && onlineGameState.roomId) {
            const prop = properties[squareId];
            await supabase.from('game_actions').insert({
                room_id: onlineGameState.roomId,
                player_id: onlineGameState.userId,
                action_type: 'buy_property',
                action_data: {
                    playerIndex: currentPlayerIndex,
                    propertyId: squareId,
                    price: prop.price
                }
            });
        }

        setCurrentPlayerIndex(currentIndex => {
            const prop = properties[squareId];
            setPlayers(curr => curr.map((p, i) => i === currentIndex ? { ...p, money: p.money - prop.price, properties: [...p.properties, squareId] } : p));
            setProperties(curr => ({ ...curr, [squareId]: { ...curr[squareId], owner: currentIndex } }));
            return currentIndex;
        });
        await delay(GAME_DATA.DELAYS.ACTION_TO_NEXT_TURN); nextTurn();
    };
    const handleSellProperty = async (squareId) => {
        setShowPopup(false); playAudio('cash-register-audio');
        const player = players[currentPlayerIndex];
        const propName = GAME_DATA.BOARD.find(b => b.id === squareId).name.replace(/\n/, ' ');
        setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name} vendió ${propName}.`);

        const sellPrice = Math.floor(properties[squareId].price * 0.8);

        // Enviar acción en modo online
        if (onlineGameState.isOnline && onlineGameState.roomId) {
            await supabase.from('game_actions').insert({
                room_id: onlineGameState.roomId,
                player_id: onlineGameState.userId,
                action_type: 'sell_property',
                action_data: {
                    playerIndex: currentPlayerIndex,
                    propertyId: squareId,
                    price: sellPrice
                }
            });
        }

        setCurrentPlayerIndex(currentIndex => {
            setPlayers(curr => curr.map(p => p.id === currentIndex ? { ...p, money: p.money + sellPrice, properties: p.properties.filter(id => id !== squareId) } : p));
            setProperties(curr => ({ ...curr, [squareId]: { ...curr[squareId], owner: null } }));
            return currentIndex;
        });
        await delay(GAME_DATA.DELAYS.ACTION_TO_NEXT_TURN); nextTurn();
    };
    const handlePassTurn = async () => {
        setShowPopup(false);
        setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[players[currentPlayerIndex].color]} ${players[currentPlayerIndex].name} ha pasado el turno.`);

        // Enviar acción en modo online
        if (onlineGameState.isOnline && onlineGameState.roomId) {
            await supabase.from('game_actions').insert({
                room_id: onlineGameState.roomId,
                player_id: onlineGameState.userId,
                action_type: 'pass_turn',
                action_data: {
                    playerIndex: currentPlayerIndex
                }
            });
        }

        await delay(GAME_DATA.DELAYS.ACTION_TO_NEXT_TURN); nextTurn();
    };
    const nextTurn = async () => {
        setShowPopup(false);
        if (gameState === 'GAME_OVER') return;
        const currentPlayersList = playersRef.current;
        const currentIndex = currentPlayerIndexRef.current;
        const advanceTurn = (currIdx, currList) => {
            const nextIdx = (currIdx + 1) % currList.length;
            const nextP = currList[nextIdx];
            if (nextP.skipTurns > 0) {
                setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[nextP.color]} ${nextP.name} pierde su turno.`);
                const updatedPlayers = currList.map((p, idx) => 
                    idx === nextIdx ? { ...p, skipTurns: p.skipTurns - 1 } : p
                );
                setPlayers(updatedPlayers); 
                setTimeout(() => advanceTurn(nextIdx, updatedPlayers), GAME_DATA.DELAYS.ACTION_TO_NEXT_TURN);
            } else {
                setCurrentPlayerIndex(nextIdx);
                setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[nextP.color]} Es el turno de ${nextP.name}.`);
                setGameState('AWAITING_ROLL');
            }
        };
        advanceTurn(currentIndex, currentPlayersList);
    };
    return (
        <div className="app-container">
            {oauthProcessing && (
                <div className="oauth-loading-overlay">
                    <div className="loading-spinner"></div>
                    <h2>Conectando con Google...</h2>
                </div>
            )}
            <GameHeaderWithOptions />
            <PantallaInicio activeScreen={activeScreen} setActiveScreen={setActiveScreen} user={user} onLogout={handleLogout} oauthProcessing={oauthProcessing} />
            <PantallaLobbyOnline activeScreen={activeScreen} setActiveScreen={setActiveScreen} user={user} onStartGame={startGame} />
            <PantallaSetupLocal activeScreen={activeScreen} setActiveScreen={setActiveScreen} onStartGame={startGame} />
            <div id="juego" className={`screen ${activeScreen === 'juego' ? 'active' : ''}`}> 
                <div className="game-screen-layout">
                    <Tablero players={players} properties={properties} centralImage={centralImages[currentSponsorIndex]} onCellClick={handleViewProperty} />
                    <div className="controls-panel">
                        <h3 className="controls-panel__message">
                            {gameMessage} <span>{gameConfig ? `Tiempo:${displayTime}` : ''}</span>
                         </h3>
                        <div className="controls-panel__main-actions">
                            <button className="button" onClick={toggleSound}>Sonido</button>
                            {
                                (() => {
                                    // Verificar si es el turno del jugador local en modo online
                                    const isLocalPlayerTurn = !onlineGameState.isOnline ||
                                        (players[currentPlayerIndex]?.userId === onlineGameState.userId) ||
                                        (!players[currentPlayerIndex]?.userId && currentPlayerIndex === players.findIndex(p => p.userId === onlineGameState.userId));

                                    const canRoll = gameState === 'AWAITING_ROLL' &&
                                                   gameState !== 'GAME_OVER' &&
                                                   !isTurnAI &&
                                                   isLocalPlayerTurn;

                                    return (
                                        <div
                                            className={`dice-area ${!canRoll ? 'disabled' : ''}`}
                                            onClick={() => {
                                                if (canRoll) {
                                                    handleDiceRoll();
                                                }
                                            }}
                                            title={isTurnAI ? "Turno de la IA" :
                                                   !isLocalPlayerTurn ? "Espera tu turno (turno de otro jugador)" :
                                                   gameState === 'AWAITING_ROLL' ? "¡Toca para lanzar!" :
                                                   "Espera tu turno"}
                                        >
                                            <DiceFace value={dice[0]} />
                                        </div>
                                    );
                                })()
                            }
                            <button className="button" onClick={() => {
                                if (!document.fullscreenElement) {
                                    document.documentElement.requestFullscreen().catch(e => console.log("Full Screen bloqueado."));
                                } else {
                                    if (document.exitFullscreen) document.exitFullscreen();
                                }
                            }}>
                                Pantalla
                            </button>
                        </div>
                        <div className="player-stats-table">
                            <div className="player-stats-header">
                                <div className="col-nombre">Nombre</div>
                                <div className="col-capital">Capital</div>
                                <div className="col-patrimonio">Patrimonio</div>
                            </div>
                            {players.map(p => {
                                if (p.id === undefined) return null;
                                const patrimony = p.money + p.properties.reduce((sum, propId) => sum + (properties[propId]?.price || 0), 0);
                                return (
                                    <div key={p.id} className="player-stats-row">
                                        <div className="col-nombre"><span style={{color: p.color}}>●</span>{p.name}</div>
                                        <div className="col-capital">${p.money.toLocaleString('es-CL')}</div>
                                        <div className="col-patrimonio">${patrimony.toLocaleString('es-CL')}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <ActionPopup
                show={showPopup}
                title={popupInfo.title}
                message={popupInfo.message}
                actions={popupInfo.actions}
                property={popupInfo.property}
                isAfk={afkActive && showPopup}
                disableInteractions={isTurnAI}
            />
            <WinnerModal 
                show={showWinnerModal} 
                winner={winner} 
                onClose={handleRestartGame}
                isAfk={afkActive && showWinnerModal}
                playerCount={players.length}
                startTime={gameStartTime}
            />
            <audio id="background-audio" loop preload="auto">
                <source src="https://dbtabernadematrix.my.canva.site/elgranarica/_assets/audio/6e15a859d5a048d00e8fd82d3e075b24.m4a" type="audio/mp4" />
            </audio>
            <audio id="dice-roll-audio" preload="auto">
                <source src="https://dbtabernadematrix.my.canva.site/dice-rolling/_assets/audio/8a007659d2834f2e95fbbf993c57da26.m4a" type="audio/mp4" />
            </audio>
            <audio id="cash-register-audio" preload="auto">
                <source src="https://dbtabernadematrix.my.canva.site/cash-register/_assets/audio/69ea0999288b0f9db9702af9c318ec5f.m4a" type="audio/mp4" />
            </audio>
            <audio id="property-popup-audio" preload="auto">
                <source src="https://dbtabernadematrix.my.canva.site/magic-notification-sound/_assets/audio/e21f14e9d5bb897880f9b2a6bbabe89c.m4a" type="audio/mp4" />
            </audio>
            <audio id="applause-audio" preload="auto">
                <source src="https://dbtabernadematrix.my.canva.site/applause-cheer-sound-ii/_assets/audio/63b57af81c324cef6722030d2aa132fb.m4a" type="audio/mp4" />
            </audio>
        </div>
    );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
