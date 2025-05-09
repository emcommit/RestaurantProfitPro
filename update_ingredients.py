
import json
import csv
from io import StringIO

# CSV data containing wholesale prices for all ingredients
csv_data = """Ingredient,Category,Unit,Wholesale Price (excl. VAT),VAT (20%),Final Price (incl. VAT),Source
lamb,Proteins,kg,6.50,1.30,7.80,"Brakes Foodservice, Tridge"
beefFillet,Proteins,kg,15.00,3.00,18.00,"JJ Foodservice, Turner Price"
chicken,Proteins,kg,3.50,0.70,4.20,"Brakes Foodservice, Selina Wamucii"
beefRibs,Proteins,kg,8.00,1.60,9.60,"Turner Price, AHDB"
lambLiver,Proteins,kg,5.00,1.00,6.00,"Brakes Foodservice"
prawns,Proteins,kg,8.00,1.60,9.60,"JJ Foodservice, Wright Brothers"
kingPrawns,Proteins,kg,10.00,2.00,12.00,"JJ Foodservice, AO Seafood"
salmon,Proteins,kg,12.00,2.40,14.40,"George Perry, King Crab"
seabass,Proteins,kg,10.00,2.00,12.00,"Wright Brothers"
calamari,Proteins,kg,7.00,1.40,8.40,"JJ Foodservice, Fish Port Bristol"
octopus,Proteins,kg,12.00,2.40,14.40,"Wright Brothers"
halibut,Proteins,kg,15.00,3.00,18.00,"Fish Port Bristol"
mincedBeef,Proteins,kg,5.50,1.10,6.60,"Brakes Foodservice, Turner Price"
groundLamb,Proteins,kg,6.50,1.30,7.80,"Brakes Foodservice"
lambChops,Proteins,kg,10.00,2.00,12.00,"JJ Foodservice, Tom Hixson"
lambShank,Proteins,kg,8.50,1.70,10.20,"Brakes Foodservice"
eggs,Proteins,unit,0.50,0.10,0.60,"Lowrie Foods"
squid,Proteins,kg,7.00,1.40,8.40,"JJ Foodservice, Fish Port Bristol"
parmesan,Dairy,kg,12.00,2.40,14.40,"Brakes Foodservice"
beefSirloin,Proteins,kg,10.00,2.00,12.00,"Turner Price, AHDB"
beefMince,Proteins,kg,5.50,1.10,6.60,"Brakes Foodservice"
oxCheek,Proteins,kg,7.00,1.40,8.40,"Tom Hixson"
pork,Proteins,kg,5.00,1.00,6.00,"Brakes Foodservice, The Grocer"
duck,Proteins,kg,10.00,2.00,12.00,"Turner Price"
greenlandPrawns,Proteins,kg,8.00,1.60,9.60,"Wright Brothers"
lobster,Proteins,kg,25.00,5.00,30.00,"Fine Food Specialist"
cod,Proteins,kg,10.00,2.00,12.00,"Fish Port Bristol"
kingScallops,Proteins,kg,20.00,4.00,24.00,"Wright Brothers"
mussels,Proteins,kg,6.00,1.20,7.20,"Barneys Billingsgate"
italianSausage,Proteins,kg,6.50,1.30,7.80,"Brakes Foodservice"
calabrianSausage,Proteins,kg,7.00,1.40,8.40,"Turner Price"
ndujaSausage,Proteins,kg,8.00,1.60,9.60,"Brakes Foodservice"
ham,Proteins,kg,6.00,1.20,7.20,"Brakes Foodservice"
sanDanieleHam,Proteins,kg,15.00,3.00,18.00,"Fine Food Specialist"
chickenLiverPate,Proteins,kg,5.00,1.00,6.00,"Turner Price"
tomatoes,Vegetables,kg,2.00,0.40,2.40,"George Perry, Selina Wamucii"
cherryTomatoes,Vegetables,kg,3.00,0.60,3.60,"Brakes Foodservice"
cucumbers,Vegetables,kg,1.50,0.30,1.80,"Tridge"
redOnions,Vegetables,kg,2.00,0.40,2.40,"Selina Wamucii"
onions,Vegetables,kg,2.00,0.40,2.40,"George Perry, The Grocer"
greenPeppers,Vegetables,kg,2.50,0.50,3.00,"Tridge"
redPeppers,Vegetables,kg,2.50,0.50,3.00,"Tridge"
cauliflower,Vegetables,kg,2.00,0.40,2.40,"Selina Wamucii"
potatoes,Vegetables,kg,1.00,0.20,1.20,"Selina Wamucii"
carrots,Vegetables,kg,1.20,0.24,1.44,"Tridge"
lettuce,Vegetables,kg,1.80,0.36,2.16,"The Grocer"
mushrooms,Vegetables,kg,3.00,0.60,3.60,"George Perry"
oysterMushrooms,Vegetables,kg,5.00,1.00,6.00,"Brakes Foodservice"
spinach,Vegetables,kg,3.50,0.70,4.20,"Selina Wamucii"
babySpinach,Vegetables,kg,4.00,0.80,4.80,"Brakes Foodservice"
truffle,Vegetables,kg,50.00,10.00,60.00,"Fine Food Specialist"
tenderStemBroccoli,Vegetables,kg,4.50,0.90,5.40,"Brakes Foodservice"
padronPeppers,Vegetables,kg,6.00,1.20,7.20,"Turner Price"
garlic,Vegetables,kg,3.50,0.70,4.20,"George Perry, Selina Wamucii"
mixedVegetables,Vegetables,kg,2.50,0.50,3.00,"Brakes Foodservice"
buttonMushrooms,Vegetables,kg,3.00,0.60,3.60,"George Perry"
porciniMushrooms,Vegetables,kg,20.00,4.00,24.00,"Fine Food Specialist"
jalapenos,Vegetables,kg,5.00,1.00,6.00,"Tridge"
lemons,Fruits,kg,2.00,0.40,2.40,"Selina Wamucii"
grapes,Fruits,kg,3.50,0.70,4.20,"Tridge"
avocado,Fruits,kg,4.00,0.80,4.80,"Selina Wamucii"
pineappleJuice,Fruits,L,1.50,0.30,1.80,"Brakes Foodservice"
lemonJuice,Fruits,L,2.00,0.40,2.40,"Turner Price"
limeJuice,Fruits,L,2.00,0.40,2.40,"Turner Price"
orangeJuice,Fruits,L,1.50,0.30,1.80,"Brakes Foodservice"
cranberryJuice,Fruits,L,1.80,0.36,2.16,"Brakes Foodservice"
feta,Dairy,kg,6.00,1.20,7.20,"Brakes Foodservice"
halloumi,Dairy,kg,7.00,1.40,8.40,"Turner Price"
mozzarella,Dairy,kg,6.00,1.20,7.20,"JJ Foodservice, The Grocer"
roquefortCheese,Dairy,kg,12.00,2.40,14.40,"Brakes Foodservice"
manchegoCheese,Dairy,kg,10.00,2.00,12.00,"Turner Price"
cream,Dairy,L,2.00,0.40,2.40,"Brakes Foodservice"
butter,Dairy,kg,3.00,0.60,3.60,"Lowrie Foods"
milk,Dairy,L,1.00,0.20,1.20,"Brakes Foodservice"
yogurt,Dairy,L,1.50,0.30,1.80,"Turner Price"
cheese,Dairy,kg,6.00,1.20,7.20,"Brakes Foodservice"
vanillaIceCream,Dairy,L,3.00,0.60,3.60,"Brakes Foodservice"
milkFroth,Dairy,L,1.20,0.24,1.44,"Brakes Foodservice"
rice,Grains,kg,1.50,0.30,1.80,"Brakes Foodservice"
couscous,Grains,kg,1.80,0.36,2.16,"Turner Price"
bulgur,Grains,kg,1.50,0.30,1.80,"Brakes Foodservice"
flour,Grains,kg,0.80,0.16,0.96,"Brakes Foodservice, The Grocer"
tortillaWraps,Grains,kg,2.00,0.40,2.40,"Brakes Foodservice"
pasta,Grains,kg,1.50,0.30,1.80,"Brakes Foodservice"
arborioRice,Grains,kg,2.50,0.50,3.00,"Turner Price"
pistachio,Nuts and Seeds,kg,12.00,2.40,14.40,"Brakes Foodservice"
almonds,Nuts and Seeds,kg,10.00,2.00,12.00,"Turner Price"
parsley,Herbs and Spices,kg,5.00,1.00,6.00,"George Perry"
dill,Herbs and Spices,kg,5.00,1.00,6.00,"George Perry"
rosemary,Herbs and Spices,kg,5.00,1.00,6.00,"George Perry"
cinnamonSugar,Herbs and Spices,kg,2.00,0.40,2.40,"Brakes Foodservice"
sumac,Herbs and Spices,kg,8.00,1.60,9.60,"Turner Price"
basilFresh,Herbs and Spices,kg,5.00,1.00,6.00,"George Perry"
oregano,Herbs and Spices,kg,5.00,1.00,6.00,"Turner Price"
sage,Herbs and Spices,kg,5.00,1.00,6.00,"Turner Price"
oliveOil,Oils and Vinegars,L,6.00,1.20,7.20,"Brakes Foodservice"
truffleOil,Oils and Vinegars,L,30.00,6.00,36.00,"Fine Food Specialist"
honey,Sweeteners,L,5.00,1.00,6.00,"Brakes Foodservice"
sugar,Sweeteners,kg,0.80,0.16,0.96,"Brakes Foodservice"
brownSugar,Sweeteners,kg,0.80,0.16,0.96,"Brakes Foodservice"
redWine,Beverages,bottle,4.00,0.80,4.80,"Brakes Foodservice"
whiteWine,Beverages,bottle,4.00,0.80,4.80,"Brakes Foodservice"
soda,Beverages,L,0.60,0.12,0.72,"Brakes Foodservice"
vodka,Beverages,L,15.00,3.00,18.00,"Turner Price"
gin,Beverages,L,15.00,3.00,18.00,"Turner Price"
hendricksGin,Beverages,L,25.00,5.00,30.00,"Brakes Foodservice"
coffeeBeans,Beverages,kg,10.00,2.00,12.00,"Brakes Foodservice"
americanoCoffee,Beverages,cup,0.20,0.04,0.24,"Turner Price"
turkishCoffee,Beverages,cup,0.30,0.06,0.36,"Turner Price"
teaBag,Beverages,unit,0.10,0.02,0.12,"Brakes Foodservice"
hotChocolatePowder,Beverages,kg,5.00,1.00,6.00,"Brakes Foodservice"
irishWhiskey,Beverages,L,30.00,6.00,36.00,"Turner Price"
espressoCoffee,Beverages,shot,0.20,0.04,0.24,"Turner Price"
stillWater,Beverages,L,0.30,0.06,0.36,"Brakes Foodservice"
sparklingWater,Beverages,L,0.40,0.08,0.48,"Brakes Foodservice"
coke,Beverages,L,0.80,0.16,0.96,"Brakes Foodservice"
dietCoke,Beverages,L,0.80,0.16,0.96,"Brakes Foodservice"
cokeZero,Beverages,L,0.80,0.16,0.96,"Brakes Foodservice"
tzatziki,Condiments,L,3.00,0.60,3.60,"Brakes Foodservice"
izgaraMayonnaise,Condiments,L,3.00,0.60,3.60,"Turner Price"
redPepperDip,Condiments,L,3.00,0.60,3.60,"Turner Price"
mayonnaise,Condiments,L,2.50,0.50,3.00,"Brakes Foodservice"
englishMustard,Condiments,L,2.50,0.50,3.00,"Brakes Foodservice"
frenchMustard,Condiments,L,2.50,0.50,3.00,"Brakes Foodservice"
bbqSauce,Condiments,L,2.50,0.50,3.00,"Brakes Foodservice"
chocolate,Baking Supplies,kg,6.00,1.20,7.20,"Brakes Foodservice"
gelatine,Baking Supplies,kg,6.00,1.20,7.20,"Turner Price"
olives,Canned Goods,kg,5.00,1.00,6.00,"Brakes Foodservice"
kalamataOlives,Canned Goods,kg,6.00,1.20,7.20,"Turner Price"
blackOlives,Canned Goods,kg,5.00,1.00,6.00,"Brakes Foodservice"
bottling,Miscellaneous,unit,0.50,0.10,0.60,"Estimated"
distribution,Miscellaneous,unit,0.30,0.06,0.36,"Estimated"
oakBarrel,Miscellaneous,L,4.00,0.80,4.80,"Estimated"
orzo,Miscellaneous,kg,2.00,0.40,2.40,"Brakes Foodservice"
sourdough,Miscellaneous,kg,3.00,0.60,3.60,"Turner Price"
pitta,Miscellaneous,kg,2.00,0.40,2.40,"Brakes Foodservice"
driedFruits,Miscellaneous,kg,7.00,1.40,8.40,"Brakes Foodservice"
churros,Miscellaneous,kg,3.00,0.60,3.60,"Turner Price"
meringue,Miscellaneous,kg,3.00,0.60,3.60,"Turner Price"
spicyTomatoSauce,Miscellaneous,L,2.50,0.50,3.00,"Brakes Foodservice"
chimichurri,Miscellaneous,L,3.00,0.60,3.60,"Turner Price"
guacamole,Miscellaneous,L,4.00,0.80,4.80,"Brakes Foodservice"
truffleMayonnaise,Miscellaneous,L,5.00,1.00,6.00,"Turner Price"
chorizo,Miscellaneous,kg,8.00,1.60,9.60,"Brakes Foodservice"
chorizoPicante,Miscellaneous,kg,9.00,1.80,10.80,"Turner Price"
sucuk,Miscellaneous,kg,8.00,1.60,9.60,"Estimated (similar to sausage)"
groundMince,Miscellaneous,kg,6.00,1.20,7.20,"Brakes Foodservice"
sherry,Miscellaneous,L,10.00,2.00,12.00,"Brakes Foodservice"
bechamelSauce,Miscellaneous,L,3.00,0.60,3.60,"Brakes Foodservice"
vanillaVodka,Miscellaneous,L,20.00,4.00,24.00,"Turner Price"
chambord,Miscellaneous,L,25.00,5.00,30.00,"Brakes Foodservice"
raki,Miscellaneous,L,20.00,4.00,24.00,"Turner Price"
bacardi,Miscellaneous,L,15.00,3.00,18.00,"Brakes Foodservice"
archers,Miscellaneous,L,18.00,3.60,21.60,"Turner Price"
coconutMilk,Miscellaneous,L,2.50,0.50,3.00,"Brakes Foodservice"
malibu,Miscellaneous,L,15.00,3.00,18.00,"Turner Price"
cucumberVodka,Miscellaneous,L,20.00,4.00,24.00,"Turner Price"
elderflowerLiqueur,Miscellaneous,L,20.00,4.00,24.00,"Brakes Foodservice"
lavenderSyrup,Miscellaneous,L,3.00,0.60,3.60,"Turner Price"
passoa,Miscellaneous,L,18.00,3.60,21.60,"Brakes Foodservice"
passionfruitSyrup,Miscellaneous,L,3.00,0.60,3.60,"Turner Price"
passionfruitPuree,Miscellaneous,L,4.00,0.80,4.80,"Brakes Foodservice"
cointreau,Miscellaneous,L,25.00,5.00,30.00,"Brakes Foodservice"
kahlua,Miscellaneous,L,20.00,4.00,24.00,"Turner Price"
chivasRegal,Miscellaneous,L,30.00,6.00,36.00,"Brakes Foodservice"
disaronno,Miscellaneous,L,20.00,4.00,24.00,"Turner Price"
strawberrySyrup,Miscellaneous,L,3.00,0.60,3.60,"Brakes Foodservice"
angosturaBitters,Miscellaneous,L,50.00,10.00,60.00,"Turner Price"
tequilaSilver,Miscellaneous,L,20.00,4.00,24.00,"Brakes Foodservice"
tabasco,Miscellaneous,L,10.00,2.00,12.00,"Brakes Foodservice"
jackDaniels,Miscellaneous,L,25.00,5.00,30.00,"Turner Price"
martiniRosso,Miscellaneous,L,15.00,3.00,18.00,"Brakes Foodservice"
campari,Miscellaneous,L,20.00,4.00,24.00,"Turner Price"
cachaca,Miscellaneous,L,18.00,3.60,21.60,"Brakes Foodservice"
havanaWhite,Miscellaneous,L,15.00,3.00,18.00,"Turner Price"
havanaDark,Miscellaneous,L,15.00,3.00,18.00,"Brakes Foodservice"
kraken,Miscellaneous,L,25.00,5.00,30.00,"Turner Price"
grenadine,Miscellaneous,L,3.00,0.60,3.60,"Brakes Foodservice"
wrayAndNephew,Miscellaneous,L,30.00,6.00,36.00,"Turner Price"
lime,Miscellaneous,unit,0.20,0.04,0.24,"George Perry"
mint,Miscellaneous,kg,5.00,1.00,6.00,"George Perry"
aperol,Miscellaneous,L,18.00,3.60,21.60,"Brakes Foodservice"
prosecco,Miscellaneous,L,10.00,2.00,12.00,"Brakes Foodservice"
proseccoBrut,Miscellaneous,L,12.00,2.40,14.40,"Turner Price"
proseccoRose,Miscellaneous,L,12.00,2.40,14.40,"Brakes Foodservice"
cava,Miscellaneous,L,10.00,2.00,12.00,"Brakes Foodservice"
efes,Miscellaneous,half,3.00,0.60,3.60,"Brakes Foodservice"
efesPint,Miscellaneous,pint,6.00,1.20,7.20,"Brakes Foodservice"
poretti,Miscellaneous,half,3.50,0.70,4.20,"Turner Price"
porettiPint,Miscellaneous,pint,6.50,1.30,7.80,"Brakes Foodservice"
estrellaDamm,Miscellaneous,half,3.50,0.70,4.20,"Brakes Foodservice"
estrellaDammPint,Miscellaneous,pint,6.00,1.20,7.20,"Turner Price"
kronenbourg,Miscellaneous,half,3.50,0.70,4.20,"Brakes Foodservice"
kronenbourgPint,Miscellaneous,pint,6.00,1.20,7.20,"Brakes Foodservice"
guinness,Miscellaneous,half,3.50,0.70,4.20,"Turner Price"
guinnessPint,Miscellaneous,pint,6.50,1.30,7.80,"Brakes Foodservice"
mythos,Miscellaneous,bottle,2.50,0.50,3.00,"Brakes Foodservice"
madri,Miscellaneous,bottle,2.50,0.50,3.00,"Turner Price"
corona,Miscellaneous,bottle,2.50,0.50,3.00,"Brakes Foodservice"
kopparberg,Miscellaneous,bottle,3.00,0.60,3.60,"Brakes Foodservice"
inches,Miscellaneous,bottle,3.20,0.64,3.84,"Turner Price"
sanMiguel,Miscellaneous,bottle,2.50,0.50,3.00,"Brakes Foodservice"
corona0,Miscellaneous,bottle,2.50,0.50,3.00,"Brakes Foodservice"
kopparberg0,Miscellaneous,bottle,2.50,0.50,3.00,"Turner Price"
cavaRose,Miscellaneous,L,10.00,2.00,12.00,"Brakes Foodservice"
cremantDeLoire,Miscellaneous,L,15.00,3.00,18.00,"Turner Price"
moet,Miscellaneous,L,50.00,10.00,60.00,"Brakes Foodservice"
moetRose,Miscellaneous,L,60.00,12.00,72.00,"Turner Price"
veuve,Miscellaneous,L,60.00,12.00,72.00,"Brakes Foodservice"
bollinger,Miscellaneous,L,80.00,16.00,96.00,"Brakes Foodservice"
laurentPerrier,Miscellaneous,L,90.00,18.00,108.00,"Turner Price"
riojaRose,Miscellaneous,L,10.00,2.00,12.00,"Brakes Foodservice"
egeoRose,Miscellaneous,L,10.00,2.00,12.00,"Turner Price"
pierrevertRose,Miscellaneous,L,12.00,2.40,14.40,"Brakes Foodservice"
heritageRose,Miscellaneous,L,12.00,2.40,14.40,"Brakes Foodservice"
spicedRum,Miscellaneous,L,18.00,3.60,21.60,"Brakes Foodservice"
eggWhite,Miscellaneous,unit,0.10,0.02,0.12,"Lowrie Foods"
amaretto,Miscellaneous,L,20.00,4.00,24.00,"Turner Price"
bourbon,Miscellaneous,L,25.00,5.00,30.00,"Brakes Foodservice"
peppercorns,Miscellaneous,kg,10.00,2.00,12.00,"Brakes Foodservice"
crouton,Miscellaneous,kg,2.00,0.40,2.40,"Br bottled"
vegetableStock,Miscellaneous,L,1.50,0.30,1.80,"Brakes Foodservice"
lemonZest,Miscellaneous,kg,2.00,0.40,2.40,"Selina Wamucii"
mascarpone,Miscellaneous,kg,6.00,1.20,7.20,"Brakes Foodservice"
cocoa,Miscellaneous,kg,15.00,3.00,18.00,"Turner Price"
pancetta,Miscellaneous,kg,8.00,1.60,9.60,"Brakes Foodservice"
bolognese,Miscellaneous,kg,5.00,1.00,6.00,"Brakes Foodservice"
vanilla,Miscellaneous,kg,20.00,4.00,24.00,"Turner Price"
marieRoseSauce,Miscellaneous,L,3.00,0.60,3.60,"Brakes Foodservice"
orange,Miscellaneous,kg,2.00,0.40,2.40,"Selina Wamucii"
breadcrumbs,Miscellaneous,kg,2.00,0.40,2.40,"Brakes Foodservice"
balsamicGlaze,Miscellaneous,L,5.00,1.00,6.00,"Turner Price"
saffron,Miscellaneous,kg,2000.00,400.00,2400.00,"Fine Food Specialist"
anchovies,Miscellaneous,kg,10.00,2.00,12.00,"Barneys Billingsgate"
artichoke,Miscellaneous,kg,5.00,1.00,6.00,"George Perry"
capers,Miscellaneous,kg,8.00,1.60,9.60,"Brakes Foodservice"
feverTree,Miscellaneous,unit,1.20,0.24,1.44,"Brakes Foodservice"
appletiser,Miscellaneous,unit,1.50,0.30,1.80,"Brakes Foodservice"
j20,Miscellaneous,unit,1.40,0.28,1.68,"Brakes Foodservice"
fruitShoot,Miscellaneous,unit,0.80,0.16,0.96,"Brakes Foodservice"
lemonade,Miscellaneous,L,1.00,0.20,1.20,"Brakes Foodservice"
bitterLemonade,Miscellaneous,L,1.20,0.24,1.44,"Brakes Foodservice"
fanta,Miscellaneous,L,1.00,0.20,1.20,"Brakes Foodservice"
sprite,Miscellaneous,L,1.00,0.20,1.20,"Brakes Foodservice"
kalamari,Proteins,kg,7.00,1.40,8.40,"Same as calamari"
aubergine,Vegetables,kg,2.50,0.50,3.00,"Selina Wamucii"
courgette,Vegetables,kg,2.50,0.50,3.00,"Selina Wamucii"
mashedPotatoes,Vegetables,kg,1.50,0.30,1.80,"Brakes Foodservice (prepared)"
rosemaryPotatoes,Vegetables,kg,1.50,0.30,1.80,"Brakes Foodservice (prepared)"
tripleCookedChips,Vegetables,kg,2.00,0.40,2.40,"Brakes Foodservice (prepared)"
frenchFries,Vegetables,kg,2.00,0.40,2.40,"Brakes Foodservice (prepared)"
filo,Miscellaneous,kg,3.00,0.60,3.60,"Brakes Foodservice"
ezme,Condiments,L,3.00,0.60,3.60,"Estimated (similar to tzatziki)"
sugarSyrup,Sweeteners,L,2.00,0.40,2.40,"Brakes Foodservice"
espressoLungo,Beverages,shot,0.20,0.04,0.24,"Same as espressoCoffee"
kiwiPuree,Fruits,L,4.00,0.80,4.80,"Turner Price"
cocaCola,Beverages,L,0.80,0.16,0.96,"Same as coke"
steamedMilk,Dairy,L,1.20,0.24,1.44,"Same as milkFroth"
tiaMaria,Miscellaneous,L,20.00,4.00,24.00,"Brakes Foodservice"
coffeeSweet,Beverages,kg,0.80,0.16,0.96,"Same as sugar"
hotWater,Beverages,L,0.10,0.02,0.12,"Estimated"
baileysCream,Miscellaneous,L,20.00,4.00,24.00,"Brakes Foodservice"
brandySpirit,Miscellaneous,L,25.00,5.00,30.00,"Turner Price"
chilli,Miscellaneous,unit,0.20,0.04,0.24,"George Perry"
beef,Proteins,kg,10.00,2.00,12.00,"Same as beefSirloin"
madeira,Miscellaneous,L,12.00,2.40,14.40,"Brakes Foodservice"
mortadella,Miscellaneous,kg,7.00,1.40,8.40,"Brakes Foodservice"
goatCheese,Dairy,kg,8.00,1.60,9.60,"Turner Price"
ricotta,Dairy,kg,6.00,1.20,7.20,"Brakes Foodservice"
granaPadano,Dairy,kg,10.00,2.00,12.00,"Brakes Foodservice"
springOnions,Vegetables,kg,3.00,0.60,3.60,"Selina Wamucii"
sunDriedTomatoes,Vegetables,kg,6.00,1.20,7.20,"Brakes Foodservice"
asparagus,Vegetables,kg,5.00,1.00,6.00,"Selina Wamucii"
beetroot,Vegetables,kg,2.00,0.40,2.40,"Selina Wamucii"
rocket,Vegetables,kg,4.00,0.80,4.80,"Brakes Foodservice"
courgettes,Vegetables,kg,2.50,0.50,3.00,"Selina Wamucii"
apples,Fruits,kg,2.00,0.40,2.40,"Selina Wamucii"
pineapple,Fruits,kg,3.00,0.60,3.60,"Selina Wamucii"
lemonButter,Miscellaneous,kg,4.00,0.80,4.80,"Estimated (butter-based)"
basilOil,Oils and Vinegars,L,8.00,1.60,9.60,"Turner Price"
marsalaWine,Beverages,L,10.00,2.00,12.00,"Brakes Foodservice"
egg,Proteins,unit,0.50,0.10,0.60,"Same as eggs"
lemon,Fruits,kg,2.00,0.40,2.40,"Same as lemons"
coffee,Beverages,kg,10.00,2.00,12.00,"Same as coffeeBeans"
pepperoni,Proteins,kg,7.00,1.40,8.40,"Brakes Foodservice"
freshChilli,Miscellaneous,unit,0.20,0.04,0.24,"Same as chilli"
ginger,Herbs and Spices,kg,5.00,1.00,6.00,"Selina Wamucii"
peppercorn,Herbs and Spices,kg,10.00,2.00,12.00,"Same as peppercorns"
greenPeppercorn,Herbs and Spices,kg,12.00,2.40,14.40,"Turner Price"
demiGlace,Miscellaneous,L,5.00,1.00,6.00,"Brakes Foodservice"
italianHerbs,Miscellaneous,kg,5.00,1.00,6.00,"Turner Price"
bechamel,Miscellaneous,L,3.00,0.60,3.60,"Same as bechamelSauce"
cinnamon,Herbs and Spices,kg,5.00,1.00,6.00,"Brakes Foodservice"
appleJuice,Fruits,L,1.50,0.30,1.80,"Brakes Foodservice"
"""

# Parse CSV data
price_data = []
csv_file = StringIO(csv_data)
reader = csv.DictReader(csv_file)
for row in reader:
    price_data.append({
        'ingredient': row['Ingredient'],
        'unit': row['Unit'],
        'category': row['Category'],
        'price_incl_vat': float(row['Final Price (incl. VAT)'])
    })

def determine_new_unit(old_unit, ingredient, category):
    """Determine the new unit for buying price based on ingredient type."""
    liquid_categories = ['Beverages', 'Oils and Vinegars', 'Condiments', 'Sweeteners']
    if old_unit in ['g', 'kg'] and category not in liquid_categories:
        return 'kg'
    elif old_unit in ['ml', 'L'] and category in liquid_categories:
        return 'L'
    elif old_unit in ['unit', 'half', 'pint', 'bottle', 'cup', 'shot']:
        return old_unit
    else:
        print(f"Warning: Unhandled unit for {ingredient}: {old_unit}, category: {category}")
        return old_unit

def update_menu_costs():
    try:
        # Load menu data
        with open('server/menus.json', 'r') as f:
            data = json.load(f)
        
        # Normalize ingredient names (e.g., kalamari -> calamari)
        ingredient_aliases = {
            'kalamari': 'calamari',
            'aubergine': 'aubergine',
            'courgette': 'courgette',
            'cocaCola': 'coke',
            'espressoLungo': 'espressoCoffee',
            'coffeeSweet': 'sugar',
            'hotWater': 'hotWater',
            'baileysCream': 'baileysCream',
            'brandySpirit': 'brandySpirit',
            'chilli': 'chilli',
            'freshChilli': 'chilli',
            'egg': 'eggs',
            'lemon': 'lemons',
            'coffee': 'coffeeBeans',
            'peppercorn': 'peppercorns',
            'bechamel': 'bechamelSauce',
            'beef': 'beefSirloin'
        }
        
        # Update costs and units for initialIngredients only
        for menu_key in ['izMenu', 'bellFood']:
            ingredients = data[menu_key]['initialIngredients']
            for name in list(ingredients.keys()):
                details = ingredients[name]
                # Ensure category exists
                if 'category' not in details:
                    details['category'] = 'Miscellaneous'
                    print(f"Warning: Added default category 'Miscellaneous' for {name}")
                
                # Handle aliases
                normalized_name = ingredient_aliases.get(name.lower(), name.lower())
                
                # Find matching price data
                for price_entry in price_data:
                    if price_entry['ingredient'].lower() == normalized_name:
                        # Determine new unit for buying price
                        new_unit = determine_new_unit(details['unit'], name, price_entry['category'])
                        # Set cost to match new unit
                        price = price_entry['price_incl_vat']
                        details['cost'] = round(price, 2)
                        details['unit'] = new_unit
                        details['category'] = price_entry['category']
                        break
                else:
                    print(f"Warning: No price found for {name}")
        
        # Save updated menu data
        with open('server/menus.json', 'w') as f:
            json.dump(data, f, indent=2)
        
        print("Successfully updated server/menus.json with new wholesale prices (kg for solids, L for liquids). Recipe quantities remain in g/ml.")
    except FileNotFoundError:
        print("Error: server/menus.json not found. Please ensure the file exists in the correct directory.")
    except Exception as e:
        print(f"Error updating menu costs: {e}")

if __name__ == "__main__":
    update_menu_costs()
