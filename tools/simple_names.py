"""Place names for the simple games in German, Turkish, French, Spanish and (European) Portuguese, 17 Nov 2026.
A name missing here is shown as in English (most proper names: Lake Tahoe, Denali, Bamako...).
River names come from the full Rivers game's own translations (../natural-wonders-rivers/tools/i18n/*.py),
with the few extra ones the simple game needs added below.
Columns: de, tr, fr, es, pt.
"""
LANGS = ['de', 'tr', 'fr', 'es', 'pt']

def T(table):
    out = {l: {} for l in LANGS}
    for line in table.strip().splitlines():
        cells = [c.strip() for c in line.split('|')]
        en, rest = cells[0], cells[1:]
        assert len(rest) == 5, line
        for l, v in zip(LANGS, rest):
            if v and v != en: out[l][en] = v
    return out

MAPS = T('''
Europe | Europa | Avrupa | Europe | Europa | Europa
Asia | Asien | Asya | Asie | Asia | Ásia
Africa | Afrika | Afrika | Afrique | África | África
North America | Nordamerika | Kuzey Amerika | Amérique du Nord | América del Norte | América do Norte
South America | Südamerika | Güney Amerika | Amérique du Sud | América del Sur | América do Sul
Oceania | Ozeanien | Okyanusya | Océanie | Oceanía | Oceânia
UK and Ireland | Großbritannien und Irland | Birleşik Krallık ve İrlanda | Royaume-Uni et Irlande | Reino Unido e Irlanda | Reino Unido e Irlanda
United Kingdom | Vereinigtes Königreich | Birleşik Krallık | Royaume-Uni | Reino Unido | Reino Unido
Argentina | Argentinien | Arjantin | Argentine | Argentina | Argentina
Brazil | Brasilien | Brezilya | Brésil | Brasil | Brasil
Canada | Kanada | Kanada | Canada | Canadá | Canadá
China | China | Çin | Chine | China | China
DR Congo | DR Kongo | Kongo DC | RD Congo | RD del Congo | RD do Congo
Colombia | Kolumbien | Kolombiya | Colombie | Colombia | Colômbia
Germany | Deutschland | Almanya | Allemagne | Alemania | Alemanha
Egypt | Ägypten | Mısır | Égypte | Egipto | Egito
Spain | Spanien | İspanya | Espagne | España | Espanha
France | Frankreich | Fransa | France | Francia | França
India | Indien | Hindistan | Inde | India | Índia
Iraq | Irak | Irak | Irak | Irak | Iraque
Italy | Italien | İtalya | Italie | Italia | Itália
Mali | Mali | Mali | Mali | Malí | Mali
Poland | Polen | Polonya | Pologne | Polonia | Polónia
Russia | Russland | Rusya | Russie | Rusia | Rússia
Ukraine | Ukraine | Ukrayna | Ukraine | Ucrania | Ucrânia
United States | USA | ABD | États-Unis | Estados Unidos | Estados Unidos
Australia | Australien | Avustralya | Australie | Australia | Austrália
''')

RIVERS_EXTRA = T('''
Colorado | Colorado | Colorado | Colorado | Colorado | Colorado
Jordan | Jordan | Şeria | Jourdain | Jordán | Jordão
Mackenzie | Mackenzie | Mackenzie | Mackenzie | Mackenzie | Mackenzie
Garonne | Garonne | Garonne | Garonne | Garona | Garona
Severn | Severn | Severn | Severn | Severn | Severn
Tiber | Tiber | Tiber | Tibre | Tíber | Tibre
Loire | Loire | Loire | Loire | Loira | Loire
Seine | Seine | Sen | Seine | Sena | Sena
Mississippi | Mississippi | Mississippi | Mississippi | Misisipi | Mississípi
Missouri | Missouri | Missouri | Missouri | Misuri | Missouri
Ganges | Ganges | Ganj | Gange | Ganges | Ganges
Indus | Indus | İndus | Indus | Indo | Indo
Elbe | Elbe | Elbe | Elbe | Elba | Elba
Oder | Oder | Oder | Oder | Óder | Oder
Don | Don | Don | Don | Don | Don
Lena | Lena | Lena | Léna | Lena | Lena
Ob | Ob | Obi | Ob | Obi | Obi
Rio Grande | Rio Grande | Rio Grande | Rio Grande | Río Bravo | Rio Grande
Paraná | Paraná | Parana | Paraná | Paraná | Paraná
Orinoco | Orinoco | Orinoko | Orénoque | Orinoco | Orinoco
Amazon | Amazonas | Amazon | Amazone | Amazonas | Amazonas
Nile | Nil | Nil | Nil | Nilo | Nilo
Danube | Donau | Tuna | Danube | Danubio | Danúbio
Rhine | Rhein | Ren | Rhin | Rin | Reno
Thames | Themse | Thames | Tamise | Támesis | Tamisa
Volga | Wolga | Volga | Volga | Volga | Volga
Vistula | Weichsel | Vistül | Vistule | Vístula | Vístula
Euphrates | Euphrat | Fırat | Euphrate | Éufrates | Eufrates
Yangtze | Jangtse | Yangtze | Yangzi Jiang | Yangtsé | Yangtzé
Yellow River | Gelber Fluss | Sarı Irmak | Fleuve Jaune | Río Amarillo | Rio Amarelo
Zambezi | Sambesi | Zambezi | Zambèze | Zambeze | Zambeze
Congo | Kongo | Kongo | Congo | Congo | Congo
Niger | Niger | Nijer | Niger | Níger | Níger
Tagus | Tajo | Tejo | Tage | Tajo | Tejo
Douro | Duero | Duero | Douro | Duero | Douro
Ebro | Ebro | Ebro | Èbre | Ebro | Ebro
Guadalquivir | Guadalquivir | Guadalquivir | Guadalquivir | Guadalquivir | Guadalquivir
Rhône | Rhone | Ron | Rhône | Ródano | Ródano
Arno | Arno | Arno | Arno | Arno | Arno
Po | Po | Po | Pô | Po | Pó
Murray | Murray | Murray | Murray | Murray | Murray
Darling | Darling | Darling | Darling | Darling | Darling
Mekong | Mekong | Mekong | Mékong | Mekong | Mekong
Brahmaputra | Brahmaputra | Brahmaputra | Brahmapoutre | Brahmaputra | Bramaputra
Yamuna | Yamuna | Yamuna | Yamuna | Yamuna | Yamuna
Yukon | Yukon | Yukon | Yukon | Yukón | Yukon
Fraser | Fraser | Fraser | Fraser | Fraser | Fraser
Ottawa | Ottawa | Ottawa | Outaouais | Ottawa | Ottawa
Columbia | Columbia | Columbia | Columbia | Columbia | Colúmbia
Tay | Tay | Tay | Tay | Tay | Tay
Tweed | Tweed | Tweed | Tweed | Tweed | Tweed
Trent | Trent | Trent | Trent | Trent | Trent
''')

LAKES = T('''
Caspian Sea | Kaspisches Meer | Hazar Denizi | Mer Caspienne | Mar Caspio | Mar Cáspio
Lake Victoria | Viktoriasee | Victoria Gölü | Lac Victoria | Lago Victoria | Lago Vitória
Lake Superior | Oberer See | Superior Gölü | Lac Supérieur | Lago Superior | Lago Superior
Lake Baikal | Baikalsee | Baykal Gölü | Lac Baïkal | Lago Baikal | Lago Baikal
Lake Titicaca | Titicacasee | Titikaka Gölü | Lac Titicaca | Lago Titicaca | Lago Titicaca
Lake Geneva | Genfersee | Cenevre Gölü | Lac Léman | Lago Lemán | Lago Lemano
Lake Michigan | Michigansee | Michigan Gölü | Lac Michigan | Lago Míchigan | Lago Michigan
Lough Neagh | Lough Neagh | Neagh Gölü | Lough Neagh | Lough Neagh | Lough Neagh
Loch Ness | Loch Ness | Ness Gölü | Loch Ness | Lago Ness | Lago Ness
Lake Erie | Eriesee | Erie Gölü | Lac Érié | Lago Erie | Lago Erie
Lake Ontario | Ontariosee | Ontario Gölü | Lac Ontario | Lago Ontario | Lago Ontário
Lake Huron | Huronsee | Huron Gölü | Lac Huron | Lago Hurón | Lago Huron
Lake Como | Comer See | Como Gölü | Lac de Côme | Lago de Como | Lago de Como
Lake Garda | Gardasee | Garda Gölü | Lac de Garde | Lago de Garda | Lago de Garda
Lake Constance | Bodensee | Konstanz Gölü | Lac de Constance | Lago de Constanza | Lago de Constança
Lake Tanganyika | Tanganjikasee | Tanganika Gölü | Lac Tanganyika | Lago Tanganica | Lago Tanganica
Lake Malawi | Malawisee | Malavi Gölü | Lac Malawi | Lago Malaui | Lago Malawi
Lake Ladoga | Ladogasee | Ladoga Gölü | Lac Ladoga | Lago Ladoga | Lago Ladoga
Lake Onega | Onegasee | Onega Gölü | Lac Onega | Lago Onega | Lago Onega
Lake Balaton | Balaton | Balaton Gölü | Lac Balaton | Lago Balatón | Lago Balaton
Lake Nicaragua | Nicaraguasee | Nikaragua Gölü | Lac Nicaragua | Lago de Nicaragua | Lago Nicarágua
Great Bear Lake | Großer Bärensee | Büyük Ayı Gölü | Grand lac de l’Ours | Gran Lago del Oso | Grande Lago do Urso
Great Slave Lake | Großer Sklavensee | Büyük Köle Gölü | Grand lac des Esclaves | Gran Lago del Esclavo | Grande Lago do Escravo
Lake Winnipeg | Winnipegsee | Winnipeg Gölü | Lac Winnipeg | Lago Winnipeg | Lago Winnipeg
Lake Manitoba | Manitobasee | Manitoba Gölü | Lac Manitoba | Lago Manitoba | Lago Manitoba
Lake Athabasca | Athabascasee | Athabasca Gölü | Lac Athabasca | Lago Athabasca | Lago Athabasca
Lake Turkana | Turkana-See | Turkana Gölü | Lac Turkana | Lago Turkana | Lago Turkana
Lake Albert | Albertsee | Albert Gölü | Lac Albert | Lago Alberto | Lago Alberto
Issyk-Kul | Yssykköl | Issık Göl | Issyk-Koul | Issyk-Kul | Issyk-Kul
Lake Balkhash | Balchaschsee | Balkaş Gölü | Lac Balkhach | Lago Baljash | Lago Balkhash
Vänern | Vänern | Vänern Gölü | Vänern | Vänern | Vänern
Vättern | Vättern | Vättern Gölü | Vättern | Vättern | Vättern
Crater Lake | Crater Lake | Krater Gölü | Crater Lake | Lago del Cráter | Lago da Cratera
Lake Tahoe | Lake Tahoe | Tahoe Gölü | Lac Tahoe | Lago Tahoe | Lago Tahoe
Lake Chelan | Lake Chelan | Chelan Gölü | Lac Chelan | Lago Chelan | Lago Chelan
Lake Kivu | Kiwusee | Kivu Gölü | Lac Kivu | Lago Kivu | Lago Kivu
Lake Tana | Tanasee | Tana Gölü | Lac Tana | Lago Tana | Lago Tana
Qinghai Lake | Qinghai-See | Çinghay Gölü | Lac Qinghai | Lago Qinghai | Lago Qinghai
Poyang Lake | Poyang-See | Poyang Gölü | Lac Poyang | Lago Poyang | Lago Poyang
Lake Van | Vansee | Van Gölü | Lac de Van | Lago de Van | Lago Van
Lake Toba | Tobasee | Toba Gölü | Lac Toba | Lago Toba | Lago Toba
Saimaa | Saimaa | Saimaa Gölü | Saimaa | Saimaa | Saimaa
Päijänne | Päijänne | Päijänne Gölü | Päijänne | Päijänne | Päijänne
''')

MOUNTAINS = T('''
Mount Everest | Mount Everest | Everest Dağı | Everest | Monte Everest | Monte Evereste
Kilimanjaro | Kilimandscharo | Kilimanjaro | Kilimandjaro | Kilimanjaro | Kilimanjaro
Mont Blanc | Mont Blanc | Mont Blanc | Mont Blanc | Mont Blanc | Monte Branco
Mount Fuji | Fuji | Fuji Dağı | Mont Fuji | Monte Fuji | Monte Fuji
Mount Etna | Ätna | Etna Yanardağı | Etna | Etna | Etna
Mount Kosciuszko | Mount Kosciuszko | Kosciuszko Dağı | Mont Kosciuszko | Monte Kosciuszko | Monte Kosciuszko
Mount Elbrus | Elbrus | Elbruz Dağı | Elbrouz | Elbrús | Elbrus
Mount Kenya | Mount Kenya | Kenya Dağı | Mont Kenya | Monte Kenia | Monte Quénia
Mount Whitney | Mount Whitney | Whitney Dağı | Mont Whitney | Monte Whitney | Monte Whitney
Mount Rainier | Mount Rainier | Rainier Dağı | Mont Rainier | Monte Rainier | Monte Rainier
Aoraki / Mount Cook | Aoraki / Mount Cook | Aoraki / Cook Dağı | Aoraki / Mont Cook | Aoraki / Monte Cook | Aoraki / Monte Cook
Mount Olympus (Mytikas) | Olymp (Mytikas) | Olimpos Dağı (Mitikas) | Mont Olympe (Mytikas) | Monte Olimpo (Mítikas) | Monte Olimpo (Mitikas)
Mount Ararat | Ararat | Ağrı Dağı | Mont Ararat | Monte Ararat | Monte Ararat
Mount Damavand | Damavand | Demavend Dağı | Damavand | Damavand | Damavand
Pico de Orizaba | Pico de Orizaba | Orizaba Dağı | Pic d’Orizaba | Pico de Orizaba | Pico de Orizaba
Mount Logan | Mount Logan | Logan Dağı | Mont Logan | Monte Logan | Monte Logan
Kangchenjunga | Kangchendzönga | Kançenjunga | Kangchenjunga | Kanchenjunga | Kangchenjunga
Jbel Toubkal | Toubkal | Tubkal Dağı | Djebel Toubkal | Yebel Toubkal | Jebel Toubkal
Puncak Jaya (Carstensz Pyramid) | Puncak Jaya (Carstensz-Pyramide) | Puncak Jaya (Carstensz Piramidi) | Puncak Jaya (pyramide Carstensz) | Puncak Jaya (Pirámide de Carstensz) | Puncak Jaya (Pirâmide Carstensz)
Mount Kinabalu | Kinabalu | Kinabalu Dağı | Mont Kinabalu | Monte Kinabalu | Monte Kinabalu
Mount Cameroon | Kamerunberg | Kamerun Dağı | Mont Cameroun | Monte Camerún | Monte Camarões
Mount Apo | Mount Apo | Apo Dağı | Mont Apo | Monte Apo | Monte Apo
Mount Stanley | Mount Stanley | Stanley Dağı | Mont Stanley | Monte Stanley | Monte Stanley
Mount Wilhelm | Mount Wilhelm | Wilhelm Dağı | Mont Wilhelm | Monte Wilhelm | Monte Wilhelm
Mount Robson | Mount Robson | Robson Dağı | Mont Robson | Monte Robson | Monte Robson
Mount Ruapehu | Ruapehu | Ruapehu Dağı | Ruapehu | Ruapehu | Ruapehu
Aconcagua | Aconcagua | Aconcagua | Aconcagua | Aconcagua | Aconcágua
''')

DESERTS = T('''
Sahara Desert | Sahara | Büyük Sahra Çölü | Sahara | Desierto del Sahara | Deserto do Saara
Gobi Desert | Wüste Gobi | Gobi Çölü | Désert de Gobi | Desierto de Gobi | Deserto de Gobi
Kalahari Desert | Kalahari | Kalahari Çölü | Kalahari | Desierto de Kalahari | Deserto do Kalahari
Atacama Desert | Atacama-Wüste | Atacama Çölü | Désert d’Atacama | Desierto de Atacama | Deserto do Atacama
Sonoran Desert | Sonora-Wüste | Sonora Çölü | Désert de Sonora | Desierto de Sonora | Deserto de Sonora
Namib Desert | Namib | Namib Çölü | Désert du Namib | Desierto del Namib | Deserto do Namibe
Great Victoria Desert | Große Victoria-Wüste | Büyük Victoria Çölü | Grand désert Victoria | Gran Desierto Victoria | Grande Deserto Victoria
Thar Desert | Wüste Thar | Thar Çölü | Désert du Thar | Desierto de Thar | Deserto de Thar
Taklamakan Desert | Taklamakan | Taklamakan Çölü | Désert du Taklamakan | Desierto de Taklamakán | Deserto de Taklamakan
Chihuahuan Desert | Chihuahua-Wüste | Chihuahua Çölü | Désert de Chihuahua | Desierto de Chihuahua | Deserto de Chihuahua
Great Basin Desert | Great-Basin-Wüste | Büyük Havza Çölü | Désert du Grand Bassin | Desierto de la Gran Cuenca | Deserto da Grande Bacia
Syrian Desert | Syrische Wüste | Suriye Çölü | Désert de Syrie | Desierto de Siria | Deserto da Síria
Simpson Desert | Simpsonwüste | Simpson Çölü | Désert de Simpson | Desierto de Simpson | Deserto de Simpson
Karakum Desert | Karakum | Karakum Çölü | Karakoum | Desierto de Karakum | Deserto de Karakum
Great Sandy Desert | Große Sandwüste | Büyük Kumlu Çöl | Grand désert de sable | Gran Desierto Arenoso | Grande Deserto Arenoso
Kyzylkum Desert | Kysylkum | Kızılkum Çölü | Kyzylkoum | Desierto de Kyzylkum | Deserto de Kyzylkum
Lut Desert | Wüste Lut | Lut Çölü | Désert de Lut | Desierto de Lut | Deserto de Lut
Great Salt Desert (Dasht-e Kavir) | Große Salzwüste (Dascht-e Kawir) | Büyük Tuz Çölü (Deşt-i Kevir) | Grand désert salé (Dasht-e Kavir) | Gran Desierto Salado (Dasht-e Kavir) | Grande Deserto Salgado (Dasht-e Kavir)
Danakil Desert | Danakil-Wüste | Danakil Çölü | Désert Danakil | Desierto de Danakil | Deserto de Danakil
Tanami Desert | Tanami-Wüste | Tanami Çölü | Désert de Tanami | Desierto de Tanami | Deserto de Tanami
Gibson Desert | Gibsonwüste | Gibson Çölü | Désert de Gibson | Desierto de Gibson | Deserto de Gibson
Colorado Plateau | Colorado-Plateau | Colorado Platosu | Plateau du Colorado | Meseta del Colorado | Planalto do Colorado
Registan Desert | Registan | Registan Çölü | Désert du Registan | Desierto de Registán | Deserto de Registan
Chalbi Desert | Chalbi-Wüste | Chalbi Çölü | Désert de Chalbi | Desierto de Chalbi | Deserto de Chalbi
Ustyurt Plateau | Ustjurt-Plateau | Üstyurt Platosu | Plateau d’Oustiourt | Meseta de Ustiurt | Planalto de Ustyurt
Ogaden Desert | Ogaden | Ogaden Çölü | Désert de l’Ogaden | Desierto de Ogadén | Deserto de Ogaden
''')

FORESTS = T('''
Amazon rainforest | Amazonas-Regenwald | Amazon Yağmur Ormanı | Forêt amazonienne | Selva amazónica | Floresta Amazónica
Congo rainforest | Kongo-Regenwald | Kongo Yağmur Ormanı | Forêt du bassin du Congo | Selva del Congo | Floresta do Congo
Black Forest | Schwarzwald | Kara Orman | Forêt-Noire | Selva Negra | Floresta Negra
Sherwood Forest | Sherwood Forest | Sherwood Ormanı | Forêt de Sherwood | Bosque de Sherwood | Floresta de Sherwood
New Forest | New Forest | New Forest | New Forest | New Forest | New Forest
Ardennes | Ardennen | Ardenler | Ardennes | Ardenas | Ardenas
Białowieża Forest | Białowieża-Urwald | Białowieża Ormanı | Forêt de Białowieża | Bosque de Białowieża | Floresta de Białowieża
Epping Forest | Epping Forest | Epping Ormanı | Forêt d’Epping | Bosque de Epping | Floresta de Epping
Forest of Dean | Forest of Dean | Dean Ormanı | Forêt de Dean | Bosque de Dean | Floresta de Dean
Kielder Forest | Kielder Forest | Kielder Ormanı | Forêt de Kielder | Bosque de Kielder | Floresta de Kielder
Forest of Fontainebleau | Wald von Fontainebleau | Fontainebleau Ormanı | Forêt de Fontainebleau | Bosque de Fontainebleau | Floresta de Fontainebleau
Landes forest | Wald der Landes | Landes Ormanı | Forêt des Landes | Bosque de las Landas | Floresta das Landes
Sundarbans | Sundarbans | Sundarbans | Sundarbans | Sundarbans | Sundarbans
Borneo lowland rain forests | Tieflandregenwald Borneos | Borneo Ova Yağmur Ormanları | Forêts de plaine de Bornéo | Selvas de tierras bajas de Borneo | Florestas de planície do Bornéu
Bwindi Impenetrable Forest | Bwindi-Urwald | Bwindi Geçilmez Ormanı | Forêt impénétrable de Bwindi | Bosque impenetrable de Bwindi | Floresta Impenetrável de Bwindi
Ituri Rainforest | Ituri-Regenwald | Ituri Yağmur Ormanı | Forêt de l’Ituri | Selva de Ituri | Floresta de Ituri
Kakamega Forest | Kakamega-Wald | Kakamega Ormanı | Forêt de Kakamega | Bosque de Kakamega | Floresta de Kakamega
Mau Forest | Mau-Wald | Mau Ormanı | Forêt de Mau | Bosque Mau | Floresta de Mau
Taï National Park | Taï-Nationalpark | Taï Ulusal Parkı | Parc national de Taï | Parque nacional de Taï | Parque Nacional de Taï
Daintree Rainforest | Daintree-Regenwald | Daintree Yağmur Ormanı | Forêt de Daintree | Selva de Daintree | Floresta de Daintree
Gondwana Rainforests of Australia | Gondwana-Regenwälder Australiens | Avustralya Gondwana Yağmur Ormanları | Forêts humides Gondwana d’Australie | Selvas Gondwana de Australia | Florestas Gondwana da Austrália
Great Otway National Park | Great-Otway-Nationalpark | Great Otway Ulusal Parkı | Parc national Great Otway | Parque nacional Great Otway | Parque Nacional Great Otway
Redwood National and State Parks | Redwood-Nationalpark | Redwood Ulusal ve Eyalet Parkları | Parcs national et d’État de Redwood | Parques nacional y estatales de Redwood | Parques Nacional e Estaduais de Redwood
Tongass National Forest | Tongass National Forest | Tongass Ulusal Ormanı | Forêt nationale de Tongass | Bosque nacional Tongass | Floresta Nacional de Tongass
Hoh Rainforest | Hoh-Regenwald | Hoh Yağmur Ormanı | Forêt de Hoh | Selva Hoh | Floresta de Hoh
Great Bear Rainforest | Great Bear Rainforest | Büyük Ayı Yağmur Ormanı | Forêt du Grand Ours | Selva del Gran Oso | Floresta do Grande Urso
El Yunque National Forest | El-Yunque-Nationalwald | El Yunque Ulusal Ormanı | Forêt nationale d’El Yunque | Bosque nacional El Yunque | Floresta Nacional El Yunque
Monteverde Cloud Forest Reserve | Nebelwald von Monteverde | Monteverde Bulut Ormanı | Réserve de forêt de nuages de Monteverde | Reserva Bosque Nuboso Monteverde | Reserva da Floresta Nublada de Monteverde
Lacandon Jungle | Lacandonen-Regenwald | Lakandon Ormanı | Forêt lacandone | Selva Lacandona | Selva Lacandona
Manú National Park | Manú-Nationalpark | Manú Ulusal Parkı | Parc national de Manú | Parque nacional del Manu | Parque Nacional de Manú
Yasuní National Park | Yasuní-Nationalpark | Yasuní Ulusal Parkı | Parc national Yasuní | Parque nacional Yasuní | Parque Nacional Yasuní
Araucaria moist forests | Araukarien-Feuchtwälder | Araucaria Nemli Ormanları | Forêts humides à araucarias | Bosques húmedos de araucaria | Florestas húmidas de araucária
Magellanic subpolar forests | Magellanische Subpolarwälder | Macellan Kutup Altı Ormanları | Forêts subpolaires de Magellan | Bosques subpolares magallánicos | Florestas subpolares de Magalhães
Taman Negara | Taman Negara | Taman Negara | Taman Negara | Taman Negara | Taman Negara
Sinharaja Forest Reserve | Sinharaja-Waldreservat | Sinharaja Orman Koruma Alanı | Réserve forestière de Sinharaja | Reserva forestal de Sinharaja | Reserva Florestal de Sinharaja
Hyrcanian forests | Hyrkanische Wälder | Hirkan Ormanları | Forêts hyrcaniennes | Bosques hircanos | Florestas hircanianas
''')

WATERS = T('''
Mediterranean Sea | Mittelmeer | Akdeniz | Mer Méditerranée | Mar Mediterráneo | Mar Mediterrâneo
North Sea | Nordsee | Kuzey Denizi | Mer du Nord | Mar del Norte | Mar do Norte
English Channel | Ärmelkanal | Manş Denizi | Manche | Canal de la Mancha | Canal da Mancha
Red Sea | Rotes Meer | Kızıldeniz | Mer Rouge | Mar Rojo | Mar Vermelho
Caribbean Sea | Karibisches Meer | Karayip Denizi | Mer des Caraïbes | Mar Caribe | Mar das Caraíbas
Gulf of Mexico | Golf von Mexiko | Meksika Körfezi | Golfe du Mexique | Golfo de México | Golfo do México
Black Sea | Schwarzes Meer | Karadeniz | Mer Noire | Mar Negro | Mar Negro
Baltic Sea | Ostsee | Baltık Denizi | Mer Baltique | Mar Báltico | Mar Báltico
Irish Sea | Irische See | İrlanda Denizi | Mer d’Irlande | Mar de Irlanda | Mar da Irlanda
Hudson Bay | Hudson Bay | Hudson Körfezi | Baie d’Hudson | Bahía de Hudson | Baía de Hudson
Adriatic Sea | Adriatisches Meer | Adriyatik Denizi | Mer Adriatique | Mar Adriático | Mar Adriático
Aegean Sea | Ägäisches Meer | Ege Denizi | Mer Égée | Mar Egeo | Mar Egeu
Persian Gulf | Persischer Golf | Basra Körfezi | Golfe Persique | Golfo Pérsico | Golfo Pérsico
Bay of Bengal | Golf von Bengalen | Bengal Körfezi | Golfe du Bengale | Golfo de Bengala | Golfo de Bengala
Arabian Sea | Arabisches Meer | Umman Denizi | Mer d’Arabie | Mar Arábigo | Mar Arábico
South China Sea | Südchinesisches Meer | Güney Çin Denizi | Mer de Chine méridionale | Mar de China Meridional | Mar da China Meridional
East China Sea | Ostchinesisches Meer | Doğu Çin Denizi | Mer de Chine orientale | Mar de China Oriental | Mar da China Oriental
Sea of Japan | Japanisches Meer | Japon Denizi | Mer du Japon | Mar de Japón | Mar do Japão
Yellow Sea | Gelbes Meer | Sarı Deniz | Mer Jaune | Mar Amarillo | Mar Amarelo
Bay of Biscay | Golf von Biskaya | Biskay Körfezi | Golfe de Gascogne | Golfo de Vizcaya | Golfo da Biscaia
Tasman Sea | Tasmansee | Tasman Denizi | Mer de Tasman | Mar de Tasmania | Mar da Tasmânia
Coral Sea | Korallenmeer | Mercan Denizi | Mer de Corail | Mar del Coral | Mar de Coral
Arafura Sea | Arafurasee | Arafura Denizi | Mer d’Arafura | Mar de Arafura | Mar de Arafura
Timor Sea | Timorsee | Timor Denizi | Mer de Timor | Mar de Timor | Mar de Timor
Strait of Gibraltar | Straße von Gibraltar | Cebelitarık Boğazı | Détroit de Gibraltar | Estrecho de Gibraltar | Estreito de Gibraltar
Bosporus | Bosporus | İstanbul Boğazı | Bosphore | Bósforo | Bósforo
Mozambique Channel | Straße von Mosambik | Mozambik Kanalı | Canal du Mozambique | Canal de Mozambique | Canal de Moçambique
Gulf of Guinea | Golf von Guinea | Gine Körfezi | Golfe de Guinée | Golfo de Guinea | Golfo da Guiné
Gulf of Aden | Golf von Aden | Aden Körfezi | Golfe d’Aden | Golfo de Adén | Golfo de Áden
Gulf of Oman | Golf von Oman | Umman Körfezi | Golfe d’Oman | Golfo de Omán | Golfo de Omã
Gulf of Bothnia | Bottnischer Meerbusen | Botni Körfezi | Golfe de Botnie | Golfo de Botnia | Golfo de Bótnia
Gulf of Finland | Finnischer Meerbusen | Finlandiya Körfezi | Golfe de Finlande | Golfo de Finlandia | Golfo da Finlândia
Skagerrak | Skagerrak | Skagerrak | Skagerrak | Skagerrak | Skagerrak
Tyrrhenian Sea | Tyrrhenisches Meer | Tiren Denizi | Mer Tyrrhénienne | Mar Tirreno | Mar Tirreno
Ligurian Sea | Ligurisches Meer | Ligurya Denizi | Mer Ligure | Mar de Liguria | Mar da Ligúria
Strait of Malacca | Straße von Malakka | Malakka Boğazı | Détroit de Malacca | Estrecho de Malaca | Estreito de Malaca
Java Sea | Javasee | Cava Denizi | Mer de Java | Mar de Java | Mar de Java
Gulf of Thailand | Golf von Thailand | Tayland Körfezi | Golfe de Thaïlande | Golfo de Tailandia | Golfo da Tailândia
Andaman Sea | Andamanensee | Andaman Denizi | Mer d’Andaman | Mar de Andamán | Mar de Andamão
Gulf of California | Golf von Kalifornien | Kaliforniya Körfezi | Golfe de Californie | Golfo de California | Golfo da Califórnia
Gulf of Alaska | Golf von Alaska | Alaska Körfezi | Golfe d’Alaska | Golfo de Alaska | Golfo do Alasca
Gulf of Saint Lawrence | Sankt-Lorenz-Golf | Saint Lawrence Körfezi | Golfe du Saint-Laurent | Golfo de San Lorenzo | Golfo de São Lourenço
Bay of Fundy | Bay of Fundy | Fundy Körfezi | Baie de Fundy | Bahía de Fundy | Baía de Fundy
Chesapeake Bay | Chesapeake Bay | Chesapeake Körfezi | Baie de Chesapeake | Bahía de Chesapeake | Baía de Chesapeake
Gulf of Maine | Golf von Maine | Maine Körfezi | Golfe du Maine | Golfo de Maine | Golfo do Maine
Río de la Plata | Río de la Plata | Rio de la Plata | Río de la Plata | Río de la Plata | Rio da Prata
Strait of Magellan | Magellanstraße | Macellan Boğazı | Détroit de Magellan | Estrecho de Magallanes | Estreito de Magalhães
Gulf of San Jorge | Golf von San Jorge | San Jorge Körfezi | Golfe San Jorge | Golfo San Jorge | Golfo de San Jorge
Gulf of Penas | Golfo de Penas | Penas Körfezi | Golfe de Penas | Golfo de Penas | Golfo de Penas
Gulf of Carpentaria | Golf von Carpentaria | Carpentaria Körfezi | Golfe de Carpentarie | Golfo de Carpentaria | Golfo de Carpentária
Great Australian Bight | Große Australische Bucht | Büyük Avustralya Körfezi | Grande baie australienne | Gran Bahía Australiana | Grande Baía Australiana
Bass Strait | Bass-Straße | Bass Boğazı | Détroit de Bass | Estrecho de Bass | Estreito de Bass
Torres Strait | Torres-Straße | Torres Boğazı | Détroit de Torrès | Estrecho de Torres | Estreito de Torres
''')

CITIES = T('''
London | London | Londra | Londres | Londres | Londres
Paris | Paris | Paris | Paris | París | Paris
Berlin | Berlin | Berlin | Berlin | Berlín | Berlim
Cairo | Kairo | Kahire | Le Caire | El Cairo | Cairo
New Orleans | New Orleans | New Orleans | La Nouvelle-Orléans | Nueva Orleans | Nova Orleães
Warsaw | Warschau | Varşova | Varsovie | Varsovia | Varsóvia
Kyiv | Kyjiw | Kiev | Kyiv | Kiev | Kiev
Baghdad | Bagdad | Bağdat | Bagdad | Bagdad | Bagdade
Delhi | Delhi | Delhi | Delhi | Delhi | Deli
Florence | Florenz | Floransa | Florence | Florencia | Florença
Cologne | Köln | Köln | Cologne | Colonia | Colónia
Hamburg | Hamburg | Hamburg | Hambourg | Hamburgo | Hamburgo
Frankfurt | Frankfurt | Frankfurt | Francfort | Fráncfort | Frankfurt
Dresden | Dresden | Dresden | Dresde | Dresde | Dresden
Bordeaux | Bordeaux | Bordeaux | Bordeaux | Burdeos | Bordéus
Pisa | Pisa | Pisa | Pise | Pisa | Pisa
Seville | Sevilla | Sevilla | Séville | Sevilla | Sevilha
Kraków | Krakau | Krakov | Cracovie | Cracovia | Cracóvia
Volgograd | Wolgograd | Volgograd | Volgograd | Volgogrado | Volgogrado
St. Louis | St. Louis | St. Louis | Saint-Louis | San Luis | Saint Louis
Luxor | Luxor | Luksor | Louxor | Luxor | Luxor
Zaragoza | Saragossa | Zaragoza | Saragosse | Zaragoza | Saragoça
Orléans | Orléans | Orléans | Orléans | Orleans | Orleães
Toulouse | Toulouse | Toulouse | Toulouse | Toulouse | Toulouse
Verona | Verona | Verona | Vérone | Verona | Verona
Kazan | Kasan | Kazan | Kazan | Kazán | Cazã
Novosibirsk | Nowosibirsk | Novosibirsk | Novossibirsk | Novosibirsk | Novosibirsk
Aswan | Assuan | Asvan | Assouan | Asuán | Assuão
Mosul | Mossul | Musul | Mossoul | Mosul | Mossul
Rome | Rom | Roma | Rome | Roma | Roma
Vienna | Wien | Viyana | Vienne | Viena | Viena
Munich | München | Münih | Munich | Múnich | Munique
Prague | Prag | Prag | Prague | Praga | Praga
Budapest | Budapest | Budapeşte | Budapest | Budapest | Budapeste
Moscow | Moskau | Moskova | Moscou | Moscú | Moscovo
Kolkata | Kolkata | Kalküta | Calcutta | Calcuta | Calcutá
Venice | Venedig | Venedik | Venise | Venecia | Veneza
Milan | Mailand | Milano | Milan | Milán | Milão
Bremen | Bremen | Bremen | Brême | Bremen | Bremen
Córdoba | Córdoba | Kurtuba | Cordoue | Córdoba | Córdova
Wrocław | Breslau | Wrocław | Wrocław | Breslavia | Breslávia
Nanjing | Nanjing | Nanjing | Nankin | Nankín | Nanquim
Trento | Trient | Trento | Trente | Trento | Trento
Asyut | Asyut | Asyut | Assiout | Asiut | Assiut
Le Havre | Le Havre | Le Havre | Le Havre | El Havre | Le Havre
Cambridge | Cambridge | Cambridge | Cambridge | Cambridge | Cambridge
''')

GAME_NAMES = {
    'rivers': MAPS, 'lakes': LAKES, 'mountains': MOUNTAINS, 'deserts': DESERTS,
    'forests': FORESTS, 'bodies-of-water': WATERS, 'river-cities': CITIES,
}
