

//build the grid with the numbers
function BuildCanvas(ctx) {
    ctx.fillStyle="black";
    ctx.textAlign="center"

    for (var i = 1; i <=10; i++) {
        const y=i*50+30;
        ctx.fillText(i.toString(),30,y)
    }

    var letters = 'ABCDEFGHIJ';
    for (var i = 0; i < letters.length; i++) {
        const x = i * 50 + 70;
        ctx.fillText(letters[i].toString(), x, 40);
    }
      
        // Loop to draw multiple gride
    for (var i = 1; i <= 11; i++) {
        ctx.moveTo(50*i,50);
        ctx.lineTo(50*i,550);
        ctx.moveTo(50,50*i);
        ctx.lineTo(550,50*i);
    }
    ctx.stroke();  
}

//check if the ship is inside the grid
function CheckInsideGrid(rect) {
    let grid_left = 50;
    let grid_right = 550;
    let grid_top = 50;
    let grid_bottom = 550;

    // Check if the rectangle is inside the grid boundaries
    return (
        rect.x >= grid_left &&
        rect.x + rect.width <= grid_right &&
        rect.y >= grid_top &&
        rect.y + rect.height <= grid_bottom
    );
}

//build the ships and put them in the right index
function BuildRect(ctx,rects,rectAttached,c_width,c_height){

    ctx.clearRect(0, 0, c_width, c_height);
    BuildCanvas(ctx);

    rects.forEach(element => {
        ctx.fillStyle = element.color;
        ctx.fillRect(element.x, element.y, element.width, element.height);
    });
    rectAttached.forEach(element => {
        ctx.fillStyle = element.color;
        ctx.fillRect(element.x, element.y, element.width, element.height);
    });
    
}

function AllShapesInsideCanvas(rectsC1,rectsC2) {

    return rectsC1.every(CheckInsideGrid) && rectsC2.every(CheckInsideGrid);
    
}

function SnapToGrid(rect) {
    rect.x = Math.round((rect.x - 50) / 50) * 50 + 50;
    rect.y = Math.round((rect.y - 50) / 50) * 50 + 50;
}

function AIHit() {
    if (!gameStarted || playerTurn) return;

    let x, y;
    let nextHit = getNextAIHit();

    if (nextHit) {
        x = nextHit.x;
        y = nextHit.y;
    } else {
        do {
            x = Math.floor(Math.random() * 10) * 50 + 50;
            y = Math.floor(Math.random() * 10) * 50 + 50;
        } while (rectsC1Attacked.some(att => att.x === x && att.y === y));

        // Reset AI hit memory if starting a random hit
        lastAIHit = null;
        directionsTried = [];
    }

    let hit = rectsC1.some(rect => x >= rect.x && x < rect.x + rect.width && y >= rect.y && y < rect.y + rect.height);

    if (hit) {
        rectsC1Attacked.push({ x: x, y: y, width: 50, height: 50, color: 'green' });
        lastAIHit = { x, y };
        directionsTried = []; // Reset directions tried after a hit
    } else {
        rectsC1Attacked.push({ x: x, y: y, width: 50, height: 50, color: 'grey' });
        if (lastAIHit) {
            // Continue trying other directions if there was a previous hit
            setTimeout(AIHit, 1000);
            return;
        }
    }

    BuildRect(ctx1, rectsC1, rectsC1Attacked, c1_width, c1_height);
    console.log(`AI hits (${x}, ${y})`);

    if (CheckAllShapesHit(rectsC1, rectsC1Attacked)) {
        gameStarted = false;
        AIWins = true;
        alert("AI wins!");
    } else {
        playerTurn = true; // Switch to player's turn
    }
}

function getNextAIHit() {
    if (!lastAIHit) return null;

    for (let dir of directions) {
        if (!directionsTried.some(triedDir => triedDir.x === dir.x && triedDir.y === dir.y)) {
            let nextX = lastAIHit.x + dir.x;
            let nextY = lastAIHit.y + dir.y;

            if (nextX >= 50 && nextX <= 500 && nextY >= 50 && nextY <= 500 && !rectsC1Attacked.some(att => att.x === nextX && att.y === nextY)) {
                directionsTried.push(dir);
                return { x: nextX, y: nextY };
            }
        }
    }

    return null;
}

function AIHit() {
    if (!gameStarted || playerTurn) return;

    let x, y;
    let nextHit = getNextAIHit();

    if (nextHit) {
        x = nextHit.x;
        y = nextHit.y;
    } else {
        do {
            x = Math.floor(Math.random() * 10) * 50 + 50;
            y = Math.floor(Math.random() * 10) * 50 + 50;
        } while (rectsC1Attacked.some(att => att.x === x && att.y === y));

        // Reset AI hit memory if starting a random hit
        lastAIHit = null;
        directionsTried = [];
    }

    let hit = rectsC1.some(rect => x >= rect.x && x < rect.x + rect.width && y >= rect.y && y < rect.y + rect.height);

    if (hit) {
        rectsC1Attacked.push({ x: x, y: y, width: 50, height: 50, color: 'green' });
        lastAIHit = { x, y };
        directionsTried = []; // Reset directions tried after a hit
    } else {
        rectsC1Attacked.push({ x: x, y: y, width: 50, height: 50, color: 'grey' });
    }

    BuildRect(ctx1, rectsC1, rectsC1Attacked, c1_width, c1_height);
    console.log(`AI hits (${x}, ${y})`);

    if (CheckAllShapesHit(rectsC1, rectsC1Attacked)) {
        gameStarted = false;
        AIWins = true;
        alert("AI wins!");
    } else {
        playerTurn = true; // Switch to player's turn
    }
}

        

//checking if mouse is in index of a ship
let is_mouse_in_shape = function(x, y, rect) {
    const rectCanvas = c1.getBoundingClientRect();
    
    // Calculate the mouse position relative to the canvas
    const mouseX = x - rectCanvas.left;
    const mouseY = y - rectCanvas.top;
    
    // Check if the mouse is within the rectangle
    return (
        mouseX >= rect.x &&
        mouseX <= rect.x + rect.width &&
        mouseY >= rect.y &&
        mouseY <= rect.y + rect.height
    );
}

//if the you click on the mouse
let mouse_down = function (event) {
    event.preventDefault();
    console.log(event);

    startX = parseInt(event.clientX);
    startY = parseInt(event.clientY);

    let index = 0;

    for (let rect of rectsC1) {
        if (is_mouse_in_shape(startX, startY, rect) && !CheckInsideGrid(rect)) {
            current_shape_index = index;
            console.log('yes');
            is_dragging = true;
            return;
        } else {
            console.log('no');
        }
        index++;
    }

    if (AllShapesInsideCanvas(rectsC1, rectsC2) && !playerWins && !AIWins) {
        gameStarted = true;
        console.log('Game started');

        // Player's turn to hit Canvas 2
        if (playerTurn) {
            // Check if click is inside the grid of Canvas 2
            const rectCanvas = c2.getBoundingClientRect();
            const mouseX = startX - rectCanvas.left;
            const mouseY = startY - rectCanvas.top;

            if (mouseX >= 50 && mouseX <= 550 && mouseY >= 50 && mouseY <= 550) {
                // Calculate grid coordinates
                const gridX = Math.floor((mouseX - 50) / 50) * 50 + 50;
                const gridY = Math.floor((mouseY - 50) / 50) * 50 + 50;

                // Check if this grid position is not already attacked
                if (!rectsC2Attacked.some(att => att.x === gridX && att.y === gridY)) {
                    let hit = rectsC2.some(rect => gridX >= rect.x && gridX < rect.x + rect.width && gridY >= rect.y && gridY < rect.y + rect.height);

                    if (hit) {
                        rectsC2Attacked.push({ x: gridX, y: gridY, width: 50, height: 50, color: 'green' });
                    } else {
                        rectsC2Attacked.push({ x: gridX, y: gridY, width: 50, height: 50, color: 'grey' });
                    }

                    BuildRect(ctx2, rectsC2, rectsC2Attacked, c2_width, c2_height);
                    console.log(`Player hits (${gridX}, ${gridY})`);

                    if (CheckAllShapesHit(rectsC2, rectsC2Attacked)) {
                        gameStarted = false;
                        playerWins = true;
                        alert("Player wins!");
                    } else {
                        // Switch to AI turn
                        playerTurn = false;
                        setTimeout(AIHit, 1000); // AI hits after 1 second
                    }
                }
            }
        }
    }
}

function CheckAllShapesHit(rects, attacks) {
    return rects.every(rect => {
        for (let x = rect.x; x < rect.x + rect.width; x += 50) {
            for (let y = rect.y; y < rect.y + rect.height; y += 50) {
                if (!attacks.some(att => att.x === x && att.y === y)) {
                    return false;
                }
            }
        }
        return true;
    });
}

//if you stop clicking on the mouse
let mouse_up=function(event){
    
    if(!is_dragging){
        return;
    }
    event.preventDefault();
    is_dragging=false;
    SnapToGrid(rectsC1[current_shape_index]);
    BuildRect(ctx1, rectsC1, rectsC1Attacked, c1_width, c1_height);
    
}
let mouse_out=function(event){
    
    if(!is_dragging){
        return;
    }
    event.preventDefault();
    is_dragging=false;
    SnapToGrid(rectsC1[current_shape_index]);
    BuildRect(ctx1, rectsC1, rectsC1Attacked, c1_width, c1_height);
    
}

//if mouse is moving after a click on a ship
let mouse_move=function(event){
    
    if(!is_dragging){
        return;
    }
    else{
        console.log('move');
        event.preventDefault();
        let mouse_x=parseInt(event.clientX);
        let mouse_y=parseInt(event.clientY);
        
        let new_x=mouse_x-startX;
        let new_y=mouse_y-startY;
        
        let curr_shape=rectsC1[current_shape_index];
        console.log(curr_shape.x);
        curr_shape.x+=new_x;
        curr_shape.y+=new_y;
        rectsC1[current_shape_index]=curr_shape;
        
        BuildRect(ctx1,rectsC1,rectsC1Attacked,c1_width,c1_height);
        console.log(curr_shape.x);
        startX=mouse_x;
        startY=mouse_y;
    }
}

var c1 = document.getElementById("myCanvas1");
var c2 = document.getElementById("myCanvas2");
var ctx1 = c1.getContext("2d");
var ctx2 = c2.getContext("2d");
var rectsC1 = [
    { x: 50, y: 600, width: 50, height: 50, color:'blue' },
    { x: 150, y: 600, width: 50, height: 100,color:'blue' },
    { x: 250, y: 600, width: 150, height: 50,color:'blue' },
    { x: 450, y: 600, width: 100, height: 50,color:'blue' }
];
var rectsC2 = [
    { x: 50, y: 300, width: 50, height: 50,color:'red' },
    { x: 150, y: 100, width: 50, height: 100,color:'red' },
    { x: 250, y: 450, width: 150, height: 50,color:'red' },
    { x: 450, y: 50, width: 100, height: 50,color:'red' }
];

var rectsC1Attacked = [];
var rectsC2Attacked = [];

let c1_width=c1.width;
let c2_width=c2.width;
let c1_height=c1.height;
let c2_height=c2.height;
let is_dragging=false;
let startX;
let startY;
let current_shape_index;
let gameStarted=false;
let playerTurn=true;
let playerWins=false;
let AIWins=false;
let lastAIHit = null;
let lastDirection = null;
let directionsTried = [];
const directions = [
    { x: 0, y: -50 },
    { x: 0, y: 50 },
    { x: -50, y: 0 },
    { x: 50, y: 0 }
];

c1.onmousedown=mouse_down;
c1.onmouseup=mouse_up;
c1.onmouseout=mouse_out;
c1.onmousemove=mouse_move;
c2.onmousedown=mouse_down;
c2.onmouseup=mouse_up;
c2.onmouseout=mouse_out;
c2.onmousemove=mouse_move;


BuildRect(ctx1,rectsC1,rectsC1Attacked,c1_width,c1_height);
BuildRect(ctx2,rectsC2,rectsC2Attacked,c2_width,c2_height);



