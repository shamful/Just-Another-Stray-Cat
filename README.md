``` mermaid
mindmap
  root((Just Another Street Cat))
    Win Conditions
      Rule the Streets : 3 Cat Allies
      Indoor Cat : 3 Human Trust
    Loss Condition
      Game Over : 0 Health
    Main Actions
      Scavenge
        Gain Food : 50%
        Gain Nesting Materials : 50%
        Costs 1 Stamina
      Eat
        Restore 0.5 Health
        Costs 1 Food
      Rest Choices
        Street : High Risk / High Reward
          Human Pet : +1 Health & Stamina
          Kid Kick : -1 Health
          Dog Attack : Triggers Dog Event
        Alleyway : Medium Risk
          With Materials : Safer / Restores Stats
          Unprotected : Risk of Rival Cat or Dog Event
        Bakery Rooftop : Safe
          Costs 2 Stamina
          Restores 2 Health
    Dog Event Handler
      Toss Food : Costs 1 Food / Escape
      Attempt Scare
        Low Health Adrenaline : 20% Success
        High Health/Stamina : 30% Success
        Success : +1 Cat Ally
        Failure : -2 Health
```