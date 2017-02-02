# qrcodereader
It is a refactoring of another project : https://github.com/LazarSoft/jsqrcode

<pre>
var a =new QRCodeReader(document.getElementById('mycanvas'||'myimage'),{
onSuccess:callback1,
onError:calback2
autostop:true,
outputCanvas:canvas
});
a.decode();//just current image
a.startScanner();
a.stopScanner();
//no other objects are visible in window 
</pre>


Use bower & bindep tool for generating the code;

npm install bindep

Active preprocessor in bindep tag
