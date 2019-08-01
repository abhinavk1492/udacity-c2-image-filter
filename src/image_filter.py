import sys
import cv2
import os

inputDir = '/util/mock/'
outputDir = '/out/'
fileName = sys.argv[1]
filePath = sys.argv[2]
failed = False

def process(fileName, inputDir, outputDir):
    # We need an absolute path
    print("fileName: "+fileName)
    # dir_path = '/Users/abhinavk/Documents/udacity-projects/udacity-c2-image-filter/src'
    dir_path = os.path.dirname(os.path.realpath(__file__))
    # dir_path = sys.argv[1]

    # Load the image from disk
    img = cv2.imread(dir_path+inputDir+fileName,0)
    if img is None:
        raise Exception("Image Failed to Load")
        # return False, "Image Failed to Load"

    # Apply the Canny edge detection filter
    filtered = cv2.Canny(img, 50, 50)
    if filtered is None:
        return False, "Image Failed To Filter"


    # Write the image back to disk
    out = cv2.imwrite(dir_path+outputDir+fileName, filtered)
    if out == False:
        return False, "Image Failed To Write"

    return True, "Success"

isSuccess, message = process(fileName, inputDir, outputDir)
print(isSuccess)
print(message)
# print(fileName)
sys.stdout.flush()