class CreateDoctors < ActiveRecord::Migration[8.0]
  def change
    create_table :doctors do |t|
      t.string :name
      t.string :specialty
      t.string :crm
      t.string :available_days

      t.timestamps
    end
    add_index :doctors, :crm, unique: true
  end
end
