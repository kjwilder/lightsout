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

   For example, if only button 21 is on, push buttons 1 and 2.  If buttons 21 and
   22 are on, push buttons 1 and 2, and then push buttons 1, 2 and 3.
1. Repeat the first step.  The puzzle will be solved.

## A few observations
* Parity - Pushing a button twice has the same effect as not pushing it at all.
  It follows that repeatedly pushing a button an even number of times is
  equivalent to not pushing it at all, and pushing a button an odd number of
  times is equivalent to pushing it once.
* Commutativity - Changing the order that buttons are pushed does not change the
  result.  This is fairly easy to see and also not hard to prove mathematically.
* From the commutativity property, it follows that any sequence of button pushes
  produces the same result as a reordered sequence in which button 1 is pushed 0
  or more times followed by button 2 being pushed 0 or more times and so on until
  button 25 is pushed 0 or more times.  Combining this fact with the parity
  observation, the result of any sequence of button pushes can be obtained by a
  simpler sequence in which each button is pushed exactly 0 or 1 times.

## Minimal solutions.

A solution that requires the fewest possible number of button pushes will be
called a **minimal solution**. The winning strategy described above will not
generally produce a minimal solution. However, any winning strategy can be
mapped to a set of four winning strategies with at least one of them guaranteed
to be a minimal solution.

### Find a winning strategy in which no button is pushed more than once.
This process is described above.  A detailed example is presented as it will be
used to illustrate how to find a minimal solution.

Consider the following starting position in which the 1's represent lights that
are initally on, and the 0's represent lights that are initally off.
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
* 6 7 8 9 11 12 13 16 18 20 22 23 25 1 2 3 7 9 13 14 15 23 24 25

Using commutativity, the sequence can be reordered, so the following sequence
produces the same result.
* 1 2 3 6 7 7 8 9 9 11 12 13 13 14 15 16 18 20 22 23 23 24 25 25

Using parity, the following sequence also produces the same result.
* 1 2 3 6 8 11 12 14 15 16 18 20 22 24

### Find three additional winning strategies.
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

The following four templates are special in that pushing all of the buttons has
the same effect as not pushing any buttons at all. These will be called **null
templates** and are the only null templates as is argued below.
```
Template 1        Template 2        Template 3        Template 4
. . . . .         P . P . P         P P . P P         . P P P .
. . . . .         P . P . P         . . . . .         P . P . P
. . . . .         . . . . .         P P . P P         P P . P P
. . . . .         P . P . P         . . . . .         P . P . P
. . . . .         P . P . P         P P . P P         . P P P .
```

The solution for our example, "1 2 3 6 8 11 12 14 15 16 18 20 22 24", also has
the property that no button is pushed more than once and can be expressed by a
template.
```
   P P P . .
   P . P . .
   P P . P P
   P . P . P
   . P . P .
```

Templates can be combined. Where two templates have the same value for a button,
the button is pushed 0 or 2 times, which is equivalent to 0 times (a '.'). If
they have different values, exactly one of those is a push, and the result is
also a push (a 'P').

Combining any of the null templates with a solution template produces another
solution template. A resulting solution template with the fewest number of 'P's
is a minimal solution.

This process is worked out for the above example. Below is the original
solution template and the three additional solution templates obtained by
combining the original solution template with the three null templates.
```
  + Template 0       + Template 2       + Template 3       + Template 4
  P P P . .          . P . . P          . . P . .          P . . P .
  P . P . .          . . . . P          P . P . .          . . . . P
  P P . P P          P P . P P          . . . . .          . . . . .
  P . P . P          . . . . .          P . P . P          . . . . .
  . P . P .          P P P P P          P . . . P          . . P . .
```
The solution obtained by combining the original solution with Template 3 has
only four button pushes and is the minimal solution.

## A proof that there are only three null templates.
Start by considering the possibilities for the top row of a template.
There are five buttons, each of which can be pushed or not, so there are 32
different posible top rows.

Next, suppose there is a null template **N** whose top row is:
```
P P P . P
```

If one started with a game in which all of the lights were off and then
pushed only those buttons, the top row would become:
```
0 1 0 0 1
```

Since **N** is a null template, applying all of **N** must leave off the three
lights that remained off and turn off the two lights that were turned on.  The
second row of **N** is the only row besides the top row that can change the top
row lights, and the only top-row button a button in the second row can change
is the button directly above it. These two facts completely determine the
second row: If the top row of a null template leaves a light off, the button
below it must be off in the template in order not to turn the light above it
on. Similarly, if the top row of a null template turns a light on, the button
below it must by on in the template in order to turn the light above it off.

It follows that the top two rows of **N** must be:
```
P P P . P
. P . . P

Applying these two rows to an empty game produces the following top two rows:
```
0 0 0 0 0
0 0 0 1 0
```

Using the same argument that determined the second row of **N**, the third row
must be `. . . P .` and the top three rows are:
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

**N** must not be a null template, so the initial assumption that there is a null
template whose first row is `P P P . P` is wrong. The same argument can be used
to elimate 28 top rows and construct null templates for the remaining four.



