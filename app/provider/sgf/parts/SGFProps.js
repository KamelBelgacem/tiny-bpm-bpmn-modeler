'use strict';

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');
var participantHelper = require('bpmn-js-properties-panel/lib/helper/ParticipantHelper');

var is = require('bpmn-js/lib/util/ModelUtil').is,
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

module.exports = function(group, element) {

  if ( group.id == 'async'
    && (
              is(element, 'bpmn:StartEvent') ||
              is(element, 'bpmn:ServiceTask') ||
              is(element, 'bpmn:ScriptTask') ||
              is(element, 'bpmn:SubProcess')
    )) {    
      group.entries.push(entryFactory.checkbox({
        id: 'async',
        label: 'Asynchronous',
        description: 'Check to perform this in a background thread',
        modelProperty: 'isAsync'
      }));
  }

  // Process/Participant execution (details)
  if ( group.id == 'details' && (is(element, 'bpmn:Process') || (is(element, 'bpmn:Participant') && getBusinessObject(element).get('processRef')))) {
    var executableEntry = entryFactory.checkbox({
      id: 'process-is-executable',
      label: 'Executable',
      modelProperty: 'isExecutable'
    });

    // in participants we have to change the default behavior of set and get
    if (is(element, 'bpmn:Participant')) {
      executableEntry.get = function(element) {
        return participantHelper.getProcessBusinessObject(element, 'isExecutable');
      };

      executableEntry.set = function(element, values) {
        return participantHelper.modifyProcessBusinessObject(element, 'isExecutable', values);
      };
    }

    group.entries.push(executableEntry);
  }

  // Manual tasks
  if (is(element, 'bpmn:ManualTask')) {
    if (group.id == 'details') {
      group.entries.push(entryFactory.textBox({
        id : 'participants',
        description : 'The people or entities involved in this manual task',
        label : 'Involved participants',
        modelProperty : 'participants'
      }));
    }
  }

  // User tasks
  if (is(element, 'bpmn:UserTask')) {
    if (group.id == 'details') {
      group.entries.push(entryFactory.textField({
        id : 'assignee',
        description : 'The person/account automatically assigned to the task (no claiming is needed if set).',
        label : 'Assignee',
        modelProperty : 'assignee'
      }));
      group.entries.push(entryFactory.textField({
        id : 'candidateUsers',
        description : 'Comma-separated list of candidate users. The task will be available for all of them and one will have to claim it.',
        label : 'Candidate users',
        modelProperty : 'candidateUsers'
      }));
      group.entries.push(entryFactory.textField({
        id : 'candidateGroups',
        description : 'Comma-separated list of candidate user groups. The task will be availlable for all users in these groups.',
        label : 'Candidate groups',
        modelProperty : 'candidateGroups'
      }));
      group.entries.push(entryFactory.textField({
        id : 'dueDate',
        description : 'Task due date in ISO format or EL expression (ie: ${dueDate} or 2018-12-31T23:59:59)',
        label : 'Due date',
        modelProperty : 'dueDate'
      }));
    }
  }

  // Sequence flows
  if (is(element, 'bpmn:SequenceFlow')) {
    if (group.id == 'details') {
      group.entries.push(entryFactory.textField({
        id : 'seq-condition',
        description : 'A condition attached to this flow, if any (i.e.: "${!confirmed}", "${code == 200}", "${name != \"value\"}")',
        label : 'Condition',
        modelProperty : 'seqCondition'
      }));
    }
  }

  // Business Rule Tasks
  if (is(element, 'bpmn:BusinessRuleTask')) {
    if (group.id == 'details') {
      group.entries.push(entryFactory.textField({
        id : 'dmnRef',
        description : 'Reference to the deployed DMN decision table',
        label : 'Decision reference',
        modelProperty : 'dmnRef'
      }));
      group.entries.push(entryFactory.textField({
        id : 'dmnRefVer',
        description : 'DMN decision table version (use "last" to use the latest one)',
        label : 'Decision version',
        modelProperty : 'dmnRefVer'
      }));
      group.entries.push(entryFactory.textField({
        id : 'dmnRefVer',
        description : 'DMN decision table version (use "last" to use the latest one)',
        label : 'Decision version',
        modelProperty : 'dmnRefVer'
      }));
      group.entries.push(entryFactory.textField({
        id : 'dmnResultVariable',
        description : 'Name of the resulting variable. Only one result for one matching rule is supported.',
        label : 'Result variable',
        modelProperty : 'resultVariable'
      }));
    }
  }

  // Script Tasks
  if (is(element, 'bpmn:ScriptTask')) {
    if (group.id == 'details') {
      group.entries.push(entryFactory.selectBox({
        id : 'scriptLang',
        description : 'Scripting language used',
        label : 'Language',
        modelProperty : 'lang',
        selectOptions: [
          { name: 'Groovy', value: 'groovy' },
          { name: 'JavaScript', value: 'javascript' },
          { name: 'JUEL', value: 'juel' }
        ]
      }));
      group.entries.push(entryFactory.textBox({
        id : 'scriptCode',
        description : 'Script code',
        label : 'Code',
        modelProperty : 'code'
      }));
      group.entries.push(entryFactory.textField({
        id : 'scriptResultVariable',
        description : 'Name of the resulting variable (if any)',
        label : 'Result variable',
        modelProperty : 'resultVariable'
      }));
    }
  }

  // Service tasks
  if (is(element, 'bpmn:ServiceTask')) {
    if (group.id == 'details') {        
      group.entries.push(entryFactory.selectBox({
        id : 'addin',
        description : 'Service task add-in',
        label : 'Add-in',
        modelProperty : 'addIn',
        selectOptions: [
          { name: 'Generic REST API Call', value: 'GENERIC_REST' } //,
          /*{ name: 'SG|Connect', value: 'SGX' },
          { name: 'SG|Docs', value: 'SGD' },
          { name: 'SG|Monitoring', value: 'SGM' },
          { name: 'TMon', value: 'TMON' }*/
        ]
      }));
      group.entries.push(entryFactory.textField({
        id : 'status-code-varname',
        description : 'Variable to store the status code (do not use EL)',
        label : 'Status code variable',
        modelProperty : 'statusCodeVariable'
      }));
      group.entries.push(entryFactory.textField({
        id : 'response-headers-varname',
        description : 'Variable to store the response headers (do not use EL)',
        label : 'Response headers variable',
        modelProperty : 'responseHeadersVariable'
      }));
      group.entries.push(entryFactory.textField({
        id : 'response-body-varname',
        description : 'Variable to store the response body (do not use EL)',
        label : 'Response body variable',
        modelProperty : 'responseBodyVariable'
      }));
    }

    if (group.id == 'rest-head') {      
      group.entries.push(entryFactory.textField({
        id : 'accept',
        description : 'Accepted content-type',
        label : 'Accept',
        modelProperty : 'accept'
      }));
      group.entries.push(entryFactory.textField({
        id : 'contentType',
        description : 'Body content-type (ie: "application/json")',
        label : 'Content type',
        modelProperty : 'contentType'
      }));
      group.entries.push(entryFactory.textField({
        id : 'authHeader',
        description : 'Authentication header content (i.e: "Bearer ${token}", "Basic ${encodedCreds}")',
        label : 'Authorization header',
        modelProperty : 'authHeader'
      }));
      group.entries.push(entryFactory.textBox({
        id : 'otherHeaders',
        label : 'Additionnal headers',
        description: 'One per line',
        modelProperty : 'otherHeaders'
      }));
    }

    if (group.id == 'rest-body') {
      group.entries.push(entryFactory.textField({
        id : 'baseUrl',
        description : 'Base URL to the API',
        label : 'Base URL',
        modelProperty : 'baseUrl'
      }));
      group.entries.push(entryFactory.selectBox({
        id : 'method',
        description : 'HTTP Method',
        label : 'Method',
        modelProperty : 'method',
        selectOptions: [
          { name: 'POST', value: 'POST' },
          { name: 'GET', value: 'GET' },
          { name: 'PUT', value: 'PUT' },
          { name: 'PATCH', value: 'PATCH' },
          { name: 'DELETE', value: 'DELETE' },
          { name: 'HEAD', value: 'HEAD' }
        ]
      }));
      group.entries.push(entryFactory.textField({
        id : 'resource',
        description : 'REST Resource',
        label : 'Resource',
        modelProperty : 'resource'
      }));
      group.entries.push(entryFactory.textBox({
        id : 'body',
        description : 'Request body content',
        label : 'Request body',
        modelProperty : 'body'
      }));
    }
  }
};
