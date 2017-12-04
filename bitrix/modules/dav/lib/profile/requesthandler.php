<?php

namespace Bitrix\Dav\Profile;

use Bitrix\Dav\Profile\Response\Base;
use Bitrix\Main\Context;
use Bitrix\Main\HttpResponse;
use Bitrix\Main\Web\Json;

/**
 * Class RequestHandler
 * @package Bitrix\Dav\Profile
 */
class RequestHandler extends HttpResponse
{
	protected static $validActions = array('payload', 'token');

	public $user;
	protected $actionName;
	protected $request;

	private $responseHandler;

	/**
	 * RequestHandler constructor.
	 */
	public function __construct()
	{
		parent::__construct(Context::getCurrent());
		global $USER;
		$request = $this->context->getRequest();
		$this->user = $USER;
		$action = $request->get('action');
		$this->actionName = !empty($action) ? $action : '';
		if (in_array($this->actionName, static::$validActions))
		{
			switch ($this->actionName)
			{
				case 'payload':
					$this->setHandler(new Response\Payload\Base($request));
					break;
				case 'token':
					$this->setHandler(new Response\Token());
					break;
			}
		}
	}


	/**
	 * @return true Write response (some error, token, or payload file).
	 */
	public function process()
	{
		if (!$this->getHandler() instanceof Base)
		{
			$this->setHeader('HTTP/1.0 404 Not Found');
			$this->setHeader('Content-Type: application/json');
			$this->writeHeaders();
			$this->writeBody(Json::encode(array('error_messages' => array($this->getNotAvailableActionErrorMessage()))));
			return true;
		}

		foreach ($this->getHandler()->getHeaders() as $header)
		{
			$this->setHeader($header);
		}
		$this->writeHeaders();
		$this->writeBody($this->getHandler()->getBody());
		return true;
	}

	/**
	 * @param Response\Base $responseHandler Handler of response for current request.
	 * @return void
	 */
	public function setHandler(Response\Base $responseHandler)
	{
		$this->responseHandler = $responseHandler;
	}

	/**
	 * @return Response\Base
	 */
	public function getHandler()
	{
		return $this->responseHandler;
	}

	/**
	 * @return string
	 */
	private function getNotAvailableActionErrorMessage()
	{
		return $this->actionName ? 'action parameter "' . $this->actionName . '" is not available' : 'action parameter is required';
	}

}