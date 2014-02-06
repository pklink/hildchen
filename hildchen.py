from flask import Flask, render_template, request, make_response
from os import getcwd, path
from glob import glob
from PIL import Image

app = Flask(__name__)
app.secret_key = 'secret'

@app.route('/')
def main():
    images = []
    for image in glob('./uploads/*thumb*'):
        images.append(path.basename(image))
    return render_template('home.html', images=images)

@app.route('/images/<image>')
def show_image(image):
    f = open(getcwd() + '/uploads/' + image, 'rb')
    r = make_response(f.read())
    r.headers['Content-Type'] = 'image/jpeg'
    return r

@app.route('/upload', methods=['POST'])
def upload():
    # folder for uploads
    upload_dir = './uploads/'

    # get uploaded file
    uploaded_file = request.files['file']

    # path to save the original file
    original_path = upload_dir + uploaded_file.filename

    # save file
    uploaded_file.save(original_path)

    # copy file for creating a thumbnail
    image = Image.open(original_path, 'r').copy()

    # get the value of the smallest side
    smallest = 0
    if image.size[0] > image.size[1]:
        smallest = image.size[1]
    else:
        smallest = image.size[0]

    # check if smallest not smaller then 200
    if smallest <= 200:
        smallest = 200

    # calculated coordinates for cropping
    left = image.size[0] - smallest
    right = smallest
    if left > 0:
        left = left / 2
        right += left

    top = image.size[1] - smallest
    bottom = smallest
    if top > 0:
        top = top / 2
        bottom += top

    # crop image in a square
    image = image.crop((left, top, right, bottom))

    # thumbnail file
    image.thumbnail((200, 200), Image.ANTIALIAS)

    # get name of file and extension
    filename, extension = path.splitext(uploaded_file.filename)

    # save thumbnail
    image.save(upload_dir + filename + '-thumb' + extension)

    return '1'


app.run(debug=True)