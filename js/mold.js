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
            $("#map_search").animate({left:"52%"},"fast");
            $("nav").animate({width:'show'},"fast");
            $(".gallery").animate({width:'86%'},"fast");
            $("nav").removeClass("open_menu");
        }
        else{
            $("#map_search").animate({left:"45%"},"fast");
            $("nav").animate({width:'hide'},"fast");
            $(".gallery").animate({width:'100%'},"fast");
            $("nav").addClass("open_menu");
        }
    });
    $("#favor_nav_lock").click(function () {
        $(".favor_nav").animate({width:'hide'},"fast");
        $(".map_body").animate({width:'100%'},"fast");
        $("#favor_nav_open").css("display","block");
    });
    $("#favor_nav_open").click(function () {
        $(".favor_nav").animate({width:'show'},"fast");
        $(".map_body").animate({width:'100%'},"fast");
        $("#favor_nav_open").css("display","none");
    });
});