"use strict";
var fs = {
	__proto__: require("fs")
};

var slice = Array.prototype.slice;
Object.keys(fs.__proto__).forEach(function(name){
	if(typeof fs[name] === "function" && /Sync$/.test(name)){
		var tname = name.substr(0, name.length - 4);
		var tar = fs[tname];
		if(typeof tar === "function"){
			fs[tname] = function(){
				var args = slice.call(arguments);
				return new Promise(function(res, rej){
					args.push(function(err){
						if(err === null){
							res.apply(this, slice.call(arguments, 1));
						}
						else if(err instanceof Error){
							rej(err);
						}
						else{
							res.apply(this, slice.call(arguments));
						}
					});
					tar.apply(fs, args);
				});
			};
		}
	}
});

module.exports = fs;