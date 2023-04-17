'use strict';

// THIS IS THE STRETCH GOAL ...
// It takes in a schema in the constructor and uses that instead of every collection
// being the same and requiring their own schema. That's not very DRY!

class DataCollection {

  constructor(model) {
    this.model = model;
  }

  async read(id, options) {
    try {
      if (id) {
        return await this.model.findOne({ where: {id:id}, ...options});
      } else {
        return await this.model.findAll(options);
      }
    } catch (e) {
      console.log('COLLECTION CLASS READ ERROR', e);
    }
  }

  async create(data) {
    try {
      return await this.model.create(data);
    } catch(e) {
      console.log('COLLECTION CREATE ERROR', e);
    }
  }

  async update(id, data) {
    try {
      let updatedRecord = await this.model.update(
        data,
        {
          where: { id: id }
        });
      return updatedRecord;
    } catch (e) {
      console.log('COLLECTION UPDATE ERROR', e);
    }
  }

  async delete(id) {
    try {
      let number = await this.model.destroy({
        where: {
          id: id,
        }
      });
      return number;
    } catch(e) {
      console.log('COLLECTION DELETE ERROR: ', e);
    }
  }
}


module.exports = DataCollection;
