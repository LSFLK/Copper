<?php
/* Smarty version 3.1.29, created on 2018-06-07 11:40:53
  from "/srv/postfixadmin/templates/header.tpl" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5b18cc6d9a4172_37646655',
  'file_dependency' => 
  array (
    '07e02cf499d628c4667ed201519e6c6b38e83ccd' => 
    array (
      0 => '/srv/postfixadmin/templates/header.tpl',
      1 => 1498412972,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5b18cc6d9a4172_37646655 ($_smarty_tpl) {
?>
<!-- <?php echo basename($_smarty_tpl->source->filepath);?>
 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<link rel="stylesheet" type="text/css" href="<?php echo $_smarty_tpl->tpl_vars['CONF']->value['theme_css'];?>
" />
<?php if ($_smarty_tpl->tpl_vars['CONF']->value['theme_custom_css']) {?>
		<link rel="stylesheet" type="text/css" href="<?php echo $_smarty_tpl->tpl_vars['CONF']->value['theme_custom_css'];?>
" />
<?php }?>
		<title>Postfix Admin - <?php echo $_SERVER['HTTP_HOST'];?>
</title>
	</head>
	<body class="lang-<?php echo $_SESSION['lang'];?>
 page-<?php echo $_smarty_tpl->tpl_vars['smarty_template']->value;?>
 <?php if (isset($_smarty_tpl->tpl_vars['table']->value)) {?>page-<?php echo $_smarty_tpl->tpl_vars['smarty_template']->value;?>
-<?php echo $_smarty_tpl->tpl_vars['table']->value;
}?>">
		<div id="container">
		<div id="login_header">
		<a href='main.php'><img id="login_header_logo" src="<?php echo $_smarty_tpl->tpl_vars['CONF']->value['theme_logo'];?>
" alt="Logo" /></a>
<?php if ($_smarty_tpl->tpl_vars['CONF']->value['show_header_text'] === 'YES' && $_smarty_tpl->tpl_vars['CONF']->value['header_text']) {?>
		<h2><?php echo $_smarty_tpl->tpl_vars['CONF']->value['header_text'];?>
</h2>
<?php }?>
		</div>
<?php }
}
