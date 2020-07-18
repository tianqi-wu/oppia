// Copyright 2014 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Service for manipulating the page URL. Also allows
 * functions on $window to be mocked in unit tests.
 */

import { downgradeInjectable } from '@angular/upgrade/static';
import { Injectable } from '@angular/core';

import { WindowRef } from 'services/contextual/window-ref.service';

// This makes the UrlParamsType like a dict whose keys and values both are
// string.
interface UrlParamsType {
  [param: string]: string
}

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  constructor(private windowRef: WindowRef) {}

   /**
   * Returns the current location.
   * @return {boolean} the current location.
   */
  getCurrentLocation(): Location {
    return this.windowRef.nativeWindow.location;
  }

   /**
   * Returns the current query string.
   * @return {boolean} the current query string.
   */
  getCurrentQueryString(): string {
    return this.getCurrentLocation().search;
  }
  /* As params[key] is overwritten, if query string has multiple fieldValues
     for same fieldName, use getQueryFieldValuesAsList(fieldName) to get it
     in array form. */

  /* This function returns an object which has dynamic keys
   since the keys generated depend on the URL being provided.
  So exact type of this function can not be determined
  https://github.com/oppia/oppia/pull/7834#issuecomment-547896982 */
  getUrlParams(): UrlParamsType {
    let params = {};
    let parts = this.getCurrentQueryString().replace(
      /[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        return params[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    );
    return params;
  }

  /**
   * Returns whether the url is framed.
   * @return {boolean} whether the url is framed.
   */
  isIframed(): boolean {
    let pathname = this.getPathname();
    let urlParts = pathname.split('/');
    return urlParts[1] === 'embed';
  }

  /**
   * Returns the current path name.
   * @return {string} the current path name.
   */
  getPathname(): string {
    return this.getCurrentLocation().pathname;
  }

  /**
   * Gets the topic id from url.
   * @return {string} the topic id.
   * @throws Will throw an error if the url is invalid.
   */
  getTopicIdFromUrl(): string {
    let pathname = this.getPathname();
    if (pathname.match(/\/topic_editor\/(\w|-){12}/g)) {
      return pathname.split('/')[2];
    }
    throw new Error('Invalid topic id url');
  }

  /**
   * Gets the topic name from the learner's url.
   * @return {string} the topic name.
   * @throws Will throw an error if the url is invalid.
   */
  getTopicNameFromLearnerUrl(): string {
    let pathname = this.getPathname();
    if (pathname.match(/\/(story|topic|subtopic|practice_session)/g)) {
      return decodeURIComponent(pathname.split('/')[2]);
    }
    throw new Error('Invalid URL for topic');
  }

  /**
   * Gets the classroom name from the learner's url.
   * @return {string} the classroom name.
   * @throws Will throw an error if the url is invalid.
   */
  getClassroomNameFromUrl(): string {
    let pathname = this.getPathname();
    let argumentsArray = pathname.split('/');
    if (argumentsArray.length === 2) {
      return decodeURIComponent(pathname.split('/')[1]);
    }
    throw new Error('Invalid URL for classroom');
  }

  /**
   * Gets the subtopic id from the learner's url.
   * @return {string} the subtopic id.
   * @throws Will throw an error if the url is invalid.
   */
  getSubtopicIdFromUrl(): string {
    let pathname = this.getPathname();
    let argumentsArray = pathname.split('/');
    if (pathname.match(/\/subtopic/g) && argumentsArray.length === 4) {
      return decodeURIComponent(argumentsArray[3]);
    }
    throw new Error('Invalid URL for subtopic');
  }

  /**
   * Gets the story id from the learner's url.
   * @return {string} the story id.
   * @throws Will Throw an error if the url is invalid.
   */
  getStoryIdFromUrl(): string {
    let pathname = this.getPathname();
    if (pathname.match(/\/(story_editor|review_test)\/(\w|-){12}/g)) {
      return pathname.split('/')[2];
    }
    throw new Error('Invalid story id url');
  }

  /**
   * Gets the story id from the viewer's url.
   * @return {string} the story id.
   * @throws Will throw an error if the url is invalid.
   */
  getStoryIdFromViewerUrl(): string {
    let pathname = this.getPathname();
    if (pathname.match(/\/story\/(\w|-){12}/g)) {
      return pathname.split('/')[2];
    }
    throw new Error('Invalid story id url');
  }


  /**
   * Gets the story id from the player.
   * @return {string} the story id if the id exists.
   */
  getStoryIdInPlayer(): string | null {
    let query = this.getCurrentQueryString();
    let queryItems = query.split('&');
    for (let i = 0; i < queryItems.length; i++) {
      let part = queryItems[i];
      if (part.match(/\?story_id=((\w|-){12})/g)) {
        return part.split('=')[1];
      }
    }
    return null;
  }

  /**
   * Gets the skill id from the url.
   * @return {string} the skill id.
   * @throws Will throw an error if the skill Id is invalid.
   */
  getSkillIdFromUrl(): string {
    let pathname = this.getPathname();
    let skillId = pathname.split('/')[2];
    if (skillId.length !== 12) {
      throw new Error('Invalid Skill Id');
    }
    return skillId;
  }

  /**
   * Gets the query values as a list.
   * @param {string} fieldName - the name of the field.
   * @return {Array<string>} the list of query field values.
   */
  getQueryFieldValuesAsList(fieldName: string): Array<string> {
    let fieldValues = [];
    if (this.getCurrentQueryString().indexOf('?') > -1) {
      // Each queryItem return one field-value pair in the url.
      let queryItems = this.getCurrentQueryString().slice(
        this.getCurrentQueryString().indexOf('?') + 1).split('&');
      for (let i = 0; i < queryItems.length; i++) {
        let currentFieldName = decodeURIComponent(
          queryItems[i].split('=')[0]);
        let currentFieldValue = decodeURIComponent(
          queryItems[i].split('=')[1]);
        if (currentFieldName === fieldName) {
          fieldValues.push(currentFieldValue);
        }
      }
    }
    return fieldValues;
  }

  /**
   * Adds the url, the field name, and the field value together.
   * @param {string} url - the url.
   * @param {string} fieldName - the field name.
   * @param {string} fieldValue - the field value.
   * @return {Array<string>} the list of query field values.
   */
  addField(url: string, fieldName: string, fieldValue: string): string {
    let encodedFieldValue = encodeURIComponent(fieldValue);
    let encodedFieldName = encodeURIComponent(fieldName);
    return url + (url.indexOf('?') !== -1 ? '&' : '?') + encodedFieldName +
        '=' + encodedFieldValue;
  }

  /**
   * Gets the hashed value from the current location.
   */
  getHash(): string {
    return this.getCurrentLocation().hash;
  }

  /**
   * Gets the origin from the current location.
   */
  getOrigin(): string {
    return this.getCurrentLocation().origin;
  }

  /**
   * Gets the collection id from the exploration url.
   * @return {string} a collection id if the url parameter doesn't have a 'parent' property  
   * but have a 'collection_id' property; @return {null} if otherwise.
   */
  getCollectionIdFromExplorationUrl(): string | null {
    let urlParams: UrlParamsType = this.getUrlParams();
    if (urlParams.hasOwnProperty('parent')) {
      return null;
    }
    if (urlParams.hasOwnProperty('collection_id')) {
      return urlParams.collection_id;
    }
    return null;
  }

  /**
   * Gets the username from the profile url.
   * @return {string} the username.
   * @throws Will throw exception if the profile URL is invalid.
   */
  getUsernameFromProfileUrl(): string {
    let pathname = this.getPathname();
    if (pathname.match(/\/(profile)/g)) {
      return decodeURIComponent(pathname.split('/')[2]);
    }
    throw new Error('Invalid profile URL');
  }

  /**
   * Gets the collection id from the url.
   * @return {string} the collection id.
   * @throws Will throw exception if the profile URL is invalid.
   */
  getCollectionIdFromUrl(): string {
    let pathname = this.getPathname();
    if (pathname.match(/\/(collection)/g)) {
      return decodeURIComponent(pathname.split('/')[2]);
    }
    throw new Error('Invalid collection URL');
  }

  /**
   * Gets the collection id from the editor url.
   * @return {string} the collection id.
   * @throws Will throw exception if the editor URL is invalid.
   */
  getCollectionIdFromEditorUrl(): string {
    let pathname = this.getPathname();
    if (pathname.match(/\/(collection_editor\/create)/g)) {
      return decodeURIComponent(pathname.split('/')[3]);
    }
    throw new Error('Invalid collection editor URL');
  }

  /**
   * Gets the exploration version id from the url.
   * @return {number} the exploration version from Url if an exploration version can be extracted;
   * {null} if otherwise.
   */
  getExplorationVersionFromUrl(): number | null {
    let urlParams: UrlParamsType = this.getUrlParams();
    if (urlParams.hasOwnProperty('v')) {
      let version = urlParams.v;
      if (version.includes('#')) {
        // For explorations played in an iframe.
        version = version.substring(0, version.indexOf('#'));
      }
      return Number(version);
    }
    return null;
  }
}

angular.module('oppia').factory(
  'UrlService', downgradeInjectable(UrlService));
