#!/usr/bin/env node

// 引入依赖库
const express = require('express');
const Web3 = require('web3');
const { ethers } = require('ethers');
const axios = require('axios');
const dotenv = require('dotenv').config(); // 确保你有一个 .env 文件在你的项目根目录下
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bcryptjs = require('bcryptjs');
const { createStore, applyMiddleware } = require('redux');
const thunk = require('redux-thunk');
const React = require('react');
const ReactDOM = require('react-dom');

// 设置 Express 应用
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

// 设置数据库连接
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// 定义简单的 Redux reducer 和 store（示例）
const reducer = (state = { value: 0 }, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return { value: state.value + 1 };
        default:
            return state;
    }
};
const store = createStore(reducer, applyMiddleware(thunk));

// 示例 Ethereum 功能
const web3 = new Web3(process.env.INFURA_URL); // 确保你的 .env 文件包含 INFURA_URL
const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);

// Express 路由示例
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Ethereum 路由示例
app.get('/eth-balance', async (req, res) => {
    const address = req.query.address; // 从请求中获取地址
    try {
        const balance = await web3.eth.getBalance(address);
        res.json({ balance: Web3.utils.fromWei(balance, 'ether') });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});

// 启动 Express 服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});