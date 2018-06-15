<?php
/* Smarty version 3.1.29, created on 2018-06-07 11:40:53
  from "/srv/postfixadmin/templates/index.tpl" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5b18cc6d85db73_81425447',
  'file_dependency' => 
  array (
    'b905fc205a5628ecff91c49dbe8aac3dbee8a0ea' => 
    array (
      0 => '/srv/postfixadmin/templates/index.tpl',
      1 => 1498412972,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:header.tpl' => 1,
    'file:users_menu.tpl' => 1,
    'file:menu.tpl' => 1,
    'file:flash_error.tpl' => 1,
    'file:footer.tpl' => 1,
  ),
),false)) {
function content_5b18cc6d85db73_81425447 ($_smarty_tpl) {
?>
<!-- <?php echo basename($_smarty_tpl->source->filepath);?>
 -->
<?php $_smarty_tpl->smarty->ext->_subtemplate->render($_smarty_tpl, "file:header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
if ($_smarty_tpl->tpl_vars['smarty_template']->value != 'login') {
$_smarty_tpl->smarty->ext->configLoad->_loadConfigFile($_smarty_tpl, "menu.conf", $_smarty_tpl->tpl_vars['smarty_template']->value, 0);
if ($_smarty_tpl->tpl_vars['authentication_has_role']->value['user']) {
$_smarty_tpl->smarty->ext->_subtemplate->render($_smarty_tpl, "file:users_menu.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
} else {
$_smarty_tpl->smarty->ext->_subtemplate->render($_smarty_tpl, "file:menu.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
}
}?><br clear="all" /><?php if ($_smarty_tpl->tpl_vars['authentication_has_role']->value['user'] && $_smarty_tpl->tpl_vars['CONF']->value['motd_user']) {?><div id="motd"><?php echo $_smarty_tpl->tpl_vars['CONF']->value['motd_user'];?>
</div><?php } elseif ($_smarty_tpl->tpl_vars['authentication_has_role']->value['global_admin'] && $_smarty_tpl->tpl_vars['CONF']->value['motd_superadmin']) {?><div id="motd"><?php echo $_smarty_tpl->tpl_vars['CONF']->value['motd_superadmin'];?>
</div><?php } elseif ($_smarty_tpl->tpl_vars['authentication_has_role']->value['admin'] && $_smarty_tpl->tpl_vars['CONF']->value['motd_admin']) {?><div id="motd"><?php echo $_smarty_tpl->tpl_vars['CONF']->value['motd_admin'];?>
</div><?php }
$_smarty_tpl->smarty->ext->_subtemplate->render($_smarty_tpl, "file:flash_error.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
if ($_smarty_tpl->tpl_vars['smarty_template']->value) {
$_smarty_tpl->smarty->ext->_subtemplate->render($_smarty_tpl, ((string)$_smarty_tpl->tpl_vars['smarty_template']->value).".tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, true);
} else { ?><h3>Template not found</h3>(<?php echo htmlspecialchars($_SERVER['PHP_SELF'], ENT_QUOTES, 'UTF-8', true);?>
)<?php }
$_smarty_tpl->smarty->ext->_subtemplate->render($_smarty_tpl, "file:footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>

<?php }
}
