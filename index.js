var emptyTileRow = 1;
var emptyTileCol = 2;
var cellDisplacement = "69px";
heur = "mis"



function moveTile() {
	var pos = $(this).attr('data-pos');
	// console.log(pos)
	var posRow = parseInt(pos.split(',')[0]);
	var posCol = parseInt(pos.split(',')[1]);

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


	if (posRow == emptyTileRow && posCol + 1 == emptyTileCol) {
		$(this).animate({
			'right': "-=" + cellDisplacement
		});
		
		$('#empty').animate({
			'right': "+=" + cellDisplacement
		});
		
		emptyTileCol -= 1;
		$(this).attr('data-pos', posRow + "," + (posCol + 1));
	}

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
}

// $('.cell').click(function() {
// 	alert($(this).attr('data-pos'))
// })
$('.cell').click(moveTile)


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
	// console.log(this.goal.strRepresentation)
	while (this.queue.length > 0) {
		var current = this.queue.dequeue()
		
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

function start() {
	heur = $("#heuristic :selected").val()
	// console.log(heur)
	emptyPos = $("#empty").attr("data-pos")
	console.log(emptyPos)
	emptyTileRow = parseInt(emptyPos.split(',')[0]);
	emptyTileCol = parseInt(emptyPos.split(',')[1]);;
	console.log(emptyTileRow + ',' + emptyTileCol)

	initial_arr = [[],[],[]]
	initial_arr[0][0] = 1
	initial_arr[1][0] = 1
	console.log(initial_arr)
	$(".start .cell").each(function(i, obj) {
		console.log(i,$(this).find("span").text())
		temp_pos = $(this).attr("data-pos")
		i = parseInt(temp_pos.split(',')[0])
		j = parseInt(temp_pos.split(',')[1])
		val_str = ($(this).find("span").text() != '') ? parseInt($(this).find("span").text()) : 0
		// console.log(val_str)
		initial_arr[i][j] = val_str
	})

	console.log(initial_arr)

	var init = new ANode(0,initial_arr,emptyTileRow,emptyTileCol,0)
	var goal = new ANode(0, [[1,2,3], [4,5,6], [7,8,0]],2,2,0)
	var astar = new AStar(init, goal, 0)
	
	var startTime = new Date()
	var result = astar.execute()
	var endTime = new Date()
	alert("Completed in " + (endTime - startTime) + "milliseconds.")

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
						$("div[data-pos='" + move + "']").click()
						panel.innerHTML += 'Step: ' + step + ' -> ' + solution[step] + ','
						step++
		}
}