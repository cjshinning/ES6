function fn1() {
	console.log("this is 1")
}

function fn2() {
	console.log("this is 2")
}

fn1();
fn2();

var fn1 = () => {
	console.log("this is 1")
}

var fn2 = () => {
	console.log("this is 2")
}

fn1();
fn2();

var fn1 = () => {
	setTimeout( () => {
		console.log("this is 1")
	},2000)
}

var fn2 = () => {
	console.log("this is 2")
}


fn1();
fn2();

var fn1 = (fn) => {
	setTimeout( () => {
		console.log("this is 1");
		fn()
	},2000)
}

fn1(fn2)


let order = () => {
	return new Promise((resolve,reject) => {
		setTimeout( () => {
			resolve("order1");
			console.log("order2");
		},5000)
	})
}
order().then( (data) => {
	console.log(data);
})




// 每天下单 - 拿外卖 - 去饭堂 - 吃饭
let order = () => {
	return new Promise(resolve => {
		setTimeout( () => {
			resolve("order");
			// console.log("order");
		},5000)
	})
}

let pick = () => {
	return new Promise( (resolve, reject) => {
		setTimeout( () => {
			resolve("pick");
			// console.log("pick");
		},2000)
	})
}

let canteen = () => {
	return new Promise( (resolve, reject) => {
		setTimeout( () => {
			resolve("canteen");
			// console.log("canteen");
		},1000)
	})
}

order().then( data => {
	console.log(data);
	return pick();
}).then( data => {
	console.log(data);
	return canteen();
}).then( data => {
	console.log(data);
	console.log("开饭")
})

Promise.all([order(),pick(),canteen()]).then(val =>{
	console.log(val);
	console.log("开饭啦～")
})



// 突破口
// 创建promise对象
// 有then
order().then(data => {
	console.log(data);
}) 
 promise then resolve


// 第一步 实现普罗米斯的一个 初步构建

let order = function() {
	return new myPromise();
}

function myPromise(){
	this.then = () => {
		console.log("then method start")
	}
}

order().then();



// 第二步 实现普罗米斯的一个流程 添加方法参数 resolve成功（返回下一步）
let order = () => {
	console.log("开始");
	return new myPromise((resolve, reject) => { // resolve-成功，reject--失败 
		setTimeout(()=>{
			resolve("order");
		},1000)
	})
}

order().then(data => {
	console.log(data);
	console.log("结束");
});

function myPromise(fn){
	let callback = null;
	this.then = (cb) => {
		//console.log("then method start");
		callback = cb;
	}

	function resolve(val) {
		callback(val);
	}

	fn(resolve);
}


// 第三步 加入链式 支持多个then
let order = function() {
	return new myPromise((resolve, reject) => { // resolve-成功，reject--失败 
		setTimeout(() => {
			resolve("order");
		},1000)
	})
}

let pickup = function() {
	return new myPromise((resolve, reject) => { // resolve-成功，reject--失败 
		setTimeout(() => {
			resolve("pickup");
		},1000)
	})
}

order().then(data => {
	console.log(data);
	return pickup()
}).then(data => {
	console.log(data);
})

function myPromise(fn){
	let self = this;//保证this指向没有问题
	self._resolve = []; //把所有的队列存放在里面 保存then的回调 

	let callback = null;
	this.then = (cb) => {
		//console.log("then method start");
		self._resolve.push(cb);
		return self; // 加入链式 return 指向myPromise jq思想
	}

	function resolve(val) {
		self._resolve.forEach(callback => {
			callback(val);
		})
		
	}

	fn(resolve);
}



