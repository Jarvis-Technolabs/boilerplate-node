"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Tournament Bracket Backend' });
});
module.exports = router;
//# sourceMappingURL=index.js.map