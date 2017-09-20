'use strict'

const Schema = use('Schema')

class UrlpairsTableSchema extends Schema {

  up () {
    this.create('urlpairs', (table) => {
      table.increments()
      table.timestamps()

      table.string('original_url');
      table.string('short_url');
      table.bigInteger('hit_count')
;
    })
  }

  down () {
    this.drop('urlpairs')
  }

}

module.exports = UrlpairsTableSchema
