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
    var txt1="<img id='image1' style='height: 100%; width: 100%;' src='blog_date/poto/1.png' alt='miss' />";               // 以 HTML 创建新元素
    $("#blog_image1").append(txt1);         // 追加新元素
    var txt2="<img id='image2' style='height: 100%; width: 100%;' src='blog_date/poto/2.png' alt='miss' />";               // 以 HTML 创建新元素
    $("#blog_image2").append(txt2);         // 追加新元素
    var txt3="<img id='image3' style='height: 100%; width: 100%;' src='blog_date/poto/3.png' alt='miss' />";               // 以 HTML 创建新元素
    $("#blog_image3").append(txt3);         // 追加新元素
}