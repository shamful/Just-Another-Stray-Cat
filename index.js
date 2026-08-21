// Imports
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Display and setup
const playerStats = 
{
    "turn": 0,
    "turnsSinceEaten": 0,
    "health": 3,
    "maxHealth": 8,
    "stamina": 3,
    "maxStamina": 5,
    "food": 1,
    "nestingMaterials": 0,
    "pettedCount": 0, // when this reaches 3 increases humanBond by 1
    "humanBond": 0,
    "catAllies": 0, // if dog attack won, this increases by 1
    "friendlyVibeCountdown": 0 // if dog fed and left to eat in peace -> more chance of human interaction
};

const historyGameplay = [];
let currentTurnLog = [];

function recordTurn(log){
    let turnDetails = {
        "playerStats": { ...playerStats }, // frozen snapshot of playerStats
        "log": log // e.g. [ "Attacked by cat", "Bit by dog", "5 turns passed. You ate 1 food to stay nourished."]
    }

    historyGameplay.push(turnDetails);
}

function advanceTurn(){
    playerStats.turn +=1;
    playerStats.turnsSinceEaten += 1;
    
    // Update friendly vibe countdown
    if( playerStats.friendlyVibeCountdown > 0 ) {
        playerStats.friendlyVibeCountdown -= 1;
        if(playerStats.friendlyVibeCountdown === 0){
            log("Outcome", "Friendly vibe reset. You no longer emit friendly vibes to humans.");
        }
    }

    if( playerStats.turnsSinceEaten >= 7 ){
        playerStats.turnsSinceEaten = 0;
        console.log("\n==============");
        if( playerStats.food >= 0.5 ){
            adjustFood(-0.5);
            log("Outcome", "🥣 7 turns passed. You ate half a ration of food to stay nourished.");
        } else {
            adjustHealth(-1);
            log("Outcome", "😩 You haven't eaten in 7 turns and have no food! 🔻 Lost 1 Health from hunger.");
        }
        console.log("==============");
    }

    recordTurn([...currentTurnLog]);
    currentTurnLog = [];
}

// Log events loggin helpers
function log(type, msg){
    console.log(msg);
    currentTurnLog.push(type + ": " + msg);
}

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
`\n======= CAT STATS =======
  Turn: ${playerStats.turn}
  Health: ${playerStats.health}/${playerStats.maxHealth}
  Stamina: ${playerStats.stamina}/${playerStats.maxStamina}
  Food: ${playerStats.food}
  Nesting Materials (cardboard, rags): ${playerStats.nestingMaterials}
  Human Petted: ${playerStats.pettedCount}
  Human Bond: ${playerStats.humanBond}
  Cat Allies: ${playerStats.catAllies}
  Friendly Vibe: ${playerStats.friendlyVibeCountdown}
==========================`
    );
}



// Main game loop
function gameLoop(){
    // 1. Check if the cat is dead before starting the turn

    
    if ( playerStats.catAllies >= 3 ){
        displayStats();
        let deathMessage = playerStats.health <= 0 ? '\n🪦 Unfortunately, your injuries from living on the streets were too severe. Your cat allies mourn your death for a brief moment and move on... ' : '';
        log("Outcome", `\n👑 VICTORY! You scared off enough dogs to earn the respect of the city strays. You rule the streets!${ deathMessage }`);
        recordTurn([...currentTurnLog]);
        rl.close();
        return;
    }

    if (playerStats.humanBond >= 3) {
        displayStats();
        let deathMessage = playerStats.health <= 0 ? '\n🪦 Unfortunately, your injuries from living on the streets were too severe. You passed away peacefully in their arms on the ride home, finally warm and loved, but dead...':'';
        log("Outcome", `\n🏠 VICTORY! A kind human took you off the streets. You're an indoor cat now!${ deathMessage }`);
        recordTurn([...currentTurnLog]);
        rl.close();
        return;
    }

    if (playerStats.health <= 0) {
        displayStats();
        log("Outcome", "\n💀 Game Over! Our stray cat couldn't survive the city... 🎻🪦");
        recordTurn([...currentTurnLog]);
        rl.close();
        return;
    }

    // 2. Display current status
    displayStats();

    // 3. Print main menu options
    console.log("\nWhat should we do?");
    console.log("1. Scavenge");
    console.log("2. Walk the Street");
    console.log("3. Rest");
    console.log("4. Eat");
    console.log("0. Quit Game");

    // 4. Prompt the player for input
    rl.question("\nEnter your choice (0-4): ", (answer) => {

        switch(answer.trim()){
            case '0':
                console.log("Thanks for playing! Goodbye 🐾");
                rl.close();
                break;

            case '1':
                scavenge();
                break;

            case '2':
                walkTheStreet();
                break;

            case '3':
                promptRestMenu(); // Open rest menu
                break;
            
            case '4':
                eatFood();
                break;

            default:
                console.log("❗ Invalid choice! Pick 1, 2, 3, 4 or 0.");
                gameLoop();
                break;
        };
    });
}

// Primary actions
function scavenge(){
    
    if( playerStats.stamina > 0 ){
        adjustStamina(-1);
        log("Action", "🔎 Scavenge for food and materials.");

        let foundFood = Math.random() < 0.5;
        let foundNestingMaterials = Math.random() < 0.5;
        if( foundFood ){
            adjustFood(1);
            log("Outcome", "🐟 Found food!");
        }
        if ( foundNestingMaterials ) {
            adjustNestingMaterials(1);
            log("Outcome", "📦 Found nesting materials!");
        }
        if (!foundFood && !foundNestingMaterials) {
            log("Outcome", "😾 Found nothing...");
        }
        advanceTurn();
    } else {
        console.log("😿 Too tired to scavenge...");
    }
    gameLoop();

}

function walkTheStreet(){
    if( playerStats.stamina > 0){
        adjustStamina(-1);
        log("Action", "Feeling lucky, we decide to walk the street. Anything could happen...");
        
        // Roll dice for positive and negative rest interruptions
        let humanAttack = Math.random() < 0.3;
        let humanPetting = playerStats.friendlyVibeCountdown > 0 ? Math.random() < 0.6 : Math.random() < 0.3;
        let dogAttack = Math.random() < 0.4;
        
        if(humanAttack){
            adjustHealth(-1);

            console.log("\n************");
            log("Outcome", "🥾 A mean kid kicked us!");
            log("Outcome", "🔻 Lost 1 Health.");
            console.log("************");
        }
        
        if(humanPetting) {
            adjustHealth(1);
            adjustStamina(1);
            console.log("\n************");
            log("Outcome", "A kind human petted us... Rrrr-gurr-gurr...");
            log("Outcome", "🔺 Gained 1 Health and 1 Stamina.");
            

            // Add 1 to petted count and if petted 3 times increase human bond and reset petted count to 0
            playerStats.pettedCount += 1;
            if( playerStats.pettedCount === 3){
                adjustHumanBond(1);
                playerStats.pettedCount = 0;

                log("Outcome", "\n🤙🏽 We've been petted three times!");
                log("Outcome", "🔺 Gained 1 Human Bond 💕");

            } else {
                let needed = 3 - playerStats.pettedCount;
                log("Outcome", `ℹ️  ${needed} more petting${needed > 1 ? 's' : ''} needed for human bond.`);
            }
            console.log("************");
        }

        if(!dogAttack && !humanAttack){
            console.log("\n************");
            log("Outcome", "😹 That was a nice walk.");
            console.log("************");
        }

        if(dogAttack){
            handleDogPrompt();
        } else {
            advanceTurn();
            gameLoop();
        }
    } else {
        console.log("😿 Too tired to walk the street...");
        gameLoop();
    }
}

function eatFood(){
    
    if(playerStats.food > 0){
        if(playerStats.health < playerStats.maxHealth){
            adjustFood(-1);
            adjustHealth(1);
            log("Action", "🍖 Nom nom... ate 1 food.");
            log("Outcome", "Restored 1 Health!");
            playerStats.turnsSinceEaten = 0;
            advanceTurn();
        } else {
            console.log("Not hungry... let's save our food for later.");
        }
    } else {
        console.log("😾 We don't have any food...");
    }
    gameLoop();
}

// Resting paths
function promptRestMenu() {
    console.log("\nWhere should we rest?");
    console.log("1. In an alleyway (Medium risk, optional materials cost)");
    console.log("2. Bakery rooftop (Safe, costs 1 Stamina, +1 health)");

    rl.question("\nChoose rest spot (1-2): ", (choice) => {
        const locationChoice = parseInt(choice.trim());

        if( locationChoice >= 1 && locationChoice <= 2){
            rest(locationChoice);
        } else {
            console.log("❗ Invalid rest spot selected!");
            gameLoop();
        }

        // gameLoop();
    });
}

function rest(locationChoice){
    
    if (locationChoice === 1) { // alleyway
        console.log("We decide to sleep in the alley.");

        if(playerStats.nestingMaterials > 0) {
           
            rl.question("\nUse Nesting Materials? Y/N: ", (choice) => {
                console.log("\n-------------------------------------------");
                switch(choice.trim().toUpperCase()){

                    case 'Y':
                        log("Action", "We use our nesting materials while resting in the alley.");
                        adjustNestingMaterials(-1);

                        let catAttack = Math.random() < 0.1;
                    
                        if(catAttack) {
                            adjustHealth(-1);
                            adjustFood(-1);
                            adjustStamina(1);
                            console.log("\n************");
                            log("Outcome", `😼 A rival cat attacks us, ${playerStats.food>0 ? 'steals our food, ':''}pees in our spot, and walks off!`);
                            log("Outcome", "🔻 Lost 1 Health and 1 Food. Plus now we smell like pee...");
                            log("Outcome", "🔺 Gained 1 Stamina. At least we got a bit of rest.");
                            console.log("************");
                        } else {
                            adjustStamina(2);
                            adjustHealth(1);
                            log("Outcome", "\nWe had a peaceful rest!");
                            log("Outcome", "🔺 Gained 2 Stamina and 1 Health.");
                        }
                        advanceTurn();
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

    } else if (locationChoice === 2) { // rooftop
        if(playerStats.stamina >= 1){
            adjustStamina(-1);
            adjustHealth(1);
            log("Action", "Feeling for a scenic view and some peace, we climb our way up to the rooftop of the local bakery.");
            log("Outcome", "🔻 Lose 1 Stamina. 🔺Gain 1 Health.");
            advanceTurn();
        } else {
            console.log("😫 We are exhausted and can't make the climb. Need more stamina to make the climb.");
        }
        gameLoop();
    }
}

function unprotectedAlleyRest(){
    let catAttack = Math.random() < 0.3;
    let dogAttack = Math.random() < 0.2;

    if(catAttack) {
        adjustHealth(-1);
        adjustFood(-1);
        adjustStamina(1);
        console.log("\n************");
        log("Outcome", `😼 A rival cat attacks us, ${playerStats.food>0 ? 'steals our food, ':''}pees in our spot, and walks off!`);
        log("Outcome", "🔻 Lost 1 Health and 1 Food. Plus now we smell like pee...");
        log("Outcome", "🔺 Gained 1 Stamina. At least we got a bit of rest.");
        console.log("************");
    }

    if(!catAttack && !dogAttack){
        adjustStamina(2);
        console.log("\n************");
        log("Outcome", "😸 We had a peaceful rest!");
        log("Outcome", "🔺 Gain 2 Stamina.");
        console.log("************");
    }

    if(dogAttack) {
        handleDogPrompt();
    } else {
        advanceTurn();
        gameLoop();
    }
}


// Encounters
function handleDogPrompt(){
    // IF food > 0:
    if( playerStats.food >= 1 ){

        // game prompts: "Toss 1 Food to distract the dog? (Y/N)"
        console.log("\nA dog approaches growling at us. This could end badly...");

        rl.question("\nToss 1 Food to distract the dog❔ (Y/N): ", (choice) => {
            let distractDog = choice.trim().toUpperCase();

            // IF Y: Distract dog by tossing some of your food at it
            if( distractDog === 'Y'){
                adjustFood(-1);
                console.log("\n************");
                log("Action", "You toss some food at the dog and make a quick escape.");
                log("Outcome", "🔻 Lost 1 Food.");
                if(playerStats.food === 0) console.log("‼️ That was our last bit of food. We need to find more food!");
                console.log("************");
            
                function askDogAction(){ // in function to callback if input wrong
                    //  ask user if they want to attack the dog while the dog is distracted or leave it in peace
                    // Leaving dog in peace enables friendly vibe which increases chance of human interaction (petting)
                    // Attacking distracted dog increases chance of win and chance to gain half food back plus 1 cat ally
                    console.log("\nWhile the dog is distracted do you..."
                                +"\n1. Leave the dog in peace"
                                +"\n2. Attack the dog while it eats the food you gave it");

                    rl.question("\nMake your choice (1 or 2): ", (choice) => {
                        let dogDistractedChoice = parseInt(choice.trim());

                        if(dogDistractedChoice === 1){
                            // user leave dog in peace. enable emitingFriendlyVibe for 3 turns
                            log("Action", "You walked away leaving the dog in peace eating your food.");
                            log("Outcome", "You emit friendly vibes to humans for 5 turns.");
                            playerStats.friendlyVibeCountdown = 6;
                            advanceTurn();
                            gameLoop();

                        } else if (dogDistractedChoice === 2){
                            log("Action", `You go in for the attack while the dog is distracted with his food...`);
                            // user attacks dog. roll dice on chance of scaring dogg away, if success keep 0.5 food?
                            let dogAttackScare = 0.20 + playerStats.health * 0.06  +  playerStats.stamina  * 0.06 + playerStats.catAllies/10;
                            let scareDogAway = Math.random() < dogAttackScare;
                            if( scareDogAway ){
                                // user succeeds in scaring dog
                                log("Outcome", "🔺 Gained half a ration of Food and 1 Cat Ally.");
                                if( playerStats.friendlyVibeCountdown > 0 ) log("Outcome", "Friendly vibe reset. You no longer emit friendly vibes to humans.");
                                adjustFood(0.5);
                                adjustCatAllies(1);
                                playerStats.friendlyVibeCountdown = 0;

                                advanceTurn();
                                gameLoop();
                            } else {
                                log("Outcome", "\n🐕 To your surprise the dog had one eye on you and saw you coming. The dog bites you!");
                                log("Outcome", "🔻 Lose 2 health");
                                adjustHealth(-2);

                                advanceTurn();
                                gameLoop();
                            } 
                        } else {
                            console.log("‼️ Incorrect choice.");
                            askDogAction();
                        }
                    });
                }
                askDogAction();

            } else if (distractDog === 'N') {
                attemptDogScare();
            } else {
                console.log("‼️ Incorrect choice.");
                handleDogPrompt();
            }
        });

    } else {
        attemptDogScare();
    }
}

function attemptDogScare(){
    let dogScareChance = 0.10 + playerStats.health * 0.03  +  playerStats.stamina  * 0.03 + playerStats.catAllies/10;
    let scareDogAway = Math.random() < dogScareChance;

    if( scareDogAway ){
        adjustCatAllies(1);
        adjustStamina(-1);

        if( playerStats.health <= 2 ){
            log("Outcome", "\n***ADRENALINE SURGE***"
            +"\n🦁 In desperation, something takes over and we channel OUR inner lion. Hissing with rage, foaming at the mouth, we arch our back and puff our fur, somehow causing the dog to piss itself and run away whimpering!");
        } else {
            console.log("\n************");
            log("Outcome", "😾 You puff up your fur and hiss fiercely! The dog backs down!");
        }
        log("Outcome", "🔺 Gain 1 Cat Ally.");
        console.log("************");

        advanceTurn();
        gameLoop();
    } else {
        standardDogAttack();
    }

}

function standardDogAttack(){
    adjustHealth(-2);
    console.log("\n************");
    log("Outcome", "🐕 A stray dog bit us!");
    log("Outcome", "🔻 Lost 2 Health.");
    console.log("************");
    advanceTurn();
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

function adjustHumanBond(x){
    playerStats.humanBond += x;
    playerStats.humanBond = Math.max(playerStats.humanBond, 0);
}

function adjustCatAllies(x){
    playerStats.catAllies += x;
    playerStats.catAllies = Math.max(playerStats.catAllies, 0);
}

// Game init
start();
printIntro();
gameLoop();