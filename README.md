# Sliding Puzzle
A sliding puzzle solver in pure javascript, based on [this Smashing magazine article][smashing].

![Screenshot of Sliding solver page](http://free.pagepeeker.com/v2/thumbs.php?size=x&url=https%3A%2F%2Fmtc-20.github.io%2FSliding-Puzzle)

The idea started as just wanting to create a simple sliding puzzle gamepage where users 
- could try and solve a 9x9 puzzle whose contents would be randomized everytime.
- could upload their own image, 
- which would then be converted into a 9x9 puzzle grid,
- and then played at their own leisure.
- What would be nice is to create shareable links as well for the user generated puzzles


Instead I stumbled on this solver article that uses and explains the A-star algorithm (which I have so far only used in SLAM) and I thought it would be fascinating to try out. The explanation doesn't go in too deep, enough to give you a basic understandinghow the solver works. But I have to admit, the code leaves you a little lacking, and some errors.

But didn't take too long to debug. Once it was working, 
- made it "more dynamic" so that the solver always takes in the latest state of the puzzle to solve
- provided a dropdonw list to choose which heurestic to use for the solver

## Valid randomizer

While looking up ways to shuffle the tiles, came across this repo by [@danishmughal][valid-random] which does the whole thing quite beautifully. So, my implementation is based on this.

My original idea was to just shuffle the 2D array, for which I had come across these two nice stack overflow responses - [Knuth Shuffle in JS][shuffle] and [Array.reduce][reduce]. However, I liked Danish idea more, hence didn't get around to fully implementing these two. However, here's a code snippet:
```js
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

// Assume this is the starting state of grid
start_arr = [[6,4,7], [8,5,0], [3,2,1]]
// First reduce to 1D array
const arr1D = start_arr.reduce((a,b) => [...a, ...b], [])
console.log(arr1D)
// Shuffle this 1D array
shuffleTiled = shuffle(arr1D)
// Now reduce shuffled array back to original shape
shuffleTile2D = shuffleTiled.reduce((acc,i) => {
	if(acc[acc.length-1].length>=3) {
		acc.push([])
	}
	acc[acc.length-1].push(i)
	return acc
}, [[]])
console.log(shuffleTile2D)
```
## TODO
- [ ] ### Solver
- [ ] ### User images
- [x] Deploy
- [x] Add animation when solution/goal reached

### Credits and References
- [Canvas confetti][confetti]
- [Hashset and hashtable][hash]

[smashing]: https://www.smashingmagazine.com/2016/02/javascript-ai-html-sliding-tiles-puzzle/
[valid-random]: https://github.com/danishmughal/sliding-puzzle
[reduce]: https://stackoverflow.com/questions/52241641/shuffling-multidimensional-array-in-js
[shuffle]: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
[confetti]: https://github.com/catdad/canvas-confetti
[hash]: https://www.dropbox.com/s/0v7lbn9xxofj9vw/sliding%20tiles%20puzzle.rar?dl=0&file_subpath=%2Fjs