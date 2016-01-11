var report = (function(){
	var graph = {
		rows:15,
		cols:50,
		vals:[],
		chars:["⠀", "⣀", "⣤", "⣶", "⣿"]
	};

	for(var n = 0; n < graph.cols; n++){graph.vals.push(0);};

	var colors = {
		black:"30",
		red:"31",
		green:"32",
		yellow:"33",
		blue:"34",
		magenta:"35",
		cyan:"36",
		white:"37"
	};

	var color = "\x1b[";

	var modifier = {
		normal:"m",
		bold:";1m",
		fill:";3m",
		underline:";4m",
	};

	var reset = color + "0" + modifier.normal;
	var clear = "\033c";

	var wait = 1000;
	var interval = {};

	var wallet = eth.coinbase;
	var hashrate = 0;
	var date = new Date();
	function update()
	{
		!miner ? false : miner.start();
		date = new Date();
	};

	function mined()
	{

	}

	function draw()
	{
		graph.vals.shift();
		graph.vals.push(hashrate);
		var max = Math.max.apply(Math, graph.vals);
		var delta = (max/graph.rows);
		
		var vals = [];
		var zeros = [];
		for(var c = 0; c < graph.cols; c++)
		{
			var val = parseInt((graph.vals[c]/max)*100);
			var zero = graph.rows - parseInt((graph.vals[c]/max)*graph.rows);
			vals.push(val);
			zeros.push(zero);
		}

		var message = "";

		for(var c = 0; c < graph.rows; c++)
		{
			var cap = vals[c]%4%4;
			for(var r = 0; r < graph.cols; r++)
			{
				var fill = graph.chars[0];
				if(zeros[r] == c)
				{
					fill = graph.chars[cap];
				}
				if(zeros[r] < c)
				{
					fill = graph.chars[4];
				}
				message += fill;
			}
			message += "\n";
		}	
		console.log(message);
	}

	function stats()
	{
    var d = "date:\t\t" + new Date();
    var w = "wallet:\t\t" + eth.coinbase;
    var h = "hashrate:\t" + color + colors.green + modifier.bold + parseFloat((miner.hashrate/1000)/1000).toFixed(3) + " mhs";
    var b = "ether:\t\t" + color + colors.green + modifier.bold + web3.fromWei(eth.getBalance(eth.coinbase), "ether") + " Ξ";
    var di = "difficulty:\t" + eth.getBlock("latest").difficulty;
    var m = "mined:\t\t";
    var s = false;
    for(var n = eth.blockNumber; n >= (eth.blockNumber-10); n--){if(eth.getBlock(n).miner == eth.coinbase){m += " " + n;s = true;}};
    if(!s){m += color + colors.red + modifier.bold + "no block mined"};
    var message = reset + [d,w,h,b,di,m].join(" " + reset + "\n");
    console.log("\033c" + message + reset);	
	}

	function start()
	{
		miner.start();
		var message = clear;
		message += reset;
		message += color + colors.green + modifier.normal + "Starting Report\n";
		message += reset;
		message += "*please wait for initial response*";
		console.log(message);
		interval = setInterval(function(){
			console.log(reset);
			hashrate = parseFloat((miner.hashrate/1000)/1000).toFixed(3);
			stats();
			draw();
		}, wait);
	};

	function stop()
	{
		clearInterval(interval);
		var message = "";
		message += reset;
		message += color + colors.red + "Stopping Report\n";
		message += reset;
		message += "*please wait for shut down of reporting*";
		console.log(message);		
	};

	return {
		start:function(){start()},
		stop:function(){stop()}
	};

})();
