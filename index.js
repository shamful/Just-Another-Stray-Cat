const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function gameLoop(){
    // 1. Check if the cat is dead before starting the turn
    if (playerStats.health <= 0) {
        console.log("\n💀 Game Over! Your stray cat couldn't survive the city...");
        rl.close();
        return;
    }

    // 2. Display current status
    displayStats();

    // 3. Print main menu options
    console.log("\nWhat would you like to do?");
    console.log("1. Scavenge");
    console.log("2. Rest");
    console.log("3. Eat");
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

            default:
                console.log("❗ Invalid choice! Pick 1, 2, or 3.");
                gameLoop();
                break;
        };
    });
}

function promptRestMenu() {
    console.log("\nWhere would you want to rest?");
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
        }

        gameLoop();
    });
}

const playerStats = 
{
    "health": 5,
    "maxHealth": 8,
    "stamina": 3,
    "maxStamina": 5,
    "food": 3,
    "nestingMaterials": 2
};

function displayStats(){
    console.log(
`\n=== STRAY CAT SURVIVAL ===
    Health: ${playerStats.health}/${playerStats.maxHealth}
    Stamina: ${playerStats.stamina}/${playerStats.maxStamina}
    Food: ${playerStats.food}
    Nesting Materials (cardboard, rags): ${playerStats.nestingMaterials}
==========================`
    );
}


function scavenge(){
    if( playerStats.stamina > 0 ){
        playerStats.stamina -= 1;
        let diceRoll = Math.floor(Math.random() * 3);
        if( diceRoll === 1 ){
            playerStats.food += 1;
            console.log("Found food!");
        } else if (diceRoll === 2) {
            playerStats.nestingMaterials += 1;
            console.log("Found nesting materials!");
        } else {
            console.log("Found nothing...");
        }
    } else {
        console.log("😿 Too tired to scavenge...");
    }
}

function rest(locationChoice){
    // Dice roll for where resting will be
    // 0 = street, 1 = alleyway box, 2 = rooftop
    // let restLoc = Math.floor(Math.random() * 3);

    let dogAttack, humanAttack, humanPetting;

    if(locationChoice === 1){ // street
        console.log("Against all your instincts, you decided to sleep in the street.");
        
        // Roll dice for positive and negative rest interruptions
        dogAttack = Math.random() < 0.4;
        humanAttack = Math.random() < 0.3;
        humanPetting = Math.random() < 0.3;

        if(dogAttack){
            adjustHealth(-2);
            console.log("🐕 A stray dog bit you! Lost 2 Health.");
        }
        
        if(humanAttack){
            adjustHealth(-1);
            console.log("A human child kicked you! Lost 1 Health.");
        }
        
        if(humanPetting) {
            adjustHealth(1);
            adjustStamina(1);
            console.log("A kind human petted you while you were resting. Gained 1 Health and 1 Stamina.");
        }

        if(!dogAttack && !humanAttack) console.log("Against all odds you got a peaceful rest ☮️");

        adjustStamina(1);

    } else if (locationChoice === 2) { // alleyway
        console.log("You decide to sleep in one of your favourite alleyways.");

        dogAttack = Math.random() < 0.3;
        if(dogAttack) {
            adjustHealth(-2);
            console.log("🐕 A stray dog ambushed you while sleeping! Lost 2 Health.");
        } else {
            adjustStamina(1);
        }

    } else if (locationChoice === 3) { // rooftop
        console.log("Feeling for a scenic view and some piece, you climb your way up to the rooftop of the local bakery. Lose 1 Stamina. Gain 2 Health.");
        adjustStamina(-1);
        adjustHealth(2);
    }
}

function eatFood(){
    if(playerStats.food > 0){
        playerStats.food -= 1;
        playerStats.health += 0.5;
    }
}

function adjustHealth(x){
    playerStats.health += x;
    playerStats.health = Math.min( playerStats.health, playerStats.maxHealth);
    playerStats.health = Math.max (playerStats.health, 0);
}

function adjustStamina(x){
    playerStats.stamina += x;
    playerStats.stamina = Math.min(playerStats.stamina, playerStats.maxStamina);
    playerStats.stamina = Math.max(playerStats.stamina, 0);
}


// displayStats();
// rest(1);
// // adjustStamina(-1);
// // adjustHealth(-2);
// displayStats();

gameLoop();