<?php


namespace GO\Billing;

use GO;


class Pdf extends \GO\Base\Util\Pdf {

	//private $font = 'helvetica';
	private $_template;
	
	private $_inTable=false;
	
	private $_headerPrinted=false;
	
	private $_pageNr = 0;
	
	private $_IS_PURCHASE_INVOICE;
	
	/**
	 *
	 * @var Model\Order 
	 */
	private $_order;

	function __construct(Model\Order $order=null) {
		if($order!==null) {
			$this->_order = $order;
			$this->_orderAttr = $order->getAttributes('formatted');
		}

		parent::__construct('P');
	}
	
	protected function init() {
		parent::init();
		

		$this->_logoPrinted = false;
				
		$this->_IS_PURCHASE_INVOICE = $this->_template['show_unit_cost']==1;
		
		$this->getAliasNbPages();

		$this->setJPEGQuality(100);
		$this->SetMargins($this->_template['margin_left'], $this->_template['margin_top'], $this->_template['margin_right']);
		
		$this->SetFillColor(241, 241, 241);
		$this->SetDrawColor(0,0,0);
		
		if(isset($this->_template['page_format']) && !empty($this->_template['page_format'])) {
			$format = explode('-', $this->_template['page_format']);
			if(empty($format[1])) $format[1] = 'P';
			$this->setPageFormat ($format[0], $format[1]);
		}


		//$this->setImageScale(4);

		$this->pageWidth = $this->getPageWidth() - $this->lMargin - $this->rMargin;

		$this->footerHeight = !empty($this->_template['footer']) ? $this->calcMultiCellHeight($this->pageWidth, 12, $this->_template['footer']) + 12 : 0;

		$this->SetAutoPageBreak(true, $this->_template['margin_bottom'] + $this->footerHeight);

		//$this->footerY = $this->h - $this->bMargin + 12;
		//go_debug($this->footerHeight);

		$this->setFooterMargin($this->_template['margin_bottom'] + $this->footerHeight);

		//$this->SetTitle($this->_order->order_id ?: 'Batchprint');
		//$this->SetSubject($this->_order->book->name . ' - ' . $this->_order->order_id);
		$this->SetAuthor(\GO::config()->title);
		$this->SetCreator('Group-Office ' . \GO::config()->version);
		//$this->SetKeywords($this->_order->order_id . ', ' . $this->_order->book->name);
	}
	
	

	function Footer() {

		if (!empty($this->_template['footer']) || !empty($this->_template['show_page_numbers'])) {
			$this->ln(12);
			//$this->SetY(($template['margin_bottom']+$this->footerHeight)*-1);

			$this->SetFont($this->font, '', $this->font_size);
			//$footer = str_replace("\r", '', $this->_template['footer']);		
			$this->table_line();
			
			$footer = $this->_order->replaceTemplateTags($this->_template['footer']);
						
			$y = $this->getY();

			
			// The value "-95" is the needed to correct the location of the page numbering. Because the text 
			// sprintf(\GO::t("Page %s of %s"),$this->getAliasNumPage(), $this->getAliasNbPages()) has template variables in it and not the 
			// actual numbers.
			
			if (!empty($this->_template['show_page_numbers'])) {
				
				$this->MultiCell($this->w-$this->_template['margin_left']-95-10, 12, $footer, 0, 'L');
				
				$this->_pageNr++;
				$this->setY($y);

//				$this->MultiCell(150, 12,  sprintf(\GO::t("Page %s of %s"), $this->getAliasNumPage(), $this->getAliasNbPages()), 0, 'R',false,1,$this->pageWidth+$this->_template['margin_right']-95);
				$this->MultiCell(150, 12,  sprintf(\GO::t("Page %s of %s"), $this->getAliasNumPage(), $this->getAliasNbPages()), 0, 'R',false,1,$this->w-$this->_template['margin_right']-95);
			} else {
				$this->MultiCell($this->w-$this->_template['margin_right']-$this->_template['margin_left'], 12, $footer, 0, 'L');
			}
		}
	}

	function Header() {
		if (!empty($this->_template['logo']) && file_exists(\GO::config()->file_storage_path . $this->_template['logo'])) {
			if (empty($this->_template['logo_only_first_page']) || !$this->_logoPrinted) {
				if (empty($this->_template['logo_width'])) {
					$this->_template['logo_width'] = $this->w;
				}

				if (empty($this->_template['logo_height'])) {
					$this->_template['logo_height'] = $this->h;
				}

				$this->SetAutoPageBreak(false);
				$this->Image(\GO::config()->file_storage_path . $this->_template['logo'], $this->_template['logo_left'], $this->_template['logo_top'], $this->_template['logo_width'], $this->_template['logo_height']);
				$this->SetAutoPageBreak(true, $this->_template['margin_bottom'] + $this->footerHeight);

//				$this->SetY($this->_template['logo_height']+$this->_template['logo_top']);
				
				$this->_logoPrinted = true;
			}
		}
		
		if (!empty($this->templateFile)) {	
			$this->numPages = $this->setSourceFile($this->templateFile);
			$this->_tplIdx = $this->importPage(1);	
			$this->useTemplate($this->_tplIdx);
		}

		if (!$this->_headerPrinted || !empty($this->_template['repeat_header'])){
			$this->_makeHeader();
			$this->_headerPrinted=true;

			$this->SetMargins($this->lMargin , $this->getY());
		}
	}

	function delete_garbage_lines($content) {
		$html_old = explode("\n", $content);
		$html_new = array();
		for ($i = 0; $i < count($html_old); $i++) {
			$keep_line = true;
			if (is_int(strpos($html_old[$i], 'DELETE_LINE'))) {
				// check if line holds more info
				$html_old[$i] = trim(str_replace('DELETE_LINE', '', $html_old[$i]));
				if (!$html_old[$i]) {
					$keep_line = false;
				}
			}

			if ($keep_line) {
				$html_new[] = $html_old[$i];
			}
		}

		return implode("\n", $html_new);
	}

	private function _replaceFields($text, $lang=array()) {
		
		$text = $this->_order->replaceTemplateTags($text);

		$text = str_replace('%title%', $this->_template['title'], $text);
		$text = str_replace('{title}', $this->_template['title'], $text);

		$html = $text;

		if (substr($html, -1, 1) != "\n") {
			$html .="\n";
		}

		$html = $this->delete_garbage_lines($html);


		$bdate = $this->_orderAttr['btime'];
		$date_sent = \GO\Base\Util\Date::get_timestamp(time(), false);

		$order_data_table = '<table width="320px">';
		
		if (!empty($this->_template['show_reference']) && $this->_orderAttr['reference']) {
			$order_data_table .= '<tr><td><b>' . $this->_template['reference_name'] . ':</b></td><td>' . $this->_orderAttr['reference'] . '</td></tr>';
		}
		
		if(GO::modules()->isInstalled("webshop") && ($linkedOrder = $this->_order->getFirstLinkedOrder())) {
			$order_data_table .= '<tr><td><b>Order no.:</b></td><td>' . $linkedOrder->order_id . '</td></tr>';
		}
		
		$order_data_table .= '<tr><td><b>' . $this->_template['number_name'] . ':</b></td><td>' . $this->_orderAttr['order_id'] . '</td></tr>'
						. '<tr><td><b>' . $this->_template['date_name'] . ':</b></td><td>' . $bdate . '</td></tr>';
		if ($this->_template['show_date_sent']) {
			$order_data_table .= '<tr><td><b>' . \GO::t("Date sent", "billing") . ':</b></td><td>' . $date_sent . '</td></tr>';
		}
		$order_data_table .= '</table>';

		$html = str_replace('%order_data%', $order_data_table, $html);
		
		return $html;
	}

	function calcMultiCellHeight($w, $h, $text) {
		$text = str_replace("\r", '', $text);
		$lines = explode("\n", $text);
		$height = count($lines) * $h;

		foreach ($lines as $line) {
			$width = $this->GetStringWidth($line);

			$extra_lines = ceil($width / $w) - 1;
			$height += $extra_lines * $h;
		}
		return $height;
	}

	function render_currency($value) {
		return $this->_order->book->currency . ' ' . \GO\Base\Util\Number::localize($value);
	}

	function render_discount($value) {
		return \GO\Base\Util\Number::localize($value, 1) . '%';
	}

	function _makeHeader() {
		$this->SetFont($this->font, '', $this->font_size);

//		if (count($this->supplier)) {
//			$this->_orderAttr = $billing->replace_contact_with_supplier($this->_orderAttr, $this->supplier);
//		}

		$this->setXY($this->_template['left_col_left'], $this->_template['left_col_top']);

		$width = $this->_template['right_col_left'] - $this->_template['left_col_left'];

		$this->SetFont($this->font, 'B', $this->font_size+6);
		$this->Cell($width, 16, $this->_template['title'], 0, 18);
		$this->SetFont($this->font, '', $this->font_size);

		$this->MultiCell($width, 12, nl2br($this->_replaceFields($this->_template['left_col'])), 0, 'J', 0, 1, '', '', true, 0, true);
		$left_col_bottom = $this->GetY();


		$this->setXY($this->_template['right_col_left'], $this->_template['right_col_top']);

		$width = $this->getPageWidth() - $this->_template['right_col_left'] - $this->_template['margin_right'];
		$this->MultiCell($width, 12, nl2br($this->_replaceFields($this->_template['right_col'])), 0, 'J', 0, 1, '', '', true, 0, true);

		$right_col_bottom = $this->getY();

		$this->setXY($this->lMargin, $left_col_bottom);

		$keep_old = false;
		if ((strpos($this->_template['left_col'], '%order_data%') === false) && (strpos($this->_template['right_col'], '%order_data%') === false) && (strpos($this->_template['right_col'], '%order_id%') === false) && (strpos($this->_template['left_col'], '%order_id%') === false)) {
			$keep_old = true;
		}

		if ($keep_old) {
			$this->ln(20);

			if (!empty($this->_template['show_reference']) && !empty($this->_orderAttr['reference'])) {
				$this->SetFont($this->font, 'B', $this->font_size);
				$this->cell(120, 12, $this->_template['reference_name'] . ':');
				$this->SetFont($this->font, '', $this->font_size);
				$this->cell(120, 12, $this->_orderAttr['reference']);
				$this->ln();
			}
			
			if(GO::modules()->isInstalled("webshop") && ($linkedOrder = $this->_order->getFirstLinkedOrder())) {				
				$this->SetFont($this->font, 'B', $this->font_size);
				$this->cell(120, 12, 'Order no.:');
				$this->SetFont($this->font, '', $this->font_size);
				$this->cell(120, 12, $linkedOrder->order_id);
				$this->ln();
				
			}

			$this->SetFont($this->font, 'B', $this->font_size);
			$this->cell(120, 12, $this->_template['number_name'] . ':');
			$this->SetFont($this->font, '', $this->font_size);
			$this->cell(120, 12, $this->_orderAttr['order_id']);
			$this->ln();

			$this->SetFont($this->font, 'B', $this->font_size);
			$this->cell(120, 12, $this->_template['date_name'] . ':');
			$this->SetFont($this->font, '', $this->font_size);
			$this->cell(120, 12, $this->_orderAttr['btime']);
			$this->ln();

			$date_sent = \GO\Base\Util\Date::get_timestamp(time(), false);

			if ($this->_template['show_date_sent']) {
				$this->SetFont($this->font, 'B', $this->font_size);
				$this->cell(120, 12, \GO::t("Date sent", "billing") . ':');
				$this->SetFont($this->font, '', $this->font_size);
				$this->cell(120, 12, $date_sent);
				$this->ln();
			}


			$left_col_bottom = $this->GetY();
		}

		if ($right_col_bottom > $left_col_bottom) {
			$this->setY($right_col_bottom);
		}


		$this->Ln(20);
		
		
	}
	
	function generate($order = null) {
		$this->endPage();
		

		if($order) {
			$this->_order=$order;
			$this->_orderAttr = $order->getAttributes('formatted');
			$this->_template = $order->status->getLanguage($this->_order->language_id)->template->getAttributes('raw');
			$this->init();
			$this->_headerPrinted=false;
			//Reset crap
			$this->cols=array();
			
			if(!empty($this->_template['stationery_paper'])){
				$stationeryPaper = \GO::config()->file_storage_path.$this->_template['stationery_paper'];
			}
			if (!empty($stationeryPaper)) {
				$this->templateFile = $stationeryPaper;
			} else
				$this->templateFile = null;
		}
		
		$oldLangIso = \GO::language()->setLanguage($this->_order->language->language);


		$this->AddPage();
		
		
		
		//restore margins
		$this->SetMargins($this->lMargin, $this->_template['margin_top']);
		

		if (!empty($this->_orderAttr['frontpage_text']) && $this->_orderAttr['frontpage_text'] != '<br>') {
			$this->SetFont($this->font, '', $this->font_size);

			$this->writeHTMLCell($this->pageWidth, 12, $this->getX(), $this->getY(), $this->prepare_html($this->_orderAttr['frontpage_text']), 0, 1);

			if ($this->_orderAttr['pagebreak'] == '1') {
				$this->AddPage();
			} else {
				$this->Ln(20);
			}
		}

		$discount = false;
		//$supplier_product_id = false;

		$i = 0;

		$items = array();

//		if (count($this->supplier)) {
//			$this->_orderAttr['costs'] = 0;
//			$this->_orderAttr['subtotal'] = 0;
//			$this->_orderAttr['total'] = 0;
//		}

		$stmt = $this->_order->items;
		
		$this->_inTable=true;

		while ($item = $stmt->fetch()) {
			if ($item->item_group_id > 0) {
				$itemGroup = Model\ItemGroup::model()->findByPk($item->item_group_id);
				if ($itemGroup)
					$suppressPrice = empty($itemGroup->summarize) && !$itemGroup->show_individual_prices;
			}
			$items[$i]['heading'] = $item->unit_price == 0 && $item->amount == 0;
			//$items[$i]['product_id'] = $items[$i]['supplier_product_id'] = $item->supplier_product_id;
			if($this->_IS_PURCHASE_INVOICE && $this->_template['show_supplier_product_id'] == '1')
				$items[$i]['supplier_product_id'] = $item->product ? $item->product->supplier_product_id : "";
			$items[$i]['discount'] = $item->discount > 0 ? $item->discount : 0;
			$items[$i]['amount'] = \GO\Base\Util\Number::localize($item->amount);
			$items[$i]['description'] = $item->getParsedDescription();
			//$items[$i]['description'] = $billing2->replace_item_description($items[$i]['description'], $this->order);
			$items[$i]['id'] = $item->id;
			$items[$i]['article_id'] = !empty($item->product) ? $item->product->article_id : '';
			$items[$i]['cost_code'] = $item->cost_code;
			
			if ($this->_IS_PURCHASE_INVOICE) {
				$items[$i]['unit_cost'] = $item->unit_cost;
				$items[$i]['unit_total_cost'] = $item->unit_cost*( (100+$item->vat) / 100 );
				$items[$i]['total_cost'] = $item->amount*$item->unit_cost;
				$items[$i]['totalincl_cost'] = $item->amount*$items[$i]['unit_total_cost'];
			} else {
				$items[$i]['unit_price'] = $item->unit_price;
				$items[$i]['unit_list'] = $item->unit_list;
				$items[$i]['unit_total'] = $item->unit_total;
				$items[$i]['total'] = $item->amount*$item->unit_price;
				$items[$i]['totalincl'] = $item->amount*$item->unit_total;
			}
			$items[$i]['vat'] = $item->vat;
				$price = !empty($item->unit_price) ? $item->unit_price : $item->unit_list;
				$netUnitPrice = (100+(float)$item->vat)*((float)$price)/100;
			$items[$i]['gross_unit_price'] = $netUnitPrice;
			$items[$i]['gross_total_price'] = ((float)$item->amount)*$netUnitPrice;
			$items[$i]['unit'] = $item->unit;
			$items[$i]['markup'] = $item->markup;
			$items[$i]['item_group_name'] = isset($item->item_group_name) ? $item->item_group_name : '';
			$items[$i]['summarize'] =!empty($item->summarize);
			$items[$i]['suppress_price'] = !empty($suppressPrice);
			//$items[$i]['item_price'] = $items[$i]['amount'] * $items[$i]['unit_price'];

			if ($item->discount > 0) {
				$discount = true;
			}
//			if ($item->supplier_product_id > 0) {
//				$supplier_product_id = true;
//			}
			$i++;
		}
//		
//		var_dump($items);
//		exit();


		//$new_item_group = $item_group_name != $billing->f('item_group_name');
		//$item_group_name = $billing->f('item_group_name');
//			if (count($this->supplier)) {
//				$this->_orderAttr['costs'] += $billing->f('amount') * $billing->f('unit_cost');
//				$this->_orderAttr['subtotal'] += $billing->f('amount') * $billing->f('unit_price');
//				$this->_orderAttr['total'] += $billing->f('amount') * $billing->f('unit_total');
//			}
//			if (!empty($item_group_name)) {
//				if ($billing->f('summarize')) {
//					if (!empty($new_item_group)) {
//						$items[$i]['heading'] = false;
//						$items[$i]['amount'] = 1;
//						$items[$i]['description'] = $item_group_name;
//						$total_vat = $billing->f('vat') * $billing->f('amount');
//						$total_amount = $billing->f('amount');
//						$items[$i]['vat'] = $total_vat / $total_amount;
////															$items[$i]['unit_cost']=$billing->f('unit_cost');
////															$items[$i]['unit_price']=$billing->f('unit_price');
////															$items[$i]['unit_list']=$billing->f('unit_list');
////															$items[$i]['unit_total']=$billing->f('unit_total');
//						$items[$i]['unit_list'] = $items[$i]['unit_total'] = $items[$i]['unit_price'] = $items[$i]['item_total'] = $items[$i]['total'] = $billing->f('total');
//						$items[$i]['item_price'] = $billing->f('amount') * $items[$i]['unit_price'];
//					} else {
//						$i--;
////															$items[$i]['unit_cost']+=$billing->f('unit_cost');
////															$items[$i]['unit_price']+=$billing->f('unit_price');
////															$items[$i]['unit_list']+=$billing->f('unit_list');
////															$items[$i]['unit_total']+=$billing->f('amount')*$billing->f('unit_total');
//						$total_vat += $billing->f('vat') * $billing->f('amount');
//						$total_amount += $billing->f('amount');
//						$items[$i]['vat'] = $total_vat / $total_amount;
//						$items[$i]['unit_list'] = $items[$i]['unit_total'] = $items[$i]['unit_price'] = $items[$i]['item_total'] = $items[$i]['total']+=$billing->f('total');
//						$items[$i]['item_price']+=$billing->f('amount') * $items[$i]['unit_price'];
//					}
//				} else {
//					if (!empty($new_item_group)) {
//						$items[$i]['heading'] = true;
//						$items[$i]['amount'] = 0;
//						$items[$i]['unit_price'] = 0;
//						$items[$i]['total'] = 0;
//						$items[$i]['description'] = $item_group_name;
//						$i++;
//					}
//					$items[$i] = $this->createItem($billing, $billing2);
//				}
//			} else {
//				$items[$i] = $this->createItem($billing, $billing2);
//
//				if ($billing->f('discount') > 0) {
//					$discount = true;
//				}
//				if ($billing->f('supplier_product_id') > 0) {
//					$supplier_product_id = true;
//				}
//			}
//		$i++;
//		}


		//$this->_description_width = $discount ? $this->pageWidth-270 : $this->pageWidth-210;


		$this->_description_width = $this->pageWidth;

		if ($discount) {
			$this->_description_width -=50;
		}

		if ($this->_IS_PURCHASE_INVOICE && $this->_template['show_supplier_product_id'] == '1') {
			$this->_description_width -=100;
		}

		if ($this->_template['show_amounts'] == '1') {
			$this->_description_width -=50;
		}

//		if ($this->_IS_PURCHASE_INVOICE) { //$this->_template['show_unit_cost'] == '1') {
//			$this->_description_width -=240;
//		} else {
		
			if ($this->_template['show_units'] == '1') {
				$this->_description_width -=50;
			}
		
			if ($this->_template['show_nett_unit_price'] == '1') {
				$this->_description_width -=90;
			}

			if ($this->_template['show_nett_total_price'] == '1') {
				$this->_description_width -=80;
			}

			if ($this->_template['show_gross_unit_price'] == '1') {
				$this->_description_width -=90;
			}

			if ($this->_template['show_gross_total_price'] == '1') {
				$this->_description_width -=80;
			}
	
	if ($this->_template['show_product_number'] == '1') {
		$this->_description_width -=60;
	}
			
	if ($this->_template['show_item_id'] == '1') {
		$this->_description_width -=40;
	}
			
	if ($this->_template['show_cost_code'] == '1') {
		$this->_description_width -=60;
	}
			
//		}
		
		if ($this->_template['show_vat'] == '1') {
			$this->_description_width -=40;
		}
		//start items table

		if ($this->_template['show_item_id'] == '1') {
			$this->cols[] = array('index' => 'id', 'name' => 'ID', 'width' => 40, 'align' => 'R');
		}
		
		if ($this->_template['show_product_number'] == '1') {
			$this->cols[] = array('index' => 'article_id', 'name' => \GO::t("Art.no.", "billing"), 'width' => 60, 'align' => 'R');
		}
		
		$this->cols[] = array('index' => 'description', 'name' => \GO::t("Description", "billing"), 'width' => $this->_description_width, 'align' => 'L');

		if ($this->_template['show_cost_code'] == '1') {
			$this->cols[] = array('index' => 'cost_code', 'name' => \GO::t("Cost code", "billing"), 'width' => 60, 'align' => 'R');
		}
		
		if ($this->_template['show_amounts'] == '1') {
			$this->cols[] = array('index' => 'amount', 'name' => \GO::t("Quantity", "billing"), 'width' => 50, 'align' => 'R');
		}
		
		if ($this->_template['show_units'] == '1') {
			$this->cols[] = array('index' => 'unit', 'name' => \GO::t("Unit", "billing"), 'width' => 50, 'align' => 'R');
		}
		
		if ($this->_IS_PURCHASE_INVOICE && $this->_template['show_supplier_product_id'] == '1') {
			$this->cols[] = array('index' => 'supplier_product_id', 'name' => \GO::t("Product number", "billing"), 'width' => 100, 'align' => 'L');
		}

		if ($discount) {
			$this->cols[] = array('index' => 'discount', 'name' => \GO::t("Discount", "billing"), 'width' => 50, 'align' => 'R', 'renderer' => 'render_discount');
		}
		if ($this->_template['show_vat'] == '1') {
			$this->cols[] = array('index' => 'vat', 'name' => \GO::t("Tax", "billing"), 'width' => 40, 'align' => 'R', 'renderer' => 'render_discount');
		}
		if ($this->_IS_PURCHASE_INVOICE) {//$this->_template['show_unit_cost'] == '1') {
			if ($this->_template['show_nett_unit_price'] == '1')
				$this->cols[] = array('index' => 'unit_cost', 'name' => \GO::t("Cost excl.", "billing"), 'width' => 90, 'align' => 'R', 'renderer' => 'render_currency');
			
			if ($this->_template['show_gross_unit_price'] == '1')
				$this->cols[] = array('index' => 'unit_total_cost', 'name' => \GO::t("Cost incl.", "billing"), 'width' => 90, 'align' => 'R', 'renderer' => 'render_currency');
			
			if ($this->_template['show_nett_total_price'] == '1')
				$this->cols[] = array('index' => 'total_cost', 'name' => \GO::t("Total nett", "billing"), 'width' => 80, 'align' => 'R', 'renderer' => 'render_currency');

			if ($this->_template['show_gross_total_price'] == '1')
				$this->cols[] = array('index' => 'totalincl_cost', 'name' => \GO::t("Gross total", "billing"), 'width' => 80, 'align' => 'R', 'renderer' => 'render_currency');
			
		} else {
			if ($this->_template['show_nett_unit_price'] == '1') {
				$this->cols[] = array('index' => 'unit_price', 'name' => \GO::t("Unit price", "billing"), 'width' => 90, 'align' => 'R', 'renderer' => 'render_currency');
			}
			if ($this->_template['show_gross_unit_price'] == '1') {
				$this->cols[] = array('index' => 'gross_unit_price', 'name' => \GO::t("Gross", "billing"), 'width' => 90, 'align' => 'R', 'renderer' => 'render_currency');
			}
			if ($this->_template['show_nett_total_price'] == '1') {
				$this->cols[] = array('index' => 'total', 'name' => \GO::t("Total", "billing"), 'width' => 80, 'align' => 'R', 'renderer' => 'render_currency');
			}
			if ($this->_template['show_gross_total_price'] == '1') {
				$this->cols[] = array('index' => 'gross_total_price', 'name' => \GO::t("Gross total", "billing"), 'width' => 80, 'align' => 'R', 'renderer' => 'render_currency');
			}
		}
		/* else
		  {
		  $this->cols[]=array('index'=>'unit_price', 'name'=>'', 'width'=>90, 'align'=>'R', '');
		  $this->cols[]=array('index'=>'total', 'name'=>'', 'width'=>80, 'align'=>'R', '');
		  } */

		$rows = array();


//		if ($this->_template['use_html_table'] != '1') {
			$this->table_header();
//		}

		$startY = $this->GetY();
		$startX = $this->GetX();

//		if ($this->_template['use_html_table'] == '1') {
//			$currencies = array('unit_cost', 'unit_price', 'unit_list', 'unit_total', 'item_price', 'item_total');
//			$html_table_totals_column = 0;
//			$html_table_columns_num = 0;
//
//			$html = '<table border="0" cellpadding="3" width="100%">';
//
//			preg_match('/\{thead([^}]*)\}(.*)\{\/thead\}/sU', $this->_template['html_table'], $matched_col_tags);
//			if (isset($matched_col_tags[2])) {
//				preg_match_all('/\<td([^}]*)\>(.*)\<\/td\>/sU', $matched_col_tags[2], $matched_col_cells);
//				if (isset($matched_col_cells[0])) {
//					for ($i = 0; $i < count($matched_col_cells[0]); $i++) {
//						preg_match('/\<td([^}]*)\>(.*)\<\/td\>/sU', $matched_col_cells[0][$i], $cell_parameters);
//						if (isset($cell_parameters) && strpos($cell_parameters[1], 'totals="') !== false) {
//							$html_table_totals_column = $i + 1;
//						}
//
//						$html_table_columns_num++;
//					}
//				}
//
//				$html .= '<thead>' . $matched_col_tags[2] . '</thead>';
//			}
//
//			if (count($items)) {
//				preg_match('/\{row([^}]*)\}(.*)\{\/row\}/sU', $this->_template['html_table'], $matched_row_tags);
//				if (isset($matched_row_tags[2])) {
//					foreach ($items as $item) {
//						$v = $matched_row_tags[2];
//						foreach ($item as $key => $value) {
//							if ($key == 'description') {
//								$value = nl2br($value);
//							}
//							if (in_array($key, $currencies)) {
//								$value = $this->render_currency($value);
//							}
//
//							$v = str_replace('{' . $key . '}', $value, $v);
//						}
//						$html .= $v;
//					}
//				}
//			} else {
//				preg_match('/\{norows([^}]*)\}(.*)\{\/norows\}/sU', $this->_template['html_table'], $matched_norows_tags);
//				$html .= $matched_norows_tags[2];
//			}
//		} else {
			
			$lastItem = array(
					'group_name'=>'',
					'total'=>0,
					'total_incl'=>0
				);
			
			$summarizedItem = array();
			
			foreach ($items as $k => $item) {	
				
				 
				
				$this->_checkPageBreak();
				
				if(!empty($item['item_group_name']) && $lastItem['group_name']!=$item['item_group_name']){					
					$this->_onNewGroup($item,$summarizedItem,$lastItem);	
					if ($item['description'] == 'PAGEBREAK') {
						continue;
					}
				} else
				{
				
					if ($item['description'] == 'PAGEBREAK') {						
						$this->AddPage();			
						$this->table_header();
						continue;
					}
				}
				
				
				// The following 18 lines are for either adding up the numbers for the
				// summarized item, otherwise for the normal printing of the current
				// (non-summarized) item.
				
				$lastItem['total']+= !$this->_IS_PURCHASE_INVOICE ? $item['total'] : $item['total_cost'];
				$lastItem['total_incl']+= !$this->_IS_PURCHASE_INVOICE ? $item['totalincl'] : $item['totalincl_cost'];
				
				$this->_handleSingleItem($item,$summarizedItem);
				
			}
			
			if(!empty($summarizedItem)) {
				$this->_printItem($summarizedItem);
			} elseif(!empty($lastItem['group_name'])){
				$w=80;
				
				if ($this->_template['show_nett_total_price'] == '1' && $this->_template['show_gross_total_price'] == '1')
					$this->MultiCell($w, 16, $this->_order->book->currency.' '.\GO\Base\Util\Number::localize($lastItem['total']), 'T', 'R', false,0,$this->pageWidth+$this->lMargin-$w*2);
				elseif ($this->_template['show_nett_total_price'] == '1')
					$this->MultiCell($w, 16, $this->_order->book->currency.' '.\GO\Base\Util\Number::localize($lastItem['total']), 'T', 'R', false,1,$this->pageWidth+$this->lMargin-$w);

				if ($this->_template['show_gross_total_price'] == '1')
					$this->MultiCell($w, 16, $this->_order->book->currency.' '.\GO\Base\Util\Number::localize($lastItem['total_incl']), 'T', 'R', false,1,$this->pageWidth+$this->lMargin-$w);	
				
				$this->ln(4);
			}
			
			
			$this->_checkPageBreak();
			
			
//		}


//		if ($this->_template['use_html_table'] != '1') {
			$this->table_line();
//		}
		
		$this->_inTable=false;

//		if ($this->_IS_PURCHASE_INVOICE) {
//			
//			$this->Ln(10);			
//
//			$width = 0;
//			for ($i = 0; $i < count($this->cols) - 1; $i++) {
//				$width += $this->cols[$i]['width'];
//			}
//
//			$first_col_width = $width;
//			$second_col_width = $this->cols[count($this->cols) - 1]['width'];
//
//			$costsTotals = $this->_order->getCostsTotals();
//
//			$this->Cell($first_col_width, 16, \GO::t("Sub-total", "billing") . ': ' . $this->_order->book->currency, 0, 0, 'R');
//			$this->Cell($second_col_width, 16, \GO\Base\Util\Number::localize($costsTotals['subtotal']), 0, 0, 'R');
//			$this->Ln();
//				
//			$vatTotals = $this->_order->totalsCostsPerVatPercentage();
//
//			$count = count($vatTotals);
//			while ($record = array_shift($vatTotals)) {
//				$count--;
//
//				$border = $count == 0 ? 'B' : 0;
//				$vat = $record['amount'] * $record['vat'] / 100;
//
//				if ($this->_template['use_html_table'] != '1') {
//					$this->Cell($first_col_width, 16, \GO::t("Tax", "billing"). ' (' . $record['vat'] . '%): ' . $this->_order->book->currency, 0, 0, 'R');
//					$this->Cell($second_col_width, 16, \GO\Base\Util\Number::localize($vat), $border, 0, 'R');
//					$this->Ln();
//				}
//			}
//
//			$this->Ln();
//				
//			$this->Cell($first_col_width, 16, \GO::t("Total", "billing") . ': ' . $this->_order->book->currency, 0, 0, 'R');
//			$this->Cell($second_col_width, 16, \GO\Base\Util\Number::localize($costsTotals['total']), 0, 0, 'R');
//
//			$this->Ln(40);
//			
//		} else	
		if (($this->_template['show_summary_totals'] == 1) || $this->_template['use_html_table'] == 1) {

//			if ($this->_template['use_html_table'] != '1') {
				$this->Ln(10);

				$width = 0;
				for ($i = 0; $i < count($this->cols) - 1; $i++) {
					$width += $this->cols[$i]['width'];
				}

				if ($this->_template['show_nett_total_price'] == 0 && $this->_template['show_nett_unit_price'] == 0 && $this->_template['show_gross_unit_price'] == 0 && $this->_template['show_gross_total_price'] == 0  && $this->_template['show_gross_total_cost'] == 0) {
					$first_col_width = 70;
					$second_col_width = 60;
					$this->setX($this->pageWidth - 100);
				} else {
					$first_col_width = $width;
					$second_col_width = $this->cols[count($this->cols) - 1]['width'];
				}

			if ($this->_IS_PURCHASE_INVOICE)
				$vatTotals = $this->_order->totalsCostsPerVatPercentage();
			else
				$vatTotals = $this->_order->totalsPerVatPercentage();

			$count = count($vatTotals);
				
				if ($this->_tooLittleSpace($count)) {
					$this->AddPage();
				}
				
				$this->Cell($first_col_width, 16, \GO::t("Sub-total", "billing") . ': ' . $this->_order->book->currency, 0, 0, 'R');
				if ($this->_IS_PURCHASE_INVOICE) {
					$costsTotals = $this->_order->getCostsTotals();
					$this->Cell($second_col_width, 16, \GO\Base\Util\Number::localize($costsTotals['subtotal']), 0, 0, 'R');
				} else {
					$this->Cell($second_col_width, 16, $this->_orderAttr['subtotal'], 0, 0, 'R');
				}
				$this->Ln();
				
//			} else {
//				$html_total_column_left[] = \GO::t("Sub-total", "billing") . ': ' .$this->_order->book->currency;
//				$html_total_column_right[] = $this->_orderAttr['subtotal'];
//			}

			
			while ($record = array_shift($vatTotals)) {
				$count--;

				$border = $count == 0 ? 'B' : 0;
				$vat = $record['amount'] * $record['vat'] / 100;

				if ($this->_template['use_html_table'] != '1') {
					if ($this->_template['show_nett_total_price'] == 0 && $this->_template['show_nett_unit_price'] == 0 && $this->_template['show_gross_unit_price'] == 0 && $this->_template['show_gross_total_price'] == 0) {
						$this->setX($this->pageWidth - 100);
					}
					$this->Cell($first_col_width, 16, \GO::t("Tax", "billing"). ' (' . $record['vat'] . '%): ' . $this->_order->book->currency, 0, 0, 'R');
					$this->Cell($second_col_width, 16, \GO\Base\Util\Number::localize($vat), $border, 0, 'R');

					$this->Ln();
				}
//				} else {
//					$html_total_column_left[] = \GO::t("Tax", "billing") . ' (' . $record['vat'] . '%): ' . $this->_order->book->currency;
//					$html_total_column_right[] = \GO\Base\Util\Number::localize($vat);
//				}
			}

//			if ($this->_template['use_html_table'] != '1') {
				$this->Ln();

				if ($this->_template['show_nett_total_price'] == 0 && $this->_template['show_nett_unit_price'] == 0 && $this->_template['show_gross_unit_price'] == 0 && $this->_template['show_gross_total_price'] == 0) {
					$this->setX($this->pageWidth - 100);
				}

				$this->Cell($first_col_width, 16, \GO::t("Total", "billing") . ': ' . $this->_order->book->currency, 0, 0, 'R');
				if ($this->_IS_PURCHASE_INVOICE) {
					$this->Cell($second_col_width, 16, \GO\Base\Util\Number::localize($costsTotals['total']), 0, 0, 'R');
				} else {
					$this->Cell($second_col_width, 16, $this->_orderAttr['total'], 0, 0, 'R');
				
					if ($this->_template['show_total_paid']==1) {
						$this->Ln();
						if ($this->_template['show_nett_total_price'] == 0 && $this->_template['show_nett_unit_price'] == 0 && $this->_template['show_gross_unit_price'] == 0 && $this->_template['show_gross_total_price'] == 0) {
							$this->setX($this->pageWidth - 100);
						}
						$this->Cell($first_col_width, 16, \GO::t("Total paid", "billing") . ': ' . $this->_order->book->currency, 0, 0, 'R');
						$this->Cell($second_col_width, 16, $this->_orderAttr['total_paid'], 0, 0, 'R');
					}
					
				}
//			} else {
//				$html_total_column_left[] = \GO::t("Total", "billing") . ': ' . $this->_order->book->currency;
//				$html_total_column_right[] = $this->_orderAttr['total'];
//
//				$html .= '<tr>'
//								. '<td colspan="' . $html_table_columns_num . '" style="border-top: #000 1px solid;">&nbsp;</td>'
//								. '</tr>';
//
//				if ($html_table_totals_column > $html_table_columns_num) {
//					$html_table_totals_column = $html_table_columns_num;
//				}
//
//				for ($i = 0; $i < count($html_total_column_left); $i++) {
//					$html .= '<tr>';
//
//					if ($html_table_totals_column > 2) {
//						$html .= '<td colspan="' . ($html_table_totals_column - 2) . '"></td>';
//					}
//
//					$html .= '<td align="right">' . $html_total_column_left[$i] . '</td>';
//					$html .= '<td align="right">' . $html_total_column_right[$i] . '</td>';
//
//					if ($html_table_columns_num != $html_table_totals_column) {
//						$html .= '<td colspan="' . ($html_table_columns_num - $html_table_totals_column) . '"></td>';
//					}
//
//					$html .= '</tr>';
//				}
//
//				$html .= '</table>';
//
//				$this->writeHTML($html, false, false, false, false, '');
//
//				$this->Ln(3);
//			}

		} 
		$this->Ln(40);


		if (!empty($this->_template['closing'])) {
			
			if ($this->_order->total_paid==$this->_order->total) {
					$paidStatus = 'fully_paid';
			} elseif ($this->_order->total_paid==0) {
					$paidStatus = 'nothing_paid';
			} else {
					$paidStatus = 'partially_paid';
			}
			
			$templateParser = new \GO\Base\Util\TemplateParser();
			
			$this->_template['closing'] = $templateParser->parse(
							$this->_template['closing'],
							array(
									$paidStatus=>true,
									'total'=>$this->_order->book->currency.\GO\Base\Util\Number::localize($this->_order->total),
									'total_paid'=>$this->_order->book->currency.\GO\Base\Util\Number::localize($this->_order->total_paid),
									'to_be_paid'=>$this->_order->book->currency.\GO\Base\Util\Number::localize($this->_order->total - $this->_order->total_paid)
							),
							true
						);

			// Also enable the template tags in the closing text
			$this->_template['closing'] = $this->_order->replaceTemplateTags($this->_template['closing'],false); ////
			
			$this->_template['closing'] = $this->prepare_html($this->_template['closing']);
			$closing = $this->_replaceFields($this->_template['closing']) . "\n<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n";

			//$this->writeHTMLCell($this->pageWidth, 16, 0,0, $closing);
			//var_dump($closing);exit();

			$this->writeHTML($closing);


			//$this->ln(10);
		}

//		$params = array(&$this);

//		if (\GO::modules()->isInstalled('projects')) {
//			
//			/**
//			 * If there are any detailed (unsummarized) hour items for this order,
//			 * print them here.
//			 */
//
//			$unsumItemsStmt = \GO\Projects\Model\OrderUnsummarizedItem::model()
//				->findByAttribute('order_id',$this->_orderAttr['id'], \GO\Base\Db\FindParams::newInstance()->select('t.*'));			
//			if ($unsumItemsStmt->rowCount() > 0) {
//
//				$nextPenPosition = array(
//					'endOfCurrentLine' => 0,
//					'beginningOfNextLine' => 1,
//					'onderaan' => 2
//				);
//				
//				$columnAttributes = array(
//					array(
//						'name' => \GO::t("nUnits", "projects"),
//						'fieldId' => 'amount',
//						'width' => 60,
//						'height' => 17,
//						'textAlign' => 'R'
//					),
//					array(
//						'name' => \GO::t("descriptionCol", "projects"),
//						'fieldId' => 'description',
//						'width' => 320,
//						'height' => 17,
//						'textAlign' => 'L'
//					),
//					array(
//						'name' => \GO::t("unitPrice", "projects"),
//						'fieldId' => 'unit_price',
//						'width' => 60,
//						'height' => 17,
//						'textAlign' => 'L'
//					),
//					array(
//						'name' => str_replace(array('<b>','</b>'),array('',''),\GO::t("total", "projects")),
//						'fieldId' => 'totalPrice',
//						'width' => 80,
//						'height' => 17,
//						'textAlign' => 'L'
//					)
//				);
//				
//				$headerAttributes = array(
//					'borderWidth' => 0,
//					'firstTextAlign' => 'R',
//					'textAlign' => 'L',
//					'lastTextAlign' => 'L',
//					'paintBackground' => false,
//					'url' => '',
//					'nextPosition' => $nextPenPosition['endOfCurrentLine'],
//				);
//				
////				$rowAttributes = array(
////					'borderWidth' => 1
////				);
//				
//				$rows = array();
//
//				$this->AddPage();
//				
//				$this->SetFont($this->font, '', $this->font_size);
//
//				$this->writeHTMLCell($this->pageWidth, 12, $this->getX(), $this->getY(), $this->prepare_html(\GO::t("Day specifications", "billing")), 0, 1);
//
//				$this->Ln(20);
//
//				$this->_detailedHoursHeader($columnAttributes, $headerAttributes);
//				
//				// Second part: write a table row for every item.
//				while ($item = $unsumItemsStmt->fetch())
//					$this->_detailedHoursRow($columnAttributes,$item->getAttributes(),$headerAttributes);
//
//				$this->table_line();
//			}
//			
//			$this->Cell(10,10, ' ');
//
//			\GO::language()->setLanguage($oldLangIso);
//		}
	}
	
	
	private $_pageBreak=false;
	
	private function _checkPageBreak(){
		if($this->_pageBreak){
			
			$this->_pageBreak = false;

			$this->AddPage();
			
			$this->table_header();
		}
	}
		
	private function _detailedHoursHeader($columnAttributes, $headerAttributes) {
		$this->SetFillColor(241, 241, 241);
		$this->SetFont($this->font, '', $this->font_size+1);
		
		foreach ($columnAttributes as $colKey => $singleColumnAttributes) {
			// set the custom alignment for first and last columns
			switch ($colKey) {
				case 0:
					$textAlign = $headerAttributes['firstTextAlign'];
					break;
				case count($columnAttributes)-1:
					$textAlign = $headerAttributes['lastTextAlign'];
					break;
				default:
					$textAlign = $headerAttributes['textAlign'];
					break;
			}
			
			$this->Cell(
				$singleColumnAttributes['width'],
				$singleColumnAttributes['height'],
				$singleColumnAttributes['name'],
				'TB',
				$headerAttributes['borderWidth'],
				$textAlign,
				1
			);
		}
		$this->SetFont($this->font, '', $this->font_size);
		$this->ln(18);
	}
	
	private function _detailedHoursRow($columnAttributes,$itemAttributes,$headerAttributes) {
				
//		if ($this->_pagePositionReached(0.85)) {
//			$this->AddPage();
//			
//			$this->_detailedHoursHeader($columnAttributes, $headerAttributes);
//		}

		$itemAttributes['totalPrice'] = $itemAttributes['total'];
		foreach ($columnAttributes as $colKey => $singleColumnAttributes) {
			if ($singleColumnAttributes['fieldId']!='description') {
				// For adding currency prefix for the text if this is a money cell
				switch($singleColumnAttributes['fieldId']) {
					case 'unit_total':
					case 'totalPrice':
						$textPrefix = $this->_order->book->currency;
						break;
					default:
						$textPrefix = '';
						break;
				}
				
				$this->Cell(
					$singleColumnAttributes['width'],
					$singleColumnAttributes['height']+2,
					$textPrefix.' '.$itemAttributes[$singleColumnAttributes['fieldId']],
					0, 0,
					$singleColumnAttributes['textAlign']);
			} else {
				// We save the description for last, because this is a Multicell
				$descriptionX = $this->getX();
				$descriptionY = $this->getY();
				$descriptionRowAttributes = array(
					$singleColumnAttributes['width'],
					$singleColumnAttributes['height'],
					$itemAttributes[$singleColumnAttributes['fieldId']],
					0, $singleColumnAttributes['textAlign']					
				);
				
				$this->SetX($descriptionX + $singleColumnAttributes['width']);
			}
			//$endOfRowX = $this->getX();
		}
		
		// Insert Multicell description
		$this->setXY($descriptionX,$descriptionY+3);

		$this->MultiCell(
			$descriptionRowAttributes[0],
			$descriptionRowAttributes[1],
			$descriptionRowAttributes[2],
			$descriptionRowAttributes[3],
			$descriptionRowAttributes[4]						
		);
		
		//$this->setX($endOfRowX);
		
//		$this->ln(2);
	}
	
	private function _printItem($item){
		if ($item['heading']) {
			$this->ln(6);
			$this->SetFont($this->font, '', 11);
			$this->MultiCell($this->pageWidth, 16, $item['description'], 0, 1);
			$this->ln(4);
			$this->SetFont($this->font, '', $this->font_size);
		} else {

			//check if this row will go to the next page and add page if necessary
			$this->checkPageBreak(16);

			for ($i = 0; $i < count($this->cols); $i++) {
				if ($this->cols[$i]['index'] == 'description') {
					$this->_description_pos['x'] = $this->getX();
					$this->_description_pos['y'] = $this->getY();
					$description_index = $i;

					$this->SetX($this->_description_pos['x'] + $this->cols[$i]['width']);
//				} elseif (
//						(
//								empty($item['suppress_price']) &&
//									( $this->_template['show_nett_total_price'] == '1' || $this->_template['show_nett_unit_price'] == '1' || $this->_template['show_gross_unit_price'] == '1' || $this->_template['show_gross_total_price'] == '1' || $this->_template['show_unit_cost'] == '1' )
//						)
//						|| $this->cols[$i]['index'] == 'amount'
//					) {
				}else{
					//go_debug($this->getY());
					
					$value='';
					if(isset($this->cols[$i]['index']) && (empty($item['suppress_price']) || strpos($this->cols[$i]['index'], 'price')===false)){					

						if (isset($this->cols[$i]['renderer'])) {
							$value = $this->{$this->cols[$i]['renderer']}($item[$this->cols[$i]['index']]);
						} else {

							$value = $item[$this->cols[$i]['index']];
						}
					}



					$this->Cell($this->cols[$i]['width'], 16, $value, 0, 0, $this->cols[$i]['align']);
				}
			}

			//go_debug($this->_description_pos['x'].','.$this->_description_pos['y'].': '.substr($item[$this->cols[$description_index]['index']],0,10));
			$this->setXY($this->_description_pos['x'], $this->_description_pos['y'] + 1.5);
			//add the description last because a very long description might jump to the next page
//					if ($description_index=='gross_total_price' || $description_index=='totalincl')
			$this->MultiCell($this->cols[$description_index]['width'], 14, $item[$this->cols[$description_index]['index']], 0, 'L');

			$this->Ln(3);
		}
	}

	function prepare_html($html) {
		$html = trim($html);
		$html = str_replace("\r", '', $html);
		$html = str_replace("\n", '', $html);

		$html = preg_replace_callback(
						'/<font(.)size="([^"])"/', function($matches) {
            if(!strpos($matches[2], "px"))
            	return "<font".$matches[1]."size=\"".($matches[2]*5)."px\"";
            else
            	return "<font".$matches[1]."size=\"".$matches[2]."\"";
            
						}, $html
		);

		$html = htmlspecialchars_decode($html); // Restore &amp; to & (For image urls etc.) 
		
		return $html;
	}

	function table_header() {
		$this->SetFillColor(241, 241, 241);
		$this->SetFont($this->font, '', $this->font_size+1);

		for ($i = 0; $i < count($this->cols); $i++) {
			$this->Cell($this->cols[$i]['width'], 14, $this->cols[$i]['name'], 'TB', 0, $this->cols[$i]['align'], 1);
		}
		$this->SetFont($this->font, '', $this->font_size);
		$this->Ln(18);
	}

	function table_line() {
		$this->Line($this->getX(), $this->getY(), $this->pageWidth + $this->lMargin, $this->getY());
	}

	private function _onNewGroup( &$item, &$summarizedItem, &$lastItem ) {
		
		// Handle previous item info:
		
		if(!empty($summarizedItem)) {
			
			// If there is a (finished) $summarizedItem from the previous iteration: print
			// it here.
			$this->_printItem($summarizedItem);
			
		} elseif(!empty($lastItem['group_name'])){
			$w=80;
			if ($this->_template['show_nett_total_price'] == '1' && $this->_template['show_gross_total_price'] == '1')
				$this->MultiCell($w, 16, $this->_order->book->currency.' '.\GO\Base\Util\Number::localize($lastItem['total']), 'T', 'R', false,0,$this->pageWidth+$this->lMargin-$w*2);
			elseif ($this->_template['show_nett_total_price'] == '1')
				$this->MultiCell($w, 16, $this->_order->book->currency.' '.\GO\Base\Util\Number::localize($lastItem['total']), 'T', 'R', false,1,$this->pageWidth+$this->lMargin-$w);

			if ($this->_template['show_gross_total_price'] == '1')
				$this->MultiCell($w, 16, $this->_order->book->currency.' '.\GO\Base\Util\Number::localize($lastItem['total_incl']), 'T', 'R', false,1,$this->pageWidth+$this->lMargin-$w);

			$this->ln(4);
		}
		
		
		if ($item['description'] == 'PAGEBREAK') {
			//do not insert page break directly because we might need to print a group summary first
			$this->AddPage();			
			$this->table_header();			
		}

				
		if(!empty($item['summarize'])){

			$summarizedItem = array();

			$summarizedItem['heading'] = false;
			$summarizedItem['product_id'] = 0;
			$summarizedItem['discount'] = 0;
			$summarizedItem['amount'] = 1;
			$summarizedItem['description'] = $item['item_group_name'];
			$summarizedItem['unit_cost'] = 0;
			$summarizedItem['unit_price'] = 0;
			$summarizedItem['unit_list'] = 0;
			$summarizedItem['gross_unit_price'] = 0;
			$summarizedItem['unit_total'] = 0;
			$summarizedItem['unit_total_cost'] = 0;
			$summarizedItem['gross_total_price'] = 0;
			$summarizedItem['total'] = 0;
			$summarizedItem['total_cost'] = 0;
			$summarizedItem['vat'] = 0;
			$summarizedItem['unit'] = "";
			$summarizedItem['markup'] = 0;
			$summarizedItem['totalincl_cost'] = 0;

		}else
		{

			$this->ln(4);
			$this->SetFont($this->font, 'I', 11);
			$this->MultiCell($this->pageWidth, 16, $item['item_group_name'], 0, 'L');
			$this->ln(2);
			$this->SetFont($this->font, '', $this->font_size);

			$summarizedItem = array();
			
		}

		$lastItem['total']=0;
		$lastItem['group_name']=$item['item_group_name'];
		
	}
	
	private function _handleSingleItem( &$item, &$summarizedItem ) {
		
		if(!empty($item['summarize'])) {

			if ($this->_IS_PURCHASE_INVOICE) {
				$summarizedItem['unit_cost']+=$item['unit_cost']*$item['amount'];
				$summarizedItem['unit_total_cost']+=$item['unit_total_cost']*$item['amount'];
				$summarizedItem['total_cost']+=$item['total_cost'];
				$summarizedItem['totalincl_cost']+=$item['totalincl_cost'];
				$summarizedItem['vat']= $item['unit_cost']!=0 ? ($item['unit_total_cost']/$item['unit_cost'] - 1)*100 : 0;
			} else {
				$summarizedItem['unit_price']+=$item['unit_price']*$item['amount'];
				$summarizedItem['unit_list']+=$item['unit_list']*$item['amount'];
				$summarizedItem['gross_unit_price']+=$item['gross_unit_price']*$item['amount'];
				$summarizedItem['unit_total']+=$item['unit_total'];
				$summarizedItem['gross_total_price']+=$item['gross_total_price'];
				$summarizedItem['total']+=$item['total'];
				$summarizedItem['vat']= $item['unit_price']!=0 ? ($item['unit_total']/$item['unit_price'] - 1)*100 : 0;
			}
		}else
		{
			$this->_printItem($item);
		}
		
	}
	
	private function _tooLittleSpace($nVatLines) {
		
		$estimatedNeededLines = $nVatLines+2;
		
		return $this->getPageHeight()-48<=$estimatedNeededLines*16+$this->getY();
		
	}
	
}

