<?php

namespace GO\Gota;


class GotaModule extends \GO\Professional\Module{
	public function hasInterface() {
		return false;
	}
	public function autoInstall() {
		return false;
	}
}
