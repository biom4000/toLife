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
            $("nav").slideLeftShow(500);
            $("nav").removeClass("open_menu");
            $(".gallery").css("width","86%");
        }
        else{
            $("nav").slideLeftHide(500);
            $("nav").addClass("open_menu");
            $(".gallery").css("width","100%");
        }

    });
});

jQuery.fn.slideLeftHide = function( speed, callback ) {
    this.animate({
        width : "hide",
        paddingLeft : "hide",
        paddingRight : "hide",
        marginLeft : "hide",
        marginRight : "hide"
    }, speed, callback );
};
jQuery.fn.slideLeftShow = function( speed, callback ) {
    this.animate({
        width : "show",
        paddingLeft : "show",
        paddingRight : "show",
        marginLeft : "show",
        marginRight : "show"
    }, speed, callback );
};