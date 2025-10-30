import type { Bird } from "@shared/schema";
import blueGoldMacaw from '@assets/blue-gold-macaw.jpg_1761290156282.jpeg';
import greenWingedMacaw from '@assets/green-wing-macaw_1761290156281.png';
import harlequinMacaw from '@assets/harlequin-macaw_1761290156280.jpg';
import scarletMacaw from '@assets/WhatsApp Image 2025-10-24 at 15.11.30_1761298928539.jpeg';
import umbrellaCockatoo from '@assets/umbrella-cockatoo_1761290156275.jpeg';
import moluccanCockatoo from '@assets/moluccan-cockatoo_1761290156278.jpeg';
import africanGrey from '@assets/african-grey_1761290156279.jpg';
import amazonParrot from '@assets/amazon12_1761290156276.jpeg';
import whiteBelliedCaique from '@assets/generated_images/White-bellied_Caique_parrot_portrait_72edcfff.png';
import blackHeadedCaique from '@assets/generated_images/Black-headed_Caique_parrot_portrait_c6f1ed9f.png';
import blueEyedCockatoo from '@assets/blue-eyed-cockatoo_1761307694686.png';
import sulphurCrestedCockatoo from '@assets/generated_images/Sulphur-crested_Cockatoo_portrait_9b831e58.png';

export const birdsData: Bird[] = [
  {
    id: "1",
    name: "Blue-and-Gold Macaw",
    scientificName: "",
    slug: "blue-gold-macaw",
    image: blueGoldMacaw,
    size: "large",
    noiseLevel: "loud",
    traits: ["vibrant", "free-flying", "intelligent", "human-bonding"],
    lifespan: "60-70 years",
    origin: "South America (Brazil, Bolivia, Paraguay)",
    behavior: "Known for their vibrant spirit and affectionate nature, Blue & Gold Macaws are highly social parrots that thrive on interaction and mental stimulation. They are intelligent, playful, and form deep bonds with their families, making them wonderful lifelong companions.",
    diet: "A balanced diet supports their radiant colors and lively energy. They thrive on high-quality pellets, nuts, seeds, fresh fruits like mango and papaya, and a variety of vegetables. Fresh water should always be available.",
    humanCompatibility: "Strikingly beautiful, affectionate, and interactive, the Blue & Gold Macaw makes a wonderful companion for experienced bird owners. They need consistent interaction and engagement to thrive as part of your family.",
    priceMin: 185000,
    priceMax: 250000,
    lastUpdated: new Date().toISOString(),
    prosAsPet: [
      "Highly intelligent and trainable",
      "Dazzling golden-yellow chest and cobalt wings",
      "Can learn to mimic words and sounds",
      "Forms strong bonds with family members",
      "Long lifespan (60-70 years with proper care)"
    ],
    consAsPet: [
      "Loud vocalizations",
      "Requires very large cage or aviary space",
      "Needs significant daily interaction",
      "Can be destructive if bored",
      "Requires experienced owner"
    ],
    careChecklist: [
      "Provide spacious aviary at least 4-5 feet wide",
      "Fresh food and water daily",
      "Multiple hours of interaction and enrichment",
      "Regular toy rotation for mental stimulation",
      "Weekly cage deep cleaning",
      "Regular veterinary checkups",
      "Natural light and moderate temperatures"
    ]
  },
  {
    id: "2",
    name: "Green-winged Macaw",
    scientificName: "Ara chloropterus",
    slug: "green-winged-macaw",
    image: greenWingedMacaw,
    size: "large",
    noiseLevel: "loud",
    traits: ["vibrant", "free-flying", "intelligent", "human-bonding"],
    lifespan: "60-80 years",
    origin: "South America (Amazon Basin)",
    behavior: "Often celebrated as the 'Gentle Giant,' the Green Wing Macaw is admired for its calm, loving, and intelligent nature. Known as one of the most affectionate macaws, it bonds deeply with families, showing both loyalty and playfulness. These magnificent birds enjoy interaction and bonding with people of all ages.",
    diet: "They thrive on a diet of premium pellets, fresh fruits, leafy greens, wholesome vegetables, and nuts. Occasional treats like walnuts or pecans enrich their diet and provide essential variety. Fresh water should always be available.",
    humanCompatibility: "Elegant, affectionate, and full of personality, the Green Wing Macaw is a perfect choice for families seeking a majestic parrot with a gentle temperament. With consistent interaction, they reward you with loyalty and charm for decades.",
    priceMin: 400000,
    priceMax: 470000,
    lastUpdated: new Date().toISOString(),
    prosAsPet: [
      "Gentle and calm temperament despite large size",
      "Brilliant crimson plumage with green and blue wings",
      "Very loyal and affectionate with families",
      "Highly intelligent and trainable",
      "Exceptional longevity (60-80 years)"
    ],
    consAsPet: [
      "Loud vocalizations",
      "Requires expert-level care and commitment",
      "High initial and maintenance costs",
      "Needs extremely large living space",
      "Long lifespan requires generational planning"
    ],
    careChecklist: [
      "Aviary or cage at least 4-5 feet wide",
      "Daily fresh fruits, vegetables, and premium pellets",
      "Multiple hours of supervised interaction",
      "Sturdy perches, chew toys, and climbing ropes",
      "Free-flight time for exercise",
      "Regular veterinary care",
      "Natural light and moderate temperatures"
    ]
  },
  {
    id: "3",
    name: "Harlequin Macaw",
    scientificName: "Ara hybrid (Blue-and-Gold × Green-winged)",
    slug: "harlequin-macaw",
    image: harlequinMacaw,
    size: "large",
    noiseLevel: "loud",
    traits: ["vibrant", "free-flying", "intelligent", "human-bonding"],
    lifespan: "50-65 years",
    origin: "Captive bred hybrid",
    behavior: "The Harlequin Macaw is truly a living masterpiece, born from the majestic pairing of the Blue & Gold Macaw and the Green Wing Macaw. As a hybrid, it represents the best of both worlds — inheriting the affectionate, playful personality of the Blue & Gold, along with the calm, gentle nature of the Green Wing. Loved for their intelligence, charm, and dazzling looks, Harlequins are among the most captivating parrots a family can welcome.",
    diet: "Keep your Harlequin glowing with health by offering a wholesome blend of premium pellets, crunchy nuts, fresh fruits, and a variety of vegetables. Occasional treats like almonds and pecans make mealtimes extra enriching. Fresh, clean water should always be available.",
    humanCompatibility: "Breathtakingly colorful, intelligent, and affectionate, the Harlequin Macaw is the perfect combination of beauty and personality. With daily interaction, they provide years of laughter, companionship, and charm—making them an unforgettable feathered friend.",
    priceMin: 375000,
    priceMax: 450000,
    lastUpdated: new Date().toISOString(),
    prosAsPet: [
      "Hybrid vigor (often healthier and stronger)",
      "Breathtaking blend of golden, blue, red, and green plumage",
      "Playful and entertaining personality",
      "Intelligent and good talkers",
      "Each bird is completely unique in coloration"
    ],
    consAsPet: [
      "High initial cost",
      "Loud vocalizations",
      "Requires expert handling and experience",
      "Large space requirements",
      "Strong beak requires durable toys"
    ],
    careChecklist: [
      "Large aviary with climbing space",
      "Premium pelleted diet with fresh supplements",
      "Daily training and enrichment activities",
      "Variety of durable, chewable toys",
      "Regular exercise and free-flight time",
      "Routine veterinary checkups",
      "Socialization with multiple family members"
    ]
  },
  {
    id: "4",
    name: "Scarlet Macaw",
    scientificName: "",
    slug: "scarlet-macaw",
    image: scarletMacaw,
    size: "large",
    noiseLevel: "loud",
    traits: ["vibrant", "intelligent", "human-bonding"],
    lifespan: "60-80 years",
    origin: "Central and South America",
    behavior: "Known for their elegance and charm, Scarlet Macaws are intelligent and affectionate parrots. With dazzling scarlet-red feathers accented by vibrant blues and golden yellows, they are truly living works of art. They bond deeply with their families, offering warmth and joy. Playful and engaging, they brighten any room with their loyalty and entertainment.",
    diet: "A wholesome mix of fresh fruits, leafy greens, nuts, and premium pellets keeps their radiant colors glowing. Their nutritional needs are easy to meet, making daily care simple and rewarding. Fresh water should always be available.",
    humanCompatibility: "Choosing a Scarlet Macaw means welcoming pure beauty and joy into your life. Among them, 'Triple Band' Scarlet Macaws are the most prized, showcasing three golden-yellow wing bands. These rare birds symbolize prestige, making them living jewels and lifelong companions.",
    priceMin: 375000,
    priceMax: 450000,
    lastUpdated: new Date().toISOString(),
    prosAsPet: [
      "Breathtaking scarlet-red plumage with blue and yellow accents",
      "Highly intelligent and affectionate",
      "Forms deep bonds with family members",
      "Triple Band variants are highly prized",
      "Exceptional longevity (60-80 years)"
    ],
    consAsPet: [
      "Loud vocalizations",
      "Requires spacious aviary or cage",
      "Needs daily interaction and mental stimulation",
      "Strong beak requires durable toys",
      "High initial cost"
    ],
    careChecklist: [
      "Spacious cage or aviary with sturdy perches",
      "Premium pellets with fresh fruits and vegetables daily",
      "Multiple hours of interaction and enrichment",
      "Regular free-flight time for exercise",
      "Durable chewable toys for mental stimulation",
      "Regular veterinary checkups",
      "Natural light and moderate temperatures"
    ]
  },
  {
    id: "5",
    name: "Umbrella Cockatoo",
    scientificName: "Cacatua alba",
    slug: "umbrella-cockatoo",
    image: umbrellaCockatoo,
    size: "medium",
    noiseLevel: "loud",
    traits: ["talking", "intelligent", "human-bonding"],
    lifespan: "50-70 years",
    origin: "Indonesia (Moluccan Islands)",
    behavior: "Native to Indonesia, Umbrella Cockatoos are named for their large crests that fan open like an umbrella. With snowy white plumage and expressive personalities, they are affectionate parrots that form strong human bonds. Known as 'velcro birds' for their clingy affection, they are playful, intelligent, and thrive on attention.",
    diet: "A diet of high-quality pellets, seeds, nuts, fresh fruits, and vegetables is essential. Avoid fatty foods, avocado, and chocolate. Calcium supplements are especially helpful for females. Fresh water should always be available.",
    humanCompatibility: "These birds require constant companionship and are best suited for owners with flexible schedules who can spend hours daily with them. While they can be loud at times, their loyalty makes them rewarding companions.",
    priceMin: 185000,
    priceMax: 250000,
    lastUpdated: new Date().toISOString(),
    prosAsPet: [
      "Extremely affectionate and cuddly",
      "Beautiful snowy white plumage",
      "Impressive crest display",
      "Highly intelligent and trainable",
      "Forms deep bonds with owners"
    ],
    consAsPet: [
      "Prone to separation anxiety",
      "Very loud vocalizations",
      "Destructive behavior when bored",
      "Demands constant attention and companionship",
      "Produces feather dust"
    ],
    careChecklist: [
      "Spacious cage or aviary with strong bars",
      "Daily cuddle and play time (multiple hours)",
      "Chewable toys and climbing structures",
      "Warm, well-lit environment with family presence",
      "Consistent daily routine",
      "Regular bathing or misting",
      "Routine health checkups"
    ]
  },
  {
    id: "6",
    name: "Moluccan Cockatoo",
    scientificName: "Cacatua moluccensis",
    slug: "moluccan-cockatoo",
    image: moluccanCockatoo,
    size: "medium",
    noiseLevel: "loud",
    traits: ["talking", "vibrant", "intelligent", "human-bonding"],
    lifespan: "60-70 years",
    origin: "Indonesia (Seram Islands)",
    behavior: "Native to Indonesia's Seram Islands, Moluccan Cockatoos are famed for their peach-pink feathers and dramatic crests. They are affectionate, intelligent, and strikingly beautiful. Playful and loving, they can mimic human speech but also demand constant engagement and stimulation.",
    diet: "They thrive on high-quality pellets, nuts, seeds, and fresh fruits. Avoid avocado, onions, and chocolate. Nuts are best used as training rewards. Fresh water should always be available.",
    humanCompatibility: "Moluccans require constant companionship and are best for experienced owners with time to dedicate daily. With good care and enrichment, they make incredibly loving lifelong companions.",
    priceMin: 385000,
    priceMax: 470000,
    lastUpdated: new Date().toISOString(),
    prosAsPet: [
      "Incredibly loving and affectionate",
      "Beautiful peach-pink coloring with dramatic crest",
      "Exceptional longevity (60-70 years)",
      "Very intelligent and can mimic speech",
      "Forms deep emotional bonds"
    ],
    consAsPet: [
      "Very loud vocalizations",
      "Severe separation anxiety if left alone",
      "High maintenance and demanding",
      "Requires experienced handler",
      "Needs constant mental stimulation"
    ],
    careChecklist: [
      "Very large aviary with sturdy bars",
      "Multiple hours of daily companionship",
      "High-quality pellets with portion control",
      "Destructible toys for chewing instincts",
      "Consistent daily routine and engagement",
      "Regular veterinary checkups",
      "Mental enrichment and training"
    ]
  },
  {
    id: "7",
    name: "African Grey Parrot",
    scientificName: "",
    slug: "african-grey-parrot",
    image: africanGrey,
    size: "small",
    noiseLevel: "moderate",
    traits: ["talking", "intelligent", "human-bonding"],
    lifespan: "40-60 years",
    origin: "West and Central Africa",
    behavior: "Highly intelligent, excellent talker, needs mental stimulation. Considered one of the most intelligent bird species.",
    diet: "Pellets, fruits, leafy greens, occasional nuts. Calcium-rich diet important for health.",
    humanCompatibility: "Very bonded with routines; needs experienced owner who can provide consistency and mental enrichment.",
    priceMin: 65000,
    priceMax: 120000,
    lastUpdated: new Date().toISOString(),
    prosAsPet: [
      "Exceptional intelligence",
      "Outstanding talking ability",
      "Calmer than large parrots",
      "Can learn extensive vocabulary",
      "Forms deep emotional bonds"
    ],
    consAsPet: [
      "Prone to anxiety and plucking",
      "Needs strict routine",
      "Can be one-person birds",
      "Requires constant mental stimulation",
      "Sensitive to environmental changes"
    ],
    careChecklist: [
      "Medium to large cage",
      "Consistent daily schedule",
      "Puzzle toys and foraging activities",
      "Fresh vegetables and pellets daily",
      "Calcium supplements",
      "Regular training sessions",
      "Annual vet checkups with bloodwork"
    ]
  },
  {
    id: "8",
    name: "Blue-fronted Amazon",
    scientificName: "Amazona aestiva",
    slug: "blue-fronted-amazon",
    image: amazonParrot,
    size: "small",
    noiseLevel: "moderate",
    traits: ["vibrant", "talking", "intelligent", "human-bonding"],
    lifespan: "50-70 years",
    origin: "South America (Brazil, Argentina, Paraguay)",
    behavior: "Playful, vocal, good mimics. Known for their entertaining personalities and singing abilities.",
    diet: "Pellets, fruits, vegetables. They enjoy a varied diet and love foraging activities.",
    humanCompatibility: "Great companions if socialized; can be territorial during breeding seasons. Best with experienced owners.",
    priceMin: 60000,
    priceMax: 250000,
    lastUpdated: new Date().toISOString(),
    prosAsPet: [
      "Excellent talkers and singers",
      "Entertaining and playful",
      "Hardy and adaptable",
      "Good family birds when socialized",
      "Long-lived companions"
    ],
    consAsPet: [
      "Can be loud, especially morning/evening",
      "Territorial during breeding season",
      "May become aggressive if not trained",
      "Requires consistent boundaries",
      "Can be nippy"
    ],
    careChecklist: [
      "Spacious cage for activity",
      "Daily fresh food and water",
      "Socialization with all family members",
      "Training from young age",
      "Foraging toys and activities",
      "Regular wing and nail trimming",
      "Annual health examinations"
    ]
  },
  {
    id: "9",
    name: "White-bellied Caique",
    scientificName: "Pionites leucogaster",
    slug: "white-bellied-caique",
    image: whiteBelliedCaique,
    size: "small",
    noiseLevel: "moderate",
    traits: ["vibrant", "intelligent", "human-bonding"],
    lifespan: "25-40 years",
    origin: "South America (Brazil, Bolivia, Peru)",
    behavior: "Known as the 'clowns of the parrot world,' White-bellied Caiques are extremely energetic, playful, and mischievous. They are fearless, curious, and constantly active—hopping, climbing, and exploring everything. These entertaining parrots enjoy lying on their backs, 'wrestling' with toys, and surfing on towels. They are social and affectionate, bonding strongly with their owners and demanding daily interaction.",
    diet: "High-quality pellets form the base of their diet, supplemented with fresh vegetables daily like spinach, carrots, broccoli, peas, and kale. Fresh fruits in moderation (apples, berries, mango, grapes), small amounts of soaked seeds, and bird-safe branches for chewing. Fresh, clean water should always be available. Feed twice daily—morning and late afternoon.",
    humanCompatibility: "White-bellied Caiques are incredibly entertaining and affectionate companions that require significant time, energy, and commitment. Best for experienced owners who have 2+ hours daily for interaction and can provide consistent mental and physical stimulation. They can be nippy when over-excited and need proper training from a young age.",
    priceMin: 120000,
    priceMax: 180000,
    lastUpdated: new Date().toISOString(),
    prosAsPet: [
      "Extremely playful and entertaining",
      "Beautiful colorful plumage (white belly, orange head, green wings)",
      "Moderate noise level (quieter than macaws/cockatoos)",
      "Highly intelligent and can learn tricks",
      "Very active and fun to watch"
    ],
    consAsPet: [
      "Can bite when over-excited",
      "Requires constant stimulation to prevent boredom",
      "Very messy (shred toys, toss food)",
      "Not great talkers (limited speech ability)",
      "Can be territorial in the home"
    ],
    careChecklist: [
      "Spacious cage with horizontal space for climbing",
      "Minimum 2 hours daily out-of-cage time",
      "Plenty of destructible toys (rotate frequently)",
      "Fresh vegetables and pellets daily",
      "Daily bathing opportunities (they love water)",
      "Bird-proof environment (they're fearless explorers)",
      "Regular vet checkups"
    ]
  },
  {
    id: "10",
    name: "Black-headed Caique",
    scientificName: "Pionites melanocephalus",
    slug: "black-headed-caique",
    image: blackHeadedCaique,
    size: "small",
    noiseLevel: "moderate",
    traits: ["vibrant", "intelligent", "human-bonding"],
    lifespan: "20-40 years",
    origin: "South America (Northern Amazon Basin)",
    behavior: "Famous as the 'clown of the parrot world,' Black-headed Caiques are highly playful, energetic, and entertaining. They are constantly on the move—hopping, climbing, and performing acrobatic tricks. Known for their clownish behavior like 'surfing' (sliding on their back), hopping like kangaroos, and wrestling with toys. They are intelligent, curious, and form strong bonds with owners, though they can be nippy when testing boundaries.",
    diet: "Core diet should be high-quality vitamin and mineral-rich pellets. Supplement with fresh fruits (apples, pears, oranges, grapes, mango, banana), fresh vegetables (corn, carrots, sweet potato, broccoli, spinach, peas), and soaked or sprouted seeds. Feed twice daily—morning and late afternoon. They love fruit and are messy eaters, so regular cage cleaning is essential.",
    humanCompatibility: "Black-headed Caiques are delightful, high-energy parrots that reward committed owners with years of laughter, affection, and entertainment. Best for experienced bird owners who enjoy active, playful, interactive pets and have time for daily attention and enrichment. Not ideal for first-time owners due to their stubborn, strong-willed nature.",
    priceMin: 120000,
    priceMax: 180000,
    lastUpdated: new Date().toISOString(),
    prosAsPet: [
      "Extremely entertaining and acrobatic",
      "Striking appearance (black head, white belly, green wings, orange cheeks)",
      "Affectionate and forms strong bonds",
      "Intelligent and learns tricks easily",
      "Moderate noise level compared to larger parrots"
    ],
    consAsPet: [
      "Can be nippy and bite-prone",
      "Territorial and stubborn",
      "Requires firm, consistent training",
      "Limited talking ability",
      "High energy requires constant mental stimulation"
    ],
    careChecklist: [
      "Large cage with 3/4 inch bar spacing",
      "Multiple wooden perches for gnawing",
      "Daily enrichment with destructible toys",
      "Fresh pellets, fruits, and vegetables daily",
      "Regular toy rotation (they destroy them quickly)",
      "Worming every 6 months",
      "Annual avian veterinary checkups"
    ]
  },
  {
    id: "11",
    name: "Blue-eyed Cockatoo",
    scientificName: "Cacatua ophthalmica",
    slug: "blue-eyed-cockatoo",
    image: blueEyedCockatoo,
    size: "medium",
    noiseLevel: "moderate",
    traits: ["intelligent", "human-bonding"],
    lifespan: "40-50 years",
    origin: "Papua New Guinea (New Britain, New Ireland)",
    behavior: "Blue-eyed Cockatoos are gentle, intelligent, and affectionate parrots. They are one of the friendliest and calmest cockatoo species, bonding strongly with their families while displaying playful and curious personalities. They thrive on social interaction and enjoy performing tricks. Less noisy than other large cockatoos, they can mimic human speech in their own charming way.",
    diet: "Their diet should include 75-80% high-quality cockatoo pellets and 20-25% fresh fruits and vegetables. Recommended foods include oranges, apples, celery, cabbage, and carrots. Small quantities of nuts (walnuts, almonds) as treats. Calcium-rich foods are particularly important for their health. Fresh water should be changed daily.",
    humanCompatibility: "Blue-eyed Cockatoos are stunning, affectionate companions that form deep bonds with owners. They require several hours of daily interaction and are high maintenance. Best suited for experienced bird owners with significant time to dedicate, as neglect leads to feather plucking, screaming, and destructive behavior. A lifelong commitment spanning 40-50 years.",
    priceMin: 250000,
    priceMax: 350000,
    lastUpdated: new Date().toISOString(),
    prosAsPet: [
      "One of the calmest and friendliest cockatoo species",
      "Beautiful white plumage with distinctive blue eye rings",
      "Less noisy than other large cockatoos",
      "Highly intelligent and enjoys tricks",
      "Very affectionate and cuddly"
    ],
    consAsPet: [
      "High maintenance and demanding",
      "Requires several hours of daily interaction",
      "Expensive to purchase (rare species)",
      "Prone to feather plucking if neglected",
      "Not suitable for first-time bird owners"
    ],
    careChecklist: [
      "Very large cage or aviary (room to spread wings)",
      "Daily enrichment with toys and climbing structures",
      "High-quality pellets and fresh produce daily",
      "Regular bathing or misting for feather health",
      "Multiple hours of social interaction daily",
      "Annual avian veterinary checkups",
      "Adequate sunlight exposure"
    ]
  },
  {
    id: "12",
    name: "Sulphur-crested Cockatoo",
    scientificName: "Cacatua galerita",
    slug: "sulphur-crested-cockatoo",
    image: sulphurCrestedCockatoo,
    size: "large",
    noiseLevel: "loud",
    traits: ["vibrant", "intelligent", "human-bonding"],
    lifespan: "65-80 years",
    origin: "Australia, Papua New Guinea, Indonesia",
    behavior: "Sulphur-crested Cockatoos are highly social, playful, and intelligent parrots with iconic white plumage and vibrant yellow crests. They are cheeky, mischievous, and affectionate, forming deep bonds with their owners. Known for their loud vocalizations, they can mimic human speech and sounds. These intelligent birds have learning capacity comparable to a 1-2 year old human and require daily attention and mental stimulation.",
    diet: "In captivity, provide high-quality cockatoo-specific pellets as the base diet, supplemented with fresh vegetables (carrots, cabbage, corn, leafy greens), fresh fruits in moderation (apples, oranges, grapes), and small amounts of seeds and nuts. Occasional cooked foods like rice, corn, and chicken. Provide cuttlebone for beak maintenance and calcium. Avoid monotonous diets and create foraging opportunities.",
    humanCompatibility: "Sulphur-crested Cockatoos are stunning, intelligent companions for experienced bird owners prepared for a 65-80 year commitment. They require 3-4 hours minimum of daily out-of-cage time and social interaction. Very loud and not suitable for apartment living. Best for owners with time, patience, and ability to provide extensive daily care and mental enrichment.",
    priceMin: 150000,
    priceMax: 250000,
    lastUpdated: new Date().toISOString(),
    prosAsPet: [
      "Majestic appearance with iconic yellow crest",
      "Highly intelligent (comparable to toddler)",
      "Very affectionate and cuddly",
      "Can learn to mimic speech and sounds",
      "Exceptional longevity (65-80 years)"
    ],
    consAsPet: [
      "Very loud vocalizations (not suitable for apartments)",
      "Extremely demanding (requires 3-4+ hours daily)",
      "Prone to feather plucking from boredom or stress",
      "Can be destructive if not properly stimulated",
      "Multi-generational commitment (can outlive owners)"
    ],
    careChecklist: [
      "Very large cage allowing full wing spread",
      "Outdoor aviary recommended for fresh air and sunlight",
      "3-4 hours minimum daily out-of-cage time",
      "Foraging toys, puzzles, and chewing toys",
      "Regular bathing or misting",
      "High-quality pellets with fresh produce daily",
      "Annual veterinary checkups with avian specialist"
    ]
  }
];
