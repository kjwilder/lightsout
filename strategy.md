# Lights Out Strategy (5x5 Game)

## Notation
The 25 squares are referred to according to the following numbering:
```
 1  2  3  4  5
 6  7  8  9 10
11 12 13 14 15
16 17 18 19 20
21 22 23 24 25
```

## Playing Lights Out
The game starts with some squares on (lighted). Touching any square `toggles` it - turns
it off if it is on and turns it on if it is off. Any squares directly above, below or to
either side of a touched square are also toggled. The game is won when all of
the squares are turned off.

Examples of toggling:
* Touching square 5 will toggle squares 4, 5 and 10.
* Touching square 19 will toggle squares 14, 18, 19, 20 and 24.

## A Winning Strategy
1. If square 1 is on, turn it off by touching square 6, the square directly
   below square 1.  Next, in order, turn off squares 2 through 20 by touching the
   squares directly below any of those that are on.
1. After step 1, the puzzle has either been solved, or there are some squares in the
   bottom row that still are on.  If the puzzle is unsolved, touch squares in the top row
   according to the following rules:
   *  If square 21 is on, touch squares 1 and 2.
   *  If square 22 is on, touch squares 1, 2 and 3.
   *  If square 23 is on, touch squares 2 and 3.
   *  Ignore squares 24 and 25.

   For example:
   *  If only square 21 is on, touch squares 1 and 2.
   *  If squares 21 and 22 are both on, touch squares 1 and 2,
      and then touch squares 1, 2 and 3.
1. Repeat step 1 as that now will turn off all the lights.

## An Example
Consider the following starting position in which the 1's represent squares that
are initally on, and the 0's represent squares that are initally off.
```
1 1 1 1 0
1 0 0 0 1
0 0 0 0 1
0 0 1 0 0
0 1 1 1 0
```

The winning strategy described above produces the following sequence of square touches:
* Step 1:  6 7 8 9 11 12 13 16 18 20 22 23 25
* Step 2:  1 2 3 (since square 22 is on while squares 21 and 23 are off)
* Step 3:  7 9 13 14 15 23 24 25

Combining the three steps, the following 24 squares are touched:
* 6 7 8 9 11 12 13 16 18 20 22 23 25 1 2 3 7 9 13 14 15 23 24 25
   
## Properties and Definitions
* **Equivalent** - Two sequences of square touches are called equivalent if they produce
  the same result.
* **Parity** - Touching a square twice in a row has the same effect as not touching
  it at all. It follows that repeatedly touching a square an even number of times
  is equivalent to not touching it at all, and touching a square an odd number of
  times is equivalent to touching it once.
* **Commutativity** - Changing the order that squares are touched does not change the
  result - so two sequences that have the same touches in different orders are equivalent.
  It is fairly intuitive that this is true, and it is easy to prove mathematically.
* **Simple** - Any sequence of square touches in which each square is touched at most once
  is called a simple sequence.
  
## Applying Parity and Commutativity
In the earlier example, the winning strategy produced the following sequence
of square touches:
* 6 7 8 9 11 12 13 16 18 20 22 23 25 1 2 3 7 9 13 14 15 23 24 25

Using commutativity, the above sequence can be reordered and produce an equivalent
sequence. Below is the same sequence ordered from lowest to highest, with some squares
touched multiple times:
* 1 2 3 6 7 7 8 9 9 11 12 13 13 14 15 16 18 20 22 23 23 24 25 25

Using the parity property, multiple touches can be reduced to at most one touch and
produce an equivalent sequence:
* 1 2 3 6 8 11 12 14 15 16 18 20 22 24

Using the above process, any sequence of square toucbes can be converted to an equivalent
simple sequence. Any simple sequence like the above can be represented by a template:
```
P P P . .
P . P . .
P P . P P
P . P . P
. P . P .
```
The P's indicate a square that is touched, and the periods indicate
squares that are not touched. This template is a **solution template** for the
example above.

## Minimal Solutions
A solution that requires the fewest possible number of square touches is called a
**minimal solution**. The simplified version of the winning strategy described above
usually is NOT a minimal solution. However, any simple winning solution can be
mapped to a set of four simple winning solution in which at least one is sure
to be a minimal solution.

### Finding Additional Simple Winning Strategies.
The following four templates are special in that touching all of the squares has
the same effect as not touching any squares at all. I call these **null
templates** and prove below that they are the only null templates.
```
Template 1        Template 2        Template 3        Template 4
. . . . .         P . P . P         P P . P P         . P P P .
. . . . .         P . P . P         . . . . .         P . P . P
. . . . .         . . . . .         P P . P P         P P . P P
. . . . .         P . P . P         . . . . .         P . P . P
. . . . .         P . P . P         P P . P P         . P P P .
```

Templates can be combined. Where two templates have the same value for a square,
the square is touched 0 or 2 times, which is equivalent to 0 times (a '.'). If
they have different values, exactly one of those is a touch, and the result is
also a touch (a 'P').

Combining any of the null templates with a solution template produces another
solution template. The solution template with the fewest number of 'P's
is a minimal solution.

This process is worked out for our example. Below is the result of combining
the initial solution template with each of the four null templates:
```
  + Template 0       + Template 2       + Template 3       + Template 4
  P P P . .          . P . . P          . . P . .          P . . P .
  P . P . .          . . . . P          P . P . .          . . . . P
  P P . P P          P P . P P          . . . . .          . . . . .
  P . P . P          . . . . .          P . P . P          . . . . .
  . P . P .          P P P P P          P . . . P          . . P . .
```
The solution obtained by combining the original solution with Template 4 has
only four square touches and therefore is the minimal solution.

## A proof that there are only four null templates.
Consider the possibilities for the top row of a null template.
There are five squares, each of which can be touched or not, so there are
2^5=32 different possible top rows.

Let us assume, for example, that there is a null template **N** whose top row is:
```
P P P . P
```

If one started with a game in which all of the lights were off and then
touched only those squares, the top row would become:
```
0 1 0 0 1
```

Since **N** is a null template, applying all of **N** must leave off the three
lights that remained off and turn off the two lights that were turned on.  The
second row of **N** is the only row besides the top row that can change the top
row lights, and the only top-row square a square in the second row can change
is the square directly above it. These two facts completely determine what the
second row must be.  If the top row of a null template leaves a light off, the
square below that light must be off in the template in order not to turn the
light above it on. Similarly, if the top row of a null template turns a light
on, the square below it must be on in the template in order to turn the light
above it off.

It follows that the top two rows of **N** must be:
```
P P P . P
. P . . P
```

Applying these two rows to an empty game produces the following top two rows:
```
0 0 0 0 0
0 0 0 1 0
```

Using the same argument that determined the second row of **N**, the third row
must be `. . . P .`, so the top three rows of **N** are:
```
P P P . P
. P . . P
. . . P .

```

Applying them to an empty game produces the following top three rows:
```
0 0 0 0 0
0 0 0 0 0
0 1 1 1 0
```

The top four rows of **N** are therefore:
```
P P P . P
. P . . P
. . . P .
. P P P .
```

Applying them to an empty game produces the following top four rows:
```
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
1 0 1 1 1
```

The entire template **N** must then be:
```
P P P . P
. P . . P
. . . P .
. P P P .
P . P P P
```

However, this is not a null template. If applied to an empty game, the top
four rows will continue to have their lights off, but the bottom row will be:
```
1 1 1 0 0
```

It follows that the earlier assumption that there is a null
template whose first row is `P P P . P` is incorrect. The same logic, when applied
to all 32 possible top rows, will produce four null templates and disqualify the
other 28.
