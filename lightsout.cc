#include <iostream>
#include <cstdlib>
#include <cstring>
#include <unistd.h>

#include <X11/Xlib.h>
#include <X11/Xutil.h>
#include <X11/XKBlib.h>

using namespace std;

class game {
 public:
  int gs;
  unsigned char *sto;
  void init(int x) { gs = x; sto = (x == 0) ? 0 : new unsigned char[x * x]; }
  void freegrid() { gs = 0; delete [] sto; sto = 0; }
  int inrange(int x, int y) const {
    return (x >= 0 && y >= 0 && x < gs && y < gs && sto != 0); }
  game(int x) { init(x); }
  game(const game &m) : gs(0), sto(0) { *this = m; }
  ~game() { delete [] sto; }
  void operator=(const game& m);
  unsigned char& operator()(int x, int y) const { return sto[y * gs + x]; }
  unsigned char& operator[](int x) const { return sto[x]; }
  void set(int x, int y, unsigned char val) {
    if (inrange(x, y)) (*this)(x, y) = val; }
  unsigned char get(int x, int y) const {
    return (inrange(x, y) ? (*this)(x, y) : 0); }
  void init_game();
  void toggle_cross(int i, int j);
  void solve(game& solver);
  void clear() { memset(sto, 0, gs * gs); }
  int onpixels() {  
    int i, c = 0; for (i = 0; i < gs * gs; ++i) c += (sto[i] != 0); return c; }
};

class xobject {
 public:
  static Display *display;
  static int screen;
  static XSetWindowAttributes xswa;
  static Atom wmdw;
  static XWMHints xwmh;
  static XColor bg_color;
  static XColor border_color;
  static XColor off_color;
  static XColor on_color;
  static XColor highlight_color;
  xobject() { if (!initX()) { std::cerr << "Unable to init X\n"; exit(1); } } 
  ~xobject() { XCloseDisplay(display); } 
  static int initX();
};

class viewport : public xobject {
 public:
  Window window;
  GC gc;
  int width;
  int winmapped;
  game* gr;
  viewport(game& g) : width(0), winmapped(0), gr(&g) { }
  ~viewport() { if (winmapped) XDestroyWindow(display, window); }
  void init_gc();
  void proc_confignotify(XEvent&);
  void proc_ButtonPress(XEvent&);
  char proc_KeyPress(XEvent& event);
  void draw();
  void draw_square(int i, int j);
  void draw_highlight(int i, int j);
  void draw_outline(int i, int j);
  void draw_cross(int i, int j);
  void draw_solution();
  void refresh();
};

long seed = 0;
int pixsize = 0;
int gamesize = 5;
int showsolution = 0;

Display *xobject::display;
int xobject::screen;

XColor xobject::off_color;
XColor xobject::on_color;
XColor xobject::bg_color;
XColor xobject::border_color;
XColor xobject::highlight_color;

XSetWindowAttributes xobject::xswa;
Atom xobject::wmdw;
XWMHints xobject::xwmh;

enum { intvar, longvar };

struct typedesc { char *v; void *p; int t; };

typedesc varlist[] = { 
  { strdup("seed"), &seed, longvar },
  { strdup("pixsize"), &pixsize, intvar },
  { strdup("gamesize"), &gamesize, intvar },
  { strdup("showsolution"), &showsolution, intvar },
  { strdup(""), 0, 0 }
};

int main(int argc, char** argv) {
  extern void parse_argv(int argc, char **argv);
  parse_argv(argc, argv);
  if (seed == 0) seed = getpid();
  srand((time_t) seed);
  if (gamesize <= 0) { std::cerr << "Invalid game size\n"; exit(1); }
  if (pixsize == 0) pixsize = 500 / gamesize;
  game thegame(gamesize);
  thegame.init_game();
  viewport vp(thegame);
  vp.refresh();
}

void game::operator=(const game& m) {
  if (this != &m) {
    init(m.gs);
    if (gs > 0) memcpy(sto, m.sto, gs * gs * sizeof(unsigned char));
  }
}

void game::init_game() {
  clear();
  do {
    int num_clicks = rand() % (gs * gs) + gs;
    for (int i = 0; i < num_clicks; ++i) {
      int modamount = rand() % (gs * gs);
      toggle_cross(modamount / gs, modamount % gs);
    }
  } while (onpixels() == 0);
}

void game::toggle_cross(int i, int j) {
  if (i < 0 || j < 0 || i >= gs || j >= gs)
    return;
  set(i, j, 1 - get(i, j));
  set(i + 1, j, 1 - get(i + 1, j));
  set(i - 1, j, 1 - get(i - 1, j));
  set(i, j + 1, 1 - get(i, j + 1));
  set(i, j - 1, 1 - get(i, j - 1));
}

void game::solve(game& solver) {
  solver.clear();
  if (gs != 5) return;
  game work = *this;
  for (int i = 0; i < 4; ++i)
    for (int j = 0; j < 5; ++j)
      if (work(i, j) != 0) {
        work.toggle_cross(i + 1, j);
        solver(i + 1, j) = 1 - solver(i + 1, j);
      }
  if (work(4, 0) != 0) {
    work.toggle_cross(0, 0);
    work.toggle_cross(0, 1);
    solver(0, 0) = 1 - solver(0, 0);
    solver(0, 1) = 1 - solver(0, 1);
  }
  if (work(4, 1) != 0) {
    work.toggle_cross(0, 0);
    work.toggle_cross(0, 1);
    work.toggle_cross(0, 2);
    solver(0, 0) = 1 - solver(0, 0);
    solver(0, 1) = 1 - solver(0, 1);
    solver(0, 2) = 1 - solver(0, 2);
  }
  if (work(4, 2) != 0) {
    work.toggle_cross(0, 1);
    work.toggle_cross(0, 2);
    solver(0, 1) = 1 - solver(0, 1);
    solver(0, 2) = 1 - solver(0, 2);
  }
  for (int i = 0; i < 4; ++i)
    for (int j = 0; j < 5; ++j)
      if (work(i, j) != 0) {
        work.toggle_cross(i + 1, j);
        solver(i + 1, j) = 1 - solver(i + 1, j);
      }
  if (work.onpixels() != 0) {
    solver.clear();
    return;
  }
  int t1[] = {0, 2, 4, 5,  7,  9, 15, 17, 19, 20, 22, 24};
  int t2[] = {0, 1, 3, 4, 10, 11, 13, 14, 20, 21, 23, 24};
  int t3[] = {1, 2, 3, 5,  7,  9, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23};
  game bestsolver = solver;
  game newsolver = solver;
  for (int i = 0; i < 12; ++i)
    newsolver[t1[i]] = 1 - newsolver[t1[i]];
  if (newsolver.onpixels() < bestsolver.onpixels())
    bestsolver = newsolver;
  newsolver = solver;
  for (int i = 0; i < 12; ++i)
    newsolver[t2[i]] = 1 - newsolver[t2[i]];
  if (newsolver.onpixels() < bestsolver.onpixels())
    bestsolver = newsolver;
  newsolver = solver;
  for (int i = 0; i < 16; ++i)
    newsolver[t3[i]] = 1 - newsolver[t3[i]];
  if (newsolver.onpixels() < bestsolver.onpixels())
    bestsolver = newsolver;
  solver = bestsolver;
}

void parse_argv(int argc, char** argv) {
  extern int set_global(char* var, char* val);
  extern void parse_equation(char* eqn, char*& var, char*& val);
  int count = 1;
  while (count < argc) {
    char *var = 0, *val;
    parse_equation(argv[count++], var, val);
    if (var != 0 && !set_global(var, val))
      std::cerr << "Invalid variable [" << var << "] on command line." << endl;
  }
}

void parse_equation(char* eqn, char*& var, char*& val) {
  if ((val = strchr(eqn, (int) '\n')) != 0)
    *val-- = '\0';
  else
    val = strchr(eqn, (int) '\0') - 1;
  if ((val = strchr(eqn, (int) '=')) == 0)
    return;
  *val++ = '\0';
  char *nexttok;
  if ((var = strtok(eqn, " \t")) == 0)
    return;
  else
    while ((nexttok = strtok(0, " \t")) != 0)
      var = nexttok;
}

int set_global(char* var, char* val) {
  int ind = 0;
  int done = 0;
  while (!done) {
    if (!strcmp(var, varlist[ind].v)) {
      if (varlist[ind].t == intvar)
        *((int *)varlist[ind].p) = atoi(val);
      else if (varlist[ind].t == longvar)
	*((long *)varlist[ind].p) = atol(val);
      return 1;
    }
    done = (varlist[++ind].p == 0);
  }
  return 0;
}

int xobject::initX() {
  if ((display = XOpenDisplay(0)) == 0) return 0;
  screen = DefaultScreen(display);
  Colormap cmap = DefaultColormap(display, screen);
  bg_color.red = 45000; bg_color.green = 45000; bg_color.blue = 45000;
  if (XAllocColor(display, cmap, &bg_color) == 0) return 0;
  border_color.red = 60000; border_color.green = 0; border_color.blue = 60000;
  if (XAllocColor(display, cmap, &border_color) == 0) return 0;
  on_color.red = 0; on_color.green = 60000; on_color.blue = 60000;
  if (XAllocColor(display, cmap, &on_color) == 0) return 0;
  off_color.red = 30000; off_color.green = 30000; off_color.blue = 30000;
  if (XAllocColor(display, cmap, &off_color) == 0) return 0;
  highlight_color.red = 0; highlight_color.green = 50000; 
  highlight_color.blue = 50000;
  if (XAllocColor(display, cmap, &highlight_color) == 0) return 0;
  xswa.event_mask = ExposureMask | StructureNotifyMask |
    ButtonPressMask | KeyPressMask;
  xswa.border_pixel = BlackPixel(display, screen);
  xswa.background_pixel = bg_color.pixel;
  xswa.colormap = DefaultColormap(display, screen);
  wmdw = XInternAtom(display, "WM_DELETE_WINDOW", False);
  return 1;
}

void viewport::refresh() {
  winmapped = 1;
  width = gr->gs * pixsize + 2 * 20;
  window = XCreateWindow(display, RootWindow(display, screen), 0, 0,
    width, width, 4,  DefaultDepth(display, screen), InputOutput, 
    DefaultVisual(display, screen), CWBackPixel | CWBorderPixel | 
    CWColormap | CWEventMask, &xswa);
  init_gc();
  XSetWMProtocols(display, window, &wmdw, 1);
  XSizeHints xsh;
  XClassHint xch;
  char *name = strdup("Lights Out!");
  XTextProperty window_name;
  XStringListToTextProperty(&name, 1, &window_name);
  xch.res_class = strdup("Lightsout");
  xch.res_name = strdup("lightsout");
  xsh.flags = PPosition | PSize;
  xwmh.flags = InputHint | StateHint;
  xwmh.input = True;
  xwmh.initial_state = NormalState;
  XSetWMProperties(display, window, &window_name, 0, 0, 0, &xsh, &xwmh, &xch);
  XFree(window_name.value);
  XMapRaised(display, window);
  XEvent event;
  int gotevent;
  while (1) {
    gotevent = XCheckWindowEvent(display, window, ~0, &event);
    if (!gotevent) XWindowEvent(display, window, ~0, &event);
    switch (event.type)
    {
     case ClientMessage :
       if (event.xclient.data.l[0] == int(wmdw)) {
	 XDestroyWindow(display, window);
         winmapped = 0;
	 XFlush(display);
         exit(1);
       }
       break;
     case Expose:
       if (event.xexpose.count == 0) draw();
       break;
     case ConfigureNotify:
       proc_confignotify(event);
       break;
     case ButtonPress:
       proc_ButtonPress(event);
       break;
     case KeyPress: {
         char thechar = proc_KeyPress(event);
         if (thechar == 'q') {
           XDestroyWindow(display, window);
           winmapped = 0;
           XFlush(display);
           exit(1);
         }
       }
       break;
    }
  }
}

void viewport::draw() {
  int i;
  for (i = 0; i < gr->gs; ++i)
    for (int j = 0; j < gr->gs; ++j)
      draw_square(i, j);
  for (i = 0; i < gr->gs; ++i)
    for (int j = 0; j < gr->gs; ++j)
      draw_outline(i, j);
  if (showsolution) draw_solution();
}

void viewport::draw_cross(int i, int j) {
  if (i > 0) {
    draw_square(i - 1, j);
    draw_outline(i - 1, j);
  }
  if (j > 0) {
    draw_square(i, j - 1);
    draw_outline(i, j - 1);
  }
  if (i < gr->gs - 1) {
    draw_square(i + 1, j);
    draw_outline(i + 1, j);
  }
  if (j < gr->gs - 1) {
    draw_square(i, j + 1);
    draw_outline(i, j + 1);
  }
  draw_square(i, j);
  draw_outline(i, j);
  if (showsolution) draw_solution();
}

void viewport::draw_square(int i, int j) {
  if (i < 0 || j < 0 || i >= gr->gs || j >= gr->gs) return;
  if ((*gr)(i, j) == 0)
    XSetForeground(display, gc, off_color.pixel);
  else
    XSetForeground(display, gc, on_color.pixel);
  XFillRectangle(display, window, gc, i * pixsize + 20, 
		 j * pixsize + 20, pixsize, pixsize);
  if (showsolution) draw_solution();
}

void viewport::draw_highlight(int i, int j) {
  if (i < 0 || j < 0 || i >= gr->gs || j >= gr->gs) return;
  XSetForeground(display, gc, highlight_color.pixel);
  XFillRectangle(display, window, gc, i * pixsize + pixsize / 4 + 20, 
		 j * pixsize + pixsize / 4 + 20, pixsize / 2, pixsize / 2);
}

void viewport::draw_outline(int i, int j) {
  if (i < 0 || j < 0 || i >= gr->gs || j >= gr->gs || pixsize < 2) return;
  XSetForeground(display, gc, border_color.pixel);
  XDrawRectangle(display, window, gc, i * pixsize + 20,
		 j * pixsize + 20, pixsize, pixsize);
}

void viewport::draw_solution() {
  game solver(5);
  gr->solve(solver);
  for (int i = 0; i < 5; ++i)
    for (int j = 0; j < 5; ++j)
      if (solver(i, j)) draw_highlight(i, j);
}

void viewport::proc_confignotify(XEvent&) {
  XWindowAttributes xwa;
  if (XGetWindowAttributes(display, window, &xwa) != 0) {
    pixsize = (xwa.width - 2 * 20) / gr->gs;
    if (pixsize < 1) pixsize = 1;
    width = gr->gs * pixsize + 2 * 20;
    XResizeWindow(display, window, width, width);
  }
}

void viewport::proc_ButtonPress(XEvent &event) {
  int bx = (event.xbutton.x - 20) / pixsize;
  int by = (event.xbutton.y - 20) / pixsize;
  switch (event.xbutton.button)
  {
    case Button1 :
      if (event.xbutton.x >= 20 && event.xbutton.y >= 20 &&
          bx < gr->gs && by < gr->gs) {
        gr->toggle_cross(bx, by);
        if (showsolution)
          draw();
        else
          draw_cross(bx, by);
        if (gr->onpixels() == 0) {
          showsolution = 0;
          int oldi = 0, oldj = 0;
          for (int i = 0; i < gr->gs; ++i) {
            for (int j = 0; j < gr->gs; ++j) {
              (*gr)(oldj, oldi) = 0;
              (*gr)(j, i) = 1;
              draw_square(oldj, oldi);
              draw_square(j, i);
              draw_outline(oldj, oldi);
 	      draw_outline(j, i);
              oldi = i; oldj = j;
              XSync(display, 0);
              usleep(1000000 / (gr->gs * gr->gs));
            }
          }
          (*gr)(oldj, oldi) = 0;
          gr->init_game();
          draw();
        }
      }
      break;
    case Button2 :
      gr->set(bx, by, 1 - gr->get(bx, by));
      if (showsolution)
        draw();
      else {
        draw_square(bx, by);
        draw_outline(bx, by);
      }
      break;
    case Button3 :
      showsolution = 1 - showsolution;
      draw();
      break;
  }
}

char viewport::proc_KeyPress(XEvent &event) {
  char thechar = XkbKeycodeToKeysym(display, event.xkey.keycode, 0, 0);
  if (thechar == 'r')
    draw();
  else if (thechar == 'n') {
    gr->init_game(); draw();
  }
  else if (thechar == 'c') {
    gr->clear(); draw();
  }
  return thechar;
} 

void viewport::init_gc() {
  gc = XCreateGC(display, window, 0, 0);
  XSetLineAttributes(display, gc, 2, LineSolid, CapProjecting, JoinMiter);
}

