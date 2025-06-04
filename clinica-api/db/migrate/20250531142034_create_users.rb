class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :full_name
      t.string :email
      t.string :password_digest
      t.string :cellphone
      t.string :address
      t.string :nationality
      t.string :document
      t.integer :role

      t.timestamps
    end
    add_index :users, :email, unique: true
  end
end
