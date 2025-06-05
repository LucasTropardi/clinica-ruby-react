class Appointment < ApplicationRecord
  belongs_to :doctor
  belongs_to :user

  VALID_TIMES = %w[
    08:00 08:30 09:00 09:30 10:00 10:30 11:00 11:30
    14:00 14:30 15:00 15:30 16:00 16:30 17:00 17:30
  ].freeze

  validates :date, :time, :status, presence: true
  validates :time, inclusion: { in: VALID_TIMES }

  validate :date_cannot_be_in_the_past
  validate :no_double_booking

  private

  def date_cannot_be_in_the_past
    if date.present? && date < Date.today
      errors.add(:date, "can't be in the past")
    end
  end

  def no_double_booking
    if Appointment.exists?(doctor: doctor, date: date, time: time, status: 'active')
      errors.add(:base, "Doctor already has an appointment at this time")
    end

    if Appointment.exists?(user: user, date: date, time: time, status: 'active')
      errors.add(:base, "You already have an appointment at this time")
    end
  end
end
