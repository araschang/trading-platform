import matplotlib.pyplot as plt
from wordcloud import WordCloud
from wordcloud import STOPWORDS

import pandas as pd
import seaborn as sns
import numpy as np

def get_sentiment_score():

    df = pd.read_csv('crawler/twitter_data_new.csv')

    stop_words = STOPWORDS.update(["https", "co", "RT", "reddit", "bitcoin", "WWW", "com", "message", "n"])

    # reddit
    # wordcloud = WordCloud(stopwords = stop_words).generate(''.join([i for i in df['body']]))

    # twitter
    wordcloud = WordCloud(stopwords = stop_words).generate(''.join([i for i in df['text']]))

    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis("off")

    plt.savefig("example1.png")