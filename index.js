
const playerStats = 
{
    "health": 5,
    "maxHealth": 8,
    "stamina": 3,
    "maxStamina": 5,
    "food": 3,
    "cozyStuff": 2
};

function displayStats(){
    console.log(
`=== STRAY CAT SURVIVAL ===
    Health: ${playerStats.health}/${playerStats.maxHealth}
    Stamina: ${playerStats.stamina}/${playerStats.maxStamina}
    Food: ${playerStats.food}
    Cozy Stuff: ${playerStats.cozyStuff}
==========================`
    );
}


function scavenge(){
    if( playerStats.stamina > 0 ){
        playerStats.stamina -= 1;
        playerStats.food += 1;
        displayStats();
    } else {
        console.log("😿 Too tired to scavenge...");
    }
}

function rest(locationChoice){
    // Dice roll for where resting will be
    // 0 = street, 1 = alleyway box, 2 = rooftop
    // let restLoc = Math.floor(Math.random() * 3);

    let dogAttack, humanAttack, humanPetting;

    if(locationChoice === 0){ // street
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
        console.log(dogAttack, humanAttack, humanPetting);

    } else if (locationChoice === 1) { // alleyway
        console.log("You decide to sleep in one of your favourite alleyways.");

        dogAttack = Math.random() < 0.3;
        if(dogAttack) {
            adjustHealth(-2);
            console.log("🐕 A stray dog ambushed you while sleeping! Lost 2 Health.");
        } else {
            adjustStamina(1);
        }

    } else if (locationChoice === 2) { // rooftop
        console.log("Feeling for a scenic view and some piece, you climb your way up to the rooftop of the local bakery. Lose 1 Stamina. Gain 2 Health.");
        adjustStamina(-1);
        adjustHealth(2);
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


displayStats();
rest(1);
// adjustStamina(-1);
// adjustHealth(-2);
displayStats();