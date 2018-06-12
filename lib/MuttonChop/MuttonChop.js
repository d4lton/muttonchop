#!/usr/bin/env node

const fs = require('fs');
const syncrequest = require('sync-request');

var MuttonChop = function(template) {
  this.template = template;
}

MuttonChop.prototype.retrieveItems = function() {
  this.data.metadata.item_data = {};
  for (var i = 0; i < this.data.metadata.items; i++) {
    var itemId = 'item' + (i + 1);
    var skuIndex = Math.floor(Math.random() * this.data.metadata.item_set.length);
    var sku = this.data.metadata.item_set[skuIndex];
    var url = 'http://lxprtsapi01.nanigans.com:8080/product-feed/sku?app_id=' + this.data.metadata.app_id + '&feed_id=' + this.data.metadata.feed_id + '&sku=' + sku;
    var response = syncrequest('GET', url);
    var json = response.body.toString();
    if (json) {
      this.data.metadata.item_data[itemId] = JSON.parse(json);
    }
  }
}

MuttonChop.prototype.extractMetadata = function() {
  this.data.metadata = null;
  var regex = /<!--([\s\S]+?)-->/mig;
  if (match = regex.exec(this.template)) {
    this.template = this.template.replace(match[0], '');
    this.data.metadata = JSON.parse(match[1].trim());
    this.retrieveItems();
  }
}

MuttonChop.prototype.replaceRtbTokens = function(html) {
  var match = null, regex = /{{([\s\S]+?)}}/mig;
  while (match = regex.exec(html)) {
    var parts = match[1].split(' ').map(function(it) {return it.trim().replace(/\"/g, '');});
    if (parts.length > 2) {
      var itemId = parts[1];
      var columnId = parts[2];
      var itemData = this.data.metadata.item_data[itemId];
        if (itemData && itemData.data) {
          replacement = itemData.data.columns[columnId][0];
          html = html.replace(match[0], replacement);
      }
    }

  }
  return html;
}

MuttonChop.prototype.add = function(html) {
  if (typeof html === 'string') {
    var htmlLines = html.split('\n');
    htmlLines.filter(function(it) {return it;}).forEach(function(htmlLine, index) {
      if (this.data.metadata) {
        htmlLine = this.replaceRtbTokens(htmlLine);
      }
      if (htmlLine.length > 0) {
        this.code += 'html += "' + htmlLine.replace(/"/g, '\\"') + '";\n';
      }
      if (index !== htmlLines.length - 1) {
        this.code += 'html += "\\n";\n';
      }
    }.bind(this));
  }
}

MuttonChop.prototype.print = function(key) {
  this.code += 'html += ' + key + ';\n';
}

MuttonChop.prototype.addDebug = function(message, relative) {
  if (!this.data.debug) { return; }
  var position = relative ? 'relative' : 'absolute';
  var styles = "font-family:monospace;color:slategray;font-size:12px;position:" + position + ";right:0;pointer-events:none;";
  message = '<p style="' + styles + '">' + message + '</p>';
  this.code += 'html += "' + message.replace(/"/g, '\\"') + '";\n';
}

MuttonChop.prototype.import = function(path) {
  var template = fs.readFileSync(path).toString();
  this.addDebug("<< import('" + path + "'); >>");
  this.processTemplate(template, this.data);
}

MuttonChop.prototype.evaluate = function(js) {
  var match = js.trim().match(/^(print|import)\((.+?)\)/);
  if (match) {
    switch (match[1].trim()) {
      case 'print':
        this.print(match[2].trim());
        break;
      case 'import':
        var parts = match[2].replace(/['"]/g, '').split(',');
        this.import(parts[0]);
        break;
    }
  } else {
    if (js.indexOf('{') !== -1) { this.addDebug(js, true); }
    this.code += js + '\n';
    if (js.indexOf('}') !== -1) { this.addDebug(js, true); }
  }
}

MuttonChop.prototype.processTemplate = function(template, data) {
  var regex = /<<(.+?)>>/g, pos = 0, match;
  while (match = regex.exec(template)) {
    this.add(template.slice(pos, match.index));
    this.evaluate(match[1]);
    pos = match.index + match[0].length;
  }
  this.add(template.substr(pos, template.length - pos));
}

MuttonChop.prototype.render = function(data) {
  this.data = data;
  this.extractMetadata();
  this.code = '';
  this.code += 'var data = ' + JSON.stringify(data) + ';\n';
  this.code += 'var html = "";\n';
  this.processTemplate(this.template, data);
  this.code += 'return html;\n';
  return new Function(this.code).apply(this);
}

module.exports = MuttonChop;
