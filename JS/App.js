$( document).ready(function() {
    console.log( "ready");
    $(".fetchIt").on("click", fetchQuestions);
    $(document).on( "click",".submit", getUserAnswers);
    $(document).on("click", "#back-questions", function () {
        $("#question-section").removeClass("d-none");
        $("#helper-section").addClass("d-none");
        $("#result-section").addClass("d-none");
        $("#question-container button:last-child").remove();
        let injection = "<button class=\"btn btn-dark col mt-4\" id=\"back-home\">Back to home</button>";
        $("#question-container").append(injection);
        muteQuestions();
    });
    $(document).on("click", "#back-home", function () {
        $("#question-section").addClass("d-none");
        $("#helper-section").removeClass("d-none");
        $("#result-section").addClass("d-none");
        clear();
    })
});

let timeCount;
let correct_answers = {
};
let user_answers = {
};

function checkAnswers(){

    function isCompleted(){
        let count = 0;
        for(let key in user_answers){
            count ++;
        }
        console.log(count, correct_answers.amount);
        return count === parseInt(correct_answers.amount);
    }

    console.log(correct_answers);
    console.log(user_answers);
    if(isCompleted()){
        $("#question-section").addClass("d-none");
        $("#helper-section").addClass("d-none");
        $("#result-section").removeClass("d-none");

        console.log("you submitted your answer");
        let gotRight = 0;
        for(let key in user_answers){
            if (user_answers[key] === correct_answers[key]){
                gotRight++;
                $(".Q_"+key).addClass("right mute");
            }
            else {
                $(".Q_"+key).addClass("wrong mute");
            }
        }
        // Inject scores result into $("#result-container")
        let score = gotRight/correct_answers.amount*100;
        let injection = "  <div><h2>Scores: "+score+"</h2></div>\n" +
            "\t\t\t\t\t\t<div>\n" +
            "\t\t\t\t\t\t\t<h4>You got "+gotRight+" questions!</h4>\n" +
            "\t\t\t\t\t\t\t<button class=\"btn btn-dark\" id=\"back-questions\">Back to questions</button>\n" +
            "\t\t\t\t\t\t</div>";
        $("#result-container").append(injection);
    }else {
        console.log("go to finish")
    }


}

function getUserAnswers(){
    clearInterval(timeCount);
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
    [].map.call(document.querySelectorAll('#helper-form .form-control'), function(each) {
        questionFilerArray.push(each.options[each.selectedIndex].value);
    });
    // Update amount of questions into correct_answer Obj
    correct_answers["amount"] = questionFilerArray[0];
    let myUrl = "https://opentdb.com/api.php?amount="+questionFilerArray[0]+
        "&category="+questionFilerArray[1]+
        "&difficulty="+questionFilerArray[2]+
        "&type="+questionFilerArray[3]+"";
    console.log("The fetch url: "+myUrl);

    $.ajax({
        url: myUrl,
        method: "GET"
    }).then(function(response) {
        console.log(response.results);

        if(response.results.length !== 0){
            getQuestions(response);
            // Inject submit button
            let injection = "<button class=\"btn btn-dark col submit\">Submit</button>";
            $("#question-container").append(injection);
        }else {
            clearInterval(timeCount);
            $("#question-container button:last-child").remove();
            $("#question-container").append( "<button class=\"btn btn-dark col mt-4\" id=\"back-home\">" +
                "Sorry, this is no result! Try again! </button>")
        }

    });
    
    let time;
    switch (correct_answers.amount) {
        case "1":
            time = 10;
            break;
        case "5":
            time = 30;
            break;
        case "10":
            time = 60;
            break;
        case "15":
            time = 90;
            break;
        case "20":
            time = 120;
            break;
    }
    
     timeCount = setInterval(function () {
        if(time >= 0){
            $(".time-count").text(time);
            time--;
        }else {
            muteQuestions();
            clearInterval(timeCount);
            $("#question-container button:last-child").remove();
            $("#question-container").append( "<button class=\"btn btn-dark col mt-4\" id=\"back-home\">Time Out! Back to Home</button>")
        }
    }, 1000);
}

function getQuestions(response) {
    function injectQuestions(question, answer, index){
        let injection = "<!--\t\t\t\t\t\t\t\tsingle-question-starts-->\n" +
            "<div class=\"form-group question shadow p-3 mb-5  rounded Q_"+index+"\">\n" +
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
    console.log(correct_answers);
}

function clear(){
    correct_answers = {};
    user_answers = {};
    $("#question-form").text("");
    $("#question-container button:last-child").remove();
    $("#result-container").text("");
}

function muteQuestions() {
    $("input").prop('disabled', true);
}