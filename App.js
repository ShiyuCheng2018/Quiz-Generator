$( document).ready(function() {
    console.log( "ready");
    $(".fetchIt").on("click", fetchQuestions);
    $(document).on( "click",".submit", getUserAnswers);
});

let correct_answers = {
};
let user_answers = {
};

function checkAnswers(){
    console.log(correct_answers);
    console.log(user_answers);
    console.log(JSON.stringify(correct_answers)===JSON.stringify(user_answers));

}

function getUserAnswers(){
    $("#question-section").addClass("d-none");
    $("#helper-section").addClass("d-none");
    $("#result-section").removeClass("d-none");

    console.log("you submitted your answer");
    // The collection of user input answers
    let index = 1;
    [].map.call(document.querySelectorAll('input[type="radio"]:checked'), function (each) {
        user_answers[index] = each.value;
        index++;
    });

    checkAnswers();
}


function fetchQuestions(){
    $("#question-section").removeClass("d-none");
    $("#helper-section").addClass("d-none");

    // The collection of user selects
    let questionFilerArray = [];
    // Select all helper form-controls in order to get user's question filter
    // let array = document.querySelectorAll('#helper-form .form-control');
    [].map.call(document.querySelectorAll('#helper-form .form-control'), function(each) {
        questionFilerArray.push(each.options[each.selectedIndex].value);
    });

    let myUrl = "https://opentdb.com/api.php?amount="+questionFilerArray[0]+
        "&category="+questionFilerArray[1]+
        "&difficulty="+questionFilerArray[2]+
        "&type="+questionFilerArray[3]+"";
    console.log("The fetch url: "+myUrl);

    $.ajax({
        url: myUrl,
        method: "GET"
    }).then(function(response) {
        getQuestions(response);
        // Inject submit button
        let injection = "<button class=\"btn btn-dark col submit\">Submit</button>";
        $("#question-container").append(injection);
    });
}

function getQuestions(response) {
    function injectQuestions(question, answer, index){
        let injection = "<!--\t\t\t\t\t\t\t\tsingle-question-starts-->\n" +
            "<div class=\"form-group question shadow p-3 mb-5 bg-white rounded\">\n" +
            "\t\t\t\t\t\t\t\t\t<h4>"+index+". "+question+"</h4>\n" +
            "\t\t\t\t\t\t\t\t\t<hr />\n" +
            "\t\t\t\t\t\t\t\t\t<div class=\"form-check form-check-inline\">\n" +
            "\t\t\t\t\t\t\t\t\t\t<input class=\"form-check-input\" type=\"radio\" name=\"opt"+index+"\" value=\"True\">\n" +
            "\t\t\t\t\t\t\t\t\t\t<label class=\"form-check-label\" >True</label>\n" +
            "\t\t\t\t\t\t\t\t\t</div>\n" +
            "\t\t\t\t\t\t\t\t\t<div class=\"form-check form-check-inline\">\n" +
            "\t\t\t\t\t\t\t\t\t\t<input class=\"form-check-input\" type=\"radio\" name=\"opt"+index+"\" value=\"False\">\n" +
            "\t\t\t\t\t\t\t\t\t\t<label class=\"form-check-label\" >False</label>\n" +
            "\t\t\t\t\t\t\t\t\t</div>\n" +
            "\t\t\t\t\t\t\t\t</div>"+
            "<!--\t\t\t\t\t\t\t\tsingle-question-ends-->\n";
        $("#question-form").append(injection);
    }
    // The index of question
    let index = 1;
    let correctAansers = [];
    response.results.map(question => {
        correctAansers.push(question.correct_answer);
        injectQuestions(question.question,question.correct_answer, index);
        // update correct answer JSON object
        correct_answers[index] = question.correct_answer;
        index++;
    });
    console.log(correct_answers)
}
