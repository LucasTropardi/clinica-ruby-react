class Doctor < ApplicationRecord
  validates :name, :specialty, :crm, :available_days, presence: true
  validates :crm, uniqueness: true

  has_many :appointments

  def available_days
    (read_attribute(:available_days) || "").split(',')
  end

  def available_days=(days)
    write_attribute(:available_days, days.is_a?(Array) ? days.join(',') : days)
  end
end
