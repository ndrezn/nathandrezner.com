from PIL import Image
import click
import os


@click.command()
@click.argument(
    "path",
    type=click.Path(exists=True, resolve_path=True),
)
def compress(path):
    for file_name in os.listdir(path):
        if file_name.endswith(".jpg"):
            with Image.open(os.path.join(path, file_name)) as image:
                image.save(os.path.join(path, file_name), optimize=True, quality=20)


if __name__ == "__main__":
    compress()
