﻿/*
* Slickflow 工作流引擎遵循LGPL协议，也可联系作者商业授权并获取技术支持；
* 除此之外的使用则视为不正当使用，请您务必避免由此带来的商业版权纠纷。

The Slickflow Designer project.
Copyright (C) 2014  .NET Workflow Engine Library

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, you can access the official
web page about lgpl: https://www.gnu.org/licenses/lgpl.html
*/

var mxfile = (function () {
    function mxfile() {
    }

    mxfile.getActivityObject = function (activityElement, nameType) {
        var activity = {};

        activity.id = activityElement.getAttribute("id");
        if (nameType === "name") {
            activity.name = activityElement.getAttribute("name");
        } else if (nameType === "label") {
            activity.name = activityElement.getAttribute("label");
        }
        activity.code = activityElement.getAttribute("code");
        activity.url = activityElement.getAttribute("url");

        return activity;
    }

    mxfile.setActivityTypeElement = function (activityTypeElement, activity) {
        if (activity.type === kmodel.Config.NODE_TYPE_START
            || activity.type === kmodel.Config.NODE_TYPE_INTERMEDIATE
            || activity.type === kmodel.Config.NODE_TYPE_END) {

            activityTypeElement.setAttribute("trigger", activity.trigger);
            if (activity.trigger === "Timer") {
                activityTypeElement.setAttribute("expression", activity.expression);
            }
        } else if (activity.type === kmodel.Config.NODE_TYPE_MULTIPLEINSTANCE) {
            activityTypeElement.setAttribute("complexType", activity.complexType);
            activityTypeElement.setAttribute("mergeType", activity.mergeType);
            activityTypeElement.setAttribute("compareType", activity.compareType);
            activityTypeElement.setAttribute("completeOrder", activity.completeOrder);
        } else if (activity.type === kmodel.Config.NODE_TYPE_GATEWAY) {
            activityTypeElement.setAttribute("gatewaySplitJoinType", activity.gatewaySplitJoinType);
            activityTypeElement.setAttribute("gatewayDirection", activity.gatewayDirection);
            if (activity.gatewayDirection === gatewayproperty.Direction.EOrJoin) {
                activityTypeElement.setAttribute("gatewayJoinPass", activity.gatewayJoinPass);
            }
        } else if (activity.type === kmodel.Config.NODE_TYPE_SUBPROCESS) {
            activityTypeElement.setAttribute("subId", activity.subId);
        }
        return activityTypeElement;
    }

    mxfile.getActivityTypeObject = function (activity, activityTypeElement) {
        activity.type = activityTypeElement.getAttribute("type");
        if (activity.type === kmodel.Config.NODE_TYPE_START
            || activity.type === kmodel.Config.NODE_TYPE_END
            || activity.type === kmodel.Config.NODE_TYPE_INTERMEDIATE) {
            activity.trigger = activityTypeElement.getAttribute("trigger");
            if (activity.trigger === "Timer") {
                activity.expression = activityTypeElement.getAttribute("expression");
            }
        } else if (activity.type === kmodel.Config.NODE_TYPE_MULTIPLEINSTANCE) {
            activity.complexType = activityTypeElement.getAttribute("complexType");
            activity.mergeType = activityTypeElement.getAttribute("mergeType");
            activity.compareType = activityTypeElement.getAttribute("compareType");
            activity.completeOrder = activityTypeElement.getAttribute("completeOrder");
        } else if (activity.type === kmodel.Config.NODE_TYPE_GATEWAY) {
            activity.gatewaySplitJoinType = activityTypeElement.getAttribute("gatewaySplitJoinType");
            activity.gatewayDirection = activityTypeElement.getAttribute("gatewayDirection");
            if (activity.gatewayDirection === gatewayproperty.Direction.EOrJoin) {
                activity.gatewayJoinPass = activityTypeElement.getAttribute("gatewayJoinPass");
            }
        } else if (activity.type === kmodel.Config.NODE_TYPE_SUBPROCESS) {
            activity.subId = activityTypeElement.getAttribute("subId");
        } 
        return activity;
    }

    mxfile.setPerformersElement = function (doc, performers) {
        var performersElement = doc.createElement("Performers");
        var performerElement = null;

        for (var i = 0; i < performers.length; i++) {
            //convert performer to performerNode
            performerElement = mxfile.setPerformerElement(doc, performers[i]);
            performersElement.appendChild(performerElement);
        }
        return performersElement;
    }

    mxfile.setPerformerElement = function (doc, performer) {
        var performerElement = doc.createElement("Performer");
        performerElement.setAttribute("id", performer.id);

        return performerElement;
    }

    mxfile.getPerformerObject = function (performerElement) {
        var performer = {};
        performer.id = performerElement.getAttribute("id");

        return performer;
    }

    //actions
    mxfile.setActionsElement = function (doc, actions) {
        var actionsElement = doc.createElement("Actions");
        var actionElement = null;

        for (var i = 0; i < actions.length; i++) {
            //convert action to actionElement
            actionElement = mxfile.setActionElement(doc, actions[i]);
            actionsElement.appendChild(actionElement);
        }
        return actionsElement;
    }

    mxfile.setActionElement = function (doc, action) {
        var actionElement = doc.createElement("Action");
        actionElement.setAttribute("type", action.type);
        actionElement.setAttribute("fire", action.fire);

        var actionType = action.type;
        if (actionType === kmodel.Config.ACTION_TYPE_EVENT) {
            actionElement.setAttribute("fire", action.fire);
            actionElement.setAttribute("method", action.method);
            actionElement.setAttribute("arguments", action.arguments);
            actionElement.setAttribute("expression", action.expression);

            //sub method
            var methodType = action.method;
            if (methodType === kmodel.Config.ACTION_METHOD_TYPE_WEBAPI) {
                actionElement.setAttribute("subMethod", action.subMethod);
            }
        }
        else {
            //window.console.log(action);
            //throw "Unkown Action Type: " + actionType;
        }
        return actionElement;
    }

    mxfile.setActionElementByHTML = function (actionElement, action) {
        actionElement.setAttribute("type", action.getAttribute("type"));
        var actionType = action.getAttribute("type");
        if (actionType === kmodel.Config.ACTION_TYPE_EVENT) {
            actionElement.setAttribute("fire", action.getAttribute("fire"));
            actionElement.setAttribute("method", action.getAttribute("method"));
            actionElement.setAttribute("arguments", action.getAttribute("arguments"));
            actionElement.setAttribute("expression", action.getAttribute("expression"));

            //sub method
            var methodType = action.getAttribute("method");
            if (methodType === kmodel.Config.ACTION_METHOD_TYPE_WEBAPI) {
                actionElement.setAttribute("subMethod", action.getAttribute("subMethod"));
            }
        }
        else {
             //throw "Unkown Action Type: " + actionType;
        }
        return actionElement;
    }

    mxfile.getActionObject = function (actionElement) {
        var action = {};
        action.type = actionElement.getAttribute("type");
        if (action.type === kmodel.Config.ACTION_TYPE_EVENT) {
            var methodType = actionElement.getAttribute("method");
            action.fire = actionElement.getAttribute("fire");
            action.method = actionElement.getAttribute("method");
            action.arguments = actionElement.getAttribute("arguments");
            action.expression = actionElement.getAttribute("expression");

            if (methodType === kmodel.Config.ACTION_METHOD_TYPE_WEBAPI) {
                action.subMethod = actionElement.getAttribute("subMethod");
            }
        }
        else {
            //window.console.log(actionElement);
             //throw "Unkown Action Type: " + actionType;
        }
        return action;
    }

    //boundaries
    mxfile.setBoundariesElement = function (doc, boundaries) {
        var boundariesElement = doc.createElement("Boundaries");

        for (var i = 0; i < boundaries.length; i++) {
            //convert boundary to boundaryElement
            var boundaryElement = doc.createElement("Boundary");
            boundaryElement = mxfile.setBoundaryElement(boundaryElement, boundaries[i]);
            boundariesElement.appendChild(boundaryElement);
        }
        return boundariesElement;
    }

    mxfile.setBoundaryElement = function (boundaryElement, boundary) {
        boundaryElement.setAttribute("event", boundary.event);
        boundaryElement.setAttribute("expression", boundary.expression);

        return boundaryElement;
    }

    mxfile.getBoundaryObject = function (boundaryElement) {
        var boundary = {};
        boundary.event = boundaryElement.getAttribute("event");
        boundary.expression = boundaryElement.getAttribute("expression");

        return boundary;
    }

    //sections
    mxfile.setSectionsElement = function (doc, sections) {
        var sectionsElement = doc.createElement("Sections");

        for (var i = 0; i < sections.length; i++) {
            //convert section to sectionElement
            var sectionElement = doc.createElement("Section");
            sectionElement = mxfile.setSectionElement(sectionElement, sections[i]);
            sectionsElement.appendChild(sectionElement);
        }
        return sectionsElement;
    }

    mxfile.setSectionElement = function (sectionElement, section) {
        sectionElement.setAttribute("name", section.name);

        var sectionText = sectionElement.ownerDocument.createTextNode($.trim(section.text));
        sectionElement.appendChild(sectionText);    

        return sectionElement;
    }

    mxfile.getSectionObject = function (sectionElement) {
        var section = {};
        section.name = sectionElement.getAttribute("name");
        section.text = jshelper.replaceHTMLTags(sectionElement.textContent);

        return section;
    }

    //transitions
    mxfile.setTransitionElement = function (doc, transition) {
        var transitionElement = doc.createElement('Transition');
        transitionElement.setAttribute('from', transition.from);
        transitionElement.setAttribute('to', transition.to);

        //description
        var descElement = doc.createElement('Description');
        transitionElement.appendChild(descElement);

        var description = doc.createTextNode(transition.description);
        descElement.appendChild(description);

        //set edge text
        transitionElement.setAttribute("label", transition.description);

        return transitionElement;
    }

    mxfile.getTransitionObject = function (transitionElement) {
        var transition = {};
        transition.id = transitionElement.getAttribute("id");
        transition.from = transitionElement.getAttribute("from");
        transition.to = transitionElement.getAttribute("to");

        return transition;
    }

    mxfile.setConditionElement = function (doc, condition) {
        var conditionElement = doc.createElement('Condition');
        conditionElement.setAttribute('type', condition.type);

        var conditionTextElement = doc.createElement('ConditionText');
        conditionElement.appendChild(conditionTextElement);

        var expression = doc.createTextNode($.trim(condition.text));
        conditionTextElement.appendChild(expression);    

        return conditionElement;
    }

    mxfile.getConditionObject = function (conditionElement) {
        var condition = {};

        if (conditionElement) {
            condition.type = conditionElement.getAttribute("type");

            var conditionTextElement = conditionElement.getElementsByTagName("ConditionText")[0];
            if (conditionTextElement) condition.text = jshelper.replaceHTMLTags(conditionElement.textContent);
        }
        return condition;
    }

    mxfile.setGroupBehavioursElement = function (doc, groupBehaviours) {
        var groupBehavioursElement = doc.createElement("GroupBehaviours");
        groupBehavioursElement.setAttribute("priority", groupBehaviours.priority);
        groupBehavioursElement.setAttribute("forced", groupBehaviours.forced);

        return groupBehavioursElement;
    }

    mxfile.getGroupBehavioursObject = function (groupBehavioursElement) {
        var groupBehaviours = {};
        if (groupBehavioursElement) {
            var priority = groupBehavioursElement.getAttribute("priority");
            if (priority !== undefined) {
                groupBehaviours.priority = priority;
            }
            var forced = groupBehavioursElement.getAttribute("forced");
            if (forced !== undefined) {
                groupBehaviours.forced = forced;
            }
        }
        return groupBehaviours;
    }

    mxfile.setReceiverElement = function (doc, receiver) {
        var receiverElement = doc.createElement("Receiver");
        receiverElement.setAttribute('type', receiver.type);

        return receiverElement;
    }

    mxfile.getReceiverObject = function (receiverElement) {
        var receiver = {};

        if (receiverElement) {
            var receiverType = receiverElement.getAttribute("type");
            if (receiverType !== undefined) {
                receiver.type = receiverType;
            }
        }
        return receiver;
    }

    mxfile.getGeographyEdgeObject = function (geographyElement) {
        var geography = {};
        geography.parent = geographyElement.getAttribute("parent");
        geography.style = geographyElement.getAttribute("style");

        var pointsElement = geographyElement.getElementsByTagName("Points")[0];
        if (pointsElement) {
            var points = [];
            Array.prototype.forEach.call(pointsElement.getElementsByTagName("Point"), function (pointElement) {
                var point = getPointObject(pointElement);
                points.push(point);
            });
            geography.points = points;
        }
        return geography;
    }

    function getPointObject(pointElement) {
        var x = pointElement.getAttribute("x");
        var y = pointElement.getAttribute("y");
        var point = new mxPoint(parseInt(x), parseInt(y));
        return point;
    }

    mxfile.getGeographyVertexObject = function (geographyElement) {
        var geography = {};
        geography.parent = geographyElement.getAttribute("parent");
        geography.style = geographyElement.getAttribute("style");

        var widgetElement = geographyElement.getElementsByTagName("Widget")[0];
        if (widgetElement) {
            geography.widget = mxfile.getWidgetVertexObject(widgetElement);
        }
        return geography;
    }

    mxfile.getWidgetVertexObject = function (widgetElement) {
        var widget = {};
        widget.left = parseInt(widgetElement.getAttribute("left"));
        widget.top = parseInt(widgetElement.getAttribute("top"));
        widget.width = parseInt(widgetElement.getAttribute("width"));
        widget.height = parseInt(widgetElement.getAttribute("height"));

        return widget;
    }

    mxfile.getParticipantObject = function (participantElement) {
        var participant = {};

        participant.type = participantElement.getAttribute("type");
        participant.id = participantElement.getAttribute("id");
        participant.name = participantElement.getAttribute("name");
        participant.code = participantElement.getAttribute("code");
        participant.outerId = participantElement.getAttribute("outerId");

        return participant;
    }

    mxfile.setParticipantElement = function (doc, participant) {
        var participantElement = doc.createElement("Participant");
        participantElement.setAttribute('type', participant.type);
        participantElement.setAttribute('id', participant.id);
        participantElement.setAttribute('name', participant.name);
        participantElement.setAttribute('code', participant.code);
        participantElement.setAttribute('outerId', participant.outerId);

        return participantElement;
    }

    mxfile.getSwimlaneObject = function (swimlaneElement) {
        var swimlane = {};
        swimlane.id = swimlaneElement.getAttribute("id");
        swimlane.name = swimlaneElement.getAttribute("name");

        return swimlane;
    }

    mxfile.getGeographySwimlaneObject = function (geographyElement) {
        var geography = {};
        geography.parent = geographyElement.getAttribute("parent");
        geography.style = geographyElement.getAttribute("style");

        var widgetElement = geographyElement.getElementsByTagName("Widget")[0];
        if (widgetElement) {
            var widget = {};
            widget.left = parseInt(widgetElement.getAttribute("left"));
            widget.top = parseInt(widgetElement.getAttribute("top"));
            widget.width = parseInt(widgetElement.getAttribute("width"));
            widget.height = parseInt(widgetElement.getAttribute("height"));
            geography.widget = widget;
        }
        return geography;
    }

    mxfile.getGroupObject = function (groupElement) {
        var group = {};
        group.id = groupElement.getAttribute("id");
        group.name = groupElement.getAttribute("name");

        return group;
    }

    mxfile.getGeographyGroupObject = function (geographyElement) {
        var geography = {};
        geography.parent = geographyElement.getAttribute("parent");
        geography.style = geographyElement.getAttribute("style");

        var widgetElement = geographyElement.getElementsByTagName("Widget")[0];
        if (widgetElement) {
            var widget = {};
            widget.left = parseInt(widgetElement.getAttribute("left"));
            widget.top = parseInt(widgetElement.getAttribute("top"));
            widget.width = parseInt(widgetElement.getAttribute("width"));
            widget.height = parseInt(widgetElement.getAttribute("height"));
            geography.widget = widget;
        }
        return geography;
    }

    return mxfile;
})()