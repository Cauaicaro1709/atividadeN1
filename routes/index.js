var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Quiz Educativo" });
});

router.get("/quiz", (req, res) => {
    res.render("quiz", { title: "Quiz Educativo" });
});

router.get("/resultados", (req, res) => {
    res.render("resultados", { title: "Resultados" });
});

module.exports = router;
