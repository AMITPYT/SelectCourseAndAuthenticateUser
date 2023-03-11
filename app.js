const express = require("express");
require("./db");
const Signup = require("./Routers/Authentication/signup")
const Coures = require("./Routers/Courses/courses")
const Roles = require("./Routers/Roles/roles")
const Event = require("./Routers/Events/event")
const Setting = require("./Routers/Setting/setting")
const cors = require('cors');


const app = express();
const port = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());
// app.use(cors());
// app.use(express.json());

app.use(Signup)
app.use(Coures)
app.use(Roles)
app.use(Event)
app.use(Setting)



app.listen(port, () => {
    console.log(`connection is setup at localhost:${port}`)
})