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
 * Parser for ABN-AMRO documents
 *
 * @author Sander Marechal <s.marechal@jejik.com>
 */
class Startums extends AbstractParser
{
    /**
     * @var string PCRE sub expression for the delimiter
     */
    protected $statementDelimiter = '-';

    /**
     * Test if the document is an ABN-AMRO document
     *
     * @param string $text
     * @return bool
     */
    public function accept($text)
    {
        return strpos($text, ':20:STARTUMS') !== false;
    }

    /**
     * Get the opening balance
     *
     * @param mixed $text
     * @return void
     */
    protected function openingBalance($text)
    {
        if ($line = $this->getLine('60F|60M', $text)) {
            return $this->balance($line);
        }
    }

    /**
     * Get the closing balance
     *
     * @param mixed $text
     * @return void
     */
    protected function closingBalance($text)
    {
        if ($line = $this->getLine('62F|62M', $text)) {
            return $this->balance($line);
        }
    }

    /**
     * Get the contra account from a transaction
     *
     * @param array $lines The transaction text at offset 0 and the description at offset 1
     * @return string|null
     */
    protected function contraAccount(array $lines)
    {
        if (preg_match('/^000>1([0-9]{11})/', $lines[1], $match)) {
            return ltrim($match[1], '0');
        }

        return null;
    }
	
	protected function sender(array $lines){
//		\GO::debug($lines);
		
		preg_match('/\?32([^\?]*)\?/', $lines[1], $matches);
		
		return isset($matches[1]) ? $matches[1] : '';
//		
//		$name = explode('?32', $lines[1]);
//		return isset($name[1]) ? trim(str_replace(array("?21","?33"), array("", ""),$name[1])) : '';
	}
	
	protected function description($description) {
//		$noname = explode('?32', $description);
//		return implode("\n",preg_split("/\?[0-9][0-9]/", str_replace(array("?21","?33"), array("", ""),$noname[0])));
		preg_match('/\?20([^\?]*)\?/', $description, $matches);
		
		return isset($matches[1]) ? $matches[1] : '';
	}
}
