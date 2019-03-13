<?php

namespace GO\Assistant;


class AssistantModule extends \GO\Professional\Module{
	public function hasInterface() {
		return false;
	}
	public function autoInstall() {
		return true;
	}
}
