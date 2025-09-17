// Economy and budget management
class Economy {
    constructor() {
        this.budget = 10000; // Starting budget
        this.taxRate = 5; // Percentage
        this.lastTaxCollection = Date.now();
        this.revenue = 0;
        this.expenses = 0;
    }

    collectTaxes(population) {
        const now = Date.now();
        const timeDelta = (now - this.lastTaxCollection) / 1000;
        
        // Collect taxes every 5 seconds
        if (timeDelta >= 5) {
            // Tax revenue based on population and tax rate
            const taxRevenue = population * this.taxRate * 0.1; // $0.1 per person per % tax rate
            this.budget += taxRevenue;
            this.revenue = taxRevenue;
            this.lastTaxCollection = now;
            
            return taxRevenue;
        }
        
        return 0;
    }

    payMaintenanceCosts(maintenanceCost) {
        this.budget -= maintenanceCost;
        this.expenses = maintenanceCost;
        
        // Prevent negative budget (game over condition could be added here)
        if (this.budget < 0) {
            this.budget = 0;
        }
    }

    canAfford(cost) {
        return this.budget >= cost;
    }

    spend(amount) {
        if (this.canAfford(amount)) {
            this.budget -= amount;
            return true;
        }
        return false;
    }

    setTaxRate(rate) {
        this.taxRate = Math.max(1, Math.min(20, rate)); // Clamp between 1% and 20%
    }

    getBudget() {
        return Math.floor(this.budget);
    }

    getTaxRate() {
        return this.taxRate;
    }

    getRevenue() {
        return Math.floor(this.revenue);
    }

    getExpenses() {
        return Math.floor(this.expenses);
    }

    getNetIncome() {
        return this.getRevenue() - this.getExpenses();
    }
}