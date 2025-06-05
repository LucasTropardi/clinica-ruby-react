class CreateAppointments < ActiveRecord::Migration[8.0]
  def change
    create_table :appointments do |t|
      t.references :doctor, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.date :date
      t.string :time
      t.string :status

      t.timestamps
    end
  end
end
