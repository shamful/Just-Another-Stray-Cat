# 🐾 Just Another Street Cat

A text-based CLI survival adventure built with Node.js. Navigate the inner city, manage your resources, and survive long enough to rule the streets or find a home.

---

## 🎮 Game Architecture & Stats

```mermaid
mindmap
  root((Just Another Street Cat))
    Player Stats
      Health : Max 8
      Stamina : Max 5
      Inventory : Food & Materials
      Progress : Human Bonds & Cat Allies
    Win Conditions
      Rule the Streets : 3 Cat Allies
      Indoor Cat : 3 Human Bonds
    Loss Condition
      Game Over : 0 Health
    Passive Systems
      Hunger Clock
        Triggers every 5 turns
        Auto-eats 1 Food
        Loss 1 HP if out of food
```

---

## 🤔 Main Actions

### Scavenge
```mermaid
graph TD
    Scavenge[Scavenge Action] --> CheckStamina{Stamina > 0?}
    
    CheckStamina -->|No| NoStam[Failed: Too tired to scavenge]
    CheckStamina -->|Yes| Roll[Costs 1 Stamina<br/>Roll 2x 50% Chance]
    
    Roll -->|25%| Both[Found Food + Nesting Materials]
    Roll -->|25%| FoodOnly[Found Food Only]
    Roll -->|25%| MatOnly[Found Nesting Materials Only]
    Roll -->|25%| Nothing[Found Nothing]
```

### 🥗 Eat
```mermaid
graph TD
    Eat[Eat Action] --> CheckFood{Food > 0?}
    
    CheckFood -->|No| NoFood[Failed: No food in inventory]
    CheckFood -->|Yes| CheckHP{Health < Max?}
    
    CheckHP -->|No| MaxHP[Failed: Already at max health]
    CheckHP -->|Yes| Success[Costs 1 Food:<br/>+1 Health & Reset Hunger Clock]
```

---

## 🌙 Rest Mechanics & Locations

```mermaid
graph TD
    Rest[Choose Rest Spot] --> Street[Street Rest - Free]
    Rest --> Alley[Alleyway Rest - Medium Risk]
    Rest --> Rooftop[Bakery Rooftop - Safe]

    Street -->|30% Independent Roll| Pet[Human Pet: +1 HP & +1 Stamina<br/>3 Pets = +1 Human Bond]
    Street -->|30% Independent Roll| Kick[Kid Kick: -1 HP]
    Street -->|40% Independent Roll| Dog1[Triggers Dog Encounter]
    Street -->|If No Kick & No Dog| Peace1[Peaceful Rest: +1 Stamina]

    Alley -->|With Materials| MatRest[Costs 1 Material<br/>Dog Immune!]
    Alley -->|No Materials| Unprotected[Unprotected Rest]

    MatRest -->|20% Risk| Rival1[Rival Cat: -1 HP & Steals 1 Food]
    MatRest -->|80% Success| MatSuccess[Peaceful Rest: +2 Stamina & +1 HP]

    Unprotected -->|40% Independent Roll| Rival2[Rival Cat: -1 HP & Steals 1 Food]
    Unprotected -->|30% Independent Roll| Dog1
    Unprotected -->|If No Rival & No Dog| Peace2[Peaceful Rest: +1 Stamina]

    Rooftop -->|Requires 2+ Stamina| SafeRest[Costs 2 Stamina: +1 HP]
    Rooftop -->|Stamina < 2| Exhausted[Climb Fails: Turn Refunded]
```

---

## 🐕 Dog Encounter Handler

```mermaid
graph TD
    Dog[Dog Encounter] --> Action{Choose Action}
    Action -->|Toss Food| Toss[Costs 1 Food<br/>Safely Escape]
    Action -->|Attempt Scare| CheckStats{Check Stats}

    CheckStats -->|HP ≤ 2| Adrenaline[Adrenaline Scare<br/>20% Success]
    CheckStats -->|HP > 2 and Stamina > 1| Confident[Scare Attempt<br/>30% Success]
    CheckStats -->|HP > 2 and Stamina ≤ 1| FailCheck[Too Weak to Scare<br/>Automatic Fail]

    Adrenaline -->|Success| WinAlly[+1 Cat Ally]
    Confident -->|Success| WinAlly
    Adrenaline -->|Failure| Hurt[-2 HP Damage]
    Confident -->|Failure| Hurt
    FailCheck --> Hurt
```

---

## 🚀 How to Run

```bash
node index.js
```