/**
 * 
 * 注入当前页面的js脚本；
 * 
 */

////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////

	var _cc = function(){
		var args = Array.prototype.slice.call(arguments,0);
		console.log.apply(console, args)
	}
	
	
	// 接收content script发过来的消息
	chrome.extension.onRequest.addListener( function(request, sender, sendResponse) { 
		
		_cc('收到background.js发来的消息', request, sender);
		call();
		
	});	




////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////

function call(){
	
	var result = [];

	var list = $('#info tr');
	
	list.each(function(i){
		
		var red = [];
		
		var row = $(this);
		var cells = row.find('td'); 
		var num = cells.eq(1).text() * 1;
		
		cells.filter('.z_font_red').each(function(i){
			red.push( $(this).text() * 1 );
		});
		
		
		var blue = cells.filter('.z_font_ls').text() * 1;
		
		var dobj = {num: num, red: red, blue: blue};
		
		result.push(dobj);
		
	});
	
	
	
	_cc(result);
	
	
	$.ajax({
		type:'post',
		url: 'http://localhost/tool/ng.php',
		data: JSON.stringify(result)
	}).done(function(){
		_cc('It\'s ok!');
	});
	
	
}












