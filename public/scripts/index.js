import {jsonee} from "./jsonee/index.js"
import {login} from "/necoengine/scripts/necoengine/login/index.js"


"use strict"
login.setLoginButton()
login.visit()


jsonee.initialize()
