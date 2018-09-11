<?php
/**
 * Special prefs handling for the 'syncmlmanagement' preference.
 *
 * Copyright 2012-2017 Horde LLC (http://www.horde.org/)
 *
 * See the enclosed file COPYING for license information (GPL). If you
 * did not receive this file, see http://www.horde.org/licenses/lgpl.
 *
 * @author   Michael Slusarz <slusarz@horde.org>
 * @category Horde
 * @license  http://www.horde.org/licenses/lgpl LGPL
 * @package  Horde
 */
class Horde_Prefs_Special_Syncml implements Horde_Core_Prefs_Ui_Special
{
    /**
     */
    public function init(Horde_Core_Prefs_Ui $ui)
    {
    }

    /**
     */
    public function display(Horde_Core_Prefs_Ui $ui)
    {
        global $page_output, $prefs, $registry;

        $page_output->addScriptFile('syncmlprefs.js', 'horde');
        $devices = Horde_SyncMl_Backend::factory('Horde')->getUserAnchors($registry->getAuth());

        $view = new Horde_View(array(
            'templatePath' => HORDE_TEMPLATES . '/prefs'
        ));
        $view->addHelper('Text');

        $partners = array();
        $format = $prefs->getValue('date_format') . ' %H:%M';

        foreach ($devices as $device) {
            $partners[] = array(
                'anchor'   => $device['syncml_clientanchor'],
                'db'       => $device['syncml_db'],
                'deviceid' => $device['syncml_syncpartner'],
                'rawdb'    => $device['syncml_db'],
                'device'   => $device['syncml_syncpartner'],
                'time'     => strftime($format, $device['syncml_serveranchor'])
            );
        }
        $view->devices = $partners;

        return $view->render('syncml');
    }

    /**
     */
    public function update(Horde_Core_Prefs_Ui $ui)
    {
        global $notification, $registry;

        $auth = $registry->getAuth();
        $backend = Horde_SyncMl_Backend::factory('Horde');

        if ($ui->vars->removedb && $ui->vars->removedevice) {
            try {
                $backend->removeAnchor($auth, $ui->vars->removedevice, $ui->vars->removedb);
                $backend->removeMaps($auth, $ui->vars->removedevice, $ui->vars->removedb);
                $notification->push(sprintf(_("Deleted synchronization session for device \"%s\" and database \"%s\"."), $ui->vars->deviceid, $ui->vars->db), 'horde.success');
            } catch (Horde_Exception $e) {
                $notification->push(_("Error deleting synchronization session:") . ' ' . $e->getMessage(), 'horde.error');
            }
        } elseif ($ui->vars->deleteall) {
            try {
                $backend->removeAnchor($auth);
                $backend->removeMaps($auth);
                $notification->push(_("All synchronization sessions deleted."), 'horde.success');
            } catch (Horde_Exception $e) {
                $notification->push(_("Error deleting synchronization sessions:") . ' ' . $e->getMessage(), 'horde.error');
            }
        }

        return false;
    }

}
