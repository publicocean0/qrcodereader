/*
   Copyright 2011 Lazar Laszlo (lazarsoft@gmail.com, www.lazarsoft.info)
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

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
qrcode = {};


var maxImgSize = 1024*1024;



qrcode.callback = null;

qrcode.decode = function(src){
    
 
        var image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload=function(){
            //var canvas_qr = document.getElementById("qr-canvas");
            var canvas_qr = document.createElement('canvas');
            var context = canvas_qr.getContext('2d');
            var nheight = image.height;
            var nwidth = image.width;
            if(image.width*image.height>maxImgSize)
            {
                var ir = image.width / image.height;
                nheight = Math.sqrt(qrcode.maxImgSize/ir);
                nwidth=ir*nheight;
            }

            canvas_qr.width = nwidth;
            canvas_qr.height = nheight;
            
            context.drawImage(image, 0, 0, canvas_qr.width, canvas_qr.height );
            qrcode.width = canvas_qr.width;
            qrcode.height = canvas_qr.height;
            try{
                qrcode.imagedata = context.getImageData(0, 0, canvas_qr.width, canvas_qr.height);
            }catch(e){
                qrcode.result = "Cross domain image reading not supported in your browser! Save it to your computer then drag and drop the file!";
                if(qrcode.callback!=null)
                    qrcode.callback(qrcode.result);
                return;
            }
            
            try
            {
                qrcode.result = processImage(image,qrcode.callback);
            }
            catch(e)
            {
                console.log(e);
                qrcode.result = "error decoding QR Code";
            }
            if(qrcode.callback!=null)
                qrcode.callback(qrcode.result);
        }
        image.src = src;
    
}

 var processImage=function(image,success,error){
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
				return;
		    }
		    try{
                var result = process(imagedata,width,height,null);
                success(result);
            }
            catch(e)
            {
               
                 console.log(e);
            }
         
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






