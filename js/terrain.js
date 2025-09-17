// Terrain types and generation
class Terrain {
    static TYPES = {
        PLAIN: { id: 'plain', color: '#90EE90', name: 'Plain' },
        FOREST: { id: 'forest', color: '#228B22', name: 'Forest' },
        WATER: { id: 'water', color: '#4169E1', name: 'Water' }
    };

    constructor(gridWidth, gridHeight) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.grid = [];
        this.generateTerrain();
    }

    generateTerrain() {
        // Initialize grid with plains
        for (let y = 0; y < this.gridHeight; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                this.grid[y][x] = {
                    terrain: Terrain.TYPES.PLAIN,
                    infrastructure: null,
                    population: 0
                };
            }
        }

        // Add some forest patches
        this.addTerrainPatches(Terrain.TYPES.FOREST, 8, 3);
        
        // Add water features
        this.addTerrainPatches(Terrain.TYPES.WATER, 5, 4);
    }

    addTerrainPatches(terrainType, numPatches, patchSize) {
        for (let i = 0; i < numPatches; i++) {
            const centerX = Math.floor(Math.random() * this.gridWidth);
            const centerY = Math.floor(Math.random() * this.gridHeight);
            
            // Create irregular patch around center
            for (let dy = -patchSize; dy <= patchSize; dy++) {
                for (let dx = -patchSize; dx <= patchSize; dx++) {
                    const x = centerX + dx;
                    const y = centerY + dy;
                    
                    if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const probability = Math.max(0, 1 - distance / patchSize);
                        
                        if (Math.random() < probability) {
                            this.grid[y][x].terrain = terrainType;
                        }
                    }
                }
            }
        }
    }

    getTile(x, y) {
        if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
            return this.grid[y][x];
        }
        return null;
    }

    setInfrastructure(x, y, infrastructure) {
        const tile = this.getTile(x, y);
        if (tile) {
            tile.infrastructure = infrastructure;
            return true;
        }
        return false;
    }

    canPlaceInfrastructure(x, y, infrastructureType) {
        const tile = this.getTile(x, y);
        if (!tile) return false;

        // Check if tile already has infrastructure
        if (tile.infrastructure) return false;

        // Special placement rules
        switch (infrastructureType.id) {
            case 'bridge':
                return tile.terrain.id === 'water';
            case 'dock':
                return tile.terrain.id === 'water';
            default:
                return tile.terrain.id !== 'water';
        }
    }
}