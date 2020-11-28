import os
from PIL import Image, ImageOps


def resize_image(path, output):
    """
    Resize images so they load more quickly
    """
    base = 2160
    img = Image.open(path)
    w, h = img.size
    # Shrink the image. 2k is more than enough
    if w > base:
        wpercent = base / float(w)
        hsize = int((float(h) * float(wpercent)))
        img = img.resize((base, hsize), Image.ANTIALIAS)
        w, h = img.size

    img.save(output)

    # Reduce quality. Even at 30% quality the files are more than acceptable
    quality = 30
    img = Image.open(output)
    img.save(output, quality=quality)

    return img


for img in os.listdir("./compressed"):
    resize_image(f"./current/{img}", f"./compressed/{img}")
