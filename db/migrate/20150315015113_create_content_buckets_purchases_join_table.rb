class CreateContentBucketsPurchasesJoinTable < ActiveRecord::Migration
  def change
    create_table :content_buckets_purchases, id: false do |t|
      t.integer :content_bucket_id
      t.integer :purchase_id
    end

    add_index :content_buckets_purchases, :content_bucket_id
    add_index :content_buckets_purchases, :purchase_id
  end
end
