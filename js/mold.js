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
            if($(".gallery_nav_open").hasClass("lock_out")){
                $(".calendar_title").css("padding","0 5%");
            }
            else {
                $(".calendar_title").css("padding-left","18%");
            }
        }
        else{
            $("#map_search").animate({left:"45%"},"fast");
            $(".calendar_title").css("padding-left","22%");
            $("nav").animate({width:'hide'},"fast");
            $(".gallery").animate({width:'100%'},"fast");
            $("nav").addClass("open_menu");
            if($(".gallery_nav_lock").hasClass("lock_in")){
                $(".calendar_title").css("padding-left","22%");
            }
            else {
                $(".calendar_title").css("padding-left","10%");
            }
        }
    });

    $(".gallery_nav_lock").click(function () {
        $(".gallery_nav_lock").addClass("lock_in");
        $(".gallery_nav_open").removeClass("lock_out");
        $(".gallery_nav").animate({width:'hide'},"fast");
        $(".map_body").animate({width:'100%'},"fast");
        $(".gallery_nav_open").css("display","block");

        if($("nav").hasClass("open_menu")){
            $(".calendar_title").css("padding-left","22%");
        }
        else {
            $(".calendar_title").css("padding-left","18%");
        }
    });
    $(".gallery_nav_open").click(function () {
        $(".gallery_nav_open").addClass("lock_out");
        $(".gallery_nav_lock").removeClass("lock_in");
        $(".gallery_nav").animate({width:'show'},"fast");
        $(".map_body").animate({width:'100%'},"fast");
        $(".gallery_nav_open").css("display","none");


        if($("nav").hasClass("open_menu")){
            $(".calendar_title").css("padding-left","10%");
        }
        else {
            $(".calendar_title").css("padding","0 5%");
        }
    });
});