import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function run_demo(root, channel) {
  ReactDOM.render(<MemoryGame channel={channel}/>, root);
}

class MemoryGame extends React.Component {
  
  constructor(props) {
  		console.log("Inside MemoryGame constructor");
		super(props);
		this.state = {
			tiles: [],
			flippedTiles: [],
			clicks: 0,
		};
		this.channel = props.channel;
		this.channel.join()
        	.receive("ok", this.gotView.bind(this))
        	.receive("error", resp => { console.log("Unable to join", resp) });
	}


	gotView(view) {
    	console.log("New view", view);
    	this.setState(view.game);
  	}

	startGame() {
    	console.log("Start Game");
		this.channel.push("reset", {})
        		.receive("ok", this.gotView.bind(this));
	}

    resetGame() {
    	console.log("Reset Game");
		this.channel.push("reset", {})
        		.receive("ok", this.gotView.bind(this));
	}

	flipTile(index) {

		let flippedTiles = _.concat(this.state.flippedTiles, index);
		console.log(flippedTiles)
		let allTiles = this.state.tiles;

		allTiles[flippedTiles[flippedTiles.length - 1]].status = "flipped";

		if(flippedTiles.length === 2) {
			this.setState({
				tiles: allTiles
			});
				
			setTimeout( () => {
				this.channel.push("checkForMatch", {flippedTiles: flippedTiles})
							.receive("ok",this.gotView.bind(this));
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
  
  	render() {
    
    	let clickEvent = this.flipTile.bind(this);
    	let tileIndex = 0;
    	let message = "";
    
    	if (this.state.clicks > 16) {
      		message = "You Lose. Try Again!";
    	}
    
    	return (
      		<div>
        		<p><button onClick={this.startGame.bind(this)}>Start Game</button></p>
        		<p><button onClick={this.resetGame.bind(this)}>Reset Game</button></p>
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




