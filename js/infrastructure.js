// Infrastructure types and management
class Infrastructure {
    static TYPES = {
        ROAD: { 
            id: 'road', 
            name: 'Road', 
            cost: 100, 
            maintenance: 5,
            color: '#696969',
            populationBonus: 2
        },
        BRIDGE: { 
            id: 'bridge', 
            name: 'Bridge', 
            cost: 500, 
            maintenance: 20,
            color: '#8B4513',
            populationBonus: 5
        },
        PARK: { 
            id: 'park', 
            name: 'Park', 
            cost: 200, 
            maintenance: 10,
            color: '#32CD32',
            populationBonus: 8
        },
        RAILROAD: { 
            id: 'railroad', 
            name: 'Railroad', 
            cost: 300, 
            maintenance: 15,
            color: '#4B0082',
            populationBonus: 10
        },
        DOCK: { 
            id: 'dock', 
            name: 'Dock', 
            cost: 400, 
            maintenance: 25,
            color: '#8B4513',
            populationBonus: 12
        }
    };

    constructor() {
        this.infrastructureCount = {};
        
        // Initialize counts
        for (let type in Infrastructure.TYPES) {
            this.infrastructureCount[Infrastructure.TYPES[type].id] = 0;
        }
    }

    getType(id) {
        for (let type in Infrastructure.TYPES) {
            if (Infrastructure.TYPES[type].id === id) {
                return Infrastructure.TYPES[type];
            }
        }
        return null;
    }

    addInfrastructure(type) {
        this.infrastructureCount[type.id]++;
    }

    removeInfrastructure(type) {
        if (this.infrastructureCount[type.id] > 0) {
            this.infrastructureCount[type.id]--;
        }
    }

    getTotalMaintenanceCost() {
        let total = 0;
        for (let typeId in this.infrastructureCount) {
            const type = this.getType(typeId);
            total += this.infrastructureCount[typeId] * type.maintenance;
        }
        return total;
    }

    getTotalPopulationBonus() {
        let total = 0;
        for (let typeId in this.infrastructureCount) {
            const type = this.getType(typeId);
            total += this.infrastructureCount[typeId] * type.populationBonus;
        }
        return total;
    }

    getInfrastructureCount(typeId) {
        return this.infrastructureCount[typeId] || 0;
    }
}