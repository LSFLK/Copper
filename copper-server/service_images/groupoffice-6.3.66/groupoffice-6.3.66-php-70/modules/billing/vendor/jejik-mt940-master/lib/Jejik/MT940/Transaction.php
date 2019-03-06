<?php

/*
 * This file is part of the Jejik\MT940 library
 *
 * Copyright (c) 2012 Sander Marechal <s.marechal@jejik.com>
 * Licensed under the MIT license
 *
 * For the full copyright and license information, please see the LICENSE
 * file that was distributed with this source code.
 */

namespace Jejik\MT940;

/**
 * An MT940 transaction
 *
 * @author Sander Marechal <s.marechal@jejik.com>
 */
class Transaction
{
    // Properties {{{

    /**
     * @var StringHelper Contra account number
     */
    private $contraAccount;

    /**
     * @var float Transaction amount
     */
    private $amount;

    /**
     * @var StringHelper Description
     */
    private $description;

    /**
     * @var \DateTime Date of the actual transaction
     */
    private $valueDate;

    /**
     * @var \DateTime Date the transaction was booked
     */
    private $bookDate;
		
		private $sender;

    // }}}

    // Getters and setters {{{

    /**
     * Getter for contraAccount
     *
     * @return StringHelper
     */
    public function getContraAccount()
    {
        return $this->contraAccount;
    }

    /**
     * Setter for contraAccount
     *
     * @param StringHelper $contraAccount
     * @return $this
     */
    public function setContraAccount($contraAccount)
    {
        $this->contraAccount = $contraAccount;
        return $this;
    }

    /**
     * Getter for amount
     *
     * @return float
     */
    public function getAmount()
    {
        return $this->amount;
    }

    /**
     * Setter for amount
     *
     * @param float $amount
     * @return $this
     */
    public function setAmount($amount)
    {
        $this->amount = $amount;
        return $this;
    }

    /**
     * Getter for description
     *
     * @return StringHelper
     */
    public function getDescription()
    {
        return $this->description;
    }
		
    /**
     * Setter for description
     *
     * @param StringHelper $description
     * @return $this
     */
    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }
		
		
		public function getSender(){
			return $this->sender;
		}
		
		public function setSender($sender){
			$this->sender=$sender;
			return $this;
		}

    /**
     * Getter for valueDate
     *
     * @return \DateTime
     */
    public function getValueDate()
    {
        return $this->valueDate;
    }

    /**
     * Setter for valueDate
     *
     * @param \DateTime $valueDate
     * @return $this
     */
    public function setValueDate($valueDate)
    {
        $this->valueDate = $valueDate;
        return $this;
    }

    /**
     * Getter for bookDate
     *
     * @return \DateTime
     */
    public function getBookDate()
    {
        return $this->bookDate;
    }

    /**
     * Setter for bookDate
     *
     * @param \DateTime $bookDate
     * @return $this
     */
    public function setBookDate($bookDate)
    {
        $this->bookDate = $bookDate;
        return $this;
    }

    // }}}
}
