class CreateContentBuckets < ActiveRecord::Migration
  def change
    create_table :content_buckets do |t|

      t.timestamps
    end
  end
end
