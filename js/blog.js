$(function(){
    var len = 250; // 超過50個字以"..."取代
    $(".text_area").each(function(i){
        if($(this).text().length>len){
            $(this).attr("title",$(this).text());
            var text=$(this).text().substring(0,len-1)+"...";
            $(this).text(text);
        }
    });
    appendText();
});

function appendText()
{
    var txt1="<img src='blog_date/poto/Hydrangeas.jpg'>";               // 以 HTML 创建新元素
    $("#blog_image2").append(txt1);         // 追加新元素
    $("#blog_image2").css({width: "100%",height: "100%"});
}