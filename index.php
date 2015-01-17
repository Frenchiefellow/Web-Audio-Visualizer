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
	<div class="banner2">
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
		
		<!--<div style='height: 20px;'></div> -->
		<div class="modeSelect">
			<span class='modeTitle'>1. Choose a Visualizer:</span>
			<img class="ballViz choice"src="./resources/ball.png" title='Ball Wave Type Visualizer'>
			<img class="barViz choice" src="./resources/bar.png" title='Bar Type Visualizer'>
			<div class="partyViz choice" title='Not Yet Implemented'> Party</div>
			<div class="customViz choice" title='Not Yet Implemented'>Custom</div>
		</div>
		<div class="dropHolder"></div>

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
<script src='./scripts/bar.js'></script> 
<script src='./three/build/three.js'></script>
<script src="./three/examples/js/renderers/Projector.js"></script>
<script src="./three/examples/js/renderers/CanvasRenderer.js"></script>
<script src="./three/examples/js/libs/stats.min.js"></script>
<script src="./sidr/jquery.sidr.min.js"></script> 


</html>