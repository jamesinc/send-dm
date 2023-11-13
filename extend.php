<?php

/*
 * This file is part of jamesinc/send-dm.
 *
 * Copyright (c) 2023 James Ducker.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Jamesinc\SendDM;

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js'),


    new Extend\Locales(__DIR__.'/locale'),
];
