// Imports
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Display and setup
const playerStats = 
{
    "health": 3,
    "maxHealth": 8,
    "stamina": 3,
    "maxStamina": 5,
    "food": 1,
    "nestingMaterials": 0,
    "humanTrust": 0,
    "pettedCount": 0, // when this reaches 3 humanTrust increases by 1
    "catAllies": 0 // if dog attack won, this increases by 1
};

function start(){
    const titleScreen = `
       ___                                                  ___
     _/  /\\                                                /\\  \\_
    /   / /    |======================================|    \\ \\   \\
   /___/ /     |                                      |     \\ \\___\\
   \\___\\/      |              JUST ANOTHER            |      \\/___/
               |               STREET CAT             |
               |                                      |
               |======================================|
                              _..---.._
                            .'         '.      
                           /   /\\   /\\   \\  
                          |   /  \\_/  \\   | 
                          |  |  o___-  |  |   
                          |   \\  \\_/  /   | 
                           \\   \\/   \\/   /     
                            '._       _.'      
                               ''---''
`;

    console.log(titleScreen);
}

function printIntro() {
    const introText = `=============================================================================
                                INTRO
=============================================================================

The scent of salt air from the river mixes with stale rain 
on the cobblestones.

You wake behind a row of rusted bins tucked into a side alley, fur wet and
belly hollow.

Faint streetlights cast long, sharp shadows across the narrow passage. 

The city never sleeps, and it certainly doesn't look out for stray cats.

Your ears twitch from the late night sounds. You need food, dry shelter, and 
a warm spot to rest before the river chill sets in.

=============================================================================
`;
    console.log(introText);
}

function displayStats(){
    console.log(
`\n=== STRAY CAT SURVIVAL ===
    Health: ${playerStats.health}/${playerStats.maxHealth}
    Stamina: ${playerStats.stamina}/${playerStats.maxStamina}
    Food: ${playerStats.food}
    Nesting Materials (cardboard, rags): ${playerStats.nestingMaterials}
    Human Trust: ${playerStats.humanTrust}
    Cat Allies: ${playerStats.catAllies}
==========================`
    );
}


// Main game loop
function gameLoop(){
    // 1. Check if the cat is dead before starting the turn
    if (playerStats.health <= 0) {
        displayStats();
        console.log("\n💀 Game Over! Our stray cat couldn't survive the city... 🎻");
        rl.close();
        return;
    }
    
    if ( playerStats.catAllies >= 3 ){
        displayStats();
        console.log("\n👑 VICTORY! You scared off enough dogs to earn the respect of the city strays. You rule the streets!");
        rl.close();
        return;
    }

    if (playerStats.humanTrust >= 3) {
        displayStats();
        console.log("\n🏠 VICTORY! A kind human took you off the streets. You're an indoor cat now!");
        rl.close();
        return;
    }

    // 2. Display current status
    displayStats();

    // 3. Print main menu options
    console.log("\nWhat should we do?");
    console.log("1. Scavenge");
    console.log("2. Rest");
    console.log("3. Eat");
    console.log("0. Quit Game");

    // 4. Prompt the player for input
    rl.question("\nEnter your choice (0-3): ", (answer) => {

        switch(answer.trim()){
            case '0':
                console.log("Thanks for playing! Goodbye 🐾");
                rl.close();
                break;

            case '1':
                scavenge();
                gameLoop(); // Start next turn
                break;

            case '2':
                promptRestMenu(); // Open rest menu
                break;
            
            case '3':
                eatFood();
                gameLoop();
                break;

            default:
                console.log("❗ Invalid choice! Pick 1, 2, 3 or 0.");
                gameLoop();
                break;
        };
    });
}

// Primary actions
function scavenge(){
    if( playerStats.stamina > 0 ){
        adjustStamina(-1);
        let foundFood = Math.random() < 0.5;
        let foundNestingMaterials = Math.random() < 0.5;
        if( foundFood ){
            adjustFood(1);
            console.log("🐟 Found food!");
        }
        if ( foundNestingMaterials ) {
            adjustNestingMaterials(1);
            console.log("📦 Found nesting materials!");
        }
        if (!foundFood && !foundNestingMaterials) {
            console.log("😾 Found nothing...");
        }
    } else {
        console.log("😿 Too tired to scavenge...");
    }
}

function eatFood(){
    if(playerStats.food > 0){
        if(playerStats.health < playerStats.maxHealth){
            adjustFood(-1);
            adjustHealth(0.5);
            console.log("🍖 Nom nom... Restored 0.5 Health!");
        } else {
            console.log("Not hungry... let's save our food for later.");
        }
    } else {
        console.log("😾 We don't have any food...");
    }
}

// Resting paths
function promptRestMenu() {
    console.log("\nWhere should we rest?");
    console.log("1. On the street (Dangerous, free, chance of extra stamina)");
    console.log("2. In an alleyway (Medium risk, optional materials cost)");
    console.log("3. Bakery rooftop (Safe, costs 1 Stamina, extra health)");

    rl.question("\nChoose rest spot (1-3): ", (choice) => {
        const locationChoice = parseInt(choice.trim());

        if( locationChoice >= 1 && locationChoice <= 3){
            rest(locationChoice);
        } else {
            console.log("❗ Invalid rest spot selected!");
            gameLoop();
        }

        // gameLoop();
    });
}

function rest(locationChoice){
    // Dice roll for where resting will be
    // 0 = street, 1 = alleyway box, 2 = rooftop
    // let restLoc = Math.floor(Math.random() * 3);

    let dogAttack, catAttack, humanAttack, humanPetting;

    if(locationChoice === 1){ // street
        console.log("Feeling lucky, we decide to sleep in the street.");
        
        // Roll dice for positive and negative rest interruptions
        humanAttack = Math.random() < 0.3;
        humanPetting = Math.random() < 0.3;
        dogAttack = Math.random() < 0.4;
        
        if(humanAttack){
            adjustHealth(-1);
            console.log("\n************");
            console.log("🥾 A mean kid kicked us!");
            console.log("📐 Lost 1 Health.");
            console.log("************");
        }
        
        if(humanPetting) {
            adjustHealth(1);
            adjustStamina(1);
            console.log("************");
            console.log("A kind human petted us... Rrrr-gurr-gurr...");
            console.log("📐 Gained 1 Health and 1 Stamina.");
            console.log("\n************");

            // Add 1 to petted count and if petted 3 times increase human rust and reset petted count to 0
            playerStats.pettedCount += 1;
            if( playerStats.pettedCount === 3){
                playerStats.humanTrust += 1;
                playerStats.pettedCount = 0;
                console.log("\n************");
                console.log("🤙🏽 We've been petted three times!");
                console.log("📐 Gained 1 Human Trust");
                console.log("************");
            } else {
                console.log(`ℹ️ ${playerStats.pettedCount}/3 pettings needed for Trust`);
            }
        }

        if(!dogAttack && !humanAttack){
            adjustStamina(1);
            console.log("\n************");
            console.log("😹 Against all odds we rested peacefully.");
            console.log("📐 Gained 1 Stamina.");
            console.log("************");
        }

        if(dogAttack){
            handleDogPrompt();
        } else {
            gameLoop();
        }
       
        // gameLoop();

    } else if (locationChoice === 2) { // alleyway
        console.log("We decide to sleep in the alley.");

        if(playerStats.nestingMaterials > 0) {
           
            rl.question("\nUse Nesting Materials? Y/N: ", (choice) => {
                console.log("\n-------------------------------------------");
                switch(choice.trim().toUpperCase()){

                    case 'Y':
                        adjustNestingMaterials(-1);
                        catAttack = Math.random() < 0.2;
                        if(catAttack) {
                            adjustHealth(-1);
                            adjustFood(-1);
                            adjustNestingMaterials(-1);
                            console.log("\n************");
                            console.log("😼 A rival cat attacks us, steals our food and nesting materials, pees in our spot and walks off!");
                            console.log("📐 Lost 1 Health, Food, and Nesting Materials.");
                            console.log("************");
                            
                        } else {
                            adjustStamina(2);
                            adjustHealth(1);
                            console.log("\nWe had a peaceful rest!");
                            console.log("📐 Gained 2 Stamina and 1 Health.");
                            
                        }
                        gameLoop();
                        break;

                    case 'N':
                        unprotectedAlleyRest();
                        break;

                    default:
                        console.log("❗ Invalid choice! Answer 'Y' or 'N'");
                        gameLoop();
                        break;
                }
                
            });
        } else {
            unprotectedAlleyRest();
        }

    } else if (locationChoice === 3) { // rooftop
        if(playerStats.stamina >= 1){
            console.log("Feeling for a scenic view and some piece, we climb our way up to the rooftop of the local bakery.");
            console.log("📐 Lose 1 Stamina. Gain 2 Health.");
            adjustStamina(-1);
            adjustHealth(2);
        } else {
            console.log("😫 We are exhausted (0 stamina) and can't make the climb.");
        }
        gameLoop();
    }
}

function unprotectedAlleyRest(){
    let catAttack = Math.random() < 0.4;
    let dogAttack = Math.random() < 0.3;

    if(catAttack) {
        adjustHealth(-1);
        adjustFood(-1);
        console.log("😼 A rival cat attacks us and steals our food.");
    }

    if(!catAttack && !dogAttack){
        adjustStamina(2);
        adjustHealth(1);
        console.log("😸 We had a peaceful rest!");
    }

    if(dogAttack) {
        handleDogPrompt();
    } else {
        gameLoop();
    }
}


// Encounters
function handleDogPrompt(){
    // IF food > 0:
    if( playerStats.food > 0 ){
        // game prompts: "Toss 1 Food to distract the dog? (Y/N)"
        console.log("\nA dog approaches growling at us. This could end badly...");
        rl.question("Toss 1 Food to distract the dog❔ (Y/N)", (choice) => {
            // IF Y: "You toss some food to the dog and make a quick escape"
            if( choice.trim().toUpperCase() === "Y"){
                adjustFood(-1);
                console.log("\n************");
                console.log("You toss some food at the dog and make a quick escape.");
                console.log("Gave up 1 Food.");
                if(playerStats.food === 0) console.log("‼️ That was our last bit of grub. We need to find more food!");
                console.log("************");
                gameLoop();
            } else {
                attemptDogScare();
            }
        });

    } else {
        attemptDogScare();
    }
}

function attemptDogScare(){
    // Else:
    if( playerStats.health <= 2 ){
        // IF health <= 2: 20% chance to scare dog away on adrenaline.
        let scareDogAway = Math.random() < 0.2;
        if( scareDogAway ){
            adjustCatAllies(1);
            console.log("\n************");
            console.log("\n***ADRENALINE SURGE***");
            console.log("In our disorientated moment of desparation, something takes over and we channel OUR inner lion. Hissing menacingly, we arch our back and puff our fur, somehow causing the dog to piss itself and run away wimpering.");
            console.log("Holy shit! That actually worked... we scared the dog away! Gain 1 Cat Ally.");
            console.log("************");
            gameLoop();
        } else {
            standardDogAttack();
        }

    } else if ( playerStats.health > 2 && playerStats.stamina > 1 ){
        // ELSE IF health > 2 && stamina > 1: roll dice giving cat chance to puff up, hiss and scare dog.
        let scareDogAway = Math.random() < 0.3;
        if( scareDogAway ){
            adjustCatAllies(1);
            console.log("\n************");
            console.log("We hiss menacingly, arch our back and puff our fur, scaring the dog away.");
            console.log("Can't believe that worked. That ain't no dog!");
            console.log("************");
            gameLoop();
        } else {
            standardDogAttack();
        }
    } else {
        standardDogAttack();
    }
}

function standardDogAttack(){
    adjustHealth(-2);
    console.log("\n************");
    console.log("🐕 A stray dog bit us!");
    console.log("📐 Lost 2 Health.");
    console.log("************");
    gameLoop();
}


// Stat mutators
function adjustFood(x){
    playerStats.food += x;
    playerStats.food = Math.max(playerStats.food, 0);
}

function adjustNestingMaterials(x){
    playerStats.nestingMaterials += x;
    playerStats.nestingMaterials = Math.max(playerStats.nestingMaterials, 0);   
}

function adjustHealth(x){
    playerStats.health += x;
    playerStats.health = Math.min( playerStats.health, playerStats.maxHealth);
    playerStats.health = Math.max(playerStats.health, 0);
}

function adjustStamina(x){
    playerStats.stamina += x;
    playerStats.stamina = Math.min(playerStats.stamina, playerStats.maxStamina);
    playerStats.stamina = Math.max(playerStats.stamina, 0);
}

function adjustHumanTrust(x){
    playerStats.humanTrust += x;
    playerStats.humanTrust = Math.max(playerStats.humanTrust, 0);
}

function adjustCatAllies(x){
    playerStats.catAllies += x;
    playerStats.catAllies = Math.max(playerStats.catAllies, 0);
}

// Game init
start();
printIntro();
gameLoop();