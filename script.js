const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/estande/todos", (req, res) => {
    axios.get("http://ec2-18-188-37-44.us-east-2.compute.amazonaws.com:8080/estande/todos", {
        headers: {
            Authorization: req.headers.authorization
        }
    }).then((response) => {
        return res.json(response.data);
    }).catch(err => {
        console.log(err);
        return res.json({
            error: err
        })
    })
})

app.listen("3005", () => console.log("Server running on port 3005"));