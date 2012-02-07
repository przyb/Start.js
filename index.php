
<!doctype html>

<!--[if lt IE 7 ]> <html class="ie ie6 no-js" lang="en"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie ie7 no-js" lang="en"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie ie8 no-js" lang="en"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie ie9 no-js" lang="en"> <![endif]-->
<!--[if gt IE 9]><!--><html class="no-js" lang="en"><!--<![endif]-->
<!-- the "no-js" class is for Modernizr. -->

<head data-template-set="html5-reset">

	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	
	<title>start.js</title>
	
	<meta name="title" content="">
	<meta name="description" content="">

	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

	<link rel="stylesheet" href="_/css/reset.css">
	<link rel="stylesheet" href="_/css/webfonts.css">
	<link rel="stylesheet" href="_/css/style.css">
	<script src="_/js/lib/modernizr-1.7.min.js"></script>
	<!--[if lt IE 9]>
	<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->
	<script src="_/js/lib/PxLoader.min.js"></script>
	<script src="_/js/lib/PxLoaderImage.min.js"></script>
</head>

<body>
<?php 
$action = @$_GET['action'];
$actions = array(
	'index',
	'page1',
	'page2'
);

if (!in_array($action, $actions)) {
	$action = 'index';
}
?>
<div id="wrapper">
	<header>
		<h1>start.js</h1>
		<nav>
			<ul>
				<li><a class="ajax<?php if ($action == 'index'): ?> active<?php endif; ?>" href="?action=index">home</a>
				<li><a class="ajax<?php if ($action == 'page1'): ?> active<?php endif; ?>" href="?action=page1">page 1</a>
				<li><a class="ajax<?php if ($action == 'page2'): ?> active<?php endif; ?>" href="?action=page2">page 2</a>
			</ul>
		</nav>
	</header>
	
	<div id="content">
	<?php switch ($action) {
		case 'index':
		default:
		echo '<h1>Index</h1>';
		break;
		
		case 'page1':
		echo '<h1>Page 1</h1>';
		break;
		
		case 'page2':
		echo '<h1>Page 2</h1>';
		break;
	} ?>
	</div>

	<footer>
		
	</footer>
</div>

<div id="preloader">
	<div class="progress-info">0</div>
	<div class="progress-bar-container">
		<div class="progress-bar"></div>
	</div>
</div>


<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script>window.jQuery || document.write("<script src='_/js/lib/jquery-1.7.1.min.js'>\x3C/script>")</script>
<script src="_/js/lib/jquery.easing.1.3.min.js"></script>
<script src="_/js/lib/jquery.history.js"></script>
<script src="_/js/lib/underscore.min.js"></script>
<script src="_/js/lib/underscore.string.min.js"></script>
<script src="_/js/lib/class.js"></script>
<script src="_/js/lib/start.js"></script>
<script src="preload.js.php?path=_/img/&amp;url_prefix="></script>
<script src="_/js/bootstrap.js"></script>

</body>
</html>