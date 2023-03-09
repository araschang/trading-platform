import axios from "axios";

const API_URL = "https://cat-jessie-vm.iottalktw.com/api/";

const register = (email, password) => {
    return axios.post(API_URL + "membership", {
        email: email,
        password: password
    });
};

const login = (email, password) => {
    return axios
        .post(API_URL + "login", {
            email: email,
            password: password
        })
        .then((response) => {
            if (response.data == 200) {
                localStorage.setItem("user", JSON.stringify({ email }));
            }
            return response.data;
        });
};

const getCurrentUserEmail = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.email : null;
};

const logout = () => {
    localStorage.removeItem("user");
    return axios.post(API_URL + "signout").then((response) => {
        return response.data;
    });
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const backtest = (exchange, email, symbol, timeframe, strategy, backtest_range) => {
    console.log({
        exchange: exchange,
        email: email,
        symbol: symbol,
        timeframe: timeframe,
        strategy: strategy,
        backtest_range: backtest_range
    }

    );
    return axios
        .post(API_URL + "backtest/" + email, {
            exchange: exchange,
            email: email,
            symbol: symbol,
            timeframe: timeframe,
            strategy: strategy,
            backtest_range: backtest_range
        })
        .then((response) => {
            console.log(response);
            return response.data;
        });
};

const tradeImply = (email, exchange, api_key, api_secret, pass_phrase, symbol, money, timeframe, strategy) => {
    return axios
        .post(API_URL + "trade/" + email, {
            email: email,
            exchange: exchange,
            api_key: api_key,
            api_secret: api_secret,
            pass_phrase: pass_phrase,
            symbol: symbol,
            money: money,
            timeframe: timeframe,
            strategy: strategy
        })
        .then((response) => {
            return response.data;
        });
};


const backtestGet = (email) => {
    return axios
        .get(API_URL + "backtest/" + email)
        .then((response) => {
            return response.data;
        });
};

const crawlGet = () => {
    return axios
        .get(API_URL + "crawl")
        .then((response) => {
            return response.data;
        });
};

const sentimentGet = () => {
    return axios
        .get(API_URL + "sentiment")
        .then((response) => {
            return response.data;
        });
};

const wordCloudGet = () => {
    return axios
        .get(API_URL + "wordcloud")
        .then((response) => {
            return response.data;
        });
};



const AuthService = {
    register,
    getCurrentUserEmail,
    login,
    logout,
    getCurrentUser,
    backtest,
    tradeImply,
    backtestGet,
    sentimentGet,
    crawlGet,
    wordCloudGet
}

export default AuthService;