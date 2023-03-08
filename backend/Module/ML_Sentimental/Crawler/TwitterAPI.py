import tweepy
import pandas as pd
import configparser
import datetime
import os


def parse(time):
    return datetime.datetime.strftime(time, "%Y/%m/%d")

def get_post(id_, api, tweets):
    public_tweets = api.user_timeline(screen_name='Bitcoin', count=200, max_id=id_)
    # global tweets
    for tweet in public_tweets:
        tweets.append({
        'id': tweet.id_str,
        'post_time': parse(tweet.created_at),
        'text': tweet.text,
        'likes': tweet.favorite_count,
#         'user': tweet.user
    })

def get_retweet_id(text):
    if "RT @" in text:
        return text[4:text.index(':')]
    else:
        return 'NA'
    
def clean_retweet_text(text):
    if "RT @" in text:
        return text[text.index(':')+1:]
    else:
        return text
    
def clean_retweet_html(text):
    if "https://" in text:
        if text[:text.index('https://')] == "":
            return "NA"
        else:
            return text[:text.index('https://')]
    else:
        return text

def run_twitter():
    # read configs
    config = configparser.ConfigParser()
    config_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'config.ini')
    config.read(config_path)

    # twitter API account
    api_key = config['Twitter']['api_key']
    api_key_secret = config['Twitter']['api_key_secret']
    access_token = config['Twitter']['access_token']
    access_token_secret = config['Twitter']['access_token_secret']

    # authentication
    auth = tweepy.OAuth1UserHandler(api_key, api_key_secret)
    auth.set_access_token(access_token, access_token_secret)
    api = tweepy.API(auth)

    public_tweets = api.user_timeline(screen_name='Bitcoin', count=200) # @username
    # # public_tweets = api.home_timeline()

    tweets = []
    for tweet in public_tweets:
        tweets.append({
            'id': tweet.id_str,
            'post_time': parse(tweet.created_at),
            'text': tweet.text,
            'likes': tweet.favorite_count,
    #         'user': tweet.user
        })

    for i in range(16):
        get_post(str(int(tweets[-1]['id'])-1), api, tweets)

    df = pd.DataFrame(tweets)
    df_raw = df.copy()
    df['retweet_user'] = df['text'].apply(lambda x: get_retweet_id(x))
    df['text'] = df['text'].apply(lambda x: clean_retweet_text(x))
    df['text'] = df['text'].apply(lambda x: clean_retweet_html(x))

    df_clean = df.drop(index=df[df['text'] == "NA"].index)
    path = os.path.join(os.path.dirname(__file__), 'twitter_data_new.csv')
    df_clean.to_csv(path)

if __name__ == "__main__":
    run_twitter()