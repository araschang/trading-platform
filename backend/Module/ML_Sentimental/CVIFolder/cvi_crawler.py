from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import platform
import os

def getCVIData():
    '''
    This function would append the latest date and the latest price 
    to "./price_data.csv".
    '''

    options = Options()
    current_system = platform.system()
    if current_system == 'Linux':
        chrome_path = '/usr/lib/chromium-browser/chromedriver'
        options.add_argument("disable-infobars")
        options.add_argument("--disable-extensions")
        options.add_argument("--remote-debugging-port=9222")
        options.add_argument("--start-maximized")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--no-sandbox")
        options.add_argument('--headless')
    elif current_system == 'Darwin':
        chrome_path = './chromedriver_mac_arm64/chromedriver'
        options.add_argument("--disable-notifications")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option("useAutomationExtension", False)
        options.add_argument("user-agent=Mozilla/5.0")

    driver = webdriver.Chrome(chrome_path, chrome_options=options)
    path = "https://www.investing.com/indices/crypto-volatility-index-historical-data"
    driver.get(path)
    date = driver.find_element(
        By.XPATH, "/html/body/div/div[2]/div/div/div[2]/main/div/div[4]/div/div/div[3]/div/table/tbody/tr[1]/td[1]/time").text
    price = driver.find_element(
        By.XPATH, "/html/body/div/div[2]/div/div/div[2]/main/div/div[4]/div/div/div[3]/div/table/tbody/tr[1]/td[2]").text

    def is_long_ago(d1: str, d2: str) -> bool:
        d1 = list(map(int, d1.split('/')))
        d2 = list(map(int, d2.split('/')))
        if d2[2] < d1[2]:
            return True
        elif d2[2] == d1[2] and d2[0] < d1[0]:
            return True
        elif d2[2] == d1[2] and d2[0] == d1[0] and d2[1] < d1[1]:
            return True
        return False

    path = os.path.join(os.path.dirname(__file__), 'cvi_data.csv')
    with open(path, 'r+') as file:
        lines = file.readlines()
        latest = lines[-1]
        latest_date, latest_price = latest.split(',')
        if is_long_ago(latest_date, date):
            pass
        elif latest_date == date:
            lines = lines[:-1] + [f"{date},{price}\n"]
            file.seek(0)
            file.truncate(0)
            file.writelines(lines)
        else:
            lines += [f"{date},{price}\n"]
            file.seek(0)
            file.truncate(0)
            file.writelines(lines)
    return date, price


if __name__ == '__main__':
    date, price = get_price()
    print(date, price)
