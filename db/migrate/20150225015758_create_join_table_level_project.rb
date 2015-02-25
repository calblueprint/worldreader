class CreateJoinTableLevelProject < ActiveRecord::Migration
  def change
    create_join_table :levels, :projects do |t|
      t.index [:level_id, :project_id]
      t.index [:project_id, :level_id]
    end
  end
end
