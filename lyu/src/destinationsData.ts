import { Destination, Itinerary, ExploreDetails } from "./types";

export const initialDestinations: Destination[] = [
  {
    id: "himalayan-peaks",
    name: "Himalayan Peaks",
    country: "India",
    tagline: "Pristine snowy summits and high-altitude glacial lakes.",
    tags: ["Nature", "Scenic", "Adventure"],
    imageUrl: "/assets/himalayan_lake_peaks.png",
    description: "Experience the majesty of snow-capped peaks reflecting off ancient, high-altitude lakes in the wild Indian Himalayas.",
    isHot: true
  },
  {
    id: "glacial-echoes",
    name: "Glacial Echoes",
    country: "Reykjavík, Iceland",
    tagline: "Traverse luminous ice caves and witness skies painted with magnetic storms.",
    tags: ["Nature", "Scenic", "Off-World"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlWu_KsGYnSmyy_vZrAKmboOdKWBgBx9swqEFN1CY8d7vSwSLHX4mpdsLA7hdOkNmYIkSX-3gVXm-zDKorkgnJ4bXFMNJmbbYHpfpS0Bj9joi4ZYw6OFdER63jeXVNTdNwKaEQCtduQZidtCor5c6adnDZIbjEF44rQ-qv-9yTbbo-5LnaD-lNLb9TmE8fLcx2GSt5w9V_VRzPCGT94hck2r6k_4g-Qn22EXby5d_gVv8FJJ1FYmvpUgfyIhAG6Pi3Yt18xSpy5iyO",
    description: "Traverse luminous ice caves and witness skies painted with magnetic storms in this serene, frigid wilderness.",
    isHot: false
  },
  {
    id: "amalfi-heights",
    name: "Amalfi Heights",
    country: "Italy",
    tagline: "Coastal Utopias",
    tags: ["Scenic", "Relaxation", "Nature"],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCa1PKZlyniTsAfCPmFdfzVLYza3DILkRseA_7-r6T9PHO79jHTaNsxlLoFEIML4ZJPnExDOmoISwb6A4CzoikYqlpa2Wpyt0pYRet9ayBdjX1q7F0M2CukBXZ2p_c7ndNDvfA_t6COu3rgU8XJ69IHkUabQXQeNooFdJn2lRWCxlO04quPsWlCZ_YRdZ_b6vh4cRnT0T2WOKQI4viGWt6BGp3_VlP0TdjIjtaQmJ5IbqTGk2jRZ0ViyPyA8dd7uxDxTCqIIZqCa8G5",
    description: "A striking view of the Amalfi Coast rendered with a slightly futuristic, utopian filter. Deep Mediterranean contrast.",
    isHot: false
  },
  {
    id: "chandra-taal",
    name: "Chandra Taal Spiti",
    country: "Ladakh, India",
    tagline: "The Crescent Moon Lake.",
    tags: ["Nature", "Scenic", "Adventure"],
    imageUrl: "/assets/chandra_taal_lake.png",
    description: "Dazzling turquoise lake nestled amidst snowy peaks under starry Himalayan skies in Spiti Valley, India.",
    isHot: false
  }
];

// Prebaked Explore Details for instant loading
export const prebakedExploreDetails: Record<string, ExploreDetails> = {
  "himalayan-peaks": {
    destination: "Himalayan Peaks",
    localSecrets: [
      "The Hidden Hot Springs of Panamik: Geothermal sulfur springs tucked behind snowy ridges, offering healing hot waters amidst sub-zero weather.",
      "Chandra Taal Nightglow: A high-altitude spot where the moon reflects off the lake water, creating a surreal bioluminescent glow.",
      "The Whispering Monasteries: Ancient cliffside monasteries where deep chanting echoes across snowy canyons."
    ],
    signatureFoods: [
      {
        name: "Himalayan Yak Butter Tea",
        description: "A rich, salty, warming traditional brew made from yak butter, black tea leaves, and local salt."
      },
      {
        name: "Snow Thukpa",
        description: "Hearty, steaming noodle soup loaded with wild mountain vegetables and spicy Himalayan herbs."
      },
      {
        name: "Steamed Yak Cheese Momos",
        description: "Freshly handmade dumplings stuffed with local chhurpi cheese and aromatic herbs."
      }
    ],
    culturalEtiquette: [
      "Always walk clockwise around Buddhist stupas, mani walls, and sacred prayer wheels.",
      "Never leave non-biodegradable waste in the delicate high-altitude mountain ecosystems."
    ],
    highlights: [
      {
        name: "Chandra Taal Lake",
        tagline: "The Crescent Moon Lake",
        description: "A gorgeous lake that changes its color from reddish to blue to emerald green throughout the day."
      },
      {
        name: "Spiti Valley Heights",
        tagline: "Wild high-altitude cold desert",
        description: "A cold desert valley nestled in the high Himalayas with stunning monasteries and snow views."
      },
      {
        name: "Key Monastery cliffside",
        tagline: "Ancient sanctuary in the sky",
        description: "An iconic Tibetan Buddhist monastery built like a castle on a steep hill overlooking the valley."
      },
      {
        name: "Rohtang Snowy Pass",
        tagline: "Glacial gateway",
        description: "A breathtaking high-altitude pass offering panoramic views of massive glaciers and snowy peaks."
      }
    ]
  },
  "chandra-taal": {
    destination: "Chandra Taal Spiti",
    localSecrets: [
      "The Shepard's Cave: A natural rock shelter used by Gaddi shepards for centuries, offering views of the stars.",
      "Magnetic Hill Spiti: An optical illusion ridge where parked vehicles appear to roll uphill against gravity.",
      "The Kunzum Pass Chortens: Sacred stone monuments where travelers pay respect before crossing into Spiti."
    ],
    signatureFoods: [
      {
        name: "Sea Buckthorn Juice",
        description: "A tart, refreshing orange drink made from wild berries harvested from thorny high-altitude bushes."
      },
      {
        name: "Siddu with ghee",
        description: "Local steamed bread stuffed with poppy seeds, walnuts, and served with pure melted cow butter."
      }
    ],
    culturalEtiquette: [
      "Ask permission before photographing local village elders or monks.",
      "Do not swim in Chandra Taal lake; it is considered sacred by the local residents."
    ],
    highlights: [
      {
        name: "Chandra Taal Lake Walk",
        tagline: "Lakeside stroll under peaks",
        description: "A gorgeous 4km perimeter trail around the crescent lake with reflective snowy peak backdrops."
      },
      {
        name: "Kunzum La Pass",
        tagline: "The windy gate",
        description: "Stand at 4,551 meters surrounded by spectacular views of the Bara-Shigri glacier."
      }
    ]
  },
  "glacial-echoes": {
    destination: "Glacial Echoes",
    localSecrets: [
      "The Silfra Neural Well: A glacial fissure where water is so crystal clear that diving allows your mind to enter a meditative void.",
      "The Sub-thermal Hot Springs: Uncharted hot pools hidden inside natural black basalt caves accessible only via ice tunnels.",
      "The Whispering Glaciers: Areas where the sound of shifting tectonic ice resonates at therapeutic frequencies."
    ],
    signatureFoods: [
      {
        name: "Thermal Sourdough",
        description: "Traditional sweet rye bread baked in iron pots buried underground near boiling geothermal vents."
      },
      {
        name: "Aurora Smoked Char",
        description: "Arctic lake fish cold-smoked using local dried birch wood and cured with dynamic sea salt."
      },
      {
        name: "Glacier Melt Water",
        description: "Ultra-purified water harvested from 10,000-year-old deep ice core samples, served with zero-gravity ice spheres."
      }
    ],
    culturalEtiquette: [
      "Never leave marked safety trails; magnetic storms can distort GPS signals in seconds.",
      "Respect the silence of the ice fields; loud acoustic emissions are strictly regulated."
    ],
    highlights: [
      {
        name: "The Blue Lagoon Biosphere",
        tagline: "Geothermal luxury under neon skies",
        description: "Bathe in mineral-rich, milky blue water surrounded by contrasting black volcanic lava rocks and glowing auroras."
      },
      {
        name: "Vatnajökull Ice Cathedral",
        tagline: "Massive natural crystalline cavern",
        description: "Witness blue light filtered through hundreds of meters of solid glacial ice in a chamber the size of a cathedral."
      },
      {
        name: "Black Sand Matrix",
        tagline: "Reynisfjara basalt columns",
        description: "Walk on dark volcanic sands while huge basalt columns rise from the sea like giant architectural crystals."
      },
      {
        name: "Geysir Pulse Core",
        tagline: "Erupting geothermal power",
        description: "Watch Strokkur geyser release boiling water and glowing vapor plumes 30 meters into the crisp arctic air."
      }
    ]
  }
};

// Prebaked Itineraries
export const prebakedItineraries: Record<string, Itinerary> = {
  "glacial-echoes": {
    destination: "Glacial Echoes",
    country: "Iceland",
    durationDays: 3,
    bestSeason: "Late Autumn to Early Spring (Aurora Maxima)",
    budgetLevel: "Moderate",
    description: "Traverse luminous ice caves and witness skies painted with magnetic storms in this serene, frigid wilderness.",
    estimatedTotalCost: "$1,450 - $1,900 USD",
    days: [
      {
        dayNumber: 1,
        theme: "Geothermal Arrivals & Blue Bioluminescence",
        activities: [
          {
            time: "Morning",
            title: "Descent into Keflavík Void",
            description: "Arrive at Keflavík Space Terminal and board the low-emission maglev shuttle straight to the Blue Lagoon.",
            cost: "$45 USD",
            locationName: "Keflavík Space Terminal"
          },
          {
            time: "Afternoon",
            title: "Blue Biosphere Spa",
            description: "Soak in volcanic mineral baths. Apply white silica mud and watch the steam blend with cyan aurora indicators.",
            cost: "$120 USD",
            locationName: "Blue Lagoon Retreat"
          },
          {
            time: "Evening",
            title: "Volcanic Gastronomy",
            description: "Indulge in cod fillet cooked on hot basalt stone plates paired with traditional slow-baked thermal bread.",
            cost: "$65 USD",
            locationName: "Moss Restaurant"
          }
        ]
      },
      {
        dayNumber: 2,
        theme: "The Crystalline Cathedral & Magnetic Storms",
        activities: [
          {
            time: "Morning",
            title: "Super-jeep Glacier Transit",
            description: "Board a customized massive 8-wheel electric crawler designed to safely navigate high-altitude crevasses.",
            cost: "$150 USD",
            locationName: "Vatnajökull Base Camp"
          },
          {
            time: "Afternoon",
            title: "Deep Ice Cathedral Tour",
            description: "Descend into natural crystal blue caves. Touch ice that is over 10,000 years old, glowing deep cobalt.",
            cost: "$110 USD",
            locationName: "Vatnajökull Glacier Cave"
          },
          {
            time: "Evening",
            title: "Starlight Aurora Vigil",
            description: "Stand under the unpolluted night sky. Watch the solar winds dance in green and violet ribbons of neon light.",
            cost: "Free",
            locationName: "Jökulsárlón Glacier Lagoon"
          }
        ]
      },
      {
        dayNumber: 3,
        theme: "Basalt architecture & Tectonic Rifts",
        activities: [
          {
            time: "Morning",
            title: "Thingvellir Tectonic Walk",
            description: "Walk inside the dramatic Almannagjá gorge, where the North American and Eurasian tectonic plates drift apart.",
            cost: "Free",
            locationName: "Thingvellir National Park"
          },
          {
            time: "Afternoon",
            title: "Gullfoss Hydro-pulse",
            description: "Witness the roaring triple-tiered waterfall plummeting into a deep black basalt canyon filled with rainbows.",
            cost: "Free",
            locationName: "Gullfoss Waterfall"
          },
          {
            time: "Evening",
            title: "Reykjavík Tech-Bar Crawl",
            description: "Celebrate your final night with fermented shark and local craft gin in the vibrant heart of the capital.",
            cost: "$80 USD",
            locationName: "Kaffibarinn"
          }
        ]
      }
    ],
    hotels: [
      {
        name: "Ion Adventure Glass Hotel",
        description: "An architectural marvel suspended over active lava fields, featuring floor-to-ceiling glass walls for aurora viewing.",
        pricePerNight: "$350 USD",
        rating: "4.9"
      },
      {
        name: "The Reykjavik EDITION",
        description: "Ultra-luxury modern hotel located in the old harbor, blending cozy nordic design with smart tech features.",
        pricePerNight: "$420 USD",
        rating: "4.8"
      }
    ],
    flightTips: "Book a low-altitude nocturnal flight window with clear-view composite wings to experience auroras right from your seat."
  },
  "himalayan-peaks": {
    destination: "Himalayan Peaks",
    country: "India",
    durationDays: 3,
    bestSeason: "Late Spring to Early Autumn (for clear roads and crystal lake reflections)",
    budgetLevel: "Moderate",
    description: "Experience the majesty of snow-capped peaks reflecting off ancient, high-altitude lakes in the wild Indian Himalayas.",
    estimatedTotalCost: "$650 - $1,100 USD",
    days: [
      {
        dayNumber: 1,
        theme: "Ascent to Spiti Valley & Acclimatization",
        activities: [
          {
            time: "Morning",
            title: "Magical Drive through Rohtang Pass",
            description: "Leave Manali early. Climb through dense pine forests into the dramatic snowy expanse of Rohtang Pass.",
            cost: "$80 USD",
            locationName: "Rohtang Pass Gateway"
          },
          {
            time: "Afternoon",
            title: "Lahaul Valley Ingress",
            description: "Cross into the arid Lahaul region. Savor steaming Thukpa soup at a local wayside cabin.",
            cost: "$15 USD",
            locationName: "Koksar Village"
          },
          {
            time: "Evening",
            title: "Kunzum Pass Ascent",
            description: "Arrive at Kunzum La (4,551m) and circumambulate the temple for safety before descending into Spiti.",
            cost: "Free",
            locationName: "Kunzum La Temple"
          }
        ]
      },
      {
        dayNumber: 2,
        theme: "Trekking to Chandra Taal Lake & Stargazing",
        activities: [
          {
            time: "Morning",
            title: "Crescent Lake Trail",
            description: "Embark on a scenic hike from the campsite to Chandra Taal. The lake changes colors under the morning sun.",
            cost: "Free",
            locationName: "Chandra Taal Perimeter"
          },
          {
            time: "Afternoon",
            title: "Yak Butter Tea with Locals",
            description: "Sit with Gaddi shepards. Taste traditional butter tea and listen to stories of mountain spirits.",
            cost: "$5 USD",
            locationName: "Shepard's Ridge"
          },
          {
            time: "Evening",
            title: "Himalayan Cosmic Nightwatch",
            description: "Sit by the reflecting lake. Look at the Milky Way galaxy glowing in high contrast through the thin mountain air.",
            cost: "Free",
            locationName: "Chandra Taal Campsite"
          }
        ]
      },
      {
        dayNumber: 3,
        theme: "Cliffside Monasteries & Traditional Heritage",
        activities: [
          {
            time: "Morning",
            title: "Key Monastery Castle Tour",
            description: "Visit the iconic cliffside monastery. Meet Buddhist monks and see historic scrolls and murals.",
            cost: "Free",
            locationName: "Key Gompa"
          },
          {
            time: "Afternoon",
            title: "Lunch in Kibber Village",
            description: "Dine on traditional Siddu bread with wild honey and local ghee in one of the highest inhabited villages.",
            cost: "$20 USD",
            locationName: "Kibber Village"
          },
          {
            time: "Evening",
            title: "Return to Manali Valley",
            description: "Drive back through the Atal Tunnel, descending from the cold dry heights back into the lush green valleys.",
            cost: "$40 USD",
            locationName: "Atal Tunnel Exit"
          }
        ]
      }
    ],
    hotels: [
      {
        name: "Banjara Camps Chandra Taal",
        description: "Luxury eco-tents located near the crescent lake, equipped with thermal heaters and fleece bedding.",
        pricePerNight: "$120 USD",
        rating: "4.8"
      },
      {
        name: "The Spiti Horizon Retreat",
        description: "Charming traditional mud-brick hotel in Kaza, featuring smart solar heating and panoramic valley views.",
        pricePerNight: "$85 USD",
        rating: "4.7"
      }
    ],
    flightTips: "Fly into Kullu-Manali Airport (Bhuntar) to save 12 hours of driving time from Delhi or Chandigarh."
  }
};
