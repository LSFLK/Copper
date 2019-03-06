<?php

namespace GO\Billing\Controller;
/*
 * Copyright Intermesh BV.
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 */

/**
 * The Site controller
 *
 * @package GO.modules.Billing
 * @version $Id: SiteController.php 19778 2014-10-06 09:30:45Z mschering $
 * @copyright Copyright Intermesh BV.
 * @author Wesley Smits wsmits@intermesh.nl
 */

class SiteController extends \GO\Site\Components\AbstractFrontController {

	protected function ignoreAclPermissions() {
		return array('*');
	}

	/**
	 * Action for a page that need to display all the invoices of the current 
	 * logged in user.
	 * 
	 * @param array $params The params that are passed through to this page
	 */
	public function actionInvoices() {
		//unset($this->invoices); //??

		$findParams = \GO\Base\Db\FindParams::newInstance()->debugSql();
		$webshop = \GO\Webshop\Model\Webshop::getBySite();

		$whereCriteria = \GO\Base\Db\FindCriteria::newInstance()
						->addCondition('user_id', \GO::user()->id)
						->addCondition('status_id', $webshop->order_success_status_id, '!=')
						->addCondition('status_id', 0, '>');
		$findParams->criteria($whereCriteria)->debugSql()->order('btime', 'DESC');

		//$this->invoices = \GO\Billing\Model\Order::model()->find($findParams)->fetchAll();

		$pager = new \GO\Site\Widgets\Pager('p', $_GET, \GO\Billing\Model\Order::model(), $findParams, \GO::user()->max_rows_list, 2);

		//$site = $this->getSite();
		//if(!empty($site->id))
		//$this->webshop = \GO\Webshop\Model\Webshop::model()->findSingleByAttribute('site_id',$site->id);
		//$params['pager'] = $pager;
		$this->render('invoices', array('pager' => $pager));
	}

//	/**
//	 * Action to download the invoice as a pdf.
//	 * 
//	 * The order_id need to be passed with the params parameter to let this 
//	 * function find the correct order.
//	 * 
//	 * @param array $params The params that are passed through to this page
//	 * @throws \GO\Base\Exception\AccessDenied 
//	 */
//	protected function actionInvoicePdf($params) {
//
//		if (isset($params['order_id']))
//			$this->order = \GO\Billing\Model\Order::model()->findByPk($params['order_id']);
//
//		if (\GO::user()->user_id != $this->order->user_id)
//			throw new \GO\Base\Exception\AccessDenied();
//
//		$filename = $this->order->order_id . '.pdf';
//		$pdf = $this->order->pdf;
//		\GO\Base\Util\Http::outputDownloadHeaders(new \GO\Base\Fs\File($filename));
//		echo $pdf->Output($filename, 'S');
//	}

	public function actionOrderFromTrial() {
		
		$this->setPageTitle("Order hosted Group-Office");

		if (\GO\Base\Util\Http::isPostRequest()) {


			$cart = new \GO\Webshop\Components\ShoppingCart();
			$cart->clear();
			
			

			$webshop = \GO\Webshop\Model\Webshop::getBySite();
			$webshoporder = $webshop->getWebshopOrder();
			$webshoporder->orderAttributes=array('reference'=>$_REQUEST['reference']);

			$months = $this->_paymentperiod($_REQUEST);

			$number_of_users = isset($_REQUEST['number_of_users']) ? $_REQUEST['number_of_users'] : 1;
			$totaluserprice = $this->_pricefromusers($number_of_users);

			//users
			$cartitem = new \GO\Webshop\Components\CartItem(
											"Hosted groupoffice for " . $number_of_users . " users per " . $months . " months.",
											$months * $totaluserprice,
											21,
											1,
											"hosting"
			);
			$cart->add($cartitem);


			$diskspace = isset($_REQUEST['diskspace']) ? $_REQUEST['diskspace'] : 1;

			//diskspace
			$cartitem = new \GO\Webshop\Components\CartItem(
											$diskspace . " GB diskspace for Group-Office per " . $months . " months.",
											$diskspace * 1 * $months,
											21,
											1,
											"diskspace"
			);
			$cart->add($cartitem);
			
			if(!empty($_REQUEST['billing'])){
				$cartitem = new \GO\Webshop\Components\CartItem(
												"Billing module for Group-Office per " . $months . " months.",
												20 * $months,
												21,
												1,
												"billing"
				);
			
				$cart->add($cartitem);
			}
			
			
			if(!empty($_REQUEST['documents'])){
				$cartitem = new \GO\Webshop\Components\CartItem(
												"Documents module for Group-Office per " . $months . " months.",
												15 * $months,
												21,
												1,
												"documents"
				);
			
				$cart->add($cartitem);
			}


			$this->redirect(array('/webshop/site/cart')); // Go to the payment selection screen	
		}

		$this->render('orderfromtrial', array('reference'=>isset($_REQUEST['reference']) ? $_REQUEST['reference'] : 'unknown trial'));
	}

//	public function actionOrderFromTrialOldf() {
//		$contact = \GO::user()->createContact();
//		$webshop = \GO\Webshop\Model\Webshop::getBySite();
//
//		$customer = $contact->company();
//		if (!$customer) {
//			$customer = new \GO\Addressbook\Model\Company();
//			$customer->addressbook_id = $contact->addressbook_id;
//		}
//
//		//prepare order model
//		$order = new \GO\Billing\Model\Order();
//		$order->book_id = $webshop->order_book_id; // Set the book
//		$order->webshop_id = $webshop->id;
//		$order->btime = time(); // Set the time for this order
//		$order->for_warehouse = 0; // Set warehouse to zero(0)
//		$order->status_id = $webshop->order_pending_status_id; // Set the order status
//		$order->language_id = GOS::site()->getSite()->language_id;
//		$order->notify_customer = true;
//		$order->reference = $_REQUEST['reference'];
//		$order->setCustomerFromCompany($customer);
//		if (!empty($contact->salutation))
//			$order->customer_salutation = $contact->salutation;
//
//		if (\GO\Base\Util\Http::isPostRequest() && isset($_POST['submitorderfromtrial'])) {
//
//			//prepare company model
//			$customer->setAttributes($_POST);
//			$customer->setPostAddressFromVisitAddress();
//
//
//
//			\GO\Base\Html\Error::checkRequired();
//			\GO\Base\Html\Error::validateModel($customer);
//			\GO\Base\Html\Error::validateModel($order, array(
//					'customer_email' => 'email',
//					'customer_vat_no' => 'vat_no',
//					'customer_country' => 'country'
//			));
//
//			if (!\GO\Base\Html\Error::hasErrors()) {
//
//				if ($customer->save() && $customer->id != $contact->company_id) {
//					$contact->company_id = $customer->id;
//					$contact->save();
//				}
//
//				// Add the customer to the order
//				$order->save(); // Save the order before adding products				
//
//
//				$months = $this->_paymentperiod($_REQUEST);
//
//				$number_of_users = isset($_REQUEST['number_of_users']) ? $_REQUEST['number_of_users'] : 1;
//				$totaluserprice = $this->_pricefromusers($number_of_users);
//
//				//users
//				$item = new \GO\Billing\Model\Item();
//				$item->order_id = $order->id;
//				$item->description = "Hosted groupoffice for " . $number_of_users . " users per " . $months . " months.";
//				$item->unit_price = $months * $totaluserprice;
//				$item->amount = 1;
//				$item->save();
//
//
//
//				$diskspace = isset($_REQUEST['diskspace']) ? $_REQUEST['diskspace'] : false;
//
//				//diskspace
//				$item = new \GO\Billing\Model\Item();
//				$item->order_id = $order->id;
//				$item->description = $diskspace . " GB diskspace for Group-Office per " . $months . " months.";
//				$item->unit_price = $diskspace * 2.5 * $months;
//				$item->amount = 1;
//				$item->save();
//
//				$order->syncItems(); // Update the order totals
//
//				$this->redirect(array('/webshop/site/payment', 'order_id' => $order->id)); // Go to the payment selection screen	
//			}
//		}
//
//
//
//		$this->render('orderfromtrial', $_REQUEST);
//	}

	private function _pricefromusers($number_of_users) {

		switch ($number_of_users) {
			case 1:
				$price = 10;
				break;
			case 2:
				$price = 19;
				break;
			case 3:
				$price = 28;
				break;
			case 4:
				$price = 36;
				break;
			case 5:
				$price = 43;
				break;
			case 6:
				$price = 50;
				break;
			case 7:
				$price = 57;
				break;
			case 8:
				$price = 63;
				break;
			case 9:
				$price = 69;
				break;
			case 10:
				$price = 74;
				break;
			case 15:
				$price = 95;
				break;
			case 20:
				$price = 109;
				break;
			case 25:
				$price = 123;
				break;
			case 30:
				$price = 134;
				break;
			case 35:
				$price = 141;
				break;
			case 40:
				$price = 146;
				break;
			case 45:
				$price = 148;
				break;
			case 50:
				$price = 150;
				break;
			default:
				$price = 10;
				break;
		}

		return $price;
	}

	private function _paymentperiod($params) {

		$period = isset($params['payment_period']) ? $params['payment_period'] : 'year';

		switch ($period) {
			case "year":
				$months = 12;
				break;
			case "halfyear":
				$months = 6;
				break;
			case "quarter":
				$months = 3;
				break;
			default:
				$months = 12;
				break;
		}

		return $months;
	}

}
