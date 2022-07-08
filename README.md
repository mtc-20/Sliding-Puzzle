# Sliding Puzzle
A sliding puzzle solver in pure javascript, based on [this Smashing magazine article][smashing].

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

## TODO
- [ ] ### Solver
- [ ] ### Valid randomizer<sup>[1][valid-random]</sup>
- [ ] ### User images
- [ ] Deploy



[smashing]: https://www.smashingmagazine.com/2016/02/javascript-ai-html-sliding-tiles-puzzle/
[valid-random]: https://github.com/danishmughal/sliding-puzzle