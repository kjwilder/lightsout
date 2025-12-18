# Lights Out Strategy (5x5 Game)

This guide contains:
1. Board Notation and Rules
2. A three-step winning strategy.
3. A complete example.
4. Minimal solutions.

## Board Notation and Rules
The 25 squares are numbered as follows:
```
 1  2  3  4  5
 6  7  8  9 10
11 12 13 14 15
16 17 18 19 20
21 22 23 24 25
```

Touching a square *toggles* it by changing it from on to off or off to on.
Touching a square also toggles the squares directly above, below, and to either
side of the square. The goal is to turn off every light.

Examples of a single touch:
- Touching square **5** toggles squares **4**, **5**, and **10**.
- Touching square **19** toggles squares **14**, **18**, **19**, **20**, and **24**.

## A Three-Step Winning Strategy
1. **Sweep from the top.**
   - If square **1** is on, turn it off by touching square **6**, the square
     directly below square **1**.
   - For squares **2** through **20**, in order, if the square is on, turn it
     off by touching the square directly beneath it.
   - After the above step, if the game was not won, the only lights that will
     be on will be in the bottom row.

2. **Address the bottom row.** If any lights remain on in the bottom row after
   step 1, touch squares in the top row using these three rules:
   - If square **21** is on, touch squares **1** and **2**.
   - If square **22** is on, touch squares **1**, **2**, and **3**.
   - If square **23** is on, touch squares **2** and **3**.

   *Examples*
   - If square **21** is on, touch **1** and **2**.
   - If squares **21** and **22** are on, touch **1** and **2** and then **1**, **2**, and **3**.
3. **Sweep from the top again.** Repeat step 1 to turn off every light.

## Worked Example
Starting grid (1 = light on, 0 = light off):
```
1 1 1 1 0
1 0 0 0 1
0 0 0 0 1
0 0 1 0 0
0 1 1 1 0
```

Touches produced by the winning strategy:
- **Step 1:** 6, 7, 8, 9, 11, 12, 13, 16, 18, 20, 22, 23, 25
- **Step 2:** 1, 2, 3 (because 22 is on while 21 and 23 are off)
- **Step 3:** 7, 9, 13, 14, 15, 23, 24, 25

Full sequence: **6 7 8 9 11 12 13 16 18 20 22 23 25 1 2 3 7 9 13 14 15 23 24 25**

## Key Concepts
- **Equivalence** — Two sequences of touches are equivalent if they produce the
  same board.
- **Parity** — Touching a square twice in a row is the same as not touching it.
  Even counts cancel while odd counts act like a single touch.
- **Commutativity** — The order of touches does not matter. Any reordering of
  the same touches is equivalent.
- **Simple sequence** — A sequence where each square is touched at most once.

## Simple Solutions

We can use commutativity to **reorder** any sequence of button presses to be
ordered, and then we can use parity to **remove** all even runs of the same
number.  This process results in a **simple sequence** in which every button is
pressed at most once, and the presses are in order. A simple sequence that also
is a solution is called a **simple solution**.

For the worked example, we produce a simple solution as follows:
1. **Original winning sequence**: **6 7 8 9 11 12 13 16 18 20 22 23 25 1 2 3 7
   9 13 14 15 23 24 25**
2. **Reordered winning sequence** : **1 2 3 6 7 7 8 9 9 11 12 13 13 14 15 16
   18 20 22 23 23 24 25 25**
3. **Final simple solution after removing even runs** (parity): **1 2 3 6 8 11
   12 14 15 16 18 20 22 24**

Any simple sequence can be represented by a template such as the one below for
the above simple solution.
```
P P P . .
P . P . .
P P . P P
P . P . P
. P . P .
```

**P** marks a touch and **.** marks no touch.

*A clarification:* Templates with **0** and **1** are used to indicate lights
that are off and on while templates with **P** and **.** are used to indicate
button presses.

## Minimal Solutions

A **minimal solution** is a winning solution with the fewest possible touches.
The strategies described to find a winning solution and then turn it into a
simple solution generally will NOT produce a minimal solution, but any simple
winning solution can be combined with three special templates to find a minimal
solution.

### Winning Strategies

The four templates below are **null templates**. As will be discussed, they are
the only 5x5 null templates. They are called null templates because they have
no effect when applied: The same lights will be on and off before and after a
null template is applied.

```
Template 1        Template 2        Template 3        Template 4
. . . . .         P . P . P         P P . P P         . P P P .
. . . . .         P . P . P         . . . . .         P . P . P
. . . . .         . . . . .         P P . P P         P P . P P
. . . . .         P . P . P         . . . . .         P . P . P
. . . . .         P . P . P         P P . P P         . P P P .
```

Templates can be **combined**:
- Matching symbols (both **P** or both **.**) cancel to **.** because the
  square is touched either zero or two times.
- Different symbols become **P** because the square is touched exactly once.

Combining a null template with a solution template produces another solution
template. The version with the fewest **P** entries is a minimal solution.

For the earlier example, combining the original solution with each null template yields:
```
  + Template 1       + Template 2       + Template 3       + Template 4
  P P P . .          . P . . P          . . P . .          P . . P .
  P . P . .          . . . . P          P . P . .          . . . . P
  P P . P P          P P . P P          . . . . .          . . . . .
  P . P . P          . . . . .          P . P . P          . . . . .
  . P . P .          P P P P P          P . . . P          . . P . .
```

The combination with **Template 4** has only four touches, making it the minimal solution.

To summarize, the original game:
```
1 1 1 1 0
1 0 0 0 1
0 0 0 0 1
0 0 1 0 0
0 1 1 1 0
```
has a single minimal solution with four button presses: *1*, *4*, *10* and *23*.


## Why There Are Only Four Null Templates

Consider the possible top rows of a null template. Each row has five squares,
so there are 2^5 = 32 possibilities. Let us explore a potential null template
**N** whose top row is:
```
P P P . P
```

If we start with a solved game in which all lights are off and touch those
squares, to top row will become:
```
0 1 0 0 1
```

Since **N** is a null template, those squares must all be turned off. Since the top
row has already been determined, the only way to turn off the lights that are
on in the top row is by pressing the buttons in the second rows directly below
them. Similarly, if a light is off in the top row, the button below it cannot
be pressed as that would turn on a light in the top row. The conclusion is that
squares **7** and **10** must be pressed, and squares **6**, **8** and **9**
must not be pressed. The top row of the template therefore completely dictates
what the second row must be, so the first two rows of **N** are:
```
P P P . P
. P . . P
```

Applying the above two rows to an empty board produces the following top two rows:
```
0 0 0 0 0
0 0 0 1 0
```

Applying the same logic used to determine the second row, the only button to
press in the third row of **N** is the button below the **1** in square **9**.
The top three rows are:
```
P P P . P
. P . . P
. . . P .
```

Applying the above to an empty board produces the following top three rows:
```
0 0 0 0 0
0 0 0 0 0
0 1 1 1 0
```

The top four rows therefore must be:
```
P P P . P
. P . . P
. . . P .
. P P P .
```

Applying the above to an empty board produces the following top four rows:
```
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
1 0 1 1 1
```

The full template **N** must then be:
```
P P P . P
. P . . P
. . . P .
. P P P .
P . P P P
```

However, this is not a null template: Applying it to an empty board produces
the following bottom row:
```
1 1 1 0 0
```

Therefore, a null template whose top row is `P P P . P` is impossible.
Repeating this reasoning to all 32 possible starting rows produces only the
four null templates listed above.

Lights Out can be played with board sizes other than 5x5. In some dimensions,
there are no null solutions, while other dimensions **n** can have 2^n
solutions, one for every possible top row.
