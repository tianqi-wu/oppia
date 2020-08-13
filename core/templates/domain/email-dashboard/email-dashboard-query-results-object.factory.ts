// Copyright 2020 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Frontend domain object factory for email dashboard query
 * results.
 */

import { downgradeInjectable } from '@angular/upgrade/static';
import { Injectable } from '@angular/core';

import {
  EmailDashboardQuery,
  EmailDashboardQueryDict,
  EmailDashboardQueryObjectFactory
} from 'domain/email-dashboard/email-dashboard-query-object.factory';

export interface EmailDashboardQueryResultsBackendDict {
  'cursor': string;
  'recent_queries': EmailDashboardQueryDict[];
}

export class EmailDashboardQueryResults {
  cursor: string;
  recentQueries: EmailDashboardQuery[];

  constructor(cursor: string, recentQueries: EmailDashboardQuery[]) {
    this.cursor = cursor;
    this.recentQueries = recentQueries;
  }
}

@Injectable({
  providedIn: 'root'
})
export class EmailDashboardQueryResultsObjectFactory {
  constructor(
    private emailDashboardQueryObjectFactory:
    EmailDashboardQueryObjectFactory) {}

  createFromBackendDict(
      backendDict: EmailDashboardQueryResultsBackendDict):
      EmailDashboardQueryResults {
    let queryObjects: EmailDashboardQuery[] = [];

    for (let queryDict of backendDict.recent_queries) {
      queryObjects.push(
        this.emailDashboardQueryObjectFactory.createFromQueryDict(queryDict));
    }

    return new EmailDashboardQueryResults(
      backendDict.cursor, queryObjects);
  }
}

angular.module('oppia').factory(
  'EmailDashboardQueryResultsObjectFactory',
  downgradeInjectable(EmailDashboardQueryResultsObjectFactory));
