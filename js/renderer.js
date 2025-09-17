// 2.5D rendering system
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tileSize = 32;
        this.offsetX = 0;
        this.offsetY = 0;
        this.selectedTile = null;
    }

    clear() {
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid(terrain) {
        const tilesX = Math.ceil(this.canvas.width / this.tileSize) + 1;
        const tilesY = Math.ceil(this.canvas.height / this.tileSize) + 1;
        
        const startX = Math.floor(this.offsetX / this.tileSize);
        const startY = Math.floor(this.offsetY / this.tileSize);

        for (let y = 0; y < tilesY && (startY + y) < terrain.gridHeight; y++) {
            for (let x = 0; x < tilesX && (startX + x) < terrain.gridWidth; x++) {
                const worldX = startX + x;
                const worldY = startY + y;
                const tile = terrain.getTile(worldX, worldY);
                
                if (tile) {
                    this.drawTile(x * this.tileSize - (this.offsetX % this.tileSize), 
                                 y * this.tileSize - (this.offsetY % this.tileSize), 
                                 tile, worldX, worldY);
                }
            }
        }
    }

    drawTile(screenX, screenY, tile, worldX, worldY) {
        // Draw terrain base
        this.ctx.fillStyle = tile.terrain.color;
        this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
        
        // Add some 2.5D effect with darker bottom edge
        this.ctx.fillStyle = this.darkenColor(tile.terrain.color, 0.3);
        this.ctx.fillRect(screenX, screenY + this.tileSize - 3, this.tileSize, 3);
        
        // Draw infrastructure if present
        if (tile.infrastructure) {
            this.drawInfrastructure(screenX, screenY, tile.infrastructure);
        }
        
        // Highlight selected tile
        if (this.selectedTile && this.selectedTile.x === worldX && this.selectedTile.y === worldY) {
            this.ctx.strokeStyle = '#F1C40F';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(screenX + 1, screenY + 1, this.tileSize - 2, this.tileSize - 2);
        }
        
        // Draw grid lines
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
    }

    drawInfrastructure(x, y, infrastructure) {
        const centerX = x + this.tileSize / 2;
        const centerY = y + this.tileSize / 2;
        
        this.ctx.fillStyle = infrastructure.color;
        
        switch (infrastructure.id) {
            case 'road':
                // Draw road as cross pattern
                this.ctx.fillRect(x + 8, y + 12, this.tileSize - 16, 8);
                this.ctx.fillRect(x + 12, y + 8, 8, this.tileSize - 16);
                break;
                
            case 'bridge':
                // Draw bridge as thick line
                this.ctx.fillRect(x + 4, y + 14, this.tileSize - 8, 4);
                break;
                
            case 'park':
                // Draw park as circle
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
                this.ctx.fill();
                break;
                
            case 'railroad':
                // Draw railroad as parallel lines
                this.ctx.fillRect(x + 6, y + 10, this.tileSize - 12, 2);
                this.ctx.fillRect(x + 6, y + 20, this.tileSize - 12, 2);
                break;
                
            case 'dock':
                // Draw dock as rectangle at edge
                this.ctx.fillRect(x + 8, y + 24, this.tileSize - 16, 8);
                break;
        }
    }

    darkenColor(color, factor) {
        // Simple color darkening
        const hex = color.replace('#', '');
        const r = Math.floor(parseInt(hex.substring(0, 2), 16) * (1 - factor));
        const g = Math.floor(parseInt(hex.substring(2, 4), 16) * (1 - factor));
        const b = Math.floor(parseInt(hex.substring(4, 6), 16) * (1 - factor));
        return `rgb(${r}, ${g}, ${b})`;
    }

    screenToWorld(screenX, screenY) {
        const worldX = Math.floor((screenX + this.offsetX) / this.tileSize);
        const worldY = Math.floor((screenY + this.offsetY) / this.tileSize);
        return { x: worldX, y: worldY };
    }

    setSelectedTile(x, y) {
        this.selectedTile = { x, y };
    }

    clearSelection() {
        this.selectedTile = null;
    }
}