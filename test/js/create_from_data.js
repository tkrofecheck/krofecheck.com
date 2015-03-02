(function() {
  var myPage = {
    data_about: null,
    data_portfolio: null,
    data_resume: null,
    visible: function() {
      $.fn.offScreen = function(distance) {
        var $t            = $(this),
            $w            = $(window),
            viewTop       = $w.scrollTop(),
            viewBottom    = viewTop + $w.height(),
            _top          = $t.offset().top - distance,
            _bottom       = $t.offset().top + $t.height() + distance;
         
        return {
          top: _bottom <= viewTop,
          bottom: _top >= viewBottom
        };
      };
          
      var win = $(window);
      var allMods = $(".module");

      allMods.each(function(i, el) {
        var el = $(el);
        if (!el.offScreen(150).bottom) { el.addClass("already-visible"); } 
      });

      win.on("scroll resize",function(event) {
        allMods.each(function(i, el) {
          var el = $(el);
          if (!el.offScreen(150).top && !el.offScreen(150).bottom) 
          {
            el.removeClass("already-visible off-screen-top off-screen-bottom"); 
            el.addClass("come-in"); 
          } 
          else
          {
            if(el.offScreen(150).top) { el.addClass("off-screen-top"); }
            else { el.addClass("off-screen-bottom"); }
          }
        }); //allMods.each()
        
      }); //win.scroll()

      win.trigger("scroll");
    },
    get_data: function() {
      var scope = this;
      $.when(
        $.get("data/about.json", function(data) { scope.data_about = (typeof data == "string") ? JSON.parse(data) : data; }),
        $.get("data/portfolio.json", function(data) { scope.data_portfolio = (typeof data == "string") ? JSON.parse(data) : data; }),
        $.get("data/resume.json", function(data) { scope.data_resume = (typeof data == "string") ? JSON.parse(data) : data; })
      ).then(function() {
        $.when(
          set_aboutDataToDOMelem(scope.data_about),
          set_portfolioDataToDOMelem(scope.data_portfolio),
          set_resumeDataToDOMelem(scope.data_resume)
        ).then(function() {
          scope.visible();
        });
      });
    },
    start: function() {
      this.get_data();
    }
  };
  
  myPage.start();
})();

function set_aboutDataToDOMelem(data) {
  var id = "#about", div, html;
  
  div = $("<div></div>");
  div.addClass("module");
  div.addClass("biography");
  html = "";
  $.each(data.paragraphs, function(i, el) {
    var para = data.paragraphs[i];
    html = html.concat(
      "<div class='name'>" + para.name + "</div>",
      "<div class='text'>" + para.text + "</div>"
    );
  });
  div.html(html);
  $(id + " section").append(div);
}

function set_portfolioDataToDOMelem(data) {
  var id = "#portfolio", div;
  
  $.each(data.projects, function(i, el) {
    var proj = data.projects[i],
        folder = proj.folder,
        steps = proj.steps;

    if (proj.display == "true") {
      div = $("<div></div>");
      div.html(proj.name);
      div.addClass("project");
      $(id + " section").append(div);
      
      $.each(steps, function(j, el) {
        div = $("<div></div>");
        div.addClass("module");
        div.addClass("project-image");
        div.css("background-image", "url(portfolio/" + folder + "/" + steps[j].image + ")");
        $(id + " section").append(div);
      });
    }
  });
}

function set_resumeDataToDOMelem(data) {
  var id = "#resume", div;
  
  $.each(data.sections, function(i, el) {
    var sect = data.sections[i];
    if (sect.display == "true") {
      div = $("<div></div>");
      div.addClass("module");
      div.html(sect.name);
      $(id + " section").append(div);
    }
  });
}