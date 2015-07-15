var allNames = ['adolfo_guzman_lopez_education_reporter', 'annie_gilbertson_education_reporter', 'mary_plummer_education_reporter', 'deepa_fernandes_early_childhood_development_correspondent', 'kitty_felde_washington_dc_correspondent', 'jed_kim_environment_reporter', 'josie_huang_immigration_and_emerging_communities_reporter', 'sanden_totten_science_reporter', 'sharon_mcnary_politics_reporter', 'rebecca_plevin_health_reporter', 'stephanie_oneill_health_care_correspondent', 'molly_peterson_environment_correspondent'];

var origXPos = [];
var origYPos = [];
var attempts = 0;
var correct = 0;

var captions = [];
captions[0] = "<h3>Adolfo Guzman-Lopez </br>Education Reporter </h3> <p>Adolfo has been a reporter at the station since 2000. His reporting at KPCC has included the South Gate city hall corruption scandal; the SB1070 protests in Phoenix and the 2007 May Day melee. </p> <p>He was born in Mexico City and grew up in Tijuana and San Diego. He now lives in Long Beach with his wife and two kids and is always open to hear traffic tips for the 110, 710, or the 5 freeways to downtown L.A. </p>";
captions[1] = "<h3>Annie Gilbertson </br>Education Reporter</h3> <p>Annie focused her reporting on issues of race and poverty in schools - and brings her experience covering issues of inequality to Southern California. </p><p>Annie grew up in Huntington Beach, California. She got hooked on radio reporting in college at Auburn University, where she graduated with a degree in English. When she's not geeking-out over spreadsheets, you can find her taking dance classes and driving endlessly around Los Angeles.</p>";
captions[2] = "<h3>Mary Plummer </br>Education Reporter</h3><p>Mary covers arts education for KPCC. Before joining the beat she was an associate producer for Take Two and The Madeleine Brand Show. </p> <p>Mary began her career in broadcast at ABC News in London, where she worked on TV stories for the network's news lineup and regularly covered Europe for ABCNews.com. Her work has been published by the Washington Post, The New York Times, PBS/THIRTEEN and the Yomiuri Shimbun. </p>";
captions[3] = "<h3>Deepa Fernandes </br>Early Childhood Development Correspondent</h3> <p>Deepa began her radio career at the Australian Broadcasting Corporation in Sydney in 1995. From there she lived and traveled in Latin America, reporting for the ABC and BBC World Service. Later she joined Pacifica Radio in New York City and founded People's Production House that conducts journalism trainings in minority communities.</p> <p>Deepa is well suited to KPCC's new beat of Early Childhood Development as she is the mother of two toddlers under 4, perhaps the most challenging job she has ever had. </p>";
captions[4] = "<h3>Kitty Felde </br>Washington, D.C. Correspondent</h3> <p>Kitty wanted to become the Dodgers' play-by-play announcer, but Vin Scully STILL hasn't retired. She hosted Talk of the City for a decade on KPCC and has been covering Capitol Hill for half a dozen years. </p><p>Off mike, she dances both on pointe (ballet) and ala Jane Austen (English Country Dancing), designs and sews most of her own clothes, and is an award winning playwright. She's working on her second middle school novel about the daughter of a California Congressman.</p>";
captions[5] = "<h3>Jed Kim </br>Environment Reporter</h3><p>Jed graduated from the University of Chicago in 2002, with a biology degree. After a few years of working in a laboratory, he decided that he'd be much happier as a radio reporter. He graduated from Columbia University's Graduate School of Journalism in 2008.</p><p>Before joining KPCC, Jed was a producer at WNYC's 'The Takeaway' and an associate producer for the HBO documentary 'Birders: The Central Park Effect.'</p>";
captions[6] = "<h3>Josie Huang </br>Immigration and Emerging Communities Reporter</h3><p>Josie came to KPCC from the Maine Public Broadcasting Network, where she was a reporter and co-host of the evening drive-time news show. Assignments have taken her to Central America's largest dump, a coastal Mississippi town recovering from Hurricane Katrina and the US-Canada border, which American seniors were crossing to buy cheaper prescription drugs.</p> <p>Josie grew up in Maryland and Taiwan and went to Dartmouth College in New Hampshire. She's happy to be near relatives, great cuisine and stand-up comedy venues.</p>";
captions[7] = "<h3>Sanden Totten </br>Science Reporter</h3><p>Sanden covers everything from space exploration and medical technology to endangered species and the latest earthquake research. He began his career in journalism at Minnesota Public Radio where he co-created the show 'In The Loop,' and helped develop the Public Insight Network, a crowd-sourcing tool designed to bring unique perspectives to the news.</p><p>Sanden has lived in Sweden and Japan and speaks both languages. He's a fan of comics, fast music and movies about time travel.</p>";
captions[8] = "<h3>Sharon McNary </br>Politics Reporter</h3><p>A military veteran, Sharon was a computer programmer before she was a journalist, so she has always sought out tech-savvy and creative ways to cover news. She uses public records, public engagement sourcing and other methods to help draw stories from the experience, expertise and concerns of our communities as well as from political agendas.</p><p>She is also an endurance athlete, an avid cook, seamstress and knitter.</p>";
captions[9] = "<h3>Rebecca Plevin </br>Health Reporter</h3><p>Prior to working at KPCC, Rebecca spent five years covering health news in California's Central Valley. She was also a lead reporter on The Reporting on Health Collaborative's groundbreaking series of stories about valley fever.</p><p>Rebecca grew up in the Washington, D.C. area and is a graduate of Northwestern University's Medill School of Journalism. She's also a fluent Spanish speaker, a certified yoga teacher and an avid rock climber.</p>";
captions[10] = "<h3>Stephanie O'Neill </br>Health Care Correspondent</h3> <p> Stephanie's multi-platform journalism career includes reporting for public radio, public television and newspapers. Her coverage has included environmental, legal and political features as well as reports on the 1992 L.A. Riot, the OJ Simpson criminal/civil trials and many of California's largest earthquakes, floods and fires.</p><p>Away from work, Stephanie enjoys riding her horses, hiking with her dogs and hanging out with her human friends and family.</p>";
captions[11] = "<h3>Molly Peterson </br>Environment Correspondent</h3> <p>Molly has reported, edited, directed programs, and produced stories for NPR and NPR shows including 'Day to Day' and KQED's 'California Report.' She was a contributing producer for Nick Spitzer's weekly music program, 'American Routes,' and reported for 'Living on Earth' in the Gulf of Mexico after Hurricanes Katrina & Rita. Prior to joining KPCC, she produced a nationally-distributed radio documentary about New Orleans called 'Finding Solid Ground.'</p><p>Molly graduated from UC Hastings College of the Law and is an inactive member of the State Bar of California.</p>";

function Init() {
	//console.log("ready");
	
	$("#detail").hide();
	$("#shareCon").hide();

	$( ".draggable" ).draggable({ revert: "valid" });
	$( ".droppable" ).droppable({
      hoverClass: "boxHover",
      drop: function( event, ui ) {
        $( this )
         var dragid = ui.draggable.attr("id").substring(1, ui.draggable.attr("id").length);
         var dropid = $(this).attr("id").substring(1, $(this).attr("id").length);
         var dataid = ui.draggable.attr("data-id")
         if (dragid == dropid) {
	   			$("#" + dragid + "inside").css("display", "block");
				$("#t" + dragid + " .messageright").css("display", "inline").delay(1500).fadeOut( "slow" );
				ui.draggable.css("visibility", "hidden");
				attempts ++;
				correct ++;
				$("#numAttempts").text(attempts);
				$("#numCorrect").text(correct);
				showInfo(dataid);

				$(this).click(function() {
					showInfo(dataid);
				});

				if (correct == 12) {
					$("#share").text("It took you " + attempts + " attempts to match them all. Share your score!")
					$("shareBtns").html("hello world");
					$("#shareCon").show();
				}

	         } else {
	         	//console.log("wrong");
	         	$("#t" + dragid + " .messagewrong").css("display", "inline").delay(1500).fadeOut( "slow" );
	         	attempts ++;
	         	$("#numAttempts").text(attempts);
	         }
      	}
    });


    $("#detail").click(function() {
		$("#detail").hide();
		$("#detail").animate({ opacity: '0' }, 500);
	});

} 

function showInfo(which) {
	$("#detail").show();
	$("#detail").animate({ opacity: '1' }, 500);
	$("#detail #desc").html(captions[which]);

	var img = new Image();
	img.src = "imgs/" + allNames[which] + ".jpg";
	img.id = "thumbnail"
	$("#detail #photoCon").empty();
	$("#detail #photoCon").append(img);


}


$(document).ready(function() {
	Init();

});