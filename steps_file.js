
'use strict';
// in this file you can append custom step methods to 'I' object

module.exports = function() {
  return actor({

    // returns id of focused element
    async grabFocusedElementId() {
      return await this.executeScript('return document.activeElement.name');
    }

  });

}
