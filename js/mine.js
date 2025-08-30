class Field {
	field = [];
	visibility = [];
	allField = 0;
	sizeX = 0;
	sizeY = 0;
	mines = 0;
	bombed = [];

	constructor(sizeX, sizeY, mines) {
		this.sizeX = sizeX;
		this.sizeY = sizeY;
		this.mines = mines;
		this.allField = sizeX * sizeY;
		this.prob = this.mines / this.allField;
		this.minePos = [];
		this.visited = [];
		
		let m = 0;
		do {
			let newX = Math.ceil(Math.random() * sizeX - 1);
			let newY =  Math.ceil(Math.random() * sizeY - 1);
			const sameEl = this.minePos.filter(([x,y]) => newX === x && newY === y);
			if (sameEl.length === 0) {
				this.minePos.push([newX, newY]);
				m++;
			}
			
		} while (m < 10);

		for (let i = 0; i< sizeX; i++) {
			for (let j = 0; j<sizeY; j++) {
				if (!this.field[i]) {
					this.field[i] = []
					this.visited[i] = [];
				} 
				this.field[i][j] = 'E';
				this.visited[i][j] = false;
			}
		}
		for (let i = 0; i< sizeX; i++) {
			for (let j = 0; j<sizeY; j++) {
				if (!this.visibility[i]) {
					this.visibility[i] = []
				} 					
				this.visibility[i][j] = true
			}
		}
		for (let i = 0; i< sizeX; i++) {
			for (let j = 0; j<sizeY; j++) {
				if (!this.bombed[i]) {
					this.bombed[i] = []
				} 					
				this.bombed[i][j] = false
			}
		}
		for (let m = 0; m < this.mines; m++) {
			this.field[this.minePos[m][0]][this.minePos[m][1]] = 'M'
		}
		const thereIsMine = (x,y) => {
			if (x < 0 || x >= sizeX) {
				return 0;
			}
			if (y < 0 || y >= sizeY) {
				return 0;
			}
			return this.field[x][y] === 'M' ? 1 : 0;
		}
		for (let i = 0; i< sizeX; i++) {
			for (let j = 0; j<sizeY; j++) {
				if (this.field[i][j] === 'E') {
					this.field[i][j] =
						thereIsMine(i-1,j-1) +
						thereIsMine(i,j-1) +
						thereIsMine(i+1,j-1) +
						thereIsMine(i-1,j) +
						thereIsMine(i+1,j) +
						thereIsMine(i-1,j+1) +
						thereIsMine(i,j+1) +
						thereIsMine(i+1,j+1);
				}
			}
		}
	}

	cleanVisited() {
		const {sizeX, sizeY} = this;
		for (let i = 0; i< sizeX; i++) {
			for (let j = 0; j<sizeY; j++) {
				this.visited[i][j] = false;
			}
		}
	}

	touch(x,y,manual) {
		if (manual) {
			this.cleanVisited()
		}
		if (x < 0 || x >= this.sizeX) {
			return
		}
		if (y < 0 || y >= this.sizeY) {
			return
		}
		if (this.visited[x][y]) {
			return
		}
		this.visited[x][y] = true;
		if (!this.visibility[x][y]) {
			return
		}
		if (this.field[x][y] === 0) {
			this.visibility[x][y] = false;
			this.touch(x+1, y);
			this.touch(x, y+1);
			this.touch(x-1, y);
			this.touch(x, y-1);
			this.recalculateProbability();
		} else if (typeof this.field[x][y] === 'number') {
			this.visibility[x][y] = false;
			this.recalculateProbability();
			return
		} else if (this.field[x][y] === 'M') {
			this.bombed[x][y] = true;
		}
	}

	recalculateProbability() {
		const opened = this.visibility.flat().reduce((acc, v) => !v ? acc + 1 : acc, 0);
		this.prob = this.mines / (this.allField - opened);
	}

	probability() {
		return this.prob;
	}

	isEnd() {
		const opened = this.visibility.flat().reduce((acc, v) => !v ? acc + 1 : acc, 0);
		return opened + this.mines === this.allField;
	}

	localProbability(x,y) {
		const {sizeX, sizeY} = this;
		const thereIsVisibleNumber = (x,y) => {
			if (x < 0 || x >= sizeX) {
				return 0;
			}
			if (y < 0 || y >= sizeY) {
				return 0;
			}
			if (this.visibility[x][y]) {
				return 0;
			}
			return (typeof this.field[x][y] === 'number' && this.field[x][y] > 0) ? 1 : 0;
		}
		const thereIsExists = (x,y) => {
			if (x < 0 || x >= sizeX) {
				return 0;
			}
			if (y < 0 || y >= sizeY) {
				return 0;
			}
			/*
			if (this.visibility[x][y]) {
				return 0;
			}
			*/
			return 1;
		}

		const a = (thereIsVisibleNumber(x-1,y-1) +
			thereIsVisibleNumber(x,y-1) +
			thereIsVisibleNumber(x+1,y-1) +
			thereIsVisibleNumber(x-1,y) +
			thereIsVisibleNumber(x+1,y) +
			thereIsVisibleNumber(x-1,y+1) +
			thereIsVisibleNumber(x,y+1) +
			thereIsVisibleNumber(x+1,y+1));
		const b = (thereIsExists(x-1,y-1) +
			thereIsExists(x,y-1) +
			thereIsExists(x+1,y-1) +
			thereIsExists(x-1,y) +
			thereIsExists(x+1,y) +
			thereIsExists(x-1,y+1) +
			thereIsExists(x,y+1) +
			thereIsExists(x+1,y+1))

		return (a > 0 && b > 0) ? a/b : 0;
	}
}

class SVGField {

	filed = null;
	mainSVG = null;
	svgns = "http://www.w3.org/2000/svg";

	constructor(field, mainSVG) {
		this.field = field
		this.mainSVG = mainSVG;
	}

	setup(mineClickHandler) {
		const {field, mainSVG, svgns} = this;
		for( let x=0; x < field.sizeX; x += 1 ){
			for( let y=0; y < field.sizeY; y += 1 ){

				const group = document.createElementNS( svgns,'g' );
				group.setAttributeNS(null,'id', `group${x}${y}` );
				group.setAttributeNS(null, 'cursor',  'pointer');
				group.setAttributeNS(null, 'class', 'group');
				group.onclick = () => mineClickHandler(x,y)
				const rect = document.createElementNS( svgns,'rect' );
				rect.setAttributeNS(null,'id', `rect${x}${y}` );
				rect.setAttributeNS( null,'x',x * 50 );
				rect.setAttributeNS( null,'y',y * 50 );
				rect.setAttributeNS( null,'rx',5 );
				rect.setAttributeNS( null,'ry',5 );
				rect.setAttributeNS( null,'width','50' );
				rect.setAttributeNS( null,'height','50' );
				// rect.setAttributeNS( null,'fill','#1d2b06' );
				rect.setAttributeNS(null, 'class', 'mine-rect');
				group.appendChild( rect );

				const text = document.createElementNS( svgns,'text' );
				text.setAttributeNS(null,'id', `text${x}${y}` );
				text.setAttributeNS(null,'x',x * 50 + 25 );
				text.setAttributeNS(null,'y',y * 50 + 25 );
				text.setAttributeNS(null,'font-size', 15 );
				text.setAttributeNS(null,'fill','#00FF00' );
				text.setAttributeNS(null,'text-anchor','middle' );
				text.setAttributeNS(null,'dominant-baseline','middle' );
				text.setAttributeNS(null, 'class', 'prob-text');
				text.innerHTML = field.probability().toFixed(2);
				group.appendChild( text );

				mainSVG.appendChild(group);
			}
		}
	}

	redraw() {
		const {field, mainSVG, svgns} = this;
		for( let x=0; x < field.sizeX; x += 1 ){
			for( let y=0; y < field.sizeY; y += 1 ){
				if (!field.visibility[x][y]) {
					const classNames = mainSVG.getElementById(`group${x}${y}`).getAttributeNS(null, 'class');
					if (!classNames.includes('hidden')) {
						mainSVG.getElementById(`group${x}${y}`).setAttributeNS(null, 'class', classNames + ' hidden');
					}
				}
				if (field.bombed[x][y]) {
					const classNames = mainSVG.getElementById(`group${x}${y}`).getAttributeNS(null, 'class');
					if (!classNames.includes('bombed')) {
						mainSVG.getElementById(`group${x}${y}`).setAttributeNS(null, 'class', classNames + ' bombed');
						mainSVG.getElementById(`rect${x}${y}`).setAttributeNS(null, 'class', 'bombed');
					}
				}
				const fullProbability = field.probability().toFixed(2);
				const localProbability = field.localProbability(x,y).toFixed(2);
				mainSVG.getElementById(`text${x}${y}`).innerHTML = Math.max(fullProbability, localProbability);
			}
		}
		if (this.field.isEnd()) {
			const rects = mainSVG.getElementsByClassName('mine-rect');
			[...rects].forEach((r) => r.setAttributeNS( null,'class','finded' ));

			const group = document.createElementNS( svgns,'g' );
			group.setAttributeNS(null,'id', 'restartButton' );

			group.setAttributeNS(null, 'cursor',  'pointer');
			group.onclick = () => this.restart()
			const rect = document.createElementNS( svgns,'rect' );
			rect.setAttributeNS( null,'x', 25 );
			rect.setAttributeNS( null,'y', 190 );
			rect.setAttributeNS( null,'rx',5 );
			rect.setAttributeNS( null,'ry',5 );
			rect.setAttributeNS( null,'width', 400 );
			rect.setAttributeNS( null,'height', 50 );
			rect.setAttributeNS( null,'fill','#1d2b06' );
			group.appendChild( rect );

			const text = document.createElementNS( svgns,'text' );
			text.setAttributeNS(null,'x', 225 );
			text.setAttributeNS(null,'y', 220 );
			text.setAttributeNS(null,'font-size', 25 );
			text.setAttributeNS(null,'fill','#00FF00' );
			text.setAttributeNS(null,'text-anchor','middle' );
			text.setAttributeNS(null,'dominant-baseline','middle' );
			text.innerHTML = 'Restart';
			group.appendChild( text );

			mainSVG.appendChild(group);
		}
	}

	restart() {
		document.location.reload();
	}
}

window.onload = () => {
	const mainSVG = document.getElementById('main');

	const field = new Field(9, 9, 10);
	const svgField = new SVGField(field, mainSVG);
	svgField.setup((x,y) => {
		field.touch(x,y,true);
		svgField.redraw();
	});
}
