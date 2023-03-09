import matplotlib.pyplot as plt
from wordcloud import WordCloud
from wordcloud import STOPWORDS
import os
import pandas as pd
import seaborn as sns
import numpy as np
from PIL import Image
import base64
from io import BytesIO

def getWordCloud():
    path = os.path.join(os.path.dirname(__file__), 'ML_Sentimental/Crawler/twitter_data_new.csv')
    df = pd.read_csv(path)

    stop_words = STOPWORDS.update(["https", "co", "RT", "reddit", "bitcoin", "WWW", "com", "message", "n"])
    # twitter
    wordcloud = WordCloud(stopwords = stop_words).generate(''.join([i for i in df['text']]))

    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis("off")

    img_path = os.path.join(os.path.dirname(__file__), "example1.png")
    plt.savefig(img_path)
    encode = img_to_base64(img_path)
    return encode

def img_to_base64(img_path):
    with open(img_path, 'rb') as f:
        img = f.read()
        img_base64 = base64.b64encode(img).decode('utf-8')
    return img_base64

if __name__ == '__main__':
    print(getWordCloud())