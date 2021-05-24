# Lights Out Strategy (5x5 Game)

## Notation

The 25 buttons are referred to according to the following numbering:
```
 1  2  3  4  5
 6  7  8  9 10
11 12 13 14 15
16 17 18 19 20
21 22 23 24 25
```

## A winning strategy

1. If button 1 is on, turn it off by pushing button 6, the button directly
   below button 1.  Next, in order, turn off buttons 2 through 20 by pushing the
   buttons directly below them if they are on.
1. The puzzle has now either been solved, or there are some buttons in the
   bottom row that are on.  If the puzzle is unsolved, push buttons in the top row
   according to the following rules:
   *  If button 21 is on, push buttons 1 and 2.
   *  If button 22 is on, push buttons 1, 2 and 3.
   *  If button 23 is on, push buttons 2 and 3.

   For example, if button 21 is on, push buttons 1 and 2.  If buttons 21 and 22
   are on, push buttons 1 and 2, and then push buttons 1, 2 and 3.
1. Repeat step 1.  The puzzle should now be solved!

## A few observations
* Pushing a button twice is equivalent to not pushing it at all. It follows
  that pushing a button an even number of times is equivalent to not pushing
  it at all, and pushing a button an odd number of times is equivalent to
  pushing it once.
* Pushing buttons is commutative. That is, it doesn't matter what order buttons
  are pushed in, the result is the same. This is fairly easy to see and also
  not hard to prove mathematically.
* If follows that any sequence of button pushes produces the same result as a
  sequence of button 1 presses followed by button 2, 3, ..., 25 presses. Combining
  this fact with the first observation, any sequence of button presses can be
  reduced to a simpler sequence of button presses in which each button is pushed
  exactly 0 or 1 times.

## Winning in the fewest possible moves

The winning strategy describe above will not generally solve a game
using the fewest possible button pushes.  Given any winning combination 
of button pushes, there are two stages to reducing it to a combination
that has the fewest possible number of button pushes.

### Stage 1:
Do not push any single button more than once. Any button that gets pushes an
even number of times shouldn't be pushed at all, and any button that gets
pushed an odd number of times should be pushed exactly once.

Here is an example to illustrate how to do this.  CConsider the following
starting position in which the 1's represent lights that are initally on, and
in which the 0's represent lights that are initally off.
```
1 1 1 1 0
1 0 0 0 1
0 0 0 0 1
0 0 1 0 0
0 1 1 1 0
```
Following the winning strategy produces the following sequence of button pushes:
* Step 1.  6 7 8 9 11 12 13 16 18 20 22 23 25
* Step 2.  1 2 3
* Step 3.  7 9 13 14 15 23 24 25
All together, the following 24 buttons get pushed.
* 1 2 3 6 7 7 8 9 9 11 12 13 13 14 15 16 18 20 22 23 23 24 25 25
However, the rules for dealing with buttons pushed more than once implies that
pushing the following sequence of only 14 buttons produces the same winning result.
* 1 2 3 6 8 11 12 14 15 16 18 20 22 24

### Stage 2:
Stage 1 produces a winning solution in which no button is pushed more than
once, but it is possible for there to be another solution requiring fewer
button pushes. It turns out that any better solution is easily obtained from
the solution obtained in Stage 1.  The Stage 1 solution is used to produce
three additional solutions, and the best of the resulting set of four solutions
is the best possible solution.

Any collection of button pushes in which no button is pushed more than once can
be represented by a "template".  For example, the following template
corresponds to pushing buttons 1, 8, 10 and 19.
```
P . . . .
. . P . P
. . . . .
. . . P .
. . . . .
```
Specifically, a 'P' indicates the button gets pushed, while a '.' indicates the
button does not get pushed.

#### Null templates:

The following three templates are special in that they are equivalent to not
pushing any buttons at all.  If you push all of the buttons corresponding to
any of these templates, then the exact same lights that were on when you
started will still be the only lights on when you finish.
```
Template 1        Template 2        Template 3
P . P . P         P P . P P         . P P P .
P . P . P         . . . . .         P . P . P
. . . . .         P P . P P         P P . P P
P . P . P         . . . . .         P . P . P
P . P . P         P P . P P         . P P P .
```

When a solution is obtained in Stage 1, it can be represented by a template.
For example, the template for the solution obtained in Stage 1 of this section,
"1 2 3 6 8 11 12 14 15 16 18 20 22 24", has the following template.
```
Solution Template
   P P P . .
   P . P . .
   P P . P P
   P . P . P
   . P . P .
(14 buttons pushed)
```

Combining any of the three null templates with a solution template produces
another solution template.  Each of these solutions can be reduced to a solution
with the fewest button presses, and the resulting solution with the fewest
button presses is the solution to the original game with the fewest moves.

This strategy is worked out for the State 1 solution..  First, calculate the
templates that result from combining the solution template with each of the
null templates.
```
  Original           Result 1           Result 2           Result 3
  P P P . .          . P . . P          . . P . .          P . . P .
  P . P . .          . . . . P          P . P . .          . . . . P
  P P . P P          P P . P P          . . . . .          . . . . .
  P . P . P          . . . . .          P . P . P          . . . . .
  . P . P .          P P P P P          P . . . P          . . P . .
 (14 pushes)        (12 pushes)        (8 pushes)         (4 pushes)
```
One can easily verify that Result 3 solves the Stage 1 game with only four
button pushes.
