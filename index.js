"use strict";
var ofs = require("fs"), desc = {};

var slice = Array.prototype.slice;
Object.keys(ofs).forEach(function(name){
	if(typeof ofs[name] === "function" && /Sync$/.test(name)){
		var tname = name.substr(0, name.length - 4);
		var tar = ofs[tname];
		if(typeof tar === "function"){
			desc[tname] = {
				value: function(){
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
				}
			};
		}
	}
});

module.exports = Object.create(ofs, desc);