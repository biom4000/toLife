$(document).ready(function(){
    $(".login").click(function () {
        $(".login_page").fadeIn('slow',function () {
            $(".login_page").show();
        });
    });
    $(".login_close").click(function () {
        $(".login_page").fadeOut('slow',function () {
            $(".login_page").hidden();
        });
    });
});