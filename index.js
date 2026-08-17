const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const playerStats = 
{
    "health": 3,
    "maxHealth": 8,
    "stamina": 3,
    "maxStamina": 5,
    "food": 3,
    "nestingMaterials": 2,
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

Your nose flares, the scent of salt air from the river mixes with stale rain 
on the cobblestones. 

You wake behind a row of rusted bins tucked into a steep Lisboa alley, 
your belly hollow and fur slicked with soot. Faint streetlights 
cast long, sharp shadows across the narrow passage. 

The city never sleeps, and it certainly doesn't look out for stray cats.

Your ears twitch from the busy night sounds. You need food, dry shelter, and 
a warm spot to rest before the river chill sets in.

=============================================================================
`;
    console.log(introText);
}

function gameLoop(){
    // 1. Check if the cat is dead before starting the turn
    if (playerStats.health <= 0) {
        displayStats();
        console.log("\n💀 Game Over! Our stray cat couldn't survive the city...");
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
    console.log("4. Build shelter (Costs 5 Nesting Materials, 2 Stamina, 1 Food)");
    console.log("0. Quit Game");

    // 4. Prompt the player for input
    rl.question("\nEnter your choice (1-3): ", (answer) => {
        console.log("\n-------------------------------------------");

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

            case '4':
                buildShelter();
                break;

            default:
                console.log("❗ Invalid choice! Pick 1, 2, or 3.");
                gameLoop();
                break;
        };
    });
}

function promptRestMenu() {
    console.log("\nWhere should we rest?");
    console.log("1. On the street (Dangerous, free, chance of extra stamina)");
    console.log("2. In an alleyway (Medium risk, optional materials cost)");
    console.log("3. Bakery rooftop (Safe, costs 1 Stamina, extra health)");

    rl.question("\nChoose rest spot (1-3): ", (choice) => {
        console.log("\n-------------------------------------------");
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

function rest(locationChoice){
    // Dice roll for where resting will be
    // 0 = street, 1 = alleyway box, 2 = rooftop
    // let restLoc = Math.floor(Math.random() * 3);

    let dogAttack, catAttack, humanAttack, humanPetting;

    if(locationChoice === 1){ // street
        console.log("Against all our instincts, we decided to sleep in the street.");
        
        // Roll dice for positive and negative rest interruptions
        dogAttack = Math.random() < 0.4;
        humanAttack = Math.random() < 0.3;
        humanPetting = Math.random() < 0.3;

        if(dogAttack){
            adjustHealth(-2);
            console.log("\n************");
            console.log("🐕 A stray dog bit us!");
            console.log("📐 Lost 2 Health.");
            console.log("************");
        }
        
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
                console.log("\n************");

            } else {
                console.log(`${playerStats.pettedCount}/3 pettings needed for Trust`);
            }
        }

                
        if(!dogAttack && !humanAttack){
            adjustStamina(1);
            console.log("\n************");
            console.log("😹 Against all odds we rested peacefully.");
            console.log("📐 Gained 1 Stamina.");
            console.log("************");
        }
        
        // adjustStamina(1);
        gameLoop();

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
        if(playerStats.stamina > 0){
            console.log("Feeling for a scenic view and some piece, we climb our way up to the rooftop of the local bakery.");
            console.log("📐 Lose 1 Stamina. Gain 2 Health.");
            adjustStamina(-2);
            adjustHealth(2);
        } else {
            console.log("😫 We don't have enough stamina to climb up.");
        }
        gameLoop();
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

function unprotectedAlleyRest(){
    let catAttack = Math.random() < 0.3;
    let dogAttack = Math.random() < 0.25;
    if(catAttack) {
        adjustHealth(-1);
        adjustFood(-1);
        console.log("😼 A rival cat attacks us and steals our food.");
    }
    if(dogAttack) {
        adjustHealth(-2);
        console.log("\n************");
        console.log("🐕 A stray dog bit us!");
        console.log("📐 Lost 2 Health.");
        console.log("************");
    }
    if(!catAttack && !dogAttack){
        adjustStamina(2);
        adjustHealth(1);
        console.log("😸 We had a peaceful rest!");
    }
    gameLoop();    
}

// displayStats();
// rest(1);
// // adjustStamina(-1);
// // adjustHealth(-2);
// displayStats();

start();
printIntro();
gameLoop();