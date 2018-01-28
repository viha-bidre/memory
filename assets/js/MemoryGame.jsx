import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function run_demo(root) {
  ReactDOM.render(<MemoryGame />, root);
}


let allTiles = ["A", "B", "A", "B", "C", "C","D","D","E","E","F","F","G","G","H","H"];

class MemoryGame extends React.Component {
  
  constructor() {
		super();
		this.resetGame = this.resetGame.bind(this);
		this.flipTile = this.flipTile.bind(this);
		this.state = {
			tiles: [],
			flippedTiles: [],
			clicks: 0
		};
	}

  resetGame() {

		let tiles = _.shuffle(allTiles).map(function(val) {
			return {
				val: val,
				status: "hidden"
			};
		});

		this.setState({
			tiles: tiles,
			clicks: 0
		});
	}

  calcClicks() {
		let newClicks = this.state.clicks + 1;
		this.setState({clicks: newClicks}); 
	}
  
  resetTilesStatus(allTiles, flippedTiles, newStatus) {
    
    for (var val of flippedTiles) {
      allTiles[val].status = newStatus;
    }
    
    return allTiles;
  }

  checkTileValue(allTiles, flippedTiles, status) {

		for(var val of flippedTiles) {
			if (allTiles[val][status] !== allTiles[flippedTiles[0]][status]) {
				return false;
			}
		}
		
		return true;

	}

  checkForMatch(allTiles, flippedTiles) {
		this.calcClicks();

		if(this.checkTileValue(allTiles,flippedTiles, "val")) {
			allTiles = this.resetTilesStatus(allTiles, flippedTiles,"matched");
		}
		else {
			allTiles = this.resetTilesStatus(allTiles, flippedTiles, "hidden");
		}
		return allTiles;
	} 

flipTile(index) {

		if(this.ignoreTilesClicks !== true) {

			let flippedTiles = _.concat(this.state.flippedTiles, index);
			let allTiles = this.state.tiles;

			allTiles[flippedTiles[flippedTiles.length - 1]].status = "flipped";

			if(flippedTiles.length === 2) {
				this.setState({
					tiles: allTiles
				});

				let _this = this;

				setTimeout(function() {
					allTiles = _this.checkForMatch(allTiles,flippedTiles);
					flippedTiles = [];

					_this.setState({
						flippedTiles: flippedTiles,
						tiles: allTiles
					});
				},600);
			}
			else{

				allTiles[flippedTiles[0]].status = "flipped";

				this.setState({
					flippedTiles: flippedTiles,
					tiles: allTiles
				});
			}
		}
	}
  
  render() {
    
    let clickEvent = this.flipTile;
    let tileIndex = 0;
    let message = "";
    
    if (this.state.clicks > 16) {
      message = "You Lose. Try Again!";
    }
    
    return (
      <div>
        <button onClick={this.resetGame}>Start / Reset Game</button>
        <p>Target Score : 16 guesses or less </p>
        <p>Current Score : {this.state.clicks} guesses </p>
        <p> {message} </p>
        
        <div className="tiles">
          {this.state.tiles.map(function(tile) {
            return (
              <Tile
                index={tileIndex++}
                clickEvent={clickEvent}
                status={tile.status}
                val={tile.val}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

class Tile extends React.Component {
  
  constructor() {
		super();
		this.flipTile = this.flipTile.bind(this);
	}
  
  flipTile() {
		if(this.props.status === "hidden") {
			this.props.clickEvent(this.props.index);
		}
	}
  
  render() {
		return (
			<div onClick = {this.flipTile} className = {"tile tile-" + this.props.status}>
				 <div className = "tile-main">
				 	<div className = "tile-front"></div>
				 	<div className = "tile-front tile-back"> {this.props.val} </div>
				 </div>
			</div>
		);
	} 
}




