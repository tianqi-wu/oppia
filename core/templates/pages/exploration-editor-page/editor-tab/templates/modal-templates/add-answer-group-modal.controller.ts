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
 * @fileoverview Controller for add answer group modal.
 */

require(
  'components/common-layout-directives/common-elements/' +
  'confirm-or-cancel-modal.controller.ts');

require(
  'components/state-editor/state-editor-properties-services/' +
  'state-editor.service.ts');
require('domain/exploration/OutcomeObjectFactory.ts');
require('domain/exploration/RuleObjectFactory.ts');
require(
  'pages/exploration-editor-page/services/editor-first-time-events.service.ts');
require('services/generate-content-id.service.ts');

angular.module('oppia').controller('AddAnswerGroupModalController', [
  '$controller', '$scope', '$uibModalInstance', 'EditorFirstTimeEventsService',
  'GenerateContentIdService', 'OutcomeObjectFactory', 'RuleObjectFactory',
  'StateEditorService', 'addState', 'currentInteractionId',
  'existingContentIds', 'stateName', 'COMPONENT_NAME_FEEDBACK',
  'INTERACTION_SPECS',
  function(
      $controller, $scope, $uibModalInstance, EditorFirstTimeEventsService,
      GenerateContentIdService, OutcomeObjectFactory, RuleObjectFactory,
      StateEditorService, addState, currentInteractionId,
      existingContentIds, stateName, COMPONENT_NAME_FEEDBACK,
      INTERACTION_SPECS) {
    $controller('ConfirmOrCancelModalController', {
      $scope: $scope,
      $uibModalInstance: $uibModalInstance
    });
    $scope.feedbackEditorIsOpen = false;
    $scope.addState = addState;
    $scope.questionModeEnabled =
      StateEditorService.isInQuestionMode();
    $scope.openFeedbackEditor = function() {
      $scope.feedbackEditorIsOpen = true;
    };
    $scope.isCorrectnessFeedbackEnabled = function() {
      return StateEditorService.getCorrectnessFeedbackEnabled();
    };
    // This returns false if the current interaction ID is null.
    $scope.isCurrentInteractionLinear = function() {
      return (
        currentInteractionId &&
        INTERACTION_SPECS[currentInteractionId].is_linear);
    };
    $scope.tmpRule = RuleObjectFactory.createNew(null, {});
    var feedbackContentId = GenerateContentIdService.getNextId(
      existingContentIds, COMPONENT_NAME_FEEDBACK);
    $scope.tmpOutcome = OutcomeObjectFactory.createNew(
      $scope.questionModeEnabled ? null : stateName,
      feedbackContentId, '', []);

    $scope.isSelfLoopWithNoFeedback = function(tmpOutcome) {
      return (
        tmpOutcome.dest ===
        stateName && !tmpOutcome.hasNonemptyFeedback());
    };

    $scope.addAnswerGroupForm = {};

    $scope.saveResponse = function(reopen) {
      $scope.$broadcast('saveOutcomeFeedbackDetails');
      $scope.$broadcast('saveOutcomeDestDetails');

      EditorFirstTimeEventsService.registerFirstSaveRuleEvent();
      // Close the modal and save it afterwards.
      $uibModalInstance.close({
        tmpRule: angular.copy($scope.tmpRule),
        tmpOutcome: angular.copy($scope.tmpOutcome),
        reopen: reopen
      });
    };
  }
]);
