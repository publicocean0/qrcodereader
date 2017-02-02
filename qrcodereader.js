(function(){

 var isUrl = function(s)
{
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
}
	
	
	
	
var decode_url = function (s)
{
  var escaped = "";
  try{
    escaped = escape( s );
  }
  catch(e)
  {
    console.log(e);
    escaped = s;
  }
  var ret = "";
  try{
    ret = decodeURIComponent( escaped );
  }
  catch(e)
  {
    console.log(e);
    ret = escaped;
  }
  return ret;
}

var decode_utf8 = function ( s )
{
    if(isUrl(s))
        return decode_url(s);
    else
        return s;
}
function URShift( number,  bits)
{
    if (number >= 0)
        return number >> bits;
    else
        return (number >> bits) + (2 << ~bits);
}
var getPixel = function(imagedata,x,y,width,height){
    if (width < x) {
        throw "point error";
    }
    if (height < y) {
        throw "point error";
    }
    point = (x * 4) + (y * width * 4);
    p = (imagedata.data[point]*33 + imagedata.data[point + 1]*34 + imagedata.data[point + 2]*33)/100;
    return p;
}

var binarize = function(im,width,height,th){
    var ret = new Array(width*height);
    for (var y = 0; y < height; y++)
    {
        for (var x = 0; x < width; x++)
        {
            var gray = getPixel(im,x, y,width,height);
            
            ret[x+y*width] = gray<=th?true:false;
        }
    }
    return ret;
}

var grayscale = function(im,width,height){
    var ret = new Array(width*height);
    for (var y = 0; y < height; y++)
    {
        for (var x = 0; x < width; x++)
        {
            var gray = getPixel(im,x, y,width,height);
            
            ret[x+y*width] = gray;
        }
    }
    return ret;
}

var getMiddleBrightnessPerArea=function(image,width,height)
{
    var numSqrtArea = 4;
    var areaWidth = Math.floor(width / numSqrtArea);
    var areaHeight = Math.floor(height / numSqrtArea);
    var minmax = new Array(numSqrtArea);
    for (var i = 0; i < numSqrtArea; i++)
    {
        minmax[i] = new Array(numSqrtArea);
        for (var i2 = 0; i2 < numSqrtArea; i2++)
        {
            minmax[i][i2] = new Array(0,0);
        }
    }
    for (var ay = 0; ay < numSqrtArea; ay++)
    {
        for (var ax = 0; ax < numSqrtArea; ax++)
        {
            minmax[ax][ay][0] = 0xFF;
            for (var dy = 0; dy < areaHeight; dy++)
            {
                for (var dx = 0; dx < areaWidth; dx++)
                {
                    var target = image[areaWidth * ax + dx+(areaHeight * ay + dy)*width];
                    if (target < minmax[ax][ay][0])
                        minmax[ax][ay][0] = target;
                    if (target > minmax[ax][ay][1])
                        minmax[ax][ay][1] = target;
                }
            }
          
        }
    }
    var middle = new Array(numSqrtArea);
    for (var i3 = 0; i3 < numSqrtArea; i3++)
    {
        middle[i3] = new Array(numSqrtArea);
    }
    for (var ay = 0; ay < numSqrtArea; ay++)
    {
        for (var ax = 0; ax < numSqrtArea; ax++)
        {
            middle[ax][ay] = Math.floor((minmax[ax][ay][0] + minmax[ax][ay][1]) / 2);
          
        }
      
    }
  
    
    return middle;
}

var grayScaleToBitmap=function(grayScale,width,height)
{
    var middle = getMiddleBrightnessPerArea(grayScale,width,height);
    var sqrtNumArea = middle.length;
    var areaWidth = Math.floor(width / sqrtNumArea);
    var areaHeight = Math.floor(height / sqrtNumArea);
    var bitmap = new Array(height*width);
    
    for (var ay = 0; ay < sqrtNumArea; ay++)
    {
        for (var ax = 0; ax < sqrtNumArea; ax++)
        {
            for (var dy = 0; dy < areaHeight; dy++)
            {
                for (var dx = 0; dx < areaWidth; dx++)
                {
                    bitmap[areaWidth * ax + dx+ (areaHeight * ay + dy)*width] = (grayScale[areaWidth * ax + dx+ (areaHeight * ay + dy)*width] < middle[ax][ay])?true:false;
                }
            }
        }
    }
    return bitmap;
}
var debugInfo=function(ctx){
	var start;
	return function(){
		var phase=arguments[0];
		switch(phase){
		case 0:start= new Date().getTime();break;
		case 1: {
		var imagedata=arguments[1],width=arguments[2],height=arguments[3]
        for (var y = 0; y < height; y++)
        {
            for (var x = 0; x < width; x++)
            {
                var point = (x * 4) + (y * width * 4);
                imagedata.data[point] = image[x+y*width]?0:0;
                imagedata.data[point+1] = image[x+y*width]?0:0;
                imagedata.data[point+2] = image[x+y*width]?255:0;
            }
        }
        ctx.putImageData(imagedata, 0, 0);
    } break;
      case 2: ctx.putImageData(arguments[1], 0, 0);break;
	  case 3 :console.log('QRCode elapsed time ', new Date().getTime() - start);break;	
	}
	
   };
	
}


// #include "grid.js"
// #include "version.js"
// #include "detector.js"
// #include "formatinf.js"
// #include "errorlevel.js"
// #include "bitmat.js"
// #include "datablock.js"
// #include "bmparser.js"
// #include "datamask.js"
// #include "rsdecoder.js"
// #include "gf256poly.js"
// #include "gf256.js"
// #include "decoder.js"
// #include "findpat.js"
// #include "alignpat.js"
// #include "databr.js"
	
/*
 * canvasCloning
 * debug
 * maxImgSize
 * 
 * */
window.QRCodeReader =function(e,options){
 var ERROR_2="QRCODE_DECODING";
 var ERROR_1="IMAGE_READING";
 if (!options) options={};


 var render=null;

 var maxImgSize = options.maxImgSize||1024*1024;
 var scanner=null;
 var type=(function(){ var t=e.nodeName.toLowerCase();if (t=='canvas') return 1; else if(t=='img' || t instanceof Image) return 2; else if(t=='video') return 3; else throw "invalid argument"; })();

 var processImageVideo=function(image,success,error){
            var canvas_qr = document.createElement('canvas');
            var context = canvas_qr.getContext('2d');
            var nheight = image.height;
            image.crossOrigin = "Anonymous";
            var nwidth = image.width;
            if(image.width*image.height>maxImgSize)
            {
                var ir = image.width / image.height;
                nheight = Math.sqrt(maxImgSize/ir);
                nwidth=ir*nheight;
            }

            canvas_qr.width = nwidth;
            canvas_qr.height = nheight;
            
            context.drawImage(image, 0, 0, canvas_qr.width, canvas_qr.height );
            var width = canvas_qr.width;
            var height = canvas_qr.height;
            var imagedata;
            try{
                imagedata = context.getImageData(0, 0, canvas_qr.width, canvas_qr.height);
            } catch(e) {
				error(ERROR_1);
				 console.log(e);
				 canvas_qr.remove();
				return;
		    }
		    try{
                var result = process(imagedata,width,height,options.debug?debugInfo(context):null);
                success(result);
                canvas_qr.remove();
            }
            catch(e)
            {
                error(ERROR_2);
                 console.log(e);
                 canvas_qr.remove();
            }
         
 }
 
  var processCanvas=function(canvas_qr,success,error){
          
        var context = canvas_qr.getContext('2d');
        var width = canvas_qr.width;
        var height = canvas_qr.height;
        var imagedata = context.getImageData(0, 0, width, height);
        try {
        var result = process(imagedata,width,height,options.debug?debugInfo(context):null);
        success(result);
	    }catch(e) {
                error(ERROR_2);
                console.log(e);
         }
      
         
 }
 
   var  ScannerRender=function(canvas){
	    var ctx = canvas.getContext('2d');
        var scanning=false;
        var H=1,step=2;
        var down=true,y=0;
        var renderer=window.requestAnimationFrame||window.mozRequestAnimationFrame    ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame ||  window.oRequestAnimationFrame;    
                
                ;
        var showLaser=function(){
			if (!scanning) return;
			ctx.beginPath();
			ctx.clearRect(0, y, canvas.width, H);
			if (down){
			   y=y+step;
			   if (y>=canvas.height){
			   down=false;
			   y-=2*step;
			   }
			}else {
			   y=y-step;
			    if (y<0){
			   down=true;
			   y+=step;
			   }
			}
			ctx.beginPath();
			ctx.fillStyle="green";
			ctx.rect(0, y, canvas.width, H);
			ctx.fill();	
			
			renderer(showLaser)
			
		}
        this.stop=function(){
			ctx.beginPath();
			ctx.clearRect(0, y, canvas.width, H);
		  scanning=false;y=0;
		}
	    this.start=function(){	
			scanning=true;	
			     showLaser();	
	    }
   } 
 
   var Scanner=function(e,onSuccess,canvas){
        var canvas_qr = document.createElement('canvas');
        var context = canvas_qr.getContext('2d');
        var timer=null;

        e.crossOrigin = "Anonymous";
        var ondebug=options.debug?debugInfo(context):null

        this.destroy=function(){
		  if (timer) clearTimeout(timer);
		  if (render) render.stop();
		  timer=null;
		  canvas_qr.remove();	
		}
		this.start=function(){	
		if (render) render.start();	
		var scanner=function(){
			capture(function(r){
				 if (onSuccess(r)) timer=setTimeout(scanner,500);
			},function(){
				timer=setTimeout(scanner,500);
			})
		}
	    scanner();
	
	
	    }
	

       var capture=function(ons,one){
		
			var nheight = e.height;          
            var nwidth = e.width;
            if(e.width*e.height>maxImgSize)
            {
                var ir = e.width / e.height;
                nheight = Math.sqrt(maxImgSize/ir);
                nwidth=ir*nheight;
            }

            canvas_qr.width = nwidth;
            canvas_qr.height = nheight;
           
            
            context.drawImage(e, 0, 0, canvas_qr.width, canvas_qr.height );
      
            var imagedata;
            try{
                imagedata = context.getImageData(0, 0, canvas_qr.width, canvas_qr.height);
            } catch(e) {
				one(ERROR_1);
				 console.log(e);
				return;
		    }
		    try{
                var result = process(imagedata,canvas_qr.width, canvas_qr.height,ondebug);
                ons(result);
             
            }
            catch(e)
            {
                one(ERROR_2);
                 console.log(e);
               
            }
		}
        
        
       
         
 }
 
 var decode=(function(){
	  if (type==1&&!options.canvasCloning) return processCanvas;
	  else   return processImageVideo;
	
	})();
	 
 
 this.decode=function(suc,err){
	decode(e,suc||options.onDetected||function(){},err||options.onError ||function(){});
 }
 
this.startScanner=function(onSuccess){
	var callback=onSuccess||options.onDetected||function(){};
	var t=this;
	if (!scanner){

		scanner=new Scanner(e,function(r){
			callback(r);
			if (options.autostop) { scanner.destroy();scanner=null; return false;}
			return true;
		});
		scanner.start();
	
	}
	
} 

this.stopScanner=function(){
if (scanner) scanner.destroy();
scanner=null;	
} 
        


var process = function(imagedata,width,height,_debugInfo){
    

    if (_debugInfo) debugInfo(0);

    var image = grayScaleToBitmap(grayscale(imagedata,width,height),width,height);
   
    
    if (_debugInfo) debugInfo(1,imagedata,width,height,imagedata);
   
    

    
    var detector = new Detector(image,width,height,imagedata);

    var qRCodeMatrix = detector.detect();
    
    if(_debugInfo) debugInfo(imagedata);
    
    var reader = Decoder.decode(qRCodeMatrix.bits);
    var data = reader.DataByte;
    var str="";
    for(var i=0;i<data.length;i++)
    {
        for(var j=0;j<data[i].length;j++)
            str+=String.fromCharCode(data[i][j]);
    }
    

     if(_debugInfo)  debugInfo(3);
 
    
    return decode_utf8(str);
  
}

 if (options.outputCanvas) {
	 var canvas=options.outputCanvas;
	 var parent=canvas.parentNode;
	 var div = document.createElement("div");
	 div.setAttribute('style','display: block;position: relative');
	 var style=(canvas.getAttribute('style')||'').trim();
	 if (style.length>0) style+=';';
     canvas.setAttribute("style",style+";position: absolute; left: 0; top: 0; z-index: 0;");
	 parent.replaceChild(div,canvas);
	 div.appendChild(canvas);
     var canvasLayer=document.createElement('canvas');
     canvasLayer.width=canvas.width;
     canvasLayer.height=canvas.height;
     canvasLayer.setAttribute("style","position: absolute; left: 0; top: 0; z-index: 1;");
     div.appendChild(canvasLayer);
	 render=new ScannerRender(canvasLayer);
 }

}


 



})();







