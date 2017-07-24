# qrcodereader
It is a refactoring of another project : https://github.com/LazarSoft/jsqrcode

<pre>
var a =new QRCodeReader(document.getElementById('mycanvas'||'myimage'||'myvideo'),{
onDetected:callback1,
onError:calback2
autostop:true,
outputCanvas:canvas // canvas where you show laser
});
a.decode();//just current image
a.startScanner();
a.stopScanner();
//no other objects are visible in window 
</pre>

 
Use  <a href="https://github.com/publicocean0/bindep">bindep</a> tool for generating the code in your page;

npm install bindep

Active preprocessor in bindep tag
