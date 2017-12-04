<?php
namespace Bitrix\Crm\Format;
class TextHelper
{
	public static function convertHtmlToBbCode($html)
	{
		$html = strval($html);
		if($html === '')
		{
			return '';
		}

		$eventManager = \Bitrix\Main\EventManager::getInstance();
		$eventKey = $eventManager->addEventHandlerCompatible("main", "TextParserBeforeTags", array("\Bitrix\Crm\Format\TextHelper", "onTextParserBeforeTags"));

		$textParser = new \CTextParser();
		$textParser->allow = array("HTML" => "N", "ANCHOR" => "Y", "BIU" => "Y", "IMG" => "Y", "QUOTE" => "Y", "CODE" => "Y", "FONT" => "Y", "LIST" => "Y", "SMILES" => "Y", "NL2BR" => "N", "VIDEO" => "Y", "TABLE" => "Y", "CUT_ANCHOR" => "Y", "ALIGN" => "Y");
		$result = $textParser->convertText($html);
		$result = preg_replace("/\<br\s*\/*\>/is".BX_UTF_PCRE_MODIFIER,"\n", $result);

		$eventManager->removeEventHandler("main", "TextParserBeforeTags", $eventKey);
		return $result;
	}
	public static function onTextParserBeforeTags(&$text, &$textParser)
	{
		$text = preg_replace(array("/\&lt;/is".BX_UTF_PCRE_MODIFIER, "/\&gt;/is".BX_UTF_PCRE_MODIFIER),array('<', '>'),$text);
		$text = preg_replace("/\<br\s*\/*\>/is".BX_UTF_PCRE_MODIFIER,"\n", $text);
		$text = preg_replace("/&nbsp;/is".BX_UTF_PCRE_MODIFIER,"", $text);
		$text = preg_replace("/\<(\w+)[^>]*\>(.+?)\<\/\\1[^>]*\>/is".BX_UTF_PCRE_MODIFIER,"\\2",$text);
		$text = preg_replace("/\<*\/li\>/is".BX_UTF_PCRE_MODIFIER,"", $text);
		$text = str_replace(array("<", ">"),array("&lt;", "&gt;"),$text);
		$textParser->allow = array();
		return true;
	}

	public static function sanitizeHtml($html)
	{
		$html = strval($html);
		if($html === '' || strpos($html, '<') === false)
		{
			return $html;
		}

		$sanitizer = new \CBXSanitizer();
		$sanitizer->ApplyDoubleEncode(false);
		$sanitizer->SetLevel(\CBXSanitizer::SECURE_LEVEL_MIDDLE);
		//Crutch for for Chrome line break behaviour in HTML editor.
		$sanitizer->AddTags(array('div' => array()));
		$sanitizer->AddTags(array('a' => array('href', 'title', 'name', 'style', 'alt', 'target')));
		$sanitizer->AddTags(array('p' => array()));
		$sanitizer->AddTags(array('span' => array('style')));

		return $sanitizer->SanitizeHtml($html);
	}
}