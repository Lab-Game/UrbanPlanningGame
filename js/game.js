// Main game controller
class UrbanPlanningGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.renderer = new Renderer(this.canvas);
        this.terrain = new Terrain(25, 20); // 25x20 grid
        this.infrastructure = new Infrastructure();
        this.population = new Population();
        this.economy = new Economy();
        
        this.selectedTool = 'select';
        this.gameRunning = true;
        
        this.initializeEventListeners();
        this.updateUI();
        this.gameLoop();
    }

    initializeEventListeners() {
        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.selectedTool = e.target.getAttribute('data-tool');
            });
        });

        // Canvas click handling
        this.canvas.addEventListener('click', (e) => {
            this.handleCanvasClick(e);
        });

        // Tax rate slider
        const taxSlider = document.getElementById('tax-slider');
        const taxDisplay = document.getElementById('tax-display');
        
        taxSlider.addEventListener('input', (e) => {
            const rate = parseInt(e.target.value);
            this.economy.setTaxRate(rate);
            taxDisplay.textContent = rate + '%';
            this.updateUI();
        });
    }

    handleCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const screenX = event.clientX - rect.left;
        const screenY = event.clientY - rect.top;
        
        const worldPos = this.renderer.screenToWorld(screenX, screenY);
        
        if (this.selectedTool === 'select') {
            this.renderer.setSelectedTile(worldPos.x, worldPos.y);
            this.showTileInfo(worldPos.x, worldPos.y);
        } else {
            this.placeBuildingIfPossible(worldPos.x, worldPos.y, this.selectedTool);
        }
    }

    placeBuildingIfPossible(x, y, toolType) {
        const infrastructureType = this.infrastructure.getType(toolType);
        if (!infrastructureType) return;

        // Check if placement is valid
        if (!this.terrain.canPlaceInfrastructure(x, y, infrastructureType)) {
            this.showMessage(`Cannot place ${infrastructureType.name} here!`);
            return;
        }

        // Check if player can afford it
        if (!this.economy.canAfford(infrastructureType.cost)) {
            this.showMessage(`Cannot afford ${infrastructureType.name}! Cost: $${infrastructureType.cost}`);
            return;
        }

        // Place the infrastructure
        if (this.terrain.setInfrastructure(x, y, infrastructureType)) {
            this.economy.spend(infrastructureType.cost);
            this.infrastructure.addInfrastructure(infrastructureType);
            this.showMessage(`Built ${infrastructureType.name} for $${infrastructureType.cost}`);
            this.updateUI();
        }
    }

    showTileInfo(x, y) {
        const tile = this.terrain.getTile(x, y);
        if (!tile) return;

        const infoPanel = document.getElementById('selected-tile-info');
        let info = `<strong>Tile (${x}, ${y})</strong><br>`;
        info += `Terrain: ${tile.terrain.name}<br>`;
        
        if (tile.infrastructure) {
            info += `Infrastructure: ${tile.infrastructure.name}<br>`;
            info += `Cost: $${tile.infrastructure.cost}<br>`;
            info += `Maintenance: $${tile.infrastructure.maintenance}/cycle<br>`;
        } else {
            info += `Infrastructure: None<br>`;
        }
        
        infoPanel.innerHTML = info;
    }

    showMessage(message) {
        // Simple message display (could be improved with a proper notification system)
        const infoPanel = document.getElementById('selected-tile-info');
        infoPanel.innerHTML = `<div style="color: #F39C12;">${message}</div>`;
        
        // Clear message after 3 seconds
        setTimeout(() => {
            if (this.renderer.selectedTile) {
                this.showTileInfo(this.renderer.selectedTile.x, this.renderer.selectedTile.y);
            } else {
                infoPanel.innerHTML = '<p>Click on a tile to see information</p>';
            }
        }, 3000);
    }

    updateUI() {
        // Update population display
        document.getElementById('population').textContent = 
            `Population: ${this.population.getTotalPopulation()} (${this.population.getHappinessDescription()})`;
        
        // Update budget display
        document.getElementById('budget').textContent = 
            `Budget: $${this.economy.getBudget()}`;
        
        // Update tax rate display
        document.getElementById('tax-rate').textContent = 
            `Tax Rate: ${this.economy.getTaxRate()}%`;
    }

    gameLoop() {
        if (!this.gameRunning) return;

        // Update game systems
        const infrastructureBonus = this.infrastructure.getTotalPopulationBonus();
        this.population.update(infrastructureBonus, this.economy.getTaxRate());
        
        // Collect taxes and pay maintenance
        this.economy.collectTaxes(this.population.getTotalPopulation());
        this.economy.payMaintenanceCosts(this.infrastructure.getTotalMaintenanceCost());
        
        // Render the game
        this.renderer.clear();
        this.renderer.drawGrid(this.terrain);
        
        // Update UI
        this.updateUI();
        
        // Continue game loop
        requestAnimationFrame(() => this.gameLoop());
    }

    start() {
        console.log('Urban Planning Game started!');
        this.showMessage('Welcome to Urban Planning Game! Click to select tools and build your city.');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new UrbanPlanningGame();
    game.start();
});