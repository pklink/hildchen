from flask import Flask, render_template, request, make_response
from os import getcwd, path, remove
from glob import glob
from PIL import Image

app = Flask(__name__)
app.secret_key = 'secret'


@app.route('/')
def main():
    # get images
    images = []

    for image in glob('./uploads/*thumb*'):
        thumbnail_name = path.basename(image)
        image_name = thumbnail_name.replace('-thumb', '-large')
        image_tupel = (image_name, thumbnail_name)
        images.append(image_tupel)

    # render template
    return render_template('home.html', images=images)


@app.route('/images/<image>')
def show_image(image):
    f = open('./uploads/' + image, 'rb')
    r = make_response(f.read())
    r.headers['Content-Type'] = 'image/jpeg'
    return r


@app.route('/upload', methods=['POST'])
def upload():
    # get uploaded file
    uploaded_file = request.files['file']

    # save file temporally
    tmp_path = './tmp/' + uploaded_file.filename
    uploaded_file.save(tmp_path)

    # save image
    image = ImageFile(tmp_path)
    image.save_original_image()
    image.create_large_version()
    image.create_thumbnail()

    # remove temp-file
    remove(tmp_path)

    return '1'


class ImageFile:

    def __init__(self, path_to_uploaded_file):
        # prepare properties
        self.smallest = 0
        self.largest = 0
        self.upload_dir = './uploads/'

        # create image instance of uploaded file
        self.original_image = Image.open(path_to_uploaded_file)

        # get name of file and extension
        basename = path.basename(path_to_uploaded_file)
        self.filename, self.extension = path.splitext(basename)

    def calculate_smallest_and_largest_side(self):
        if self.original_image.size[0] > self.original_image.size[1]:
            self.smallest = self.original_image.size[1]
            self.largest = self.original_image.size[0]
        else:
            self.smallest = self.original_image.size[0]
            self.largest = self.original_image.size[1]

    def get_px_of_smallest_side(self):
        if self.smallest == 0:
            self.calculate_smallest_and_largest_side()
        return self.smallest

    def get_px_of_largest_side(self):
        if self.largest == 0:
            self.calculate_smallest_and_largest_side()
        return self.largest

    def create_large_version(self):
        downscale_size = self.get_px_of_largest_side()

        if downscale_size > 800:
            downscale_size = 800

        image = self.original_image.copy()
        image.thumbnail((downscale_size, downscale_size))
        image.save(self.upload_dir + self.filename + '-large' + self.extension)

    def create_thumbnail(self):
        # copy image
        image = self.original_image.copy()

        smallest = self.get_px_of_smallest_side()

        # check if smallest not smaller then 200
        if smallest <= 200:
            smallest = 200

        # calculated coordinates for cropping
        left = image.size[0] - smallest
        right = smallest
        if left > 0:
            left /= 2
            right += left

        top = image.size[1] - smallest
        bottom = smallest
        if top > 0:
            top /= 2
            bottom += top

        # crop image in a square
        image = image.crop((left, top, right, bottom))

        # thumbnail file
        image.thumbnail((200, 200), Image.ANTIALIAS)

        # save thumbnail
        image.save(self.upload_dir + self.filename + '-thumb' + self.extension)

    def save_original_image(self):
        self.original_image.save(self.upload_dir + self.filename + self.extension)


if __name__ == '__main__':
    app.run()