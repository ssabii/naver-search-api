import express, { Request, Response } from "express";
import request from "request";
const cors = require("cors");
const qs = require("querystring");
require("dotenv").config();

const app = express();
const port = 3000;

const whitelist = ["http://localhost:6927"];
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const endpoint = "https://openapi.naver.com/v1/search/local.json";
const clientId = process.env.NAVER_CLIENT_ID || "";
const clientSecret = process.env.NAVER_CLIENT_SECRET || "";

app.get("/", cors(corsOptions), (req: Request, res: Response) => {
  const {
    query = "",
    display = "10",
    start = "1",
    sort = "random",
  } = req.query;
  const encodedQuery = qs.escape(query);
  const url = `${endpoint}?query=${encodedQuery}&display=${display}&start=${start}&sort=${sort}`;
  const options: request.Options = {
    url,
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
    },
  };

  request(options, (error: any, response: request.Response, body: any) => {
    if (error) {
      res.send(error);
    } else {
      res.send(body);
    }
  });
});

app.listen(port, () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: ${port}
  ################################################
  `);
});
