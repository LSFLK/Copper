<?php
/* Smarty version 3.1.29, created on 2018-06-07 11:45:03
  from "/srv/postfixadmin/templates/editform.tpl" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5b18cd67f1ba40_06187917',
  'file_dependency' => 
  array (
    'e0c6da86f3290d927bab678b69eb691d75bdb1fc' => 
    array (
      0 => '/srv/postfixadmin/templates/editform.tpl',
      1 => 1498412972,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5b18cd67f1ba40_06187917 ($_smarty_tpl) {
if (!is_callable('smarty_function_html_options')) require_once '/srv/postfixadmin/smarty/libs/plugins/function.html_options.php';
if (!is_callable('smarty_function_html_checkboxes')) require_once '/srv/postfixadmin/smarty/libs/plugins/function.html_checkboxes.php';
?>
<div id="edit_form">
<form name="edit_<?php echo $_smarty_tpl->tpl_vars['table']->value;?>
" method="post" action="">
<input class="flat" type="hidden" name="table" value="<?php echo $_smarty_tpl->tpl_vars['table']->value;?>
" />
<input class="flat" type="hidden" name="token" value="<?php echo rawurlencode($_SESSION['PFA_token']);?>
" />

<table>
	<tr>
		<th colspan="4"><?php echo $_smarty_tpl->tpl_vars['formtitle']->value;?>
</th>
	</tr>

<?php
$_from = $_smarty_tpl->tpl_vars['struct']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_field_0_saved_item = isset($_smarty_tpl->tpl_vars['field']) ? $_smarty_tpl->tpl_vars['field'] : false;
$__foreach_field_0_saved_key = isset($_smarty_tpl->tpl_vars['key']) ? $_smarty_tpl->tpl_vars['key'] : false;
$_smarty_tpl->tpl_vars['field'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['key'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['field']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['key']->value => $_smarty_tpl->tpl_vars['field']->value) {
$_smarty_tpl->tpl_vars['field']->_loop = true;
$__foreach_field_0_saved_local_item = $_smarty_tpl->tpl_vars['field'];
?>
	<?php if ($_smarty_tpl->tpl_vars['field']->value['display_in_form'] == 1) {?>

		<?php if ($_smarty_tpl->tpl_vars['table']->value == 'foo' && $_smarty_tpl->tpl_vars['key']->value == 'bar') {?>
			<tr><td>Special handling (complete table row) for <?php echo $_smarty_tpl->tpl_vars['table']->value;?>
 / <?php echo $_smarty_tpl->tpl_vars['key']->value;?>
</td></tr>
		<?php } else { ?>
			<tr>
				<td class="label"><?php echo $_smarty_tpl->tpl_vars['field']->value['label'];?>
</td>
				<td>
				<?php if ($_smarty_tpl->tpl_vars['field']->value['editable'] == 0) {?>
					<?php if ($_smarty_tpl->tpl_vars['field']->value['type'] == 'enma') {?>
						<?php echo $_smarty_tpl->tpl_vars['struct']->value[$_smarty_tpl->tpl_vars['key']->value]['options'][$_smarty_tpl->tpl_vars['value_'.($_smarty_tpl->tpl_vars['key']->value)]->value];?>

					<?php } else { ?>
						<?php echo $_smarty_tpl->tpl_vars['value_'.($_smarty_tpl->tpl_vars['key']->value)]->value;?>

					<?php }?>
				<?php } else { ?>
					<?php if ($_smarty_tpl->tpl_vars['table']->value == 'foo' && $_smarty_tpl->tpl_vars['key']->value == 'bar') {?>
						Special handling (td content) for <?php echo $_smarty_tpl->tpl_vars['table']->value;?>
 / <?php echo $_smarty_tpl->tpl_vars['key']->value;?>

					<?php } elseif ($_smarty_tpl->tpl_vars['field']->value['type'] == 'bool') {?>
						<input class="flat" type="checkbox" value='1' name="value[<?php echo $_smarty_tpl->tpl_vars['key']->value;?>
]"<?php ob_start();
echo $_smarty_tpl->tpl_vars['value_'.($_smarty_tpl->tpl_vars['key']->value)]->value;
$_tmp1=ob_get_clean();
if ($_tmp1 == 1) {?> checked="checked"<?php }?>/>
					<?php } elseif ($_smarty_tpl->tpl_vars['field']->value['type'] == 'enum') {?>
						<select class="flat" name="value[<?php echo $_smarty_tpl->tpl_vars['key']->value;?>
]">
						<?php echo smarty_function_html_options(array('output'=>$_smarty_tpl->tpl_vars['struct']->value[$_smarty_tpl->tpl_vars['key']->value]['options'],'values'=>$_smarty_tpl->tpl_vars['struct']->value[$_smarty_tpl->tpl_vars['key']->value]['options'],'selected'=>$_smarty_tpl->tpl_vars['value_'.($_smarty_tpl->tpl_vars['key']->value)]->value),$_smarty_tpl);?>

						</select>
					<?php } elseif ($_smarty_tpl->tpl_vars['field']->value['type'] == 'enma') {?>
						<select class="flat" name="value[<?php echo $_smarty_tpl->tpl_vars['key']->value;?>
]">
						<?php echo smarty_function_html_options(array('options'=>$_smarty_tpl->tpl_vars['struct']->value[$_smarty_tpl->tpl_vars['key']->value]['options'],'selected'=>$_smarty_tpl->tpl_vars['value_'.($_smarty_tpl->tpl_vars['key']->value)]->value),$_smarty_tpl);?>

						</select>
					<?php } elseif ($_smarty_tpl->tpl_vars['field']->value['type'] == 'list') {?>
						<select class="flat" name="value[<?php echo $_smarty_tpl->tpl_vars['key']->value;?>
][]" size="10" multiple="multiple">
						<?php echo smarty_function_html_options(array('output'=>$_smarty_tpl->tpl_vars['struct']->value[$_smarty_tpl->tpl_vars['key']->value]['options'],'values'=>$_smarty_tpl->tpl_vars['struct']->value[$_smarty_tpl->tpl_vars['key']->value]['options'],'selected'=>$_smarty_tpl->tpl_vars['value_'.($_smarty_tpl->tpl_vars['key']->value)]->value),$_smarty_tpl);?>

						</select>

<!-- alternative: 
						<div style='max-height:30em; overflow:auto;'>
							<?php echo smarty_function_html_checkboxes(array('name'=>"value[".((string)$_smarty_tpl->tpl_vars['key']->value)."]",'output'=>$_smarty_tpl->tpl_vars['struct']->value[$_smarty_tpl->tpl_vars['key']->value]['options'],'values'=>$_smarty_tpl->tpl_vars['struct']->value[$_smarty_tpl->tpl_vars['key']->value]['options'],'selected'=>$_smarty_tpl->tpl_vars['value_'.($_smarty_tpl->tpl_vars['key']->value)]->value,'separator'=>"<br />"),$_smarty_tpl);?>

						</div>
-->
					<?php } elseif ($_smarty_tpl->tpl_vars['field']->value['type'] == 'pass' || $_smarty_tpl->tpl_vars['field']->value['type'] == 'b64p') {?>
						<input class="flat" type="password" name="value[<?php echo $_smarty_tpl->tpl_vars['key']->value;?>
]" />
					<?php } elseif ($_smarty_tpl->tpl_vars['field']->value['type'] == 'txtl') {?>
						<textarea class="flat" rows="10" cols="35" name="value[<?php echo $_smarty_tpl->tpl_vars['key']->value;?>
]"><?php
$_from = $_smarty_tpl->tpl_vars['value_'.($_smarty_tpl->tpl_vars['key']->value)]->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_field2_1_saved_item = isset($_smarty_tpl->tpl_vars['field2']) ? $_smarty_tpl->tpl_vars['field2'] : false;
$__foreach_field2_1_saved_key = isset($_smarty_tpl->tpl_vars['key2']) ? $_smarty_tpl->tpl_vars['key2'] : false;
$_smarty_tpl->tpl_vars['field2'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['key2'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['field2']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['key2']->value => $_smarty_tpl->tpl_vars['field2']->value) {
$_smarty_tpl->tpl_vars['field2']->_loop = true;
$__foreach_field2_1_saved_local_item = $_smarty_tpl->tpl_vars['field2'];
echo $_smarty_tpl->tpl_vars['field2']->value;?>

<?php
$_smarty_tpl->tpl_vars['field2'] = $__foreach_field2_1_saved_local_item;
}
if ($__foreach_field2_1_saved_item) {
$_smarty_tpl->tpl_vars['field2'] = $__foreach_field2_1_saved_item;
}
if ($__foreach_field2_1_saved_key) {
$_smarty_tpl->tpl_vars['key2'] = $__foreach_field2_1_saved_key;
}
?></textarea>
					<?php } else { ?>
						<input class="flat" type="text" name="value[<?php echo $_smarty_tpl->tpl_vars['key']->value;?>
]" value="<?php echo $_smarty_tpl->tpl_vars['value_'.($_smarty_tpl->tpl_vars['key']->value)]->value;?>
" />
					<?php }?>
				<?php }?>	
				</td>
				<td>
					<?php if ($_smarty_tpl->tpl_vars['table']->value == 'foo' && $_smarty_tpl->tpl_vars['key']->value == 'bar') {?>
						Special handling (td content) for <?php echo $_smarty_tpl->tpl_vars['table']->value;?>
 / <?php echo $_smarty_tpl->tpl_vars['key']->value;?>

					<?php } else { ?>
						<?php echo $_smarty_tpl->tpl_vars['field']->value['desc'];?>

					<?php }?>
				</td>
				<td class="error_msg"><?php echo $_smarty_tpl->tpl_vars['fielderror']->value[$_smarty_tpl->tpl_vars['key']->value];?>
</td>
			</tr>
		<?php }?>

	<?php }
$_smarty_tpl->tpl_vars['field'] = $__foreach_field_0_saved_local_item;
}
if ($__foreach_field_0_saved_item) {
$_smarty_tpl->tpl_vars['field'] = $__foreach_field_0_saved_item;
}
if ($__foreach_field_0_saved_key) {
$_smarty_tpl->tpl_vars['key'] = $__foreach_field_0_saved_key;
}
?>

	<tr>
		<td>&nbsp;</td>
		<td colspan="3"><input class="button" type="submit" name="submit" value="<?php echo $_smarty_tpl->tpl_vars['submitbutton']->value;?>
" /></td>
	</tr>
</table>

</form>
</div>
<?php }
}
