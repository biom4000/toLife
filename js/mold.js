$(document).ready(function(){
    $(".login").click(function () {
        $(".login_page").fadeIn('fast',function () {
            $(".login_page").show();
        });
    });
    $(".login_close").click(function () {
        $(".login_page").fadeOut('fast',function () {
            $(".login_page").hide();
        });
    });
    $(".menu").click(function () {
        if($("nav").hasClass("open_menu")){
            $("nav").animate({width:'show'},"slow");
            $(".gallery").animate({width:'86%'},"slow");
            $("nav").removeClass("open_menu");
        }
        else{
            $("nav").animate({width:'hide'},"slow");
            $(".gallery").animate({width:'100%'},"slow");
            $("nav").addClass("open_menu");
        }
    });
});