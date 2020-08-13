// Copyright 2017 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Object factory for creating audio files.
 */

import { Injectable } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';
import { Subscription } from 'rxjs';

export class FileDownloadRequest {
  filename: string;
  subscription: Subscription;

  constructor(filename: string, subscription: Subscription) {
    this.filename = filename;
    this.subscription = subscription;
  }
}

@Injectable({
  providedIn: 'root'
})
export class FileDownloadRequestObjectFactory {
  createNew(filename: string, subscription: Subscription): FileDownloadRequest {
    return new FileDownloadRequest(filename, subscription);
  }
}
angular.module('oppia').factory(
  'FileDownloadRequestObjectFactory',
  downgradeInjectable(FileDownloadRequestObjectFactory));
