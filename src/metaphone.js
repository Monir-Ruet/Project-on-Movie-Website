const metaphone =require('metaphone');

module.exports=function(key){
	return metaphone(key);
}