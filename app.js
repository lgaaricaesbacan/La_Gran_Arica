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
    const [roomCode, setRoomCode] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [loadingMessage, setLoadingMessage] = React.useState('Buscando partidas disponibles...');
    const [currentRoom, setCurrentRoom] = React.useState(null);
    const [players, setPlayers] = React.useState([]);
    const [timeLeft, setTimeLeft] = React.useState(180); // 3 minutos en segundos
    const [copied, setCopied] = React.useState(false);
    const [matchmakingAttempted, setMatchmakingAttempted] = React.useState(false);
    const [showJoinByCode, setShowJoinByCode] = React.useState(false);

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

    // Matchmaking automático al entrar
    React.useEffect(() => {
        if (matchmakingAttempted || currentRoom) return;

        const attemptMatchmaking = async () => {
            setLoading(true);
            setLoadingMessage('Buscando salas activas...');

            try {
                // Buscar salas "waiting" ordenadas por created_at (las más antiguas primero)
                const { data: rooms, error: roomsError } = await supabase
                    .from('rooms')
                    .select('*')
                    .eq('status', 'waiting')
                    .order('created_at', { ascending: true });

                if (roomsError) throw roomsError;

                // Buscar una sala con espacio disponible (< 4 jugadores)
                let joinedRoom = null;
                for (const room of rooms || []) {
                    // Contar jugadores en esta sala
                    const { count, error: countError } = await supabase
                        .from('players_online')
                        .select('*', { count: 'exact' })
                        .eq('room_id', room.id);

                    if (countError) continue;

                    // Verificar si el usuario ya está en esta sala
                    const { data: existingPlayer } = await supabase
                        .from('players_online')
                        .select('*')
                        .eq('room_id', room.id)
                        .eq('user_id', user.id)
                        .single();

                    if (existingPlayer) {
                        // Ya está en esta sala
                        joinedRoom = room;
                        break;
                    }

                    if (count < 4) {
                        // Unirse a esta sala
                        const userEmail = user.email || user.user_metadata?.email || '';
                        const { error: joinError } = await insertPlayer(supabase, {
                            room_id: room.id,
                            user_id: user.id,
                            name: user.user_metadata?.full_name || 'Jugador',
                            email: userEmail,
                            photo: user.user_metadata?.avatar_url || '',
                            color: GAME_DATA.PLAYERS.COLORS[count] || GAME_DATA.PLAYERS.COLORS[0],
                            is_ready: true
                        });

                        if (!joinError) {
                            joinedRoom = room;
                            break;
                        }
                    }
                }

                if (joinedRoom) {
                    setCurrentRoom(joinedRoom);
                    setRoomCode(joinedRoom.code);
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
            }
        };

        attemptMatchmaking();
    }, [matchmakingAttempted, currentRoom, user]);

    const createNewRoom = async () => {
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
                is_ready: true
            });

            if (playerError) throw playerError;

            setCurrentRoom(room);
            setRoomCode(code);
            return room;
        } catch (error) {
            console.error('Error al crear sala:', error);
            alert('No se pudo crear la sala. Intenta de nuevo.');
            return null;
        }
    };

    // Timer y lógica de inicio automático
    React.useEffect(() => {
        if (!currentRoom) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                const playerCount = players.length;

                // Si llegamos a 4 jugadores → iniciar inmediatamente
                if (playerCount >= 4) {
                    clearInterval(timer);
                    startOnlineGame();
                    return 0;
                }

                // Si hay 2-3 jugadores, seguir esperando hasta 3 minutos
                // Si hay solo 1 jugador, esperar 3 minutos y luego ir a local
                if (prev <= 1) {
                    clearInterval(timer);
                    if (playerCount === 1) {
                        // Solo el anfitrión, ir a partida local
                        startLocalGameWithAI();
                    } else {
                        // 2-3 jugadores, iniciar de todos modos
                        startOnlineGame();
                    }
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentRoom, players.length]);

    // Iniciar partida online (2-4 jugadores)
    const startOnlineGame = () => {
        if (players.length < 2) return;

        // Convertir jugadores online al formato del juego
        const gamePlayers = players.map((p, idx) => ({
            id: idx,
            name: p.name,
            isAI: false,
            color: p.color || GAME_DATA.PLAYERS.COLORS[idx]
        }));

        // Marcar sala como playing
        supabase.from('rooms').update({ status: 'playing' }).eq('id', currentRoom.id);

        // Iniciar partida
        const gameConfig = {
            gameDurationMs: 600 * 1000, // 10 minutos
            isOnline: true,
            roomId: currentRoom.id,
            roomCode: currentRoom.code
        };

        onStartGame(gamePlayers, gameConfig);
    };

    // Suscripción Realtime a jugadores
    React.useEffect(() => {
        if (!currentRoom) return;

        const loadPlayers = async () => {
            const { data } = await supabase
                .from('players_online')
                .select('*')
                .eq('room_id', currentRoom.id)
                .order('created_at', { ascending: true });
            if (data) setPlayers(data);
        };
        loadPlayers();

        const subscription = supabase
            .channel(`room-${currentRoom.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'players_online',
                filter: `room_id=eq.${currentRoom.id}`
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setPlayers(prev => [...prev, payload.new]);
                } else if (payload.eventType === 'DELETE') {
                    setPlayers(prev => prev.filter(p => p.id !== payload.old.id));
                } else if (payload.eventType === 'UPDATE') {
                    setPlayers(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
                }
            })
            .subscribe();

        return () => subscription.unsubscribe();
    }, [currentRoom]);

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

            const userEmail = user.email || user.user_metadata?.email || '';
            await insertPlayer(supabase, {
                room_id: room.id,
                user_id: user.id,
                name: user.user_metadata?.full_name || 'Jugador',
                email: userEmail,
                photo: user.user_metadata?.avatar_url || '',
                color: GAME_DATA.PLAYERS.COLORS[count] || GAME_DATA.PLAYERS.COLORS[0],
                is_ready: true
            });

            setCurrentRoom(room);
            setShowJoinByCode(false);
        } catch (error) {
            console.error('Error al unirse:', error);
            alert('No se pudo unir a la sala');
        } finally {
            setLoading(false);
        }
    };

    const leaveRoom = async () => {
        if (currentRoom) {
            await supabase.from('players_online').delete().eq('room_id', currentRoom.id).eq('user_id', user.id);
            const { count } = await supabase.from('players_online').select('*', { count: 'exact' }).eq('room_id', currentRoom.id);
            if (count === 0) {
                await supabase.from('rooms').delete().eq('id', currentRoom.id);
            }
        }
        setActiveScreen('inicio');
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
        const canStart = players.length >= 2;

        return (
            <div id="lobbyOnline" className="screen active">
                <div className="inicio-frame no-background">
                    <header className="inicio-header">
                        <h1>Sala: {currentRoom.code}</h1>
                        {canStart && !isFull && (
                            <div className="lobby-timer waiting">
                                Esperando 4to: {formatTime(timeLeft)}
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
                                        {idx === 0 && <span className="host-badge">Anfitrión</span>}
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
                                        ¡Bien! Esperando un 4to jugador...<br/>
                                        O inicia ahora con los {players.length} jugadores
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

    // Fallback: opciones de búsqueda (si el matchmaking falló)
    return (
        <div id="lobbyOnline" className="screen active">
            <div className="inicio-frame no-background">
                <header className="inicio-header"><h1>Multijugador Online</h1></header>
                <main className="inicio-main">
                    <div className="lobby-actions">
                        <div className="action-card">
                            <h3>🔍 Búsqueda Automática</h3>
                            <p>Busca y únete automáticamente a partidas de desconocidos.</p>
                            <button className="button" onClick={() => { setMatchmakingAttempted(false); setLoading(true); }}>
                                Buscar Partida
                            </button>
                        </div>
                        <div className="divider-lobby">O</div>
                        <div className="action-card">
                            <h3>🎮 Jugar con Amigos</h3>
                            <p>Crea una sala o únete usando un código para jugar con conocidos.</p>
                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                <button className="button" onClick={createNewRoom}>
                                    Crear Sala
                                </button>
                                <button className="button button-secondary" onClick={() => setShowJoinByCode(true)}>
                                    Unirse por Código
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="inicio-footer">
                    <button className="button" onClick={() => setActiveScreen('inicio')}>Regresar</button>
                </footer>
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
    }, [gameState, showPopup, showWinnerModal, activeScreen, currentPlayerIndex, popupInfo]);
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
        setGameStartTime(Date.now());
        playAudio('background-audio');
        const initialProperties = {};
         GAME_DATA.BOARD.forEach(square => {
            if (square.type === 'property') {
                initialProperties[square.id] = { ...square, owner: null, visitCount: 0 };
            }
        });
        setProperties(initialProperties);
        const initialCapitals = GAME_DATA.PLAYERS.INITIAL_MONEY; 
        
        const availableProfiles = [...GAME_DATA.AI_PROFILES];
        
        const gamePlayers = playerData.map((p, index) => {
            let assignedProfile = null;
            let playerName = p.name;
            
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

            return {
                ...p,
                id: index,
                name: playerName,
                position: 1,
                money: initialCapitals[index],
                color: GAME_DATA.PLAYERS.COLORS[index],
                properties: [],
                skipTurns: 0,
                aiProfile: assignedProfile,
            };
        });

        let duration = gamePlayers.length === 2 ? 600 : (gamePlayers.length === 3 ? 1200 : 1800);
        const now = Date.now();
        const serverMessage = {
            event: "GAME_SETUP",
            gameStartTime: now,
            gameDurationMs: duration * 1000,
            imageCycleDurationMs: 13000,
            serverTime: now + 50
        };
        setClientServerOffset(serverMessage.serverTime - Date.now());
        setGameConfig(serverMessage);
        setPlayers(gamePlayers);
        setCurrentPlayerIndex(0);
        setGameState('AWAITING_ROLL');
        setWinner(null);
        setShowWinnerModal(false);
        const firstPlayer = gamePlayers[0];
        setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[firstPlayer.color]} Es el turno de ${firstPlayer.name}.`);
        setActiveScreen('juego');
    };
    const handleRestartGame = () => {
        localStorage.removeItem('lga_auto_save_session');
        setShowWinnerModal(false);
        setWinner(null);
        setGameConfig(null);
        setPlayers([]);
        setProperties({});
        setGameState('AWAITING_ROLL');
        setGameMessage('¡Bienvenido a La Gran Arica! Configura tu partida.');
        setActiveScreen('inicio');
    };
    const handleDiceRoll = async () => {
        if (gameState !== 'AWAITING_ROLL') return; 
        playAudio('dice-roll-audio');
        setGameState('PLAYER_MOVING');
        const animationInterval = setInterval(() => {
            setDice([Math.floor(Math.random() * 6) + 1, 0]);
        }, GAME_DATA.DELAYS.DICE_ANIMATION_INTERVAL);
        setTimeout(async () => {
            clearInterval(animationInterval);
            const d1 = Math.floor(Math.random() * 6) + 1;
            setDice([d1, 0]);
            await delay(GAME_DATA.DELAYS.DICE_ROLL_TO_MOVE);
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
        setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, position: 25, skipTurns: 3 } : p));
        setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name} fue enviado a la Cárcel.`);
        await delay(GAME_DATA.DELAYS.ACTION_TO_NEXT_TURN); nextTurn();
    };
    const handleBuyProperty = async (squareId) => {
        setShowPopup(false); playAudio('cash-register-audio');
        const player = players[currentPlayerIndex];
        const propName = GAME_DATA.BOARD.find(b => b.id === squareId).name.replace(/\n/, ' ');
        setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[player.color]} ${player.name} compró ${propName}.`);
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
        setCurrentPlayerIndex(currentIndex => {
            const sellPrice = Math.floor(properties[squareId].price * 0.8);
            setPlayers(curr => curr.map(p => p.id === currentIndex ? { ...p, money: p.money + sellPrice, properties: p.properties.filter(id => id !== squareId) } : p));
            setProperties(curr => ({ ...curr, [squareId]: { ...curr[squareId], owner: null } }));
            return currentIndex;
        });
        await delay(GAME_DATA.DELAYS.ACTION_TO_NEXT_TURN); nextTurn();
    };
    const handlePassTurn = async () => {
        setShowPopup(false);
        setGameMessage(`${GAME_DATA.UI.COLOR_TO_EMOJI[players[currentPlayerIndex].color]} ${players[currentPlayerIndex].name} ha pasado el turno.`);
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
                            <div 
                                className={`dice-area ${(gameState !== 'AWAITING_ROLL' || gameState === 'GAME_OVER' || isTurnAI) ? 'disabled' : ''}`}
                                onClick={() => {
                                    if (gameState === 'AWAITING_ROLL' && gameState !== 'GAME_OVER' && !isTurnAI) {
                                        handleDiceRoll();
                                    }
                                }}
                                title={isTurnAI ? "Turno de la IA" : (gameState === 'AWAITING_ROLL' ? "¡Toca para lanzar!" : "Espera tu turno")}
                            >
                                <DiceFace value={dice[0]} />
                            </div>
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
