$( document ).ready(function() {
    console.log( "ready");

    $(".fetchIt").on("click", fetchQuestions);

});

function fetchQuestions(){
    $("#question-section").removeClass("d-none");
    $("#helper-section").addClass("d-none");

    $.ajax({
        url: "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=boolean",
        method: "GET"
    }).then(function(response) {
        getQuestions(response);
    });
}

function getQuestions(response) {

    function injectQuestions(question, answer, index){
        let injection = "<!--\t\t\t\t\t\t\t\tsingle-question-starts-->\n" +
            "<div class=\"form-group question shadow p-3 mb-5 bg-white rounded\">\n" +
            "\t\t\t\t\t\t\t\t\t<h4>"+index+". "+question+"</h4>\n" +
            "\t\t\t\t\t\t\t\t\t<hr />\n" +
            "\t\t\t\t\t\t\t\t\t<div class=\"form-check form-check-inline\">\n" +
            "\t\t\t\t\t\t\t\t\t\t<input class=\"form-check-input\" type=\"radio\" name=\"opt"+index+"\" value=\"true\">\n" +
            "\t\t\t\t\t\t\t\t\t\t<label class=\"form-check-label\" >True</label>\n" +
            "\t\t\t\t\t\t\t\t\t</div>\n" +
            "\t\t\t\t\t\t\t\t\t<div class=\"form-check form-check-inline\">\n" +
            "\t\t\t\t\t\t\t\t\t\t<input class=\"form-check-input\" type=\"radio\" name=\"opt"+index+"\" value=\"false\">\n" +
            "\t\t\t\t\t\t\t\t\t\t<label class=\"form-check-label\" >False</label>\n" +
            "\t\t\t\t\t\t\t\t\t</div>\n" +
            "\t\t\t\t\t\t\t\t</div>"+
            "<!--\t\t\t\t\t\t\t\tsingle-question-ends-->\n";
        $("#question-form").append(injection);
    }
    // The index of question
    let index = 1;
    response.results.map(question => {
        injectQuestions(question.question,question.correct_answer, index);
        index++;
    })

}
