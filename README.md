##Geth

console report tool

---

Start your **geth** console

```
geth -rpc console 2> geth.log
```

once the console is up an running, copy past the below code

```
var report = (function(){

	var hex = eth.coinbase;
	var wait = 1000;
	var interval = {};

	function address(hex)
	{
		hex = hex;
	}

	function start()
	{
		miner.start();
		console.log("\033c\x1b[32mstarting report: \x1b[0m*please wait for initial response*");
		interval = setInterval(function(){
			var d = "date:\t\t" + new Date();
			var w = "wallet:\t\t" + eth.coinbase;
			var h = "hashrate:\t\x1b[32m" + parseFloat((miner.hashrate/1000)/1000).toFixed(3) + " mhs";
			var b = "ether:\t\t\x1b[32m" + web3.fromWei(eth.getBalance(eth.coinbase), "ether") + " Ξ";
			var di = "difficulty:\t" + eth.getBlock("latest").difficulty;
			var m = "mined:\t\t\x1b[32m";
			var s = false;
			for(var n = eth.blockNumber; n >= (eth.blockNumber-100); n--){if(eth.getBlock(n).miner == eth.coinbase){m += " " + n;s = true;}};
			if(!s){m += "\x1b[31mno block mined"};
			var message = "\x1b[0m" + [d,w,h,b,di,m].join(" \x1b[0m\n");
			console.log("\033c" + message + "\x1b[0m");
		}, wait);
	}

	function stop()
	{
		console.log("\033c\x1b[31mstopping report\x1b[0m");
		clearInterval(interval);
	}

	return {
		address:function(hex){address(hex)},
		start:function(){start()},
		stop:function(){stop()}
	}
})();
```

###start the reporting

```
report.start()
```
***you'll see this***

![example](report.png)

###stop the reporting

```
report.stop()
```

---

###donations appreciated

* **eth**: 0x30bb4357cd6910c86d2238bf727cbe8156680e62
* **btc**: 1NaVpK1qjx2ZT2e4xLDiiDjHiguR7DM8j2

 
