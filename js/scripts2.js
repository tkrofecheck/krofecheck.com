/* Author: Tim Krofecheck */
var zxcTO;

function Scroll(id,dis,pos){
	var obj = document.getElementById(id)
	obj.scrollTop = obj.scrollTop+dis;
	if (pos) {
		obj.scrollTop=pos;
	} else {
		zxcTO = setTimeout( function(){ Scroll(id,dis); },10); 
	}
}
	
var xmlDoc = "";
var jsonObj;
var videoIcon;

$(document).ready(function() {	
	$({ // Output FatCow
		type: "GET",
		url: "data/fatcow.xml",
		dataType: "xml",
		success: function(xml) {
			var sectionDiv1 = $("<div></div>");
			$(sectionDiv1).attr({ id : 'fatcow' });
			
			//GREEN START
			var greenImage = $(xml).find('green_image').text();
			var greenUrl = $(xml).find('green_url').text();
			var greenOnclick = $(xml).find('green_onclick').text();
			
			anchor1 = $("<a></a>");
			$(anchor1).attr({ href : greenUrl, onclick : greenOnclick });
			
			var green_img = $("<img/>");
			$(green_img).attr({ src : greenImage }).addClass("green_img");
			
			$(anchor1).append(green_img);
			
			$(sectionDiv1).append(anchor1);
			//GREEN END
			
			//AFFILIATE START
			var affiliateImage = $(xml).find('affiliate_image').text();
			var affiliateUrl = $(xml).find('affiliate_url').text();
			
			anchor2 = $("<a></a>");
			$(anchor2).attr({ href : affiliateUrl });
			
			var affiliate_img = $("<img/>");
			$(affiliate_img).attr({ src : affiliateImage }).addClass("affiliate_img");
			
			$(anchor2).append(affiliate_img);
			
			$(sectionDiv1).append(anchor2);
			//AFFILIATE END
			
			$(sectionDiv).append(sectionDiv1);
		}
	})
	
	$.ajax({ // Output Portfolio
		type: "GET",
		url: "data/portfolio.xml",
		dataType: "xml",
		success: function(xml) {
			$(xml).find('videoIcon').each(function(){
				videoIcon = $(this).text();
			});
			
			$(xml).find('project').each(function(){
				var linebreak = $("<br/>");
				var clearLinebreak = $("<br/>");
				
				$(clearLinebreak).attr({ 'clear' : 'all' });
				
				if ($(this).attr('display') == 'true') {				
					var projectName = $(this).find('name').text();
					var projectFolder = $(this).find('folder').text();
					var projectURL = "http://" + document.domain + "/portfolio/" + projectFolder + "/";
					
					var sectionId = projectFolder.toLowerCase();
					sectionId = sectionId.replace(' ', '');
					
					var sectionDiv = $("<div></div>");
					$(sectionDiv).attr({ id : sectionId });

					var h2 = $("<h2/>");
					$(h2).html(projectName);
					$(sectionDiv).append(h2);
					
					$(this).find('feed').each(function(i, data){
						var feedTitle = $(this).find('title').text();
						var feedDescription = $(this).find('description').text();
						var feedHref = $(this).find('url').text();

						
						var anchor = $("<a />");
						$(anchor)
							.html(feedTitle)
							.addClass("feed")
							.attr({ 'href' : '#inline1', 'title' : feedTitle })
							.css({ 'font-size' : '12px' })
							.click(function(){
								$.ajax({ // Output Portfolio
									type: "GET",
									url: feedHref,
									dataType: "json",
									success: function(json) {
										$("#inline1").html("<pre>" + JSON.stringify(json, null, 2) + "</pre>");
									}
								});
							});

						var span = $("<span></span>");
						$(span).html(" - " + feedDescription);

						$(sectionDiv).append(anchor);
						$(sectionDiv).append(span);
						$(sectionDiv).append("<br/>");
						
					});
					
					$(this).find('step').each(function(i, data){
						var image = $(this).find('image').text();
						
						if (image) {
							var text = $(this).find('text').text();
							var imageUrl = projectURL + image;
							var imageRel = "project-" + projectFolder.toLowerCase();
							var imageAlt = projectFolder.toLowerCase() + " " + (i + 1);
							
							var anchor = $("<a></a>");
							$(anchor).addClass("fancybox").attr({ 'rel' : imageRel, 'href' : imageUrl, 'title' : text });
							
							var img = $("<img/>");
							$(img).attr({ 'src' : imageUrl, 'alt' : imageAlt, 'border' : '0' }).css({'width' : '100','height' : 'auto'});
							
							$(anchor).append(img);
							$(sectionDiv).append(anchor);
						}
					});
					
					$(this).find('video').each(function(i, data){
						var swfTitle = $(this).find('title').text();
						var swfHref = $(this).find('src').text();
						var swfFile = projectURL + swfHref;
						var icon = 'http://' + document.domain + videoIcon;
						
						//Display help info on title
						var aTitle = swfTitle + "\nIf you experience artifacts resulting in poor video, download SWF here: " + swfFile;
						
						var anchor = $("<a />");
						$(anchor).addClass("play").attr({ 'href' : swfFile, 'title' : aTitle });
						
						var image = $("<img />");
						$(image).attr({ 'src' : icon, 'alt' : swfTitle, 'border' : '0' }).css({'width' : '100','height' : 'auto'});
						
						$(anchor).append(image);
						$(sectionDiv).append("<br/>");
						$(sectionDiv).append(anchor);
					});
					
					$('p#portfolio.text').append(sectionDiv);
					//$('p#portfolio.text').append(clearLinebreak);
				}
			});
		}
	});
	
	
	var sectionDiv, span, linebreak, clearLinebreak;
	var infoParagraph;
	
	$.ajax({ // Output About
		type: "GET",
		url: "data/about.xml",
		dataType: "xml",
		success: function(xml) {
			linebreak = $("<br/>");
			clearLinebreak = $("<br/>");
			$(clearLinebreak).attr({ 'clear' : 'all' });
			
			sectionDiv = $("<div></div>");
			$(sectionDiv).attr({ id : 'about' });
			
			$(xml).find('paragraph').each(function(){
				titleParagraph = $(this).find('title').text();
				infoParagraph = $(this).find('text').text();
			
				span = $("<span></span>");
				$(span).addClass("resume_about_text").html("<p style='font-weight: bolder; margin: 0; padding: 0; '>" + titleParagraph + "</p>" + infoParagraph);
				$(sectionDiv).append(span);
			
				$('p#about.text').append(sectionDiv);
			});
			
			sectionDiv = $("<div></div>");
			$(sectionDiv).attr({ id : 'social' });
			
			var span1 = $("<span></span>");
			var socialFolder = $(xml).find('folder').text();
			$(xml).find('social').each(function(){
				var socialIcon = $(this).find('icon').text();
				var socialUrl = $(this).find('url').text();
				
				var socialIconUrl = "http://" + document.domain + socialFolder + "/" + socialIcon;
				
				var anchor = $("<a></a>");
				$(anchor).attr({ href : socialUrl });
				
				var img = $("<img/>");
				$(img).attr({ 'src' : socialIconUrl, 'border' : '0'}).css({'width' : '30','height' : 'auto'});
				
				$(anchor).append(img);
				$(span1).append(anchor);
			});
			
			var paragraph = $("<p></p>");
			var copyLine = $(xml).find('copyright').text();
			
			$(paragraph).html(copyLine).addClass("copyline");
			$(span1).append(paragraph);
			
			$(sectionDiv).append(span1);
			
			$("#footer").append(sectionDiv);
			$('p#about.text').append(clearLinebreak);
		}
	});
	
	var sectionTitle, sectionId, sectionText;
	var jobCompany, jobRoleCity, jobRoleName, jobRoleDuration, jobRoleSummary, jobRoleListItem;
	var collegeName, collegeCity;
	var typeName;
	var promoName, promoDuration, promoSummary;
	
	$.ajax({ // Output Resume
		type: "GET",
		url: "data/resume.xml",
		dataType: "xml",
		success: function(xml) {
			$(xml).find('section').each(function(){
				linebreak = $("<br/>");
				clearLinebreak = $("<br/>");
				$(clearLinebreak).attr({ 'clear' : 'all' });
				
				if ($(this).attr('display') == 'true') {
					sectionTitle = $(this).find('title').text();
					
					if ($(this).find('title')) {
						span = $("<span></span>");
						
						sectionId = sectionTitle.toLowerCase();
						sectionId = sectionId.replace(' ', '');
						
						sectionDiv = $("<div></div>");
						$(sectionDiv).attr({ id : sectionId });
						
						$(span).addClass("resume_section_title").text(sectionTitle);
						
						if ($(this).find('text')) {
							sectionText = $(this).find('text').text();
						} else {
							sectionText = "";
						}
						
						//Append <span> to section <div>
						$(sectionDiv).append(span);
						//Append other elements to <div>
						$(sectionDiv).append(linebreak);
						$(sectionDiv).append(sectionText);
						
						switch (sectionId) {
							case 'summary' :
								break;
								
							case 'professionalexperience' :
								$(this).find('job').each(function(){
									var span1 = $("<span></span>");
									var span2 = $("<span></span>");
									
									var jobCompany = $(this).find('company').text();
									var jobCity = $(this).find('city').text();
									
									$(span1).append(jobCompany).addClass('resume_job_company');
									$(span2).append(jobCity).addClass('resume_job_city');
									$(sectionDiv).append(span1);
									$(sectionDiv).append(span2);
									
									$(this).find('role').each(function(){
										var span3 = $("<span></span>");
										var span4 = $("<span></span>");
										var span5 = $("<span></span>");
										
										var jobRoleDuration = $(this).find('duration').text();
										var jobRoleName = $(this).find('name').text();
										var jobRoleSummary = $(this).find('summary').text();
										
										$(span3).append(jobRoleName).addClass('resume_job_role_name');
										$(span4).append(jobRoleDuration).addClass('resume_job_role_duration');
										$(span5).append(jobRoleSummary).addClass('resume_job_role_summary');
										$(sectionDiv).append(span3);
										$(sectionDiv).append(span4);
										$(sectionDiv).append(span5);
										
										var ul = $("<ul></ul>");
										
										$(this).find('item').each(function(){
											var li = $("<li></li>");
											
											jobRoleListItem = $(this).text();
											
											if (jobRoleListItem) {
												$(li).append(jobRoleListItem).addClass('resume_job_role_list_item');
												$(ul).append(li);
											}
										});

										$(sectionDiv).append(ul);
									});
								});
								break;
								
							case 'education' :
								$(this).find('college').each(function(){
									var span1 = $("<span></span>");
									var span2 = $("<span></span>");
									
									collegeName = $(this).find('name').text();
									collegeCity = $(this).find('city').text();
									
									$(span1).append(collegeName).addClass('resume_college_name');
									$(span2).append(collegeCity).addClass('resume_college_city');
									$(sectionDiv).append(span1);
									$(sectionDiv).append(span2);
									
									$(this).find('degree').each(function(){
										var span3 = $("<span></span>");
										var span4 = $("<span></span>");
										var span5 = $("<span></span>");
									
										var collegeDegreeType = $(this).find('type').text();
										var collegeDegreeFocus = $(this).find('focus').text();
										var collegeDegreeYear = $(this).find('year').text();
										
										$(span3).append(collegeDegreeType).addClass('resume_college_degree_type');
										$(span4).append(collegeDegreeYear).addClass('resume_college_degree_year');
										$(span5).append(collegeDegreeFocus).addClass('resume_college_degree_focus');
										
										$(sectionDiv).append(span3);
										$(sectionDiv).append(span4);
										$(sectionDiv).append(span5);
									});
								});
								break;
								
							case 'skills' :
								$(this).find('type').each(function(){
									var span1 = $("<span></span>");
									typeName = $(this).find('name').text();
									
									$(span1).append(typeName).addClass('resume_skill_type_name');
									$(sectionDiv).append(span1).addClass('skill_columns');
									
									$(this).find('skill').each(function(i){
										var span = [];
										span[i] = $("<span></span>");
										typeName = $(this).text();
									
										$(span[i]).append(typeName).addClass('resume_skill');
										$(sectionDiv).append(span[i]);
									});
								});
								break;
								
							case 'promotions' :
								$(this).find('job').each(function(){
									var span1 = $("<span></span>");
									var span2 = $("<span></span>");
									var span3 = $("<span></span>");
									
									promoName = $(this).find('name').text();
									promoDuration = $(this).find('duration').text();
									promoSummary = $(this).find('summary').text();
									
									$(span1).append(promoName).addClass('resume_promotion_name');
									$(span2).append(promoDuration).addClass('resume_promotion_duration');
									$(span3).append(promoSummary).addClass('resume_promotion_summary');
									$(sectionDiv).append(span1);
									$(sectionDiv).append(span2);
									$(sectionDiv).append(span3);
								});
								break;
							
							case 'resume' :
								var linkName = $(this).find('name').text();
								var linkURL = $(this).find('url').text();
								
								var anchor = $("<a></a>");
								$(anchor).html(linkName).attr({ 'href' : linkURL }).css({ 'font-size' : '14px', 'text-decoration' : 'none' });
								
								$(sectionDiv).append(anchor);
								break;
								
							default:
								break;
						}
					}

					//Keep this last. Must append <div> to section after everything is inside <div>
					$('p#resume.text').append(sectionDiv);
					$('p#resume.text').append(clearLinebreak);
				}
			});
		}
	});
	
	//Only display INFO on page load
	$("li[name=about]").addClass('navOn');
	$("p#about.text").show();
	$("p#portfolio.text, p#resume.text").hide();
		
	$("li[name=about]").click(function(){
		$(this).removeClass('navOff').addClass('navOn');
		$("li[name=portfolio]").removeClass('navOn');
		$("li[name=resume]").removeClass('navOn');
		$("p#about.text").show();
		$("p#portfolio.text, p#resume.text").hide();
		Scroll('scrollbox',1,1);
	});
	$("li[name=portfolio]").click(function(){
		$(this).removeClass('navOff').addClass('navOn');
		$("li[name=about]").removeClass('navOn');
		$("li[name=resume]").removeClass('navOn');
		$("p#portfolio.text").show();
		$("p#about.text, p#resume.text").hide();
		Scroll('scrollbox',1,1);
	});
	$("li[name=resume]").click(function(){
		$(this).removeClass('navOff').addClass('navOn');
		$("li[name=about]").removeClass('navOn');
		$("li[name=portfolio]").removeClass('navOn');
		$("p#resume.text").show();
		$("p#about.text, p#portfolio.text").hide();
		Scroll('scrollbox',1,1);
	});
	
	$(document).keydown(function(e){
		if (e.keyCode == 38) { // Up Key
			Scroll('scrollbox',-3);
			clearTimeout(zxcTO);
			return false;
		} else if (e.keyCode == 40) { // Down Key
			Scroll('scrollbox',3);
			clearTimeout(zxcTO);
			return false;
		}
	});

	$("#scrollBtn_up")
		.mouseover(function() { Scroll('scrollbox',-3); })
		.mouseout(function() { clearTimeout(zxcTO); });
		
	$("#scrollBtn_down")
		.mouseover(function() { Scroll('scrollbox',3); })
		.mouseout(function() { clearTimeout(zxcTO); });
});
