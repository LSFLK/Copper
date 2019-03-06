<?php
if(!empty($argv[1])) {
	define('GO_CONFIG_FILE', $argv[1]);
}

require('GO.php');

//new framework
\go\modules\core\core\model\CronJobSchedule::runNext();


GO()->debug("Running cron for legacy framework");

//old framework
function findNextCron(){
	$currentTime = new \GO\Base\Util\Date\DateTime();

		$findParams = \GO\Base\Db\FindParams::newInstance()
			->single()
			->criteria(\GO\Base\Db\FindCriteria::newInstance()
				->addCondition('nextrun', $currentTime->getTimestamp(),'<')
				->addCondition('active',true)
			);
		
		return \GO\Base\Cron\CronJob::model()->find($findParams);
}

$jobAvailable = false;
\GO::debug('CRONJOB START (PID:'.getmypid().')');
while($cronToHandle = findNextCron()){
	$jobAvailable = true;
	\GO::debug('CRONJOB FOUND');
	$cronToHandle->run();
}

if(!$jobAvailable)
	\GO::debug('NO CRONJOB FOUND');

\GO::debug('CRONJOB STOP (PID:'.getmypid().')');
\GO::config()->save_setting('cron_last_run', time());





