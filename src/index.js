const express =require('express');
const app=express();
const metaphone=require('./metaphone');
const fs=require('fs');
const mysql=require('./mysql');
const ejs=require('ejs');
app.use(express.static('public'));
app.use(ignoreFavicon);
const connection=mysql.connection;
app.set('view engine','ejs')
app.listen(process.env.PORT||8080,()=>console.log('Server is Running'))
function ignoreFavicon(req, res, next) { if (req.originalUrl === '/favicon.ico') {res.status(204).json({nope: true});} else { next(); } }


var href={'latest':1,'popular':1,'comedy':1,'romance':1,'drama':1,'thriller':1,'horror':1,'action':1,'war':1,'crime':1,'adventure':1,'animation':1,'sport':1,
'sci-fi':1,'documentary':1,'history':1,'music':1,'family':1,'western':1,'mystery':1,'fantasy':1,}

app.get('/',async(req,res)=>{
	let sql="SELECT * FROM `movies` ORDER BY year DESC,id DESC LIMIT 16;SELECT * FROM `movies` ORDER BY visited & year DESC LIMIT 16;SELECT * FROM `movies` WHERE genre LIKE '%comedy%' ORDER BY visited & year DESC LIMIT 16;SELECT * FROM `movies` WHERE genre LIKE '%romance%' ORDER BY visited & year DESC LIMIT 16";
	connection.query(sql,(err,result)=>{
		if(err){
			return;
		}
		res.render('index',{
			latest:result[0],
			popular:result[1],
			comedy:result[2],
			romance:result[3],
		})
	})
})

app.get('/search',async(req,res)=>{
	var limit=16;

	if((req.query.content && !req.query.offset) || (!req.query.content && req.query.offset) || !req.query.q){
		return res.render('error',{error:'Page Not Found'});
	}
	if(!req.query.offset || !req.query.content){ return res.render('search',{q:req.query.q}); }
	else{
		sql="SELECT title,img,embeded,rating,year,genre FROM `movies` WHERE title LIKE '%"+req.query.q+"%'  LIMIT "+limit+" OFFSET "+req.query.offset;
		connection.query(sql,(err,result)=>{
			if (err) { return ;}
			var a=[];
			for(var i=0;i<result.length;i++){
				a+='<a href="/search?q='+result[i].title+'"><p class="search-res">'+result[i].title+'</p></a>';
			}
			if(req.query.content==='search'){
				if(result.length==0){res.send('');}
				else
					res.status(200).send(a);
			}
			else
				res.status(200).send(result);
		});
	}
})
app.get('/watch',async(req,res)=>{
	let vid=req.query.v;
	if(!vid) return res.send("NOT FOUND")
		let sql="SELECT COUNT(*) FROM `movies` WHERE embeded='"+vid+"'";
	connection.query(sql,(err,result)=>{
		if(err){ return; }
			else if(req.query.offset && result[0]['COUNT(*)']==0){
				return res.send('{}');
			}
			else if(result[0]['COUNT(*)']==0)
				return res.render('error',{error:'Video Unavailable'});
			else{
				connection.query("UPDATE `movies` SET visited=visited+1 WHERE embeded='"+vid+"'",function(err,result){
					if(err) throw err;
				});
				var offset=0;
				sql="SELECT * FROM `movies` WHERE embeded='"+vid+"';";
				connection.query(sql,function(err,result){
					if(err) throw err;
					if(req.query.offset){
						offset=parseInt(req.query.offset);
						if(isNaN(offset)){
							res.send({});
						}
					}
					sql="SELECT * FROM `movies` ORDER BY visited DESC LIMIT 15"+" OFFSET "+(result[0].id+offset);
					connection.query(sql,function(e,re){
						if(e) {};
						if(Number(parseInt(req.query.offset))){
							return res.send(re);
						}
						res.render('player',{video:result,playlist:re});
					})
				})
			}
		});
})
app.get('/:name',async(req,res,next)=>{
	var valid=undefined,sql=undefined;
	var cat=req.params.name, pval=req.query.page, pnum=parseInt(pval,10);
	if(href[cat]!=1 || !pval || isNaN(pnum)){
		return res.render('error',{error:'Page Not Found'});
	}
	if(pval!=pnum){ res.writeHead(301,{"Location":'http://'+req.headers['host']+"/"+cat+"?page="+pnum}); return res.end(); }
	var limit=16;
	if(cat==='latest') 
		sql="SELECT COUNT(*) FROM `movies`;SELECT * FROM `movies` ORDER BY year DESC,id DESC LIMIT "+limit+" OFFSET "+(limit*(pnum-1));
	else if(cat==='popular') 
		sql="SELECT COUNT(*) FROM `movies`;SELECT * FROM `movies` ORDER BY visited DESC LIMIT "+limit+" OFFSET "+(limit*(pnum-1));
	else 
		sql="SELECT COUNT(*) FROM `movies` WHERE genre LIKE '%"+cat+"%';SELECT * FROM `movies` WHERE genre LIKE '%"+cat+"%' ORDER BY visited DESC LIMIT "+limit+" OFFSET "+(limit*(pnum-1));
	var p=cat[0].toUpperCase()+cat.substr(1);
	connection.query(sql, function(err, result) {
		if(err) {}
			if(result=="")
				response.send("No data");
			else{
				var total=result[0][0]['COUNT(*)'];
				pval=Math.min(parseInt((total+15)/16),pval);
				res.render('main',{
					count:result[0],
					result:result[1],
					catagory:p,
					page:pval,

				})
			}
		});
})
app.get('*',(req,res)=>{
	return res.render('error',{error:'Page Not Found'});
})
