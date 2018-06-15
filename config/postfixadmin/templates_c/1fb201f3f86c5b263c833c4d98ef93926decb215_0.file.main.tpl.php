<?php
/* Smarty version 3.1.29, created on 2018-06-07 11:41:07
  from "/srv/postfixadmin/templates/main.tpl" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5b18cc7b69c2e2_84132905',
  'file_dependency' => 
  array (
    '1fb201f3f86c5b263c833c4d98ef93926decb215' => 
    array (
      0 => '/srv/postfixadmin/templates/main.tpl',
      1 => 1498412972,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5b18cc7b69c2e2_84132905 ($_smarty_tpl) {
?>
<!-- <?php echo basename($_smarty_tpl->source->filepath);?>
 -->
<div id="main_menu">
<table>
	<tr>
		<td nowrap="nowrap"><a target="_top" href="<?php echo $_smarty_tpl->smarty->ext->configLoad->_getConfigVariable($_smarty_tpl, 'url_list_domain');?>
"><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['pMenu_overview'];?>
</a></td>
		<td><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['pMain_overview'];?>
</td>
	</tr>
	<tr>
		<td nowrap="nowrap"><a target="_top" href="<?php echo $_smarty_tpl->smarty->ext->configLoad->_getConfigVariable($_smarty_tpl, 'url_create_alias');?>
"><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['add_alias'];?>
</a></td>
		<td><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['pMain_create_alias'];?>
</td>
	</tr>
	<tr>
		<td nowrap="nowrap"><a target="_top" href="<?php echo $_smarty_tpl->smarty->ext->configLoad->_getConfigVariable($_smarty_tpl, 'url_create_mailbox');?>
"><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['add_mailbox'];?>
</a></td>
		<td><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['pMain_create_mailbox'];?>
</td>
	</tr>
<?php if ($_smarty_tpl->tpl_vars['CONF']->value['sendmail'] === 'YES') {?>
	<tr>
		<td nowrap="nowrap"><a target="_top" href="<?php echo $_smarty_tpl->smarty->ext->configLoad->_getConfigVariable($_smarty_tpl, 'url_sendmail');?>
"><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['pMenu_sendmail'];?>
</a></td>
		<td><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['pMain_sendmail'];?>
</td>
	</tr>
<?php }?>
	<tr>
		<td nowrap="nowrap"><a target="_top" href="<?php echo $_smarty_tpl->smarty->ext->configLoad->_getConfigVariable($_smarty_tpl, 'url_password');?>
"><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['pMenu_password'];?>
</a></td>
		<td><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['pMain_password'];?>
</td>
	</tr>
	<tr>
		<td nowrap="nowrap"><a target="_top" href="<?php echo $_smarty_tpl->smarty->ext->configLoad->_getConfigVariable($_smarty_tpl, 'url_viewlog');?>
"><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['pMenu_viewlog'];?>
</a></td>
		<td><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['pMain_viewlog'];?>
</td>
	</tr>
	<tr>
		<td nowrap="nowrap"><a target="_top" href="<?php echo $_smarty_tpl->smarty->ext->configLoad->_getConfigVariable($_smarty_tpl, 'url_logout');?>
"><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['pMenu_logout'];?>
</a></td>
		<td><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['pMain_logout'];?>
</td>
	</tr>
</table>
</div>
<?php }
}
