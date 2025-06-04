class ChangeAvailableDaysToTextInDoctors < ActiveRecord::Migration[8.0]
  def change
    change_column :doctors, :available_days, :text
  end
end
