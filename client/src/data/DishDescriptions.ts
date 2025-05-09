// Store dish descriptions for detailed information
export interface DishDescription {
  name: string;
  description: string;
}

export const dishDescriptions: DishDescription[] = [
  // White Wines
  {
    name: "Valviejo Viura",
    description: "A bright, fresh white wine from Spain with citrus notes and a crisp finish. Perfect with seafood and light appetizers."
  },
  {
    name: "Sauvignon Blanc",
    description: "Vibrant and zesty white wine with notes of gooseberry, passion fruit and freshly cut grass. Pairs wonderfully with salads and fish dishes."
  },
  {
    name: "Chardonnay",
    description: "Rich and full-bodied white wine with buttery notes of vanilla, tropical fruits and a touch of oak. Excellent with poultry and cream-based pasta dishes."
  },
  {
    name: "Ancyra Narince",
    description: "A unique Turkish white wine with aromatic floral notes, green apple, and a mineral finish. Pairs beautifully with Mediterranean cuisine."
  },
  {
    name: "Pinot Grigio",
    description: "Light and refreshing Italian white wine with delicate pear, apple and citrus flavors. An excellent match for light seafood dishes and salads."
  },
  {
    name: "Gavi di Gavi",
    description: "Elegant, refined white wine from Piedmont, Italy with notes of green apple, lime, and a distinctive mineral character. Perfect with seafood and vegetable dishes."
  },
  {
    name: "Viogner",
    description: "Aromatic and full-bodied white wine featuring floral and stone fruit notes with hints of apricot and peach. Pairs well with spicier dishes and rich seafood."
  },
  {
    name: "Chenin Blanc",
    description: "Versatile white wine with apple and quince flavors, balanced acidity and a touch of honey. Excellent with grilled fish and chicken dishes."
  },
  {
    name: "Sauvignon Blanc Black Bird",
    description: "Premium Sauvignon Blanc with intense tropical fruit notes, crisp acidity and a long, clean finish. Perfect with seafood and goat's cheese."
  },
  {
    name: "Vermentino Salento",
    description: "Fresh Italian white wine from Puglia with notes of citrus, white flowers and a pleasant mineral finish. Pairs beautifully with Mediterranean seafood."
  },
  {
    name: "Albarino",
    description: "Aromatic Spanish white wine with notes of peach, apricot and almonds with a refreshing acidity. Excellent with shellfish and grilled fish."
  },
  {
    name: "Picpoul De Pinet",
    description: "Crisp French white wine with citrus and green apple notes and a mineral finish. The perfect match for oysters and seafood platters."
  },
  {
    name: "Kavakildere Selection White",
    description: "Premium Turkish white wine blend with elegant fruit notes, good structure and a long finish. Excellent with grilled fish and Mediterranean dishes."
  },
  {
    name: "Pouilly Fume",
    description: "Sophisticated French white wine with smoky, flinty notes, citrus fruits and elegant minerality. Perfect with shellfish, goat cheese and asparagus dishes."
  },
  
  // Red Wines
  {
    name: "Tempranillo",
    description: "Medium-bodied Spanish red wine with flavors of cherry, plum and leather with a smooth finish. Pairs well with grilled meats and aged cheeses."
  },
  {
    name: "Merlot",
    description: "Smooth, approachable red wine with soft tannins and flavors of plum, black cherry and subtle herbs. Versatile with many meat dishes and pasta."
  },
  {
    name: "Ancyra Kalecik Karasi",
    description: "Turkey's signature red grape producing wines with red fruit flavors, spice notes and medium body. Excellent with lamb dishes and kebabs."
  },
  {
    name: "Montepulciano DOCG",
    description: "Robust Italian red with rich cherry and plum flavors, firm tannins and earthy undertones. Perfect with hearty meat dishes and aged cheeses."
  },
  {
    name: "Shiraz Cabernet",
    description: "Bold blend combining Shiraz's spicy, fruit-forward character with Cabernet's structure and tannins. Excellent with grilled meats and game."
  },
  {
    name: "Syrah",
    description: "Full-bodied red wine with bold blackberry and plum flavors, pepper notes and a smooth finish. Perfect with lamb, beef and game meats."
  },
  {
    name: "Pinotage",
    description: "South Africa's signature red grape offering smoky, dark fruit flavors with earthy notes and good structure. Pairs well with barbecued meats."
  },
  {
    name: "Malbec",
    description: "Rich, full-bodied red wine with deep purple color and flavors of blackberry, plum and chocolate. Excellent with steaks and rich meat dishes."
  },
  {
    name: "Domaine De Boissan",
    description: "Elegant French red wine with balanced fruit flavors, subtle oak and a velvet finish. Pairs wonderfully with lamb and beef dishes."
  },
  {
    name: "El Chocolatero Vino Organico",
    description: "Organic Spanish red wine with rich dark fruit flavors, hints of chocolate and a smooth finish. Perfect with grilled meats and aged cheeses."
  },
  {
    name: "Barricone Primitivo",
    description: "Full-bodied Italian red with intense dark fruit flavors, spice notes and a touch of oak. Excellent with rich meat dishes and tomato-based pasta."
  },
  {
    name: "Plaisir Du Vin",
    description: "Elegant French red blend with balanced fruit, subtle spice and a silky texture. Pairs beautifully with beef, lamb and game dishes."
  },
  {
    name: "Kavakildere Selection Red",
    description: "Premium Turkish red blend with dark fruit flavors, fine tannins and excellent structure. Perfect with grilled meats and Mediterranean dishes."
  },
  {
    name: "Pinot Noir",
    description: "Elegant, light to medium-bodied red with red berry flavors, earthy notes and silky tannins. Versatile with duck, game birds and mushroom dishes."
  },
  {
    name: "Rioja Reserva",
    description: "Classic Spanish red aged in oak barrels, offering vanilla, dark fruit and leather notes with a velvety finish. Perfect with lamb and roasted meats."
  },
  {
    name: "Barolo",
    description: "Italy's 'king of wines' with powerful structure, rose and tar aromas, and firm tannins. Best with rich meat dishes, truffles and aged cheeses."
  },
  {
    name: "Escudo Rojo",
    description: "Premium Chilean red from the Rothschild family with rich dark fruit, elegant tannins and a long finish. Excellent with premium cuts of beef."
  },
  
  // Rose Wines
  {
    name: "Garnacha Rioja Rose",
    description: "Fresh Spanish rosé with vibrant red fruit flavors, good acidity and a dry finish. Perfect for salads, tapas and light Mediterranean dishes."
  },
  {
    name: "Kavakildere Egeo Rose",
    description: "Elegant Turkish rosé with delicate red berry notes, refreshing acidity and a clean finish. Excellent with salads and light fish dishes."
  },
  {
    name: "Inna Pierrevert Rose",
    description: "Delicate Provençal-style rosé with notes of red berries, citrus and a crisp, mineral finish. Perfect for seafood, salads and as an aperitif."
  },
  {
    name: "Rose D'Une Nuit",
    description: "Premium rosé with elegant fruit notes, excellent structure and a long, satisfying finish. Pairs beautifully with grilled fish and Mediterranean cuisine."
  },
  
  // Sparkling Wines
  {
    name: "Prosecco Brut",
    description: "Refreshing Italian sparkling wine with notes of green apple, pear and white flowers with fine, persistent bubbles. Perfect as an aperitif or with light appetizers."
  },
  {
    name: "Cava Brut",
    description: "Spanish sparkling wine made in the traditional method with apple and citrus notes, fine bubbles and a crisp finish. Excellent with seafood and tapas."
  },
  {
    name: "Cremant De Loire",
    description: "Elegant French sparkling wine with fine bubbles, apple and citrus notes and a creamy texture. Perfect for celebrations and with lighter dishes."
  },
  {
    name: "Prosecco Rose",
    description: "Delicate pink sparkling wine with red berry notes, floral hints and a refreshing finish. Excellent as an aperitif or with light desserts."
  },
  {
    name: "Cava Rose",
    description: "Spanish pink sparkling wine with strawberry and raspberry notes, fine bubbles and a crisp finish. Perfect for celebrations and light dishes."
  },
  {
    name: "Moet & Chandon",
    description: "Iconic Champagne with fine bubbles, notes of green apple, citrus and brioche with a refined, elegant finish. Perfect for special occasions."
  },
  {
    name: "Veuve Cliquot Yellow Label",
    description: "Premium Champagne with complex aromas of white fruits, brioche and vanilla, with a full-bodied structure and exceptional finesse."
  },
  {
    name: "Bollinger Special Cuvee",
    description: "Distinguished Champagne with rich, toasty notes, complex fruit flavors and a refined mousse. Perfect for the most special celebrations."
  },
  {
    name: "Moet & Chandon Rose",
    description: "Elegant rosé Champagne with red berry aromas, hints of peach and a subtle brioche note. The perfect celebratory pink bubbly."
  },
  {
    name: "Laurent-Perrier Cuvee Rose",
    description: "Iconic rosé Champagne known for its salmon-pink color, fresh red berry flavors and exceptional finesse. A truly special celebratory wine."
  },
  {
    name: "Soup of the Day",
    description: "Freshly made soup using seasonal ingredients. Served with our homemade bread."
  },
  {
    name: "Bruschetta Ricotta e Pomodoro",
    description: "Toasted Italian bread topped with ricotta cheese and fresh tomatoes, drizzled with basil oil."
  },
  {
    name: "Calamari Fritti con Salsa all'Aglio",
    description: "Deep fried crispy squid rings served with a garlic mayo dip and lemon wedge."
  },
  {
    name: "Insalata dell'Adriatico",
    description: "A seafood salad with prawns, squid, octopus, mussels, olives and red peppers on a bed of lettuce with Marie Rose sauce."
  },
  {
    name: "Paté di Fegatini all'Umbra",
    description: "Homemade chicken liver pâté served with toasted bread and apple & orange chutney with a hint of cinnamon."
  },
  {
    name: "Involtini di Asparagi (N)",
    description: "Asparagus spears wrapped in mortadella and coated in breadcrumbs with parmesan. Deep fried until golden."
  },
  {
    name: "Costicine di Maiale",
    description: "Slow cooked pork ribs in a tangy BBQ sauce."
  },
  {
    name: "Polpette Salentine",
    description: "Homemade Italian meatballs with mozzarella, tomatoes, fresh basil and a touch of cream. Served with toasted bread."
  },
  {
    name: "Caprino Impanato",
    description: "Breaded goat's cheese served with rocket salad and a sweet apple, orange and cinnamon chutney."
  },
  {
    name: "Funghi all'Aglio e Prezzemolo",
    description: "Pan-fried mushrooms with garlic, white wine, olive oil, parsley and cream. Served with garlic croutons."
  },
  {
    name: "Carpaccio di Manzo",
    description: "Thinly sliced raw beef fillet topped with rocket, parmesan shavings and drizzled with truffle oil."
  },
  {
    name: "Gamberoni allo Zafferano",
    description: "Sautéed king prawns with garlic, saffron, spring onions, white wine, fresh chilli and butter."
  },
  {
    name: "Insalata Tricolore",
    description: "A classic Italian salad of mozzarella, tomatoes and avocado drizzled with basil oil."
  },
  {
    name: "Pizza Margherita",
    description: "The classic pizza with tomato sauce, mozzarella cheese and a drizzle of basil oil."
  },
  {
    name: "Pizza Alternativa",
    description: "A BBQ base topped with mozzarella, chicken, red onions, red peppers and a sprinkle of parsley."
  },
  {
    name: "Pizza Calabrese",
    description: "Tomato sauce, mozzarella, spicy Calabrian sausage, spinach and red onions."
  },
  {
    name: "Calzone Primavera",
    description: "A folded pizza filled with mozzarella, spinach, mushrooms, ricotta cheese and tomato sauce."
  },
  {
    name: "Pizza Fresca (N)",
    description: "A white pizza base topped with mozzarella, mortadella, rocket and drizzled with balsamic glaze."
  },
  {
    name: "Pizza Chiaramonti",
    description: "A white pizza base topped with mozzarella, ham, mushrooms, garlic and goat's cheese."
  },
  {
    name: "Pizza Napoli",
    description: "Tomato sauce, mozzarella, anchovies, olives and artichoke hearts."
  },
  {
    name: "Pizza Domenico",
    description: "Tomato sauce, mozzarella, chicken, pepperoni, ham, beef mince and fresh chilli."
  },
  {
    name: "Pizza Gondola",
    description: "A white pizza base topped with mozzarella, bolognese sauce, spicy 'nduja sausage, egg and rocket."
  },
  {
    name: "Calzone Mezza Luna",
    description: "A half-moon folded pizza filled with mozzarella, chicken, ham, mushrooms, garlic and honey."
  },
  {
    name: "Pizza Bella Vita",
    description: "Tomato sauce, mozzarella, San Daniele ham, rocket and parmesan shavings."
  },
  {
    name: "Tagliatelle Salmone e Spinaci",
    description: "Egg pasta ribbons cooked with salmon, garlic, chilli, onions, spinach and creamy white wine sauce."
  },
  {
    name: "Tagliatelle Campagnola",
    description: "Egg pasta ribbons cooked with onions, garlic, cherry tomatoes, goat's cheese and aspargus. Topped with parmesan shavings and chopped beetroot."
  },
  {
    name: "Penne Boscaiola",
    description: "Penne pasta cooked with chicken, button mushrooms, sun-dried tomatoes, garlic, parsley, tomato sauce and a splash of cream."
  },
  {
    name: "Linguine Arrabbiata",
    description: "Linguine pasta cooked with Italian sausage, red onions, red pepper, fresh chilli and garlic. In a Italian herb and tomato sauce."
  },
  {
    name: "Tagliatelle Scoglio",
    description: "Egg pasta ribbons cooked with pieces of cod, king prawns, squid rings, cherry tomatoes, basil, garlic, fresh chilli, white wine and tomato sauce."
  },
  {
    name: "Penne al Baccalá",
    description: "Penne pasta cooked with pieces of cod, Greenland prawns, sun-dried tomatoes, garlic, parsley, capers and a creamy lemon butter sauce."
  },
  {
    name: "Linguine con Capesante",
    description: "Linguine pasta cooked with garlic, onions, basil, red pepper, lemon zest and white wine. Topped with pan-fried king scallops."
  },
  {
    name: "Spaghetti con Gamberoni",
    description: "Spaghetti pasta cooked with king prawns, salmon, garlic, parsley, spring onions and white wine."
  },
  {
    name: "Tortelloni d'Asparagi",
    description: "Parcels filled with ricotta cheese, Grana Padano and asparagus tips. Cooked with mushrooms, onions, garlic, white wine, parsley, tomato sauce and a splash of cream. Topped with rocket leaves and parmesan shavings."
  },
  {
    name: "Ravioli d'Aragosta",
    description: "Lobster ravioli cooked with king prawns, garlic, mushrooms, parsley, butter and white wine."
  },
  {
    name: "Ravioli di Carne",
    description: "Homemade meat filled ravioli cooked with ginger, onions, red peppers, garlic, white wine, English mustard, Italian herbs and cream. Topped with rocket leaves, diced beetroot and a balsamic glaze."
  },
  {
    name: "Lasagna Pasticciata",
    description: "Egg pasta layered with bolognese and bechamel sauce. Baked and served with a side salad."
  },
  {
    name: "Pizza Margherita",
    description: "Tomato sauce, mozzarella and basil oil."
  },
  {
    name: "Pizza Alternativa",
    description: "Homemade barbecue sauce, mozzarella, chicken, red onion, pepper and parsley."
  },
  {
    name: "Pizza Calabrese",
    description: "Tomato sauce, mozzarella, spinach, red onion and traditional Calabrian sausage."
  },
  {
    name: "Calzone Primavera",
    description: "Folded pizza filled with mozzarella, spinach, garlic mushrooms and ricotta cheese. Served with tomato sauce."
  },
  {
    name: "Pizza Fresca (N)",
    description: "Garlic, mozzarella and mortadella topped with rocket salad and balsamic glaze."
  },
  {
    name: "Pizza Chiaramonti",
    description: "Tomato sauce, mozzarella, mushroom, ham, garlic and goat's cheese."
  },
  {
    name: "Pizza Napoli",
    description: "Tomato sauce, mozzarella, anchovies, olives and artichoke."
  },
  {
    name: "Pizza Domenico",
    description: "Tomato sauce, mozzarella, chicken pepperoni, ham, meatballs and fresh chilli."
  },
  {
    name: "Pizza Bella Vita",
    description: "Tomato sauce, mozzarella, topped with thin slices of San Daniele Parma ham, rocket leaves and parmesan shavings."
  },
  {
    name: "Pizza Diavola",
    description: "Tomato sauce, mozzarella, pepperoni, jalapenos, roasted red peppers and chilli flakes."
  },
  {
    name: "King Prawns",
    description: "Marinated king prawns cooked with garlic, chilli and creamy lemon butter sauce."
  },
  {
    name: "Sigara Böreği (V)",
    description: "Filo pastry rolls filled with feta cheese, egg and parsley. Served with tzatziki and ezme (spicy fine chopped vegetables)."
  },
  {
    name: "İçli Köfte (N)",
    description: "Fried bulgur ball filled with ground lamb mince. Served with a red pepper dip."
  },
  {
    name: "Lollipop Chicken",
    description: "Grilled, marinated chicken wings coated in our homemade barbecue sauce."
  },
  {
    name: "Paçanga Böreği",
    description: "Filo pastry filled with sucuk, red pepper, onion and mozzarella cheese. Served with a spicy red pepper dip."
  },
  {
    name: "Oyster Chimichurri (V)",
    description: "Grilled oyster mushrooms topped with chimichurri. Served with grilled garlic sourdough bread."
  },
  {
    name: "Halloumi Salad (V)",
    description: "Grilled halloumi cheese served on a bed of Mediterranean salad with a chilli, honey and lime dressing."
  },
  {
    name: "Greek Salad (V)",
    description: "Tomato, cucumber, red onion, green pepper, black olive and feta cheese, dressed with olive oil, vinegar and salt."
  },
  {
    name: "Pulpo a la Gallega",
    description: "Galician style grilled octopus served on a bed of our homemade red pepper paste topped with chimichurri and sea salt."
  },
  {
    name: "Kolokithokeftedes (V)",
    description: "Greek deep fried courgette and feta fritters served with tzatziki."
  },
  {
    name: "Chorizo",
    description: "Picante chorizo cooked in dry sherry served with grilled garlic sourdough bread."
  },
  {
    name: "Salmon Tartare",
    description: "Fresh chopped salmon, red onion, avocado and capers. Served with Izgara mayonnaise and mustard."
  },
  {
    name: "Kalamari",
    description: "Deep fried calamari served with an Izgara mayonnaise dip."
  },
  {
    name: "Feta Pane (V)",
    description: "Pan-fried breaded feta cheese served with spicy ezme."
  },
  {
    name: "Lamb Liver",
    description: "Deep fried lamb liver cubes with red onion and sumac salad. Served with potatoes."
  },
  {
    name: "Meze (Serves 2 People)(V)",
    description: "Tirnak pide served with 6 small mezes (Hummus, ezme, tzatziki, carrot yoghurt, courgette balls and halloumi)."
  },
  {
    name: "Chicken Skewer",
    description: "Marinated grilled chicken breast skewer. Served with pitta bread, rice, salad, spicy tomato sauce and tzatziki."
  },
  {
    name: "Beef Fillet Kebab",
    description: "Beef fillet kebab served with pitta bread, French fries, spicy tomato sauce and tzatziki."
  },
  {
    name: "Lamb Skewer",
    description: "Marinated lamb skewer served with pitta bread, rice, salad, spicy tomato sauce and tzatziki."
  },
  {
    name: "Adana Kebab",
    description: "Marinated ground lamb mince skewer. Served with pitta bread, rice, mixed salad, spicy tomato sauce and tzatziki."
  },
  {
    name: "Salmon Floretine",
    description: "Grilled salmon steak served with a garlic, cherry tomato, spinach, chilli and splash of cream sauce."
  },
  {
    name: "Lamb Liver",
    description: "Grilled, marinated lamb liver served on pitta bread with chimichurri, spicy tomato sauce and rosemary new potatoes."
  },
  {
    name: "Seabass",
    description: "Marinated, grilled seabass fillet with cherry tomato, garlic, rosemary, chilli and white wine sauce."
  },
  {
    name: "Lamb Chops",
    description: "Marinated, grilled lamb chops served on pitta bread with chimichurri and couscous."
  },
  {
    name: "Inegöl Köfte",
    description: "Ground lamb and beef mince meatballs served on pitta bread with truffle Parmesan fries, spicy tomato sauce and red pepper dip."
  },
  {
    name: "Cheese Keftedes",
    description: "Ground lamb and beef mince meatballs, filled with cheese, served with Diana sauce and homemade fries topped with truffle mayonnaise."
  },
  {
    name: "Izgara Mixed Grill",
    description: "Our special mixed marinated grill consisting of Inegöl köfte, lamb chops, chicken and beef fillet. Served on pitta bread with couscous and spicy tomato sauce."
  },
  {
    name: "Chicken Fajita",
    description: "Marinated, grilled chicken breast with peppers and onions. Served with Tzatziki, Spicy Ezme and Guacamole and warm tortilla wraps."
  },
  {
    name: "Halloumi Fajita",
    description: "Grilled halloumi with peppers and onions. Served with Tzatziki, Spicy Ezme and Guacamole and warm tortilla wraps."
  },
  {
    name: "Moussaka",
    description: "Oven baked layers of potato, aubergine, courgette and ground minced beef topped with cheesy bechamel sauce. Served with Izgara salad."
  },
  {
    name: "Lamb Tagine (N)",
    description: "Lamb cubes slow cooked with tomato, garlic, almonds and dried fruits. Served with couscous."
  },
  {
    name: "Karniyarik",
    description: "Oven baked aubergine stuffed with ground mince, onion and tomato. Served with our own pilav rice."
  },
  {
    name: "Beef Ribs",
    description: "Slow cooked beef ribs in a spicy tomato sauce. Served with mashed potatoes."
  },
  {
    name: "Halibut del Griego",
    description: "Panfried halibut steak served with king prawns, kalamata olives, capers, dill and white wine sauce."
  },
  {
    name: "Sebze Bayıldı (V)",
    description: "Roasted aubergine filled with mushrooms, onion, peppers, garlic, and tomato sauce. Served with Izgara salad and tzatziki."
  },
  {
    name: "Lamb Shank Kleftiko",
    description: "Slow cooked lamb shank served with mash potato and mediterranean vegetable stew."
  },
  {
    name: "Fillet",
    description: "Grilled, 8oz, 28 days aged fillet steak."
  },
  {
    name: "Tomahawk",
    description: "Tomahawk Steak, Dry Aged In-House for 30 days. Served with our homemade Roquefort cheese Sauce, chunky triple cooked chips and grilled Tenderstem broccoli."
  },
  {
    name: "Orzotto Verduras",
    description: "Orzo pasta with roasted vegetables and kalamata olives with a tomato and creamy white wine sauce. Topped with crumbled feta cheese."
  },
  {
    name: "Orzotto Chorizo e Pollo",
    description: "Orzo pasta with chicken, chorizo picante, mushrooms and spring onion with a creamy demi-glace sauce. Topped with crumbled feta cheese."
  },
  {
    name: "Orzotto Del Mar",
    description: "Orzo pasta with king prawns, kalamari, spring onion, sundried tomatoes and chilli with a tomato and splash of cream sauce. Topped with crumbled feta cheese."
  },
  {
    name: "Churros (V)",
    description: "Homemade Deep fried choux pastry dough rings coated in cinnamon sugar. Served with chocolate dipping sauce."
  },
  {
    name: "Crème Brûlée (V)",
    description: "Homemade Rich creamy custard base topped with hardened caramelised sugar."
  },
  {
    name: "Eton Mess",
    description: "Whipped cream, crushed meringue pieces and wild berry sauce."
  },
  {
    name: "Künefe (N)",
    description: "Crispy cheese and pistachio filled kadayıf served with a scoop of vanilla ice cream. (Please allow 15 minutes cooking time)"
  },
  {
    name: "Lemon Cheesecake",
    description: "Homemade lemon cheesecake topped with a lemon drizzle."
  },
  {
    name: "Brownie (N)",
    description: "Our homemade rich chocolate fudge brownie. Served warm with a scoop of Vanilla Ice Cream."
  },
  {
    name: "Baklava (N)",
    description: "Thin layers of golden, flakey filo pastry filled with chopped nuts and soaked in honey syrup. Served with a scoop of Vanilla ice cream."
  },
  {
    name: "Ice Cream (V)",
    description: "A selection of ice creams, choose 3 scoops from vanilla, chocolate, strawberry, pistachio and caramelita."
  },
  {
    name: "Izgara Martini",
    description: "Raki, Spiced Rum, Archers, Lemon Juice & Egg White."
  },
  {
    name: "Aperol Spritz",
    description: "Prosecco, Aperol & Soda."
  },
  {
    name: "French Martini",
    description: "Pineapple Juice, Vodka & Chambord."
  },
  {
    name: "Pina Colada",
    description: "Light Rum, Malibu, Pineapple Juice & Milk."
  },
  {
    name: "Espresso Martini",
    description: "Vodka, Kahlua, Espresso Shot & Sugar Syrup."
  },
  {
    name: "Passion Martini",
    description: "Vanilla Vodka, Passion Fruit Puree, Passion Fruit Syrup, Passion Fruit Liqueur & A Shot Of Prosecco On The Side."
  },
  {
    name: "White Russian",
    description: "Vodka, Coffee Liqueur & Cream."
  },
  {
    name: "The Godfather",
    description: "Blended Scotch Whisky & Amaretto Liqueur."
  },
  {
    name: "Margarita",
    description: "Tequila, Cointreau, Lime & Lemon Juice."
  },
  {
    name: "Spicy Margarita",
    description: "Tequila, Cointreau, Lemon Juice, Lime Juice and Fresh Chilli."
  },
  {
    name: "Sex on the Beach",
    description: "Vodka, Archers, Orange Juice & Cranberry Juice."
  },
  {
    name: "Purple Butterfly",
    description: "Cucumber Vodka, Elderflower Liqueur, Soda & Lavendar Syrup."
  },
  {
    name: "Kiwi Kiss",
    description: "Hendricks Gin, Kiwi Puree, Elderflower Liqueur, Lime & Soda Water."
  },
  {
    name: "White Lady",
    description: "Cointreau, Gin, Lemon Juice & Egg White."
  },
  {
    name: "Negroni",
    description: "Gin, Campari & Vermouth."
  },
  {
    name: "Mojito",
    description: "Bacardi, Lime, Mint & Soda Water."
  },
  {
    name: "Strawberry Mojito",
    description: "Bacardi, Lime, Mint, Soda Water & Strawberry."
  },
  {
    name: "Long Island Ice Tea",
    description: "Vodka, Gin, Tequila, Rum, Triple Sec, Lime Juice, Coca Cola."
  },
  {
    name: "Whiskey Sour",
    description: "Bourbon, Lemon Juice, Egg White, Angostura Bitters."
  },
  {
    name: "Caipirinha",
    description: "Cachaça, Lime Wedges & Sugar."
  },
  {
    name: "Old Fashioned",
    description: "Whisky, Sugar Syrup & Angostura Bitters."
  },
  {
    name: "Zombie",
    description: "4 Types of Rum, Orange Juice & Pineapple Juice."
  },
  {
    name: "Cuba Libre",
    description: "Rum, Lime Juice & Coca Cola."
  },
  {
    name: "Cauliflower Manchego Cheese (V)(N)",
    description: "Roasted cauliflower florets with manchego cheese sauce and flaked almonds."
  },
  {
    name: "Grilled Tenderstem Broccoli (V)",
    description: "Fresh tenderstem broccoli grilled with garlic olive oil."
  },
  {
    name: "French Fries (V)",
    description: "Crispy french fries."
  },
  {
    name: "Chunky Triple Cooked Chips (V)",
    description: "Thick cut potatoes, triple-cooked for extra crispiness."
  },
  {
    name: "Creamy Baby Spinach Leaves with Chilli (V)",
    description: "Baby spinach sautéed in a light cream sauce with a hint of chilli."
  },
  {
    name: "Padron Peppers with Garlic (V)",
    description: "Blistered padron peppers sautéed with garlic and olive oil."
  },
  {
    name: "Fried Vegetable Tempura with Truffle (V)",
    description: "Mixed vegetables in a light tempura batter, served with truffle oil drizzle."
  },
  {
    name: "Tomato, Onion and Caper Salad",
    description: "Fresh tomatoes, red onions and capers tossed in olive oil and herbs."
  },
  {
    name: "Pitta Bread (V)",
    description: "Warm pitta bread."
  },
  {
    name: "Skin-On, Roasted, Rosemary New Potatoes (V)",
    description: "Baby potatoes with skin on, roasted with fresh rosemary."
  },
  {
    name: "Creamy Mashed Potato",
    description: "Smooth, creamy mashed potatoes with butter."
  },
  {
    name: "Sauce Au Poivre",
    description: "Green peppercorn, red wine and creamy demi-glace sauce."
  },
  {
    name: "Sauce Diane",
    description: "French mustard, red wine, mushroom, onion and cream sauce."
  },
  {
    name: "Sauce Roquefort",
    description: "Roquefort cheese, white wine, demi-glace and cream sauce."
  },
  
  {
    name: "Valviejo Viura (Glass)",
    description: "A white wine that stands out for its aromas of fruit and white flowers."
  },
  {
    name: "Sauvignon Blanc (Glass)",
    description: "Clean, crisp and fruity. Perfect on its own or with food."
  },
  {
    name: "Chardonnay (Glass)",
    description: "Fresh and elegant with nice floral and tropical fruit aromas."
  },
  {
    name: "Ancyra Narince (Glass)",
    description: "Produced from Turkey's most known white grape. Fresh, full bodied and aromatic."
  },
  {
    name: "Pinot Grigio (Glass)",
    description: "A light, crisp wine with a delicate citrus aroma and flavors of grapefruit and lemon."
  },
  {
    name: "Gavi di Gavi (Glass)",
    description: "Elegant Italian white wine with fresh acidity and notes of citrus and pear."
  },
  {
    name: "Vermentino Salento (Bottle)",
    description: "A delicate scent of fresh white flowers, notes of pear and intense tropical fruit aromas."
  },
  {
    name: "Albarino (Bottle)",
    description: "Peach, apple, lime and apricot follow through to zingy fruitness on the palate with spices and vanilla."
  },
  {
    name: "Picpoul De Pinet (Bottle)",
    description: "Peach, apple, lime and apricot follow through to zingy fruitiness with a vanilla finish."
  },
  
  {
    name: "Tempranillo (Glass)",
    description: "A red wine from old vines with great finesse and complexity."
  },
  {
    name: "Merlot (Glass)",
    description: "A dark garnet red colour with a fruity nose, mixed with spicy notes of thyme and pepper."
  },
  {
    name: "Ancyra Kalecik Karasi (Glass)",
    description: "Floral notes and rich, fresh berry flavors with an appealing black pepper finish."
  },
  {
    name: "Rioja Reserva (Bottle)",
    description: "This wine has elegant aromas of mature dark fruit, spice and mineral notes."
  },
  {
    name: "Barolo (Bottle)",
    description: "An intense bouquet of mature red fruit and tobacco."
  },
  {
    name: "Escudo Rojo (Bottle)",
    description: "A delightful wine with raspberry, blackcurrant and smooth oak notes."
  },
  
  // Bell Food Menu
  {
    name: "Zuppa del Giorno",
    description: "Soup of the day."
  },
  {
    name: "Bruschetta Ricotta e Pomodoro",
    description: "Toasted homemade Italian bread topped with a basil ricotta cheese, and chopped tomatoes. Drizzled with basil oil."
  },
  {
    name: "Calamari Fritti con Salsa all'Aglio",
    description: "Deep fried squid rings, served with garlic mayonnaise and a wedge of lemon."
  },
  {
    name: "Insalata dell'Adriatico",
    description: "Marinated king prawns, squid rings, baby octopus, Greenland prawns, New Zealand mussel, black olives and red peppers. Served on a bed of mixed salad leaves and Marie Rose sauce."
  },
  {
    name: "Paté di Fegatini all'Umbra",
    description: "Homemade chicken liver pate served with toasted Italian bread and a tangy apple, orange and cinnamon chutney."
  },
  {
    name: "Involtini di Asparagi",
    description: "Oven baked asparagus wrapped in mortadella, gratinated with breadcrumbs and parmesan."
  },
  {
    name: "Costicine di Maiale",
    description: "Pork spare ribs cooked and served in our own homemade barbecue sauce."
  },
  {
    name: "Polpette Salentine",
    description: "Homemade beef meatballs topped with mozzarella cheese, baked in creamy basil and tomato sauce. Served with a slice of toasted Italian bread."
  },
  {
    name: "Caprino Impanato",
    description: "Deep fried breaded goat's cheese served with rocket leaves and a tangy apple, orange and cinnamon chutney."
  },
  {
    name: "Funghi all'Aglio e Prezzemolo",
    description: "Pan-fried mushrooms cooked in white wine, olive oil, garlic, parsley and cream. Served with a garlic crouton."
  },
  {
    name: "Carpaccio di Manzo",
    description: "Slices of marinated and cured Angus beef fillet served with rocket leaves, parmesan shavings, toasted bread and drizzled with tartufo truffle oil."
  },
  {
    name: "Gamberoni allo Zafferano",
    description: "Pan-fried king prawns cooked with garlic, saffron, spring onions, white wine, fresh chilli and butter."
  },
  {
    name: "Insalata Tricolore",
    description: "Sliced buffalo mozzarella cheese, beef tomato and avocado dressed with basil oil and sea salt."
  },
  {
    name: "Tagliatelle Salmone e Spinaci",
    description: "Egg pasta ribbons cooked with salmon, garlic, chilli, onions, spinach and creamy white wine sauce."
  },
  {
    name: "Tagliatelle Campagnola",
    description: "Egg pasta ribbons cooked with onions, garlic, cherry tomatoes, goat's cheese and aspargus. Topped with parmesan shavings and chopped beetroot."
  },
  {
    name: "Penne Boscaiola",
    description: "Penne pasta cooked with chicken, button mushrooms, sun-dried tomatoes, garlic, parsley, tomato sauce and a splash of cream."
  },
  {
    name: "Linguine Arrabbiata",
    description: "Linguine pasta cooked with Italian sausage, red onions, red pepper, fresh chilli and garlic. In a Italian herb and tomato sauce."
  },
  {
    name: "Tagliatelle Scoglio",
    description: "Egg pasta ribbons cooked with pieces of cod, king prawns, squid rings, cherry tomatoes, basil, garlic, fresh chilli, white wine and tomato sauce."
  },
  {
    name: "Penne al Baccalá",
    description: "Penne pasta cooked with pieces of cod, Greenland prawns, sun-dried tomatoes, garlic, parsley, capers and a creamy lemon butter sauce."
  },
  {
    name: "Linguine con Capesante",
    description: "Linguine pasta cooked with garlic, onions, basil, red pepper, lemon zest and white wine. Topped with pan-fried king scallops."
  },
  {
    name: "Spaghetti con Gamberoni",
    description: "Spaghetti pasta cooked with king prawns, salmon, garlic, parsley, spring onions and white wine."
  },
  {
    name: "Tortelloni d'Asparagi",
    description: "Parcels filled with ricotta cheese, Grana Padano and asparagus tips. Cooked with mushrooms, onions, garlic, white wine, parsley, tomato sauce and a splash of cream. Topped with rocket leaves and parmesan shavings."
  },
  {
    name: "Ravioli d'Aragosta",
    description: "Lobster ravioli cooked with king prawns, garlic, mushrooms, parsley, butter and white wine."
  },
  {
    name: "Ravioli di Carne",
    description: "Homemade meat filled ravioli cooked with ginger, onions, red peppers, garlic, white wine, English mustard, Italian herbs and cream. Topped with rocket leaves, diced beetroot and a balsamic glaze."
  },
  {
    name: "Lasagna Pasticciata",
    description: "Egg pasta layered with bolognese and bechamel sauce. Baked and served with a rich cheese topping."
  },
  {
    name: "Pizza Margherita",
    description: "Tomato sauce, mozzarella and basil oil."
  },
  {
    name: "Pizza Alternativa",
    description: "Homemade barbecue sauce, mozzarella, chicken, red onion, pepper and parsley."
  },
  {
    name: "Pizza Calabrese",
    description: "Tomato sauce, mozzarella, spinach, red onion and traditional Calabrian sausage."
  },
  {
    name: "Calzone Primavera",
    description: "Folded pizza filled with mozzarella, spinach, garlic mushrooms and ricotta cheese. Served with tomato sauce."
  },
  {
    name: "Pizza Fresca",
    description: "Garlic, mozzarella and mortadella topped with rocket salad and drizzled with a balsamic glaze."
  },
  {
    name: "Pizza Chiaramonti",
    description: "Tomato sauce, mozzarella, mushroom, ham, garlic and goat's cheese."
  },
  {
    name: "Pizza Napoli",
    description: "Tomato sauce, mozzarella, anchovies, olives and artichoke."
  },
  {
    name: "Pizza Domenico",
    description: "Tomato sauce, mozzarella, chicken pepperoni, ham, meatballs and fresh chilli."
  },
  {
    name: "Pizza Gondola",
    description: "Gondola shaped pizza with bolognese sauce, 'Nduja spicy sausage, mozzarella cheese and egg. Topped with rocket leaves."
  },
  {
    name: "Calzone Mezza Luna",
    description: "Folded honey glazed half moon pizza filled with mozzarella, chicken, ham, mushrooms and garlic. Served with tomato sauce."
  },
  {
    name: "Pizza Bella Vita",
    description: "Tomato sauce, mozzarella, topped with thin slices of San Daniele Parma ham, rocket leaves and parmesan shavings."
  },
  {
    name: "Pizza Diavola",
    description: "Tomato sauce, mozzarella, pepperoni, jalapenos, roasted red peppers and chilli flakes."
  },
  {
    name: "Pizza 'Nduja",
    description: "Tomato sauce, 'Nduja spicy sausage, garlic, king prawns, mozzarella and spring onions."
  },
  {
    name: "Risotto di Mare",
    description: "Arborio rice cooked with garlic, king prawns, calamari rings, courgettes and tomato sauce."
  },
  {
    name: "Risotto dell'Orto",
    description: "Arborio rice cooked with garlic, chilli, onions, red pepper, asparagus, ginger, cream and white wine."
  },
  {
    name: "Risotto con Pollo e Porcini",
    description: "Arborio rice cooked with chicken, porcini mushrooms, button mushrooms, onions, garlic, white wine and cream."
  },
  {
    name: "Pollo all'Inglese",
    description: "Pan-fried chicken fillet cooked with garlic, mushrooms, onions, English mustard, white wine and cream."
  },
  {
    name: "Pollo alla Valdostana",
    description: "Pan-fried chicken fillet topped with mortadella and mozzarella cheese. Served with a tomato, garlic and white wine sauce."
  },
  {
    name: "Anatra al Gran Marnier",
    description: "Pan-fried duck breast served sliced with an orange, pineapple, Millefiore honey, chilli sauce."
  },
  {
    name: "Agnello Abruzzo",
    description: "Roasted marinated lamb chops with a rosemary and red wine sauce. Served with sliced roasted potatoes."
  },
  {
    name: "Carré d'Agnello",
    description: "Roasted rack of lamb with a mint and red wine reduction. Served with seasonal vegetables."
  },
  {
    name: "Bistecca di Manzo Diana",
    description: "Grilled sirloin steak with a rich Diana sauce of mushrooms, onions, French mustard, cream and red wine."
  },
  {
    name: "Guancia di Bue al Vino Rosso",
    description: "Slow-cooked ox cheek in a rich red wine sauce with rosemary and garlic. Served with roasted potatoes."
  },
  {
    name: "Filetto di Manzo Pepe",
    description: "Prime beef fillet steak cooked to your liking, served with a creamy green peppercorn and red wine sauce."
  },
  {
    name: "Filetto di Manzo Rossini",
    description: "Pan-fried fillet of beef topped with chicken liver pâté, served on a crouton with a Madeira and truffle sauce."
  },

  {
    name: "Risotto di Mare",
    description: "Arborio rice cooked with garlic, king prawns, calamari rings, courgettes and tomato sauce."
  },
  {
    name: "Risotto dell'Orto",
    description: "Arborio rice cooked with garlic, chilli, onions, red pepper, asparagus, ginger, cream and white wine."
  },
  {
    name: "Risotto con Pollo e Porcini",
    description: "Arborio rice cooked with chicken, porcini mushrooms, button mushrooms, onions, garlic, white wine and cream."
  },
  {
    name: "Tiramisu",
    description: "Layers of coffee-soaked sponge and mascarpone cream, dusted with cocoa powder."
  },
  {
    name: "Hot Chocolate Fudge Cake",
    description: "Rich chocolate cake served warm with vanilla ice cream."
  },
  {
    name: "Dark and White Chocolate Mousse",
    description: "A light and airy chocolate mousse made with dark and white chocolate, topped with fresh cream."
  },
  {
    name: "Panna Cotta",
    description: "Classic Italian dessert made with sweetened cream and vanilla, set with gelatine and served with a fruit coulis."
  },
  
  // Drinks descriptions
  {
    name: "Fever Tree Premium",
    description: "Premium tonic water made with natural ingredients and spring water. Served cold with ice (200ml)."
  },
  {
    name: "Appletiser",
    description: "Sparkling 100% apple juice. Served cold with ice (275ml)."
  },
  {
    name: "J20 Orange & Passionfruit",
    description: "Refreshing blend of orange and passion fruit juices. Served cold with ice (275ml)."
  },
  {
    name: "J20 Apple & Raspberry",
    description: "Refreshing blend of apple and raspberry juices. Served cold with ice (275ml)."
  },
  {
    name: "J20 Apple & Mango",
    description: "Refreshing blend of apple and mango juices. Served cold with ice (275ml)."
  },
  {
    name: "Fruit Shoot Orange",
    description: "Kid-friendly orange flavored drink, no artificial colors or flavors."
  },
  {
    name: "Fruit Shoot Summer Fruit",
    description: "Kid-friendly summer fruit flavored drink, no artificial colors or flavors."
  },
  {
    name: "Fruit Shoot Blackcurrant",
    description: "Kid-friendly blackcurrant flavored drink, no artificial colors or flavors."
  },
  {
    name: "Lemonade",
    description: "Classic refreshing lemonade. Served cold with ice."
  },
  {
    name: "Bitter Lemonade",
    description: "Bitter lemon soda with a tangy citrus flavor. Served cold with ice."
  },
  {
    name: "Fanta",
    description: "Orange-flavored carbonated soft drink. Served cold with ice."
  },
  {
    name: "Orange Juice",
    description: "Freshly squeezed orange juice. Served cold with ice."
  },
  {
    name: "Apple Juice",
    description: "Freshly pressed apple juice. Served cold with ice."
  },
  {
    name: "Pineapple Juice",
    description: "Sweet and refreshing pineapple juice. Served cold with ice."
  },
  {
    name: "Cranberry Juice",
    description: "Tangy cranberry juice. Served cold with ice."
  },
  {
    name: "Coca Cola",
    description: "Classic cola soft drink. Served cold with ice (330ml)."
  },
  {
    name: "Diet Coke",
    description: "Sugar-free cola soft drink. Served cold with ice (330ml)."
  },
  {
    name: "Coke Zero",
    description: "Zero-calorie cola soft drink. Served cold with ice (330ml)."
  },
  {
    name: "Still Mineral Water",
    description: "Refreshing still mineral water (750ml bottle)."
  },
  {
    name: "Sparkling Mineral Water",
    description: "Refreshing sparkling mineral water with fine bubbles (750ml bottle)."
  }
];

// Function to get a dish description by name
export function getDishDescription(dishName: string): string | null {
  // Try exact match first (case insensitive)
  const dish = dishDescriptions.find(
    (d) => d.name.toLowerCase() === dishName.toLowerCase()
  );
  
  if (dish) {
    return dish.description;
  }
  
  // For wines that may have (Glass), (Bottle), or (200ml) in their name
  if (dishName.includes('(Glass)') || dishName.includes('(Bottle)') || dishName.includes('(200ml)')) {
    // Extract the base wine name without the container size
    const baseName = dishName.split('(')[0].trim();
    
    const baseMatch = dishDescriptions.find(
      (d) => d.name.toLowerCase() === baseName.toLowerCase()
    );
    
    if (baseMatch) {
      return baseMatch.description;
    }
  }
  
  return null;
}