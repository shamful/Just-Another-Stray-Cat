* Just Another Cat
``` mermaid
flowchart TD
    A([Start Game]) --> B[displayStats]
    B --> C{Health <= 0?}
    C -- Yes --> D[💀 Game Over / rl.close]
    C -- No --> E[Main Menu Prompt]

    E --> |0| F[Quit / rl.close]
    E --> |1| G[scavenge]
    E --> |2| H[promptRestMenu]
    E --> |3| I[eatFood]
    E --> |4| J[buildShelter]

    G --> B
    I --> B
    J --> B

    H --> K{Select Spot}
    K --> |1: Street| L[Street Rest Roll]
    K --> |2: Alleyway| M{Has Nesting Materials?}
    K --> |3: Rooftop| N{Stamina > 0?}

    %% Street Logic
    L --> |Dog Attack 40%| L1[Health -2]
    L --> |Human Attack 30%| L2[Health -1]
    L --> |Human Pet 30%| L3[Health +1, Stamina +1, Petted +1]
    L3 --> L4{PettedCount == 3?}
    L4 -- Yes --> L5[HumanTrust +1, PettedCount = 0]
    L4 -- No --> L6[Progress Logged]
    L --> |No Dog & No Human Attack| L7[Stamina +1]
    L1 --> B
    L2 --> B
    L5 --> B
    L6 --> B
    L7 --> B

    %% Alley Logic
    M -- Yes --> O{Use Materials? Y/N}
    M -- No --> P[unprotectedAlleyRest]
    O -- Y --> Q[Materials -1]
    Q --> R{Cat Attack 20%?}
    R -- Yes --> R1[Health -1, Food -1, Materials -1] --> B
    R -- No --> R2[Stamina +1, Health +1] --> B
    O -- N --> P

    P --> S{Cat Attack 30%?}
    P --> T{Dog Attack 25%?}
    S -- Yes --> S1[Health -1, Food -1]
    T -- Yes --> T1[Health -2]
    P --> |No Cat & No Dog| U[Stamina +2, Health +1]
    S1 --> B
    T1 --> B
    U --> B

    %% Rooftop Logic
    N -- Yes --> V[Stamina -2, Health +2] --> B
    N -- No --> W[Too Tired Log] --> B
```