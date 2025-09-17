// Population management and growth simulation
class Population {
    constructor() {
        this.totalPopulation = 10; // Starting population
        this.happiness = 0.5; // 0-1 scale
        this.growthRate = 0.02; // Base growth rate per update
        this.lastUpdate = Date.now();
    }

    calculateHappiness(taxRate, infrastructureBonus) {
        // Base happiness decreases with higher tax rates
        let happiness = 1.0 - (taxRate / 100) * 2; // Tax penalty
        
        // Infrastructure increases happiness
        happiness += Math.min(infrastructureBonus / 100, 0.5); // Cap bonus at 0.5
        
        // Ensure happiness stays within bounds
        this.happiness = Math.max(0, Math.min(1, happiness));
        
        return this.happiness;
    }

    update(infrastructureBonus, taxRate) {
        const now = Date.now();
        const timeDelta = (now - this.lastUpdate) / 1000; // Convert to seconds
        
        // Only update every second to avoid too frequent updates
        if (timeDelta < 1) return;
        
        this.calculateHappiness(taxRate, infrastructureBonus);
        
        // Growth rate is affected by happiness and infrastructure
        const effectiveGrowthRate = this.growthRate * this.happiness * (1 + infrastructureBonus / 200);
        
        // Population grows based on current population and growth rate
        const growthAmount = this.totalPopulation * effectiveGrowthRate * timeDelta;
        
        // Only grow if happiness is above a threshold
        if (this.happiness > 0.3) {
            this.totalPopulation += growthAmount;
        } else if (this.happiness < 0.2) {
            // Population can decline if very unhappy
            this.totalPopulation -= growthAmount * 0.5;
        }
        
        // Ensure population doesn't go below 1
        this.totalPopulation = Math.max(1, this.totalPopulation);
        
        this.lastUpdate = now;
    }

    getTotalPopulation() {
        return Math.floor(this.totalPopulation);
    }

    getHappiness() {
        return this.happiness;
    }

    getHappinessDescription() {
        if (this.happiness >= 0.8) return "Very Happy";
        if (this.happiness >= 0.6) return "Happy";
        if (this.happiness >= 0.4) return "Content";
        if (this.happiness >= 0.2) return "Unhappy";
        return "Very Unhappy";
    }
}