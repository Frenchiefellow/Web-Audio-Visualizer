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
			<div class="modeHolder row">
				<div class="wSpacer col-xs-1"></div>
				<div class="col-sm-3 fixMe">
					<img class="ballViz choice"src="./resources/ball.png">
					<span class="information" id="iBall" title="Ball Wave Type Visualizer! &#13;Watch as the balls travel the peaks of the song!&#13;Features: Random colored balls, togglable song display, change number of balls, change background/ball colors!">i</span>
				</div>
				<div class="wSpacer col-xs-1"></div>
				<div class="col-sm-3 fixMe">
					<img class="barViz choice" src="./resources/bar.png">
					<span class="information" id="iBar" title="Traditional Bar Type Visualizer!&#13;Features: Mouse rotation control and auto rotation control!">i</span>
				</div>
				<div class="wSpacer col-sm-1"></div>
				<div class="col-sm-3 fixMe">
					<img class="webViz choice"src="./resources/warp.png">
					<span class="information" id="iWeb" title="Warp/Web Type Visualizer!&#13;Watch the warp/web take form in it's spacey environment!">i</span>
				</div>
				<div class="wSpacer col-sm-1"></div>
				<div class="col-sm-3 fixMe">
					<img class="spaceViz choice"src="./resources/space.png">
					<span class="information" id="iCustom" title="Space Type Visualizer! &#13; Not much of a visualizer yet, but is still in development!!!">i</span>
				</div>

				<div class="wSpacer col-sm-1"></div>
			
			</div>
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

<script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
<script src='./scripts/jquery/jquery-ui.js'></script>
<script src='./scripts/main.js'></script> 
<script src='./scripts/space.js'></script> 
<script src='./scripts/web.js'></script> 
<script src='./scripts/bar.js'></script> 
<script src='./three/build/three.js'></script>
<script src="./three/examples/js/renderers/Projector.js"></script>
<script src="./three/examples/js/renderers/CanvasRenderer.js"></script>
<script src="./three/examples/js/libs/stats.min.js"></script>
<script src="./sidr/jquery.sidr.min.js"></script> 



</html>
