<?php
/* Smarty version 3.1.29, created on 2018-06-07 11:41:10
  from "/srv/postfixadmin/templates/list.tpl" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5b18cc7e7bb153_09305045',
  'file_dependency' => 
  array (
    '8289ff83db05c0415c0ccd314e995eebb470d340' => 
    array (
      0 => '/srv/postfixadmin/templates/list.tpl',
      1 => 1498412972,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5b18cc7e7bb153_09305045 ($_smarty_tpl) {
if (!is_callable('smarty_function_html_options')) require_once '/srv/postfixadmin/smarty/libs/plugins/function.html_options.php';
if (!is_callable('smarty_modifier_replace')) require_once '/srv/postfixadmin/smarty/libs/plugins/modifier.replace.php';
?>
<div id="overview">
<form name="frmOverview" method="post" action="">
    <?php if ((count($_smarty_tpl->tpl_vars['admin_list']->value) > 1)) {?>
        <?php echo smarty_function_html_options(array('name'=>'username','output'=>$_smarty_tpl->tpl_vars['admin_list']->value,'values'=>$_smarty_tpl->tpl_vars['admin_list']->value,'selected'=>$_smarty_tpl->tpl_vars['admin_selected']->value,'onchange'=>"this.form.submit();"),$_smarty_tpl);?>

        <noscript><input class="button" type="submit" name="go" value="<?php echo $_smarty_tpl->tpl_vars['PALANG']->value['go'];?>
" /></noscript>
    <?php }?>
</form>
<?php if ($_smarty_tpl->tpl_vars['msg']->value['show_simple_search']) {?>
    <?php echo $_smarty_tpl->smarty->ext->configLoad->_getConfigVariable($_smarty_tpl, 'form_search');?>

<?php }?>
</div>

<?php if ($_smarty_tpl->tpl_vars['msg']->value['show_simple_search']) {?>
    <?php if ((count($_smarty_tpl->tpl_vars['search']->value) > 0)) {?>
        <div class='searchparams'>
            <p><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['searchparams'];?>

            <?php
$_from = $_smarty_tpl->tpl_vars['search']->value;
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
                <span><?php if ($_smarty_tpl->tpl_vars['struct']->value[$_smarty_tpl->tpl_vars['key']->value]['label']) {
echo $_smarty_tpl->tpl_vars['struct']->value[$_smarty_tpl->tpl_vars['key']->value]['label'];
} else {
echo $_smarty_tpl->tpl_vars['key']->value;
}?>
                    <?php if (isset($_smarty_tpl->tpl_vars['searchmode']->value[$_smarty_tpl->tpl_vars['key']->value])) {
echo $_smarty_tpl->tpl_vars['searchmode']->value[$_smarty_tpl->tpl_vars['key']->value];
} else { ?>=<?php }?> <?php echo $_smarty_tpl->tpl_vars['field']->value;?>

                </span>
            <?php
$_smarty_tpl->tpl_vars['field'] = $__foreach_field_0_saved_local_item;
}
if ($__foreach_field_0_saved_item) {
$_smarty_tpl->tpl_vars['field'] = $__foreach_field_0_saved_item;
}
if ($__foreach_field_0_saved_key) {
$_smarty_tpl->tpl_vars['key'] = $__foreach_field_0_saved_key;
}
?>
            <span><a href="list.php?table=<?php echo $_smarty_tpl->tpl_vars['table']->value;?>
&reset_search=1">[x]</a></span>
        </div>
    <?php }
}?>



<div id="list">
<table border=0 id='admin_table'><!-- TODO: 'admin_table' needed because of CSS for table header -->

<?php if ($_smarty_tpl->tpl_vars['msg']->value['list_header']) {?>
	<?php $_smarty_tpl->tpl_vars["colcount"] = new Smarty_Variable(2, null);
$_smarty_tpl->ext->_updateScope->updateScope($_smarty_tpl, "colcount", 0);?>
    <?php
$_from = $_smarty_tpl->tpl_vars['struct']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_field_1_saved_item = isset($_smarty_tpl->tpl_vars['field']) ? $_smarty_tpl->tpl_vars['field'] : false;
$__foreach_field_1_saved_key = isset($_smarty_tpl->tpl_vars['key']) ? $_smarty_tpl->tpl_vars['key'] : false;
$_smarty_tpl->tpl_vars['field'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['key'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['field']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['key']->value => $_smarty_tpl->tpl_vars['field']->value) {
$_smarty_tpl->tpl_vars['field']->_loop = true;
$__foreach_field_1_saved_local_item = $_smarty_tpl->tpl_vars['field'];
?>
        <?php if ($_smarty_tpl->tpl_vars['field']->value['display_in_list'] == 1 && $_smarty_tpl->tpl_vars['field']->value['label']) {?>
			<?php $_smarty_tpl->tpl_vars["colcount"] = new Smarty_Variable($_smarty_tpl->tpl_vars['colcount']->value+1, null);
$_smarty_tpl->ext->_updateScope->updateScope($_smarty_tpl, "colcount", 0);?>
        <?php }?>
    <?php
$_smarty_tpl->tpl_vars['field'] = $__foreach_field_1_saved_local_item;
}
if ($__foreach_field_1_saved_item) {
$_smarty_tpl->tpl_vars['field'] = $__foreach_field_1_saved_item;
}
if ($__foreach_field_1_saved_key) {
$_smarty_tpl->tpl_vars['key'] = $__foreach_field_1_saved_key;
}
?>
	<tr>
		<th colspan="<?php echo $_smarty_tpl->tpl_vars['colcount']->value;?>
"><?php echo $_smarty_tpl->tpl_vars['PALANG']->value[$_smarty_tpl->tpl_vars['msg']->value['list_header']];?>
</th>
	</tr>
<?php }?>

<tr class="header">
    <?php
$_from = $_smarty_tpl->tpl_vars['struct']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_field_2_saved_item = isset($_smarty_tpl->tpl_vars['field']) ? $_smarty_tpl->tpl_vars['field'] : false;
$__foreach_field_2_saved_key = isset($_smarty_tpl->tpl_vars['key']) ? $_smarty_tpl->tpl_vars['key'] : false;
$_smarty_tpl->tpl_vars['field'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['key'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['field']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['key']->value => $_smarty_tpl->tpl_vars['field']->value) {
$_smarty_tpl->tpl_vars['field']->_loop = true;
$__foreach_field_2_saved_local_item = $_smarty_tpl->tpl_vars['field'];
?>
        <?php if ($_smarty_tpl->tpl_vars['field']->value['display_in_list'] == 1 && $_smarty_tpl->tpl_vars['field']->value['label']) {?>
            <td><?php echo $_smarty_tpl->tpl_vars['field']->value['label'];?>
</td>
        <?php }?>
    <?php
$_smarty_tpl->tpl_vars['field'] = $__foreach_field_2_saved_local_item;
}
if ($__foreach_field_2_saved_item) {
$_smarty_tpl->tpl_vars['field'] = $__foreach_field_2_saved_item;
}
if ($__foreach_field_2_saved_key) {
$_smarty_tpl->tpl_vars['key'] = $__foreach_field_2_saved_key;
}
?>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
</tr>

<?php
$_from = $_smarty_tpl->tpl_vars['RAW_items']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_RAW_item_3_saved_item = isset($_smarty_tpl->tpl_vars['RAW_item']) ? $_smarty_tpl->tpl_vars['RAW_item'] : false;
$__foreach_RAW_item_3_saved_key = isset($_smarty_tpl->tpl_vars['itemkey']) ? $_smarty_tpl->tpl_vars['itemkey'] : false;
$_smarty_tpl->tpl_vars['RAW_item'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['itemkey'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['RAW_item']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['itemkey']->value => $_smarty_tpl->tpl_vars['RAW_item']->value) {
$_smarty_tpl->tpl_vars['RAW_item']->_loop = true;
$__foreach_RAW_item_3_saved_local_item = $_smarty_tpl->tpl_vars['RAW_item'];
?>
    <?php $_smarty_tpl->tpl_vars["item"] = new Smarty_Variable($_smarty_tpl->tpl_vars['items']->value[htmlentities($_smarty_tpl->tpl_vars['itemkey']->value,@constant('ENT_QUOTES'),'UTF-8',false)], null);
$_smarty_tpl->ext->_updateScope->updateScope($_smarty_tpl, "item", 0);?> 
    <?php echo $_smarty_tpl->smarty->ext->configLoad->_getConfigVariable($_smarty_tpl, 'tr_hilightoff');?>


    <?php
$_from = $_smarty_tpl->tpl_vars['struct']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_field_4_saved_item = isset($_smarty_tpl->tpl_vars['field']) ? $_smarty_tpl->tpl_vars['field'] : false;
$__foreach_field_4_saved_key = isset($_smarty_tpl->tpl_vars['key']) ? $_smarty_tpl->tpl_vars['key'] : false;
$_smarty_tpl->tpl_vars['field'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['key'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['field']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['key']->value => $_smarty_tpl->tpl_vars['field']->value) {
$_smarty_tpl->tpl_vars['field']->_loop = true;
$__foreach_field_4_saved_local_item = $_smarty_tpl->tpl_vars['field'];
?>
        <?php if ($_smarty_tpl->tpl_vars['field']->value['display_in_list'] == 1 && $_smarty_tpl->tpl_vars['field']->value['label']) {?>

            <?php if ($_smarty_tpl->tpl_vars['field']->value['linkto'] != '' && ($_smarty_tpl->tpl_vars['item']->value[$_smarty_tpl->tpl_vars['id_field']->value] != '' || $_smarty_tpl->tpl_vars['item']->value[$_smarty_tpl->tpl_vars['id_field']->value] > 0)) {?>
                <?php ob_start();
echo rawurlencode($_smarty_tpl->tpl_vars['item']->value[$_smarty_tpl->tpl_vars['id_field']->value]);
$_tmp1=ob_get_clean();
ob_start();
echo smarty_modifier_replace($_smarty_tpl->tpl_vars['field']->value['linkto'],'%s',$_tmp1);
$_tmp2=ob_get_clean();
$_smarty_tpl->tpl_vars["linkto"] = new Smarty_Variable($_tmp2, null);
$_smarty_tpl->ext->_updateScope->updateScope($_smarty_tpl, "linkto", 0);?> 
                <?php $_smarty_tpl->tpl_vars["linktext"] = new Smarty_Variable("<a href='".((string)$_smarty_tpl->tpl_vars['linkto']->value)."'>".((string)$_smarty_tpl->tpl_vars['item']->value[$_smarty_tpl->tpl_vars['key']->value])."</a>", null);
$_smarty_tpl->ext->_updateScope->updateScope($_smarty_tpl, "linktext", 0);?>
            <?php } else { ?>
                <?php $_smarty_tpl->tpl_vars["linktext"] = new Smarty_Variable($_smarty_tpl->tpl_vars['item']->value[$_smarty_tpl->tpl_vars['key']->value], null);
$_smarty_tpl->ext->_updateScope->updateScope($_smarty_tpl, "linktext", 0);?>
            <?php }?>

            <?php if ($_smarty_tpl->tpl_vars['table']->value == 'foo' && $_smarty_tpl->tpl_vars['key']->value == 'bar') {?>
                <td>Special handling (complete table row) for <?php echo $_smarty_tpl->tpl_vars['table']->value;?>
 / <?php echo $_smarty_tpl->tpl_vars['key']->value;?>
</td>
            <?php } else { ?>
                <td>
                    <?php if ($_smarty_tpl->tpl_vars['table']->value == 'foo' && $_smarty_tpl->tpl_vars['key']->value == 'bar') {?>
                        Special handling (td content) for <?php echo $_smarty_tpl->tpl_vars['table']->value;?>
 / <?php echo $_smarty_tpl->tpl_vars['key']->value;?>

                    <?php } elseif ($_smarty_tpl->tpl_vars['table']->value == 'aliasdomain' && $_smarty_tpl->tpl_vars['key']->value == 'target_domain' && $_smarty_tpl->tpl_vars['struct']->value['target_domain']['linkto'] == 'target') {?>
                        <a href="list-virtual.php?domain=<?php echo rawurlencode($_smarty_tpl->tpl_vars['item']->value['target_domain']);?>
"><?php echo $_smarty_tpl->tpl_vars['item']->value['target_domain'];?>
</a>

                    <?php } elseif ($_smarty_tpl->tpl_vars['key']->value == 'active') {?>
                        <?php if ($_smarty_tpl->tpl_vars['item']->value['_can_edit']) {?>
                            <a href="<?php echo $_smarty_tpl->smarty->ext->configLoad->_getConfigVariable($_smarty_tpl, 'url_editactive');
echo $_smarty_tpl->tpl_vars['table']->value;?>
&amp;id=<?php echo rawurlencode($_smarty_tpl->tpl_vars['RAW_item']->value[$_smarty_tpl->tpl_vars['id_field']->value]);?>
&amp;active=<?php if (($_smarty_tpl->tpl_vars['item']->value['active'] == 0)) {?>1<?php } else { ?>0<?php }?>&amp;token=<?php echo rawurlencode($_SESSION['PFA_token']);?>
"><?php echo $_smarty_tpl->tpl_vars['item']->value['_active'];?>
</a>
                        <?php } else { ?>
                            <?php echo $_smarty_tpl->tpl_vars['item']->value['_active'];?>

                        <?php }?>
                    <?php } elseif ($_smarty_tpl->tpl_vars['field']->value['type'] == 'bool') {?>
                        <?php $_smarty_tpl->tpl_vars["tmpkey"] = new Smarty_Variable("_".((string)$_smarty_tpl->tpl_vars['key']->value), null);
$_smarty_tpl->ext->_updateScope->updateScope($_smarty_tpl, "tmpkey", 0);
echo $_smarty_tpl->tpl_vars['item']->value[$_smarty_tpl->tpl_vars['tmpkey']->value];?>

                    <?php } elseif ($_smarty_tpl->tpl_vars['field']->value['type'] == 'list') {?>
                        <?php
$_from = $_smarty_tpl->tpl_vars['item']->value[$_smarty_tpl->tpl_vars['key']->value];
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_field2_5_saved_item = isset($_smarty_tpl->tpl_vars['field2']) ? $_smarty_tpl->tpl_vars['field2'] : false;
$__foreach_field2_5_saved_key = isset($_smarty_tpl->tpl_vars['key2']) ? $_smarty_tpl->tpl_vars['key2'] : false;
$_smarty_tpl->tpl_vars['field2'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['key2'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['field2']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['key2']->value => $_smarty_tpl->tpl_vars['field2']->value) {
$_smarty_tpl->tpl_vars['field2']->_loop = true;
$__foreach_field2_5_saved_local_item = $_smarty_tpl->tpl_vars['field2'];
echo $_smarty_tpl->tpl_vars['field2']->value;?>
<br> <?php
$_smarty_tpl->tpl_vars['field2'] = $__foreach_field2_5_saved_local_item;
}
if ($__foreach_field2_5_saved_item) {
$_smarty_tpl->tpl_vars['field2'] = $__foreach_field2_5_saved_item;
}
if ($__foreach_field2_5_saved_key) {
$_smarty_tpl->tpl_vars['key2'] = $__foreach_field2_5_saved_key;
}
?>
                    <?php } elseif ($_smarty_tpl->tpl_vars['field']->value['type'] == 'pass') {?>
                        (hidden)
                    <?php } elseif ($_smarty_tpl->tpl_vars['field']->value['type'] == 'quot') {?>
                        <?php $_smarty_tpl->tpl_vars["tmpkey"] = new Smarty_Variable("_".((string)$_smarty_tpl->tpl_vars['key']->value)."_percent", null);
$_smarty_tpl->ext->_updateScope->updateScope($_smarty_tpl, "tmpkey", 0);?>

                        <?php if ($_smarty_tpl->tpl_vars['item']->value[$_smarty_tpl->tpl_vars['tmpkey']->value] > 90) {?>
                            <?php $_smarty_tpl->tpl_vars["quota_level"] = new Smarty_Variable("high", null);
$_smarty_tpl->ext->_updateScope->updateScope($_smarty_tpl, "quota_level", 0);?>
                        <?php } elseif ($_smarty_tpl->tpl_vars['item']->value[$_smarty_tpl->tpl_vars['tmpkey']->value] > 55) {?>
                            <?php $_smarty_tpl->tpl_vars["quota_level"] = new Smarty_Variable("mid", null);
$_smarty_tpl->ext->_updateScope->updateScope($_smarty_tpl, "quota_level", 0);?>
                        <?php } else { ?> 
                            <?php $_smarty_tpl->tpl_vars["quota_level"] = new Smarty_Variable("low", null);
$_smarty_tpl->ext->_updateScope->updateScope($_smarty_tpl, "quota_level", 0);?>
                        <?php }?>
                        <?php if ($_smarty_tpl->tpl_vars['item']->value[$_smarty_tpl->tpl_vars['tmpkey']->value] > -1) {?>
                            <div class="quota quota_<?php echo $_smarty_tpl->tpl_vars['quota_level']->value;?>
" style="width:<?php echo $_smarty_tpl->tpl_vars['item']->value[$_smarty_tpl->tpl_vars['tmpkey']->value]*1.2;?>
px;"></div>
                            <div class="quota_bg"></div></div>
                            <div class="quota_text quota_text_<?php echo $_smarty_tpl->tpl_vars['quota_level']->value;?>
"><?php echo $_smarty_tpl->tpl_vars['linktext']->value;?>
</div>
                        <?php } else { ?>
                            <div class="quota_bg quota_no_border"></div></div>
                            <div class="quota_text"><?php echo $_smarty_tpl->tpl_vars['linktext']->value;?>
</div>
                        <?php }?>

                    <?php } elseif ($_smarty_tpl->tpl_vars['field']->value['type'] == 'txtl') {?>
                        <?php
$_from = $_smarty_tpl->tpl_vars['item']->value[$_smarty_tpl->tpl_vars['key']->value];
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_field2_6_saved_item = isset($_smarty_tpl->tpl_vars['field2']) ? $_smarty_tpl->tpl_vars['field2'] : false;
$__foreach_field2_6_saved_key = isset($_smarty_tpl->tpl_vars['key2']) ? $_smarty_tpl->tpl_vars['key2'] : false;
$_smarty_tpl->tpl_vars['field2'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['key2'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['field2']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['key2']->value => $_smarty_tpl->tpl_vars['field2']->value) {
$_smarty_tpl->tpl_vars['field2']->_loop = true;
$__foreach_field2_6_saved_local_item = $_smarty_tpl->tpl_vars['field2'];
echo $_smarty_tpl->tpl_vars['field2']->value;?>
<br> <?php
$_smarty_tpl->tpl_vars['field2'] = $__foreach_field2_6_saved_local_item;
}
if ($__foreach_field2_6_saved_item) {
$_smarty_tpl->tpl_vars['field2'] = $__foreach_field2_6_saved_item;
}
if ($__foreach_field2_6_saved_key) {
$_smarty_tpl->tpl_vars['key2'] = $__foreach_field2_6_saved_key;
}
?>
                    <?php } elseif ($_smarty_tpl->tpl_vars['field']->value['type'] == 'html') {?>
                        <?php echo $_smarty_tpl->tpl_vars['RAW_item']->value[$_smarty_tpl->tpl_vars['key']->value];?>

                    <?php } else { ?>
                        <?php echo $_smarty_tpl->tpl_vars['linktext']->value;?>

                    <?php }?>
                </td>
            <?php }?>
        <?php }?>
    <?php
$_smarty_tpl->tpl_vars['field'] = $__foreach_field_4_saved_local_item;
}
if ($__foreach_field_4_saved_item) {
$_smarty_tpl->tpl_vars['field'] = $__foreach_field_4_saved_item;
}
if ($__foreach_field_4_saved_key) {
$_smarty_tpl->tpl_vars['key'] = $__foreach_field_4_saved_key;
}
?>

    <td><?php if ($_smarty_tpl->tpl_vars['item']->value['_can_edit']) {?><a href="edit.php?table=<?php echo rawurlencode($_smarty_tpl->tpl_vars['table']->value);?>
&amp;edit=<?php echo rawurlencode($_smarty_tpl->tpl_vars['RAW_item']->value[$_smarty_tpl->tpl_vars['id_field']->value]);?>
"><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['edit'];?>
</a><?php } else { ?>&nbsp;<?php }?></td>
    <td><?php if ($_smarty_tpl->tpl_vars['item']->value['_can_delete']) {?><a href="<?php echo $_smarty_tpl->smarty->ext->configLoad->_getConfigVariable($_smarty_tpl, 'url_delete');?>
?table=<?php echo $_smarty_tpl->tpl_vars['table']->value;?>
&amp;delete=<?php echo rawurlencode($_smarty_tpl->tpl_vars['RAW_item']->value[$_smarty_tpl->tpl_vars['id_field']->value]);?>
&amp;token=<?php echo rawurlencode($_SESSION['PFA_token']);?>
"
        onclick="return confirm ('<?php echo smarty_modifier_replace($_smarty_tpl->tpl_vars['PALANG']->value[$_smarty_tpl->tpl_vars['msg']->value['confirm_delete']],'%s',$_smarty_tpl->tpl_vars['item']->value[$_smarty_tpl->tpl_vars['id_field']->value]);?>
')"><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['del'];?>
</a><?php } else { ?>&nbsp;<?php }?></td>
    </tr>
<?php
$_smarty_tpl->tpl_vars['RAW_item'] = $__foreach_RAW_item_3_saved_local_item;
}
if ($__foreach_RAW_item_3_saved_item) {
$_smarty_tpl->tpl_vars['RAW_item'] = $__foreach_RAW_item_3_saved_item;
}
if ($__foreach_RAW_item_3_saved_key) {
$_smarty_tpl->tpl_vars['itemkey'] = $__foreach_RAW_item_3_saved_key;
}
?>

</table>

<?php if ($_smarty_tpl->tpl_vars['msg']->value['can_create']) {?>
<br /><a href="edit.php?table=<?php echo rawurlencode($_smarty_tpl->tpl_vars['table']->value);?>
" class="button"><?php echo $_smarty_tpl->tpl_vars['PALANG']->value[$_smarty_tpl->tpl_vars['formconf']->value['create_button']];?>
</a><br />
<br />
<?php }?>
<br /><a href="list.php?table=<?php echo rawurlencode($_smarty_tpl->tpl_vars['table']->value);?>
&amp;output=csv"><?php echo $_smarty_tpl->tpl_vars['PALANG']->value['download_csv'];?>
</a>

</div>
<?php }
}
