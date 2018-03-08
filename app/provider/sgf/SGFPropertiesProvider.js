'use strict';


var inherits = require('inherits');

var PropertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator');

// Require all properties you need from existing providers.
// In this case all available bpmn relevant properties without camunda extensions.
var processProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps'),
    eventProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps'),
    linkProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps'),
    documentationProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps'),
    idProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps'),
    nameProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps');
    //executableProps = require('./parts/ExecutableProps');


// Require your custom property entries.
var sgfProps = require('./parts/SGFProps');

function createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate) {

  var generalGroup = {
    id: 'general',
    label: 'General',
    entries: []
  };
  idProps(generalGroup, element, translate);
  nameProps(generalGroup, element, translate);
  processProps(generalGroup, element, translate);
  //executableProps(generalGroup, element, translate);

  var detailsGroup = {
    id: 'details',
    label: 'Details',
    entries: []
  };

  linkProps(detailsGroup, element, translate);
  eventProps(detailsGroup, element, bpmnFactory, elementRegistry, translate);
  sgfProps(detailsGroup, element); // SGF-specific

  var asyncGroup = {
    id: 'async',
    label: 'Asynchronous continuations',
    entries: []
  };

  sgfProps(asyncGroup, element); // SGF-specific

  var documentationGroup = {
    id: 'documentation',
    label: 'Documentation',
    entries: []
  };

  documentationProps(documentationGroup, element, bpmnFactory, translate);

  return[
    generalGroup,
    asyncGroup,
    detailsGroup,
    documentationGroup
  ];
}

// Create the custom magic tab
function createSGFTabGroups(element, elementRegistry) {

  var header = {
    id: 'rest-head',
    label: 'Header',
    entries: []
  };
  
  sgfProps(header, element);

  var bodyGroup = {
    id: 'rest-body',
    label: 'Request',
    entries: []
  };
  
  sgfProps(bodyGroup, element);

  return [
    header,
    bodyGroup
  ];
}


function SGFPropertiesProvider(eventBus, bpmnFactory, elementRegistry, translate) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var generalTab = {
      id: 'general',
      label: 'General',
      groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

    var restTab = {
      id: 'rest',
      label: 'REST',
      groups: createSGFTabGroups(element, elementRegistry)
    };

    return [
      generalTab,
      restTab
    ];
  };
}

inherits(SGFPropertiesProvider, PropertiesActivator);

module.exports = SGFPropertiesProvider;
