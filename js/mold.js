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
            $("nav").animate({width:'show'},"fast");
            $(".gallery").animate({width:'86%'},"fast");
            $("nav").removeClass("open_menu");
        }
        else{
            $("nav").animate({width:'hide'},"fast");
            $(".gallery").animate({width:'100%'},"fast");
            $("nav").addClass("open_menu");
        }
    });
});