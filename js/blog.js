$(function(){
    var len = 300; // 超過50個字以"..."取代
    $(".text_area").each(function(i){
        if($(this).text().length>len){
            $(this).attr("title",$(this).text());
            var text=$(this).text().substring(0,len-1)+"...";
            $(this).text(text);
        }
    });
});