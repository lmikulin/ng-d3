import { Component, OnInit } from '@angular/core';
import { Resource } from '../../classes/resource';
import { Task } from '../../classes/task';
import { ActivatedRoute } from '@angular/router';

import * as d3 from 'd3';

const RESOURCE_PADDING = 8;

const COL_WIDTH = 40;
const DOW = ["S","M","T","W","R","F","S"];

const TASK_HEIGHT = 12;
const TASK_PADDING = 2;
const DRAG_BAR_WIDTH = 4;

const DAY_WIDTH = 38;

@Component({
  selector: 'app-resource-grid',
  templateUrl: './resource-grid.component.html',
  styleUrls: ['./resource-grid.component.css']
})
export class ResourceGridComponent implements OnInit {

  private year: number;
  private month: number;
  private day: number;
  private dataset= [];

  private resources = [];
  private tasks = [];
  private assignments = [];

  private numTasks: number;
  private numResources: number;

  constructor(private route: ActivatedRoute) {
    let now = new Date();
    this.year = now.getFullYear();
    this.month = now.getMonth();
    this.day = now.getDate();

    this.numTasks = this.route.snapshot.params['tasks'];
    this.numResources = this.route.snapshot.params['resources'];
  }

  ngOnInit() {
    this.createTopRow();

    // create all the data
    this.tasks = this.getTasks(this.numTasks);
    this.resources = this.getResources(this.numResources);
    this.assignments = this.getAssignments(this.tasks, this.resources);

    this.createLeftCol();
    this.addSvgGrid();
    this.addAssignedTasks();
  }

  getResources(numResources) {
    let resources = [];
    for (let i=0; i < numResources; i++) {
      resources.push(new Resource(i));
    }
    return resources;
  }

  getTasks(numTasks) {
    let tasks = [];
    for (let i=0; i < numTasks; i++) {
      tasks.push(new Task());
    }
    return tasks;
  }

  getAssignments(tasks, resources) {
    let assignments = {};
    let assArray = [];
    // assign all the tasks to available resources
    for(let i=0; i < this.numTasks; i++) {
      // pick a random resource
      let resourceIndex = Math.round(Math.random() * this.numResources);
      resourceIndex = resourceIndex == this.numResources ? this.numResources - 1 : resourceIndex;
      if (!assignments[resourceIndex.toString()]) {
        let newItem = {
          resource: resources[resourceIndex],
          tasks: []
        };
        assignments[resourceIndex.toString()] = newItem;
        assArray.push(newItem);
      }
      assignments[resourceIndex.toString()].tasks.push(tasks[i]);
    }
    return assArray;
  }

  createTopRow() {
    let startDate = new Date(this.year, this.month, 1);
    let endDate = new Date(this.year, this.month + 1, 0);
    let lastDay = endDate.getDate();
    let dow = startDate.getDay();

    let topRow = d3.select("#weeksrow");
    for (let i=1; i<= lastDay; i++) {
        dow += (i -1);
        topRow.append("div")
          .style("display", "inline-block")
          .style("font-weight", "normal")
          .style("width", `${DAY_WIDTH}px`)
          .style("text-align", "center")
          .html(`${this.month +1}/${i}<br/>${DOW[dow%7]}`);
    }
  }

  createLeftCol() {
    console.log("resources", this.resources);
    console.log("tasks", this.tasks);
    console.log("assignments", this.assignments);
    let resourcesByRole = d3.nest()
      .key(function(resource) {return resource.role})
      .entries(this.resources);

    console.log("resources by role", resourcesByRole);

    let leftCol = d3.select("#resources");
    let resourceCols = leftCol.selectAll("tr")
      .data(this.resources)
      .enter()
      .append("tr");

    resourceCols.append("td")
      .style("border", "1px solid steelblue")
      .style("width", "180px")
      .style("height", (item, index) => `${TASK_PADDING + (this.assignments[index] ? this.assignments[index].tasks.length : 0) * (TASK_HEIGHT + TASK_PADDING)}px`)
      .text(function(item, index) {return item.name});

    resourceCols.append("td")
      .attr("id", function(item, index) {return item.name.replace(/[\s\.\']/g,"");})
      .style("position", "relative")
      .style("border", "1px solid steelblue");

  }

  addSvgGrid() {
    let svg = d3.select("#resources").select("td:nth-child(2)").append("svg");
    svg.style("position", "absolute")
      .style("left", 0)
      .style("top", 0)
      .style("z-index", 1)
      .attr("height", this.numTasks * (TASK_HEIGHT + TASK_PADDING) + this.numResources * RESOURCE_PADDING)
      .attr("width", 1600)
      .attr("id", "grid");
  }

  addAssignedTasks() {
    this.assignments.forEach((ass, assIndex) => {
      ass.tasks.forEach((task, taskIndex) => {
        this.addRectangle(assIndex, taskIndex);
      });
    });
  }

  addRectangle(assignmentIndex, taskIndex) {
    let svg = d3.select("svg");

    var newg = svg.append("g").data([{
        assignmentIndex: assignmentIndex,
        taskIndex: taskIndex,
        x: this.xFromAssignedTask(assignmentIndex, taskIndex),
        y: this.yFromAssignedTask(assignmentIndex, taskIndex),
        width: this.widthFromAssignedTask(assignmentIndex, taskIndex)}]);

    var dragrect = newg.append("rect")
          .attr("class", "taskbar")
          .attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; })
          .attr("height", TASK_HEIGHT)
          .attr("width", function(d) { return d.width; })
          .attr("fill-opacity", .5)
          .attr("cursor", "move")
          .call(d3.drag().on("drag", dragMove));

    var dragbarleft = newg.append("rect")
          .attr("x", function(d) { return d.x - (DRAG_BAR_WIDTH/2); })
          .attr("y", function(d) { return d.y + (DRAG_BAR_WIDTH/2); })
          .attr("height", TASK_HEIGHT - DRAG_BAR_WIDTH)
          .attr("class", "dragleft")
          .attr("width", DRAG_BAR_WIDTH)
          .attr("fill", "lightblue")
          .attr("fill-opacity", .5)
          .attr("cursor", "ew-resize")
          .call(d3.drag().on("drag", resizeLeft));

    var dragbarright = newg.append("rect")
          .attr("x", function(d) { return d.x + d.width - (DRAG_BAR_WIDTH/2); })
          .attr("y", function(d) { return d.y + (DRAG_BAR_WIDTH/2); })
          .attr("class", "dragright")
          .attr("height", TASK_HEIGHT - DRAG_BAR_WIDTH)
          .attr("width", DRAG_BAR_WIDTH)
          .attr("fill", "lightblue")
          .attr("fill-opacity", .5)
          .attr("cursor", "ew-resize")
          .call(d3.drag().on("drag", resizeRight));

  }

  // map task data to x and width coordinates
  xFromStartDay(startDay) {
    return (startDay - 1) * DAY_WIDTH;
  }
  widthFromHours(hours) {
    return Math.ceil(hours/24) * DAY_WIDTH;
  }

  xFromAssignedTask(assignmentIndex, taskIndex) {
    return (this.assignments[assignmentIndex].tasks[taskIndex].startDay - 1) * DAY_WIDTH;
  }

  widthFromAssignedTask(assignmentIndex, taskIndex) {
    return Math.ceil(this.assignments[assignmentIndex].tasks[taskIndex].hours/24) * DAY_WIDTH;
  }

  // map assignment data to y coordinate
  yFromAssignedTask(assignmentIndex, taskIndex) {
    let offset = TASK_PADDING;
    for(let i=0; i < assignmentIndex; i++) {
      offset += (TASK_PADDING + TASK_HEIGHT) * this.assignments[i].tasks.length + RESOURCE_PADDING;
    }
    offset += (TASK_PADDING + TASK_HEIGHT) * taskIndex;
    return offset;
  }
}

function dragMove(item) {
  let task = d3.select(this);
  task.attr("x", item.x = Math.max(0, d3.event.x))
    .attr("y", item.y = Math.max(0, d3.event.y));

  let group = d3.select(task.node().parentNode);

  group.select(".dragright")
    .attr("x", function(d) { return item.x + item.width - (DRAG_BAR_WIDTH/2); })
    .attr("y", function(d) { return item.y + (DRAG_BAR_WIDTH/2); });

  group.select(".dragleft")
    .attr("x", function(d) { return d.x - (DRAG_BAR_WIDTH/2); })
    .attr("y", function(d) { return d.y + (DRAG_BAR_WIDTH/2); });
}

function resizeLeft(item) {
  let oldx = item.x;
  let dragBarLeft = d3.select(this);
  let group = d3.select(dragBarLeft.node().parentNode);
  let taskBar = group.select(".taskbar");

  //Max x on the right is x + TASK_WIDTH - DRAG_BAR_WIDTH
  //Max x on the left is 0 - (DRAG_BAR_WIDTH/2)
  item.x = Math.max(0, Math.min(item.x + (item.width / 2), d3.event.x));
  item.width = item.width + (oldx - item.x);

  dragBarLeft.attr("x", function(d) { return d.x - (DRAG_BAR_WIDTH / 2); });
  taskBar.attr("x", function(d) { return d.x; }).attr("width", item.width);
}

function resizeRight(item) {
  let dragBarRight = d3.select(this);
  let group = d3.select(dragBarRight.node().parentNode);
  let taskBar = group.select(".taskbar");

  //Max x on the left is x - TASK_WIDTH
  //Max x on the right is width of screen + (DRAG_BAR_WIDTH/2)
  let dragx = Math.max(item.x + (DRAG_BAR_WIDTH/2), item.x + item.width + d3.event.dx);

  //recalculate width
  item.width = dragx - item.x;

  //move the right drag handle
  dragBarRight.attr("x", function(d) { return dragx - (DRAG_BAR_WIDTH/2) });

  //resize the drag rectangle
  //as we are only resizing from the right, the x coordinate does not need to change
  taskBar.attr("width", item.width);
}
