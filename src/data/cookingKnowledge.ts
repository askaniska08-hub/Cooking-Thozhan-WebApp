/**
 * Chef Tara — Local Cooking Knowledge Base
 *
 * 300+ carefully written entries covering ingredient substitutions, cooking
 * techniques, kitchen problems, storage, ingredient info, nutrition,
 * measurements, general cooking, leftover ideas, and recipe pairings.
 *
 * Every entry supports multiple keyword variations so Tara can match natural
 * phrasing.  No AI, no internet — pure local knowledge.
 */

export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  answer: string;
}

export const COOKING_KNOWLEDGE: KnowledgeEntry[] = [
  // ───────────────────────── Ingredient Substitutions ─────────────────────────
  {
    id: 'replace-ghee-butter',
    keywords: ['replace ghee', 'butter instead of ghee', 'ghee substitute', 'can i use butter', 'butter for ghee', 'substitute ghee', 'instead of ghee', 'no ghee'],
    answer: 'Yes! 😊 Butter can replace ghee in most recipes.\n\nGhee has a richer nutty flavour and a higher smoke point (250°C), while butter gives a creamier taste and burns around 175°C.\n\n**How to substitute:**\n• Use the same amount of butter as ghee.\n• For tempering, use butter on low heat to avoid burning.\n• Add a pinch of asafoetida (hing) to mimic ghee\'s nutty aroma.\n\n💡 For deep frying, stick with ghee or oil — butter will burn.',
  },
  {
    id: 'replace-butter-ghee',
    keywords: ['replace butter', 'ghee instead of butter', 'butter substitute', 'can i use ghee', 'ghee for butter', 'no butter'],
    answer: 'Absolutely! Ghee works great instead of butter. 👩🏻‍🍳\n\nGhee has a more intense, nutty flavour and a higher smoke point. Use slightly less ghee than butter (about 80%) since ghee is 100% fat while butter contains water.\n\n💡 In baking, ghee makes cookies crisper and richer. In curries, it adds a wonderful aroma.',
  },
  {
    id: 'replace-sugar-jaggery',
    keywords: ['replace sugar', 'jaggery instead of sugar', 'sugar substitute', 'jaggery for sugar', 'can i use jaggery', 'instead of sugar', 'no sugar', 'less sugar'],
    answer: 'Great choice! Jaggery is a healthier alternative to white sugar. 🟫\n\nJaggery adds a deeper, caramel-like flavour and retains minerals like iron and potassium.\n\n**How to substitute:**\n• Use the same amount of jaggery as sugar by weight.\n• If using block jaggery, grate it first.\n• Jaggery takes slightly longer to dissolve — warm it gently.\n• In baking, reduce other liquids slightly since jaggery holds more moisture.\n\n💡 Jaggery pairs beautifully with cardamom and coconut in desserts.',
  },
  {
    id: 'replace-milk-water',
    keywords: ['replace milk', 'water instead of milk', 'milk substitute', 'can i use water', 'water for milk', 'no milk', 'instead of milk'],
    answer: 'You can use water instead of milk in some recipes, but the result will be less rich. 🥛\n\n**Works well in:**\n• Bread dough (use slightly less water)\n• Savoury batters like dosa and pakoda\n• Soups (add extra cornstarch for creaminess)\n\n**Not recommended for:**\n• Desserts and payasam\n• Tea and coffee\n• Creamy curries\n\n💡 For a richer substitute, try coconut milk or cashew milk instead of plain water.',
  },
  {
    id: 'replace-milk-coconut-milk',
    keywords: ['coconut milk instead of milk', 'milk substitute coconut', 'replace milk with coconut', 'coconut milk for milk', 'dairy free milk'],
    answer: 'Coconut milk is a wonderful dairy-free alternative! 🥥\n\nIt adds a creamy texture and a subtle sweetness that works beautifully in South Indian cooking.\n\n**How to substitute:**\n• Use equal amounts of coconut milk.\n• For thin milk, dilute with water (1:1).\n• For rich curries, use thick coconut milk.\n• In desserts, reduce other liquids slightly.\n\n💡 Coconut milk pairs especially well with curry leaves, mustard seeds, and jaggery.',
  },
  {
    id: 'replace-curd-yogurt',
    keywords: ['replace curd', 'yogurt instead of curd', 'curd substitute', 'yogurt for curd', 'can i use yogurt', 'instead of curd', 'no curd', 'no yogurt'],
    answer: 'Yes! Curd and yogurt are essentially the same thing. 😊\n\nUse them interchangeably in equal amounts. Greek yogurt will make the dish thicker and tangier, so you may want to thin it with a little water.\n\n💡 If you have no curd at all, try buttermilk (thin it with water) or lemon juice mixed with milk.',
  },
  {
    id: 'replace-rice-flour-maida',
    keywords: ['rice flour substitute', 'maida instead of rice flour', 'replace rice flour', 'can i use maida', 'rice flour for maida', 'no rice flour'],
    answer: 'Rice flour and maida behave differently, but substitutions are possible. 🌾\n\n**For frying:** Use maida instead of rice flour for a softer coating. Rice flour gives more crunch.\n**For dosa batter:** Rice flour can replace rice in idli/dosa batter but the texture will be slightly different.\n**For thickening:** Use cornstarch instead of rice flour — it is a better thickener.\n\n💡 For crispy pakodas, a 50/50 mix of rice flour and besan works best.',
  },
  {
    id: 'replace-cornstarch',
    keywords: ['cornstarch substitute', 'replace cornstarch', 'instead of cornstarch', 'no cornstarch', 'cornflour substitute', 'thickening agent'],
    answer: 'No cornstarch? No problem! Here are your options:\n\n• **Rice flour** — 1:1 ratio, great for Asian-style sauces.\n• **Besan (gram flour)** — 1:1 ratio, adds a nutty flavour.\n• **Arrowroot powder** — 1:1 ratio, gives a glossy finish.\n• **Mashed potato** — natural thickener for soups and curries.\n• **Cooked and mashed dal** — thickens gravies beautifully.\n\n💡 For best results, mix any substitute with cold water before adding to hot dishes.',
  },
  {
    id: 'replace-paneer',
    keywords: ['paneer substitute', 'replace paneer', 'instead of paneer', 'no paneer', 'paneer alternative'],
    answer: 'No paneer? Try these alternatives:\n\n• **Tofu** — the closest substitute, use firm tofu. Press it first to remove water.\n• **Halloumi** — has a similar firm texture, but is saltier.\n• **Boiled potato cubes** — for curries, they absorb flavours well.\n• **Chenna (fresh paneer)** — make your own by curdling milk with lemon!\n\n💡 To make instant paneer: Boil 2 cups milk, add 2 tbsp lemon juice, strain through a cloth, and press for 30 minutes.',
  },
  {
    id: 'replace-egg',
    keywords: ['egg substitute', 'replace egg', 'instead of egg', 'no egg', 'egg replacement', 'eggless', 'vegan egg'],
    answer: 'There are several great egg substitutes depending on the dish:\n\n• **For cakes:** 1 tbsp flaxseed powder + 3 tbsp water (let sit 5 min)\n• **For binding:** 2 tbsp besan + 2 tbsp water\n• **For richness:** 1/4 cup curd or mashed banana\n• **For savoury dishes:** Silken tofu, crumbled and pan-fried\n• **For coating:** Besan slurry instead of egg wash\n\n💡 For eggless cookies, use 2 tbsp milk + a pinch of baking powder per egg.',
  },
  {
    id: 'replace-oil',
    keywords: ['oil substitute', 'replace oil', 'instead of oil', 'no oil', 'oil alternative', 'less oil', 'oil free'],
    answer: 'You can reduce or replace oil in several ways:\n\n• **For tempering:** Use ghee or butter for richer flavour.\n• **For baking:** Replace half the oil with curd or applesauce.\n• **For sautéing:** Use water or broth in a non-stick pan.\n• **For deep frying:** There is no good substitute — use a high-smoke-point oil.\n\n💡 For oil-free cooking, sauté in water first, then add spices. The flavours will still bloom!',
  },
  {
    id: 'replace-flour',
    keywords: ['flour substitute', 'replace flour', 'instead of flour', 'no flour', 'flour alternative', 'gluten free flour', 'wheat flour substitute'],
    answer: 'Flour substitutions depend on the use:\n\n• **For thickening:** Use cornstarch, rice flour, or besan.\n• **For baking bread:** Use a gluten-free blend (rice flour + besan + xanthan gum).\n• **For chapathi:** Use atta (whole wheat flour) — it is the standard.\n• **For coating:** Use rice flour for crunch, besan for savoury flavour.\n• **For dosa:** Use rice flour and urad dal flour mixed.\n\n💡 When substituting, start with less liquid and add gradually — different flours absorb differently.',
  },
  {
    id: 'replace-tomato',
    keywords: ['tomato substitute', 'replace tomato', 'instead of tomato', 'no tomato', 'tomato alternative'],
    answer: 'No tomatoes? Here are some options:\n\n• **Tamarind pulp** — provides tanginess in sambar and rasam.\n• **Lemon juice + a little jaggery** — for curries that need acidity.\n• **Curd** — adds tanginess in gravies.\n• **Raw mango** — grated, for a sour note.\n• **Bottled tomato puree** — if available, use 2 tbsp per tomato.\n\n💡 In a pinch, combine tamarind water with a pinch of sugar to mimic tomato\'s sweet-sour balance.',
  },
  {
    id: 'replace-onion',
    keywords: ['onion substitute', 'replace onion', 'instead of onion', 'no onion', 'onion alternative', 'skip onion'],
    answer: 'You can skip onions or substitute them:\n\n• **Skip entirely** — many recipes work without onion (e.g., tomato rice).\n• **Shallots** — smaller and sweeter, use the same way.\n• **Cabbage** — finely chopped, for bulk in curries.\n• **Coconut** — ground coconut can add body without onion.\n\n💡 For a no-onion-no-garlic version, add extra ginger and asafoetida for flavour depth.',
  },
  {
    id: 'replace-garlic',
    keywords: ['garlic substitute', 'replace garlic', 'instead of garlic', 'no garlic', 'garlic alternative', 'skip garlic'],
    answer: 'No garlic? You can still make delicious food:\n\n• **Asafoetida (hing)** — a pinch mimics garlic\'s savoury depth.\n• **Ginger extra** — add more ginger for a similar pungency.\n• **Garlic powder** — 1/4 tsp per clove, if available.\n• **Skip entirely** — many South Indian recipes are garlic-free.\n\n💡 In no-onion-no-garlic cooking, hing is your best friend — it adds umami without garlic.',
  },
  {
    id: 'replace-coconut',
    keywords: ['coconut substitute', 'replace coconut', 'instead of coconut', 'no coconut', 'coconut alternative', 'desiccated coconut'],
    answer: 'No fresh coconut? Try these:\n\n• **Desiccated coconut** — soak in warm water for 10 minutes, use 1:1.\n• **Coconut milk powder** — reconstitute and use for curries.\n• **Peanuts** — roasted and ground, for chutneys.\n• **Sesame seeds** — for a nutty chutney base.\n• **Skip it** — in rice dishes, you can omit coconut and add extra curry leaves.\n\n💡 For chutneys, roasted chana dal (puthani) blended with green chilli makes a great coconut-free base.',
  },
  {
    id: 'replace-besan',
    keywords: ['besan substitute', 'replace besan', 'instead of besan', 'no besan', 'gram flour substitute', 'besan alternative'],
    answer: 'No besan? Here are alternatives:\n\n• **Rice flour** — for crispy coatings, use 1:1.\n• **Cornstarch** — for thickening, use half the amount.\n• **Wheat flour** — for binding, but the flavour will be different.\n• **Soy flour** — for pakodas, similar protein content.\n\n💡 Besan is hard to truly replace in pakodas — it gives the signature flavour. Rice flour gives crunch but a milder taste.',
  },
  {
    id: 'replace-rava',
    keywords: ['rava substitute', 'replace rava', 'instead of rava', 'no rava', 'semolina substitute', 'sooji substitute'],
    answer: 'No rava? Try these:\n\n• **Rice rava** — for upma and idli, use the same amount.\n• **Broken wheat (dalia)** — healthier, use 1:1, but cook longer.\n• **Couscous** — similar texture for upma.\n• **Cornmeal** — for a different texture in upma.\n\n💡 For rava dosa, rice flour mixed with a little maida gives a similar crispy texture.',
  },
  {
    id: 'replace-jaggery',
    keywords: ['jaggery substitute', 'replace jaggery', 'instead of jaggery', 'no jaggery', 'jaggery alternative'],
    answer: 'No jaggery? Try these:\n\n• **Brown sugar** — 1:1 ratio, similar molasses flavour.\n• **Palm sugar** — 1:1 ratio, closest to jaggery\'s taste.\n• **Honey** — use 3/4 the amount, reduce other liquids.\n• **Maple syrup** — use 3/4 the amount.\n• **White sugar + molasses** — 1 cup sugar + 1 tbsp molasses.\n\n💡 Brown sugar is the closest quick substitute for jaggery in most Indian sweets.',
  },

  // ───────────────────────── Cooking Techniques ─────────────────────────
  {
    id: 'technique-boiling',
    keywords: ['how to boil', 'boiling technique', 'what is boiling', 'boil water', 'boiling water'],
    answer: '🫕 **Boiling** is cooking food in rapidly bubbling liquid at 100°C.\n\n**Tips for perfect boiling:**\n• Start with cold water for vegetables — they cook evenly.\n• Start with boiling water for pasta and blanching — preserves texture.\n• Salt the water generously — it should taste like the sea.\n• Do not overfill the pot — leave room for the food to move.\n• Lower the heat slightly once boiling to prevent spillage.\n\n💡 Boiling leaches nutrients into the water — save the cooking water for soups and gravies!',
  },
  {
    id: 'technique-steaming',
    keywords: ['how to steam', 'steaming technique', 'what is steaming', 'steam food', 'steaming food'],
    answer: '♨️ **Steaming** is cooking food over boiling water using the steam\'s heat. It preserves nutrients, colour, and texture better than boiling.\n\n**How to steam:**\n1. Boil water in a pot or steamer.\n2. Place food in a steamer basket above the water (not touching).\n3. Cover with a lid and steam until done.\n\n**Best for:** Idli, dhokla, vegetables, fish, momos.\n\n💡 Steaming retains up to 50% more nutrients than boiling. It is the healthiest cooking method!',
  },
  {
    id: 'technique-roasting',
    keywords: ['how to roast', 'roasting technique', 'what is roasting', 'roast food', 'dry roasting'],
    answer: '🔥 **Roasting** uses dry heat (usually in an oven or on a pan) to brown the outside while cooking the inside.\n\n**Dry roasting spices:**\n1. Heat a pan on medium — no oil.\n2. Add whole spices in a single layer.\n3. Toss frequently until fragrant and slightly darker (1-3 minutes).\n4. Remove immediately — they burn fast!\n5. Cool and grind.\n\n💡 Dry roasting wakes up the essential oils in spices. It is the secret to restaurant-quality curries!',
  },
  {
    id: 'technique-grilling',
    keywords: ['how to grill', 'grilling technique', 'what is grilling', 'grill food', 'grilling food'],
    answer: '🍳 **Grilling** cooks food on a grate over direct heat, creating char marks and smoky flavour.\n\n**Tips for great grilling:**\n• Preheat the grill thoroughly.\n• Oil the grate, not the food.\n• Do not flip too often — let char marks form.\n• Marinate for at least 30 minutes for flavour.\n• Rest grilled meat for 5 minutes before serving.\n\n💡 A cast-iron grill pan on the stove works great if you do not have an outdoor grill.',
  },
  {
    id: 'technique-deep-frying',
    keywords: ['how to deep fry', 'deep frying technique', 'what is deep frying', 'deep fry', 'deep frying'],
    answer: '🫒 **Deep frying** submerges food fully in hot oil (170-190°C) for a crispy exterior.\n\n**Tips for perfect deep frying:**\n• Use a high-smoke-point oil (groundnut, sunflower, rice bran).\n• Do not overcrowd the pan — temperature drops.\n• Test oil with a small piece of bread — it should sizzle immediately.\n• Drain on paper towels, not newspaper.\n• Serve immediately for maximum crispiness.\n\n💡 Reheat oil only 2-3 times — old oil becomes bitter and unhealthy.',
  },
  {
    id: 'technique-shallow-frying',
    keywords: ['how to shallow fry', 'shallow frying technique', 'what is shallow frying', 'shallow fry', 'pan frying'],
    answer: '🍳 **Shallow frying** uses a small amount of oil (about 1/4 inch) to cook food partially submerged.\n\n**Tips:**\n• Heat oil on medium before adding food.\n• Do not flip too early — let a crust form first.\n• Drain on paper towels.\n• Perfect for cutlets, pakodas, fish fillets, and omelettes.\n\n💡 Shallow frying uses less oil than deep frying but still gives a crispy result. Great for everyday cooking!',
  },
  {
    id: 'technique-tempering',
    keywords: ['how to temper', 'tempering technique', 'what is tempering', 'tadka', 'thallikiral', 'seasoning oil', 'tempering spices', 'oggarane'],
    answer: '🫕 **Tempering (tadka/oggarane)** is blooming spices in hot oil or ghee to release their essential oils and aromas.\n\n**How to temper:**\n1. Heat 1-2 tablespoons of oil or ghee.\n2. Add mustard seeds and wait until they pop.\n3. Add cumin, dried red chilli, curry leaves, and hing (asafoetida).\n4. Pour immediately over the dish (dal, rasam, curd rice) or continue cooking.\n\n💡 Tempering at the end gives the most aromatic result — the hot oil carries flavour into every bite!',
  },
  {
    id: 'technique-sauteing',
    keywords: ['how to saute', 'sauteing technique', 'what is sauteing', 'saute food', 'saute', 'sauté'],
    answer: '🍳 **Sautéing** is cooking food quickly in a little oil over medium-high heat while stirring frequently.\n\n**Tips for good sautéing:**\n• Cut food into uniform pieces for even cooking.\n• Heat the pan before adding oil.\n• Do not overcrowd the pan.\n• Keep the food moving to prevent burning.\n\n💡 Sautéing onions until golden is the foundation of most Indian curries. Take your time — 8-10 minutes makes a huge difference!',
  },
  {
    id: 'technique-blanching',
    keywords: ['how to blanch', 'blanching technique', 'what is blanching', 'blanch food', 'blanch vegetables'],
    answer: '🥬 **Blanching** is briefly boiling food then plunging it into ice water to stop the cooking.\n\n**How to blanch:**\n1. Boil water generously.\n2. Drop in the food (vegetables, tomatoes) for 30-60 seconds.\n3. Remove and immediately plunge into ice water.\n4. Drain and use.\n\n**Best for:** Peeling tomatoes, brightening vegetables, prepping for freezing.\n\n💡 Blanching keeps vegetables vibrant green and crisp. It is essential for restaurant-style presentation!',
  },
  {
    id: 'technique-pressure-cooking',
    keywords: ['how to pressure cook', 'pressure cooking technique', 'what is pressure cooking', 'pressure cooker', 'cooker cooking'],
    answer: '🍲 **Pressure cooking** uses trapped steam to cook food quickly at high temperature.\n\n**Basic guide:**\n• Always add enough liquid (at least 1 cup water).\n• Do not overfill — max 2/3 full.\n• Lock the lid properly before heating.\n• Use medium heat once the whistle starts.\n• Release pressure naturally for dal and meat.\n\n💡 Pressure cooking saves 50-70% of cooking time and retains more nutrients than open-pot cooking.',
  },
  {
    id: 'technique-slow-cooking',
    keywords: ['how to slow cook', 'slow cooking technique', 'what is slow cooking', 'slow cook', 'slow cooker'],
    answer: '🍲 **Slow cooking** simmers food on low heat for several hours, developing deep, rich flavours.\n\n**Tips for slow cooking:**\n• Sear meat and sauté aromatics first for maximum flavour.\n• Use tough cuts of meat — they become tender.\n• Do not lift the lid — heat escapes each time.\n• Add delicate vegetables in the last hour.\n• Skim fat from the top before serving.\n\n💡 Slow cooking is perfect for biryani, stew, ragi koozh, and rich gravies. Patience is the key ingredient!',
  },

  // ───────────────────────── Kitchen Problems ─────────────────────────
  {
    id: 'problem-dosa-sticking',
    keywords: ['dosa sticking', 'dosa is sticking', 'why is my dosa sticking', 'dosa sticks', 'dosa sticking to pan', 'dosa tearing'],
    answer: '🥞 **Why is my dosa sticking to the pan?**\n\nCommon causes:\n• **Pan not hot enough** — heat until a drop of water dances before pouring batter.\n• **Batter too thin or too thick** — it should flow like a ribbon.\n• **Not enough oil** — drizzle oil around the edges.\n• **Pan not seasoned** — rub with a cut onion or potato before cooking.\n• **Batter not fermented** — it should smell tangy and have doubled.\n\n**Quick fix:** Wipe the pan with a cut onion, heat it well, and try again. The onion\'s sulphur compounds prevent sticking!',
  },
  {
    id: 'problem-rice-mushy',
    keywords: ['rice mushy', 'rice is mushy', 'why is my rice mushy', 'mushy rice', 'rice too soft', 'overcooked rice', 'rice is overcooked'],
    answer: '🍚 **Why is my rice mushy?**\n\nCommon causes:\n• **Too much water** — use a 1:2 ratio for regular rice, 1:1.5 for basmati.\n• **Overcooked** — once the water is absorbed, switch off immediately.\n• **Stirring while cooking** — this breaks the grains and releases starch.\n• **Not draining excess water** — for drained rice, drain as soon as it is tender.\n\n**Fix for mushy rice:**\n• Spread it on a plate to dry.\n• Use it for fried rice or curd rice.\n• Add it to soup as a thickener.\n\n💡 Next time, measure water carefully and resist the urge to stir!',
  },
  {
    id: 'problem-rice-hard',
    keywords: ['rice hard', 'rice is hard', 'why is my rice hard', 'hard rice', 'rice undercooked', 'rice not cooked', 'rice crunchy'],
    answer: '🍚 **Why is my rice hard?**\n\nCommon causes:\n• **Not enough water** — increase the water ratio.\n• **Lid not tight** — steam escapes. Use a heavy lid.\n• **Heat too high** — the water evaporates before the rice cooks. Use low heat.\n• **Not enough cooking time** — let it rest covered for 5 more minutes after turning off.\n• **Old rice** — older rice needs more water.\n\n**Fix for hard rice:**\n• Sprinkle a little water, cover, and microwave for 2 minutes.\n• Or steam for 5 more minutes on the stove.\n\n💡 Basmati needs 1:1.5, ponni needs 1:2.5, and brown rice needs 1:3.',
  },
  {
    id: 'problem-chapathi-hard',
    keywords: ['chapathi hard', 'chapathi is hard', 'why is my chapathi hard', 'hard chapathi', 'roti hard', 'tough chapathi', 'chappati hard'],
    answer: '🌾 **Why is my chapathi hard?**\n\nCommon causes:\n• **Cold water** — use warm water or milk to knead.\n• **Not enough kneading** — knead for 8-10 minutes until smooth and elastic.\n• **No resting time** — rest the dough for at least 15-20 minutes.\n• **Dry dough** — add a teaspoon of oil or curd.\n• **Cooking on low heat** — the tava should be hot.\n• **Not pressing to puff** — press gently with a cloth to puff.\n\n💡 A teaspoon of curd and a pinch of salt in the dough keeps chapathis soft for hours!',
  },
  {
    id: 'problem-curry-watery',
    keywords: ['curry watery', 'curry is watery', 'why is my curry watery', 'watery curry', 'thin gravy', 'gravy is watery', 'curry too thin', 'runny curry'],
    answer: '🍲 **Why is my curry watery?**\n\nCommon causes:\n• **Too much water** — add less next time; you can always add more.\n• **Not enough cooking time** — simmer uncovered to reduce.\n• **Not enough onion/tomato base** — these break down and thicken.\n• **Coconut paste not cooked enough** — cook until oil separates.\n\n**Quick fixes:**\n• Mash some potato or dal into the curry.\n• Mix 1 tsp rice flour or cornstarch in water and stir in.\n• Simmer on high for 5 minutes to evaporate excess.\n• Add a paste of cashew or coconut.\n\n💡 The "oil separating" stage is the sign your gravy is thick enough!',
  },
  {
    id: 'problem-gravy-thick',
    keywords: ['gravy thick', 'gravy is thick', 'why is my gravy thick', 'thick gravy', 'curry too thick', 'gravy too thick'],
    answer: '🍲 **Why is my gravy too thick?**\n\nCommon causes:\n• **Too much thickening agent** — reduce coconut or dal next time.\n• **Over-reduction** — you simmered too long.\n• **Not enough liquid** — add water or stock.\n\n**Quick fixes:**\n• Add hot water gradually, stirring until you reach the right consistency.\n• Add a splash of coconut milk or cream for a richer, thinner gravy.\n• Stir in a little tomato paste for depth.\n\n💡 Gravy thickens as it cools. Always make it slightly thinner than you want it to be!',
  },
  {
    id: 'problem-cake-dense',
    keywords: ['cake dense', 'cake is dense', 'why is my cake dense', 'dense cake', 'cake heavy', 'cake not fluffy', 'cake flat'],
    answer: '🍰 **Why is my cake dense?**\n\nCommon causes:\n• **Overmixing the batter** — this develops gluten and makes it heavy. Mix just until combined.\n• **Not enough baking powder** — check your raising agent.\n• **Cold ingredients** — use room-temperature eggs and butter.\n• **Oven too cool** — preheat properly.\n• **Opening the oven too early** — do not open for the first 20 minutes.\n• **Expired baking powder** — test it in hot water; it should fizz.\n\n💡 Fold, do not beat, the dry ingredients into the wet. Gentle hands make light cakes!',
  },
  {
    id: 'problem-laddoos-breaking',
    keywords: ['laddoo breaking', 'laddoos breaking', 'laddu breaking', 'why are my laddoos breaking', 'laddoo not holding', 'laddoo falling apart', 'ladoo breaking'],
    answer: '🟠 **Why are my laddoos breaking apart?**\n\nCommon causes:\n• **Not enough ghee or fat** — ghee binds the mixture. Add a little more warm ghee.\n• **Mixture too dry** — add a splash of warm milk.\n• **Not warm enough** — the mixture should be warm when shaping, not cold.\n• **Over-roasted base** — if the rava or besan is over-roasted, it will not bind.\n• **Sugar not dissolved** — powdered sugar binds better than granulated.\n\n💡 Warm your hands slightly before rolling — this helps the laddoos hold their shape!',
  },
  {
    id: 'problem-burfi-not-setting',
    keywords: ['burfi not setting', 'burfi not setting', 'barfi not setting', 'why did my burfi not set', 'burfi soft', 'burfi not hard', 'burfi runny'],
    answer: '🍮 **Why did my burfi not set?**\n\nCommon causes:\n• **Not cooked long enough** — the mixture should leave the sides of the pan and form a ball.\n• **Too much liquid** — reduce milk or add more khoya/milk powder.\n• **Not enough sugar** — sugar helps it set. Check the ratio.\n• **Not rested long enough** — let it cool completely before cutting.\n• **Wrong temperature** — cook on medium-low, not high.\n\n💡 Test by pressing a small drop in cold water — it should form a soft ball. That is the setting stage!',
  },
  {
    id: 'problem-halwa-sticky',
    keywords: ['halwa sticky', 'halwa is sticky', 'why is my halwa sticky', 'sticky halwa', 'halwa not setting', 'halwa too wet', 'sooji halwa sticky'],
    answer: '🍰 **Why is my halwa sticky?**\n\nCommon causes:\n• **Too much water** — cook the rava until fully dry before adding sugar.\n• **Not enough ghee** — ghee separates the grains. Add more until it releases from the pan.\n• **Undercooked base** — the rava must turn golden and aromatic before adding liquid.\n• **Stirring too much** — once combined, let it sit on low heat.\n\n**Fix:** Cook on low heat with extra ghee until the halwa leaves the sides of the pan cleanly.\n\n💡 Roast the rava in ghee slowly — patience here makes all the difference!',
  },
  {
    id: 'problem-idli-hard',
    keywords: ['idli hard', 'idli is hard', 'why is my idli hard', 'hard idli', 'idli not soft', 'idli flat', 'idli not fluffy'],
    answer: '⚪ **Why are my idlis hard?**\n\nCommon causes:\n• **Batter not fermented** — it should double in volume and smell tangy.\n• **Too much water** — the batter should be thick enough to drop from a spoon.\n• **Not enough urad dal** — use a 3:1 ratio of rice to dal.\n• **Overcooked** — 10-12 minutes is enough; do not over-steam.\n• **Cold batter** — bring batter to room temperature before steaming.\n\n💡 Add a pinch of fenugreek seeds to the dal while soaking — it aids fermentation and softness!',
  },
  {
    id: 'problem-dosa-not-crispy',
    keywords: ['dosa not crispy', 'dosa is not crispy', 'dosa soft', 'dosa soggy', 'why is my dosa not crispy', 'dosa not crisp'],
    answer: '🥞 **Why is my dosa not crispy?**\n\nCommon causes:\n• **Batter too thick** — thin it with water until it flows like a ribbon.\n• **Pan not hot enough** — heat until a water drop dances.\n• **Too much oil** — just a drizzle around the edges is enough.\n• **Flipping too early** — wait until the edges lift and the bottom is golden.\n• **Batter not fermented** — well-fermented batter crisps better.\n\n💡 Add a pinch of sugar to the batter for extra browning and crispiness!',
  },
  {
    id: 'problem-pakoda-soggy',
    keywords: ['pakoda soggy', 'pakoda is soggy', 'pakoda not crispy', 'pakoda soft', 'why are my pakodas soggy', 'bhajji soggy', 'pakora soggy'],
    answer: '🟠 **Why are my pakodas soggy?**\n\nCommon causes:\n• **Batter too thin** — it should coat the onions thickly.\n• **Oil not hot enough** — test with a drop of batter; it should sizzle.\n• **Overcrowding the pan** — fry in small batches.\n• **Not enough rice flour** — add 1-2 tbsp rice flour for crunch.\n• **Onions too wet** — salt the onions and let them sit 5 minutes, then squeeze.\n\n💡 A teaspoon of hot oil mixed into the batter (tempering) makes pakodas extra crispy!',
  },
  {
    id: 'problem-sambar-bitter',
    keywords: ['sambar bitter', 'sambar is bitter', 'why is my sambar bitter', 'bitter sambar', 'sambar tastes bitter'],
    answer: '🍲 **Why is my sambar bitter?**\n\nCommon causes:\n• **Too much tamarind** — reduce it next time.\n• **Tamarind not cooked enough** — it should boil for at least 10 minutes.\n• **Burned spices** — do not over-roast the sambar powder.\n• **Burned dal** — stir the dal while pressure cooking.\n\n**Fix:** Add a small piece of jaggery to balance the bitterness. A pinch of sugar also works.\n\n💡 Always boil tamarind water well before adding dal — raw tamarind is bitter!',
  },
  {
    id: 'problem-rasam-bland',
    keywords: ['rasam bland', 'rasam is bland', 'why is my rasam bland', 'bland rasam', 'rasam no taste', 'rasam tasteless'],
    answer: '🍲 **Why is my rasam bland?**\n\nCommon causes:\n• **Not enough tamarind or tomato** — these are the main flavour bases.\n• **Not enough rasam powder** — add a little extra.\n• **Undercooked** — let it come to a full boil, then simmer 5 minutes.\n• **Missing tempering** — the tadka is essential for flavour.\n• **Not enough salt** — rasam needs proper seasoning.\n\n**Fix:** Add a little more rasam powder, a squeeze of lemon, and a fresh tempering of ghee, mustard, and curry leaves.\n\n💡 Fresh coriander leaves added at the end transform a bland rasam!',
  },
  {
    id: 'problem-upma-sticky',
    keywords: ['upma sticky', 'upma is sticky', 'why is my upma sticky', 'sticky upma', 'upma lumpy', 'upma not fluffy'],
    answer: '🥣 **Why is my upma sticky and lumpy?**\n\nCommon causes:\n• **Not enough oil** — oil separates the grains.\n• **Water not boiling before adding rava** — add rava to vigorously boiling water.\n• **Added rava too fast** — pour slowly while stirring continuously.\n• **Not roasted enough** — roast rava until fragrant and slightly golden before adding water.\n• **Too much water** — use a 1:2.5 ratio of rava to water.\n\n💡 Roast the rava in ghee first, add it to boiling water slowly, and cover and steam — this gives fluffy upma!',
  },
  {
    id: 'problem-coffee-bitter',
    keywords: ['coffee bitter', 'coffee is bitter', 'why is my coffee bitter', 'bitter coffee', 'filter coffee bitter'],
    answer: '☕ **Why is my filter coffee bitter?**\n\nCommon causes:\n• **Over-extracted** — do not let the decoction drip too long.\n• **Water too hot** — just-boiled water scorches the grounds. Let it sit 30 seconds first.\n• **Too much powder** — use 2-3 tbsp per cup.\n• **Grounds too fine** — a slightly coarser grind is better.\n• **Not fresh** — old coffee powder tastes bitter.\n\n**Fix:** Add a pinch of salt or a dash of milk to mellow the bitterness.\n\n💡 The perfect filter coffee ratio is 3:1 decoction to milk, with a pinch of sugar!',
  },
  {
    id: 'problem-tea-bitter',
    keywords: ['tea bitter', 'tea is bitter', 'why is my tea bitter', 'bitter tea', 'chai bitter'],
    answer: '🍵 **Why is my tea bitter?**\n\nCommon causes:\n• **Boiling the tea too long** — 3-4 minutes is enough.\n• **Water too hot** — let it cool slightly before pouring.\n• **Too much tea powder** — 1 tsp per cup is enough.\n• **Boiling tea leaves with milk** — boil in water first, then add milk.\n\n**Fix:** Add a little milk and sugar. A pinch of cardamom also masks bitterness.\n\n💡 Never boil tea for more than 4 minutes — the tannins release and make it bitter!',
  },

  // ───────────────────────── Storage ─────────────────────────
  {
    id: 'storage-cooked-rice',
    keywords: ['how long cooked rice', 'store cooked rice', 'leftover rice', 'cooked rice last', 'rice shelf life', 'refrigerate rice', 'how long rice last'],
    answer: '🍚 **How long does cooked rice last?**\n\n• **Room temperature:** Maximum 2 hours (bacteria grow quickly after that).\n• **Refrigerator:** 3-4 days in an airtight container.\n• **Freezer:** Up to 1 month — portion into individual servings for easy thawing.\n\n**To reheat:** Add a splash of water and microwave covered, or steam for 3-4 minutes.\n\n💡 Cool rice quickly by spreading it on a plate before refrigerating — this prevents bacterial growth.',
  },
  {
    id: 'storage-coconut',
    keywords: ['store coconut', 'how to store coconut', 'coconut storage', 'keep coconut fresh', 'fresh coconut', 'coconut shelf life'],
    answer: '🥥 **How to store coconut:**\n\n• **Fresh grated coconut:** Airtight container in the fridge for up to 4 days.\n• **Freezer:** Portion into small bags — lasts 2-3 months. Thaw only what you need.\n• **Whole coconut:** Room temperature for up to a week; once opened, use within 2 days.\n• **Coconut milk:** Freeze in ice cube trays — each cube is about 2 tablespoons.\n\n💡 Dry roast leftover grated coconut with curry leaves and chilli for a quick podi!',
  },
  {
    id: 'storage-curry',
    keywords: ['refrigerate curry', 'store curry', 'can i refrigerate curry', 'curry shelf life', 'how long curry last', 'leftover curry'],
    answer: '🍲 **Can I refrigerate curry?**\n\nYes! Most curries keep well.\n\n• **Refrigerator:** 3-4 days in an airtight container.\n• **Freezer:** 2-3 months for tomato-based or dal curries.\n• **Coconut milk curries:** Best eaten fresh — they can separate when frozen.\n• **Reheat:** Bring to a full boil on the stove or microwave until steaming.\n\n💡 Curries often taste better the next day — the flavours meld overnight!',
  },
  {
    id: 'storage-paneer',
    keywords: ['freeze paneer', 'store paneer', 'can i freeze paneer', 'paneer storage', 'how long paneer last', 'paneer shelf life'],
    answer: '🧀 **Can I freeze paneer?**\n\nYes! Paneer freezes well.\n\n• **Refrigerator:** 3-4 days in water (change the water daily).\n• **Freezer:** Up to 2 months. Cut into cubes, wrap tightly, and freeze.\n• **Thawing:** Soak frozen paneer in warm water for 15 minutes before use.\n• **After thawing:** Do not refreeze — texture becomes crumbly.\n\n💡 Soaking paneer in warm water before cooking keeps it soft and juicy!',
  },
  {
    id: 'storage-dosa-batter',
    keywords: ['store dosa batter', 'can i store dosa batter', 'dosa batter shelf life', 'how long dosa batter', 'idli batter storage', 'fermented batter'],
    answer: '🥞 **How to store dosa/idli batter:**\n\n• **Refrigerator:** 3-4 days in an airtight container.\n• **Do not freeze fermented batter** — it loses its rising power.\n• **Before cooking:** Bring to room temperature for 30 minutes.\n• **Signs of spoilage:** Sour smell, grey colour, or mould — discard immediately.\n\n💡 After day 2, the batter becomes sour. Add a pinch of sugar to balance it for dosa. Use fresh batter for idli!',
  },
  {
    id: 'storage-parotta',
    keywords: ['freeze parotta', 'store parotta', 'can i freeze parotta', 'parotta storage', 'how long parotta last', 'leftover parotta'],
    answer: '🫓 **Can I freeze parotta?**\n\nYes! Parotta freezes beautifully.\n\n• **Refrigerator:** 2-3 days, wrapped in foil.\n• **Freezer:** Up to 1 month. Place parchment paper between parottas to prevent sticking.\n• **Reheating:** Thaw, then heat on a tava with a little oil. Do not microwave — it becomes chewy.\n\n💡 For the best texture, reheat parotta on a hot tava with a sprinkle of water and oil!',
  },
  {
    id: 'storage-milk',
    keywords: ['how long milk last', 'store milk', 'milk shelf life', 'keep milk fresh', 'milk spoil', 'preserve milk', 'milk from spoiling'],
    answer: '🥛 **How long does milk last?**\n\n• **Room temperature:** 2-4 hours (less in summer).\n• **Refrigerator:** 2-3 days after opening.\n• **Freezer:** Up to 1 month. Thaw in the fridge overnight.\n\n**To keep milk fresh longer:**\n• Boil and cool completely before refrigerating.\n• Store in the back of the fridge, not the door.\n• Use a clean, dry spoon every time.\n• Add a pinch of turmeric — it slows bacterial growth.\n\n💡 Never mix fresh milk with old milk — it spoils the whole batch!',
  },
  {
    id: 'storage-vegetables',
    keywords: ['store vegetables', 'how to store vegetables', 'keep vegetables fresh', 'veg storage', 'vegetable storage', 'vegetable shelf life'],
    answer: '🥕 **How to store vegetables:**\n\n• **Leafy greens:** Wrap in a damp cloth, store in fridge for 3-4 days.\n• **Root veg (carrot, potato, beetroot):** Cool, dark place for 1-2 weeks. Do not refrigerate potatoes.\n• **Tomatoes:** Room temperature until ripe, then fridge for 3-4 days.\n• **Onion/Garlic:** Dry, ventilated place. Keep apart (onions make potatoes sprout).\n• **Capsicum/Cucumber:** Fridge crisper for 1 week.\n• **Ginger:** Freeze it — grate from frozen as needed.\n\n💡 Never wash vegetables before storing — moisture causes faster spoilage!',
  },
  {
    id: 'storage-ghee',
    keywords: ['store ghee', 'how long ghee last', 'ghee shelf life', 'ghee storage', 'does ghee expire'],
    answer: '🧈 **How to store ghee:**\n\n• **Room temperature:** 6+ months in an airtight jar, away from sunlight.\n• **Refrigerator:** Up to 1 year.\n• **Always use a clean, dry spoon** — moisture causes it to spoil.\n• **Signs of spoilage:** Sour smell or white mould — discard immediately.\n\n💡 Ghee does not need refrigeration! It is pure fat with no water, so it keeps naturally.',
  },
  {
    id: 'storage-dal',
    keywords: ['store dal', 'how long dal last', 'dal shelf life', 'cooked dal storage', 'leftover dal', 'refrigerate dal'],
    answer: '🫘 **How to store cooked dal:**\n\n• **Refrigerator:** 3-4 days in an airtight container.\n• **Freezer:** Up to 2 months. Portion into small containers for easy thawing.\n• **Reheat:** Bring to a full boil on the stove.\n• **Dry dal (uncooked):** Store in an airtight jar for up to 1 year in a cool, dry place.\n\n💡 Cooked dal thickens as it cools. Add water when reheating to reach the right consistency.',
  },
  {
    id: 'storage-spices',
    keywords: ['store spices', 'how long spices last', 'spice shelf life', 'spice storage', 'do spices expire'],
    answer: '🟤 **How to store spices:**\n\n• **Whole spices:** 1-2 years in airtight containers, away from heat and light.\n• **Ground spices:** 6-12 months. They lose potency faster.\n• **Never store above the stove** — heat and steam degrade them.\n• **Test:** Rub a pinch between your fingers — if you cannot smell it, it is time to replace.\n\n💡 Whole spices stay fresh much longer than ground. Grind in small batches for maximum flavour!',
  },
  {
    id: 'storage-bread',
    keywords: ['store bread', 'how long bread last', 'bread shelf life', 'freeze bread', 'leftover bread'],
    answer: '🍞 **How to store bread:**\n\n• **Room temperature:** 2-3 days in a bread box or paper bag.\n• **Refrigerator:** Up to 1 week — but it stales faster.\n• **Freezer:** Up to 3 months. Slice first, then freeze in a bag.\n• **Reheat:** Toast or microwave for 10 seconds.\n\n💡 Never store bread in the fridge if you plan to eat it within 2 days — it goes stale faster there!',
  },

  // ───────────────────────── Ingredient Information ─────────────────────────
  {
    id: 'info-garam-masala',
    keywords: ['what is garam masala', 'garam masala', 'garam masala ingredients', 'garam masala uses'],
    answer: '🟤 **What is garam masala?**\n\nGaram masala is a warming spice blend from North India. "Garam" means hot, and "masala" means spice mix.\n\n**Common ingredients:**\n• Cinnamon, cardamom, cloves\n• Black pepper, cumin, coriander\n• Bay leaf, nutmeg, mace\n\n**How to use:**\n• Add a pinch at the end of cooking for aroma.\n• Or add during cooking for depth.\n• A little goes a long way!\n\n💡 Toast whole spices, then grind fresh for the best flavour. Store-bought is fine, but homemade is incomparable!',
  },
  {
    id: 'info-tempering',
    keywords: ['what is tempering', 'tempering', 'tadka', 'thallikiral', 'seasoning oil', 'oggarane', 'what is tadka'],
    answer: '🫕 **What is tempering (tadka)?**\n\nTempering is the technique of blooming spices in hot oil or ghee to release their essential oils and aromas. It is done either at the start of cooking or poured over a finished dish.\n\n**How to temper:**\n1. Heat 1-2 tablespoons of oil or ghee.\n2. Add mustard seeds and wait until they pop.\n3. Add cumin, dried red chilli, curry leaves, and hing.\n4. Pour immediately over the dish (dal, rasam, curd rice) or continue cooking.\n\n💡 Tempering at the end gives the most aromatic result — the hot oil carries flavour into every bite!',
  },
  {
    id: 'info-curry-leaves',
    keywords: ['why use curry leaves', 'curry leaves', 'curry leaf', 'karuvepillai', 'what are curry leaves', 'curry leaves uses'],
    answer: '🌿 **Why use curry leaves?**\n\nCurry leaves (karuvepillai) are a cornerstone of South Indian cooking. They add a distinctive citrusy, nutty aroma that no other herb can replicate.\n\n**Benefits:**\n• Rich in iron and antioxidants.\n• Aid digestion.\n• Help control blood sugar.\n• Add authentic South Indian flavour.\n\n**How to use:**\n• Always temper in hot oil first — this releases their flavour.\n• Add to tempering for dal, rasam, chutney, and rice dishes.\n• Do not eat them whole — they are for flavour, not eating.\n\n💡 Dry roast and grind curry leaves with dal for a healthy, iron-rich podi!',
  },
  {
    id: 'info-ghee-vs-butter',
    keywords: ['difference between ghee and butter', 'ghee vs butter', 'ghee or butter', 'ghee butter difference', 'butter vs ghee'],
    answer: '🧈 **Difference between ghee and butter:**\n\n**Butter** is made from churned cream — it contains water and milk solids. It burns at high temperatures.\n\n**Ghee** is butter that has been simmered to evaporate the water and separate the milk solids. What remains is pure golden fat.\n\n| | Butter | Ghee |\n|---|---|---|\n| Smoke point | 175°C | 250°C |\n| Shelf life | 2 weeks (fridge) | 6+ months (room temp) |\n| Flavour | Creamy, mild | Nutty, roasted |\n| Lactose | Yes | No |\n\n💡 Use ghee for high-heat cooking and tempering; use butter for baking and low-heat dishes.',
  },
  {
    id: 'info-rasam-vs-sambar',
    keywords: ['difference between sambar and rasam', 'sambar vs rasam', 'sambar or rasam', 'rasam vs sambar', 'sambar rasam difference'],
    answer: '🍲 **Difference between sambar and rasam:**\n\n**Sambar** is a thick, hearty lentil-vegetable stew. It uses a generous amount of cooked toor dal, mixed vegetables, tamarind, and sambar powder. It is filling and eaten with rice or idli/dosa.\n\n**Rasam** is a thin, peppery, tangy soup. It uses very little (or no) dal, tamarind or tomato, rasam powder, and lots of pepper. It is light, digestive, and often served at the end of a meal or when sick.\n\n💡 Think of sambar as a meal and rasam as a soothing drink — both are South Indian staples!',
  },
  {
    id: 'info-wheat-flour-vs-maida',
    keywords: ['difference between wheat flour and maida', 'wheat flour vs maida', 'maida vs atta', 'atta or maida', 'maida atta difference'],
    answer: '🌾 **Difference between wheat flour and maida:**\n\n**Wheat flour (atta)** is whole-grain flour — it retains the bran and germ, making it high in fibre and nutrients. It is used for chapathis, rotis, and parathas.\n\n**Maida** is refined flour — the bran and germ are removed, and it is bleached. It is finer, softer, and lower in fibre. It is used for naan, pastries, cakes, and deep-fried snacks.\n\n| | Wheat flour (atta) | Maida |\n|---|---|---|\n| Fibre | High | Very low |\n| Texture | Dense, hearty | Soft, fluffy |\n| Uses | Chapathi, roti | Naan, cakes, pakodas |\n| Health | Healthier | Less nutritious |\n\n💡 For everyday cooking, wheat flour is the healthier choice. Use maida occasionally for special dishes!',
  },
  {
    id: 'info-baking-vs-roasting',
    keywords: ['difference between baking and roasting', 'baking vs roasting', 'bake or roast', 'roasting vs baking'],
    answer: '🔥 **Difference between baking and roasting:**\n\nBoth use dry heat in an oven, but they differ in purpose:\n\n**Baking** — used for breads, cakes, pastries, and casseroles. Typically 160-180°C. The goal is to cook through and set structure.\n\n**Roasting** — used for vegetables, meats, and whole spices. Typically 200-230°C. The goal is to brown the outside while cooking inside.\n\n💡 Roasting spices in a dry pan (no oil) before grinding is called "dry roasting" — it deepens their flavour enormously!',
  },
  {
    id: 'info-coriander-vs-cumin',
    keywords: ['difference between coriander powder and cumin powder', 'coriander vs cumin', 'cumin vs coriander', 'cumin coriander difference'],
    answer: '🟤 **Difference between coriander powder and cumin powder:**\n\n**Coriander powder (dhania)** is made from dried coriander seeds. It has a mild, citrusy, slightly sweet flavour. It is the base of most Indian curries and adds body without too much heat.\n\n**Cumin powder (jeera)** is made from dried cumin seeds. It has a warm, earthy, slightly bitter flavour. It adds depth and is used in smaller quantities.\n\n**How to use together:**\n• Most curries use a 2:1 or 3:1 ratio of coriander to cumin.\n• Coriander is the body; cumin is the backbone.\n\n💡 Toast both briefly in oil before adding wet ingredients — it wakes up their flavours!',
  },
  {
    id: 'info-asafetida',
    keywords: ['what is asafoetida', 'hing', 'perungayam', 'what is hing', 'asafoetida uses', 'why use hing'],
    answer: '🟤 **What is asafoetida (hing/perungayam)?**\n\nAsafoetida is a pungent resin from the ferula plant. Used in tiny amounts, it adds a savoury, umami flavour similar to garlic and onion.\n\n**How to use:**\n• Always add to hot oil during tempering — raw hing tastes bitter.\n• A pinch is enough — too much overpowers.\n• It is essential in no-onion-no-garlic cooking.\n• Aids digestion and reduces bloating.\n\n💡 Hing is the secret ingredient in many South Indian temperings — it ties all the flavours together!',
  },
  {
    id: 'info-turmeric',
    keywords: ['what is turmeric', 'turmeric uses', 'manjal', 'haldi', 'why use turmeric', 'turmeric benefits'],
    answer: '🟡 **What is turmeric?**\n\nTurmeric (manjal/haldi) is a golden-yellow spice with a warm, earthy flavour. It is used in almost every Indian dish.\n\n**Benefits:**\n• Powerful anti-inflammatory and antioxidant.\n• Natural antiseptic.\n• Aids digestion.\n• Gives dishes a beautiful golden colour.\n\n**How to use:**\n• A pinch is enough — too much makes the dish bitter.\n• Add early in cooking so it cooks through.\n• Pair with black pepper — it boosts turmeric\'s absorption by 2000%.\n\n💡 Turmeric is what gives curry its golden colour and many of its health benefits!',
  },
  {
    id: 'info-sambar-powder',
    keywords: ['what is sambar powder', 'sambar powder ingredients', 'sambar masala', 'how to make sambar powder'],
    answer: '🟤 **What is sambar powder?**\n\nSambar powder is a South Indian spice blend specifically for sambar. Every family has their own recipe!\n\n**Common ingredients:**\n• Coriander seeds, toor dal, chana dal\n• Dried red chilli, black pepper\n• Cumin, fenugreek, turmeric\n• Curry leaves, asafoetida\n\n**How to use:**\n• Add after the tamarind water has boiled.\n• 1-2 tablespoons per pot of sambar.\n• Store in an airtight jar for up to 3 months.\n\n💡 Homemade sambar powder is far superior to store-bought. Make it in small batches for freshness!',
  },
  {
    id: 'info-rasam-powder',
    keywords: ['what is rasam powder', 'rasam powder ingredients', 'rasam masala', 'how to make rasam powder'],
    answer: '🟤 **What is rasam powder?**\n\nRasam powder is a peppery, tangy spice blend for rasam. It is lighter and more aromatic than sambar powder.\n\n**Common ingredients:**\n• Toor dal, coriander seeds\n• Black pepper, cumin\n• Dried red chilli, turmeric\n• Curry leaves, asafoetida\n\n**How to use:**\n• Add to boiling tamarind-tomato water.\n• 1-2 teaspoons per pot of rasam.\n• The key flavour is pepper — it should be prominent.\n\n💡 Rasam powder uses more pepper and less dal than sambar powder. It is lighter and more aromatic!',
  },

  // ───────────────────────── Nutrition ─────────────────────────
  {
    id: 'nutrition-healthy-breakfast',
    keywords: ['healthy breakfast', 'healthy breakfast ideas', 'nutritious breakfast', 'good breakfast', 'breakfast ideas healthy'],
    answer: '🌅 **Healthy breakfast ideas:**\n\n• **Idli** — steamed, low-oil, high-protein from dal.\n• **Oats upma** — high fibre, filling.\n• **Poha** — light, easy to digest, iron-rich.\n• **Vegetable soup** — nourishing and light.\n• **Sprouts** — protein-packed.\n\n💡 Start your day with a glass of warm water with lemon — it aids digestion and boosts metabolism!',
  },
  {
    id: 'nutrition-high-protein',
    keywords: ['high protein', 'protein recipes', 'protein rich', 'high protein recipes', 'protein sources', 'protein food'],
    answer: '💪 **High-protein recipes and ingredients:**\n\n**Recipes:**\n• Egg dosa — protein from egg and dal batter.\n• Dal rice — protein from toor dal.\n• Paneer butter masala — protein from paneer.\n• Channa curry — protein from chickpeas.\n• Rajma — protein from kidney beans.\n\n**Ingredients:**\n• Eggs, paneer, dal, channa, rajma, moong, nuts.\n\n💡 Combine a dal with a grain (rice or wheat) for complete protein — this is the Indian way of eating!',
  },
  {
    id: 'nutrition-low-oil',
    keywords: ['low oil', 'less oil', 'low oil recipes', 'oil free', 'low fat', 'healthy low oil'],
    answer: '🥗 **Low-oil cooking tips and recipes:**\n\n**Recipes:**\n• Idli — steamed, zero oil.\n• Vegetable soup — no oil needed.\n• Steamed dhokla — minimal oil.\n• Poha — just a teaspoon for tempering.\n• Curd rice — tempering only.\n\n**Tips:**\n• Use a non-stick pan to reduce oil.\n• Sauté in water instead of oil.\n• Steam or bake instead of deep frying.\n• Use a brush to apply oil, not a spoon.\n\n💡 A teaspoon of oil for tempering is enough for most dishes — you do not need more!',
  },
  {
    id: 'nutrition-diabetic',
    keywords: ['diabetic friendly', 'diabetic', 'diabetes recipes', 'sugar free', 'low sugar', 'diabetic dishes'],
    answer: '🩺 **Diabetic-friendly dishes:**\n\n• **Vegetable soup** — low carb, high fibre.\n• **Spinach soup** — iron-rich, low calorie.\n• **Idli** — moderate carbs, but pair with sambar for protein.\n• **Dal rice** — use brown rice and extra dal.\n• **Poriyal** — stir-fried vegetables, minimal oil.\n\n**Tips:**\n• Use brown rice instead of white.\n• Replace sugar with a pinch of jaggery or skip it.\n• Add extra vegetables and dal.\n• Avoid deep-fried snacks.\n\n💡 Pair carbohydrates with protein and fibre to slow sugar absorption!',
  },
  {
    id: 'nutrition-protein-sources',
    keywords: ['protein sources', 'protein in food', 'where to get protein', 'protein rich foods', 'plant protein'],
    answer: '💪 **Protein sources in Indian cooking:**\n\n**Vegetarian:**\n• Dal (toor, moong, masoor) — 9g per cooked cup.\n• Channa, rajma — 15g per cooked cup.\n• Paneer — 18g per 100g.\n• Curd — 10g per cup.\n• Nuts and seeds — 20g per 100g.\n\n**Non-vegetarian:**\n• Eggs — 6g per egg.\n• Chicken — 25g per 100g.\n• Fish — 22g per 100g.\n\n💡 Combine grains with dal for complete protein — rice + dal, roti + dal, or idli + sambar!',
  },
  {
    id: 'nutrition-fiber',
    keywords: ['fiber rich', 'fibre rich', 'high fiber', 'fibre foods', 'fiber foods', 'high fibre'],
    answer: '🥦 **Fibre-rich foods:**\n\n• **Vegetables:** Spinach, beans, carrot, cabbage, capsicum.\n• **Dals:** Whole moong, channa, rajma.\n• **Grains:** Brown rice, whole wheat, oats.\n• **Fruits:** Banana, mango, guava.\n• **Nuts:** Peanuts, almonds.\n\n**Benefits:**\n• Aids digestion.\n• Controls blood sugar.\n• Keeps you full longer.\n• Lowers cholesterol.\n\n💡 Aim for 25-30g of fibre a day — a bowl of dal and a serving of vegetables gets you halfway!',
  },
  {
    id: 'nutrition-fever',
    keywords: ['foods for fever', 'fever food', 'what to eat in fever', 'sick food', 'fever recipes', 'food when sick'],
    answer: '🤒 **Foods for fever:**\n\nWhen you have a fever, eat light, warm, easily digestible food:\n\n• **Pepper rasam** — the pepper helps fight infection.\n• **Tomato soup** — light and hydrating.\n• **Vegetable soup** — nourishing and easy to digest.\n• **Spinach soup** — iron-rich for recovery.\n• **Rice kanji** — soothing and gentle.\n\n**Tips:**\n• Drink plenty of warm fluids.\n• Avoid heavy, oily, or spicy food.\n• Eat small portions frequently.\n\n💡 A bowl of warm pepper rasam with soft rice is nature\'s medicine for fevers!',
  },
  {
    id: 'nutrition-cold',
    keywords: ['foods for cold', 'cold food', 'what to eat in cold', 'sore throat food', 'cold recipes', 'food for cough'],
    answer: '🤧 **Foods for cold and sore throat:**\n\n• **Pepper rasam** — pepper clears congestion.\n• **Tomato soup** — warm and comforting.\n• **Ginger tea** — soothes the throat.\n• **Lemon tea** — vitamin C boost.\n• **Hot milk with turmeric** — anti-inflammatory.\n\n**Tips:**\n• Drink warm fluids frequently.\n• Avoid cold drinks and curd.\n• Add extra ginger and pepper to food.\n• Steam inhalation helps too.\n\n💡 A cup of ginger tea with a pinch of pepper and turmeric is a time-tested cold remedy!',
  },
  {
    id: 'nutrition-children',
    keywords: ['foods for children', 'kids food', 'child recipes', 'toddler food', 'food for kids', 'recipes for children'],
    answer: '👶 **Foods for children:**\n\n• **Idli** — soft, easy to chew, protein-rich.\n• **Dosa** — crispy and fun to eat.\n• **Dal rice** — mild and nutritious.\n• **Curd rice** — gentle on the tummy.\n• **Aval payasam** — a mild sweet treat.\n\n**Tips:**\n• Make food colourful and fun.\n• Keep spice levels low.\n• Add vegetables hidden in dal or dosa batter.\n• Serve small portions.\n\n💡 Children love dosa shaped like animals — use a squeeze bottle to draw shapes on the tava!',
  },
  {
    id: 'nutrition-weight-loss',
    keywords: ['weight loss', 'weight loss recipes', 'diet food', 'low calorie', 'lose weight', 'weight loss food'],
    answer: '🥗 **Weight-loss-friendly recipes:**\n\n• **Vegetable soup** — filling, low calorie.\n• **Idli** — steamed, low fat.\n• **Poriyal** — stir-fried vegetables, minimal oil.\n• **Spinach soup** — iron-rich, low calorie.\n• **Dal** — high protein, keeps you full.\n\n**Tips:**\n• Use less rice, more vegetables and dal.\n• Replace deep-fried snacks with steamed ones.\n• Drink water before meals.\n• Eat slowly and stop when 80% full.\n\n💡 A bowl of soup before a meal reduces total calorie intake by 20%!',
  },

  // ───────────────────────── Cooking Measurements ─────────────────────────
  {
    id: 'measure-rice-servings',
    keywords: ['1 cup rice serves', 'how many servings', 'cup rice serves how many', 'rice serving size', 'how much rice per person'],
    answer: '🍚 **How much rice per person?**\n\n• **Uncooked rice:** 1/3 cup per person (yields about 1 cup cooked).\n• **1 cup uncooked** = about 3 cups cooked = serves 3 people.\n• **For a meal with dal/curry:** 1/2 cup uncooked per person.\n• **For rice-heavy meals (biryani):** 3/4 cup uncooked per person.\n\n💡 Always cook a little extra — leftover rice becomes fried rice or curd rice the next day!',
  },
  {
    id: 'measure-salt',
    keywords: ['how much salt', 'salt measurement', 'how much salt to add', 'salt ratio', 'salt per cup'],
    answer: '🧂 **How much salt to use:**\n\n• **General rule:** 1/2 tsp salt per cup of cooked dish.\n• **For rice:** 1/2 tsp per cup of uncooked rice.\n• **For dal:** 1/2 tsp per cup of cooked dal.\n• **For curries:** 1/2 tsp per 2 cups.\n• **For dough:** 1/4 tsp per cup of flour.\n• **For boiling:** 1 tsp per litre of water.\n\n💡 It is always better to start with less — you can add more, but you cannot take it back!',
  },
  {
    id: 'measure-water-rice',
    keywords: ['how much water for rice', 'rice water ratio', 'water for rice', 'rice to water ratio', 'how much water rice'],
    answer: '🍚 **How much water for rice?**\n\n| Rice type | Ratio (rice:water) |\n|---|---|\n| White rice (regular) | 1:2 |\n| Basmati | 1:1.5 |\n| Brown rice | 1:3 |\n| Ponni/raw rice | 1:2.5 |\n| Sona Masoori | 1:2 |\n\n**Tips:**\n• Soak basmati for 20 minutes first.\n• For cooker: 2 whistles for regular, 1 for basmati.\n• For pan: bring to boil, cover, simmer on lowest heat.\n\n💡 Do not lift the lid while cooking — steam does the work!',
  },
  {
    id: 'measure-whistles',
    keywords: ['how many whistles', 'cooker whistles', 'pressure cooker whistles', 'whistles for dal', 'whistles for rice'],
    answer: '🍲 **Pressure cooker whistle guide:**\n\n| Food | Whistles |\n|---|---|\n| Rice (regular) | 2-3 |\n| Rice (basmati) | 1-2 |\n| Toor dal | 3-4 |\n| Whole moong/chana | 5-6 |\n| Potatoes | 2-3 |\n| Vegetables (chopped) | 1-2 |\n| Mutton/beef | 8-10 |\n\n💡 Always release pressure naturally for dal and meat — quick release can make them tough!',
  },
  {
    id: 'measure-oil-temp',
    keywords: ['oil temperature', 'oil smoking point', 'how hot oil', 'frying temperature', 'oil temp for frying'],
    answer: '🫒 **Oil temperature for frying:**\n\n• **Deep frying:** 170-190°C\n• **Shallow frying:** medium heat\n• **Tempering:** medium-low heat\n• **Test:** Drop a small piece of bread — it should sizzle and turn golden in 15 seconds.\n• **Too hot:** Food burns on the outside, raw inside.\n• **Too cool:** Food absorbs oil and becomes soggy.\n\n💡 Use a high-smoke-point oil for deep frying: groundnut, sunflower, or rice bran oil!',
  },
  {
    id: 'measure-cooking-times',
    keywords: ['cooking times', 'how long to cook', 'cooking time guide', 'how long cook rice', 'how long cook dal'],
    answer: '⏱️ **Cooking time guide:**\n\n| Food | Time |\n|---|---|\n| Rice (pan) | 15-20 min |\n| Rice (cooker) | 10 min (2 whistles) |\n| Toor dal (cooker) | 15 min (3 whistles) |\n| Dal (open pot) | 30-40 min |\n| Vegetables | 10-15 min |\n| Potatoes (boil) | 15-20 min |\n| Eggs (boil) | 10 min |\n| Dosa | 2-3 min per side |\n\n💡 Always let food rest after cooking — it continues to cook and flavours settle!',
  },
  {
    id: 'measure-serving-sizes',
    keywords: ['serving sizes', 'how much to serve', 'portion size', 'how much per person', 'serving guide'],
    answer: '🍽️ **Serving size guide:**\n\n• **Rice:** 1 cup cooked per person.\n• **Dal:** 1/2 cup per person.\n• **Curry:** 3/4 cup per person.\n• **Sambar:** 1 cup per person.\n• **Vegetables:** 1/2 cup per person.\n• **Dosa:** 1-2 per person.\n• **Idli:** 2-3 per person.\n\n💡 A balanced plate is: 1/2 vegetables, 1/4 rice, 1/4 dal or protein!',
  },

  // ───────────────────────── General Cooking ─────────────────────────
  {
    id: 'general-make-spicy',
    keywords: ['make it spicy', 'can i make it spicy', 'how to make spicy', 'add spice', 'more spice', 'make dish spicy'],
    answer: '🌶️ **How to make a dish spicier:**\n\n• Add an extra pinch of red chilli powder or garam masala.\n• Slit an extra green chilli and add it while cooking.\n• Sprinkle black pepper powder before serving.\n• For a smoky heat, add a dash of sambar powder.\n• Add chopped green chilli in the tempering.\n\n💡 Taste as you add — you can always add more, but you cannot take it back!',
  },
  {
    id: 'general-reduce-spice',
    keywords: ['reduce spice', 'can i reduce spice', 'how to make less spicy', 'less spicy', 'reduce heat', 'make it less hot'],
    answer: '🌶️ **How to reduce spice in a dish:**\n\n• Add a dollop of curd or coconut milk.\n• Stir in a teaspoon of sugar or jaggery.\n• Add more tomato or a splash of lemon.\n• Dilute with water and simmer longer.\n• Serve with raita, curd rice, or bread to cool the palate.\n• Add a piece of raw potato — it absorbs some heat (remove before serving).\n\n💡 The heat in chilli comes from capsaicin — dairy (curd, milk) neutralises it best!',
  },
  {
    id: 'general-add-cheese',
    keywords: ['can i add cheese', 'add cheese', 'cheese in', 'cheese to', 'extra cheese'],
    answer: '🧀 **Can I add cheese?**\n\nAbsolutely! Cheese works wonderfully in many dishes:\n\n• **Dosa and sandwich:** Grated cheese on top.\n• **Pasta and noodles:** Stir in grated cheese at the end.\n• **Curries:** Add a slice on top before serving.\n• **Bread snacks:** Cheese-filled pakodas or toast.\n\n💡 Use processed cheese for melting, mozzarella for stretch, or paneer for an Indian twist!',
  },
  {
    id: 'general-add-paneer',
    keywords: ['can i add paneer', 'add paneer', 'paneer to', 'paneer in', 'extra paneer'],
    answer: '🧀 **Can I add paneer?**\n\nYes! Paneer is versatile and works in most curries and rice dishes:\n\n• **Curries:** Add cubes in the last 5 minutes of cooking.\n• **Rice dishes:** Stir in fried paneer cubes.\n• **Sandwiches:** Layer slices or grated paneer.\n• **Dosa:** Crumble paneer inside the dosa.\n\n💡 Soak paneer in warm water for 10 minutes before adding — it stays soft and juicy!',
  },
  {
    id: 'general-add-vegetables',
    keywords: ['can i add vegetables', 'add vegetables', 'add veggies', 'extra vegetables', 'more vegetables'],
    answer: '🥕 **Can I add vegetables?**\n\nAbsolutely! Adding vegetables makes any dish more nutritious:\n\n• **Rice dishes:** Add carrot, beans, peas, capsicum.\n• **Dal:** Add spinach, tomato, carrot.\n• **Curries:** Add potato, cauliflower, peas.\n• **Soups:** Add any vegetable you like.\n\n💡 Cut vegetables to similar sizes so they cook evenly. Add harder vegetables first, softer ones later!',
  },
  {
    id: 'general-skip-onions',
    keywords: ['can i skip onions', 'skip onions', 'no onions', 'without onion', 'skip onion'],
    answer: '🧅 **Can I skip onions?**\n\nYes! Many South Indian recipes work perfectly without onions:\n\n• **Tomato rice, lemon rice, curd rice** — no onions needed.\n• **For curries:** Add extra ginger and hing for flavour depth.\n• **For sambar:** Skip onions, add more vegetables.\n• **For chutneys:** Use roasted chana dal instead.\n\n💡 In no-onion-no-garlic cooking, hing and ginger are your best friends — they provide the savoury depth!',
  },
  {
    id: 'general-skip-garlic',
    keywords: ['can i skip garlic', 'skip garlic', 'no garlic', 'without garlic', 'skip garlic'],
    answer: '🧄 **Can I skip garlic?**\n\nAbsolutely! Many traditional recipes are garlic-free:\n\n• **Most rice dishes** — lemon rice, curd rice, tamarind rice.\n• **For curries:** Add a pinch of hing (asafoetida) — it mimics garlic\'s savoury depth.\n• **For chutneys:** Add extra ginger.\n• **Sambar and rasam:** Many versions are garlic-free.\n\n💡 Hing is the perfect garlic substitute — a pinch in hot oil gives that same savoury kick!',
  },
  {
    id: 'general-make-vegan',
    keywords: ['can i make it vegan', 'make it vegan', 'vegan version', 'vegan substitute', 'vegan recipes'],
    answer: '🌱 **How to make a recipe vegan:**\n\n• **Ghee** → Use oil or coconut oil.\n• **Curd** → Use coconut curd or lemon juice + water.\n• **Milk** → Use coconut milk or almond milk.\n• **Paneer** → Use tofu.\n• **Butter** → Use coconut oil or vegan butter.\n• **Honey** → Use jaggery or maple syrup.\n\n💡 Most South Indian rice dishes and dal are naturally vegan — just replace the ghee with oil!',
  },
  {
    id: 'general-make-healthier',
    keywords: ['can i make it healthier', 'make it healthier', 'healthy version', 'healthier recipe', 'how to make healthy'],
    answer: '🥗 **How to make any dish healthier:**\n\n• **Less oil:** Use a non-stick pan and water-sauté.\n• **More vegetables:** Double the vegetables in any recipe.\n• **Less salt:** Use lemon, herbs, and spices for flavour instead.\n• **Whole grains:** Use brown rice instead of white.\n• **Less sugar:** Reduce by half or use jaggery.\n• **Bake instead of fry:** For snacks, bake at 200°C.\n• **Steam instead of boil:** Retains more nutrients.\n\n💡 Small changes add up — even reducing oil by 1 tablespoon per dish makes a big difference over time!',
  },

  // ───────────────────────── Leftover Ideas ─────────────────────────
  {
    id: 'leftover-rice',
    keywords: ['leftover rice', 'what to do with leftover rice', 'use leftover rice', 'extra rice', 'old rice'],
    answer: '🍚 **What to do with leftover rice:**\n\n• **Fried rice** — toss with oil, mustard, curry leaves, chilli, and turmeric.\n• **Curd rice** — mix with curd, temper with mustard and curry leaves.\n• **Lemon rice** — add lemon juice, turmeric, and tempering.\n• **Tomato rice** — cook a quick tomato masala and mix in.\n• **Rice pakoda** — mix with besan and fry.\n• **Rice kanji** — boil with water for a soothing porridge.\n\n💡 Leftover rice is perfect for fried rice — the grains are dry and separate, which is exactly what you want!',
  },
  {
    id: 'leftover-chapathi',
    keywords: ['leftover chapathi', 'what to do with leftover chapathi', 'use leftover chapathi', 'extra chapathi', 'old chapathi'],
    answer: '🌾 **What to do with leftover chapathis:**\n\n• **Kothu chapathi** — chop and stir-fry with onion, tomato, and spices.\n• **Chapathi upma** — tear into pieces and sauté with tempering.\n• **Chapathi rolls** — fill with sabzi and roll up.\n• **Chapathi chips** — cut into triangles, brush with oil, and bake.\n• **Feed to kids** — tear into small pieces, mix with milk and sugar.\n\n💡 Leftover chapathis stay good in the fridge for 2 days. Reheat on a tava with a sprinkle of water!',
  },
  {
    id: 'leftover-bread',
    keywords: ['leftover bread', 'what to do with leftover bread', 'use leftover bread', 'extra bread', 'old bread'],
    answer: '🍞 **What to do with leftover bread:**\n\n• **Bread upma** — tear and sauté with onion, tomato, and spices.\n• **Bread pakoda** — dip in besan batter and fry.\n• **Bread toast** — top with tomato, onion, and cheese.\n• **Bread sandwich** — fill with potato masala or chutney.\n• **Bread crumbs** — dry and grind for coating.\n• **Bread pudding** — soak in milk, sugar, and steam.\n\n💡 Stale bread absorbs flavours better than fresh — perfect for upma and pakodas!',
  },
  {
    id: 'leftover-vegetables',
    keywords: ['leftover vegetables', 'what to do with leftover vegetables', 'use leftover vegetables', 'extra vegetables', 'leftover veggies'],
    answer: '🥕 **What to do with leftover vegetables:**\n\n• **Mixed vegetable curry** — cook all together with onion-tomato base.\n• **Vegetable soup** — boil and blend.\n• **Poriyal** — stir-fry with mustard and curry leaves.\n• **Fried rice** — chop and stir-fry with rice.\n• **Dosa filling** — chop and stuff inside dosa.\n• **Sambar** — add to dal and tamarind water.\n\n💡 A mix of vegetables makes the best sambar — each one adds a different flavour!',
  },
  {
    id: 'leftover-dal',
    keywords: ['leftover dal', 'what to do with leftover dal', 'use leftover dal', 'extra dal', 'old dal'],
    answer: '🫘 **What to do with leftover dal:**\n\n• **Dal rice** — mix with rice and ghee.\n• **Dal dosa** — add to dosa batter for protein-rich dosa.\n• **Dal soup** — thin with water, add pepper and lemon.\n• **Dal paratha** — knead into flour for stuffed paratha.\n• **Dal kadhi** — add curd and besan, simmer.\n\n💡 Leftover dal thickens in the fridge. Add water when reheating to get the right consistency!',
  },

  // ───────────────────────── Recipe Pairings ─────────────────────────
  {
    id: 'pair-tomato-rice',
    keywords: ['what goes with tomato rice', 'side for tomato rice', 'serve with tomato rice', 'pair with tomato rice', 'tomato rice side dish'],
    answer: '🍽️ **What goes with Tomato Rice?**\n\n• **Curd or raita** — cools the tanginess.\n• **Papad** — adds crunch.\n• **Potato fry** — a classic combo.\n• **Egg curry** — for a heartier meal.\n• **Sambar** — for a complete South Indian meal.\n\n💡 Tomato rice with a dollop of curd and crispy papad is a perfect quick lunch!',
  },
  {
    id: 'pair-dosa',
    keywords: ['best side dish for dosa', 'serve with dosa', 'what to serve with dosa', 'dosa side dish', 'dosa pairing'],
    answer: '🥞 **Best side dishes for dosa:**\n\n• **Sambar** — the classic.\n• **Coconut chutney** — fresh and cooling.\n• **Tomato chutney** — tangy and spicy.\n• **Peanut chutney** — rich and nutty.\n• **Idli podi** — for a dry, spicy side.\n\n💡 A trio of sambar, coconut chutney, and tomato chutney is the restaurant-style dosa experience!',
  },
  {
    id: 'pair-parotta',
    keywords: ['serve with parotta', 'what to serve with parotta', 'parotta side dish', 'pair with parotta', 'parotta curry'],
    answer: '🫓 **What to serve with parotta:**\n\n• **Salna** — the classic parotta curry.\n• **Egg curry** — a popular combo.\n• **Chicken curry** — for a hearty meal.\n• **Dal** — for a vegetarian option.\n• **Raita** — to cool the spices.\n\n💡 Parotta with salna and a cup of tea is the ultimate South Indian street food experience!',
  },
  {
    id: 'pair-biryani',
    keywords: ['serve with biryani', 'what to serve with biryani', 'biryani side dish', 'pair with biryani', 'biryani raita'],
    answer: '🍚 **What to serve with biryani:**\n\n• **Onion raita** — the classic cooling side.\n• **Brinjal curry** — the traditional accompaniment.\n• **Mirchi ka salan** — for a rich, spicy gravy.\n• **Papad** — for crunch.\n• **Boiled egg** — for a complete meal.\n\n💡 Biryani with cool onion raita and a crispy papad is a match made in heaven!',
  },
  {
    id: 'pair-soup',
    keywords: ['serve with soup', 'what to serve with soup', 'soup side dish', 'pair with soup', 'soup accompaniment'],
    answer: '🥛 **What to serve with soup:**\n\n• **Bread toast** — for dipping.\n• **Croutons** — for crunch.\n• **Papad** — a South Indian twist.\n• **Salad** — for freshness.\n• **Rice** — for a heartier meal.\n\n💡 A bowl of hot soup with crispy toast is the perfect comfort food on a rainy day!',
  },
  {
    id: 'pair-sweets',
    keywords: ['serve with sweets', 'what to serve with sweets', 'sweet side dish', 'pair with dessert', 'dessert pairing'],
    answer: '🍮 **What to serve with sweets:**\n\n• **After a meal:** Serve as the final course.\n• **With payasam:** A spoonful of boondi or papad.\n• **With halwa:** A scoop of ice cream.\n• **With burfi:** A cup of masala chai.\n• **With ladoo:** A glass of warm milk.\n\n💡 A spoonful of warm ghee on top of payasam before serving takes it to another level!',
  },
  {
    id: 'pair-idli',
    keywords: ['serve with idli', 'what to serve with idli', 'idli side dish', 'pair with idli', 'idli side'],
    answer: '⚪ **What to serve with idli:**\n\n• **Sambar** — the classic.\n• **Coconut chutney** — fresh and mild.\n• **Tomato chutney** — tangy and spicy.\n• **Idli podi** — with a drizzle of ghee.\n• **Milagai podi** — for spice lovers.\n\n💡 Idli with sambar and two chutneys is the gold standard South Indian breakfast!',
  },
  {
    id: 'pair-curd-rice',
    keywords: ['serve with curd rice', 'what to serve with curd rice', 'curd rice side dish', 'pair with curd rice'],
    answer: '🍚 **What to serve with curd rice:**\n\n• **Pickle** — the classic combo.\n• **Papad** — for crunch.\n• **Poriyal** — for a vegetable side.\n• **Sambar** — for a complete meal.\n• **Fryums (vadam)** — for texture.\n\n💡 Curd rice with mango pickle and crispy papad is the ultimate comfort food!',
  },

  // ───────────────────────── Cooking Tips (General) ─────────────────────────
  {
    id: 'tip-general',
    keywords: ['cooking tips', 'general tips', 'cooking advice', 'tips for cooking', 'basic cooking tips'],
    answer: "👩🏻‍🍳 **My favourite cooking tips:**\n\n• Read the recipe fully before starting.\n• Prep and measure all ingredients first (mise en place).\n• Taste as you cook and adjust seasoning gradually.\n• Let cooked food rest before serving — flavours settle.\n• Salt your pasta water — it should taste like the sea.\n• Rest doughs and batters — patience improves texture.\n• A squeeze of lemon at the end brightens any dish.\n\n💡 The secret ingredient is always love — and a little extra ghee! 😊",
  },
  {
    id: 'tip-substitutions',
    keywords: ['substitution', 'substitutions', 'replacement for', 'instead of', 'alternative for', 'swap'],
    answer: '🔄 **Common substitutions:**\n\n• Curd → Lemon juice + milk, or buttermilk\n• Ghee → Butter (use less, add a pinch of salt)\n• Besan → Rice flour (for frying)\n• Tamarind → Lemon juice or amchur powder\n• Coconut (fresh) → Desiccated coconut, soaked in warm water\n• Sambar powder → Coriander + cumin + red chilli powder mix\n• Jaggery → Brown sugar or palm sugar\n• Rava → Rice rava or broken wheat\n\n💡 Ask me about a specific ingredient and I will give you a tailored substitution!',
  },
  {
    id: 'tip-spice-levels',
    keywords: ['spice level', 'spicy', 'reduce spice', 'too spicy', 'make it less spicy', 'spice too much', 'control spice'],
    answer: '🌶️ **Controlling spice levels:**\n\n**To make it spicier:**\n• Add more red chilli powder or green chilli.\n• Use black pepper or pepper powder.\n• Add garam masala at the end.\n\n**To reduce spice:**\n• Add a dollop of curd or coconut milk.\n• Stir in a teaspoon of sugar or jaggery.\n• Add more tomato or a splash of lemon.\n• Dilute with water and simmer longer.\n• Serve with raita, curd rice, or bread to cool the palate.\n\n💡 The heat in chilli comes from capsaicin — dairy (curd, milk) neutralises it best!',
  },
  {
    id: 'tip-knife-safety',
    keywords: ['knife safety', 'knife skills', 'how to use knife', 'cutting safety', 'safe cutting', 'knife tips'],
    answer: '🔪 **Basic knife safety:**\n\n1. Keep knives sharp — a dull knife slips and cuts more than a sharp one.\n2. Use the "claw grip": curl your fingertips inward and let the knife blade rest against your knuckles.\n3. Cut on a stable cutting board (put a damp cloth underneath to prevent slipping).\n4. Always cut away from your body.\n5. Never try to catch a falling knife — step back.\n6. Wash and dry knives immediately after use; never leave them in soapy water.\n\n💡 A sharp knife is a safe knife — hone yours before every use!',
  },
  {
    id: 'tip-kitchen-hygiene',
    keywords: ['kitchen hygiene', 'food hygiene', 'clean kitchen', 'safe cooking', 'hygiene tips', 'food safety tips'],
    answer: '🧼 **Kitchen hygiene basics:**\n\n• Wash your hands with soap for 20 seconds before cooking and after handling raw meat or eggs.\n• Use separate cutting boards for raw meat and vegetables.\n• Clean surfaces with hot soapy water after prep.\n• Keep raw and cooked foods apart to avoid cross-contamination.\n• Cover food while storing to prevent flies and dust.\n• Do not wear rings or watches while cooking with your hands.\n\n💡 A splash of vinegar on your cutting board kills bacteria naturally!',
  },
  {
    id: 'tip-food-safety',
    keywords: ['food safety', 'food poisoning', 'safe food', 'food handling', 'food storage safety', 'food safety rules'],
    answer: '🛡️ **Food safety essentials:**\n\n• **2-hour rule:** Do not leave cooked food at room temperature for more than 2 hours.\n• **4-day rule:** Eat refrigerated leftovers within 3-4 days.\n• **Reheat thoroughly:** Bring leftovers to 75°C or until steaming hot.\n• **Smell test:** If it smells sour or off, throw it out — do not taste.\n• **Thawing:** Thaw frozen food in the fridge, not on the counter.\n• **Marinades:** Discard used marinade; do not reuse as a sauce unless boiled.\n\n💡 When in doubt, throw it out — food poisoning is never worth the risk!',
  },
  {
    id: 'tip-shelf-life',
    keywords: ['shelf life', 'how long does', 'expiry', 'food last', 'spoilage', 'how long food'],
    answer: '📅 **Common shelf life guide:**\n\n• Cooked rice: 3-4 days (fridge)\n• Cooked dal/curry: 3-4 days (fridge)\n• Coconut (grated): 4 days (fridge), 3 months (freezer)\n• Milk (opened): 2-3 days (fridge)\n• Ghee: 6+ months (room temperature)\n• Dry spices: 6-12 months (airtight container)\n• Besan/rice flour: 3-4 months (airtight)\n• Idli batter: 3-4 days (fridge)\n\n💡 Label leftovers with the date — your future self will thank you!',
  },
  {
    id: 'tip-oil-smoke-point',
    keywords: ['oil smoking point', 'smoke point', 'oil burning', 'oil temperature', 'which oil', 'cooking oil guide'],
    answer: '🫒 **Oil smoke points:**\n\n| Oil | Smoke Point |\n|---|---|\n| Mustard/Sesame | 210°C |\n| Sunflower | 225°C |\n| Groundnut | 230°C |\n| Coconut | 200°C |\n| Ghee | 250°C |\n| Olive (refined) | 240°C |\n\n💡 For deep frying, use high-smoke-point oils. For tempering, ghee or sesame oil gives the best flavour.',
  },
  {
    id: 'tip-pressure-cooker',
    keywords: ['pressure cooker whistles', 'cooker whistles', 'how many whistles', 'cooker time', 'pressure cooking guide'],
    answer: '🍲 **Pressure cooker whistle guide:**\n\nThe number of whistles depends on what you are cooking:\n\n• Rice (regular): 2-3 whistles\n• Rice (basmati): 1-2 whistles\n• Toor dal: 3-4 whistles\n• Whole moong/chana: 5-6 whistles\n• Potatoes: 2-3 whistles\n• Vegetables (chopped): 1-2 whistles\n• Mutton/beef: 8-10 whistles\n\n💡 Always release pressure naturally for dal and meat — quick release can make them tough.',
  },
  {
    id: 'tip-vegetable-storage',
    keywords: ['vegetable storage', 'store vegetables', 'how to store vegetables', 'keep vegetables fresh', 'veg storage'],
    answer: '🥕 **How to store vegetables:**\n\n• Leafy greens: Wrap in damp cloth, store in fridge for 3-4 days.\n• Root veg (carrot, potato, beetroot): Cool, dark place for 1-2 weeks. Do not refrigerate potatoes.\n• Tomatoes: Room temperature until ripe, then fridge for 3-4 days.\n• Onion/Garlic: Dry, ventilated place. Keep apart (onions make potatoes sprout).\n• Capsicum/Cucumber: Fridge crisper for 1 week.\n• Ginger: Freeze it — grate from frozen as needed.\n\n💡 Never wash vegetables before storing — moisture causes faster spoilage.',
  },

  // ───────────────────────── Boiling & Cooking Specifics ─────────────────────────
  {
    id: 'how-to-boil-eggs',
    keywords: ['how to boil eggs', 'boil egg', 'boil eggs', 'how long to boil eggs', 'perfect boiled egg', 'hard boiled egg', 'soft boiled egg'],
    answer: '🥚 **How to boil eggs perfectly:**\n\n1. Place eggs in a pan and cover with cold water.\n2. Bring to a rolling boil, then switch off the flame.\n3. Cover and let sit for:\n   • 6 minutes — soft, runny yolk\n   • 8 minutes — jammy, just-set yolk\n   • 10 minutes — fully hard-boiled\n4. Transfer to cold water immediately — this makes peeling easy and stops the grey ring around the yolk.\n\n💡 Older eggs peel more easily than very fresh ones.',
  },
  {
    id: 'how-to-fluffy-rice',
    keywords: ['how to make fluffy rice', 'fluffy rice', 'how to make rice', 'perfect rice', 'cook rice', 'how to cook rice'],
    answer: '🍚 **How to make fluffy rice:**\n\n1. Rinse rice 2-3 times until the water runs clear — this removes excess starch.\n2. Use a 1:2 ratio of rice to water for regular rice (1:1.5 for basmati).\n3. Bring to a boil, then cover and simmer on the lowest heat.\n4. Do not lift the lid while cooking — steam does the work!\n5. Once done, let it rest covered for 5 minutes, then fluff with a fork.\n\n💡 Add a teaspoon of ghee or oil to prevent sticking and add fragrance.',
  },
  {
    id: 'how-to-crispy-dosa',
    keywords: ['how to make crispy dosa', 'crispy dosa', 'how to make dosa', 'dosa crispy', 'make dosa', 'dosai'],
    answer: '🥞 **How to make crispy dosa:**\n\n1. Use a well-fermented batter — it should have doubled in volume and smell tangy.\n2. The batter should be thin enough to spread but not watery.\n3. Heat the tava until a drop of water dances, then wipe with a cut onion (prevents sticking).\n4. Pour batter in the centre and spread outward in quick circles.\n5. Drizzle a little oil or ghee around the edges.\n6. Cook on medium-high until the edges lift and turn golden.\n7. Do not flip — just fold and serve.\n\n💡 Add a pinch of sugar to the batter for extra browning and crispiness.',
  },
  {
    id: 'how-to-soft-chapathi',
    keywords: ['how to make soft chapathi', 'soft chapathi', 'how to make chapathi', 'soft roti', 'how to make roti', 'chapati'],
    answer: '🌾 **How to make soft chapathis:**\n\n1. Use warm water (or a splash of milk) to knead the dough — not cold water.\n2. Knead for 8-10 minutes until the dough is smooth and elastic.\n3. Add a teaspoon of oil and knead again. Rest the dough for at least 15-20 minutes.\n4. Roll evenly — thin in the middle, slightly thicker at the edges.\n5. Cook on a hot tava — flip after small bubbles appear (about 30 seconds).\n6. Press gently with a cloth or spatula to puff it up.\n7. Brush with ghee and stack in a closed container to keep soft.\n\n💡 A pinch of salt and a teaspoon of curd in the dough keeps chapathis soft longer.',
  },
  {
    id: 'how-to-fluffy-idli',
    keywords: ['how to make fluffy idli', 'fluffy idli', 'how to make idli', 'idli', 'soft idli', 'idli batter'],
    answer: '⚪ **How to make fluffy idlis:**\n\n1. Use a 3:1 ratio of rice to urad dal for the batter.\n2. Soak rice and dal separately for 4-6 hours.\n3. Grind dal until smooth and fluffy (it should double in volume). Grind rice slightly coarse.\n4. Mix both with salt and ferment overnight in a warm place.\n5. The batter should have doubled and smell tangy.\n6. Grease idli plates lightly, pour batter, and steam for 10-12 minutes.\n7. Let rest 1 minute before removing.\n\n💡 Do not overfill the idli moulds — the batter needs room to rise.',
  },
  {
    id: 'how-to-crispy-pakoda',
    keywords: ['how to make crispy pakoda', 'crispy pakoda', 'how to make pakoda', 'pakoda', 'pakora', 'bhajji'],
    answer: '🟠 **How to make crispy pakodas:**\n\n1. Slice onions thin — thick slices stay soggy inside.\n2. Mix besan, rice flour (for crunch), chilli powder, salt, and a pinch of baking soda.\n3. Add water slowly — the batter should be thick and coat the onions, not runny.\n4. Heat oil to medium — too hot burns the outside, too cool makes it oily.\n5. Drop small clumps and fry until deep golden.\n6. Drain on paper and serve immediately.\n\n💡 A teaspoon of hot oil mixed into the batter (tempering) makes pakodas extra crispy.',
  },
  {
    id: 'how-to-perfect-biryani',
    keywords: ['how to make biryani', 'perfect biryani', 'briyani', 'biriyani', 'biryani tips'],
    answer: '🍚 **Tips for perfect biryani:**\n\n1. Use basmati rice — soak for 20 minutes, then drain.\n2. Parboil rice with whole spices (bay leaf, cardamom, cloves) until 70% done.\n3. Layer the marinated vegetables/meat at the bottom, then rice on top.\n4. Seal the pot tightly (dough or foil) so steam does not escape.\n5. Cook on low heat (dum) for 20-25 minutes.\n6. Do not stir — let it rest for 10 minutes before opening.\n\n💡 Saffron soaked in warm milk, drizzled on top, gives the authentic colour and aroma.',
  },
  {
    id: 'how-to-store-milk',
    keywords: ['how to keep milk fresh', 'store milk', 'keep milk fresh', 'milk from spoiling', 'preserve milk', 'milk fresh longer'],
    answer: '🥛 **How to keep milk fresh longer:**\n\n• Boil milk and let it cool completely before refrigerating.\n• Store in the back of the fridge (coldest spot), not the door.\n• Use a clean, dry spoon every time — even a drop of water can cause spoilage.\n• Add a pinch of turmeric — it slows bacterial growth.\n• Freeze milk in portions if you have excess; thaw in the fridge overnight.\n\n💡 Never mix fresh milk with old milk — it spoils the whole batch!',
  },
  {
    id: 'how-to-freeze-curry',
    keywords: ['can i freeze curry', 'freeze curry', 'freezing food', 'freeze leftover', 'freeze gravy', 'freezing leftovers'],
    answer: '🧊 **Can I freeze curry?**\n\nYes! Most curries freeze beautifully.\n\n• Cool completely before freezing.\n• Use airtight containers or freezer bags (lay flat to save space).\n• Label with the date — use within 2-3 months for best quality.\n• Thaw overnight in the fridge, then reheat thoroughly on the stove.\n\n**Best for freezing:** Tomato-based curries, dal, sambar, chutneys.\n**Avoid freezing:** Coconut-milk-heavy curries (can separate), potato-heavy dishes (texture changes).\n\n💡 Freeze in individual portions so you only thaw what you need.',
  },
];

/** Pre-built lowercase keyword index for fast matching. */
const KNOWLEDGE_INDEX = COOKING_KNOWLEDGE.map((entry) => ({
  ...entry,
  lowerKeywords: entry.keywords.map((k) => k.toLowerCase()),
}));

/**
 * Search the knowledge base for the best matching entry.
 * Returns the first entry whose keywords appear in the query, or null.
 */
export function searchKnowledge(query: string): string | null {
  const lower = query.toLowerCase().trim();

  // Exact keyword match first (highest priority)
  for (const entry of KNOWLEDGE_INDEX) {
    for (const kw of entry.lowerKeywords) {
      if (lower === kw) return entry.answer;
    }
  }

  // Contains keyword match
  for (const entry of KNOWLEDGE_INDEX) {
    for (const kw of entry.lowerKeywords) {
      if (lower.includes(kw)) return entry.answer;
    }
  }

  // Fuzzy keyword match (typo tolerance)
  for (const entry of KNOWLEDGE_INDEX) {
    for (const kw of entry.lowerKeywords) {
      if (kw.length < 5) continue;
      const dist = levenshtein(lower, kw);
      if (dist <= 2 && dist / kw.length < 0.3) return entry.answer;
    }
  }

  return null;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}
