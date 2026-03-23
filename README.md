# ASCII Face 3D - Making Faces Outta Text Characters

So yeah, this is a thing I made. Basically I wanted to see if you could take a boring old 2D face made of ASCII characters and somehow make it pop out into 3D space. Spoiler: you totally can, and it's kinda satisfying.

## The Basic Idea

You know how in old-school terminal graphics everything was just characters? I thought, what if we could give those characters some depth? Like, what if `:-)` wasn't just sitting flat on the screen, but actually had some z-coordinate going on?

The answer is: you get this weird, slightly creepy 3D face thing that rotates and does the funky chicken.

## The Math (Fair Warning: It's Not As Scary As It Looks)

### Perspective Projection

Alright so here's the deal. You've got a 3D point in space, right? It's sitting at some (x, y, z) coordinate. But your screen is only 2D, so you gotta squish that third dimension down somehow.

The magic formula is basically:

```
screenX = (x * focalLength) / z + screenCenterX
screenY = (y * focalLength) / z + screenCenterY
```

That `focalLength` thing? It's basically how "zoom-y" your camera is. Higher number = things look more parallel. Lower number = stuff gets way more dramatic perspective-y. I ended up playing around with this for way too long before landing on something that looked okay.

### Z-Sorting (The Part Nobody Talks About)

So here's something they don't tell you in graphics class: when you're doing 3D, you gotta figure out which things are in front of which other things. Otherwise you get this horrible mess where a nose is somehow behind the forehead.

The way I did it is pretty dumb-simple:
1. Calculate how far away each polygon is from the camera
2. Sort everything by that distance
3. Draw the far stuff first, then the close stuff

Yeah, it's basically painter's algorithm but for nerds. Works pretty well honestly.

### Normals and Lighting (Making It Look Less Flat)

So initially everything looked super flat and boring. Like yeah cool it's 3D but it doesn't really *feel* 3D, you know?

The trick is normals. Every polygon in 3D space has something called a "normal vector" which is basically just which way the polygon is facing. If it's pointing at the light, it's bright. If it's facing away, it's dark.

The math for this is just the dot product:

```
brightness = dot(normal, lightDirection)
```

I know, I know, it sounds all math-y and scary but it's really just asking "hey, how much is this thing looking at the light?"

### The Depth Buffer Thing

Here's where it gets a little spicy. Instead of just sorting polygons, I actually keep track of depth for each pixel. So when I'm about to draw a character at some pixel, I check: is there already something there? And if so, how far away is it?

```
if (storedDepth[px, py] > currentDepth) {
  drawCharacter(px, py)
  storedDepth[px, py] = currentDepth
}
```

This means characters can actually overlap each other properly instead of just doing that weird polygon sorting thing where parts of faces just disappear. Much cleaner.

## ASCII Characters as Pixels

The fun part is using different ASCII characters for different brightness levels. So instead of just using `@` for everything, I made this gradient:

```
Darkest: . : * o O # @
Lightest: (more whitespace)
```

It gives it this really cool retro-terminal vibe. Almost like an old oscilloscope display or something.

## Why Tho?

Honestly? No reason. I just thought it was funny that you could make 3D graphics with text characters. Sometimes you just gotta do things because they're weird and possible.

Plus it's a nice reminder that graphics programming doesn't have to be all fancy shaders and GPUs. Sometimes you can just... use some `*` and `#` characters and call it a day.

## The Creepy Factor

Look, I won't lie to you. The output is slightly unsettling. There's just something about a face made of punctuation marks that gives me the creeps. In a good way though? Like a haunted mansion in a fairground.

Anyway, have fun messing with it. Rotate the mesh, play with the focal length, see what weird stuff you can make. That's the whole point.

---

*Last updated: March 2026 (I think this was a Tuesday, hard to remember)*
