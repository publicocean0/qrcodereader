# qrcodereader
It is a refactoring of another project : https://github.com/LazarSoft/jsqrcode

<pre>
var a =new QRCodeReader(document.getElementById('mycanvas'),{onSuccess:callback1,onError:calback2});//or var a =new QRCodeReader(document.getElementById('myimage'),{onSuccess:callback1,onError:calback2});
a.decode();
</pre>


Use bower & bindep tool for generating the code;

npm install bindep

Active preprocessor in bindep tag
