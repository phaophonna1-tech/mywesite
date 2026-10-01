import { Destination, TravelPackage, Testimonial } from '../types';

export const DESTINATIONS: Destination[] = [
  {
    id: 'angkor',
    name: 'Angkor & Tonle Sap Heritage',
    region: 'Siem Reap & Beng Mealea',
    category: 'cultural',
    country: 'Cambodia',
    tagline: 'Private dawn temple access, monk blessings, and floating village cruises',
    description: 'Bypass crowds with private dawn access through Angkor Wat’s eastern gate. Explore moss-covered jungle ruins at Ta Prohm, cruise Tonle Sap freshwater biosphere, and savor private Khmer royal dinners amidst lotus fields.',
    priceFrom: 2890,
    duration: '7 Days',
    bestSeason: 'Nov – Mar',
    groupSize: 'Max 8 Guests',
    rating: 4.99,
    reviewsCount: 214,
    accentColor: 'from-amber-500/20 to-orange-500/30',
    bgGradient: 'bg-gradient-to-br from-amber-950/80 via-stone-900 to-stone-950',
    heroSvgType: 'angkor',
    highlights: [
      'Private sunrise entry to Angkor Wat before main public gates open',
      'Archaeologist-guided VIP walk through Beng Mealea jungle ruins',
      'Private wooden riverboat through Tonle Sap stilted villages',
      'Evening Khmer classical Apsara dining curated by a master chef'
    ],
    itinerary: [
      { day: 1, title: 'VIP Airport Fast-Track & Heritage Suite Check-in', description: 'Private chauffeur to luxury French colonial resort in Siem Reap with lotus garden cocktail welcome.' },
      { day: 2, title: 'Dawn Angkor Wat & Sacred Water Blessing', description: 'Early morning private monastery blessing followed by sunrise over the lotus reflection pool.' },
      { day: 3, title: 'Bayon 216 Stone Faces & Ta Prohm Banyan Roots', description: 'Explore ancient Angkor Thom temples and tree-strangled ruins of Tomb Raider fame.' },
      { day: 4, title: 'Beng Mealea & Banteay Srei Pink Sandstone Carvings', description: 'Journey into wilder jungle ruins known for intricate 10th-century floral stonework.' },
      { day: 5, title: 'Tonle Sap Biosphere & Floating Communities', description: 'Cruise vast freshwater lake to observe stilted villages and bird sanctuaries.' },
      { day: 6, title: 'Khmer Culinary Masterclass & Artisans d’Angkor', description: 'Market visit with chef followed by hands-on traditional cooking and silk weaving workshop.' },
      { day: 7, title: 'Farewell Champagne & Private Airport Escort', description: 'Final morning spa treatment and escorted departure to Siem Reap International Airport.' }
    ],
    included: ['VIP tarmac fast-track clearance', 'Private air-conditioned Mercedes transport', 'National conservation temple passes', 'Senior licensed English cultural historian guide', 'Luxury 5-star boutique resort suites']
  },
  {
    id: 'kyoto',
    name: 'Kyoto & Japanese Alps',
    region: 'Gion, Takayama & Shirakawa-go',
    category: 'cultural',
    country: 'Japan',
    tagline: 'Centuries-old Zen gardens, secluded ryokans, and misty alpine passes',
    description: 'Travel through ancient Kyoto stone alleys and deep into the forested mountain villages of Hida. Sleep on fragrant tatami mats, soak in natural outdoor onsens, and savor multi-course seasonal Kaiseki dining.',
    priceFrom: 4350,
    duration: '9 Days',
    bestSeason: 'Mar – May / Sep – Nov',
    groupSize: 'Max 8 Guests',
    rating: 4.97,
    reviewsCount: 175,
    accentColor: 'from-rose-500/20 to-red-500/30',
    bgGradient: 'bg-gradient-to-br from-stone-900 via-rose-950/40 to-stone-950',
    heroSvgType: 'bamboo',
    highlights: [
      'Private after-hours access to secluded Daitoku-ji Zen rock garden',
      'Authentic Kaiseki dinner accompanied by senior Gion Geiko artisan',
      'Stay in thatched-roof Gassho farmhouse in UNESCO Shirakawa-go',
      'Cedar hot-spring onsen bath with views of snow-dusted pine mountains'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Kyoto & Machiya Check-In', description: 'Private welcome at Kyoto station to restored luxury merchant machiya.' },
      { day: 2, title: 'Arashiyama Bamboo Forest & Tenryu-ji', description: 'Early morning quiet walk through bamboo grove before temple doors open.' },
      { day: 3, title: 'Tea Ceremony Masterclass & Gion Stroll', description: 'Private ceremony with 15th-generation tea master in historic chashitsu.' },
      { day: 4, title: 'Fushimi Inari Torii Dawn Ascent', description: 'Trek the thousands of vermilion shrine gates in quiet morning mountain mist.' },
      { day: 5, title: 'Scenic Hida Wide View Train to Takayama', description: 'Rail through deep mountain river gorges to historic timber town.' },
      { day: 6, title: 'Shirakawa-go Thatched Village Exploration', description: 'Wander fairytale alpine hamlet surrounded by steep mountain ridges.' },
      { day: 7, title: 'Traditional Ryokan & Forest Onsen Soak', description: 'Check into secluded mountain ryokan with multi-course Kaiseki feast.' },
      { day: 8, title: 'Sake Brewery Tour & Hida Artisan Woodcraft', description: 'Sample aged mountain sake and discover centuries-old woodworking.' },
      { day: 9, title: 'Shinkansen Bullet Train to Tokyo/Osaka', description: 'First-Class Shinkansen transfer for onward international flights.' }
    ],
    included: ['First-Class JR Shinkansen & Hida Rail passes', 'Luxury Machiya and traditional Onsen Ryokan stays', 'Multi-course seasonal Kaiseki banquets', 'Private English-speaking licensed cultural guide', 'Tea ceremony and temple admissions']
  },
  {
    id: 'halong',
    name: 'Halong & Lan Ha Bay Karsts',
    region: 'Tonkin Gulf & Cat Ba Biosphere',
    category: 'coastal',
    country: 'Vietnam',
    tagline: 'Emerald waters, towering limestone pillars, and secluded sea lagoons',
    description: 'Cruise aboard a private handcrafted wooden junk into the untouched corners of Lan Ha Bay. Kayak through hidden tidal sea grottos, cycle peaceful Cat Ba island trails, and sleep beneath starlit karst cliffs.',
    priceFrom: 3150,
    duration: '6 Days',
    bestSeason: 'Oct – Apr',
    groupSize: 'Max 8 Guests',
    rating: 4.96,
    reviewsCount: 168,
    accentColor: 'from-teal-500/20 to-emerald-500/30',
    bgGradient: 'bg-gradient-to-br from-teal-950/80 via-slate-900 to-stone-950',
    heroSvgType: 'halong',
    highlights: [
      'Private boutique luxury cruise charter navigating remote Lan Ha Bay',
      'Sunset kayak expedition through Dark & Bright tidal limestone cave',
      'Viet Hai rainforest village cycling trail on Cat Ba National Park',
      'Hanoi French Quarter colonial food trail with celebrity chef'
    ],
    itinerary: [
      { day: 1, title: 'Hanoi Heritage Arrival & Old Quarter Street Food', description: 'Check into historic Metropole hotel; evening guided back-alley food tour.' },
      { day: 2, title: 'Private Limousine Transfer to Got Pier & Boarding', description: 'Embark private luxury cruise vessel; sail into quiet southern karst bays.' },
      { day: 3, title: 'Ba Trai Dao Island Beach & Sea Cave Kayaking', description: 'Swim off private secluded sandy cove and paddle into tidal cave lagoons.' },
      { day: 4, title: 'Viet Hai Rainforest Cycling & Local Rice Wine Tasting', description: 'Cycle through emerald jungle valley to ancient village hamlet.' },
      { day: 5, title: 'Dawn Tai Chi on Sun Deck & Return to Hanoi', description: 'Morning practice surrounded by morning mist over karsts; scenic transfer.' },
      { day: 6, title: 'Hanoi Temple of Literature & VIP Departure', description: 'Private calligraphy session at 11th-century academy; airport transfer.' }
    ],
    included: ['Private limousine expressway transfers', 'Private luxury charter vessel with crew & chef', 'All national bay & grotto permits', 'High-end sea kayaks and safety tenders', 'Metropole Grand Luxury Hotel stay in Hanoi']
  },
  {
    id: 'bali',
    name: 'Bali & Komodo Phinisi Drift',
    region: 'Ubud Highlands & Flores Archipelago',
    category: 'coastal',
    country: 'Indonesia',
    tagline: 'Sacred water temples, terraced highlands, and liveaboard yachting',
    description: 'Combine Bali’s spiritual heartland in Ubud with an exclusive private Phinisi schooner voyage across Komodo National Park. Snorkel with oceanic mantas and witness wild Komodo dragons in their prehistoric habitat.',
    priceFrom: 3680,
    duration: '9 Days',
    bestSeason: 'Apr – Oct',
    groupSize: 'Max 8 Guests',
    rating: 4.98,
    reviewsCount: 240,
    accentColor: 'from-emerald-500/20 to-teal-500/30',
    bgGradient: 'bg-gradient-to-br from-emerald-950/80 via-stone-900 to-stone-950',
    heroSvgType: 'temple',
    highlights: [
      'Private dawn purification blessing with village Mangku high priest',
      'Liveaboard charter aboard traditional handcrafted teak Phinisi yacht',
      'Ranger-guided encounter with wild Komodo dragons on Rinca island',
      'Pink Beach coral drift and swimming with resident manta rays'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Denpasar & Ubud Jungle Villa Retreat', description: 'Private transfer to river canyon boutique pool villa in Ubud.' },
      { day: 2, title: 'Tirta Empul Sacred Water Blessing', description: 'Private sunrise access to ancient holy spring for traditional cleanse.' },
      { day: 3, title: 'Tegallalang Terraces & Farm-to-Table Banquet', description: 'Early morning ridge walk before mist lifts, followed by organic lunch.' },
      { day: 4, title: 'Flight to Labuan Bajo & Board Luxury Phinisi', description: 'Scenic flight over Flores Sea; welcome aboard 5-cabin teak yacht.' },
      { day: 5, title: 'Rinca Island Dragon Tracking & Kalong Bat Sunset', description: 'Explore savanna trails with head ranger; witness thousands of fruit bats.' },
      { day: 6, title: 'Padar Island Summit Sunrise & Pink Beach', description: 'Iconic tri-color bay sunrise trek; afternoon snorkeling in coral garden.' },
      { day: 7, title: 'Manta Point Snorkeling & Sandbar Stargazing', description: 'Drift alongside giant oceanic mantas; beach bonfire barbecue on sandbar.' },
      { day: 8, title: 'Disembarkation & Clifftop Resort Stay in Flores', description: 'Final swim before checking into luxury oceanfront clifftop suite.' },
      { day: 9, title: 'Flight to Bali/Jakarta for International Departure', description: 'VIP escorted connection for return flights.' }
    ],
    included: ['All private domestic flights', 'Private Phinisi liveaboard yacht with crew', '5-star boutique pool villas in Ubud', 'Park ranger permits and dive master guidance', 'All meals, drinks, and marine conservation contributions']
  },
  {
    id: 'bhutan',
    name: 'Bhutan Kingdom of Thunder Dragon',
    region: 'Paro, Thimphu & Punakha Valley',
    category: 'alpine',
    country: 'Bhutan',
    tagline: 'Cliff-hanging monasteries, Himalayan valleys, and sacred traditions',
    description: 'Journey into the carbon-negative mountain kingdom of Bhutan. Hike to the iconic Tiger’s Nest monastery clinging 900 meters above Paro valley, cross suspension bridges to majestic dzongs, and immerse in authentic Himalayan Buddhist philosophy.',
    priceFrom: 4950,
    duration: '8 Days',
    bestSeason: 'Mar – May / Sep – Nov',
    groupSize: 'Max 6 Guests',
    rating: 4.99,
    reviewsCount: 132,
    accentColor: 'from-amber-500/20 to-yellow-500/30',
    bgGradient: 'bg-gradient-to-br from-stone-900 via-amber-950/40 to-stone-950',
    heroSvgType: 'bhutan',
    highlights: [
      'Private pilgrimage trek to Paro Taktsang (Tiger’s Nest) monastery',
      'Punakha Dzong palace at the confluence of Pho Chhu and Mo Chhu rivers',
      'Audience with respected Buddhist Rinpoche for meditation teaching',
      'Stays in award-winning luxury Himalayan heritage lodges'
    ],
    itinerary: [
      { day: 1, title: 'Scenic Drukair Flight into Paro & Transfer to Thimphu', description: 'Spectacular flight past Everest and Kanchenjunga; check into luxury lodge.' },
      { day: 2, title: 'Thimphu Valley Culture & Giant Buddha Dordenma', description: 'Visit National Memorial Chorten and 52m golden bronze Buddha.' },
      { day: 3, title: 'Dochula Pass (3,100m) & Descent to Punakha', description: 'Panoramic 108 memorial stupas facing eastern Himalayan range.' },
      { day: 4, title: 'Majestic Punakha Dzong & Chimi Lhakhang', description: 'Walk through historic fortress palace and fertile rice paddy trail.' },
      { day: 5, title: 'Drive to Paro & Traditional Bhutanese Hot Stone Bath', description: 'Scenic drive to Paro; relax with river-stone herbal wellness soak.' },
      { day: 6, title: 'Iconic Tiger’s Nest Monastery Pilgrimage', description: 'Morning guided hike to cliff-hanging Taktsang with monastery blessing.' },
      { day: 7, title: 'Kyichu Lhakhang 7th-Century Shrine & Farewell Feast', description: 'Visit one of Bhutan’s oldest temples followed by royal Bhutanese banquet.' },
      { day: 8, title: 'Paro Airport Departure', description: 'Private escort to Drukair flight for international connections.' }
    ],
    included: ['Bhutan Sustainable Development Fee (SDF)', 'Government visa processing & clearances', 'Luxury 5-star mountain lodge stays', 'Private 4WD Land Cruiser transport with master driver', 'Senior English-speaking certified cultural guide']
  },
  {
    id: 'maldives',
    name: 'Maldives Marine Biosphere',
    region: 'Baa & South Malé Atolls',
    category: 'coastal',
    country: 'Maldives',
    tagline: 'Private overwater sanctuaries floating above crystal lagoon reefs',
    description: 'Immerse yourself in UNESCO-protected coral sanctuaries, private sunset catamarans, and starlit overwater dining where marine life glides beneath glass floorboards.',
    priceFrom: 3450,
    duration: '7 Days',
    bestSeason: 'Nov – Apr',
    groupSize: 'Max 8 Guests',
    rating: 4.98,
    reviewsCount: 142,
    accentColor: 'from-cyan-500/20 to-teal-500/30',
    bgGradient: 'bg-gradient-to-br from-cyan-950/80 via-teal-950/60 to-stone-950',
    heroSvgType: 'islands',
    highlights: [
      'Private manta ray snorkel safari in Hanifaru Bay',
      'Overwater bungalow with glass ocean-floor observatory',
      'Chef-guided sandbank seafood barbecue under the Milky Way',
      'Traditional Dhoni wooden sailboat sunset cruise'
    ],
    itinerary: [
      { day: 1, title: 'Arrival & Seaplane Transfer', description: 'Scenic flight over coral atolls to private lagoon villa; welcome champagne.' },
      { day: 2, title: 'Baa Biosphere Marine Safari', description: 'Guided snorkel expedition alongside resident reef mantas and sea turtles.' },
      { day: 3, title: 'Private Sandbank Castaway Experience', description: 'Secluded sandbank day with personalized barbecue and tender boat service.' },
      { day: 4, title: 'Traditional Dhoni Sunset Drift', description: 'Sail alongside dolphin pods with artisan cocktails and canapés.' },
      { day: 5, title: 'Coral Restoration & Reef Nursery', description: 'Participate in marine biologist-led coral planting and evening bioluminescent dive.' },
      { day: 6, title: 'Overwater Ayurvedic Sanctuary', description: 'Full-day restorative wellness treatments listening to gentle ocean tide.' },
      { day: 7, title: 'Dawn Paddle & Island Farewell', description: 'Sunrise paddleboard session before private seaplane departure.' }
    ],
    included: ['All domestic seaplane transfers', 'Private villa accommodation', 'Daily gourmet breakfast & dinner', 'Marine biologist expedition gear', 'Concierge & luggage handling']
  }
];

export const SIGNATURE_PACKAGES: TravelPackage[] = [
  {
    id: 'package-indochina',
    title: 'The Grand Indochina Odyssey: Cambodia, Vietnam & Laos',
    subtitle: 'Angkor Wat private dawn access, Halong Bay luxury junk, and Luang Prabang Mekong sail',
    duration: '14 Days / 13 Nights',
    price: 5850,
    destinations: ['Siem Reap', 'Hanoi', 'Halong Bay', 'Luang Prabang'],
    difficulty: 'Easy Pace',
    season: 'October through April',
    schedule: [
      { day: 'Day 1–4', title: 'Angkor Wat & Khmer Ancient Realm', detail: 'Private sunrise entry to Angkor Wat, blessing with monks, Tonle Sap stilted village private charter, and French colonial heritage dining in Siem Reap.', activity: 'Temple Antiquities' },
      { day: 'Day 5–8', title: 'Hanoi Heritage & Halong Bay Luxury Cruise', detail: 'Old Quarter culinary backstreets, private limousine transfer, and 2-night boutique junk sail among untouched Lan Ha karst sea lagoons.', activity: 'Karst Junk Sail' },
      { day: 'Day 9–12', title: 'Luang Prabang & Sacred Mekong River', detail: 'Morning Buddhist alms ceremony, Kuang Si turquoise waterfall swim, and private teak boat cruise along the Mekong to Pak Ou caves.', activity: 'Mekong River Voyage' },
      { day: 'Day 13–14', title: 'Royal Palace & Indochina Celebration Farewell', detail: 'Traditional Baci blessing ceremony followed by a celebratory chef’s banquet overlooking the Nam Khan river before departure.', activity: 'VIP Royal Farewell' }
    ]
  },
  {
    id: 'package-japan',
    title: 'Imperial Japan: Kyoto, Hakone & Alpine Villages',
    subtitle: 'First-Class Shinkansen bullet rail, private Zen gardens, and secluded Ryokan onsens',
    duration: '10 Days / 9 Nights',
    price: 5200,
    destinations: ['Kyoto', 'Takayama', 'Shirakawa-go', 'Hakone'],
    difficulty: 'Moderate',
    season: 'March through May / September through November',
    schedule: [
      { day: 'Day 1–4', title: 'Kyoto Classical Temples & Gion Machiya', detail: 'Private after-hours entry to Zen rock gardens, morning bamboo forest walk, tea ceremony with grandmaster, and exclusive Kaiseki banquet.', activity: 'Zen & Geiko Culture' },
      { day: 'Day 5–7', title: 'Hida River Alpine Railway & Shirakawa-go', detail: 'Scenic mountain train to Takayama timber village, sake brewery private tasting, and fairytale thatched-roof Gassho farmhouses.', activity: 'Alpine Heritage' },
      { day: 'Day 8–10', title: 'Hakone Mount Fuji Horizons & Thermal Onsens', detail: 'Ride the Hakone ropeway overlooking volcanic steam vents, private Lake Ashi catamaran, and soak in cedar hot springs with Fuji views.', activity: 'Thermal Spas & Fuji' }
    ]
  },
  {
    id: 'package-bhutan-himalaya',
    title: 'Dragon Kingdom & Sacred Himalaya: Bhutan In-Depth',
    subtitle: 'Cliffside Tiger’s Nest monastery, Dochula Himalayan pass, and Buddhist Dzong fortresses',
    duration: '9 Days / 8 Nights',
    price: 4950,
    destinations: ['Paro', 'Thimphu', 'Punakha', 'Phobjikha Valley'],
    difficulty: 'Active Exploration',
    season: 'March through May / September through November',
    schedule: [
      { day: 'Day 1–3', title: 'Thimphu Capital & Golden Buddha Sanctuary', detail: 'Spectacular mountain landing in Paro, scenic drive to Thimphu, astrology institute visit, and meditation session with senior lama.', activity: 'Sacred Philosophy' },
      { day: 'Day 4–6', title: 'Punakha River Valley & Dochula Pass (3,100m)', detail: 'Traverse 108 snow-capped stupas, explore the majestic 17th-century Punakha Dzong, and walk across the longest suspension bridge.', activity: 'Dzong Fortresses' },
      { day: 'Day 7–9', title: 'Tiger’s Nest Pilgrimage & Royal Bhutanese Banquet', detail: 'Hike to the legendary Taktsang monastery clinging to sheer rock, traditional river-stone herbal hot bath, and farewell feast.', activity: 'Taktsang Pilgrimage' }
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Catherine Dupont',
    location: 'Paris, France',
    trip: 'Grand Indochina Odyssey (Cambodia, Vietnam & Laos)',
    year: 'Traveled February 2026',
    quote: 'As an agency director organizing high-net-worth family travel, Asia Destination DMC is the finest DMC partner I have worked with in 20 years. The tarmac VIP clearances, after-hours temple access in Siem Reap, and flawless guide coordination made the journey completely stress-free.',
    rating: 5,
    highlight: 'Flawless B2B & Luxury Execution'
  },
  {
    id: 'test-2',
    author: 'Kenji & Sarah Takahashi',
    location: 'San Francisco, California',
    trip: 'Bhutan Dragon Kingdom Expedition',
    year: 'Traveled April 2026',
    quote: 'Asia Destination DMC handled our Bhutan permits, private Land Cruiser, and guide with extraordinary care. Climbing to Tiger’s Nest with our guide Tenzin was deeply spiritual and emotional. Their local connections across Asia are peerless.',
    rating: 5,
    highlight: 'Deep Local Authority'
  },
  {
    id: 'test-3',
    author: 'Sir Julian Montgomery',
    location: 'London, United Kingdom',
    trip: 'Kyoto Machiya & Japanese Alps Trail',
    year: 'Traveled November 2025',
    quote: 'From the private Zen rock garden access before dawn to the private Kaiseki dinner with a senior Gion Geiko, every detail exceeded expectations. Asia Destination DMC operates with the precision of a Swiss watch and the soul of Asia.',
    rating: 5,
    highlight: 'Exclusive VIP Access'
  }
];
