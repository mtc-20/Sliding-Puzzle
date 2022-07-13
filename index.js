var emptyTileRow = 1;
var emptyTileCol = 2;
var cellDisplacement = "69px";
var goal_arr = [[1,2,3], [4,5,6], [7,8,0]]
heur = "mis"

var grid = document.getElementById("confetti")
// document.body.appendChild(grid);

isWin = false
isShuffle = false
isDebug = false



function moveTile() {
	var pos = $(this).attr('data-pos');
	if(isDebug) console.log(pos)
	var posRow = parseInt(pos.split(',')[0]);
	var posCol = parseInt(pos.split(',')[1]);

	// Move tile down
	if (posRow + 1 == emptyTileRow && posCol == emptyTileCol) {
		$(this).animate({
			'top': "+=" + cellDisplacement
		});
		
		$('#empty').animate({
			'top': "-=" + cellDisplacement
		});
		
		emptyTileRow -= 1;
		$(this).attr('data-pos', (posRow+1) + "," + posCol);
	}

	// Move tile up
	if (posRow - 1 == emptyTileRow && posCol == emptyTileCol) {
		$(this).animate({
			'top': "-=" + cellDisplacement
		});
		
		$('#empty').animate({
			'top': "+=" + cellDisplacement
		});
		
		emptyTileRow += 1;
		$(this).attr('data-pos', (posRow-1) + "," + posCol);
	}

	// Move tile right
	if (posRow == emptyTileRow && posCol + 1 == emptyTileCol) {
		$(this).animate({
			'right': "-=" + cellDisplacement // move right
		});
		
		$('#empty').animate({
			'right': "+=" + cellDisplacement // move left
		});
		
		emptyTileCol -= 1;
		$(this).attr('data-pos', posRow + "," + (posCol + 1));
	}

	// Move tile left
	if (posRow == emptyTileRow && posCol - 1 == emptyTileCol) {
		$(this).animate({
			'right': "+=" + cellDisplacement
		});
		
		$('#empty').animate({
			'right': "-=" + cellDisplacement
		});
		
		emptyTileCol += 1;
		$(this).attr('data-pos', posRow + "," + (posCol - 1));
	}

	$('#empty').attr('data-pos', emptyTileRow + "," + emptyTileCol)
	
	// party.confetti(grid)
	if (!isShuffle) checkWinState()
}

// $('.cell').click(function() {
// 	alert($(this).attr('data-pos'))
// })
$('.start .cell').click(moveTile)


/**
 * Constructor of class Node
 * @class
 * @constructor
 * @param {int} value - represents  `f(s)`
 * @param {ANode} state - represents  the state of the board as a 2D array
 * @param {int} emptyRow - represents  empty row no.
 * @param {int} emptyCol - represents  empty column no.
 * @param {int} depth - represents  empty column no.
 */
function ANode(value, state, emptyRow, emptyCol, depth) {
	this.value = value
	this.state = state
	this.emptyCol = emptyCol
	this.emptyRow = emptyRow
	this.depth = depth
	this.strRepresentation = ""
	this.path = ""

	for (var i = 0; i < state.length; i++) {
		if (state[i].length != state.length) {
			alert("No. of rows differ from no.of columns")
			return false;
		}

		for (var j=0; j < state[i].length; j++) {
			this.strRepresentation += state[i][j] + ",";
		}

		this.size = this.state.length
	}
}

/**
* Constructor of class A-Star
* @param {ANode} initial
* @param {ANode} goal
* @param {int} empty
**/
function AStar(initial, goal, empty) {
	this.initial = initial
	this.goal = goal
	this.empty = empty
	this.queue = new PriorityQueue({comparator : function(a,b) {
		if (a.value > b.value) return 1
		if (a.value < b.value) return -1
		return 0

	}});
	this.queue.queue(initial);
	this.visited = new HashSet();
}

AStar.prototype.execute = function () {
	this.visited.add(this.initial.strRepresentation)
	// console.log(this.visited)
	while (this.queue.length > 0) {
		var current = this.queue.dequeue()
		if (isDebug) console.log("currenRep:" + current.strRepresentation )
		
		// console.log(current.strRepresentation)
		if (current.strRepresentation == this.goal.strRepresentation) {
			
			console.log("Soln found!")
			return current
		}
		this.expandNode(current)
	}
}

AStar.prototype.expandNode = function(node) {
	var temp
	var newState
	var col = node.emptyCol
	var row = node.emptyRow
	var newNode 

	// Up
	if (row > 0) {
		newState = node.state.clone()
		temp = newState[row-1][col]
		newState[row-1][col] = this.empty
		newState[row][col] = temp
		newNode = new ANode(0, newState, row-1, col, node.depth +1)

		if(!this.visited.contains(newNode.strRepresentation)) {
			newNode.value = newNode.depth + this.heuristic(newNode)
			newNode.path = node.path + "U"
			this.queue.queue(newNode)
			this.visited.add(newNode.strRepresentation)
		}
	}
	
	// Down
	if (row < node.size -1) {
		newState = node.state.clone()
		temp = newState[row+1][col]
		newState[row+1][col] = this.empty
		newState[row][col] = temp
		newNode = new ANode(0, newState, row+1, col, node.depth)
		
		if(!this.visited.contains(newNode.strRepresentation)) {
			newNode.value = newNode.depth + this.heuristic(newNode)
			newNode.path = node.path + "D"
			this.queue.queue(newNode)
			this.visited.add(newNode.strRepresentation)
		}
	}
	
	// Left
	if (col > 0) {
		newState = node.state.clone()
		temp = newState[row][col-1]
		newState[row][col-1] = this.empty
		newState[row][col] = temp
		newNode = new ANode(0, newState, row, col-1, node.depth+1)
		
		if(!this.visited.contains(newNode.strRepresentation)) {
			newNode.value = newNode.depth + this.heuristic(newNode)
			newNode.path = node.path + "L"
			this.queue.queue(newNode)
			this.visited.add(newNode.strRepresentation)
		}
	}
	
	// Right
	if (col < node.size -1) {
		newState = node.state.clone()
		temp = newState[row][col +1]
		newState[row][col +1] = this.empty
		newState[row][col] = temp
		newNode = new ANode(0, newState, row, col+1, node.depth+1)
		
		if(!this.visited.contains(newNode.strRepresentation)) {
			newNode.value = newNode.depth + this.heuristic(newNode)
			newNode.path = node.path + "R"
			this.queue.queue(newNode)
			this.visited.add(newNode.strRepresentation)
		}
	}
}

Array.prototype.clone = function() {
	return JSON.parse(JSON.stringify(this))
}

AStar.prototype.heuristic = function(node) {
	if (heur == "mis") return this.misplacedTiles(node)	
	else if (heur == "man") return this.manhattanDistance(node) 
	// return this.manhattanDistance(node) + this.manhattanDistance(node)
	else if (heur == "lin") return this.manhattanDistance(node) + this.linearConflicts(node)
}

function getCurrentTileState() {
	tileState = [[],[],[]]

	$(".start .cell").each(function(i, obj) {
		// console.log(i,$(this).find("span").text())
		temp_pos = $(this).attr("data-pos")
		i = parseInt(temp_pos.split(',')[0])
		j = parseInt(temp_pos.split(',')[1])
		val_str = ($(this).find("span").text() != '') ? parseInt($(this).find("span").text()) : 0
		// console.log(val_str)
		tileState[i][j] = val_str
	})
	return tileState
}

function start() {
	isWin = false
	step = 0
	heur = $("#heuristic :selected").val()
	// console.log(heur)
	emptyPos = $("#empty").attr("data-pos")
	if (isDebug) console.log("emptyPos: " + emptyPos)
	emptyTileRow = parseInt(emptyPos.split(',')[0]);
	emptyTileCol = parseInt(emptyPos.split(',')[1]);
	// console.log(emptyTileRow + ',' + emptyTileCol)

	// initial_arr = [[],[],[]]
	// initial_arr[0][0] = 1
	// initial_arr[1][0] = 1
	// console.log(initial_arr)
	// $(".start .cell").each(function(i, obj) {
	// 	// console.log(i,$(this).find("span").text())
	// 	temp_pos = $(this).attr("data-pos")
	// 	i = parseInt(temp_pos.split(',')[0])
	// 	j = parseInt(temp_pos.split(',')[1])
	// 	val_str = ($(this).find("span").text() != '') ? parseInt($(this).find("span").text()) : 0
	// 	// console.log(val_str)
	// 	initial_arr[i][j] = val_str
	// })
	initial_arr = getCurrentTileState()
	if (isDebug) {
		console.log(initial_arr)
		console.log(goal_arr)
	}

	var init = new ANode(0,initial_arr,emptyTileRow,emptyTileCol,0)
	var goal = new ANode(0, goal_arr,2,2,0)
	var astar = new AStar(init, goal, 0)
	
	var startTime = new Date()
	var result = astar.execute()
	var endTime = new Date()
	if(!isDebug)	alert("Completed in " + (endTime - startTime) + "milliseconds.")

	var panel = document.getElementById('panel')
	// console.log(result)	
	panel.innerHTML = "Solution: " + result.path + " Total steps: " + result.path.length + "<br />"
	solution = result.path
}


// Heuristic 1
AStar.prototype.misplacedTiles = function(node) {
	var result = 0;
	
	for (var i = 0;i<node.state.length; i++) {
		for (var j=0; j<node.state[i].length; j++) {
			if (node.state[i][j] != this.goal.state[i][j] && node.state[i][j] != this.empty) result++;
		}
	}
	// console.log(result)
	return result;
}

// Heuristic 2
AStar.prototype.manhattanDistance = function(node) {
	var result = 0
	
	for(var i=0; i < node.state.length; i++) {
		for (var j=0; j<node.state[i].length; j++) {
			var elem = node.state[i][j]
			var found = false
			for(var h=0; h<this.goal.state.length; h++) {
				for(var k=0; k<this.goal.state[h].length; k++) {
					if(this.goal.state[h][k] == elem) {
						result += Math.abs(h-i) + Math.abs(j-k)
						found = true
						break
					}
				}
				if (found) break
			}
		}
	}
	return result
}

// Heuristic 3
AStar.prototype.linearConflicts = function (node) {
	var result = 0
	var state = node.state

	for(var i=0; i<state.length; i++) {
		result += this.findConflicts(state, i, 1)
	}
	for (var i=0; i<state[0].length; i++) {
		result += this.findConflicts(state, i, 1)
	}
	return result
}

AStar.prototype.findConflicts = function (state, i, dimension) {
	var result = 0
	tilesRelated = new Array()

	for (var h=0; h<state.length - 1 && !tilesRelated.includes(h); h++) {
		for(var k=h+1; k<state.length && !tilesRelated.includes(h); k++) {
			var moves = dimension == 1 ? this.inConflict(i, state[i][h], state[i][k],h,k,dimension) : this.inConflict(i, state[h][i], state[k][i],h,k,dimension)

			if (moves == 0) continue
			result += 2
			tilesRelated.push([h,k])
			break
		}
	}
	return result
}

AStar.prototype.inConflict = function(index, a,b, indexA, indexB, dimension) {
	var indexGoalA = -1
	var indexGoalB = -1
	for (var c=0; c < this.goal.state.length; c++) {
		if (dimension ==1 && this.goal.state[index][c] == a) indexGoalA =c;
		else if (dimension==1 && this.goal.state[index][c] == b) indexGoalB = c;
		else if (dimension==0 && this.goal.state[c][index] == a) indexGoalA = c;
		else if (dimension==0 && this.goal.state[c][index] == b) indexGoalB = c;
	} 

	return (indexGoalA >= 0 && indexGoalB >= 0) && ((indexA < indexB && indexGoalA > indexGoalB) || (indexA>indexB && indexGoalA < indexGoalB)) ? 2 : 0;
}

step = 0
function showSolution() {
	// console.log("clicked")
	// console.log(step)
	var move = ''
	if (step<solution.length) {

		switch(solution[step]) {
			case "R":
				move = (emptyTileRow).toString() + ',' + (emptyTileCol+1).toString()
				break
			case "L":
				move = (emptyTileRow).toString() + ',' + (emptyTileCol-1).toString()
				break
			case "U":
				move = (emptyTileRow-1).toString() + ',' + (emptyTileCol).toString()
				break
			case "D":
				move = (emptyTileRow+1).toString() + ',' + (emptyTileCol).toString()
				break
			}
			if(isDebug) console.log("Step: "+ move)
		$("div[data-pos='" + move + "']").click()
		panel.innerHTML += 'Step: ' + step + ' -> ' + solution[step] + ','
		step++
		}
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function movementMap(dataPos) {
	if (dataPos == "0,0") return ["0,1","1,0"]
	if (dataPos == "0,1") return ["0,0","0,2","1,1"]
	if (dataPos == "0,2") return ["0,1","1,2"]
	if (dataPos == "1,0") return ["0,0","1,1","2,0"]
	if (dataPos == "1,1") return ["0,1","1,0","1,2","2,1"]
	if (dataPos == "1,2") return ["0,2","1,1","2,1"]
	if (dataPos == "2,0") return ["1,0","2,1"]
	if (dataPos == "2,1") return ["0,0","1,1","2,2"]
	if (dataPos == "2,2") return ["2,1","1,2"]
}

function shuffleTiles() {
	// start_arr = [[6,4,7], [8,5,0], [3,2,1]]
	// const arr1D = start_arr.reduce((a,b) => [...a, ...b], [])
	// console.log(arr1D)
	// shuffleTiled = shuffle(arr1D)
	// shuffleTile2D = shuffleTiled.reduce((acc,i) => {
	// 	if(acc[acc.length-1].length>=3) {
	// 		acc.push([])
	// 	}
	// 	acc[acc.length-1].push(i)
	// 	return acc
	// }, [[]])
	// console.log(shuffleTile2D)

	var shuffleCounter = 0;
	var lastShuffled;
	isShuffle = true
	isWin = false
	step = 0
	while (shuffleCounter < 20) {
		emptyPos = $("#empty").attr("data-pos")
		validTiles = movementMap(emptyPos)
		randomPos = validTiles[Math.floor(Math.random()*validTiles.length)]
		if (isDebug) console.log($("div[data-pos='"+randomPos+"']").find("span").text())
		if (lastShuffled != randomPos) {
			if (isDebug) console.log(randomPos)
			shuffleCounter++;
			lastShuffled = randomPos
			$("div[data-pos='"+randomPos+"']").click()

		}
	}
	isShuffle=false
}

function checkWinCondition() {
	var tilePos = getCurrentTileState()
	for (var i=0; i<3;i++){
		for (var j=0; j<3;j++) {
			if (tilePos[i][j] != goal_arr[i][j]) return false
		}
	}
	// console.log(tilePos)
	return true
}

function checkWinState() {
	isWin = checkWinCondition()
	// if (isDebug) isWin = true
	if (isWin == true) {
		var winConfetti = confetti.create(grid, {resize: true})
		// grid.style.zIndex=2
		console.log("Win!!!")
		winConfetti({spread: 180, ticks: 500})
		setTimeout(() => {
			winConfetti.reset();
			grid.style.zIndex=-1
		}, 2000);
	}
}