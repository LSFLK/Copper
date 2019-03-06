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

namespace Jejik\MT940\Parser;

/**
 * Parser for Rabobank documents
 *
 * @author Sander Marechal <s.marechal@jejik.com>
 */
class Rabobank extends AbstractParser
{
    /**
     * @var StringHelper PCRE sub expression for the delimiter
     */
    protected $statementDelimiter = '';

    /**
     * Test if the document is an ING document
     *
     * @param StringHelper $text
     * @return bool
     */
    public function accept($text)
    {
        return substr($text, 0, 5) === ':940:';
    }

    /**
     * Parse an account number
     *
     * @param StringHelper $text Statement body text
     * @return StringHelper|null
     */
    protected function accountNumber($text)
    {
        if ($account = $this->getLine('25', $text)) {
            if (preg_match('/^[0-9.]+/', $account, $match)) {
                return str_replace('.', '', $match[0]);
            }
        }

        return null;
    }

    /**
     * Get the contra account from a transaction
     *
     * @param array $lines The transaction text at offset 0 and the description at offset 1
     * @return StringHelper|null
     */
    protected function contraAccount(array $lines)
    {
        if (!preg_match('/(\d{6})((?:C|D)R?)([0-9,]{15})(N\d{3})([0-9 ]{16})/', $lines[0], $match)) {
            return null;
        }

        return rtrim(ltrim($match[5], '0'));
    }
		
		
		protected function sender(array $lines){
//			\GO::debug($lines);
			return trim(substr($lines[0],41));
		}
}
