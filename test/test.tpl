
<!doctype html>
<html>
<head>
 <meta charset="UTF-8"> 


 
 

 <!-- @bind:js inline separated  
       jquery
       qrcodereader
  --> 

 







  
   <script> 
   var ff=function(img){
	 var q=new QRCodeReader(img);
									 q.decode(function(a){
									  console.log(a);	
									 
									 },function(e){
										console.log(e) 
										});
										
									  
  }

   $( document ).ready(function() {
    $('input').change(function(evt){
		
		    var files = evt.target.files; 
		    var reader = new FileReader();
		    reader.onload = (function(file) {
								return function(e) {
									var image=e.target.result;
					                var img=new Image();
                                    
									img.onload=function(){
									ff(img)
								    }
									img.onerror=function(e){
									console.log(e)
									}
									img.src=image;
								};
								})(files[0]);

		    reader.readAsDataURL(files[0]);  
	});
    var img=$('img')[0];
    img.onload=function(){ ff(img);}
  
  });
    </script>
 
</head>   
<body>
	<input type=file >  
	<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAIAAAAHjs1qAAAABmJLR0QA/wD/AP+gvaeTAAAD8ElEQVR4nO3dwapaMRRA0Vr6/7/8OuvsQiOJSdxrjUWvsjmDQ4ivn5+fX9Dwe/cDwOfInRC5EyJ3QuROiNwJkTshcidE7oTInRC5EyJ3QuROiNwJkTshcidE7oTInRC5EyJ3QuROiNwJkTshcidE7oTInRC5EyJ3QuROiNwJkTshcidE7oTInRC5EyJ3QuROiNwJkTshcifkz8bPfr1eGz/9/43+0/LT91r9Pt/6e05kuhMid0LkTojcCZE7IXInRO6E7Ny7P9m1lx3dW+/ar4+65ff8ANOdELkTIndC5E6I3AmROyFyJ+TEvfuTWXvc1fvs0T367XvxjefXR5nuhMidELkTIndC5E6I3AmROyE37d1Pc8t5d/4x3QmROyFyJ0TuhMidELkTIndC7N3fN2u/Pvp6+/i3me6EyJ0QuRMid0LkTojcCZE7ITft3U/bN6++p2X1/ein/Z4fYLoTIndC5E6I3AmROyFyJ0TuhJy4dz/w/ziH7NqjP7n995zIdCdE7oTInRC5EyJ3QuROiNwJeQUPPe8S/B/T05juhMidELkTIndC5E6I3AmROyE79+67zmHfcq/L6POMfq9dr9/IdCdE7oTInRC5EyJ3QuROiNwJOfGemVGj++DVe+LVn7t6nz3reQ7cx5vuhMidELkTIndC5E6I3AmROyEnnnc/7X70XVbvs0873/8BpjshcidE7oTInRC5EyJ3QuROyIl791Grv8LqPfeu59/FeXf4BLkTIndC5E6I3AmROyFyJ+TEe2ZmnXfftW+e9ZyzzrtfdA/MaqY7IXInRO6EyJ0QuRMid0LkTsjO8+63u+WenNX31l+01zfdCZE7IXInRO6EyJ0QuRMid0K+4Z6Z1Wbt0VffSzPreW65/+cNpjshcidE7oTInRC5EyJ3QuROyE33zKy2a2+9+vWrf88D9+tPTHdC5E6I3AmROyFyJ0TuhMidkBP37k9OO4e9+nl2/Z/rLf8X+wbTnRC5EyJ3QuROiNwJkTshcifkpr07n7F6T7+R6U6I3AmROyFyJ0TuhMidELkTYu8+36573Ef34rfcrz+R6U6I3AmROyFyJ0TuhMidELkTctPe/ZZz1avPi8/a64++/0X3yTwx3QmROyFyJ0TuhMidELkTIndCTty7f+s57F3779Xn3S/ax5vuhMidELkTIndC5E6I3AmROyGvA5ejsIjpTojcCZE7IXInRO6EyJ0QuRMid0LkTojcCZE7IXInRO6EyJ0QuRMid0LkTojcCZE7IXInRO6EyJ0QuRMid0LkTojcCZE7IXInRO6EyJ0QuRMid0LkTojcCZE7IXInRO6EyJ0QuRMid0L+As1mEu3s4IuNAAAAAElFTkSuQmCC">
    <div></div>
</body> 

</html> 
