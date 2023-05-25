from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import platform
import json
import os

def getNewsData():
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

    news = dict()
    # coindesk/bitcoin
    driver.get("https://www.coindesk.com/?s=bitcoin")
    wait = WebDriverWait(driver, 15)
    wait.until(EC.element_to_be_clickable(
        (By.XPATH, '//*[@id="CybotCookiebotDialogBodyButtonAccept"]')))
    driver.find_element(By.ID, 'CybotCookiebotDialogBodyButtonAccept').click()

    report = driver.find_elements(By.CLASS_NAME, 'card-title-link')
    links = [i.get_attribute('href') for i in report]
    titile = [i.text for i in report]

    news[titile[0]] = links[0]
    news[titile[1]] = links[1]

    # blocktempo/bitcoin
    driver.get("https://www.blocktempo.com/?s=%E6%AF%94%E7%89%B9%E5%B9%A3")
    report = driver.find_elements(By.CLASS_NAME, 'jeg_post_title')
    links = [i.find_element(By.TAG_NAME, 'a').get_attribute('href')
            for i in report]
    titile = [i.text for i in report]

    news[titile[0]] = links[0]

    path = os.path.join(os.path.dirname(__file__), 'result.json')
    with open(path, 'w') as fp:
        json.dump(news, fp)
    return news

if __name__ == '__main__':
    # news = get_news()
    # print(news)
    print(os.path.join(os.path.dirname(__file__), 'result.json'))
