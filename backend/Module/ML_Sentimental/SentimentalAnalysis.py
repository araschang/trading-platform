import pandas as pd
# robert twitter (roberta_transformers)
from transformers import AutoTokenizer
from transformers import AutoModelForSequenceClassification
from scipy.special import softmax
import datetime
import os

# assigned_date format: "yyyy-mm-dd"
def getSentimentScore(assigned='NO'):
    
    # READ Twitter Date
    twitter_df = pd.read_csv(os.path.join(os.path.dirname(__file__), 'Crawler/twitter_data_new.csv'))
     # 接鵬仁哥的
    twitter_df['post_time'] = pd.to_datetime(twitter_df['post_time'])

    # READ CVI Data
    cvi_df = pd.read_csv(os.path.join(os.path.dirname(__file__), 'CVIFolder/cvi_data.csv')) # 接鵬仁哥的
    cvi_df['DATE'] = pd.to_datetime(cvi_df['DATE'])

    # roBERTa sentiment analysis
    MODEL = f'cardiffnlp/twitter-roberta-base-sentiment'
    tokenizer = AutoTokenizer.from_pretrained(MODEL)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL)

    # roBERTa sentiment analysis function
    def polarity_scores_roberta(example):    
        encoded_text = tokenizer(example, return_tensors='pt')
        output = model(**encoded_text)
        scores = output[0][0].detach().numpy()
        scores = softmax(scores)
        scores_dict = {
            'roberta_neg': scores[0],
            'roberta_neu': scores[1],
            'roberta_pos': scores[2],
        }
        return scores_dict

    def roberta_analysis(df): # df = twitter_df
        roberta_dict = {}
        i = 0
        for comment in df['text']:
            roberta_dict[i] = polarity_scores_roberta(comment)
            i+=1
        print(roberta_dict)
        df[['roberta_neg', 'roberta_neu', 'roberta_pos']] = pd.DataFrame(roberta_dict).T
        return df

    # data cleaning after roBERTa sentiment analysis
    def data_cleansing(df):
        # Group by the DATE (one day one sentiment)
        df_sum = df.groupby('post_time').mean()
        df_sum['neg_nor'] = df_sum['roberta_neg'].apply(lambda x: (x-df_sum['roberta_neg'].mean())/(df_sum['roberta_neg'].std()))
        df_sum['neu_nor'] = df_sum['roberta_neu'].apply(lambda x: (x-df_sum['roberta_neu'].mean())/(df_sum['roberta_neu'].std()))
        df_sum['pos_nor'] = df_sum['roberta_pos'].apply(lambda x: (x-df_sum['roberta_pos'].mean())/(df_sum['roberta_pos'].std()))

        return df_sum
    
    def data_output(df_score, df_cvi):
        df_3 = pd.merge(df_score, df_cvi, how='inner', left_on=['post_time'], right_on=['DATE'])

        # CVI * sentiment score
        df_3['CVIxneu'] = (df_3['CLOSE'] * df_3['roberta_neu']) # May change method 這裡跟鵬仁哥再討
        # scale to -100~+100
        df_3['final_score'] = (df_3['CVIxneu']-50)*2 # May change method
        # scale to -100~+100
        df_3['final_score'] = df_3['final_score'].apply(lambda x: 100 if x>=100 else -100 if x<=-100 else x)
        return df_3[['DATE', 'final_score']]

    if assigned == 'NO':
        df_roberta = roberta_analysis(twitter_df)
        df_sum = data_cleansing(df_roberta)
        df_output = data_output(df_sum, cvi_df)
        df_output = df_output.drop_duplicates(subset=['DATE'])
        df_output.to_csv(os.path.join(os.path.dirname(__file__), 'sentiment_data.csv'), index=False)
        return "DONE creating new csv"
    
    if assigned != 'NO':
        assigned_date = pd.Timestamp(assigned)
        sentiment_df = pd.read_csv(os.path.join(os.path.dirname(__file__), 'sentiment_data.csv')) 
        sentiment_df['DATE'] = pd.to_datetime(sentiment_df['DATE'])
        if (assigned_date in sentiment_df['DATE'].to_list()):
            return "This date is already in the sentiment csv file"
        elif (assigned_date not in twitter_df['post_time'].to_list()) :
            return "no Twitter data"
        elif (assigned_date not in cvi_df['DATE'].to_list()) :
            return "no CVI data"
        else:
            twitter_selected_df = twitter_df[twitter_df['post_time'] == assigned_date]
            df_roberta = roberta_analysis(twitter_selected_df)
            df_sum = data_cleansing(df_roberta)
            df_output = data_output(df_sum, cvi_df)
            sentiment_df = sentiment_df.append({'DATE': df_output['DATE'][0], 'final_score': df_output['final_score'][0]}, ignore_index=True)
            sentiment_df.to_csv(os.path.join(os.path.dirname(__file__), 'sentiment_data.csv'), index=False)
            return "DONE adding new row to csv"

# from past to nowadays
# print(getSentimentScore())

# adding specific date
# print(getSentimentScore(str(datetime.date.today())))
# print(get_sentiment_score(str(datetime.date.today())))

def get_one_sentiment(day):
    pd_day = pd.Timestamp(day)
    sentiment_df = pd.read_csv('sentiment_data.csv')
    sentiment_df['DATE'] = pd.to_datetime(sentiment_df['DATE'])
    if sentiment_df[sentiment_df['DATE'] == pd_day].shape[0] == 0:
        return "score does not exist"
    else:
        return sentiment_df[sentiment_df['DATE'] == pd_day]['final_score'][0]

# get one score
# print(get_one_sentiment('2019/12/10'))
# print(get_one_sentiment(str(datetime.date.today())))