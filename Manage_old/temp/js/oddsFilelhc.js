var url = "/Manage/temp/ajax/oddsFilelhc.php";
var interval, Phases, _endtime, p=0, z=true;
$(function(){
	actions();
	_loadInfo();
});

function actions(){
	$.post(url, {mid : 3}, function(data){
									
		p=parseInt(data);
		loadInfos();
		loadInfo();
		loadOdds();
	}, "text");
}
/**
 * 開出號碼須加載
 */
function _loadInfo(){
	$.post(url, {mid : "kaijiang"}, function(data){
		_Number (data.number, data.ballArr); //開獎號碼
	}, "json");
}
function _Number (number, ballArr) {
	var Clss = null;
	var idArr = ["#q_a","#q_b","#q_c","#q_d","#q_e","#q_f","#q_g"];
	$("#q_number").html(number);
	var r = red.split(',');
	var g = green.split(',');
	var b = blue.split(',');
	for (var i = 0; i<ballArr.length; i++) {
		if(in_array(ballArr[i],r)){
			Clss='ball_red_normal';
		}else if(in_array(ballArr[i],g)){
			Clss='ball_green_normal';
		}else{
			Clss='ball_blue_normal';
		}
		 
		$(idArr[i]).removeClass().addClass(Clss);
		$(idArr[i]).html( ballArr[i] );
	}
}

function loadInfo(){
	$.post(url, {mid : 1}, function(data){
		Phases = parseInt(data.timeList.Phases);
		$("#number").html(Phases);
		endTimes(data.timeList);
		isNumber(Phases);
		showResult(data.infolhc);
	}, "json");
}

function loadInfos(){
	$.post(url, {mid : 4}, function(data){
		$("#win").html(data.dayWin);
		if (data.result != ""){
			var rowHtml = new Array();
			for (var key in data.result){
				rowHtml.push("<tr bgcolor=\"#fff\" height=\"18\"><td  class=\"uo\">"+key+"</td><td class=\"fe\">"+data.result[key]+" 期</td></tr>");
			}
			var cHtml = '<tr class="tr_top"><th colspan="2">兩面長龍排行</th></tr>';
			$("#cl").html(cHtml+rowHtml.join(""));
		}
	}, "json");
}

function loadOdds(){
	$.post(url, {mid : 2}, function(data){
		var a = ["a","b","c","d","e","f","g","h", "i", "j", "k","l","m","n","o"];
		for (var i=0; i<data.oddsList.length; i++){
			for (var n in data.oddsList[i]){
				$("#"+a[i]+n).html(data.oddsList[i][n]);
			}
		}
	}, "json");
}

function showResult(rows)
{
	if (rows != null){ 
		 
		for (var i in rows){ 
			for (var n in rows[i]){
				for (var m in rows[i][n]){
					var classId = n+m; 
					var a =$(".odds."+i+". a."+classId);
					 
					if (n == "b"){
						a.attr("href", "javascript:GoPos(this, '"+i+"', 'a"+m+"')");
					}else if (n == "a"){
						a.attr("id", i+"_"+classId);
					}
					a.html(Math.round(rows[i][n][m]));
				}
			}
		}
	} else {
		$("table .t_odds td a").html("-");
	}
}

function isNumber(phases){
	var a = phases - p;
	if (a == 2 || a == 882){
		var intervals = setInterval(function(){
			$.post(url, {mid : 3}, function(data){
				a = phases - parseInt(data);
				if (a == 1 || a == 881){
					clearInterval(intervals);
					actions();
				}
			}, "text");
		}, 2000);
	}
}

function endTimes(timeList){
	_endtime = timeList.endTime;
	var _starttime = timeList.openTime, a;
	var endtime = $("#EndTime");
	var estateTime = $("#EstateTime");
	var RefreshTime = $("#RefreshTime");
	var p = parseInt(estateTime.val());
	a = setTime (ac(_starttime, _endtime));
	endtime.html(a[0] + ":" + a[1]);
	RefreshTime.html(p);
	if (interval != undefined)
		clearInterval(interval);
	interval = setInterval(function(){
		_endtime--;  _starttime--; p--;
		if (p <= 0){
			RefreshTime.html("加載中...");
			clearInterval(interval);
			loadInfo();
			loadOdds();
		}
		a = setTime (ac(_starttime, _endtime));
		endtime.html(a[0] + ":" + a[1]);
		RefreshTime.html(p);
	}, 1000);
}

function ac(starttime, endtime){
	var s =0, offTime = $("#offTime");
	var n = Phases.toString().substring(9,11);
	if (starttime <= 0 && parseInt(n) == 23){
		location.href = "offGame.php";
		return false;
	}
	if (starttime <= 0){
		cHtml (1);
		loadInfo();
		loadOdds();
	}else if (endtime <= 0){
		cHtml (2);
		s = starttime;
	} else{
		s = endtime;
	}
	return s;
}

function cHtml (sint){
	var offTime = $("#offTime");
	if (sint == 1){
		z = true;
		$("td.odds").css("background", "#fff");
		offTime.html("距封盤").css("color","#333");
	} else if (sint == 2 && z == true) {
		z = false;
		$("td.odds").css("background", "#eee");
		offTime.html("距開獎").css("color","red");
	}
}

function setTime (times){
	var MinutesRound = Math.floor(times / 60);
	var SecondsRound = Math.round(times - (60 * MinutesRound));
	var TimeArr = new Array();
	var Minutes = MinutesRound.toString().length <= 1 ? "0"+MinutesRound : MinutesRound;
	var Seconds = SecondsRound.toString().length <= 1 ? "0"+SecondsRound : SecondsRound;
	TimeArr[0] = Minutes;
	TimeArr[1] = Seconds;
	return TimeArr;
}

var n;
function GoPos($this, s, sint){
	var sid = $("#"+s+"_"+sint);
	n = parseInt(sid.html());
	var _s = s == "w" ? "h" : s;
	if (_endtime < 1 || n < 10) return;
	var odds = $("#"+_s+sint.substring(2, sint.length)).html();
	var ball = isString(sint.substring(1, sint.length));
	var typeid = isString(s);
	var offsetTop = sid.offset().top;
	var offsetLeft = sid.offset().left;
	$("#typeid").val(typeid);
	$("#type_s").html(ball);
	$("#odds_s").html(odds);
	$("#money_s").html(n);
	$("#oddsPop").fadeIn(100).css({top : offsetTop + 10, left : offsetLeft -70});
}

function GoPost(){
	var s_money = $("#s_money").val();
	if (s_money == "" || !/^[0-9]*$/.test(s_money)){
		alert("輸入補倉金額錯誤！");
		return;
	}
	if (parseInt(s_money) < 10){
		alert("補倉金額最小為："+10);
		return;
	}
	if (parseInt(s_money) > n){
		alert("補倉金額最大為："+n);
		return;
	}
	if (confirm("確定碼？")){
		var s_type = $("#typeid").val();
		var s_ball = $("#type_s").html();
		var s_money = $("#s_money").html();
		PostForm({
			s_number : $("#number").html(),
			s_type : $("#typeid").val(),
			s_ball : $("#type_s").html(),
			s_odds : $("#odds_s").html(),
			s_money : $("#s_money").val()
		});
	}
}

function PostForm(args){
	$.post("/Manage/temp/ajax/json.php", {
			typeid : 6, 
			s_number : args.s_number,
			s_type : args.s_type,
			s_num : args.s_ball,
			s_odds : args.s_odds,
			s_money : args.s_money,
			cid : 1,
			nid : 1
		 }, function(data){
		 	if (data.error == ""){
		 		closePop(2);
		 		loadInfo();
		 		var list = new Array();
		 		var dataList = data.ResultList;
				for (var i=0; i<dataList.length; i++){
					list.push('<tr class="text" align="right">');
					list.push('<td align="center">'+dataList[i].g_id+'#</td>');
					list.push('<td align="center">'+dataList[i].g_mingxi_1+' @ '+dataList[i].g_odds+'</td>');
					list.push('<td class="rights">'+dataList[i].g_jiner+'</td>');
					var ts = ((100-dataList[i].g_tueishui)/100) * dataList[i].g_jiner;
					var win = (dataList[i].g_jiner*dataList[i].g_odds - dataList[i].g_jiner)+ts;
					list.push('<td class="rights">'+win.toFixed(3)+'</td>');
					list.push('<td align="center">成功補出</td>');
					list.push('</tr>');
				}
				list.push('<tr class="texts" align="center">');
				list.push('<td colspan="5"><input type="button" class="inputa" onclick="closePop(1)" value="關閉" /></td>');
				list.push('</tr>');
				$("#vList").html(list.join(''));
				$("#kOddsPop").fadeIn(100).css("display" , "block");
		 	} else {
		 		alert(data.error);
		 		return false;
		 	}
	}, "json");
}

function closePop(s){
	if (s == 2){
		$("#oddsPop").fadeOut(100);
		$("#s_money").val("");
	} else {
		$("#kOddsPop").fadeOut(100);
	}
}

function isString(value){
	switch(value){ 
		case "a" : return "正碼一";
		case "b" : return "正碼二";
		case "c" : return "正碼三";
		case "d" : return "正碼四";
		case "e" : return "正碼五";
		case "f" : return "正碼六";
		case "g" : return "特碼";
		case "h" : return "正碼";
		case "i" : return "半波";
		case "j" : return "五行";
		case "k" : return "特碼生肖";
		case "l" : return "一肖";
		case "m" : return "特尾";
		case "n" : return "尾數";
		case "o" : return "特碼頭";
	}
}




function in_array($key,$arr){
	for(var i=0;i<$arr.length;i++){
		if($arr[i]==$key)return true;
	}	
}
 