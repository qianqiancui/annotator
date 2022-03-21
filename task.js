/********************************************************************************
* Author: Lee Qianqian Cui
* Email: qc697@nyu.edu
* Annotator Studay
* 2021
********************************************************************************/

/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object, do not delete
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

//// need to double check:
//psiTurk.taskdata.set('condition', 10);
//psiTurk.taskdata.get('condition');
//experiment_code_version = 1.0;
//num_conds = 100;
//num_counters = 1;

var mycondition = condition;  // these two variables are passed by the psiturk server process

var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

console.log(condition, 'CONDITION');


var pages = [
    //"consent.html",
    "instructions/instruct-1.html",
    "instructions/instruct-2.html",

    "instructions/instruct-sex-1.html",
    "instructions/instruct-sex-2-f-female.html",

    "instructions/instruct-sex-2-f-male.html",



    "instructions/instruct-race-1.html",
    "instructions/instruct-race-2.html",
    "instructions/enterID.html",

    "stage.html",
    "postquestionnaire1.html",

];

psiTurk.preloadPages(pages);

var general_instruction_pages = [ // add as a list as many pages as you like

    //"consent.html",
    "instructions/instruct-1.html",
    "instructions/enterID.html",
    "instructions/instruct-2.html"
];

var sex_pages_f_female = [

    "instructions/instruct-sex-1.html",
    "instructions/instruct-sex-2-f-female.html"

];

var sex_pages_f_male = [

    "instructions/instruct-sex-1.html",
    "instructions/instruct-sex-2-f-male.html"

];


var race_pages = [// add as a list as many pages as you like

    "instructions/instruct-race-1.html",
    "instructions/instruct-race-2.html"
];


//print(uniqueId, 'uniqueId');
/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

var rand_sex_key = Math.random();

if (rand_sex_key <= 0.5) {
    var sex_key_assig = "f-female";
} else if (rand_sex_key > 0.5) {
    var sex_key_assig = "f-male";
}

// randomize block order
var rand_block = Math.random();
if (rand_block < .5) {
    var block_order = "1_sex_2_race";
} else if (rand_block >= .5){
    var block_order = "1_race_2_sex";
}

// source folder for loading images
var stimFolder = "/static/images/faces/"

//change # of trials here
var total_trials = 160;
// take a break after Xth trial. set 500 if you want to skip the break
var break_after_trial = 80;


//display fixation cross
var fixation_time = 1000;

var trial_count;

var space_pressed = false;

var stim_array = [];
var stim_array_race = [];

var warning;

var break_session = false;

// respond no later than 3000(ms)
var max_reaction_time = 3000;

// allow response after 900(ms)
var allow_resp_after = 900;

// 80 conditions in toall
// 300 images in each condtion



//import { readFaces } from './read-faces.js';

var all_images= readFaces();


//alert(id);

//load images for each participant
//ref: https://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array

function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
};
var trial_container = getRandomSubarray(all_images, total_trials);



//shuffle all the images

//for sex
trial_container = _.shuffle(trial_container);
//for race 
var trial_container_race = trial_container.slice(0);

trial_container_race = _.shuffle(trial_container_race);

console.log(trial_container, "sex");

console.log(trial_container_race, "race");


var timer;

var id = getID();


// display the stimuli;
// change each picture's properties or appearance;

var show_stim = function (image) {
    trial_count++;
    console.log(trial_count);
    space_pressed = false;
    console.log(space_pressed,"space")
    
    d3.select("#stim")
        .append("img")
        .attr("src", stimFolder + image)
        .attr("id", 'pic')
        .style("width", "100%")
        .style("height", "100%")
        .style("border", "initial")
        .style("top", "50")
        .style("left", "50");

    //d3.select('#warning').html('');
    //warning = false;
    //d3.select("#fixation_cross").html("");
    document.getElementById('male').style.border = "initial";
    document.getElementById('female').style.border = "initial";

    break_session = false;


    // timer
    timer = setTimeout(function () {
        d3.select('#warning').html('Please respond to this question');
        //warning = true;

    }, max_reaction_time);

    //setTimeout(function () {
    //    $("#stim").animate({ width: "300px", height: "300px" }, 300);

    //}, 800);

//    if (rand_sex_key <= 0.5) {
    if (sex_key_assig === "f-female"){

        //d3.select("#male").text("&nbsp;&nbsp;Male&nbsp;&nbsp;");
        d3.select("#female").text("Female")

        $("#male").text(" \u00A0 Male \u00A0 ");
        //$("#female").text("Female");


    } else if (sex_key_assig === "f-male") {


        d3.select("#male").text("Female");
        d3.select("#female").text("\u00A0 Male \u00A0 ");

        //document.getElementById('male').innerHTML = "Female";
        //document.getElementById('female').innerHTML = "&nbsp;&nbsp;Male&nbsp;&nbsp;";
    }


    setTimeout(function () {

        if (block_id === "sex") {

            document.getElementById('female').style.opacity = 1;
            document.getElementById('male').style.opacity = 1;
            document.getElementById('raceIntro').style.opacity = 0;
            document.getElementById('sexIntro').style.opacity = 1;

            document.getElementById('female_instruction').style.opacity = 1;
            document.getElementById('male_instruction').style.opacity = 1;


            document.getElementById('white').style.opacity = 0;
            document.getElementById('black').style.opacity = 0;
            document.getElementById('eastAsian').style.opacity = 0;
            document.getElementById('indian').style.opacity = 0;
//            document.getElementById('middleEastern').style.opacity = 0;
//            document.getElementById('latino').style.opacity = 0;


            document.getElementById('white_instruction').style.opacity = 0;
            document.getElementById('black_instruction').style.opacity = 0;
            document.getElementById('eastAsian_instruction').style.opacity = 0;
            document.getElementById('indian_instruction').style.opacity = 0;
//            document.getElementById('middleEastern_instruction').style.opacity = 0;
//            document.getElementById('latino_instruction').style.opacity = 0;



        } else {

            document.getElementById('female').style.opacity = 0;
            document.getElementById('male').style.opacity = 0;
            document.getElementById('raceIntro').style.opacity = 1;
            document.getElementById('sexIntro').style.opacity = 0;

            document.getElementById('female_instruction').style.opacity = 0;
            document.getElementById('male_instruction').style.opacity = 0;



            document.getElementById('white').style.opacity = 1;
            document.getElementById('black').style.opacity = 1;
            document.getElementById('eastAsian').style.opacity = 1;
            document.getElementById('indian').style.opacity = 1;
//            document.getElementById('middleEastern').style.opacity = 1;
//            document.getElementById('latino').style.opacity = 1;


            document.getElementById('white_instruction').style.opacity = 1;
            document.getElementById('black_instruction').style.opacity = 1;
            document.getElementById('eastAsian_instruction').style.opacity = 1;
            document.getElementById('indian_instruction').style.opacity = 1;
//            document.getElementById('middleEastern_instruction').style.opacity = 1;
//            document.getElementById('latino_instruction').style.opacity = 1;

        }








    }, 750);



};



var remove_stim = function () {
    //remove the previous images;

    //listening = false;


    d3.select("#pic").remove();
    d3.select('#warning').html('');

    document.getElementById('male').style.border = "initial";
    document.getElementById('female').style.border = "initial";
    document.getElementById('white').style.border = "initial";
    document.getElementById('black').style.border = "initial";
    document.getElementById('eastAsian').style.border = "initial";
    document.getElementById('indian').style.border = "initial";
//    document.getElementById('middleEastern').style.border = "initial";
//    document.getElementById('latino').style.border = "initial";


    document.getElementById('female').style.opacity = 0;
    document.getElementById('male').style.opacity = 0;


    document.getElementById('white').style.opacity = 0;
    document.getElementById('black').style.opacity = 0;
    document.getElementById('eastAsian').style.opacity = 0;
    document.getElementById('indian').style.opacity = 0;
//    document.getElementById('middleEastern').style.opacity = 0;
//    document.getElementById('latino').style.opacity = 0;

    document.getElementById('raceIntro').style.opacity = 0;

    document.getElementById('white_instruction').style.opacity = 0;
    document.getElementById('black_instruction').style.opacity = 0;
    document.getElementById('eastAsian_instruction').style.opacity = 0;
    document.getElementById('indian_instruction').style.opacity = 0;
//    document.getElementById('middleEastern_instruction').style.opacity = 0;
//    document.getElementById('latino_instruction').style.opacity = 0;



    document.getElementById('female_instruction').style.opacity = 0;
    document.getElementById('male_instruction').style.opacity = 0;
    document.getElementById('sexIntro').style.opacity = 0;



    document.getElementById('stim').style.height = "";
    document.getElementById('stim').style.width = "";


}


/******************
*  SEX BLOCK   *
*******************/
var sex_block = function () {

    trial_count = 0;
    var stim_on, // time stimulus is presented
        listening = false;


    var show_fixation_cross_and_next_trial = function () {


        d3.select("#fixation_cross").html("+");


        setTimeout(function () {
            //var timeleft = 15;


            if (trial_count === break_after_trial) {
                next();
            } else {

                    next();

                d3.select("#fixation_cross").html("+");

            }
        }, fixation_time);
    };

    var next = function () {

        if (trial_container.length === 0 && block_order === "1_sex_2_race") {


            return psiTurk.doInstructions(
                race_pages, // a list of pages you want to display in sequence
                function () { currentview = new race_block(); console.log("enter race");}
            );

        } else if (trial_container.length === 0 && block_order === "1_race_2_sex") {
            finish();
        }
    
        else if (trial_container.length !== 0) {

            block_id = "sex";
            stim_array = trial_container.shift();

            console.log(trial_container, "trial_container" );
            stim = stim_array;


            if (trial_count === break_after_trial) {

                break_session = true;
                d3.select("#warning").html("");
                //console.log('break session');
                d3.select("#fixation_cross").html("");
                d3.select("#pause_instruction").html('<p>You have finished a round of this task.</p> <p>Press [Space] to continue the next round when you are ready.</p>');

                var pause_timer = function (e) {

                    var keyCode = e.keyCode;

                    if (keyCode === 32 && break_session === true) {

                        d3.select("#pause_instruction").html('');
                        d3.select("#fixation_cross").html("+");
                        setTimeout(show_stim(stim), 900);
                        //listening = false;

                    }

                    
                };

                document.body.addEventListener("keypress", pause_timer);
            } else {
                show_stim(stim);
            }

        };


        stim_on = new Date().getTime();
        setTimeout(function () { listening = true; }, allow_resp_after);


    };


    var trial_type = "sex";

    var response_handler = function (e) {
        if (!listening) return;

        var keyCode = e.keyCode,

            sex_resp_received = false,
            race_resp_received = false,
            response_received = false;


        //console.log(block_id);
        //var keyCode = e.keyCode,
        //var race_resp;

        var sex_resp;
        var key_pressed;

        if (block_id === "sex") {


            if (sex_key_assig === "f-female" && break_session === false) {

                
                switch (keyCode) {
                    case 74:

                        sex_resp = "male";
                        key_pressed = "J";

                        document.getElementById('male').style.border = "5px solid yellow";
                        response_received = true;
                        sex_resp_received = true;
                        //race_resp_received = false;
                        break;

                    case 68:
                        sex_resp = "female";
                        key_pressed = "D";
                        //race_resp = "";
                        document.getElementById('female').style.border = "5px solid yellow";
                        response_received = true;
                        sex_resp_received = true;
                        //race_resp_received = false;
                        break;



                    default:
                        sex_resp = "";
                        key_pressed = "";
                        //race_resp = "";
                        sex_resp_received = false;
                        //race_resp_received = false;
                        break;
                }
            } else if (sex_key_assig === "f-male" && break_session === false) {
                switch (keyCode) {
                    case 74:
                        sex_resp = "female";
                        key_pressed = "J";
                        //race_resp = "";
                        document.getElementById('male').style.border = "5px solid yellow";
                        response_received = true;
                        sex_resp_received = true;
                        //race_resp_received = false;
                        break;

                    case 68:
                        sex_resp = "male";
                        key_pressed = "D";
                        //race_resp = "";
                        document.getElementById('female').style.border = "5px solid yellow";

                        response_received = true;
                        sex_resp_received = true;
                        //race_resp_received = false;
                        break;




                    default:
                        sex_resp = "";
                        key_pressed = "";
                        //race_resp = "";
                        sex_resp_received = false;
                        //race_resp_received = false;
                        break;
                }
            }
            
            
            
        }


     


        if (sex_resp_received) {

            var sex_rt = new Date().getTime() - stim_on;
            var sex_resp = sex_resp;
            //var key_pressed = key_pressed;
            d3.select('#warning').html('');


            if (timer) {

                clearTimeout(timer);
            }


            psiTurk.recordTrialData({

                'trial': trial_count,
                'block': block_id,
                'sex_key_assigned': sex_key_assig,
                'key_pressed':key_pressed,
                'sex_rt': sex_rt,
                'sex_resp': sex_resp,
                'img_name': stim,
                'condition': condition,
                'id':id

            });



            listening = false;

            setTimeout(function () {


                remove_stim();
                show_fixation_cross_and_next_trial();

            }, 500);


        };

    };

    // Load the stage.html snippet into the body of the page
    psiTurk.showPage('stage.html');

    // Register the response handler that is defined above to handle any
    // key down events.
    $("body").focus().keydown(response_handler);

    //$("body").focus().keydown(pause_timer);


    // Start the test
    show_fixation_cross_and_next_trial();


    var finish = function () {
        $("body").unbind("keydown", response_handler); // Unbind keys

        currentview = new Questionnaire1();

    };

};





/******************
*  Race BLOCK   *
*******************/
var race_block = function () {
    trial_count = 0;

    var stim_on, // time stimulus is presented
        listening = false;


    var show_fixation_cross_and_next_trial = function () {


        d3.select("#fixation_cross").html("+");


        setTimeout(function () {
            //var timeleft = 15;


            if (trial_count === break_after_trial) {

                next();

            } else {

                next();

                d3.select("#fixation_cross").html("+");

            }
                   
//                                   next();
//                                   d3.select("#fixation_cross").html("+");
        }, fixation_time);
    };

    var next = function () {



        if (trial_container_race.length === 0 && block_order === "1_race_2_sex") {



            if (sex_key_assig === "f-female") {
                return psiTurk.doInstructions(
                    sex_pages_f_female,

                    function () { currentview = new sex_block(); console.log("enter f-female"); } // what you want to do when you are done with instructions
                );
            } else if (sex_key_assig === "f-male") {
                return psiTurk.doInstructions(
                    sex_pages_f_male,
             
                    function () { currentview = new sex_block(); console.log("enter f-male"); } // what you want to do when you are done with instructions
                );
            }
        } else if (trial_container_race.length === 0 && block_order === "1_sex_2_race") {


                finish();
            }
        else if (trial_container_race.length !== 0) {



            block_id = "race";
            stim_array = trial_container_race.shift();

            stim = stim_array;
            //console.log(stim);

            if (trial_count === break_after_trial) {

                 break_session = true;
                 d3.select("#warning").html("");
                 //console.log('break session');
                 d3.select("#fixation_cross").html("");
                 d3.select("#pause_instruction").html('<p>You have finished a round of this task.</p> <p>Press [Space] to continue the next round when you are ready.</p>');

                 var pause_timer = function (e) {

                     var keyCode = e.keyCode;

                     if (keyCode === 32 && break_session === true) {

                         d3.select("#pause_instruction").html('');
                         d3.select("#fixation_cross").html("+");
                         setTimeout(show_stim(stim), 900);
                         //listening = false;

                     }

                     
                 };

                 document.body.addEventListener("keypress", pause_timer);
             }  else {
                break_session = false;
                show_stim(stim);
            }


        }


        stim_on = new Date().getTime();

        setTimeout(function () { listening = true; }, allow_resp_after);


    };

//    var end_break = function () {
////                    var keyCode = e.keyCode;
////        if (space_pressed === true) {
//            break_session = false;
////                        $("body").focus().keydown(response_handler);
//            d3.select("#pause_instruction").html('');
//            d3.select("#fixation_cross").html("+");
//            setTimeout(show_stim(stim), 900);
//            //listening = false;
////        }
//    };

    var trial_type = "race";

    var response_handler = function (e) {
        if (!listening) return;

        var keyCode = e.keyCode,
            race_resp_received = false,
            response_received = false;
        
        var race_resp;
        var key_pressed;
        if (block_id === "race") {
        if(break_session === false){
            switch (keyCode) {
                    case 49:
                        //target on the left
                        key_pressed = "1";
    //                    raceResponse = "white";
                        document.getElementById('white').style.border = "5px solid yellow";
                        race_resp = "White"
                        race_resp_received = true;
                        break;
                    // press [J]
                    case 50:
                        key_pressed = "2";
    //                    raceResponse = "black";
                        document.getElementById('black').style.border = "5px solid yellow";
                        race_resp = "Black"
                        race_resp_received = true;
                        break;
                    case 51:
                        key_pressed = "3";
    //                    raceResponse = "east_asian";
                        document.getElementById('eastAsian').style.border = "5px solid yellow";
                        race_resp = "East-Asian"
                        race_resp_received = true;
                        break;
                    case 52:
                        key_pressed = "4";
    //                    raceResponse = "south_asian;
                        document.getElementById('indian').style.border = "5px solid yellow";
                        race_resp = "South-Asian"
                        race_resp_received = true;
                        break;
                    
                    default:
                        key_pressed = "";
                        race_resp_received = false;
                        break;
                    }
        }
//        else{
//                switch (keyCode) {
////                    case 32:
////                    space_pressed = true;
////                    break_session = false;
////                    key_pressed = "";
////                    race_resp_received = false;
////                    break;
//
//                    default:
//                        key_pressed = "";
//                        space_pressed = false;
//                        race_resp_received = false;
//                        break;
//        }
//        }
        }




        if (race_resp_received) {

            console.log(race_resp_received,"race_resp_received")
            //if (!response_received) {

            if (timer) {
                // cancel existing timer if exist;
                clearTimeout(timer);
            }
            listening = false;
            setTimeout(function () {
                var race_rt = new Date().getTime() - stim_on;
                //var race_resp = race_resp;
                //record data;
                psiTurk.recordTrialData({
                    'trial': trial_count,
                    'block': block_id,
                    'sex_key_assigned': sex_key_assig,
                    'key_pressed': key_pressed,
                    'race_rt': race_rt,
                    'race_resp': race_resp,
                    'img_name': stim,
                    'condition': condition,
                    'id':id
                                        
                });
   
                remove_stim();
                show_fixation_cross_and_next_trial();
                // display next stimuli after 500ms;
            }, 500);
        };
        
    };

    // Load the stage.html snippet into the body of the page
    psiTurk.showPage('stage.html');

    // Register the response handler that is defined above to handle any
    // key down events.
    $("body").focus().keydown(response_handler);

    //$("body").focus().keydown(pause_timer);


    // Start the test
    show_fixation_cross_and_next_trial();

    var finish = function () {
        $("body").unbind("keydown", response_handler); // Unbind keys

        currentview = new Questionnaire1();

    };

};












/****************
* Questionnaire 1 *
****************/

var Questionnaire1 = function () {

    var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

    record_responses = function () {

        //psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

        $('input').each(function (i, val) {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });
        $('select').each(function (i, val) {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });

    };

    prompt_resubmit = function () {
        replaceBody(error_message);
        $("#resubmit").click(resubmit);
    };

    resubmit = function () {
        replaceBody("<h1>Trying to resubmit...</h1>");
        reprompt = setTimeout(prompt_resubmit, 10000);

        psiTurk.saveData({
            success: function () {
                clearInterval(reprompt);

            },
            error: prompt_resubmit
        });
    };

    psiTurk.showPage('postquestionnaire1.html');

    //$("#next").click(function () {
    //    record_responses();
    //    psiTurk.saveData({
    //        success: function () {
    //            psiTurk.computeBonus('compute_bonus', function () {
    //                psiTurk.completeHIT(); // when finished saving compute bonus, the quit
    //            });
    //        },
    //        error: prompt_resubmit
    //    });
    //});

    setTimeout(

    function () {

        record_responses();
        psiTurk.saveData({
            success: function () {
                psiTurk.computeBonus('compute_bonus', function () {
                    psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                });
            },
            error: prompt_resubmit
        });

    }, 500);

};


/****************
*  enter id page *
****************/

var enterID = function () {

    var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

    record_responses = function () {

        //psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

        $('input').each(function (i, val) {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });
        $('select').each(function (i, val) {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });

    };

    prompt_resubmit = function () {
        replaceBody(error_message);
        $("#resubmit").click(resubmit);
    };

    resubmit = function () {
        replaceBody("<h1>Trying to resubmit...</h1>");
        reprompt = setTimeout(prompt_resubmit, 10000);

        psiTurk.saveData({
            success: function () {
                clearInterval(reprompt);

            },
            error: prompt_resubmit
        });
    };

    psiTurk.showPage('enterID.html');

    $("#next").click(function () {
        record_responses();
        psiTurk.saveData({
            success: function () {
                psiTurk.computeBonus('compute_bonus', function () {
                    psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                });
            },
            error: prompt_resubmit
        });
    });

};





// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load(function () {
    if (block_order === "1_sex_2_race") {


        if (sex_key_assig === "f-female") {
            psiTurk.doInstructions(
                // a list of pages you want to display in sequence
                general_instruction_pages.concat( sex_pages_f_female),

                function () { currentview = new sex_block();
                                   console.log(sex_key_assig);
                                   } // what you want to do when you are done with instructions
            );
        }
        else if (sex_key_assig === "f-male"){
            psiTurk.doInstructions(
                general_instruction_pages.concat(sex_pages_f_male),
                function () { currentview = new sex_block();
                                   console.log(sex_key_assig);
                                   } // what you want to do when you are done with instructions
            );
        }

      
        } else if (block_order === "1_race_2_sex") {

            psiTurk.doInstructions(
                // a list of pages you want to display in sequence



                general_instruction_pages.concat(race_pages),



                function () { currentview = new race_block(); } // what you want to do when you are done with instructions
            );
        }
     });


