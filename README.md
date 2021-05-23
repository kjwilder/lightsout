### Lights Out (C++ using X11)

# Compile:
  g++ -Wall -O lightsout.cc -o lightsout -L/usr/X11R6/lib -lX11

# Run:
  ./lightsout
  ./lightsout gamesize=10

# How to play:
  Turn off all the lights.  Clicking on any square will toggle its on/off
  status as well as the on/off status of the lights immediately next to
  it both horizontally and vertically.

# Options

  If you play on a 5x5 board (the default), then clicking on the right mouse
  button will show a set of squares you can click to solve the puzzle.  The
  solution shown will be a 'minimal' solution in the sense that there is no other
  solution that requires clicking on fewer squares.  See the
  [strategy.txt](strategy.txt) file for a discussion of how this solution is
  obtained.  Clicking the right mouse button again will turn off the solution.

  Use the middle mouse button to toggle individual squares.  Note that
  the resulting arrangement of lights may not be a solvable puzzle.
  The arrangements that the computer presents are always solvable.
