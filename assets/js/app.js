// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html";

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
import {Socket} from "phoenix";
let socket = new Socket("/socket", {params: {token: window.userToken}});
socket.connect();


// import run_game from "./game";
//<script type="text/javascript" src="lib/lodash.js"></script>
import run_demo from "./MemoryGame";
import $ from 'jquery'; 

function init() {
  let root = document.getElementById('root');
  if (root) {
    let channel = socket.channel("games:" + window.gameName, {});
    // channel.join()
    //        .receive("ok", resp => { console.log("Joined successfully", resp) })
    //        .receive("error", resp => { console.log("Unable to join", resp) });

    run_demo(root, channel);
  }
}

// Use jQuery to delay until page loaded.
$(init);

/*
Attributions to all Tutorials and References:

https://www.lynda.com/React-js-tutorials/React-js-Essential-Training/496905-2.html

https://reactjs.org/tutorial/tutorial.html

https://codepen.io/anon/pen/goVeZJ

http://blog.krawaller.se/posts/a-react-js-case-study/

http://lucybain.com/blog/2016/react-state-vs-pros/

https://codepen.io/larryarmstrong/pen/dXXMvN?editors=0010

https://www.youtube.com/watch?v=ywa8BseljUM&list=PLEVmaBhqzpLYyfjphTnO6JgFHL8VL6aSg

https://reactjs.org/docs/conditional-rendering.html

https://reactjs.org/docs/hello-world.html

*/


