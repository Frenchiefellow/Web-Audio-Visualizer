<html>
<head>
<title>Web Audio Visualizer!</title>
<link rel="stylesheet" href='./css/index.css' />
<link rel="stylesheet" href='./css/bootstrap/css/bootstrap.css' />
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css" />
<link rel="stylesheet" href="./sidr/stylesheets/jquery.sidr.dark.css" />
<!--<link rel="stylesheet" type="text/css" href="./css/fonts/reset.css" media="all">
<link rel="stylesheet" type="text/css" href="./css/fonts/style.css" media="all"> -->
</head>

<body>
	<div class="banner">
		<ul>
			<li>W</li><!--
			--><li>E</li><!--
			--><li>B</li><!--
			--><li> &nbsp;</li><!--
			--><li>V</li><!--
			--><li>I</li><!--
			--><li>S</li><!--
			--><li>U</li><!--
			--><li>A</li><!--
			--><li>L</li><!--
			--><li>I</li><!--
			--><li>Z</li><!--
			--><li>E</li><!--
			--><li>R</li><!--
			--><li>!</li><!--
			-->
		</ul>

	</div>
	<div id="playArea" class="original">
		<select id="mode" class="splashDrops" name="mode" onchange='modeDetect(this.options[this.selectedIndex].value)'>
			<option value="balls" selected="selected" >Balls Mode</option>
			<!-- <option value="party">Party Mode</option>
			<option value="custom">Custom Mode</option> -->
		</select>
		<select id="songs" class="splashDrops" name="songs">
			<option value="" selected="selected" >I'll drag and drop my own!</option>
		<!--	<option value="sample">Sample!</option> -->
		</select>
		<p class= " btn btn-success" id="play"> Play? </p>
		<div style='height: 20px;'></div>
		<div id="drop"> 
			<div id='dragDrop'>or Drag and Drop Music File Here:</div>
			<div id='warning'>Files larger than 60 minutes appear to break the site...</div>
		</div>
	</div>
	<div class="bottomBanner">
		<span> Designed by Frenchiefellow || 
			<a href="http://www.github.com/frenchiefellow/Web-Audio-Visualizer"> Source</a>
			</span>
	</div>
	<div class="menuContainer"></div>
	<div class="menuContainer2"></div>
	<div id="hideDisplay" class="hideMe">
		<span title="Click to Hide/Restore Display">&#8693;</span>
	</div>
</body>

<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
<script src='./scripts/jquery/jquery-ui.js'></script>
<script src='./scripts/main.js'></script> 
<script src='./scripts/custom.js'></script> 
<script src='./scripts/party.js'></script> 
<script src='./three/build/three.js'></script>
<script src="./three/examples/js/renderers/Projector.js"></script>
<script src="./three/examples/js/renderers/CanvasRenderer.js"></script>
<script src="./three/examples/js/libs/stats.min.js"></script>
<script src="./sidr/jquery.sidr.min.js"></script> 


</html>
