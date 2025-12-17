# Lights Out Strategy (5x5 Game)

This guide describes:
1. Notation
2. A three-step winning strategy.
3. Reasoning, along with examples, of why the strategy works.
4. Minimal winning strategies.

---

## Board Notation
The 25 squares are numbered as follows:
```
 1  2  3  4  5
 6  7  8  9 10
11 12 13 14 15
16 17 18 19 20
21 22 23 24 25
```

*A note on “toggling”*: touching any square flips it—on to off or off to on—and also flips
the squares directly above, below, and to either side. The goal is to turn off every light.

Examples of a single touch:
- Touching square **5** toggles squares **4**, **5**, and **10**.
- Touching square **19** toggles squares **14**, **18**, **19**, **20**, and **24**.

## A Three-Step Winning Strategy
1. **Sweep from the top.**
   - If square **1** is on, turn it off by touching square **6** (the square directly below).
   - Continue down the grid: for squares **2** through **20**, turn off any light in a row by touching the square directly beneath it.
2. **Handle the bottom row.** If any lights remain on in the bottom row after step 1, touch squares in the top row using these rules:
   - If square **21** is on, touch squares **1** and **2**.
   - If square **22** is on, touch squares **1**, **2**, and **3**.
   - If square **23** is on, touch squares **2** and **3**.
   - Ignore squares **24** and **25**—they are already controlled by earlier touches.

   *Examples*
   - Only square **21** on ➜ touch **1** and **2**.
   - Squares **21** and **22** on ➜ touch **1** and **2**, then touch **1**, **2**, and **3**.
3. **Sweep again.** Repeat step 1. This final pass will clear every remaining light.

---

## Worked Example
Starting grid (1 = light on, 0 = light off):
```
1 1 1 1 0
1 0 0 0 1
0 0 0 0 1
0 0 1 0 0
0 1 1 1 0
```

Touches produced by the strategy:
- **Step 1:** 6, 7, 8, 9, 11, 12, 13, 16, 18, 20, 22, 23, 25
- **Step 2:** 1, 2, 3 (because 22 is on while 21 and 23 are off)
- **Step 3:** 7, 9, 13, 14, 15, 23, 24, 25

Combined sequence: **6 7 8 9 11 12 13 16 18 20 22 23 25 1 2 3 7 9 13 14 15 23 24 25**

---

## Key Concepts
- **Equivalent** — Two sequences of touches are equivalent if they produce the same board.
- **Parity** — Touching a square twice in a row is the same as not touching it. Even counts cancel while odd counts act like a single touch.
- **Commutativity** — The order of touches does not matter. Any reordering of the same touches is equivalent.
- **Simple sequence** — A sequence where each square is touched at most once.

### Simplifying a Sequence
Using the combined sequence above:
1. **Reorder** (commutativity): 1 2 3 6 7 7 8 9 9 11 12 13 13 14 15 16 18 20 22 23 23 24 25 25
2. **Reduce duplicates** (parity): 1 2 3 6 8 11 12 14 15 16 18 20 22 24

Any sequence can be simplified this way. A simple sequence can be shown as a template:
```
P P P . .
P . P . .
P P . P P
P . P . P
. P . P .
```
Here **P** marks a touch and **.** marks no touch. This template is the solution template for the example above.

---

## Minimal Solutions
A **minimal solution** is a winning solution with the fewest touches. The simplified strategy above is usually not minimal, but any simple winning solution can be combined with special templates to find one that is.

### Finding Additional Simple Winning Strategies
The four **null templates** below have no net effect when applied—they toggle lights back to their starting state. These are the only four null templates.
```
Template 1        Template 2        Template 3        Template 4
. . . . .         P . P . P         P P . P P         . P P P .
. . . . .         P . P . P         . . . . .         P . P . P
. . . . .         . . . . .         P P . P P         P P . P P
. . . . .         P . P . P         . . . . .         P . P . P
. . . . .         P . P . P         P P . P P         . P P P .
```

Templates can be **combined**:
- Matching symbols (both **P** or both **.**) cancel to **.** because the square is touched either zero or two times.
- Different symbols become **P** because the square is touched exactly once.

Combine any null template with a solution template to get another solution template. The version with the fewest **P** entries is a minimal solution.

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

---

## Why There Are Only Four Null Templates

Consider the possible top rows of a null template. With five squares, there are
2^5 = 32 options. Let us explore a potential null template **N** whose top row is:
```
P P P . P
```

Starting from all lights off and touching those squares would make the top row:
```
0 1 0 0 1
```

Because **N** must return the board to all off, the second row is forced as only
a square directly below can toggle a top-row light. If a light stays off in the
top row, the square below must be off; if a light turns on, the square below
must be on to turn it back off.

Thus the top two rows of **N** are:
```
P P P . P
. P . . P
```

Applying these rows to an empty board produces the following top two rows:
```
0 0 0 0 0
0 0 0 1 0
```

Using the same logic, the third row must be `. . . P .`, so the top three rows are:
```
P P P . P
. P . . P
. . . P .
```

Applying these rows to an empty board produces the following top three rows:
```
0 0 0 0 0
0 0 0 0 0
0 1 1 1 0
```

The top four rows therefore become:
```
P P P . P
. P . . P
. . . P .
. P P P .
```

Applying these rows to an empty board produces the following top four rows:
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
Repeating this reasoning across all 32 starting rows leaves only the four null
templates listed above.
