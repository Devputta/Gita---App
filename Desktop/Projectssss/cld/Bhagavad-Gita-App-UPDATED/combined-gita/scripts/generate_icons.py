"""
Generates the app's icon and splash artwork purely from vector shapes
(no text glyphs), so nothing can render as a missing-font "tofu" box.

Symbol: a 24-spoke dharma chakra (a generic, ancient, non-copyrighted motif
long associated with dharma/duty -- central themes of the Gita) inside the
app's existing gold ring-on-navy mark.

Run:  python3 scripts/generate_icons.py
Outputs:
  public/icon-192.png, public/icon-512.png   (PWA)
  assets/icon-foreground.png                 (Android adaptive icon, transparent bg)
  assets/splash-icon.png                     (splash artwork, transparent bg)
"""
import math
from PIL import Image, ImageDraw

NAVY = (21, 17, 42, 255)
GOLD = (230, 184, 92, 255)
GOLD_SOFT = (230, 184, 92, 180)
TRANSPARENT = (0, 0, 0, 0)


def draw_chakra(draw: ImageDraw.ImageDraw, cx: int, cy: int, r: int, spokes: int, color, width: int):
    # Outer rim
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=width)
    # Hub
    hub_r = int(r * 0.10)
    draw.ellipse([cx - hub_r, cy - hub_r, cx + hub_r, cy + hub_r], fill=color)
    # Spokes, stopping short of the rim and hub for a cleaner look
    inner = hub_r * 1.6
    outer = r * 0.92
    for i in range(spokes):
        angle = (2 * math.pi / spokes) * i
        x1 = cx + inner * math.cos(angle)
        y1 = cy + inner * math.sin(angle)
        x2 = cx + outer * math.cos(angle)
        y2 = cy + outer * math.sin(angle)
        draw.line([x1, y1, x2, y2], fill=color, width=max(2, width // 2))


def make_square_icon(size: int, bg=NAVY) -> Image.Image:
    img = Image.new("RGBA", (size, size), bg)
    draw = ImageDraw.Draw(img)
    cx = cy = size // 2
    ring_r = int(size * 0.42)
    ring_w = max(4, int(size * 0.035))
    draw.ellipse([cx - ring_r, cy - ring_r, cx + ring_r, cy + ring_r], outline=GOLD, width=ring_w)
    draw_chakra(draw, cx, cy, int(size * 0.30), 24, GOLD, max(3, int(size * 0.018)))
    return img


def make_foreground(size: int) -> Image.Image:
    # Transparent background; Android applies its own background color/mask.
    img = Image.new("RGBA", (size, size), TRANSPARENT)
    draw = ImageDraw.Draw(img)
    cx = cy = size // 2
    draw_chakra(draw, cx, cy, int(size * 0.30), 24, GOLD, max(4, int(size * 0.02)))
    return img


def make_splash(size=1024) -> Image.Image:
    img = Image.new("RGBA", (size, size), TRANSPARENT)
    draw = ImageDraw.Draw(img)
    cx = cy = size // 2
    ring_r = int(size * 0.30)
    ring_w = max(4, int(size * 0.02))
    draw.ellipse([cx - ring_r, cy - ring_r, cx + ring_r, cy + ring_r], outline=GOLD, width=ring_w)
    draw_chakra(draw, cx, cy, int(size * 0.20), 24, GOLD, max(3, int(size * 0.012)))
    return img


if __name__ == "__main__":
    make_square_icon(192).save("public/icon-192.png")
    make_square_icon(512).save("public/icon-512.png")
    make_square_icon(32).save("public/favicon.png")
    make_foreground(1024).save("assets/icon-foreground.png")
    make_splash(1024).save("assets/splash-icon.png")
    print("Icons written.")
